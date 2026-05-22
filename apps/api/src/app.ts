import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";
import { studentRouter } from "./routes/student.js";
import { teacherRouter } from "./routes/teacher.js";
import { parentRouter } from "./routes/parent.js";
import { adminRouter } from "./routes/admin.js";
import { feesRouter } from "./routes/fees.js";
import { messagingRouter } from "./routes/messaging.js";
import { libraryRouter } from "./routes/library.js";
import { hostelRouter } from "./routes/hostel.js";
import { transportRouter } from "./routes/transport.js";
import { inventoryRouter } from "./routes/inventory.js";
import { hrRouter } from "./routes/hr.js";
import { aiRouter } from "./routes/ai.js";
import { analyticsRouter } from "./routes/analytics.js";
import { exportRouter } from "./routes/export.js";
import { searchRouter } from "./routes/search.js";
import { webhooksRouter } from "./routes/webhooks.js";

export const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/v1", limiter);
app.use("/api/v1/auth", authLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/parent", parentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/fees", feesRouter);
app.use("/api/v1/messaging", messagingRouter);
app.use("/api/v1/library", libraryRouter);
app.use("/api/v1/hostel", hostelRouter);
app.use("/api/v1/transport", transportRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/hr", hrRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/export", exportRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/webhooks", webhooksRouter);

app.use(errorHandler);
