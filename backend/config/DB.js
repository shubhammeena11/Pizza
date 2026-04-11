import mongoose from "mongoose";
import { DB_URL } from "./index.js";

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;