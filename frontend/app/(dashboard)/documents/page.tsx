import { FileText, Upload } from "lucide-react";
import { DOCUMENT_STATUS_LABELS, formatDate, formatFileSize } from "@/lib/utils";
import DocumentAnalyzer from "@/components/features/ai-assistant/DocumentAnalyzer";

const MOCK_DOCS = [
  { id: "d1", name: "Бизнес-план_2024.pdf", fileSize: 2457600, mimeType: "application/pdf", status: "SIGNED" as const, createdAt: "2024-04-01T10:00:00Z" },
  { id: "d2", name: "Финансовая_отчётность.xlsx", fileSize: 512000, mimeType: "application/vnd.ms-excel", status: "UPLOADED" as const, createdAt: "2024-03-28T09:00:00Z" },
  { id: "d3", name: "Сертификат_СТ1.pdf", fileSize: 1048576, mimeType: "application/pdf", status: "PENDING" as const, createdAt: "2024-04-12T11:00:00Z" },
];

const STATUS_COLORS = { PENDING: "bg-gray-100 text-gray-600", UPLOADED: "bg-blue-100 text-blue-700", SIGNED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2332]">Документы</h1>
      </div>
      
      <div className="mb-8">
        <DocumentAnalyzer />
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        {MOCK_DOCS.map((doc, i) => (
          <div key={doc.id} className={`flex items-center justify-between px-6 py-4 ${i < MOCK_DOCS.length - 1 ? "border-b" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F7FA]">
                <FileText size={18} className="text-[#003F87]" />
              </div>
              <div>
                <div className="font-medium text-[#1A2332]">{doc.name}</div>
                <div className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)} · {formatDate(doc.createdAt)}</div>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[doc.status]}`}>
              {DOCUMENT_STATUS_LABELS[doc.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
