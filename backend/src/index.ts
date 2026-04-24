import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 30, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);
// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/expenses", expensesRouter);

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
