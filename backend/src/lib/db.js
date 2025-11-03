import mongoose from "mongoose";
import ENV from "./env.js";

export async function connectToDB() {
  try {
    if (!ENV.DB_URL) {
      throw new Error("'DB_URL' is not defined in environment variables!");
    }

    const mongooseInstance = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB:", mongooseInstance.connection.host);

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected!");
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    return mongooseInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}
