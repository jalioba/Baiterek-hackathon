"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import { useLang } from "@/lib/i18n";
import { FileText, CheckCircle, Calendar, ArrowRight, Activity, PlusCircle, Upload, MessageSquare, CalendarClock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BookingModal from "@/components/features/booking/BookingModal";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { applications, loading } = useApplications();
  const { notifications } = useNotifications();
  const { t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);

  const activeApps = applications.filter(a => a.status !== 'COMPLETED' && a.status !== 'REJECTED');
  const approvedApps = applications.filter(a => a.status === 'APPROVED' || a.status === 'COMPLETED');

  const stats = [
    { label: t.dashboard.stats.total, value: applications.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { label: t.dashboard.stats.inProgress, value: activeApps.length, icon: Activity, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: t.dashboard.stats.approved, value: approvedApps.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: t.dashboard.stats.newNotifs, value: notifications.filter((n: any) => !n.isRead).length, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-[#1A2332] mb-2">
            {t.dashboard.welcome} {profile?.firstName || 'Пользователь'}!
          </h1>
          <p className="text-muted-foreground mb-8">
            {t.dashboard.subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/services" className="flex items-center gap-2 bg-[#003F87] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0056B8] transition shadow-sm">
              <PlusCircle size={20} /> {t.dashboard.apply}
            </Link>
            <button
              onClick={() => setBookingOpen(true)}
              className="flex items-center gap-2 bg-[#C8A951] text-[#1A2332] px-6 py-3 rounded-xl font-medium hover:bg-[#D4B55B] transition shadow-sm"
            >
              <CalendarClock size={20} /> {t.dashboard.book}
            </button>
            <Link href="/documents" className="flex items-center gap-2 bg-white text-[#003F87] border border-blue-200 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition shadow-sm">
              <Upload size={20} /> {t.dashboard.upload}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A2332]">{loading ? "-" : stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1A2332]">Активные заявки</h2>
            <Link href="/applications" className="text-sm font-medium text-[#003F87] hover:underline flex items-center gap-1">
              Все заявки <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div></div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">У вас пока нет поданных заявок.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono font-medium text-gray-500">{app.number || app.id.slice(0, 8)}</span>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          app.status === 'SUBMITTED' ? "bg-blue-100 text-blue-700" :
                          app.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        )}>
                          {app.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#1A2332]">{app.serviceName || "Услуга поддержки"}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(app.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                    <Link href={`/applications/${app.id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A2332] text-sm font-medium rounded-lg transition whitespace-nowrap text-center">
                      Перейти
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1A2332]">Уведомления</h2>
            <Link href="/notifications" className="text-sm font-medium text-[#003F87] hover:underline">
              Все
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1">
            {loading ? (
              <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div></div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Нет новых уведомлений.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className={cn("p-4 transition rounded-xl", !n.isRead ? "bg-blue-50/50" : "")}>
                    <div className="flex gap-3">
                      <div className={cn("mt-0.5 w-2 h-2 rounded-full shrink-0", !n.isRead ? "bg-[#003F87]" : "bg-transparent")} />
                      <div>
                        <h4 className={cn("text-sm", !n.isRead ? "font-bold text-[#1A2332]" : "font-medium text-gray-700")}>{n.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                          {new Date(n.createdAt?.seconds * 1000 || Date.now()).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
