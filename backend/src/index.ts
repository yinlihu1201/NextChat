import express from "express";
import cors from "cors";
import { dataRouter } from "./routes/data.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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
