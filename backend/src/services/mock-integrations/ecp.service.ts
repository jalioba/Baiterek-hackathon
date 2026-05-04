import { v4 as uuidv4 } from "uuid";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const ecpService = {
  async signDocument(documentId: string, _signatureData: string) {
    await delay(500 + Math.random() * 300);
    return {
      documentId,
      signatureId: uuidv4(),
      signedAt: new Date().toISOString(),
      algorithm: "RSA-SHA256",
      certificateOwner: "Асанов Берик Жасыланович",
      certificateSerial: "0x" + Math.random().toString(16).slice(2, 18).toUpperCase(),
      isValid: true,
      source: "НЦТ ЭЦП (мок)",
    };
  },

  async verifySignature(signatureData: string, documentId: string) {
    await delay(400);
    return {
      documentId,
      isValid: !!signatureData,
      verifiedAt: new Date().toISOString(),
      source: "НЦТ ЭЦП (мок)",
    };
  },
};
