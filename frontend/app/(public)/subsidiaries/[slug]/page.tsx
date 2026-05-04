import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { SERVICES, SUBSIDIARIES } from "@/lib/mock-data";
import { truncate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  return { title: sub?.name || "Организация" };
}

export default function SubsidiaryPage({ params }: Props) {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  if (!sub) notFound();
  const services = SERVICES.filter((s) => s.subsidiaryId === sub.id && s.isActive);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="baiterek-gradient py-10 text-white">
        <div className="container mx-auto px-4">
          <Link href="/about" className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft size={15} /> Все организации
          </Link>
          <h1 className="text-3xl font-bold">{sub.name}</h1>
          <p className="mt-2 max-w-2xl text-white/80">{sub.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
              {sub.phone && <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-[#003F87]" />{sub.phone}</div>}
              {sub.email && <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-[#003F87]" />{sub.email}</div>}
              {sub.address && <div className="flex items-start gap-2 text-sm"><MapPin size={14} className="mt-0.5 shrink-0 text-[#003F87]" />{sub.address}</div>}
              {sub.website && (
                <a href={sub.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-[#003F87] hover:underline">
                  <ExternalLink size={13} /> Официальный сайт
                </a>
              )}
            </div>
          </aside>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-semibold text-[#1A2332]">Программы поддержки ({services.length})</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}
                  className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="rounded-full bg-[#F5F7FA] px-2.5 py-1 text-xs font-medium text-[#003F87]">{service.category}</span>
                  <h3 className="mt-3 font-semibold text-[#1A2332] group-hover:text-[#003F87]">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{truncate(service.description, 90)}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} /> до {service.processingDays} дней
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
