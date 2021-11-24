const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside next.config.js');

// Global variable so number of connections to server is reduced
let cached = global.mongoose;

// Initialize the cached variable for new connection
if (!cached) cached = global.mongoose = null;

async function createConnection() {
    // Return existing connection
    if (cached.connection) {
        console.log(
            `[${new Date().toISOString()}] Existing connection to MongoDB server detected. Returning current connection...`
        );
        return cached.connection;
    }

    // Create new connection
    if (!cached.promise) {
        try {
            const opts = {
                bufferCommands: false,
            };

            cached.connection = await mongoose.connect(MONGODB_URI, opts);
            console.log(`[${new Date().toISOString()}] Successfully connected to MongoDB Server!`);

            return cached.connection;
        } catch (err) {
            throw new Error(`There was a problem connecting to MongoDB...\n${err}`);
        }
    }
}

export default createConnection;
