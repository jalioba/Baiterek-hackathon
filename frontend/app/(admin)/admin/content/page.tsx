import { Edit, Plus } from "lucide-react";
import { NEWS } from "@/lib/mock-data";
import { formatDate, truncate } from "@/lib/utils";

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2332]">Управление контентом</h1>
        <button className="flex items-center gap-2 rounded-lg bg-[#C8A951] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E8C96B] hover:text-[#1A2332]">
          <Plus size={15} /> Добавить новость
        </button>
      </div>
      <div className="rounded-xl bg-white shadow-sm">
        {NEWS.slice(0, 10).map((news, i) => (
          <div key={news.id} className={`flex items-center justify-between px-6 py-4 ${i < 9 ? "border-b" : ""}`}>
            <div className="flex items-center gap-4">
              {news.imageUrl && (
                <img src={news.imageUrl} alt="" className="h-12 w-16 rounded-lg object-cover" />
              )}
              <div>
                <div className="font-medium text-[#1A2332]">{truncate(news.title, 60)}</div>
                <div className="text-xs text-muted-foreground">{news.category} · {formatDate(news.publishedAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${news.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {news.isPublished ? "Опубликовано" : "Черновик"}
              </span>
              <button className="rounded p-1 hover:bg-[#F5F7FA]"><Edit size={15} className="text-muted-foreground" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
