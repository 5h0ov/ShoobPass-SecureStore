import mongoose from "mongoose";

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      poolSize: 10,
    });
    console.log("Database connected successfully: ", cachedConnection.connection.host);
    return cachedConnection;
  } catch (error) {
    console.log("Error connecting to database: ", error.message);
    process.exit(1); // exit with failure
  }
}