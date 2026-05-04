"use client";

import { useApplications } from "@/hooks/useApplications";
import { Search, Filter, Plus, Calendar, FileText, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ApplicationsPage() {
  const { applications, loading } = useApplications();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredApps = applications.filter(app => {
    if (filter !== "ALL") {
      if (filter === "ACTIVE" && (app.status === "COMPLETED" || app.status === "REJECTED")) return false;
      if (filter === "COMPLETED" && app.status !== "COMPLETED" && app.status !== "APPROVED") return false;
      if (filter === "DRAFT" && app.status !== "DRAFT") return false;
    }
    if (search && !app.number?.toLowerCase().includes(search.toLowerCase()) && !app.serviceName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const tabs = [
    { id: "ALL", label: "Все заявки" },
    { id: "ACTIVE", label: "В работе" },
    { id: "COMPLETED", label: "Завершенные" },
    { id: "DRAFT", label: "Черновики" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Мои заявки</h1>
          <p className="text-muted-foreground mt-1">Отслеживайте статус и историю ваших обращений</p>
        </div>
        <Link 
          href="/services" 
          className="flex items-center justify-center gap-2 bg-[#003F87] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0056B8] transition shadow-sm"
        >
          <Plus size={18} /> Новая заявка
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex w-full md:w-auto overflow-x-auto hide-scrollbar gap-2">
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
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по номеру..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#1A2332] mb-2">Заявок не найдено</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              У вас пока нет заявок в этой категории. Вы можете подать новую заявку в каталоге услуг.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono font-medium">
                      {app.number || app.id.slice(0, 8)}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                      app.status === 'SUBMITTED' ? "bg-blue-100 text-blue-700" :
                      app.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                      app.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                      app.status === 'DRAFT' ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      {app.status === 'SUBMITTED' ? 'ПОДАНА' : 
                       app.status === 'APPROVED' ? 'ОДОБРЕНО' : 
                       app.status === 'DRAFT' ? 'ЧЕРНОВИК' : 
                       app.status === 'REJECTED' ? 'ОТКЛОНЕНО' : 'В РАБОТЕ'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1A2332] mb-2 group-hover:text-[#003F87] transition-colors">
                    {app.serviceName || "Наименование услуги"}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={16} className="text-gray-400" />
                      <span>Фонд Даму</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date(app.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:border-l md:border-gray-100 md:pl-6 md:py-2">
                  <Link 
                    href={`/applications/${app.id}`} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F5F7FA] text-[#1A2332] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:text-[#003F87] transition"
                  >
                    Перейти <ChevronRight size={18} />
                  </Link>
                </div>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
