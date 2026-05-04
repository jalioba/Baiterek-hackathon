import { Mail, MapPin, Phone } from "lucide-react";
import { SUBSIDIARIES } from "@/lib/mock-data";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="baiterek-gradient py-10 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Контакты</h1>
          <p className="mt-1 text-white/70">Свяжитесь с нами или найдите ближайшее отделение</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 grid gap-4 rounded-xl bg-white p-8 shadow-sm md:grid-cols-3">
          {[
            { icon: Phone, label: "Единый номер", value: "+7 (7172) 55-05-55" },
            { icon: Mail, label: "Email", value: "info@baiterek.gov.kz" },
            { icon: MapPin, label: "Головной офис", value: "г. Астана, пр. Мәңгілік Ел, 19" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA]">
                <Icon size={18} className="text-[#003F87]" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-semibold text-[#1A2332]">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold text-[#1A2332]">Дочерние организации</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SUBSIDIARIES.map((sub) => (
            <div key={sub.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="font-semibold text-[#1A2332]">{sub.name}</div>
              {sub.address && <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={12} />{sub.address}</div>}
              {sub.phone && <div className="flex items-center gap-1 text-sm text-muted-foreground"><Phone size={12} />{sub.phone}</div>}
              {sub.email && <div className="flex items-center gap-1 text-sm text-muted-foreground"><Mail size={12} />{sub.email}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
