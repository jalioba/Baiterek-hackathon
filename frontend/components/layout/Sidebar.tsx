"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Building2, Calculator, FileText, FolderOpen, Home, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Дашборд", href: "/dashboard", icon: Home },
  { label: "Мои заявки", href: "/applications", icon: FileText },
  { label: "Документы", href: "/documents", icon: FolderOpen },
  { label: "Уведомления", href: "/notifications", icon: Bell },
  { label: "Калькуляторы", href: "/calculators", icon: Calculator },
  { label: "Профиль", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-white lg:flex">
      <Link href="/" className="flex items-center gap-2 border-b p-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003F87]">
          <Building2 size={18} className="text-white" />
        </div>
        <span className="font-bold text-[#003F87]">Байтерек</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-[#003F87] text-white"
                : "text-muted-foreground hover:bg-[#F5F7FA] hover:text-[#1A2332]"
            )}>
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-red-50 hover:text-red-600">
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
