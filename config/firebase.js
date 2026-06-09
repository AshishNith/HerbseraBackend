const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    // Initialize with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (() => {
          const key = process.env.FIREBASE_PRIVATE_KEY;
          if (!key) return undefined;
          if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
            return Buffer.from(key, 'base64').toString('utf8');
          }
          return key.replace(/\\n/g, '\n');
        })(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    process.exit(1);
  }
};

module.exports = { admin, initializeFirebase };
