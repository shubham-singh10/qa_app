// src/config/db.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI not set");
  if (mongoose.connection.readyState === 1) return mongoose;

  if (global._mongoClientPromise) {
    await global._mongoClientPromise;
    return mongoose;
  }

  global._mongoClientPromise = mongoose.connect(MONGO_URI).then(() => mongoose);
  await global._mongoClientPromise;
  return mongoose;
}
