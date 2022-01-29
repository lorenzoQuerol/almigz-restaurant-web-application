const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable inside next.config.js");

// Global variable so number of connections to server is reduced
let cached = global.mongoose;

// Initialize the cached variable for new connection
if (!cached) cached = global.mongoose = null;

export default async function createConnection() {
	// Return existing connection
	if (cached) {
		console.log(`[${new Date().toISOString()}] Existing connection to MongoDB server detected. Returning current connection...`);
		return cached;
	}

	// Create new connection
	if (!cached) {
		try {
			const opts = {
				bufferCommands: false,
			};

			cached = await mongoose.connect(MONGODB_URI, opts);
			console.log(`[${new Date().toISOString()}] Successfully connected to MongoDB Server!`);

			return cached;
		} catch (err) {
			throw new Error(`There was a problem connecting to MongoDB...\n${err}`);
		}
	}
}
