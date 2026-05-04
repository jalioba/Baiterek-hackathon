"use client";

import { useState, useEffect, useRef } from "react";
import { X, Activity, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationSystem {
  name: string;
  code: string;
  uptime: string;
  latency: string;
  status: "online" | "degraded" | "offline";
}

const SYSTEMS: IntegrationSystem[] = [
  { name: "eGov IDP", code: "egov", uptime: "99.97%", latency: "124ms", status: "online" },
  { name: "ЕИШ Байтерек", code: "eish", uptime: "99.91%", latency: "89ms", status: "online" },
  { name: "BPM Oracle", code: "bpm", uptime: "99.84%", latency: "156ms", status: "online" },
  { name: "НУЦ ЭЦП", code: "nuc", uptime: "99.95%", latency: "67ms", status: "online" },
];

function generateLogs(system: IntegrationSystem): string[] {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts = (offset: number) => {
    const d = new Date(now.getTime() - offset * 1000);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const logs: Record<string, string[]> = {
    egov: [
      `[${ts(4)}] → POST /api/egov/auth/verify`,
      `[${ts(4)}] ← 200 OK { status: "verified", iin: "***456789" }`,
      `[${ts(3)}] → GET /api/egov/user/profile`,
      `[${ts(3)}] ← 200 OK { fullName: "***", role: "entrepreneur" }`,
      `[${ts(1)}] → POST /api/egov/auth/refresh-token`,
      `[${ts(1)}] ← 200 OK { token: "eyJ...redacted" }`,
    ],
    eish: [
      `[${ts(5)}] → GET /api/eish/services/list`,
      `[${ts(5)}] ← 200 OK { count: 73, services: [...] }`,
      `[${ts(3)}] → POST /api/eish/application/submit`,
      `[${ts(3)}] ← 201 Created { id: "APP-2024-078432" }`,
      `[${ts(1)}] → GET /api/eish/application/APP-2024-078432/status`,
      `[${ts(1)}] ← 200 OK { status: "UNDER_REVIEW" }`,
    ],
    bpm: [
      `[${ts(6)}] → POST /api/bpm/workflow/start`,
      `[${ts(6)}] ← 200 OK { processId: "WF-98234", step: 1 }`,
      `[${ts(4)}] → PUT /api/bpm/workflow/WF-98234/advance`,
      `[${ts(4)}] ← 200 OK { step: 2, assignee: "manager_01" }`,
      `[${ts(2)}] → GET /api/bpm/workflow/WF-98234`,
      `[${ts(2)}] ← 200 OK { status: "in_progress", step: 2 }`,
    ],
    nuc: [
      `[${ts(3)}] → POST /api/nuc/sign/init`,
      `[${ts(3)}] ← 200 OK { sessionId: "SIG-4521" }`,
      `[${ts(2)}] → POST /api/nuc/sign/SIG-4521/verify`,
      `[${ts(2)}] ← 200 OK { valid: true, signer: "ИИН ***789" }`,
      `[${ts(1)}] → GET /api/nuc/certificate/check`,
      `[${ts(1)}] ← 200 OK { expires: "2025-08-15", status: "active" }`,
    ],
  };

  return logs[system.code] ?? [];
}

interface IntegrationStatusBadgeProps {
  className?: string;
}

export default function IntegrationStatusBadge({ className }: IntegrationStatusBadgeProps) {
  const [selected, setSelected] = useState<IntegrationSystem | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [animatedLogs, setAnimatedLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;
    const allLogs = generateLogs(selected);
    setLogs(allLogs);
    setAnimatedLogs([]);

    const interval = setInterval(() => {
      setAnimatedLogs((prev) => {
        if (prev.length < allLogs.length) {
          return [...prev, allLogs[prev.length]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [selected]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [animatedLogs]);

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {SYSTEMS.map((sys) => (
          <button
            key={sys.code}
            onClick={() => setSelected(sys)}
            className="group flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3.5 py-2 text-sm shadow-sm transition-all hover:shadow-md hover:border-green-200"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="font-medium text-[#1A2332]">{sys.name}</span>
            <span className="text-[11px] text-green-600 font-medium">ONLINE</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Wifi size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A2332]">{selected.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online
                    </span>
                    <span>Uptime: {selected.uptime} за 30 дней</span>
                    <span>Avg: {selected.latency}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px border-b bg-gray-100">
              <div className="bg-white px-5 py-3 text-center">
                <div className="text-lg font-bold text-green-600">{selected.uptime}</div>
                <div className="text-[11px] text-muted-foreground">Uptime</div>
              </div>
              <div className="bg-white px-5 py-3 text-center">
                <div className="text-lg font-bold text-[#003F87]">{selected.latency}</div>
                <div className="text-[11px] text-muted-foreground">Avg Latency</div>
              </div>
              <div className="bg-white px-5 py-3 text-center">
                <div className="text-lg font-bold text-[#1A2332]">0</div>
                <div className="text-[11px] text-muted-foreground">Errors (24h)</div>
              </div>
            </div>

            {/* Logs */}
            <div className="px-5 py-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Activity size={13} /> Последние запросы
              </div>
              <div className="h-52 overflow-y-auto rounded-lg bg-[#1A2332] p-4 font-mono text-xs leading-relaxed">
                {animatedLogs.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "animate-fade-in",
                      line.includes("←") ? "text-green-400" : "text-blue-300"
                    )}
                  >
                    {line}
                  </div>
                ))}
                <div ref={logEndRef} />
                {animatedLogs.length < logs.length && (
                  <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
