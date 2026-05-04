"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, FileText, BookOpen, Newspaper } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SERVICES, NEWS, KNOWLEDGE_ARTICLES } from "@/lib/mock-data";

type FilterType = "all" | "services" | "articles" | "news";

const FILTER_TABS: { key: FilterType; label: string; icon: typeof FileText }[] = [
  { key: "all", label: "Все", icon: Search },
  { key: "services", label: "Услуги", icon: FileText },
  { key: "articles", label: "Статьи", icon: BookOpen },
  { key: "news", label: "Новости", icon: Newspaper },
];

const POPULAR = [
  "Гранты для МСБ",
  "Лизинг сельхозтехники",
  "Ипотека 7-20-25",
  "Субсидирование ставки",
  "Экспортное страхование",
];

interface SearchResult {
  id: string;
  title: string;
  type: "service" | "article" | "news";
  href: string;
  subtitle?: string;
}

interface SearchBarProps {
  className?: string;
  size?: "default" | "lg";
}

export default function SearchBar({ className, size = "default" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback((q: string, f: FilterType) => {
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    const out: SearchResult[] = [];

    if (f === "all" || f === "services") {
      SERVICES.filter((s) => s.title.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower))
        .slice(0, 5)
        .forEach((s) => out.push({ id: s.id, title: s.title, type: "service", href: `/services/${s.id}`, subtitle: s.subsidiary?.shortName }));
    }
    if ((f === "all" || f === "articles") && typeof KNOWLEDGE_ARTICLES !== "undefined") {
      KNOWLEDGE_ARTICLES.filter((a) => a.title.toLowerCase().includes(lower))
        .slice(0, 3)
        .forEach((a) => out.push({ id: a.id, title: a.title, type: "article", href: `/knowledge/${a.id}`, subtitle: a.category }));
    }
    if (f === "all" || f === "news") {
      NEWS.filter((n) => n.title.toLowerCase().includes(lower))
        .slice(0, 3)
        .forEach((n) => out.push({ id: n.id, title: n.title, type: "news", href: `/news/${n.id}`, subtitle: n.category }));
    }
    setResults(out);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, filter), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, filter, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = focused && (query.length === 0 || results.length > 0);
  const typeIcon = { service: FileText, article: BookOpen, news: Newspaper };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className={cn(
        "flex items-center gap-3 rounded-xl border bg-white transition-all",
        focused ? "border-[#003F87] shadow-lg shadow-[#003F87]/10 ring-2 ring-[#003F87]/10" : "border-gray-200 shadow-sm",
        size === "lg" ? "px-5 py-4" : "px-4 py-2.5"
      )}>
        <Search size={size === "lg" ? 22 : 18} className="shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Найдите нужную меру поддержки..."
          className={cn("w-full bg-transparent outline-none placeholder:text-muted-foreground/60", size === "lg" ? "text-base" : "text-sm")}
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="rounded-md p-1 text-muted-foreground hover:bg-gray-100">
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-100 bg-white shadow-xl">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b px-3 pt-3 pb-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === tab.key ? "bg-[#003F87] text-white" : "text-muted-foreground hover:bg-gray-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {query.length === 0 ? (
              <div className="p-2">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Популярные запросы</p>
                {POPULAR.map((p) => (
                  <button key={p} onClick={() => setQuery(p)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1A2332] transition-colors hover:bg-gray-50">
                    <Search size={14} className="text-muted-foreground" /> {p}
                  </button>
                ))}
              </div>
            ) : results.length > 0 ? (
              results.map((r) => {
                const RIcon = typeIcon[r.type];
                return (
                  <Link key={r.id} href={r.href} onClick={() => setFocused(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50">
                    <RIcon size={16} className="shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[#1A2332]">{r.title}</div>
                      {r.subtitle && <div className="text-xs text-muted-foreground">{r.subtitle}</div>}
                    </div>
                  </Link>
                );
              })
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
