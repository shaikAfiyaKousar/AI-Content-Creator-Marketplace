const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredUri = process.env.MONGODB_URI?.trim();
  const uri = configuredUri || 'mongodb://127.0.0.1:27017/ai-marketplace';
  
  try {
    // Attempt connecting to the provided or default URI with a fast timeout
    console.log('[DB] Attempting connection to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[DB] Successfully connected to MongoDB database.');
  } catch (err) {
    // A configured URI represents an explicit choice (often Atlas). Never hide a
    // bad URI or unavailable database by silently switching to ephemeral data.
    if (isProduction || configuredUri) {
      throw new Error(`Could not connect to MongoDB. Check MONGODB_URI and database network access. ${err.message}`);
    }
    console.warn(`[DB] Local or external MongoDB connection failed: ${err.message}`);
    console.log('[DB] Falling back to in-memory MongoMemoryServer for isolated and seamless local execution...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connected successfully to embedded in-memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[DB] Failed to start MongoMemoryServer:', memErr);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
