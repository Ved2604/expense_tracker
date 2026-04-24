import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import expensesRouter from "./routes/expenses";

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// Serve frontend static files
const FRONTEND_DIST = path.join(__dirname, "../../frontend/dist");
app.use(express.static(FRONTEND_DIST));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/expenses", expensesRouter);

// Catch-all: serve index.html for any non-API route
app.get("/{*path}", (req, res, next) => {
  if (req.path.startsWith("/expenses") || req.path === "/health") {
    return next();
  }
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
