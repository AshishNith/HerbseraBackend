const { admin } = require('../config/firebase');
const User = require('../models/User');

/**
 * Verify Firebase ID token and authenticate user
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user in database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        photoURL: decodedToken.picture,
        phoneNumber: decodedToken.phone_number,
      });
    }

    // Attach user info to request
    req.user = user;
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
};

/**
 * Optional authentication - continues even if not authenticated
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      req.user = user;
      req.firebaseUser = decodedToken;
    }
  } catch (error) {
    // Continue without authentication
    console.log('Optional auth failed, continuing without auth');
  }
  
  next();
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = {
  verifyFirebaseToken,
  optionalAuth,
  isAdmin,
};
