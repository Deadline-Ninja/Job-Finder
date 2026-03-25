const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
);

export function JobCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gray-50 border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
      <Shimmer />
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gray-50 border border-[#E5E7EB] shadow-sm rounded-2xl p-8">
        <Shimmer />
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative overflow-hidden bg-gray-50 border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
            <Shimmer />
            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
            <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
