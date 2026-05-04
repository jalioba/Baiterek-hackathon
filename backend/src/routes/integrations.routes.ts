import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { eishService } from "../services/mock-integrations/eish.service";
import { ecpService } from "../services/mock-integrations/ecp.service";
import { bpmService } from "../services/mock-integrations/bpm.service";

const router = Router();

router.get("/eish/verify-iin", authenticate, async (req, res, next) => {
  try {
    const { iin } = req.query as { iin: string };
    if (!iin || iin.length !== 12) return res.status(400).json({ message: "Некорректный ИИН" });
    const result = await eishService.verifyIin(iin);
    res.json(result);
  } catch (e) { next(e); }
});

router.get("/eish/verify-bin", authenticate, async (req, res, next) => {
  try {
    const { bin } = req.query as { bin: string };
    if (!bin || bin.length !== 12) return res.status(400).json({ message: "Некорректный БИН" });
    const result = await eishService.verifyBin(bin);
    res.json(result);
  } catch (e) { next(e); }
});

router.post("/ecp/verify", authenticate, async (req, res, next) => {
  try {
    const { signatureData, documentId } = req.body;
    const result = await ecpService.verifySignature(signatureData, documentId);
    res.json(result);
  } catch (e) { next(e); }
});

router.get("/bpm/status/:externalId", authenticate, async (req, res, next) => {
  try {
    const result = await bpmService.getStatus(req.params.externalId);
    res.json(result);
  } catch (e) { next(e); }
});

export default router;
