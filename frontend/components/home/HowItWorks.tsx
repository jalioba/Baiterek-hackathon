"use client";

import { Search, Edit3, Send, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";

const ICONS = [Search, Edit3, Send, CheckCircle];

export default function HowItWorks() {
  const { t } = useLang();
  const steps = t.home.howItWorks.steps;

  return (
    <section className="bg-[#F5F7FA] py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#1A2332]">{t.home.howItWorks.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.home.howItWorks.subtitle}</p>
        </div>

        <div className="relative">
          {/* Connecting Line (desktop only) */}
          <div className="absolute left-1/2 top-10 hidden h-[2px] w-[70%] -translate-x-1/2 bg-gray-200 lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <div key={i} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-4 ring-[#F5F7FA]">
                    <Icon size={32} className="text-[#003F87]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#1A2332]">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
