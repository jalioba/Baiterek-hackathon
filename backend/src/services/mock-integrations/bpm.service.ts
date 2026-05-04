import { v4 as uuidv4 } from "uuid";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STATUSES = ["REGISTERED", "IN_PROCESS", "AWAITING_DOCS", "APPROVED", "REJECTED"];

export const bpmService = {
  async submitApplication(appNumber: string, _formData: Record<string, unknown>) {
    await delay(600 + Math.random() * 400);
    const externalId = `BPM-${uuidv4().slice(0, 8).toUpperCase()}`;
    console.log(`[BPM Mock] Application ${appNumber} submitted → ${externalId}`);
    return externalId;
  },

  async getStatus(externalId: string) {
    await delay(300);
    const statusIndex = Math.floor(Math.random() * STATUSES.length);
    return {
      externalId,
      status: STATUSES[statusIndex],
      lastUpdated: new Date().toISOString(),
      comment: statusIndex === 3 ? "Заявка рассмотрена положительно" : undefined,
      source: "BPM НПП «Атамекен» (мок)",
    };
  },
};
