"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-bold text-[#1A2332] mb-3">Упс, что-то пошло не так</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        При загрузке страницы произошла непредвиденная ошибка. Мы уже работаем над её устранением.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-[#003F87] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0056B8] transition-colors shadow-lg shadow-blue-500/20"
      >
        <RefreshCcw size={18} />
        Попробовать снова
      </button>
    </div>
  );
}
