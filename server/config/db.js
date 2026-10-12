const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-marketplace';
  
  try {
    // Attempt connecting to the provided or default URI with a fast timeout
    console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[DB] Successfully connected to MongoDB database.');
  } catch (err) {
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
