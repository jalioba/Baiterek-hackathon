"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Clock, Users, FileText, CheckCircle2, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data & Generators ---

const generateAreaChartData = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    name: `${i + 1} мая`,
    submitted: Math.floor(Math.random() * 50) + 20,
    approved: Math.floor(Math.random() * 30) + 10,
  }));
};

const BAR_DATA = [
  { name: "Кредит на развитие", requests: 145 },
  { name: "Субсидии АПК", requests: 120 },
  { name: "Экспортная гарантия", requests: 98 },
  { name: "Инновационный грант", requests: 75 },
  { name: "Лизинг спецтехники", requests: 62 },
];

const PIE_DATA = [
  { name: "Одобрено", value: 450, color: "#10b981" },
  { name: "В обработке", value: 300, color: "#3b82f6" },
  { name: "Отклонено", value: 150, color: "#ef4444" },
  { name: "На доработке", value: 100, color: "#f59e0b" },
];

const SYSTEM_NAMES: Record<string, string> = {
  baiterek: "ЕИШ Байтерек",
  egov: "eGov IDP",
  bpm_brk: "BPM Oracle (БРК)",
  bpm_qaz: "BPM (QazInd.)",
  nca: "НУЦ ЭЦП",
  bitrix: "Bitrix CRM",
  sms: "SMS Gateway",
};

const INITIAL_INTEGRATIONS = {
  baiterek: { status: "ONLINE", uptime: 99.97, requests: 1247, latency: 124 },
  egov: { status: "ONLINE", uptime: 99.99, requests: 847, latency: 89 },
  bpm_brk: { status: "ONLINE", uptime: 99.85, requests: 234, latency: 341 },
  bpm_qaz: { status: "ONLINE", uptime: 99.91, requests: 187, latency: 298 },
  nca: { status: "ONLINE", uptime: 99.99, requests: 423, latency: 67 },
  bitrix: { status: "ONLINE", uptime: 99.73, requests: 56, latency: 512 },
  sms: { status: "ONLINE", uptime: 100, requests: 1893, latency: 34 },
};

const NEW_EVENTS = [
  "APP-2024-1547 → статус: UNDER_REVIEW",
  "Новый пользователь: Нурлан Б. (ТОО)",
  "Документ подписан ЭЦП: DOC-4521",
  "APP-2024-1541 → статус: APPROVED ✅",
  "BPM callback: заявка рассмотрена",
  "Новый пользователь: Азамат К. (ИП)",
  "Ошибка интеграции SMS Gateway (retrying...)",
  "APP-2024-1548 → статус: REJECTED",
];

// --- Hooks ---

function useIntegrationStatus() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrations(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const k = key as keyof typeof INITIAL_INTEGRATIONS;
          const fluctuation = 1 + (Math.random() * 0.1 - 0.05); // +/- 5%
          next[k] = {
            ...next[k],
            requests: Math.floor(next[k].requests * fluctuation),
            latency: Math.floor(next[k].latency * fluctuation),
          };
        });
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return integrations;
}

function useLiveEvents() {
  const [events, setEvents] = useState([
    { id: 1, text: "Система запущена", time: new Date().toLocaleTimeString('ru-RU') }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = NEW_EVENTS[Math.floor(Math.random() * NEW_EVENTS.length)];
      setEvents(prev => [
        { id: Date.now(), text: newEvent, time: new Date().toLocaleTimeString('ru-RU') },
        ...prev.slice(0, 14) // keep last 15
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return events;
}

// --- Components ---

function StatCard({ title, value, change, icon: Icon, positive }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-50 p-3 rounded-xl">
          <Icon className="text-[#003F87]" size={20} />
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-bold", positive ? "text-green-500" : "text-red-500")}>
          {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-[#1A2332] mb-1">{value}</div>
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const integrations = useIntegrationStatus();
  const events = useLiveEvents();
  const [areaData] = useState(generateAreaChartData());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2332]">Аналитика и мониторинг</h1>
          <p className="text-muted-foreground mt-1 text-sm">Сводка по заявкам и состоянию системы (Live)</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Заявок сегодня" value="47" change="12%" icon={FileText} positive={true} />
        <StatCard title="Активных пользователей" value="2,847" change="3%" icon={Users} positive={true} />
        <StatCard title="Ср. время обработки" value="8.3 дня" change="0.5" icon={Clock} positive={true} />
        <StatCard title="Конверсия (одобрено)" value="68%" change="2%" icon={CheckCircle2} positive={true} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1A2332] mb-6">Динамика заявок (30 дней)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="submitted" name="Подано" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="approved" name="Одобрено" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1A2332] mb-6">Статусы заявок</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                  {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Integrations and Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Integrations */}
        <div className="lg:col-span-2 bg-[#1A2332] rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="text-green-400" size={20} /> 
              Статус внешних систем
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Все системы работают нормально
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-white/10">Система</th>
                  <th className="p-4 font-semibold border-b border-white/10">Статус</th>
                  <th className="p-4 font-semibold border-b border-white/10 text-right">Uptime</th>
                  <th className="p-4 font-semibold border-b border-white/10 text-right">Запросов</th>
                  <th className="p-4 font-semibold border-b border-white/10 text-right">Задержка</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {Object.entries(integrations).map(([key, data]) => (
                  <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-200 font-sans font-medium">{SYSTEM_NAMES[key]}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> {data.status}
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-300">{data.uptime.toFixed(2)}%</td>
                    <td className="p-4 text-right text-blue-300">{data.requests.toLocaleString()}/ч</td>
                    <td className="p-4 text-right text-yellow-300">{data.latency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white/5 flex gap-4 text-sm font-medium">
            <button className="text-blue-400 hover:text-blue-300 transition-colors">Показать логи</button>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">Тест соединения</button>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">Документация API</button>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#1A2332]">События (Live Feed)</h3>
            <ShieldCheck size={20} className="text-[#003F87]" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {events.map((event, i) => (
              <div 
                key={event.id} 
                className="flex gap-3 text-sm animate-in slide-in-from-top-2 fade-in duration-300"
              >
                <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                  <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-[#003F87] animate-pulse" : "bg-gray-300")} />
                  {i !== events.length - 1 && <div className="w-px h-full bg-gray-200" />}
                </div>
                <div className="pb-4">
                  <div className="text-xs text-gray-400 font-mono mb-0.5">{event.time}</div>
                  <div className="font-medium text-gray-800">{event.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
