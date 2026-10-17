'use client'
export default function Error({ error, reset }){
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-10 bg-white">
      <h2 className="text-[18px] font-bold">Something went wrong in this section</h2>
      <p className="text-[13px] text-gray-500 mt-2 max-w-[400px] text-center">This page has an issue, but Baharaz main site is still running. Other pages are safe - Isolation Working!</p>
      <button onClick={()=>reset()} className="mt-4 bg-black text-white px-6 py-2 rounded-full text-[13px] font-bold">Try Again</button>
    </div>
  )
}