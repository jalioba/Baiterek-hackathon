"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calendar, Building2 } from "lucide-react";
import { NEWS, SUBSIDIARIES } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export default function NewsCatalog() {
  const { t } = useLang();
  const n = t.home.news;
  const [filterOrg, setFilterOrg] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const publishedNews = NEWS.filter(item => item.isPublished !== false).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const heroNews = publishedNews[0];
  const restNews = publishedNews.slice(1);

  const filtered = filterOrg === "all"
    ? restNews
    : restNews.filter(item => item.subsidiaryId === filterOrg);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b py-10 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1A2332]">{n.pressCenter}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{n.pressCenterSub}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero News */}
        {heroNews && filterOrg === "all" && page === 1 && (
          <Link href={`/news/${heroNews.id}`} className="group mb-12 block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl hover:shadow-[#003F87]/5 border border-gray-100">
            <div className="flex flex-col md:flex-row">
              {heroNews.imageUrl && (
                <div className="relative w-full md:w-1/2 lg:w-[60%] h-64 md:h-auto overflow-hidden bg-gray-100 shrink-0">
                  <img src={heroNews.imageUrl} alt={heroNews.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#003F87]">
                    {n.mainNews}
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatDate(heroNews.publishedAt)}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[#1A2332]">{heroNews.category}</span>
                </div>
                <h2 className="mb-4 text-2xl font-bold leading-tight text-[#1A2332] md:text-3xl lg:text-4xl group-hover:text-[#003F87] transition-colors">
                  {heroNews.title}
                </h2>
                <p className="mb-6 text-lg text-muted-foreground line-clamp-3">
                  {heroNews.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 font-semibold text-[#003F87] mt-auto">
                  {n.readFull} <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setFilterOrg("all"); setPage(1); }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors border",
              filterOrg === "all" ? "bg-[#003F87] text-white border-[#003F87]" : "bg-white text-muted-foreground hover:bg-gray-50 border-gray-200"
            )}
          >
            {n.allNews}
          </button>
          {SUBSIDIARIES.map((sub) => (
            <button
              key={sub.id}
              onClick={() => { setFilterOrg(sub.id); setPage(1); }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors border flex items-center gap-2",
                filterOrg === sub.id ? "bg-[#003F87] text-white border-[#003F87]" : "bg-white text-muted-foreground hover:bg-gray-50 border-gray-200"
              )}
            >
              {sub.shortName}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#003F87]/5">
              {news.imageUrl && (
                <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                  <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#003F87]">
                    {news.category}
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(news.publishedAt)}</span>
                  {news.subsidiaryId && (
                    <span className="flex items-center gap-1"><Building2 size={12} /> {SUBSIDIARIES.find(s => s.id === news.subsidiaryId)?.shortName}</span>
                  )}
                </div>
                <h3 className="mb-3 text-lg font-bold leading-snug text-[#1A2332] group-hover:text-[#003F87] transition-colors line-clamp-3">
                  {news.title}
                </h3>
                <p className="mt-auto text-sm text-muted-foreground line-clamp-3">
                  {news.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground bg-white rounded-2xl border border-dashed mt-8">
            {n.noNews}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors border",
                  page === i + 1 ? "bg-[#003F87] text-white border-[#003F87] shadow-md shadow-[#003F87]/20" : "bg-white text-muted-foreground hover:bg-gray-50 border-gray-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
