import { Router } from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { AppError } from "../middleware/errorHandler";
import { ecpService } from "../services/mock-integrations/ecp.service";

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: process.env.UPLOAD_DIR || "./uploads",
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post("/upload", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, "Файл не предоставлен");
    const doc = await prisma.document.create({
      data: {
        name: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        userId: req.user!.userId,
        applicationId: req.body.applicationId || null,
      },
    });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

router.post("/:id/sign", authenticate, async (req, res, next) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) throw new AppError(404, "Документ не найден");
    if (doc.userId !== req.user!.userId) throw new AppError(403, "Нет доступа");

    await ecpService.signDocument(doc.id, req.body.signatureData);

    const updated = await prisma.document.update({
      where: { id: doc.id },
      data: { status: "SIGNED", signedAt: new Date() },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

router.get("/my", authenticate, async (req, res, next) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: docs });
  } catch (e) { next(e); }
});

export default router;
