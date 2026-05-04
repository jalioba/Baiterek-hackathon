"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area
} from "recharts";
import { Download, Calendar, Filter, Map as MapIcon, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const FUNNEL_DATA = [
  { name: 'Посещения', value: 100000, fill: '#cbd5e1' },
  { name: 'Регистрации', value: 45000, fill: '#94a3b8' },
  { name: 'Начали заявку', value: 12000, fill: '#64748b' },
  { name: 'Подали', value: 8500, fill: '#3b82f6' },
  { name: 'Одобрено', value: 3400, fill: '#10b981' },
];

const REGION_DATA = [
  { name: 'Алматы', requests: 4500 },
  { name: 'Астана', requests: 3800 },
  { name: 'Шымкент', requests: 2100 },
  { name: 'Караганда', requests: 1800 },
  { name: 'Актобе', requests: 1500 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("Месяц");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Расширенная аналитика</h1>
          <p className="text-muted-foreground mt-1 text-sm">Детальные отчеты по активности на портале</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            {["Неделя", "Месяц", "Квартал", "Год"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  period === p ? "bg-[#003F87] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#1A2332] px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
            <Download size={16} /> Экспорт
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funnel Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Layers size={20} className="text-[#003F87]" />
            <h3 className="font-bold text-[#1A2332]">Воронка конверсии</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30} label={{ position: 'right', fill: '#0f172a', fontSize: 12, formatter: (val: any) => val.toLocaleString() }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <MapIcon size={20} className="text-[#003F87]" />
            <h3 className="font-bold text-[#1A2332]">Топ регионы по заявкам</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="requests" fill="#003F87" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Summary Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-[#1A2332]">Сводные данные по продуктам</h3>
          <button className="text-sm font-semibold text-[#003F87] hover:underline">Скачать XLS</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Продукт / Услуга</th>
                <th className="px-6 py-4 text-right">Подано</th>
                <th className="px-6 py-4 text-right">Одобрено</th>
                <th className="px-6 py-4 text-right">Сумма (млн ₸)</th>
                <th className="px-6 py-4 text-right">Конверсия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1A2332]">Кредитование МСБ под 8%</td>
                <td className="px-6 py-4 text-right">1,240</td>
                <td className="px-6 py-4 text-right text-green-600 font-medium">850</td>
                <td className="px-6 py-4 text-right font-mono text-gray-600">45,200</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '68%' }}></div>
                    </div>
                    <span>68%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1A2332]">Инновационный грант QazInnovations</td>
                <td className="px-6 py-4 text-right">845</td>
                <td className="px-6 py-4 text-right text-green-600 font-medium">120</td>
                <td className="px-6 py-4 text-right font-mono text-gray-600">6,500</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: '14%' }}></div>
                    </div>
                    <span>14%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
