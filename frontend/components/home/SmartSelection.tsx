"use client";

import { Sparkles, ArrowRight, BrainCircuit, CheckCircle2, Search, FileText } from "lucide-react";

export default function SmartSelection() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2332] to-[#003F87]" />
      
      {/* Decorative patterns */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-[url('/images/pattern.svg')] opacity-10 mix-blend-overlay" />
      <div className="absolute right-[-10%] top-[-20%] h-96 w-96 rounded-full bg-[#E8C96B]/20 blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
          <div className="text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles size={16} className="text-[#E8C96B]" />
              <span className="text-white/90">AI Ассистент Байтерек</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
              Не знаете с чего начать?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Ответьте на несколько простых вопросов о вашем бизнесе, и искусственный интеллект подберёт подходящие программы за 2 минуты.
            </p>
            
            <button className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A951] to-[#E8C96B] px-8 py-4 font-bold text-[#1A2332] transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#C8A951]/20">
              <BrainCircuit size={20} />
              Пройти подбор за 2 минуты
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="relative space-y-6">
                {/* Connection line */}
                <div className="absolute bottom-6 left-[19px] top-6 w-[2px] bg-white/10" />

                {[
                  { icon: BrainCircuit, title: "Ответьте на вопросы", desc: "Сфера деятельности, регион и цели" },
                  { icon: Search, title: "Получите список", desc: "AI проанализирует 70+ программ" },
                  { icon: FileText, title: "Изучите условия", desc: "Детальная информация и требования" },
                  { icon: CheckCircle2, title: "Подайте заявку", desc: "Онлайн в один клик с eGov" }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003F87] text-[#E8C96B] ring-4 ring-[#1A2332]">
                      <step.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="mt-1 text-sm text-white/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
