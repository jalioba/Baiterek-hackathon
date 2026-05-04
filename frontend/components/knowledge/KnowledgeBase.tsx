"use client";

import { useState } from "react";
import { Search, BookOpen, ChevronDown, FileDown, FolderOpen, HelpCircle } from "lucide-react";
import { KNOWLEDGE_ARTICLES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Все", "Начинающим", "Финансы", "Экспорт", "Маркетинг", "Право", "Технологии"];

const FAQS = Array.from({ length: 15 }).map((_, i) => ({
  id: `faq-${i}`,
  q: `Как получить статус субъекта малого предпринимательства? ${i > 0 ? `(Вариант ${i + 1})` : ""}`,
  a: "Для получения статуса субъекта малого предпринимательства необходимо соответствовать критериям по среднегодовому доходу (не более 300 000 МРП) и среднегодовой численности работников (не более 100 человек). Дополнительная регистрация не требуется, статус определяется автоматически по данным налоговой отчетности."
}));

const TEMPLATES = [
  { name: "Типовой бизнес-план для получения кредита", size: "1.2 MB", type: "DOCX" },
  { name: "Шаблон финансовой модели (Excel)", size: "450 KB", type: "XLSX" },
  { name: "Договор о совместной деятельности", size: "890 KB", type: "DOCX" },
  { name: "Памятка по открытию ИП", size: "2.1 MB", type: "PDF" },
  { name: "Форма заявки на субсидирование", size: "320 KB", type: "DOCX" },
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"articles" | "faq" | "templates">("articles");

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(a => {
    const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Все" || a.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-20">
      {/* Header & Search */}
      <div className="bg-white border-b py-12 mb-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-[#1A2332] mb-4">База знаний</h1>
          <p className="text-lg text-muted-foreground mb-8">Полезные материалы, ответы на частые вопросы и шаблоны документов для вашего бизнеса</p>
          
          <div className="relative max-w-2xl mx-auto shadow-sm">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Искать статьи, инструкции или документы..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-base outline-none focus:border-[#003F87] focus:ring-1 focus:ring-[#003F87] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl border border-gray-100 shadow-sm inline-flex">
          <button
            onClick={() => setActiveTab("articles")}
            className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all", activeTab === "articles" ? "bg-[#003F87] text-white shadow-md" : "text-muted-foreground hover:bg-gray-50 hover:text-[#1A2332]")}
          >
            <BookOpen size={16} /> Статьи и руководства
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all", activeTab === "faq" ? "bg-[#003F87] text-white shadow-md" : "text-muted-foreground hover:bg-gray-50 hover:text-[#1A2332]")}
          >
            <HelpCircle size={16} /> Частые вопросы
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={cn("flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all", activeTab === "templates" ? "bg-[#003F87] text-white shadow-md" : "text-muted-foreground hover:bg-gray-50 hover:text-[#1A2332]")}
          >
            <FolderOpen size={16} /> Шаблоны документов
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "articles" && (
          <div className="animate-fade-in">
            <div className="mb-8 flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors border", category === cat ? "bg-white text-[#003F87] border-[#003F87] shadow-sm" : "bg-transparent text-muted-foreground border-gray-200 hover:bg-white hover:text-[#1A2332]")}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <a key={article.id} href="#" className="group flex flex-col bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#003F87]/5 hover:border-transparent transition-all">
                  <div className="mb-4 inline-flex items-center rounded-full bg-[#F5F7FA] px-3 py-1 text-xs font-semibold text-[#003F87]">
                    {article.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2332] group-hover:text-[#003F87] transition-colors mb-3">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {article.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">#{tag}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="py-20 text-center text-muted-foreground bg-white rounded-2xl border border-dashed">
                По вашему запросу ничего не найдено.
              </div>
            )}
          </div>
        )}

        {activeTab === "faq" && (
          <div className="animate-fade-in bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#1A2332] mb-8">Часто задаваемые вопросы</h2>
            <div className="divide-y divide-gray-100">
              {FAQS.map(faq => (
                <div key={faq.id} className="py-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="flex w-full items-center justify-between text-left font-bold text-[#1A2332] hover:text-[#003F87] transition-colors"
                  >
                    <span className="pr-8 text-lg">{faq.q}</span>
                    <ChevronDown size={20} className={cn("shrink-0 transition-transform duration-300 text-muted-foreground", openFaq === faq.id && "rotate-180")} />
                  </button>
                  <div className={cn("grid transition-all duration-300 ease-in-out", openFaq === faq.id ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="animate-fade-in bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#1A2332] mb-2">Шаблоны документов</h2>
            <p className="text-muted-foreground mb-8">Скачайте готовые образцы для заполнения</p>
            
            <div className="grid gap-4">
              {TEMPLATES.map((tpl, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#003F87]/30 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F5F7FA] text-[#003F87] group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileDown size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A2332]">{tpl.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span className="uppercase font-medium text-gray-500">{tpl.type}</span>
                        <span>•</span>
                        <span>{tpl.size}</span>
                      </div>
                    </div>
                  </div>
                  <button className="sm:w-auto w-full rounded-lg bg-white border px-6 py-2.5 text-sm font-medium text-[#003F87] hover:bg-[#F5F7FA] transition-colors shadow-sm">
                    Скачать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
