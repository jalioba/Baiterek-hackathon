"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUBSIDIARIES = ["БРК", "QazIndustry", "КазАгроФинанс", "KazakhExport", "НАТР", "Байтерек Девелопмент"];
const DATES = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});
const TIMES = ["09:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00", "17:30"];
const DISABLED_TIMES = ["10:00", "14:00", "16:00"];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState("");
  const [type, setType] = useState<"online" | "office">("online");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#003F87] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold">Запись на консультацию</h2>
          <p className="text-blue-200 text-sm mt-1">Выберите удобное время для встречи со специалистом</p>
          
          {step < 6 && (
            <div className="flex gap-1 mt-6">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full", s <= step ? "bg-white" : "bg-white/20")} />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1A2332]">Выберите организацию</h3>
              <div className="grid grid-cols-2 gap-3">
                {SUBSIDIARIES.map(s => (
                  <button
                    key={s}
                    onClick={() => setOrg(s)}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-medium transition-all text-left",
                      org === s ? "border-[#003F87] bg-blue-50 text-[#003F87]" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button disabled={!org} onClick={() => setStep(2)} className="w-full mt-6 bg-[#003F87] text-white py-3 rounded-xl font-medium disabled:opacity-50">Далее</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1A2332]">Формат консультации</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setType("online")} className={cn("p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all", type === "online" ? "border-[#003F87] bg-blue-50 text-[#003F87]" : "border-gray-100 text-gray-500 hover:border-gray-200")}>
                  <Video size={32} /> <span className="font-semibold">Онлайн (Zoom)</span>
                </button>
                <button onClick={() => setType("office")} className={cn("p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all", type === "office" ? "border-[#003F87] bg-blue-50 text-[#003F87]" : "border-gray-100 text-gray-500 hover:border-gray-200")}>
                  <MapPin size={32} /> <span className="font-semibold">В офисе</span>
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Назад</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#003F87] text-white py-3 rounded-xl font-medium">Далее</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1A2332]">Выберите дату</h3>
              <div className="grid grid-cols-4 gap-2">
                {DATES.map((d, i) => {
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <button
                      key={i}
                      disabled={isWeekend}
                      onClick={() => setDate(d)}
                      className={cn(
                        "p-2 rounded-xl border text-center transition-all",
                        date?.toDateString() === d.toDateString() ? "border-[#003F87] bg-[#003F87] text-white" : 
                        isWeekend ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50" : "border-gray-200 text-gray-700 hover:border-[#003F87]"
                      )}
                    >
                      <div className="text-[10px] uppercase opacity-80">{d.toLocaleDateString('ru-RU', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Назад</button>
                <button disabled={!date} onClick={() => setStep(4)} className="flex-1 bg-[#003F87] text-white py-3 rounded-xl font-medium disabled:opacity-50">Далее</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1A2332]">Доступное время</h3>
              <div className="grid grid-cols-4 gap-3">
                {TIMES.map(t => {
                  const disabled = DISABLED_TIMES.includes(t);
                  return (
                    <button
                      key={t}
                      disabled={disabled}
                      onClick={() => setTime(t)}
                      className={cn(
                        "py-2 rounded-lg border text-sm font-medium transition-all",
                        time === t ? "border-[#003F87] bg-[#003F87] text-white" :
                        disabled ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through" : "border-gray-200 text-gray-700 hover:border-[#003F87]"
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Назад</button>
                <button disabled={!time} onClick={() => setStep(5)} className="flex-1 bg-[#003F87] text-white py-3 rounded-xl font-medium disabled:opacity-50">Далее</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1A2332]">Цель консультации</h3>
              <textarea 
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="Опишите кратко ваш вопрос..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-[#003F87]"
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(4)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">Назад</button>
                <button onClick={() => setStep(6)} className="flex-1 bg-[#C8A951] text-[#1A2332] py-3 rounded-xl font-bold hover:bg-[#D4B55B] shadow-lg">Записаться</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-8 space-y-4 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2332]">Вы записаны! ✅</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Ваша заявка на консультацию в <b>{org}</b> успешно оформлена.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-4 text-left max-w-sm mx-auto my-6 space-y-3 border border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CalendarIcon size={16} className="text-[#003F87]" /> {date?.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Clock size={16} className="text-[#003F87]" /> {time} (по Астане)
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  {type === 'online' ? <Video size={16} className="text-[#003F87]"/> : <MapPin size={16} className="text-[#003F87]"/>}
                  {type === 'online' ? <span className="text-blue-600 underline cursor-pointer">Ссылка на Zoom</span> : "г. Астана, пр. Мангилик Ел, 55А"}
                </div>
              </div>

              <button className="w-full bg-[#1A2332] text-white py-3 rounded-xl font-medium">Добавить в календарь</button>
              <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium mt-2 hover:bg-gray-200">Закрыть</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
