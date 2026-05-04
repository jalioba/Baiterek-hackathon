"use client";

import { Award, Building2, Users, FileCheck } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { useLang } from "@/lib/i18n";

export default function HomeStats() {
  const { t } = useLang();
  const s = t.home.stats;

  return (
    <section className="border-b bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title={s.programs} value={44} suffix="+" icon={<Award size={20} />} variant="blue" />
          <StatCard title={s.subsidiaries} value={8} icon={<Building2 size={20} />} variant="gold" />
          <StatCard title={s.entrepreneurs} value={24891} icon={<Users size={20} />} variant="green" trend={{ value: 12, isPositive: true }} />
          <StatCard title={s.approved} value={5102} icon={<FileCheck size={20} />} variant="purple" trend={{ value: 8, isPositive: true }} />
        </div>
      </div>
    </section>
  );
}
