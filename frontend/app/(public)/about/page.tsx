import { SUBSIDIARIES } from "@/lib/mock-data";
import Link from "next/link";
import { Building2, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="baiterek-gradient py-14 text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold">О холдинге Байтерек</h1>
          <p className="text-lg text-white/80">
            АО «Национальный управляющий холдинг «Байтерек» — государственный холдинг, объединяющий ведущие институты развития Казахстана для поддержки предпринимательства и национальной экономики.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg mb-12 text-[#1A2332]">
          <p>Холдинг Байтерек создан в 2013 году как единый управляющий центр государственных институтов развития. Миссия — содействие экономическому развитию Казахстана через финансирование, гарантирование и поддержку предпринимательской деятельности.</p>
          <p>Сегодня в состав холдинга входят 8 дочерних организаций, охватывающих все ключевые направления господдержки: от промышленного финансирования и агролизинга до поддержки экспорта и технологических инноваций.</p>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-[#1A2332]">Дочерние организации</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SUBSIDIARIES.map((sub) => (
            <div key={sub.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA]">
                  <Building2 size={20} className="text-[#003F87]" />
                </div>
                <div>
                  <div className="font-bold text-[#1A2332]">{sub.shortName}</div>
                  <div className="text-xs text-muted-foreground">{sub.name}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <Link href={`/subsidiaries/${sub.slug}`} className="text-sm font-medium text-[#003F87] hover:underline">
                  Программы →
                </Link>
                {sub.website && (
                  <a href={sub.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#003F87]">
                    <ExternalLink size={13} /> Сайт
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
