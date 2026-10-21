export default function Loading() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      <div className="max-w-[1320px] mx-auto p-2 md:p-4">
        {/* Breadcrumb Skeleton */}
        <div className="bg-white rounded-2xl p-4 mb-2 flex gap-3 items-center border shadow-sm">
          <div className="h-3 bg-gray-100 rounded w-12 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-3"></div>
          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-3"></div>
          <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
        </div>

        <div className="bg-white lg:rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_360px] gap-0">
            
            {/* Left - Image Skeleton */}
            <div className="bg-white p-2 lg:p-5 space-y-4">
              <div className="h-[320px] lg:h-[380px] bg-gray-100 rounded-2xl animate-pulse border"></div>
              <div className="flex gap-3 p-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-[64px] h-[64px] bg-gray-100 rounded-xl animate-pulse border"></div>
                ))}
              </div>
            </div>

            {/* Center - Info Skeleton */}
            <div className="px-4 lg:px-7 py-4 lg:py-5 border-r space-y-5">
              <div className="space-y-3">
                <div className="h-6 bg-gray-100 rounded-lg w-full animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded-lg w-5/6 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mt-3"></div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <div className="h-4 bg-gray-100 rounded-full w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded-full w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded-full w-20 animate-pulse"></div>
              </div>
              
              <div className="h-[110px] bg-[#fafafa] border-2 border-[#f0f0f0] rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="h-8 bg-gray-100 rounded w-32"></div>
                <div className="h-4 bg-gray-100 rounded w-48"></div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-100 rounded-xl w-20 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-xl w-20 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-xl w-20 animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-11 bg-gray-100 rounded-xl w-12 animate-pulse"></div>
                  <div className="h-11 bg-gray-100 rounded-xl w-12 animate-pulse"></div>
                  <div className="h-11 bg-gray-100 rounded-xl w-12 animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-[52px] bg-gray-100 rounded-xl flex-1 animate-pulse"></div>
                <div className="h-[52px] bg-gray-100 rounded-xl flex-1 animate-pulse"></div>
              </div>

              <div className="pt-6 border-t space-y-3">
                <div className="h-5 bg-gray-100 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>

            {/* Right - Delivery Skeleton */}
            <div className="bg-[#f9fafb] p-3 space-y-3">
              <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-32"></div>
                <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
              </div>
              <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4 animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-[56px] h-[56px] bg-gray-100 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-100 rounded-xl flex-1"></div>
                  <div className="h-10 bg-gray-100 rounded-xl flex-1"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}