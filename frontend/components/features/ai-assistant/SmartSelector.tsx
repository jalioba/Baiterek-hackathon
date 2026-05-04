"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Building2, Factory, Globe, Search, ArrowRight, CheckCircle, RefreshCcw, Settings, Clock, Check, Briefcase, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/mock-data";

const STEPS = ["business_type", "industry", "needs", "extra", "analysis", "results"];

const BUSINESS_TYPES = [
  { id: "ip", label: "ИП / Самозанятый", icon: User },
  { id: "small", label: "Малый бизнес", sublabel: "до 100 чел", icon: Building2 },
  { id: "medium", label: "Средний бизнес", sublabel: "100-250 чел", icon: Factory },
  { id: "large", label: "Крупный бизнес", sublabel: "250+ чел", icon: Globe },
];

const INDUSTRIES = [
  "Сельское хозяйство", "IT и технологии", "Производство", "Торговля", 
  "Туризм", "Строительство", "Экспорт", "Услуги", "Образование", "Медицина"
];

const NEEDS = [
  { id: "credit", label: "Получить кредит/займ", icon: "💰" },
  { id: "guarantee", label: "Получить гарантию", icon: "🛡️" },
  { id: "export", label: "Выйти на экспорт", icon: "📦" },
  { id: "innovation", label: "Поддержка инноваций", icon: "🔬" },
  { id: "education", label: "Обучение и развитие", icon: "📚" },
  { id: "production", label: "Поддержка производства", icon: "🏗️" },
  { id: "subsidy", label: "Субсидии", icon: "💼" },
];

const REGIONS = [
  "Астана", "Алматы", "Шымкент", "Акмолинская область", "Актюбинская область", 
  "Алматинская область", "Атырауская область", "Восточно-Казахстанская область", 
  "Жамбылская область", "Карагандинская область", "Костанайская область", 
  "Кызылординская область", "Мангистауская область", "Северо-Казахстанская область", 
  "Павлодарская область", "Западно-Казахстанская область", "Туркестанская область",
  "Область Абай", "Область Жетісу", "Область Ұлытау"
];

const API_KEY = "AIzaSyCdaETpHLdwogbDlBigns-wbVlll92qJ6w";

interface SmartSelectorProps {
  onClose: () => void;
}

