"use client";

import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle, TrendingUp, Activity } from "lucide-react";
import StatCard from "@/components/shared/StatCard";

function generateFluctuation(base: number, variance: number) {
  const min = base - variance;
  const max = base + variance;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function LiveStatsSection() {
  const [stats, setStats] = useState({
    processedToday: 143,
    activeUsers: 2847,
    volume: 18.4,
    satisfaction: 94,
  });

  useEffect(() => {
    // Update stats every 10 seconds for visual effect
    const interval = setInterval(() => {
      setStats((prev) => ({
        processedToday: prev.processedToday + Math.floor(Math.random() * 3),
        activeUsers: generateFluctuation(2850, 40),
        volume: Number((prev.volume + Math.random() * 0.05).toFixed(2)),
        satisfaction: generateFluctuation(95, 2),
      }));
    }, 10000); // 10s for more frequent updates

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-green-600 tracking-wide uppercase">Live</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1A2332]">Портал в цифрах</h2>
            <p className="mt-1 text-muted-foreground">Обновление в реальном времени</p>
          </div>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 md:flex">
            <Activity size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="заявки обработаны сегодня"
            value={stats.processedToday}
            icon={<FileText size={20} />}
            variant="blue"
          />
          <StatCard
            title="активных пользователей"
            value={stats.activeUsers}
            icon={<Users size={20} />}
            variant="green"
            trend={{ value: 2.4, isPositive: true }}
          />
          <StatCard
            title="объём поддержки выдан"
            value={stats.volume}
            suffix=" млрд ₸"
            icon={<TrendingUp size={20} />}
            variant="gold"
          />
          <StatCard
            title="удовлетворённость"
            value={stats.satisfaction}
            suffix="%"
            icon={<CheckCircle size={20} />}
            variant="purple"
          />
        </div>
      </div>
    </section>
  );
}
