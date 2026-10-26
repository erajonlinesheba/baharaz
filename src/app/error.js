'use client'
export default function Error({ error, reset }){
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-10 bg-white/90 backdrop-blur-xl rounded-[20px] border border-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <h2 className="text-[18px] font-bold tracking-[-0.3px]">Something went wrong in this section</h2>
      <p className="text-[13px] text-gray-500 mt-2 max-w-[400px] text-center leading-[1.5]">This page has an issue, but Baharaz main site is still running. Other pages are safe - Isolation Working!</p>
      <button onClick={()=>reset()} className="mt-4 bg-black text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all">Try Again</button>
      <a href="/" className="mt-3 text-[12px] font-bold text-[#F85606]">← Go to Baharaz Home - Fastest Shopping</a>
    </div>
  )
}