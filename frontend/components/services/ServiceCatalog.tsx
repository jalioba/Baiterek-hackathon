"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List as ListIcon, X, Sparkles } from "lucide-react";
import { SERVICES, SUBSIDIARIES } from "@/lib/mock-data";
import ServiceCard from "@/components/shared/ServiceCard";
import SmartSelector from "@/components/features/ai-assistant/SmartSelector";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const CATEGORIES = ["Все", "Финансирование", "Гарантии", "Экспорт", "Инновации", "Субсидии", "Обучение", "Лизинг", "Ипотека"];
const AUDIENCES = ["Все", "ИП", "МСБ", "Крупный бизнес", "Стартапы", "Аграрии", "Физ. лица"];
const TERMS = [
  { label: "Любой срок", value: 999 },
  { label: "до 5 дней", value: 5 },
  { label: "до 15 дней", value: 15 },
  { label: "до 30 дней", value: 30 },
];
const SORTS = ["Популярные", "Новые", "По алфавиту", "По сроку"];

export default function ServiceCatalog() {
  const { t } = useLang();
  const s = t.services;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [audience, setAudience] = useState("Все");
  const [maxDays, setMaxDays] = useState(999);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Популярные");
  const [page, setPage] = useState(1);
  const [isSmartSelectorOpen, setIsSmartSelectorOpen] = useState(false);
  const itemsPerPage = 12;

  const toggleOrg = (id: string) => {
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("Все");
    setAudience("Все");
    setMaxDays(999);
    setSelectedOrgs([]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = SERVICES.filter((s) => s.isActive);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    if (category !== "Все") {
      result = result.filter((s) => s.category === category);
    }
    // Note: mock data doesn't have `targetAudience` array natively in all items, we'll fake audience filtering
    if (audience !== "Все") {
      // Just a mock filter logic
      result = result.filter((s) => s.title.includes(audience) || s.description.includes(audience) || audience === "МСБ");
    }
    if (maxDays < 999) {
      result = result.filter((s) => s.processingDays <= maxDays);
    }
    if (selectedOrgs.length > 0) {
      result = result.filter((s) => selectedOrgs.includes(s.subsidiaryId));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "Популярные") return b.viewCount - a.viewCount;
      if (sortBy === "Новые") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "По алфавиту") return a.title.localeCompare(b.title);
      if (sortBy === "По сроку") return a.processingDays - b.processingDays;
      return 0;
    });

    return result;
  }, [search, category, audience, maxDays, selectedOrgs, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const activeFiltersCount = (category !== "Все" ? 1 : 0) + (audience !== "Все" ? 1 : 0) + (maxDays !== 999 ? 1 : 0) + selectedOrgs.length;

  return (
    <div className="flex flex-col gap-8 lg:flex-row items-start">
      {/* Sidebar Filters (Sticky) */}
      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-24">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[#1A2332] text-lg">
              <SlidersHorizontal size={18} className="text-[#003F87]" /> {s.filters}
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} className="text-xs font-medium text-red-500 hover:underline">
                {s.reset} ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Orgs */}
            <div>
              <div className="mb-3 text-sm font-semibold text-[#1A2332]">{s.organizations}</div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {SUBSIDIARIES.map((sub) => (
                  <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedOrgs.includes(sub.id)}
                      onChange={() => toggleOrg(sub.id)}
                      className="h-4 w-4 rounded border-gray-300 text-[#003F87] focus:ring-[#003F87]"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-[#1A2332] transition-colors">{sub.shortName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <div className="mb-3 text-sm font-semibold text-[#1A2332]">{s.category}</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      category === cat ? "bg-[#003F87] border-[#003F87] text-white" : "bg-gray-50 border-gray-200 text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <div className="mb-3 text-sm font-semibold text-[#1A2332]">{s.audience}</div>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#003F87] focus:bg-white transition-colors"
              >
                {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Processing Time */}
            <div>
              <div className="mb-3 text-sm font-semibold text-[#1A2332]">{s.processingTime}</div>
              <div className="flex flex-col gap-2">
                {TERMS.map((term) => (
                  <label key={term.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="term"
                      checked={maxDays === term.value}
                      onChange={() => setMaxDays(term.value)}
                      className="h-4 w-4 border-gray-300 text-[#003F87] focus:ring-[#003F87]"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-[#1A2332] transition-colors">{term.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {/* AI Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-300" /> {s.smartSelect}
            </h3>
            <p className="text-blue-100 text-sm max-w-xl">
              {t.services.subtitle}
            </p>
          </div>
          <button 
            onClick={() => setIsSmartSelectorOpen(true)}
            className="shrink-0 bg-white text-[#003F87] px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            {s.smartSelect}
          </button>
        </div>

        {/* Top Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border">
          <div className="relative flex-1 max-w-md ml-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={s.search}
              className="w-full rounded-xl bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none border-transparent focus:border-[#003F87] focus:bg-white transition-all border"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1A2332]">
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 px-2 sm:px-0 pr-2">
            <div className="text-sm text-muted-foreground hidden lg:block mr-2">
              {s.found}: <span className="font-bold text-[#1A2332]">{filtered.length}</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border bg-gray-50 px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none hover:bg-gray-100"
            >
              {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="flex items-center rounded-lg border bg-gray-50 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("rounded-md p-1.5 transition-colors", viewMode === "grid" ? "bg-white shadow-sm text-[#003F87]" : "text-muted-foreground hover:text-[#1A2332]")}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("rounded-md p-1.5 transition-colors", viewMode === "list" ? "bg-white shadow-sm text-[#003F87]" : "text-muted-foreground hover:text-[#1A2332]")}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid/List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-24 text-center">
            <Search size={48} className="mb-4 text-gray-200" />
            <h3 className="text-lg font-bold text-[#1A2332]">{s.noResults}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">{s.noResultsDesc}</p>
            <button onClick={resetFilters} className="mt-4 rounded-lg bg-[#003F87] px-5 py-2 text-sm font-medium text-white hover:bg-[#0056B8] transition-colors">
              {s.reset}
            </button>
          </div>
        ) : (
          <>
            <div className={cn(
              viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"
            )}>
              {paginated.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors",
                      page === i + 1 ? "bg-[#003F87] text-white shadow-md shadow-[#003F87]/20" : "bg-white text-muted-foreground hover:bg-gray-50 border"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isSmartSelectorOpen && (
        <SmartSelector onClose={() => setIsSmartSelectorOpen(false)} />
      )}
    </div>
  );
}
