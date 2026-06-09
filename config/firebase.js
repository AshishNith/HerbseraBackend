const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    console.log('--- FIREBASE PRIVATE KEY DIAGNOSTICS ---');
    console.log('Key exists:', !!key);
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    if (key) {
      console.log('Key length:', key.length);
      console.log('First 15 chars:', JSON.stringify(key.slice(0, 15)));
      console.log('Last 15 chars:', JSON.stringify(key.slice(-15)));
      console.log('Contains BEGIN header:', key.includes('-----BEGIN PRIVATE KEY-----'));
      const rawDecoded = (!key.includes('-----BEGIN PRIVATE KEY-----')) 
        ? Buffer.from(key.replace(/^"+|"+$/g, '').trim(), 'base64').toString('utf8')
        : key;
      const parsed = rawDecoded.replace(/\\n/g, '\n');
      console.log('Parsed length:', parsed.length);
      console.log('Parsed first 30 chars:', JSON.stringify(parsed.slice(0, 30)));
      
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(parsed).digest('hex');
      console.log('Parsed Key SHA256 Hash:', hash);
      
      const lines = parsed.split('\n');
      console.log('Parsed line count:', lines.length);
      lines.forEach((line, idx) => {
        console.log(`Line ${idx + 1}: length=${line.length}, startsWith=${JSON.stringify(line.slice(0, 5))}, endsWith=${JSON.stringify(line.slice(-5))}`);
      });
    }
    console.log('----------------------------------------');

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
