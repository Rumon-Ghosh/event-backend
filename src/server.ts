import mongoose from "mongoose";
import config from "./config";
import app from "./app";

async function main() {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is not provided in environment variables")
    }

    await mongoose.connect(config.database_url);
    console.log("MongoDB connected successful.");

    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

main()