import express from "express";
import cors from "cors";
import { dataRouter } from "./routes/data.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - explicitly allow common headers to avoid preflight
const corsOptions = {
  origin: "*", // Allow all origins (adjust for production)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/data", dataRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[Backend] Server running on http://localhost:${PORT}`);
});

export default app;
