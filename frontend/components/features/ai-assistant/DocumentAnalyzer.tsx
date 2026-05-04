"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentAnalyzerProps {
  onAnalyzeComplete?: (success: boolean) => void;
}

export default function DocumentAnalyzer({ onAnalyzeComplete }: DocumentAnalyzerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "success" | "error">("idle");
  const [issues, setIssues] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setStatus("analyzing");
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock logic: if PDF - success, otherwise error
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setStatus("success");
        onAnalyzeComplete?.(true);
      } else {
        setStatus("error");
        setIssues([
          "Ожидаемый формат файла: PDF (Справка eGov)",
          "Отсутствует цифровая подпись NCA",
          "Возможно, загружен скан плохого качества"
        ]);
        onAnalyzeComplete?.(false);
      }
    }, 2500);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setIssues([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-4 flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <Sparkles size={20} className="text-[#003F87]" />
        </div>
        <div>
          <h3 className="font-bold text-[#1A2332]">AI Проверка документов</h3>
          <p className="text-xs text-muted-foreground">Нейросеть проверит документ перед отправкой</p>
        </div>
      </div>

      <div className="p-6">
        {status === "idle" && (
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-gray-50",
              isDragging ? "border-[#003F87] bg-blue-50/50" : "border-gray-300 hover:bg-gray-100"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <UploadCloud size={24} className={isDragging ? "text-[#003F87]" : "text-gray-400"} />
              </div>
              <p className="mb-1 text-sm text-gray-500 font-medium">
                <span className="text-[#003F87]">Нажмите для загрузки</span> или перетащите файл
              </p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG (до 10MB)</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        )}

        {status === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative mb-4">
              <FileText size={48} className="text-gray-300" />
              <div className="absolute inset-0 bg-blue-500/20 rounded mix-blend-overlay animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 font-medium text-[#1A2332]">
              <Loader2 size={16} className="animate-spin text-[#003F87]" />
              AI анализирует документ...
            </div>
            <p className="text-xs text-muted-foreground mt-1">Извлечение данных и проверка форматов</p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <CheckCircle size={120} className="text-green-500" />
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-green-100 p-2 rounded-full mt-1">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-green-800 text-lg">Документ проверен</h4>
                <p className="text-sm text-green-700 mt-1 mb-3">
                  Файл <strong>{file?.name}</strong> соответствует всем требованиям и готов к отправке.
                </p>
                <button onClick={reset} className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                  Загрузить другой
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-2 rounded-full mt-1">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-lg">Найдены замечания</h4>
                <p className="text-sm text-red-700 mt-1 mb-3">
                  AI-ассистент обнаружил проблемы в файле <strong>{file?.name}</strong>:
                </p>
                <ul className="space-y-1 mb-4">
                  {issues.map((issue, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> {issue}
                    </li>
                  ))}
                </ul>
                <button onClick={reset} className="text-xs font-semibold text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                  Загрузить исправленный файл
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
