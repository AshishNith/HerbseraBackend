const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    const key = process.env.FIREBASE_PRIVATE_KEY;

    // Initialize with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (() => {
          if (!key) return undefined;
          const cleanKey = key.replace(/^"+|"+$/g, '').trim();
          const rawDecoded = (!cleanKey.includes('-----BEGIN PRIVATE KEY-----'))
            ? Buffer.from(cleanKey, 'base64').toString('utf8')
            : cleanKey;
          return rawDecoded.replace(/\\n/g, '\n');
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
