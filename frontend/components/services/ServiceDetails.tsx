"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, FileText, CheckCircle2, FileDown, ArrowRight, HelpCircle, PhoneCall, AlertCircle } from "lucide-react";
import { SERVICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import ServiceCard from "@/components/shared/ServiceCard";
import IntegrationStatusBadge from "@/components/shared/IntegrationStatusBadge";

interface ServiceDetailsProps {
  id: string;
}

const TABS = ["Описание", "Условия", "Документы", "Вопросы и ответы"];

export default function ServiceDetails({ id }: ServiceDetailsProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const service = SERVICES.find((s) => s.id === id) || SERVICES[0];
  const relatedServices = SERVICES.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);

  // Mock data for tabs
  const conditions = [
    "Срок регистрации бизнеса более 6 месяцев",
    "Отсутствие задолженности по налогам",
    "Реализация проекта в приоритетных секторах экономики",
    "Создание новых рабочих мест",
    "Собственное участие не менее 20% от суммы проекта",
  ];

  const documents = [
    "Копия устава и учредительного договора",
    "Бизнес-план проекта",
    "Финансовая отчетность за последний год",
    "Справка об отсутствии задолженности",
    "Сметная документация (при строительстве)",
  ];

  const faqs = [
    { q: "Как долго рассматривается заявка?", a: `Обычно процесс занимает до ${service.processingDays} рабочих дней с момента подачи полного пакета документов.` },
    { q: "Можно ли подать заявку онлайн?", a: "Да, подача заявки полностью автоматизирована через портал eGov." },
    { q: "Нужен ли залог?", a: "В зависимости от программы, может потребоваться обеспечение в виде недвижимости или гарантии банка." },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-20">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-[#003F87]">Главная</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-[#003F87]">Каталог</Link>
            <ChevronRight size={14} />
            <span className="text-[#1A2332] font-medium">{service.title}</span>
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F5F7FA] px-3 py-1 text-sm font-medium text-[#003F87]">
            {service.category}
          </div>
          
          <h1 className="text-3xl font-bold text-[#1A2332] md:text-4xl lg:pr-32 mb-6">
            {service.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              <span className="font-medium text-[#1A2332]">Приём заявок открыт</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} /> Обновлено: {new Date().toLocaleDateString('ru-RU')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Организация:</span>
              <span className="font-medium text-[#1A2332]">{service.subsidiary?.shortName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Main Content (2/3) */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="mb-8 flex overflow-x-auto border-b custom-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors",
                    activeTab === tab
                      ? "border-[#003F87] text-[#003F87]"
                      : "border-transparent text-muted-foreground hover:text-[#1A2332] hover:border-gray-200"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border">
              {activeTab === "Описание" && (
                <div className="prose prose-blue max-w-none">
                  <h3 className="text-xl font-bold text-[#1A2332] mb-4">О программе</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  
                  <div className="bg-[#F5F7FA] rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-[#1A2332] mb-2 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-green-600" /> Основные преимущества
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                      <li>Полностью цифровой процесс подачи заявки</li>
                      <li>Интеграция с государственными базами данных</li>
                      <li>Прозрачный мониторинг статуса</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "Условия" && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A2332] mb-6">Условия получения</h3>
                  <div className="space-y-4">
                    {conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-[#003F87] shrink-0 mt-0.5" />
                        <span className="text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Документы" && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A2332] mb-2">Требуемые документы</h3>
                  <p className="text-muted-foreground mb-6">Все документы подаются в электронном виде через форму заявки</p>
                  <div className="grid gap-3">
                    {documents.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <FileText size={20} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-[#1A2332]">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Вопросы и ответы" && (
                <div>
                  <h3 className="text-xl font-bold text-[#1A2332] mb-6">Частые вопросы</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 p-5">
                        <h4 className="font-bold text-[#1A2332] flex items-start gap-3">
                          <HelpCircle size={18} className="text-[#003F87] shrink-0 mt-0.5" /> {faq.q}
                        </h4>
                        <p className="mt-2 pl-7 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <aside className="w-full shrink-0 lg:w-[380px] space-y-6">
            {/* Application Card */}
            <div className="rounded-2xl bg-white shadow-xl shadow-[#003F87]/5 border-t-4 border-t-[#003F87] lg:sticky lg:top-24">
              <div className="p-6 md:p-8">
                <div className="mb-6 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Срок оказания</div>
                    <div className="mt-1 font-bold text-[#1A2332] text-lg">до {service.processingDays} рабочих дней</div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Стоимость</div>
                    <div className="mt-1 font-bold text-green-600 text-lg">Бесплатно</div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Результат</div>
                    <div className="mt-1 font-medium text-[#1A2332]">Договор о предоставлении меры поддержки</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={`/apply/${service.id}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003F87] px-6 py-4 font-bold text-white transition hover:bg-[#0056B8] hover:shadow-lg">
                    Подать заявку онлайн <ArrowRight size={18} />
                  </Link>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-[#1A2332] transition hover:bg-gray-50">
                    <PhoneCall size={18} className="text-muted-foreground" /> Записаться на консультацию
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-[#003F87] transition hover:underline mt-2">
                    <FileDown size={16} /> Скачать памятку (PDF, 1.2MB)
                  </button>
                </div>
              </div>
              <div className="bg-[#F5F7FA] p-5 rounded-b-2xl border-t text-sm text-muted-foreground flex gap-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                Для подачи заявки вам потребуется ЭЦП и авторизация через eGov.
              </div>
            </div>

            {/* Integrations */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="font-bold text-[#1A2332] mb-4">Интеграция систем</h3>
              <IntegrationStatusBadge />
            </div>
          </aside>

        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-8">Похожие программы</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedServices.map((rs, i) => (
              <ServiceCard key={rs.id} service={rs} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
