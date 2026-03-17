import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { waterbodyRouter } from "./routes/waterbody.routes";
import { catchReportRouter } from "./routes/catchReport.routes";
import { eventRouter } from "./routes/event.routes";
import { favoriteRouter } from "./routes/favorite.routes";
import { reminderRouter } from "./routes/reminder.routes";
import { weatherRouter } from "./routes/weather.routes";

const app = express();

// ─── Global Middleware ──────────────────────────────────

app.use(helmet());
app.use(cors());
app.use(express.json());

// Global rate limiter
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  })
);

// ─── Routes ─────────────────────────────────────────────

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/waterbodies", waterbodyRouter);
app.use("/api/catch-reports", catchReportRouter);
app.use("/api/events", eventRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/reminders", reminderRouter);
app.use("/api/weather", weatherRouter);

// ─── Error Handling ─────────────────────────────────────

app.use(errorHandler);

export default app;
