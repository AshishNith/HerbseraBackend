# HerbsEra Backend API

Complete Node.js backend API for HerbsEra - Herbal Products E-commerce platform.

## 🚀 Features

- **Firebase Authentication** - Secure user authentication using Firebase Auth
- **MongoDB Database** - Scalable NoSQL database for storing data
- **RESTful API** - Well-structured REST API endpoints
- **JWT Integration** - Additional token management support
- **Payment Integration** - Razorpay (India) and Stripe (International) support
- **Image Upload** - Cloudinary integration for product images
- **Email Notifications** - Nodemailer for transactional emails
- **Rate Limiting** - Protection against abuse
- **Error Handling** - Comprehensive error handling middleware
- **Validation** - Request validation using express-validator
- **Security** - Helmet.js for security headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Firebase Project (for authentication)
- Cloudinary account (optional, for image uploads)
- Razorpay/Stripe account (optional, for payments)

## 🛠️ Installation

1. **Clone and Navigate to Backend Directory**
   ```bash
   cd Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**

   Edit `.env` file with your credentials:

   ### MongoDB Configuration
   - For local MongoDB: `mongodb://localhost:27017/herbsera`
   - For MongoDB Atlas: Get connection string from your Atlas cluster

   ### Firebase Configuration
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Copy the values to your `.env` file:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_PRIVATE_KEY`
     - `FIREBASE_CLIENT_EMAIL`

   ### Cloudinary (Optional)
   - Sign up at https://cloudinary.com
   - Get credentials from Dashboard

   ### Payment Gateways (Optional)
   - **Razorpay**: Get from https://dashboard.razorpay.com
   - **Stripe**: Get from https://dashboard.stripe.com

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

6. **Run the Server**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Users
- `GET /api/users/profile` - Get user profile (Auth)
- `PUT /api/users/profile` - Update profile (Auth)
- `POST /api/users/addresses` - Add address (Auth)
- `PUT /api/users/addresses/:id` - Update address (Auth)
- `DELETE /api/users/addresses/:id` - Delete address (Auth)
- `POST /api/users/wishlist` - Add to wishlist (Auth)
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist (Auth)
- `GET /api/users` - Get all users (Admin)

### Orders
- `POST /api/orders` - Create order (Auth)
- `GET /api/orders/my-orders` - Get user orders (Auth)
- `GET /api/orders/:id` - Get order details (Auth)
- `PUT /api/orders/:id/cancel` - Cancel order (Auth)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user cart (Auth)
- `POST /api/cart` - Add to cart (Auth)
- `PUT /api/cart/:itemId` - Update cart item (Auth)
- `DELETE /api/cart/:itemId` - Remove from cart (Auth)
- `DELETE /api/cart` - Clear cart (Auth)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (Auth)
- `PUT /api/reviews/:id` - Update review (Auth)
- `DELETE /api/reviews/:id` - Delete review (Auth)
- `POST /api/reviews/:id/helpful` - Mark helpful (Auth)

## 🔐 Authentication

The API uses Firebase Authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Getting Firebase Token (Frontend)
```javascript
import { auth } from './firebase-config';

const token = await auth.currentUser.getIdToken();
```

## 📊 Database Models

### User
- Firebase UID, email, display name, photo URL
- Addresses array
- Wishlist (product references)
- Role (user/admin)

### Product
- Name, description, benefit
- Price, compare price
- Images array
- Category, ingredients
- Stock, SKU
- Ratings (average & count)

### Order
- User reference
- Order number
- Items array (products, quantity, price)
- Shipping address
- Payment info
- Pricing breakdown
- Status tracking

### Cart
- User reference
- Items array
- Total price (auto-calculated)

### Review
- Product & user references
- Rating (1-5)
- Comment
- Verified purchase flag
- Helpful count

## 🔧 Project Structure

```
Backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── firebase.js          # Firebase Admin SDK
│   └── cloudinary.js        # Cloudinary config
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── cartController.js
│   └── reviewController.js
├── middleware/
│   ├── auth.js              # Firebase authentication
│   ├── error.js             # Error handling
│   └── validation.js        # Request validation
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   └── Review.js
├── routes/
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   └── reviewRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── server.js                # Main entry point
└── README.md
```

## 🧪 Testing API

You can test the API using:

1. **Postman** - Import endpoints and test
2. **Thunder Client** (VS Code extension)
3. **cURL** commands

Example cURL request:
```bash
curl -X GET http://localhost:5000/api/products
```

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": []  // Optional validation errors
}
```

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- Firebase token verification
- MongoDB injection prevention
- XSS protection

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | No |
| PORT | Server port | No |
| MONGODB_URI | MongoDB connection string | Yes |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| FIREBASE_PRIVATE_KEY | Firebase private key | Yes |
| FIREBASE_CLIENT_EMAIL | Firebase client email | Yes |
| JWT_SECRET | JWT secret key | No |
| CLOUDINARY_* | Cloudinary credentials | No |
| RAZORPAY_* | Razorpay credentials | No |
| STRIPE_* | Stripe credentials | No |
| EMAIL_* | Email configuration | No |
| FRONTEND_URL | Frontend URL for CORS | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 👨‍💻 Support

For issues and questions, please create an issue in the repository.

---

**Made with ❤️ for HerbsEra**
