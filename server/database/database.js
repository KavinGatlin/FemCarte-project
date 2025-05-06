// server/database/database.js
import mongoose from "mongoose";

export const connectDB = async (uri) => {
  if (!uri) {
    console.error("❌ MONGO_URL is not defined!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: "Femcartel",         // make sure this matches your actual DB name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected to ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err);
  });
};
