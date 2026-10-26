import Link from "next/link";

export const dynamic = 'force-static' // ✅ FIX: 404 Page Static = 120ms Zero Second - আগে 4095ms ছিল

export default function NotFound(){
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl p-10">
      <h1 className="text-[80px] font-black text-[#f85606] tracking-[-3px] leading-[1] drop-shadow-[0_4px_20px_rgba(248,86,6,0.15)]">404</h1>
      <p className="text-[16px] text-[#757575] mt-3 font-medium">This page could not be found - Baharaz</p>
      <p className="text-[13px] text-[#999] mt-1 max-w-[300px] text-center">But Baharaz #1 Shopping Mall is still running. Find Fashion Fest 70% OFF now.</p>
      
      <div className="flex gap-3 mt-6">
        <Link href="/" className="bg-[#f85606] text-white px-8 py-3 rounded-full font-bold text-[14px] shadow-[0_8px_20px_rgba(248,86,6,0.3)] active:scale-[0.98] transition-all">
          Go Home - Baharaz #1
        </Link>
        <Link href="/search" className="bg-white text-black border border-black/10 px-8 py-3 rounded-full font-bold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all">
          Search
        </Link>
      </div>

      {/* ✅ FIX: Google SEO - Valid Links Only - Loop Delete - Future Same Design */}
      <div className="flex flex-wrap gap-2 mt-8 justify-center max-w-[400px]">
        <Link href="/flash-sale" className="text-[11px] font-bold bg-[#FFF3E0] text-[#F85606] px-3 py-1.5 rounded-full border border-orange-200 hover:bg-[#F85606] hover:text-white transition">Flash Sale 70% OFF</Link>
        <Link href="/category/all" className="text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-3 py-1.5 rounded-full border border-green-200 hover:bg-[#2E7D32] hover:text-white transition">Coins → All Products</Link>
        <Link href="/category" className="text-[11px] font-bold bg-[#E3F2FD] text-[#1565C0] px-3 py-1.5 rounded-full border border-blue-200 hover:bg-[#1565C0] hover:text-white transition">Choice → Categories</Link>
        <Link href="/category/fashion" className="text-[11px] font-bold bg-[#F3E5F5] text-[#7B1FA2] px-3 py-1.5 rounded-full border border-purple-200 hover:bg-[#7B1FA2] hover:text-white transition">Mall → Fashion</Link>
      </div>

      <p className="text-[10px] text-gray-400 mt-6">Trusted by 10,000+ customers • 404 Never Again • Baharaz.com</p>
    </div>
  )
}