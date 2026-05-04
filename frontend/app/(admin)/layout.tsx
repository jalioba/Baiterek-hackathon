import Link from "next/link";
import { BarChart3, Building2, FileText, FormInput, LogOut, Settings, Users, PieChart, Activity, ClipboardList, Database, LayoutTemplate } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r bg-[#1A2332] lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#003F87] to-[#0056B8] border border-white/10 shadow-inner">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">БАЙТЕРЕК</div>
            <div className="text-[10px] text-blue-200 uppercase tracking-widest">Администратор</div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-6 p-5 overflow-y-auto">

          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Аналитика</h4>
            <div className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
                <BarChart3 size={18} className="text-blue-400" /> Дашборд
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <PieChart size={18} className="text-blue-400" /> Отчёты
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Управление</h4>
            <div className="space-y-1">
              <Link href="/admin/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <LayoutTemplate size={18} className="text-green-400" /> Услуги
              </Link>
              <Link href="/admin/form-builder" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <FormInput size={18} className="text-green-400" /> Конструктор форм
              </Link>
              <Link href="/admin/content" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <FileText size={18} className="text-green-400" /> Контент
              </Link>
              <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <Users size={18} className="text-green-400" /> Пользователи
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Мониторинг</h4>
            <div className="space-y-1">
              <Link href="/admin/applications" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <ClipboardList size={18} className="text-yellow-400" /> Все заявки
              </Link>
              <Link href="/admin/integrations" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <Activity size={18} className="text-yellow-400" /> Интеграции
              </Link>
              <Link href="/admin/logs" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <Database size={18} className="text-yellow-400" /> Логи системы
              </Link>
            </div>
          </div>

        </nav>

        <div className="border-t border-white/10 p-5">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors mb-4">
            <LogOut size={17} /> Выйти
          </Link>
          <div className="text-[10px] text-center text-white/30 tracking-widest">
            v1.0.0 | Build 2026.05
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
