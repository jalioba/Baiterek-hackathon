export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Skeleton */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="h-5 bg-gray-200 rounded-lg w-48 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-96 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded-lg w-72"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-7 bg-gray-200 rounded-lg w-12 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-24"></div>
          </div>
        ))}
      </div>

      {/* Applications Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded-lg w-40"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 border-b border-gray-50 flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-100 rounded-xl flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-40"></div>
            </div>
            <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
