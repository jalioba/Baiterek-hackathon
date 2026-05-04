"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Building2, ChevronDown, LogIn, Menu, X, Eye, Globe,
  Briefcase, Landmark, Sprout, Plane, Lightbulb, GraduationCap, Factory, Home,
  User, LogOut, LayoutDashboard, Settings,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SUBSIDIARIES } from "@/lib/mock-data";
import { useAccessibility } from "@/lib/accessibility";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/i18n";

const SERVICE_CATEGORIES = [
  { name: "Кредитование", icon: Landmark, color: "#003F87" },
  { name: "Гранты", icon: Briefcase, color: "#16a34a" },
  { name: "Субсидии", icon: Sprout, color: "#C8A951" },
  { name: "Лизинг", icon: Factory, color: "#7c3aed" },
  { name: "Экспорт", icon: Plane, color: "#0891b2" },
  { name: "Инновации", icon: Lightbulb, color: "#ea580c" },
  { name: "Обучение", icon: GraduationCap, color: "#db2777" },
  { name: "Жильё", icon: Home, color: "#059669" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { highContrast, setHighContrast, fontSize, setFontSize } = useAccessibility();
  const { user, profile, logout } = useAuth();
  const { lang, setLang, t } = useLang();

  const NAV_ITEMS = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.services, href: "/services", hasMegaMenu: true },
    { label: t.nav.knowledge, href: "/knowledge" },
    { label: t.nav.news, href: "/news" },
    { label: t.nav.about, href: "/about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const megaEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const megaLeave = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'Пользователь';

  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const notifCount = 3;

  return (
    <header className={cn("sticky top-0 z-50 bg-white transition-shadow duration-300", scrolled ? "shadow-lg" : "shadow-none")}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#003F87] to-[#0056B8]">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide text-[#003F87] uppercase">Байтерек</div>
              <div className="text-[10px] text-muted-foreground leading-none">{t.header.portal}</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) =>
              item.hasMegaMenu ? (
                <div key={item.href} className="relative" onMouseEnter={megaEnter} onMouseLeave={megaLeave}>
                  <button className={cn("flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors", pathname?.startsWith("/services") ? "bg-[#003F87]/5 text-[#003F87]" : "text-muted-foreground hover:bg-gray-50 hover:text-[#003F87]")}>
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform duration-200", megaOpen && "rotate-180")} />
                  </button>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors", pathname === item.href ? "bg-[#003F87]/5 text-[#003F87]" : "text-muted-foreground hover:bg-gray-50 hover:text-[#003F87]")}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* Accessibility */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[#003F87] hover:text-[#003F87]">
                <Eye size={14} /> {t.header.accessibility}
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="mb-2 text-xs font-bold text-gray-500 uppercase">{t.header.fontSize}</div>
                <div className="flex gap-1 mb-4">
                  <button onClick={() => setFontSize('normal')} className={cn("flex-1 py-1 text-xs border rounded", fontSize === 'normal' ? "bg-gray-100 font-bold" : "")}>A</button>
                  <button onClick={() => setFontSize('large')} className={cn("flex-1 py-1 text-sm border rounded", fontSize === 'large' ? "bg-gray-100 font-bold" : "")}>A+</button>
                  <button onClick={() => setFontSize('xlarge')} className={cn("flex-1 py-1 text-base border rounded", fontSize === 'xlarge' ? "bg-gray-100 font-bold" : "")}>A++</button>
                </div>
                <div className="mb-2 text-xs font-bold text-gray-500 uppercase">{t.header.contrast}</div>
                <button onClick={() => setHighContrast(!highContrast)} className={cn("w-full py-1.5 text-xs border rounded transition-colors", highContrast ? "bg-black text-yellow-300 border-black" : "bg-white text-gray-700")}>
                  {highContrast ? t.header.contrastOn : t.header.contrastOff}
                </button>
              </div>
            </div>

            {/* Language switcher */}
            <div className="flex items-center rounded-lg border border-gray-200 text-xs font-medium overflow-hidden">
              <button onClick={() => setLang("RU")} className={cn("px-2.5 py-1.5 transition-colors", lang === "RU" ? "bg-[#003F87] text-white" : "text-muted-foreground hover:bg-gray-50")}>РУС</button>
              <button onClick={() => setLang("KZ")} className={cn("px-2.5 py-1.5 transition-colors", lang === "KZ" ? "bg-[#003F87] text-white" : "text-muted-foreground hover:bg-gray-50")}>ҚАЗ</button>
            </div>

            {/* Notifications */}
            {user && (
              <Link href="/notifications" className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-gray-50 hover:text-[#003F87]">
                <Bell size={18} />
                {notifCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{notifCount}</span>}
              </Link>
            )}

            {/* User Auth Zone */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003F87] to-[#0056B8] flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#1A2332] max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown size={14} className={cn("text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gradient-to-br from-[#003F87]/5 to-[#0056B8]/5 border-b border-gray-100">
                      <div className="text-sm font-bold text-[#1A2332] truncate">{displayName}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <div className="p-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={16} className="text-[#003F87]" /> {t.nav.dashboard}
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={16} className="text-[#003F87]" /> {t.header.profile}
                      </Link>
                      {profile?.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings size={16} className="text-[#003F87]" /> Администрирование
                        </Link>
                      )}
                      <div className="h-px bg-gray-100 my-1" />
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> {t.header.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-[#003F87] hover:text-[#003F87]">
                  <LogIn size={15} /> {t.header.login}
                </Link>
                <Link href="/register" className="rounded-lg bg-gradient-to-r from-[#003F87] to-[#0056B8] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                  {t.header.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-muted-foreground lg:hidden" aria-label="Меню">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Gold line */}
      <div className="h-[2px] bg-gradient-to-r from-[#C8A951] via-[#E8C96B] to-[#C8A951]" />

      {/* Mega Menu */}
      {megaOpen && (
        <div onMouseEnter={megaEnter} onMouseLeave={megaLeave} className="absolute left-0 right-0 z-40 hidden border-b border-gray-100 bg-white shadow-xl lg:block">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.header.serviceCategories}</h3>
                <div className="space-y-1">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <Link key={cat.name} href={`/services?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: cat.color + "15" }}>
                        <cat.icon size={16} style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm font-medium text-[#1A2332]">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.header.subsidiaries}</h3>
                <div className="grid grid-cols-2 gap-1">
                  {SUBSIDIARIES.map((sub) => (
                    <Link key={sub.id} href={`/subsidiaries/${sub.slug}`} className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#003F87]/5">
                        <Building2 size={14} className="text-[#003F87]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#1A2332] group-hover:text-[#003F87] transition-colors">{sub.shortName}</div>
                        <div className="text-xs text-muted-foreground truncate">{sub.description.slice(0, 60)}...</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Link href="/services" className="text-sm font-medium text-[#003F87] hover:underline">{t.header.viewAll}</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-[#003F87]">{t.header.aboutHolding}</Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", pathname === item.href ? "bg-[#003F87]/5 text-[#003F87]" : "text-muted-foreground hover:bg-gray-50")}>
                {item.label}
              </Link>
            ))}
            <div className="my-2 flex items-center gap-2 px-3">
              <Globe size={14} className="text-muted-foreground" />
              <div className="flex rounded-lg border border-gray-200 text-xs font-medium overflow-hidden">
                <button onClick={() => setLang("RU")} className={cn("px-3 py-1.5", lang === "RU" ? "bg-[#003F87] text-white" : "text-muted-foreground")}>РУС</button>
                <button onClick={() => setLang("KZ")} className={cn("px-3 py-1.5", lang === "KZ" ? "bg-[#003F87] text-white" : "text-muted-foreground")}>ҚАЗ</button>
              </div>
            </div>
            <div className="mt-2 border-t pt-4">
              {user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#003F87] to-[#0056B8] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                    <div>
                      <div className="text-sm font-bold text-[#1A2332]">{displayName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard size={16} /> {t.nav.dashboard}
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <User size={16} /> {t.header.profile}
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> {t.header.logout}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-center text-sm font-medium text-muted-foreground">{t.header.login}</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-gradient-to-r from-[#003F87] to-[#0056B8] py-2.5 text-center text-sm font-medium text-white">{t.header.register}</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
