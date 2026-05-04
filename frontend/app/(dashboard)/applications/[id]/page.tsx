"use client";

import { useApplication } from "@/hooks/useApplications";
import { ArrowLeft, Clock, FileText, CheckCircle2, Circle, Search, Upload, Download, RefreshCw, Send, Check, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const { application, loading } = useApplication(params.id);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("timeline");

  // This is a mock timeline. In a real app, this would be generated from application history
  const timelineSteps = [
    { title: "Заявка подана", desc: `Заявка зарегистрирована`, date: "15.05.2024, 14:32", status: "completed" },
    { title: "Зарегистрирована", desc: "Автоматическая регистрация в BPM системе\n[ID в BPM: BPM-2024-78234]", date: "15.05.2024, 14:33", status: "completed" },
    { title: "Передана на рассмотрение", desc: "Менеджер: Сейтжан А.К.", date: "16.05.2024, 09:00", status: "completed" },
    { title: "На рассмотрении", desc: "Ожидаемый срок: до 25.05.2024", date: "", status: "active" },
    { title: "Проверка документов", desc: "", date: "", status: "pending" },
    { title: "Решение принято", desc: "", date: "", status: "pending" }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setLastSync(new Date());
    setRefreshing(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#003F87] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!application) {
    return <div className="p-8 text-center text-xl text-gray-500">Заявка не найдена</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div>
        <Link href="/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003F87] transition mb-4">
          <ArrowLeft size={16} /> Назад к списку
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#1A2332]">Заявка {application.number || params.id.slice(0, 8)}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {application.status || "В РАБОТЕ"}
              </span>
            </div>
            <p className="text-lg text-gray-600 font-medium">{application.serviceName || "Наименование услуги"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Clock size={14} /> Подана: {new Date(application.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('ru-RU')}</span>
              <span>Фонд Даму</span>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#1A2332] rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
            {refreshing ? "Обновление..." : "Обновить статус"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timeline & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Status Timeline Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1A2332] mb-8">Прогресс заявки</h2>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10",
                    step.status === "completed" ? "bg-green-500 text-white" :
                    step.status === "active" ? "bg-blue-500 text-white animate-pulse" :
                    "bg-gray-200 text-transparent"
                  )}>
                    {step.status === "completed" ? <Check size={18} /> : <Circle size={10} className="fill-current" />}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h3 className={cn("font-bold", step.status === "active" ? "text-blue-600" : "text-[#1A2332]")}>{step.title}</h3>
                      {step.date && <time className="text-xs font-mono text-gray-500">{step.date}</time>}
                    </div>
                    {step.desc && (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{step.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Area */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {["timeline", "documents", "chat"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-4 text-sm font-semibold transition-colors",
                    activeTab === tab ? "text-[#003F87] border-b-2 border-[#003F87]" : "text-gray-500 hover:text-[#1A2332]"
                  )}
                >
                  {tab === "timeline" ? "История" : tab === "documents" ? "Документы" : "Переписка"}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {activeTab === "timeline" && (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Полная история изменений доступна в основном таймлайне.</p>
                </div>
              )}
              
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#1A2332]">Прикрепленные документы</h3>
                    <button className="text-sm text-[#003F87] font-medium flex items-center gap-1 hover:underline">
                      <Upload size={16} /> Загрузить
                    </button>
                  </div>
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#003F87]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-[#1A2332] text-sm">Справка_о_доходах_2024.pdf</div>
                          <div className="text-xs text-gray-500">2.4 MB • Загружен 15.05.2024</div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-[#003F87] transition">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-4 mt-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#003F87] hover:text-[#003F87] transition flex flex-col items-center justify-center gap-2">
                    <Upload size={24} />
                    <span className="text-sm font-medium">Перетащите файлы сюда или нажмите для выбора</span>
                  </button>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#003F87] flex items-center justify-center font-bold text-xs shrink-0">М</div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm">
                        Здравствуйте! Ваша заявка принята в работу. Пожалуйста, прикрепите справку об отсутствии задолженности.
                        <div className="text-[10px] text-gray-400 mt-1 text-right">16.05.2024 10:15</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Написать сообщение..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#003F87]" />
                    <button className="w-12 h-12 bg-[#003F87] text-white rounded-xl flex items-center justify-center hover:bg-[#0056B8] transition shrink-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Integrations Mock */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1A2332] flex items-center gap-2 mb-6">
              <Activity size={18} className="text-[#003F87]" /> Интеграции систем
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-2 border-green-500 pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-semibold text-sm text-[#1A2332] mb-1">[BPM Oracle] ID: BPM-2024-78234</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Статус: <span className="font-medium text-green-600">Активна</span></div>
                  <div>Этап: Финансовый анализ</div>
                  <div>Ответственный: Сейтжан А.К.</div>
                </div>
              </div>

              <div className="border-l-2 border-green-500 pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-semibold text-sm text-[#1A2332] mb-1">[ЕИШ Байтерек]</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Статус: <span className="font-medium text-green-600">Синхронизировано</span></div>
                  <div>Синхронизация: {lastSync.toLocaleTimeString('ru-RU')}</div>
                  <div>Документов: 4</div>
                </div>
              </div>

              <div className="border-l-2 border-green-500 pl-4 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-semibold text-sm text-[#1A2332] mb-1">[НУЦ ЭЦП]</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Статус: <span className="font-medium text-green-600">Сертификат валиден</span></div>
                  <div>Подписант: {application.userId}</div>
                  <div>Дата: 15.05.2024</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full py-2 bg-gray-50 hover:bg-blue-50 text-[#003F87] text-sm font-semibold rounded-lg transition border border-transparent hover:border-blue-100">
                Подписать документ ЭЦП
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
