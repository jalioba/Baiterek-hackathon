import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.count({ where: { userId: req.user!.userId, isRead: false } }),
    ]);
    res.json({ data, meta: { total, unread: total } });
  } catch (e) { next(e); }
});

router.patch("/:id/read", authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { isRead: true },
    });
    res.json({ message: "Прочитано" });
  } catch (e) { next(e); }
});

router.patch("/read-all", authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "Все уведомления прочитаны" });
  } catch (e) { next(e); }
});

export default router;
