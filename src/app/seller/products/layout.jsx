'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Plus, LayoutDashboard, Sparkles, Bot, Eye } from 'lucide-react'

export default function ProductsLayout({ children }) {
  const pathname = usePathname()
  // FIX: /add এবং /new দুটোই Check করবে
  const isAdd = pathname.includes('/add') || pathname.includes('/new')
  const isManage = pathname === '/seller/products'

  return (
    <div className="min-h-screen bg-[#fafafb]">
      {/* ✅ PRO TOP BAR - ULTRA LIGHT - NO SIDEBAR */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-2xl border-b border-gray-100">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#F85606] via-purple-500 to-pink-500"></div>
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link href="/seller/dashboard" className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-full text-[11px] font-black hover:bg-black hover:text-white hover:border-black transition-all hover:scale-105">
              <LayoutDashboard size={12}/> Dashboard
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>
            <Link href="/seller/products" className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black border-2 transition-all hover:scale-105 ${isManage? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black border-black'}`}>
              <Package size={12}/> Manage {isManage && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>}
            </Link>
            <Link href="/seller/products/new" className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black border-2 transition-all hover:scale-105 ${isAdd? 'bg-[#F85606] text-white border-[#F85606] shadow-[0_8px_20px_rgba(248,86,6,0.3)]' : 'bg-yellow-300 text-black border-black'}`}>
              <Plus size={12}/> Add Product {isAdd && <Sparkles size={10} className="animate-pulse"/>}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full border border-purple-100"><Bot size={10}/> REAL AI + REAL DB</span>
            <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  )
}