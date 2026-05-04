export default function ServicesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-gradient-to-br from-[#003F87] to-[#0056B8] rounded-3xl p-8">
        <div className="h-6 bg-white/20 rounded-lg w-48 mb-3"></div>
        <div className="h-10 bg-white/20 rounded-lg w-96 mb-4"></div>
        <div className="h-12 bg-white/20 rounded-2xl w-full max-w-lg"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex gap-3 mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
            <div className="h-9 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
