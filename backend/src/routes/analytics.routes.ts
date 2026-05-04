import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const [
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      totalUsers,
      totalServices,
      activeServices,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "DOCS_REQUIRED"] } } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.user.count(),
      prisma.service.count(),
      prisma.service.count({ where: { isActive: true } }),
    ]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await prisma.user.count({ where: { createdAt: { gte: monthStart } } });

    const topServices = await prisma.service.findMany({
      include: { subsidiary: true, _count: { select: { applications: true } } },
      orderBy: { viewCount: "desc" },
      take: 5,
    });

    res.json({
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      totalUsers,
      newUsersThisMonth,
      totalServices,
      activeServices,
      topServices: topServices.map((s) => ({
        title: s.title,
        count: s._count.applications,
        subsidiary: s.subsidiary.shortName,
      })),
    });
  } catch (e) { next(e); }
});

export default router;
