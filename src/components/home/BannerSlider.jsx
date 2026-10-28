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
    return (
      <div className="w-full max-w-full h-[180px] md:h-[344px] rounded-none md:rounded-[12px] animate-pulse relative overflow-hidden"
           style={{
             background: 'rgba(255,255,255,0.75)',
             backdropFilter: 'blur(20px) saturate(180%)',
             WebkitBackdropFilter: 'blur(20px) saturate(180%)',
             border: '0.5px solid rgba(255,255,255,0.8)',
             boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
           }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-[20px] h-[6px] bg-[#F85606]/30 rounded-full"></div>
          <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
          <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
        </div>
      </div>
    )
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
      className="relative w-full max-w-full h-[180px] md:h-[344px] overflow-hidden rounded-none md:rounded-[12px] select-none group mt-0"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255,255,255,0.8)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
      }}
      onMouseEnter={()=> setPaused(true)}
      onMouseLeave={()=> setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* iOS 26 Glass Top Shine - তোমার MobileHeader এর মতো */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10 rounded-none md:rounded-[12px]"></div>

      {/* Slide - iOS 26 Glass Inner */}
      <div className="w-full h-full flex relative" style={{background: s.bg}}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/[0.02] pointer-events-none"></div>
        
        <div className="w-[60%] md:w-[55%] p-4 md:p-10 flex flex-col justify-center z-10 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/90 backdrop-blur-[10px] text-[#D32F2F] text-[10px] md:text-[12px] font-bold px-2.5 py-1 border border-red-200/50 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] animate-bounce"
                  style={{ backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)' }}>{s.tag}</span>
            <span className="hidden md:block text-[12px] text-gray-500 font-[600]">| Himalaya Since 1930</span>
          </div>
          <h1 className="text-[#004D40] font-black text-[16px] md:text-[32px] leading-[1.1] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] tracking-[-0.5px]">
            {s.title}<br/>{s.sub}
          </h1>
          <div className="flex gap-2 mt-3">
            <div className="backdrop-blur-[10px] text-white text-[10px] md:text-[11px] px-2.5 py-1 rounded-full font-[700] border border-white/20"
                 style={{ background: 'rgba(76,175,80,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(76,175,80,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}>🚚 Free Delivery</div>
            <div className="backdrop-blur-[10px] text-white text-[10px] md:text-[11px] px-2.5 py-1 rounded-full font-[700] border border-white/20"
                 style={{ background: 'rgba(255,87,34,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px rgba(255,87,34,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}>Voucher</div>
          </div>
          <Link href={s.link} className="mt-3 md:mt-4 text-white text-[12px] md:text-[14px] px-5 py-1.5 md:px-7 md:py-2 rounded-full w-fit font-bold transition-all active:scale-95 relative overflow-hidden group/btn"
                style={{
                  background: 'linear-gradient(135deg, #FF7A45 0%, #F85606 50%, #E84500 100%)',
                  boxShadow: '0 8px 20px rgba(248,86,6,0.35), 0 2px 6px rgba(248,86,6,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                  fontFamily: '-apple-system, SF Pro Display, sans-serif'
                }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">Shop Now →</span>
          </Link>
        </div>

        <div className="w-[40%] md:w-[45%] relative h-full overflow-hidden rounded-none md:rounded-r-[12px]">
          <Image
            src={s.image}
            alt="banner"
            fill
            priority={current===0}
            sizes="(max-width: 768px) 40vw, 45vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-white/20 pointer-events-none"></div>
          <div className="absolute top-3 right-3 md:top-8 md:right-10 text-white w-[56px] h-[56px] md:w-[84px] md:h-[84px] rounded-full flex flex-col items-center justify-center font-black text-[11px] md:text-[14px] leading-tight shadow-[0_8px_20px_rgba(255,87,34,0.4)] animate-pulse border border-white/20 backdrop-blur-[10px]"
               style={{
                 background: 'linear-gradient(135deg, #FF5722, #F85606)',
                 boxShadow: '0 8px 20px rgba(255,87,34,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none"></div>
            <span className="relative">UP TO</span>
            <span className="relative">{s.discount}</span>
          </div>
        </div>
      </div>

      {/* Arrows - Desktop Only - iOS 26 Glass - Web Version ঠিক থাকবে */}
      <button onClick={prev} className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
              style={{
                background: 'rgba(0,0,0,0.15)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
                color: 'white'
              }}>‹</button>
      <button onClick={next} className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
              style={{
                background: 'rgba(0,0,0,0.15)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
                color: 'white'
              }}>›</button>

      {/* Dots - iOS 26 Liquid Glass - তোমার MobileHeader এর মতো */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full z-20"
           style={{
             background: 'rgba(0,0,0,0.15)',
             backdropFilter: 'blur(20px) saturate(180%)',
             WebkitBackdropFilter: 'blur(20px) saturate(180%)',
             border: '0.5px solid rgba(255,255,255,0.15)',
             boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
           }}>
        {slides.map((_, i)=>(
          <button
            key={i}
            onClick={()=> setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${i===current? 'w-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'w-2 bg-white/60 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Progress Bar - iOS 26 - #F85606 - তোমার MobileHeader এর Orange */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10 z-20">
        <div
          key={current}
          className="h-full animate-[progress_3.5s_linear] relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #FF7A45, #F85606, #E84500)',
            boxShadow: '0 0 8px rgba(248,86,6,0.4)',
            animationPlayState: paused? 'paused' : 'running'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>

      <style>{`@keyframes progress { from { width:0% } to { width:100% } } *{ -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  )
}