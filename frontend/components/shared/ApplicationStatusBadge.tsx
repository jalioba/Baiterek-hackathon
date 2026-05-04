import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  DRAFT: { label: "Черновик", className: "bg-gray-100 text-gray-600 border-gray-200" },
  SUBMITTED: { label: "Подана", className: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "На рассмотрении", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  DOCS_REQUIRED: { label: "Требуются документы", className: "bg-orange-50 text-orange-700 border-orange-200" },
  APPROVED: { label: "Одобрена", className: "bg-green-50 text-green-700 border-green-200" },
  REJECTED: { label: "Отказано", className: "bg-red-50 text-red-700 border-red-200" },
  COMPLETED: { label: "Завершена", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
  className?: string;
}

export default function ApplicationStatusBadge({ status, size = "md", className }: ApplicationStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          status === "DRAFT" && "bg-gray-400",
          status === "SUBMITTED" && "bg-blue-500",
          status === "UNDER_REVIEW" && "bg-yellow-500 animate-pulse",
          status === "DOCS_REQUIRED" && "bg-orange-500 animate-pulse",
          status === "APPROVED" && "bg-green-500",
          status === "REJECTED" && "bg-red-500",
          status === "COMPLETED" && "bg-emerald-600"
        )}
      />
      {config.label}
    </span>
  );
}
