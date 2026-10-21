'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'

const CategoryMegaMenu = dynamic(() => import('./CategoryMegaMenu'), { 
  ssr: false,
  loading: () => <div className="w-[280px] h-[400px] bg-white animate-pulse rounded-xl" />
})

export default function CategoryBar(){
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(()=>{
    const handleClick = (e) => {
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return ()=> document.removeEventListener('mousedown', handleClick)
  },[])

  return (
    <div ref={ref} className="w-full bg-white border-b">
      <div className="w-full max-w-[1188px] mx-auto px-3 md:px-0">
        <div className="relative w-fit h-[40px] md:h-[38px] flex items-center">
          <button 
            onClick={()=> setOpen(!open)}
            onMouseEnter={()=> setOpen(true)}
            className="flex items-center gap-1.5 text-[#0F71FF] font-bold text-[14px] hover:text-[#F85606] select-none"
          >
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            Categories
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {open && (
            <div onMouseLeave={()=> setOpen(false)} className="absolute top-[40px] md:top-[38px] left-0 z-[9999] shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <CategoryMegaMenu onClose={()=> setOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}