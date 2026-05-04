"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Landmark, Briefcase, Sprout, Factory, Plane, Lightbulb, GraduationCap, Home, Shield, Award, BookOpen, Building2 } from "lucide-react";
import type { Service } from "@/types";
import { truncate } from "@/lib/utils";

const CATEGORY_CONFIG: Record<string, { icon: typeof Landmark; color: string }> = {
  "Кредитование": { icon: Landmark, color: "#003F87" },
  "Гранты": { icon: Briefcase, color: "#16a34a" },
  "Субсидии": { icon: Sprout, color: "#C8A951" },
  "Лизинг": { icon: Factory, color: "#7c3aed" },
  "Экспорт": { icon: Plane, color: "#0891b2" },
  "Инновации": { icon: Lightbulb, color: "#ea580c" },
  "Обучение": { icon: GraduationCap, color: "#db2777" },
  "Жильё": { icon: Home, color: "#059669" },
  "Ипотека": { icon: Home, color: "#059669" },
  "Страхование": { icon: Shield, color: "#7c3aed" },
  "Гарантии": { icon: Award, color: "#0369a1" },
  "Консалтинг": { icon: BookOpen, color: "#9333ea" },
  "Инвестиции": { icon: Landmark, color: "#003F87" },
  "Торговое финансирование": { icon: Landmark, color: "#003F87" },
  "Инфраструктура": { icon: Building2, color: "#64748b" },
  "Акселерация": { icon: Lightbulb, color: "#ea580c" },
  "Сертификация": { icon: Award, color: "#0369a1" },
  "Закупки": { icon: Briefcase, color: "#16a34a" },
  "Аренда жилья": { icon: Home, color: "#059669" },
};

const DEFAULT_CAT = { icon: Briefcase, color: "#64748b" };

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const cat = CATEGORY_CONFIG[service.category] ?? DEFAULT_CAT;
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Top Row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: cat.color + "12" }}>
          <Icon size={20} style={{ color: cat.color }} />
        </div>
        <span className="rounded-full bg-[#003F87]/5 px-2.5 py-1 text-[11px] font-medium text-[#003F87]">
          {service.subsidiary?.shortName}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-1.5 text-base font-semibold leading-snug text-[#1A2332] group-hover:text-[#003F87] transition-colors">
        {service.title}
      </h3>

      {/* Description */}
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {truncate(service.description, 120)}
      </p>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {service.targetAudience.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Processing Time */}
      <div className="mt-auto mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock size={13} />
        <span>Срок: {service.processingDays} дн.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/services/${service.id}`}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:border-[#003F87] hover:text-[#003F87]"
        >
          Подробнее
        </Link>
        <Link
          href={`/applications/new/${service.id}`}
          className="flex items-center justify-center gap-1.5 flex-1 rounded-lg bg-gradient-to-r from-[#003F87] to-[#0056B8] py-2 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Подать заявку <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
