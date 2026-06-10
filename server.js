require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { configureCloudinary } = require('./config/cloudinary');
const { errorHandler, notFound } = require('./middleware/error');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const filterRoutes = require('./routes/filterRoutes');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Initialize Firebase
initializeFirebase();

// Configure Cloudinary (optional, comment out if not using)
configureCloudinary();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://192.168.1.10:8080',
  'https://herbsera.in'
];
if (process.env.FRONTEND_URL) {
  const formattedUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(formattedUrl)) {
    allowedOrigins.push(formattedUrl);
  }
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const strippedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(strippedOrigin)) {
      return callback(null, true);
    }
    
    if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HerbsEra API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/filters', filterRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HerbsEra API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      cart: '/api/cart',
      reviews: '/api/reviews',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server proxy for Voice Concierge
const WebSocket = require('ws');
const url = require('url');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (clientWs, req) => {
  console.log('🔌 Client connected to Voice Concierge WebSocket proxy');

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('❌ GEMINI_API_KEY is not defined in backend environment!');
    clientWs.close(1011, 'GEMINI_API_KEY is not defined on server');
    return;
  }

  // Connect to Gemini Live API
  const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${geminiApiKey}`;
  const geminiWs = new WebSocket(geminiUrl);

  // Buffer messages from the client until Gemini WebSocket connection is OPEN
  const clientMessageQueue = [];

  geminiWs.on('open', () => {
    console.log('🔌 Connected to Gemini Live API');
    // Flush the queue
    while (clientMessageQueue.length > 0) {
      const msg = clientMessageQueue.shift();
      if (geminiWs.readyState === WebSocket.OPEN) {
        console.log(`[Proxy] Flushing queued client message. Length: ${msg.data.length || msg.data.byteLength}, isBinary: ${msg.isBinary}`);
        geminiWs.send(msg.data, { binary: msg.isBinary });
      }
    }
  });

  // Pipe client messages to Gemini
  clientWs.on('message', (message, isBinary) => {
    const isTxt = !isBinary;
    const dataToSend = isTxt && Buffer.isBuffer(message) ? message.toString('utf8') : message;
    
    console.log(`[Proxy] Client -> Gemini. isBinary: ${isBinary}, typeof message: ${typeof dataToSend}, length: ${dataToSend.length || dataToSend.byteLength}`);
    if (isTxt && typeof dataToSend === 'string' && dataToSend.length < 300) {
      console.log(`[Proxy] Client message payload: ${dataToSend}`);
    }

    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.send(dataToSend, { binary: isBinary });
    } else if (geminiWs.readyState === WebSocket.CONNECTING) {
      clientMessageQueue.push({ data: dataToSend, isBinary });
    } else {
      console.warn('⚠️ Discarded client message: Gemini WS is not OPEN/CONNECTING');
    }
  });

  // Pipe Gemini messages to client
  geminiWs.on('message', (message, isBinary) => {
    const isTxt = !isBinary;
    const dataToSend = isTxt && Buffer.isBuffer(message) ? message.toString('utf8') : message;

    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(dataToSend, { binary: isBinary });
    }
  });

  // Handle client close
  clientWs.on('close', (code, reason) => {
    console.log(`🔌 Client disconnected from proxy. Code: ${code}`);
    if (geminiWs.readyState === WebSocket.OPEN || geminiWs.readyState === WebSocket.CONNECTING) {
      geminiWs.close();
    }
  });

  // Handle Gemini close
  geminiWs.on('close', (code, reason) => {
    console.log(`🔌 Gemini disconnected. Code: ${code}`);
    if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
      clientWs.close();
    }
  });

  // Error handling
  clientWs.on('error', (err) => {
    console.error('❌ Client socket error:', err);
  });
  geminiWs.on('error', (err) => {
    console.error('❌ Gemini socket error:', err);
  });
});

// Handle WebSocket upgrade request
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/voice-concierge') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
