import mongoose from "mongoose";
import "dotenv/config";

/**
 * Connect to MongoDB using Mongoose.
 * Used by: app startup & seed scripts
 */
export async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"

    try {
        await mongoose.connect(MONGO_URI);
        console.log("🟢 MongoDB connected");
    } catch (error) {
        console.error("🔴 MongoDB connection failed:", error);
        process.exit(1);
    }
}


/**
 * Disconnect MongoDB
 * Mainly used by seed scripts
 */
export async function disconnectDB() {
    await mongoose.connection.close();
    console.log("🟡 MongoDB disconnected");
}   