const mongoose = require('mongoose');
const dns = require('dns');

const configuredDnsServers = (process.env.MONGODB_DNS_SERVERS || '')
  .split(',')
  .map(server => server.trim())
  .filter(Boolean);

if (configuredDnsServers.length) {
  dns.setServers(configuredDnsServers);
}

const inMemoryStore = {
  users: [],
  foods: [],
  slots: [],
  orders: [],
  feedbacks: [],
  notifications: [],
  favorites: [],
  combos: []
};

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI;

  if (!atlasUri) {
    throw new Error('[MongoDB Atlas Error]: MONGO_URI is missing. Set it to your MongoDB Atlas connection string.');
  }

  if (!atlasUri.startsWith('mongodb+srv://')) {
    throw new Error('[MongoDB Atlas Error]: MONGO_URI must be a MongoDB Atlas mongodb+srv:// connection string.');
  }

  try {
    console.log('[MongoDB Atlas]: Connecting using MONGO_URI...');
    const conn = await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    throw new Error(`[MongoDB Atlas Error]: Could not connect using MONGO_URI: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  isFallback: () => false,
  store: inMemoryStore
};
