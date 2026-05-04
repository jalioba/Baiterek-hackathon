import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { page = "1", limit = "20", role } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, role: true, firstName: true, lastName: true, phone: true, companyName: true, createdAt: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
  } catch (e) { next(e); }
});

router.patch("/:id/role", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { role } = z.object({ role: z.enum(["USER", "AUTHOR", "ADMIN"]) }).parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });
    res.json(user);
  } catch (e) { next(e); }
});

router.patch("/profile", authenticate, async (req, res, next) => {
  try {
    const schema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      companyName: z.string().optional(),
      companyType: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: { id: true, email: true, role: true, firstName: true, lastName: true, phone: true, companyName: true, companyType: true, updatedAt: true },
    });
    res.json(user);
  } catch (e) { next(e); }
});

export default router;
