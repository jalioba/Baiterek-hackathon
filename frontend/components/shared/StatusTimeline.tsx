"use client";

import { Check, FileText, Search, Send, ShieldCheck, Clock, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { StatusHistory } from "@/types";

const STEPS = [
  { key: "SUBMITTED", label: "Подача заявки", icon: Send },
  { key: "REGISTERED", label: "Регистрация", icon: FileText },
  { key: "UNDER_REVIEW", label: "Рассмотрение", icon: Search },
  { key: "DOCS_CHECK", label: "Проверка документов", icon: ShieldCheck },
  { key: "DECISION", label: "Решение", icon: CircleDot },
  { key: "COMPLETED", label: "Завершение", icon: Check },
];

const STATUS_TO_STEP: Record<string, number> = {
  DRAFT: -1,
  SUBMITTED: 0,
  UNDER_REVIEW: 2,
  DOCS_REQUIRED: 3,
  APPROVED: 4,
  REJECTED: 4,
  COMPLETED: 5,
};

interface StatusTimelineProps {
  currentStatus: string;
  history?: StatusHistory[];
  className?: string;
}

export default function StatusTimeline({ currentStatus, history = [], className }: StatusTimelineProps) {
  const activeStep = STATUS_TO_STEP[currentStatus] ?? 0;

  const getStepComment = (stepIndex: number): StatusHistory | undefined => {
    return history.find((h) => {
      const hStep = STATUS_TO_STEP[h.status];
      return hStep === stepIndex;
    });
  };

  return (
    <div className={cn("relative", className)}>
      {STEPS.map((step, idx) => {
        const isDone = idx < activeStep;
        const isActive = idx === activeStep;
        const isPending = idx > activeStep;
        const Icon = step.icon;
        const historyEntry = getStepComment(idx);

        return (
          <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector Line */}
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute left-[17px] top-10 h-[calc(100%-24px)] w-[2px]",
                  isDone ? "bg-green-400" : isActive ? "bg-[#003F87]/30" : "bg-gray-200"
                )}
              />
            )}

            {/* Circle */}
            <div className="relative z-10 shrink-0">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  isDone && "border-green-500 bg-green-500 text-white",
                  isActive && "border-[#003F87] bg-[#003F87] text-white shadow-lg shadow-[#003F87]/25",
                  isPending && "border-gray-200 bg-gray-50 text-gray-400"
                )}
              >
                {isDone ? <Check size={16} /> : <Icon size={16} />}
              </div>
              {isActive && (
                <span className="absolute inset-0 rounded-full border-2 border-[#003F87] animate-ping opacity-30" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 pt-1">
              <div className={cn(
                "text-sm font-medium",
                isDone && "text-green-700",
                isActive && "text-[#003F87]",
                isPending && "text-gray-400"
              )}>
                {step.label}
              </div>
              {historyEntry && (
                <div className="mt-1 text-xs text-muted-foreground">
                  <Clock size={11} className="mr-1 inline-block" />
                  {formatDate(historyEntry.createdAt)}
                </div>
              )}
              {historyEntry?.comment && (
                <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                  {historyEntry.comment}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
