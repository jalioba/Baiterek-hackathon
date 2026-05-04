import Link from "next/link";
import { ArrowRight, Building2, ChevronRight, Zap } from "lucide-react";
import { SUBSIDIARIES, SERVICES, NEWS } from "@/lib/mock-data";
import { formatDate, truncate } from "@/lib/utils";
import ServiceCard from "@/components/shared/ServiceCard";
import SearchBar from "@/components/shared/SearchBar";
import LiveStatsSection from "@/components/home/LiveStatsSection";
import SmartSelection from "@/components/home/SmartSelection";
import HowItWorks from "@/components/home/HowItWorks";
import HeroCounters from "@/components/home/HeroCounters";
import HomeStats from "@/components/home/HomeStats";

export default function HomePage() {
  const featured = SERVICES.filter((s) => s.isFeatured).slice(0, 6);
  const latestNews = NEWS.slice(0, 3);

  const TAGS = ["Финансирование", "Гарантии", "Экспорт", "Инновации", "Обучение"];

  return (
    <>
      {/* Hero Section */}
      <section className="baiterek-gradient relative overflow-hidden py-24 text-white">
        {/* Pattern Background */}
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 mix-blend-overlay" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Zap size={16} className="text-[#E8C96B]" />
              <span className="font-medium text-white/90">Официальный портал</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Единое окно поддержки <br className="hidden md:block" />
              <span className="text-[#E8C96B]">бизнеса Казахстана</span>
            </h1>
            
            <p className="mb-10 text-lg text-white/80 md:text-xl md:max-w-2xl">
              70+ мер государственной поддержки в одном месте. Субсидии, гранты, кредиты и лизинг от дочерних организаций холдинга Байтерек.
            </p>

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl mx-auto md:mx-0">
              <SearchBar size="lg" />
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {TAGS.map((tag) => (
                <Link key={tag} href={`/services?category=${tag}`} className="rounded-md bg-white/5 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/20 border border-white/10">
                  {tag}
                </Link>
              ))}
            </div>

            <HeroCounters />
          </div>
        </div>
      </section>

      {/* AI Smart Selection */}
      <SmartSelection />

      {/* Featured Services */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#1A2332]">Популярные услуги</h2>
              <p className="mt-2 text-lg text-muted-foreground">Самые востребованные меры государственной поддержки</p>
            </div>
            <Link href="/services" className="hidden items-center gap-2 rounded-lg bg-gray-50 px-5 py-2.5 font-medium text-[#003F87] transition hover:bg-gray-100 md:flex">
              Смотреть все <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/services" className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-6 py-3 font-medium text-[#003F87] transition hover:bg-gray-100">
              Смотреть все <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Subsidiaries */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#1A2332]">Дочерние организации</h2>
            <p className="mt-2 text-lg text-muted-foreground">Восемь специализированных институтов развития холдинга Байтерек</p>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SUBSIDIARIES.map((sub) => (
              <Link key={sub.id} href={`/subsidiaries/${sub.slug}`} className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-[#003F87]/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003F87]/0 to-[#003F87]/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F7FA] transition-colors group-hover:bg-[#003F87]/10">
                    <Building2 size={24} className="text-[#003F87]" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-gray-50 px-2 py-1 rounded-md">{SERVICES.filter(s => s.subsidiary.id === sub.id).length} услуг</span>
                </div>
                <div className="relative z-10">
                  <h3 className="mb-2 font-bold text-[#1A2332] group-hover:text-[#003F87] transition-colors">{sub.shortName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{sub.description}</p>
                </div>
                <div className="relative z-10 mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#003F87] opacity-0 transition-opacity group-hover:opacity-100">
                  Перейти <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-[#1A2332]">Пресс-центр</h2>
            <Link href="/news" className="flex items-center gap-2 rounded-lg bg-white border px-5 py-2.5 font-medium text-[#1A2332] transition hover:bg-gray-50">
              Все новости <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {latestNews.map((news) => (
              <Link key={news.id} href="/news" className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                {news.imageUrl && (
                  <div className="relative h-56 overflow-hidden">
                    <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#003F87]">
                      {news.category}
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 text-sm font-medium text-muted-foreground">{formatDate(news.publishedAt)}</div>
                  <h3 className="mb-3 text-lg font-bold leading-snug text-[#1A2332] group-hover:text-[#003F87] transition-colors line-clamp-2">{news.title}</h3>
                  <p className="mt-auto text-sm text-muted-foreground line-clamp-3">{news.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <LiveStatsSection />

    </>
  );
}
