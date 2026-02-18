import mongoose from "mongoose";

export const connectDB = async () => {
	const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/tracking-service";

	try {
		await mongoose.connect(mongoUri);
		console.log(" MongoDB connected");
	} catch (err) {
		console.error(" MongoDB connection error:", err.message);
		process.exit(1);
	}
};
