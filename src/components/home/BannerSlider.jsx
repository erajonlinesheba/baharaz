'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    bg: '#E8F5E9',
    title: 'GLOW WITH CONFIDENCE,',
    sub: 'THROUGH EVERY SEASON',
    tag: '10.10 SHOPPING FEST',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=75&auto=format&fit=crop',
    link: '/products'
  },
  {
    id: 2,
    bg: '#FFF3E0',
    title: 'MEGA DEALS,',
    sub: 'EVERY DAY LOW PRICE',
    tag: '11.11 BIG SALE',
    discount: '70% OFF',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=75&auto=format&fit=crop',
    link: '/products'
  },
  {
    id: 3,
    bg: '#E3F2FD',
    title: 'STYLE FOR EVERY YOU,',
    sub: 'FASHION FEST LIVE',
    tag: 'NEW YEAR FEST',
    discount: '60% OFF',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=75&auto=format&fit=crop',
    link: '/products'
  }
]

export default function BannerSlider(){
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  useEffect(()=>{ setMounted(true) },[])

  useEffect(()=>{
    if(!mounted || paused || slides.length <= 1) return
    const i = setInterval(()=> setCurrent(p=> (p+1)%slides.length), 3500)
    return ()=> clearInterval(i)
  },[mounted, paused])

  if(!mounted){
    return <div className="w-full h-[180px] md:h-[340px] bg-[#E8F5E9] md:rounded-[8px] animate-pulse" />
  }

  const s = slides[current]

  const next = () => setCurrent(p=> (p+1)%slides.length)
  const prev = () => setCurrent(p=> (p-1+slides.length)%slides.length)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if(Math.abs(diff) > 50){
      if(diff > 0) next()
      else prev()
    }
  }

  return (
    <div
      className="relative w-full h-[180px] md:h-[340px] bg-white overflow-hidden md:rounded-[8px] select-none group"
      onMouseEnter={()=> setPaused(true)}
      onMouseLeave={()=> setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide */}
      <div className="w-full h-full flex" style={{background: s.bg}}>
        <div className="w-[60%] md:w-[55%] p-4 md:p-10 flex flex-col justify-center z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white text-[#D32F2F] text-[10px] md:text-[12px] font-bold px-2 py-0.5 border border-red-200 rounded-sm animate-bounce">{s.tag}</span>
            <span className="hidden md:block text-[12px] text-gray-500">| Himalaya Since 1930</span>
          </div>
          <h1 className="text-[#004D40] font-black text-[16px] md:text-[32px] leading-[1.1] uppercase drop-shadow-sm">
            {s.title}<br/>{s.sub}
          </h1>
          <div className="flex gap-2 mt-3">
            <div className="bg-[#4CAF50] text-white text-[10px] md:text-[11px] px-2 py-1 rounded">🚚 Free Delivery</div>
            <div className="bg-[#FF5722] text-white text-[10px] md:text-[11px] px-2 py-1 rounded">Voucher</div>
          </div>
          <Link href={s.link} className="mt-3 md:mt-4 bg-[#F85606] hover:bg-black text-white text-[12px] md:text-[14px] px-5 py-1.5 md:px-7 md:py-2 rounded-full w-fit font-bold transition-all">
            Shop Now →
          </Link>
        </div>

        <div className="w-[40%] md:w-[45%] relative h-full">
          <Image
            src={s.image}
            alt="banner"
            fill
            priority={current===0}
            sizes="(max-width: 768px) 40vw, 45vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 md:top-8 md:right-10 bg-[#FF5722] text-white w-[56px] h-[56px] md:w-[84px] md:h-[84px] rounded-full flex flex-col items-center justify-center font-black text-[11px] md:text-[14px] leading-tight shadow-lg animate-pulse">
            <span>UP TO</span>
            <span>{s.discount}</span>
          </div>
        </div>
      </div>

      {/* Arrows - Desktop Only - Daraz Style */}
      <button onClick={prev} className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition">‹</button>
      <button onClick={next} className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-8 h-8 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition">›</button>

      {/* Dots */}
      <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i)=>(
          <button
            key={i}
            onClick={()=> setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i===current? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>

      {/* Progress Bar - Amazon Style */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10">
        <div
          key={current}
          className="h-full bg-[#F85606] animate-[progress_3.5s_linear]"
          style={{ animationPlayState: paused? 'paused' : 'running' }}
        />
      </div>

      <style>{`@keyframes progress { from { width:0% } to { width:100% } }`}</style>
    </div>
  )
}