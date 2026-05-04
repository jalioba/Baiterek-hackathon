export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#003F87] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-[#003F87] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-[#C8A951] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Загрузка...</div>
      </div>
    </div>
  );
}
