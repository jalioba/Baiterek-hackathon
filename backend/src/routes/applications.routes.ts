import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { AppError } from "../middleware/errorHandler";
import { bpmService } from "../services/mock-integrations/bpm.service";

const router = Router();
const prisma = new PrismaClient();

function generateAppNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `APP-${year}-${rand}`;
}

router.get("/admin/all", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } }, service: { include: { subsidiary: true } }, statusHistory: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);
    res.json({ data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
  } catch (e) { next(e); }
});

router.get("/", authenticate, async (req, res, next) => {
  try {
    const [data, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId: req.user!.userId },
        include: { service: { include: { subsidiary: true } }, statusHistory: true, documents: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where: { userId: req.user!.userId } }),
    ]);
    res.json({ data, meta: { total } });
  } catch (e) { next(e); }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { service: { include: { subsidiary: true } }, statusHistory: true, documents: true, notifications: true },
    });
    if (!app) throw new AppError(404, "Заявка не найдена");
    if (app.userId !== req.user!.userId && req.user!.role !== "ADMIN") throw new AppError(403, "Нет доступа");
    res.json(app);
  } catch (e) { next(e); }
});

const createSchema = z.object({
  serviceId: z.string().uuid(),
  formData: z.record(z.unknown()),
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { serviceId, formData } = createSchema.parse(req.body);
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new AppError(404, "Услуга не найдена");

    const application = await prisma.application.create({
      data: {
        id: uuidv4(),
        number: generateAppNumber(),
        userId: req.user!.userId,
        serviceId,
        formData,
        statusHistory: { create: { status: "DRAFT" } },
      },
      include: { service: { include: { subsidiary: true } }, statusHistory: true },
    });
    res.status(201).json(application);
  } catch (e) { next(e); }
});

router.post("/:id/submit", authenticate, async (req, res, next) => {
  try {
    const app = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!app) throw new AppError(404, "Заявка не найдена");
    if (app.userId !== req.user!.userId) throw new AppError(403, "Нет доступа");
    if (app.status !== "DRAFT") throw new AppError(400, "Заявка уже подана");

    const externalId = await bpmService.submitApplication(app.number, app.formData as Record<string, unknown>);

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: "SUBMITTED",
        externalId,
        statusHistory: { create: { status: "SUBMITTED" } },
        notifications: {
          create: {
            userId: app.userId,
            title: "Заявка подана",
            message: `Ваша заявка ${app.number} успешно подана и принята к рассмотрению`,
            type: "STATUS_UPDATE",
          },
        },
      },
      include: { service: { include: { subsidiary: true } }, statusHistory: true },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

router.patch("/:id/status", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { status, comment } = z.object({ status: z.string(), comment: z.string().optional() }).parse(req.body);
    const app = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status: status as never,
        statusHistory: { create: { status: status as never, comment } },
        notifications: {
          create: {
            userId: (await prisma.application.findUnique({ where: { id: req.params.id }, select: { userId: true } }))!.userId,
            title: "Статус заявки изменён",
            message: comment || `Статус вашей заявки изменён на: ${status}`,
            type: "STATUS_UPDATE",
          },
        },
      },
      include: { service: true, statusHistory: true },
    });
    res.json(app);
  } catch (e) { next(e); }
});

export default router;
