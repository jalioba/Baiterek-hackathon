"use client";

import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  Bell, 
  Calculator, 
  UserCircle,
  PlusCircle,
  LogOut,
  Building2,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/lib/firebase/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-16 h-16 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Middleware should catch this, but fallback redirect just in case
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const navItems = [
    { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
    { name: "Мои заявки", href: "/applications", icon: FileText, badge: 1 }, 
    { name: "Документы", href: "/documents", icon: Files },
    { name: "Уведомления", href: "/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: "Калькуляторы", href: "/calculators", icon: Calculator },
    { name: "Профиль", href: "/profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#003F87] p-1.5 rounded-md">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-[#1A2332]">БАЙТЕРЕК</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo area */}
        <div className="hidden md:flex items-center gap-3 h-20 px-6 border-b border-gray-100">
          <div className="bg-[#003F87] p-2 rounded-lg">
            <Building2 size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A2332]">БАЙТЕРЕК</span>
        </div>

        {/* User profile */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-[#003F87] text-lg">
              {profile?.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-semibold text-[#1A2332] line-clamp-1">
                {profile?.firstName} {profile?.lastName}
              </div>
              <div className="text-xs text-muted-foreground bg-gray-100 inline-block px-2 py-0.5 rounded-full mt-1">
                {profile?.role === "ADMIN" ? "Администратор" : profile?.companyType === "juridical" ? "Юр. лицо" : "ИП"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 relative">
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50"></div>
            </div>
            <span className="text-green-600">Подключено к порталу</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all group",
                  isActive 
                    ? "bg-blue-50 text-[#003F87]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1A2332]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(isActive ? "text-[#003F87]" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.name}
                </div>
                {item.badge !== undefined && (
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold rounded-full",
                    isActive ? "bg-[#003F87] text-white" : "bg-gray-200 text-gray-600"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link 
            href="/services" 
            className="flex items-center justify-center gap-2 w-full bg-[#003F87] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0056B8] transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            Подать новую заявку
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