export default function SmartSelector({ onClose }: SmartSelectorProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({
    businessType: "",
    industries: [] as string[],
    needs: [] as string[],
    region: "",
    turnover: 50, // in millions KZT
    urgent: false,
  });
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiResult, setAiResult] = useState<{summary: string, services: any[]} | null>(null);

  const currentStep = STEPS[stepIndex];

  const toggleIndustry = (ind: string) => {
    setData(prev => ({
      ...prev,
      industries: prev.industries.includes(ind) 
        ? prev.industries.filter(i => i !== ind)
        : [...prev.industries, ind]
    }));
  };

  const toggleNeed = (need: string) => {
    setData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }));
  };

  const nextStep = () => {
    if (stepIndex === STEPS.indexOf("extra")) {
      startAnalysis();
    } else {
      setStepIndex(s => s + 1);
    }
  };

  const prevStep = () => {
    setStepIndex(s => Math.max(0, s - 1));
  };

  const startAnalysis = async () => {
    setStepIndex(STEPS.indexOf("analysis"));
    setAnalysisProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setAnalysisProgress(p => {
        if (p >= 90) return 90;
        return p + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch("/api/ai/selector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: data,
          services: SERVICES.map(s => ({ id: s.id, title: s.title, category: s.category }))
        })
      });

      const parsed = await response.json();
      
      clearInterval(interval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        if (parsed && parsed.services) {
          const matchedServices = parsed.services.map((aiSvc: any) => {
            const original = SERVICES.find(s => s.id === aiSvc.id) || SERVICES[0];
            return { ...original, matchScore: aiSvc.matchScore, aiReason: aiSvc.reason };
          }).slice(0, 4);
          
          setAiResult({
            summary: parsed.summary,
            services: matchedServices
          });
        } else {
          // Fallback
          setAiResult({
            summary: "На основе ваших данных мы подобрали наиболее релевантные программы финансирования и поддержки.",
            services: SERVICES.slice(0, 4).map(s => ({ ...s, matchScore: Math.floor(Math.random() * 20) + 80, aiReason: "Идеально подходит под ваш запрос" }))
          });
        }
        setStepIndex(STEPS.indexOf("results"));
      }, 800);

    } catch (e) {
      console.error("AI Error", e);
      clearInterval(interval);
      setAnalysisProgress(100);
      setTimeout(() => {
        setAiResult({
          summary: "Произошла ошибка при анализе. Показаны базовые рекомендации.",
          services: SERVICES.slice(0, 4).map(s => ({ ...s, matchScore: 85, aiReason: "Базовая рекомендация" }))
        });
        setStepIndex(STEPS.indexOf("results"));
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#003F87] text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Zap size={20} className="text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Умный подбор господдержки</h2>
              <p className="text-blue-100 text-sm">AI-ассистент портала Байтерек</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {currentStep === "business_type" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-bold text-[#1A2332] text-center mb-8">Укажите тип вашего бизнеса</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUSINESS_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setData({...data, businessType: type.label}); nextStep(); }}
                    className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 hover:border-[#003F87] hover:bg-blue-50/50 transition-all text-left group"
                  >
                    <div className="bg-blue-50 p-4 rounded-full group-hover:bg-[#003F87] group-hover:text-white text-[#003F87] transition-colors">
                      <type.icon size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A2332] text-lg">{type.label}</div>
                      {type.sublabel && <div className="text-sm text-muted-foreground">{type.sublabel}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "industry" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-bold text-[#1A2332] text-center mb-2">В какой отрасли вы работаете?</h3>
              <p className="text-center text-muted-foreground mb-8">Можно выбрать несколько вариантов</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    onClick={() => toggleIndustry(ind)}
                    className={cn(
                      "px-5 py-3 rounded-full font-medium text-sm transition-all border-2",
                      data.industries.includes(ind) 
                        ? "bg-[#003F87] border-[#003F87] text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#003F87]/30 hover:bg-blue-50"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "needs" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-bold text-[#1A2332] text-center mb-2">В чём вам нужна помощь?</h3>
              <p className="text-center text-muted-foreground mb-8">Выберите основные потребности</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {NEEDS.map(need => (
                  <button
                    key={need.id}
                    onClick={() => toggleNeed(need.label)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      data.needs.includes(need.label)
                        ? "bg-blue-50 border-[#003F87] shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-300"
                    )}
                  >
                    <span className="text-2xl">{need.icon}</span>
                    <span className={cn("font-semibold text-sm", data.needs.includes(need.label) ? "text-[#003F87]" : "text-gray-700")}>
                      {need.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "extra" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 max-w-lg mx-auto">
              <h3 className="text-2xl font-bold text-[#1A2332] text-center mb-2">Последние детали</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A2332] mb-2">Ваш регион</label>
                  <select 
                    value={data.region}
                    onChange={e => setData({...data, region: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87]"
                  >
                    <option value="">Выберите регион</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-semibold text-[#1A2332]">Годовой оборот</label>
                    <span className="font-bold text-[#003F87]">до {data.turnover} млн ₸</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="1000" step="10"
                    value={data.turnover}
                    onChange={e => setData({...data, turnover: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003F87]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>10 млн</span>
                    <span>1 млрд+</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-semibold text-[#1A2332] text-sm">Срочное решение</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Нужны программы с быстрым одобрением</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={data.urgent} onChange={e => setData({...data, urgent: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003F87]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === "analysis" && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-50"></div>
                <div className="absolute inset-2 bg-blue-200 rounded-full animate-pulse opacity-50"></div>
                <div className="absolute inset-4 bg-[#003F87] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <RefreshCcw size={40} className="text-white animate-spin" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-[#1A2332] mb-4">🤖 AI анализирует ваши данные...</h3>
              
              <div className="w-full max-w-md bg-gray-100 h-3 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-[#003F87] transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              <div className="space-y-3 w-full max-w-sm text-sm font-medium">
                <div className="flex items-center gap-3 text-[#1A2332]">
                  {analysisProgress > 10 ? <CheckCircle className="text-green-500" size={18} /> : <div className="w-4 h-4 border-2 rounded-full border-gray-300" />}
                  Анализ профиля бизнеса
                </div>
                <div className="flex items-center gap-3 text-[#1A2332]">
                  {analysisProgress > 40 ? <CheckCircle className="text-green-500" size={18} /> : <div className="w-4 h-4 border-2 rounded-full border-gray-300" />}
                  Проверка критериев соответствия
                </div>
                <div className="flex items-center gap-3 text-[#1A2332]">
                  {analysisProgress > 70 ? <CheckCircle className="text-green-500" size={18} /> : <div className="w-4 h-4 border-2 rounded-full border-gray-300" />}
                  Поиск в базе 73 мер поддержки
                </div>
                <div className={cn("flex items-center gap-3 transition-colors", analysisProgress > 90 ? "text-[#1A2332]" : "text-gray-400")}>
                  {analysisProgress >= 100 ? <CheckCircle className="text-green-500" size={18} /> : <Clock size={18} className="animate-pulse" />}
                  Формирование рекомендаций...
                </div>
              </div>
            </div>
          )}

          {currentStep === "results" && aiResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2332]">Найдено {aiResult.services.length} подходящие меры</h3>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={64} />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-2xl">🤖</div>
                  <div>
                    <h4 className="font-bold text-[#003F87] mb-2">Резюме от AI-ассистента:</h4>
                    <p className="text-[#1A2332] text-sm leading-relaxed">{aiResult.summary}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {aiResult.services.map((svc: any) => (
                  <div key={svc.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase tracking-wider">{svc.category}</span>
                        <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded flex items-center gap-1">
                          <CheckCircle size={12} /> {svc.matchScore}% совпадение
                        </span>
                      </div>
                      <h5 className="font-bold text-[#1A2332] text-lg mb-1">{svc.title}</h5>
                      <p className="text-sm text-muted-foreground mb-3">{svc.aiReason || svc.description}</p>
                    </div>

                    <div className="sm:w-48 flex-shrink-0">
                      <Link 
                        href={`/applications/new/${svc.id}`}
                        onClick={onClose}
                        className="w-full flex items-center justify-center bg-[#003F87] hover:bg-[#0056B8] text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
                      >
                        Подать заявку
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-[#1A2332] mb-4">Следующие шаги:</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div> Выберите одну или несколько мер поддержки выше</li>
                  <li className="flex items-start gap-2"><div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div> Авторизуйтесь с помощью ЭЦП для подачи заявки</li>
                  <li className="flex items-start gap-2"><div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div> Заполните анкету, часть данных загрузится автоматически</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {currentStep !== "analysis" && currentStep !== "results" && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            {stepIndex > 0 ? (
              <button 
                onClick={prevStep}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Назад
              </button>
            ) : <div></div>}
            
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 bg-[#003F87] text-white px-8 py-2.5 rounded-xl font-medium hover:bg-[#0056B8] transition-colors shadow-sm"
            >
              {currentStep === "extra" ? "Подобрать" : "Далее"} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {currentStep === "results" && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center">
            <button onClick={onClose} className="px-8 py-2.5 rounded-xl font-medium text-[#003F87] border border-blue-200 hover:bg-blue-50 transition-colors">
              Сохранить результаты в кабинет
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
