"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, ChevronRight, Upload, Search, Building2, 
  FileText, Briefcase, AlertTriangle, Send, Loader2 
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const STEPS = ["Проверка", "Заполнение", "Документы", "Подпись", "Подача"];

export default function ApplicationWizard({ serviceId }: { serviceId: string }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ncaModal, setNcaModal] = useState(false);
  const [ncaPin, setNcaPin] = useState("");
  const [formData, setFormData] = useState<any>({});
  
  // Step 1: Checks
  const [checks, setChecks] = useState([
    { id: 1, text: "Статус ИП/ТОО подтверждён", status: "pending" },
    { id: 2, text: "БИН зарегистрирован (проверка в ГБД)", status: "pending" },
    { id: 3, text: "Нет задолженностей по налогам", status: "pending" },
    { id: 4, text: "Отрасль соответствует условиям", status: "pending" },
  ]);

  useEffect(() => {
    if (step === 0) {
      // Simulate checking process
      const runChecks = async () => {
        for (let i = 0; i < checks.length; i++) {
          await new Promise(r => setTimeout(r, 600));
          setChecks(prev => prev.map(c => c.id === checks[i].id ? { ...c, status: "success" } : c));
        }
      };
      runChecks();
    }
  }, [step]);

  // Step 3: Docs
  const [docs, setDocs] = useState([
    { id: "d1", name: "Финансовая отчётность за год", status: "pending", required: true },
    { id: "d2", name: "Справка об отсутствии задолженности", status: "uploaded", required: true },
    { id: "d3", name: "Бизнес-план проекта", status: "pending", required: false },
  ]);

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const signDocs = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setNcaModal(false);
    handleNext();
  };

  const submitApp = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003F87', '#C8A951', '#ffffff']
    });
    setStep(4); // Final screen
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 sm:px-10 py-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
          <div 
            className="absolute left-0 top-1/2 h-1 bg-[#003F87] -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 px-2 sm:bg-transparent sm:px-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2",
                step > i ? "bg-[#003F87] border-[#003F87] text-white" : 
                step === i ? "bg-white border-[#003F87] text-[#003F87] shadow-md ring-4 ring-blue-50" : 
                "bg-white border-gray-300 text-gray-400"
              )}>
                {step > i ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-semibold hidden sm:block",
                step >= i ? "text-[#1A2332]" : "text-gray-400"
              )}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-10 min-h-[400px]">
        {/* STEP 0: Checking */}
        {step === 0 && (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A2332] mb-2">Проверка профиля</h2>
              <p className="text-muted-foreground">Проверяем ваше соответствие базовым критериям услуги...</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              {checks.map(c => (
                <div key={c.id} className="flex items-center gap-4">
                  {c.status === "success" ? (
                    <CheckCircle className="text-green-500 shrink-0" size={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin shrink-0"></div>
                  )}
                  <span className={cn("text-sm font-medium", c.status === "success" ? "text-gray-800" : "text-gray-500")}>
                    {c.text}
                  </span>
                </div>
              ))}
            </div>
            
            {checks.every(c => c.status === "success") && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-center text-sm font-bold animate-in slide-in-from-bottom-2">
                Вы соответствуете требованиям. Можно подать заявку ✅
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Form Fill */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2332] mb-1">Заполнение заявки</h2>
              <p className="text-muted-foreground text-sm">Часть полей уже заполнена из вашего профиля.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование компании</label>
                <input type="text" disabled value="ТОО 'Baiterek Tech'" className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#1A2332] mb-1">Цель получения поддержки <span className="text-red-500">*</span></label>
                <textarea rows={3} placeholder="Опишите на что планируете потратить средства..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#003F87]"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2332] mb-1">Запрашиваемая сумма (₸) <span className="text-red-500">*</span></label>
                <input type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#003F87]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2332] mb-1">Срок (месяцев) <span className="text-red-500">*</span></label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#003F87]">
                  <option>12 месяцев</option>
                  <option>24 месяца</option>
                  <option>36 месяцев</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Черновик автоматически сохранён (только что)
            </div>
          </div>
        )}

        {/* STEP 2: Documents */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2332] mb-1">Прикрепление документов</h2>
              <p className="text-muted-foreground text-sm">Загрузите необходимые документы (PDF, JPG до 10MB).</p>
            </div>

            <div className="space-y-4">
              {docs.map(doc => (
                <div key={doc.id} className={cn("p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors", doc.status === 'uploaded' ? "bg-green-50/50 border-green-200" : "bg-white border-gray-200")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", doc.status === 'uploaded' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")}>
                      {doc.status === 'uploaded' ? <CheckCircle size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1A2332]">
                        {doc.name} {doc.required && <span className="text-red-500">*</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {doc.status === 'uploaded' ? "Файл загружен (1.2 MB)" : doc.required ? "Обязательный документ" : "Необязательно"}
                      </div>
                    </div>
                  </div>
                  {doc.status === 'pending' ? (
                    <button className="text-[#003F87] font-medium text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors shrink-0">
                      <Upload size={14} /> Выбрать файл
                    </button>
                  ) : (
                    <button onClick={() => setDocs(prev => prev.map(d => d.id === doc.id ? {...d, status: 'pending'} : d))} className="text-red-500 text-xs font-medium hover:underline">Удалить</button>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-blue-50 text-[#003F87] px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
              <span>Загружено: 1 из 2 обязательных</span>
              <button 
                onClick={() => setDocs(prev => prev.map(d => ({...d, status: 'uploaded'})))} 
                className="text-xs bg-white px-3 py-1 rounded shadow-sm hover:bg-gray-50"
              >
                Мок: Загрузить все
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Sign */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 text-center py-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={36} className="text-[#003F87]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A2332]">Подписание заявки ЭЦП</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Для завершения подачи заявки необходимо подписать сформированный пакет документов вашей Электронной Цифровой Подписью (ЭЦП НУЦ РК).
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left max-w-md mx-auto">
              <div className="font-semibold text-[#1A2332] mb-3 text-sm uppercase tracking-wider">Пакет документов:</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Заявление на получение меры поддержки</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Согласие на сбор и обработку персональных данных</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Согласие на получение кредитного отчета</li>
              </ul>
            </div>

            <button 
              onClick={() => setNcaModal(true)}
              className="bg-[#003F87] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-[#0056B8] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Подписать через NCALayer
            </button>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="max-w-lg mx-auto text-center space-y-6 animate-in zoom-in-95 py-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A2332]">Заявка успешно подана!</h2>
            <p className="text-gray-600 text-lg">
              Номер вашей заявки: <strong className="text-[#003F87]">APP-2024-001547</strong>
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3 border border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Send size={16} className="text-blue-500" /> Отправлена в BPM систему фонда
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FileText size={16} className="text-blue-500" /> Передана на рассмотрение менеджеру
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-500" /> Уведомление отправлено на Email и SMS
              </div>
            </div>

            <button className="mt-4 bg-[#003F87] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0056B8] transition-colors w-full sm:w-auto">
              Перейти к заявке
            </button>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      {step < 4 && (
        <div className="bg-gray-50 border-t border-gray-100 p-6 flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={step === 0 || submitting}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>
          
          <button 
            onClick={step === 3 ? submitApp : handleNext}
            disabled={
              (step === 0 && !checks.every(c => c.status === "success")) ||
              (step === 2 && !docs.every(d => !d.required || d.status === "uploaded")) ||
              submitting
            }
            className="flex items-center gap-2 bg-[#003F87] text-white px-8 py-2.5 rounded-xl font-medium hover:bg-[#0056B8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
            {step === 3 ? "Отправить заявку" : "Продолжить"}
            {step < 3 && !submitting && <ChevronRight size={18} />}
          </button>
        </div>
      )}

      {/* NCA Layer Modal Mock */}
      {ncaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#1e2b3c] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-xs">NCA</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-sm">NCALayer</div>
                <div className="text-[10px] text-gray-400">Подписание документов</div>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1 font-mono">
                <div className="text-gray-500">Сертификат:</div>
                <div className="font-bold text-[#1e2b3c]">AUTH_BEKTENOV_2024</div>
                <div className="text-gray-500 mt-2">Действителен до:</div>
                <div className="text-green-600 font-bold">31.12.2025</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Введите PIN-код</label>
                <input 
                  type="password" 
                  value={ncaPin}
                  onChange={(e) => setNcaPin(e.target.value)}
                  className="w-full bg-white border-2 border-blue-500 rounded-lg px-4 py-2 outline-none font-mono text-center tracking-widest text-lg"
                  autoFocus
                  maxLength={6}
                />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={() => setNcaModal(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200">
                Отмена
              </button>
              <button 
                onClick={signDocs} 
                disabled={ncaPin.length < 4 || submitting}
                className="flex-1 py-2 rounded-lg text-sm font-bold bg-[#1e2b3c] text-white hover:bg-black disabled:opacity-50 flex justify-center"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : "Подписать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
