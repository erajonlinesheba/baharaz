'use client'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const CategoryMegaMenu = dynamic(() => import('./CategoryMegaMenu'), { 
  ssr: false,
  loading: () => <div className="w-[280px] h-[400px] bg-white animate-pulse rounded-xl border border-gray-100" />
})

export default function CategoryBar(){
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  // ✅ Fast + বাইরে ক্লিক করলে বন্ধ
  useEffect(()=>{
    const handleClick = (e) => {
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return ()=> document.removeEventListener('mousedown', handleClick)
  },[])

  // ✅ Hover - Fast, সুন্দর, flicker করবে না
  const handleEnter = () => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div ref={ref} className="w-full h-[44px] bg-white flex items-center relative">
      {/* ✅ রাইট মাপ - 1188px, ডানে বামে একদম সেন্টার, বড় না ছোট না */}
      <div className="w-full max-w-[1188px] mx-auto px-3 md:px-0 flex items-center h-full">
        <div 
          className="relative w-fit h-full flex items-center"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <button 
            onClick={()=> setOpen(!open)}
            className="flex items-center gap-[8px] text-[#0F71FF] font-bold text-[14px] leading-none hover:text-[#F85606] select-none h-full px-1 transition-colors duration-150"
            aria-expanded={open}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span className="tracking-[-0.1px]">Categories</span>
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {/* ✅ Mega Menu - রাইট মাপ, ফাস্ট, সুন্দর shadow */}
          {open && (
            <div className="absolute top-[44px] left-0 z-[9999] shadow-[0_12px_40px_rgba(0,0,0,0.14)] rounded-b-[12px] overflow-hidden bg-white border border-t-0 border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200 will-change-transform">
              <CategoryMegaMenu onClose={()=> setOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}