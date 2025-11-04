// api/index.ts
import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

// Import your route modules (adjust paths if yours differ)
import authRoutes from "../src/routes/auth";
import questionRoutes from "../src/routes/questions";
import answerRoutes from "../src/routes/answers";
import insightRoutes from "../src/routes/insights";

const app = express();
app.use(express.json());

// CORS allowing any origin (OK for demo; change for prod)
app.use((req, res, next) => {
  const origin = (req.headers.origin as string) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  // If you ever use cookies, set Access-Control-Allow-Credentials to "true" and use explicit origins
  res.setHeader("Access-Control-Allow-Credentials", "false");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Mount routers on /api/*
app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/insight", insightRoutes);

// ----------------- MongoDB connection reuse -----------------
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) console.error("MONGO_URI is missing in env!");

/**
 * Reuse the mongoose connection across lambda invocations.
 * Save the promise on global to avoid reconnecting each call.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<typeof mongoose> | undefined;
}

async function connectDB() {
  if (global._mongoClientPromise) {
    await global._mongoClientPromise;
    return;
  }
  global._mongoClientPromise = mongoose.connect(MONGO_URI, { /* you can add options */ }).then(() => mongoose);
  await global._mongoClientPromise;
}

// Handler that ensures DB connected before handling request
const handler = async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Internal server error" });
  }
};

export default serverless(handler as any);
