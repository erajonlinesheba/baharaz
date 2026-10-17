'use client'
export function ProductSkeleton(){
  return(
    <div className="bg-white rounded-[16px] border p-3 animate-pulse">
      <div className="bg-[#F1F5F9] rounded-[12px] h-[180px] w-full shimmer"></div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-[#F1F5F9] rounded-full w-full"></div>
        <div className="h-3 bg-[#F1F5F9] rounded-full w-[70%]"></div>
        <div className="h-4 bg-[#F1F5F9] rounded-full w-[40%] mt-3"></div>
      </div>
      <style>{`.shimmer{background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  )
}
export function GridSkeleton(){
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i)=><ProductSkeleton key={i} />)}</div>
}