import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import servicesRoutes from "./routes/services.routes";
import applicationsRoutes from "./routes/applications.routes";
import documentsRoutes from "./routes/documents.routes";
import notificationsRoutes from "./routes/notifications.routes";
import usersRoutes from "./routes/users.routes";
import analyticsRoutes from "./routes/analytics.routes";
import integrationsRoutes from "./routes/integrations.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api", limiter);

app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date() }));

app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/integrations", integrationsRoutes);

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

import { initializeMetrics, initializeIntegrationStatus, startSimulation } from "./services/rtdb.service";

app.listen(PORT, async () => {
  console.log(`Baiterek API → http://localhost:${PORT}`);
  
  // Инициализируем RTDB начальными данными
  await initializeMetrics();
  await initializeIntegrationStatus();
  
  // Запускаем симулятор live-данных
  startSimulation();
});

export default app;
