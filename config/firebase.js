const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    console.log('--- FIREBASE PRIVATE KEY DIAGNOSTICS ---');
    console.log('Key exists:', !!key);
    if (key) {
      console.log('Key length:', key.length);
      console.log('First 15 chars:', JSON.stringify(key.slice(0, 15)));
      console.log('Last 15 chars:', JSON.stringify(key.slice(-15)));
      console.log('Contains BEGIN header:', key.includes('-----BEGIN PRIVATE KEY-----'));
      const parsed = (!key.includes('-----BEGIN PRIVATE KEY-----')) 
        ? Buffer.from(key.replace(/^"+|"+$/g, '').trim(), 'base64').toString('utf8')
        : key.replace(/\\n/g, '\n');
      console.log('Parsed length:', parsed.length);
      console.log('Parsed first 30 chars:', JSON.stringify(parsed.slice(0, 30)));
    }
    console.log('----------------------------------------');

    // Initialize with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (() => {
          if (!key) return undefined;
          const cleanKey = key.replace(/^"+|"+$/g, '').trim();
          if (!cleanKey.includes('-----BEGIN PRIVATE KEY-----')) {
            return Buffer.from(cleanKey, 'base64').toString('utf8');
          }
          return cleanKey.replace(/\\n/g, '\n');
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
