"use client";

import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface CounterItemProps {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
}

function CounterItem({ value, label, suffix = "", className }: CounterItemProps) {
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (current) => Math.floor(current).toLocaleString("ru-RU"));

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className={cn("text-center md:text-left", className)}>
      <div className="text-3xl font-bold text-[#E8C96B] lg:text-4xl flex items-center justify-center md:justify-start">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-white/80">{label}</div>
    </div>
  );
}

export default function HeroCounters() {
  const metrics = useLiveMetrics();
  const { t } = useLang();

  const usersCount = metrics?.totalUsers || 14431;
  const servicesCount = metrics?.totalServices || 73;
  const orgsCount = metrics?.totalSubsidiaries || 8;

  return (
    <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-white/10 pt-8 md:gap-16">
      <CounterItem value={usersCount} suffix="+" label={t.hero.counterEntrepreneurs} />
      <div className="hidden h-12 w-px bg-white/10 md:block" />
      <CounterItem value={servicesCount} label={t.hero.counterSupport} />
      <div className="hidden h-12 w-px bg-white/10 md:block" />
      <CounterItem value={orgsCount} label={t.hero.counterOrgs} />
    </div>
  );
}
