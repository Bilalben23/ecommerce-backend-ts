import { connect } from "mongoose";

/**
 * Connect to MongoDB using Mongoose.
 */
export async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"

    try {
        await connect(MONGO_URI);
        console.log("🟢 MongoDB connected");
    } catch (error) {
        console.error("🔴 MongoDB connection failed:", error);
        process.exit(1);
    }
}