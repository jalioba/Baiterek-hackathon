"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  variant?: "blue" | "green" | "gold" | "purple";
  className?: string;
}

const VARIANT_STYLES = {
  blue: "from-[#003F87]/10 to-[#0056B8]/5 border-[#003F87]/10",
  green: "from-green-500/10 to-emerald-500/5 border-green-500/10",
  gold: "from-[#C8A951]/15 to-[#E8C96B]/5 border-[#C8A951]/15",
  purple: "from-purple-500/10 to-violet-500/5 border-purple-500/10",
};

const ICON_STYLES = {
  blue: "bg-[#003F87]/10 text-[#003F87]",
  green: "bg-green-500/10 text-green-600",
  gold: "bg-[#C8A951]/15 text-[#C8A951]",
  purple: "bg-purple-500/10 text-purple-600",
};

function useCountUp(ref: RefObject<HTMLElement | null>, target: number, duration = 1500): number {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, target, duration]);

  return count;
}

export default function StatCard({ title, value, suffix, trend, icon, variant = "blue", className }: StatCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedValue = useCountUp(containerRef, value);

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-xl border bg-gradient-to-br p-5 transition-shadow hover:shadow-md",
        VARIANT_STYLES[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-[#1A2332]">
              {animatedValue.toLocaleString("ru-RU")}
            </span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", ICON_STYLES[variant])}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend.isPositive ? (
            <TrendingUp size={14} className="text-green-600" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={cn("text-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-500")}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">за месяц</span>
        </div>
      )}
    </div>
  );
}
