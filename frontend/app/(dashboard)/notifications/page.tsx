"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { CheckCheck, Bell, Info, FileText, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState("ALL");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "SYSTEM") return n.type === "SYSTEM";
    if (filter === "APPLICATION") return n.type === "APPLICATION";
    return true;
  });

  const getIconForType = (type: string) => {
    switch(type) {
      case "APPLICATION": return <FileText size={20} className="text-blue-500" />;
      case "ALERT": return <AlertTriangle size={20} className="text-yellow-500" />;
      case "MESSAGE": return <MessageSquare size={20} className="text-green-500" />;
      default: return <Info size={20} className="text-gray-500" />;
    }
  };

  const tabs = [
    { id: "ALL", label: "Все" },
    { id: "UNREAD", label: "Непрочитанные" },
    { id: "APPLICATION", label: "По заявкам" },
    { id: "SYSTEM", label: "Системные" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Уведомления</h1>
          <p className="text-muted-foreground mt-1">История системных сообщений и обновлений</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center justify-center gap-2 text-sm font-medium text-[#003F87] hover:bg-blue-50 px-4 py-2 rounded-xl transition"
        >
          <CheckCheck size={18} /> Отметить все прочитанными
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              filter === tab.id 
                ? "bg-blue-50 text-[#003F87]" 
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#1A2332] mb-2">Нет уведомлений</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              У вас пока нет уведомлений в этой категории.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              className={cn(
                "p-5 sm:p-6 rounded-2xl border transition-all relative overflow-hidden group",
                !n.isRead ? "bg-white border-blue-100 shadow-md shadow-blue-500/5" : "bg-white border-gray-100 shadow-sm opacity-75 hover:opacity-100"
              )}
            >
              {!n.isRead && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003F87]"></div>
              )}
              
              <div className="flex gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  !n.isRead ? "bg-blue-50" : "bg-gray-50"
                )}>
                  {getIconForType(n.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                    <h3 className={cn("text-base truncate pr-4", !n.isRead ? "font-bold text-[#1A2332]" : "font-semibold text-gray-700")}>
                      {n.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 shrink-0">
                      {new Date(n.createdAt?.seconds * 1000 || Date.now()).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{n.message}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {n.link ? (
                      <Link 
                        href={n.link} 
                        onClick={() => markAsRead(n.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003F87] hover:underline"
                      >
                        Подробнее <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <div />
                    )}
                    
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="text-xs font-medium text-gray-500 hover:text-[#003F87] transition-colors"
                      >
                        Отметить прочитанным
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
