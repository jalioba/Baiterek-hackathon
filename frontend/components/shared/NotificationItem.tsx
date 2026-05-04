"use client";

import Link from "next/link";
import { Bell, FileCheck, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { Notification } from "@/types";

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string }> = {
  STATUS_UPDATE: { icon: Info, color: "#003F87" },
  DOCS_REQUIRED: { icon: AlertTriangle, color: "#ea580c" },
  APPROVED: { icon: CheckCircle, color: "#16a34a" },
  REJECTED: { icon: XCircle, color: "#dc2626" },
  COMPLETED: { icon: FileCheck, color: "#059669" },
};

const DEFAULT_TYPE = { icon: Bell, color: "#64748b" };

interface NotificationItemProps {
  notification: Notification;
  className?: string;
}

export default function NotificationItem({ notification, className }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type] ?? DEFAULT_TYPE;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative flex gap-3.5 rounded-lg border border-transparent p-4 transition-colors hover:bg-gray-50",
        !notification.isRead && "bg-blue-50/40 border-blue-100",
        className
      )}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#003F87]" />
      )}

      {/* Icon */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: config.color + "12" }}
      >
        <Icon size={18} style={{ color: config.color }} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn("text-sm font-medium text-[#1A2332]", !notification.isRead && "font-semibold")}>
            {notification.title}
          </h4>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(notification.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        {notification.applicationId && (
          <Link
            href={`/applications/${notification.applicationId}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#003F87] hover:underline"
          >
            Перейти к заявке →
          </Link>
        )}
      </div>
    </div>
  );
}
