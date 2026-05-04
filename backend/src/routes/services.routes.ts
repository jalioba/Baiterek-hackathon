import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/featured", async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isFeatured: true, isActive: true },
      include: { subsidiary: true },
      take: 8,
    });
    res.json(services);
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    const { category, search, subsidiaryId, page = "1", limit = "20" } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;
    if (subsidiaryId) where.subsidiaryId = subsidiaryId;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { subsidiary: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { viewCount: "desc" },
      }),
      prisma.service.count({ where }),
    ]);
    res.json({ data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
  } catch (e) { next(e); }
});

router.get("/slug/:slug", async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
      include: { subsidiary: true },
    });
    if (!service) return res.status(404).json({ message: "Услуга не найдена" });
    await prisma.service.update({ where: { id: service.id }, data: { viewCount: { increment: 1 } } });
    res.json(service);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { subsidiary: true },
    });
    if (!service) return res.status(404).json({ message: "Услуга не найдена" });
    res.json(service);
  } catch (e) { next(e); }
});

const serviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  fullDescription: z.string(),
  category: z.string(),
  targetAudience: z.array(z.string()),
  conditions: z.string(),
  requiredDocs: z.array(z.string()),
  processingDays: z.number().int().positive(),
  result: z.string(),
  subsidiaryId: z.string(),
  isFeatured: z.boolean().optional(),
  formSchema: z.any().optional(),
});

router.post("/", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({ data, include: { subsidiary: true } });
    res.status(201).json(service);
  } catch (e) { next(e); }
});

router.patch("/:id", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
      include: { subsidiary: true },
    });
    res.json(service);
  } catch (e) { next(e); }
});

router.delete("/:id", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
