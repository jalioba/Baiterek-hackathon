export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end">
        <div>
          <div className="h-7 bg-gray-200 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded-lg w-48"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="h-11 w-11 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-32"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
