import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Услуги: [
    { label: "Кредитование", href: "/services?category=Кредитование" },
    { label: "Гранты", href: "/services?category=Гранты" },
    { label: "Субсидии", href: "/services?category=Субсидии" },
    { label: "Лизинг", href: "/services?category=Лизинг" },
    { label: "Экспорт", href: "/services?category=Экспорт" },
    { label: "Обучение", href: "/services?category=Обучение" },
  ],
  Организации: [
    { label: "БРК", href: "/subsidiaries/brk" },
    { label: "QazIndustry", href: "/subsidiaries/qazindustry" },
    { label: "КазАгроФинанс", href: "/subsidiaries/kazagrofinance" },
    { label: "KazakhExport", href: "/subsidiaries/kazakhexport" },
    { label: "НАТР", href: "/subsidiaries/natr" },
    { label: "Байтерек Девелопмент", href: "/subsidiaries/baiterek-development" },
  ],
  Информация: [
    { label: "О холдинге", href: "/about" },
    { label: "Новости", href: "/news" },
    { label: "База знаний", href: "/knowledge" },
    { label: "Частые вопросы", href: "/knowledge?category=FAQ" },
  ],
  Контакты: [
    { label: "Обратная связь", href: "/contacts" },
    { label: "Приёмная", href: "/contacts#reception" },
    { label: "Для СМИ", href: "/contacts#press" },
  ],
};

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/baiterek.gov.kz", icon: "f" },
  { label: "Instagram", href: "https://instagram.com/baiterek_kz", icon: "ig" },
  { label: "LinkedIn", href: "https://linkedin.com/company/baiterek", icon: "in" },
  { label: "YouTube", href: "https://youtube.com/@baiterek", icon: "yt" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A2332] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#003F87] to-[#0056B8]">
                <Building2 size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg">Байтерек</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/60">
              Национальный управляющий холдинг — единая точка доступа к мерам государственной поддержки бизнеса.
            </p>
            <div className="space-y-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0" />
                <span>+7 000 000 00 00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0" />
                <span>123@</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>г. Астана, ул. 123</span>
              </div>
            </div>
            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white/60 transition-colors hover:bg-[#003F87] hover:text-white">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, items]) => (
            <div key={title}>
              <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C8A951]">{title}</div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} АО «Национальный управляющий холдинг «Байтерек». Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/privacy" className="transition-colors hover:text-white/70">Политика конфиденциальности</Link>
            <Link href="/terms" className="transition-colors hover:text-white/70">Условия использования</Link>
            <Link href="/sitemap" className="transition-colors hover:text-white/70">Карта сайта</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
