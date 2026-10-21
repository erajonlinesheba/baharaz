'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

// ✅ FAST - Banner is LCP, so ssr: true for Google #1 - iOS 26 Glass
const BannerSlider = dynamic(() => import('./BannerSlider'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-[180px] md:h-[340px] animate-pulse md:rounded-[20px] relative overflow-hidden"
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
})

// ✅ Others - Lazy but Prefetched - Zero Second - iOS 26 Glass
const FlashSale = dynamic(() => import('./FlashSale'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-[20px] p-4 relative overflow-hidden"
         style={{
           background: 'rgba(255,255,255,0.75)',
           backdropFilter: 'blur(20px) saturate(180%)',
           WebkitBackdropFilter: 'blur(20px) saturate(180%)',
           border: '0.5px solid rgba(255,255,255,0.8)',
           boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
         }}>
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-[#F85606]/20 to-transparent"></div>
      <div className="h-6 w-32 bg-black/10 rounded-full animate-pulse mb-3"></div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Array.from({length:6}).map((_,i)=> (
          <div key={i} className="h-[140px] rounded-[16px] animate-pulse relative overflow-hidden"
               style={{
                 background: 'rgba(255,255,255,0.8)',
                 border: '0.5px solid rgba(0,0,0,0.04)',
                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,1)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  )
})

const Categories = dynamic(() => import('./Categories'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-[20px] p-4 relative overflow-hidden"
         style={{
           background: 'rgba(255,255,255,0.75)',
           backdropFilter: 'blur(20px) saturate(180%)',
           WebkitBackdropFilter: 'blur(20px) saturate(180%)',
           border: '0.5px solid rgba(255,255,255,0.8)',
           boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
         }}>
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-black/[0.04] to-transparent"></div>
      <div className="h-5 w-24 bg-black/10 rounded-full animate-pulse mb-3"></div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {Array.from({length:8}).map((_,i)=> (
          <div key={i} className="h-[70px] rounded-[20px] animate-pulse relative overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,243,240,0.8))',
                 border: '0.5px solid rgba(255,255,255,0.8)',
                 boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[20px]"></div>
          </div>
        ))}
      </div>
    </div>
  )
})

const JustForYou = dynamic(() => import('./JustForYou'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-[20px] p-4 relative overflow-hidden"
         style={{
           background: 'rgba(255,255,255,0.75)',
           backdropFilter: 'blur(20px) saturate(180%)',
           WebkitBackdropFilter: 'blur(20px) saturate(180%)',
           border: '0.5px solid rgba(255,255,255,0.8)',
           boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
         }}>
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-black/[0.04] to-transparent"></div>
      <div className="h-6 w-32 bg-black/10 rounded-full animate-pulse mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({length:10}).map((_,i)=> (
          <div key={i} className="h-[180px] rounded-[20px] animate-pulse relative overflow-hidden"
               style={{
                 background: 'rgba(255,255,255,0.9)',
                 border: '0.5px solid rgba(0,0,0,0.04)',
                 boxShadow: '0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#F85606]/10 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  )
})

const BaharazMall = dynamic(() => import('./BaharazMall'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] animate-pulse rounded-[20px] relative overflow-hidden"
         style={{
           background: 'rgba(255,255,255,0.75)',
           backdropFilter: 'blur(20px) saturate(180%)',
           WebkitBackdropFilter: 'blur(20px) saturate(180%)',
           border: '0.5px solid rgba(255,255,255,0.8)',
           boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
         }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
    </div>
  )
})

const FloatingSideNav = dynamic(() => import('./FloatingSideNav'), {
  ssr: false,
  loading: () => null
})

export default function HomeClient(){

  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const prefetchImages = () => {
        if('requestIdleCallback' in window){
          requestIdleCallback(()=>{
            try{
              const lastList = sessionStorage.getItem('baharaz_last_list')
              if(!lastList){
                const homeCache = localStorage.getItem('baharaz_home_cache')
                if(homeCache) sessionStorage.setItem('baharaz_last_list', homeCache)
              }
            }catch{}
          })
        }
      }
      prefetchImages()
    }
  }, [])

  return (
    <div className="w-full bg-[#f5f3f0] md:bg-[#f5f5f5] min-h-screen relative">
      {/* iOS 26 Background Glow - Mobile Only */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none overflow-hidden md:hidden">
        <div className="absolute -top-[60px] -left-[60px] w-[280px] h-[280px] bg-gradient-to-br from-[#F85606]/12 via-[#FF9500]/8 to-transparent rounded-full blur-[35px]"></div>
        <div className="absolute -top-[40px] -right-[60px] w-[260px] h-[260px] bg-gradient-to-bl from-[#AF52DE]/10 via-[#5856D6]/6 to-transparent rounded-full blur-[35px]"></div>
      </div>

      {/* ✅ FIXED - Daraz 1 নম্বর ছবির মতো - Mobile এ Banner MobileHeader থেকে আসবে, তাই এখানে Desktop Only */}
      <div className="w-full bg-transparent">
        <div id="top" className="w-full max-w-[1200px] mx-auto px-0 lg:px-4 relative">
          {/* Desktop Banner Only - Mobile এ MobileHeader এর Banner দেখাবে, Double হবে না */}
          <div className="w-full hidden md:block"><BannerSlider /></div>
          
          {/* 10.10 Fest - Banner এর ঠিক নিচে - Mobile + Desktop */}
          <div className="w-full mt-0 md:mt-2 h-[90px] md:h-[110px] lg:rounded-[20px] flex items-center overflow-hidden relative"
               style={{
                 background: 'linear-gradient(135deg, #FFC107 0%, #FF9500 50%, #FF5722 100%)',
                 boxShadow: '0 10px 30px rgba(255,87,34,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                 border: '0.5px solid rgba(255,255,255,0.2)'
               }}>
             <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
             <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
             <div className="absolute left-4 bg-[#D32F2F] text-white font-black px-4 py-1.5 rounded-full text-[11px] shadow-[0_4px_12px_rgba(211,47,47,0.4)] animate-pulse border border-white/20">SHOP NOW</div>
             <div className="mx-auto text-center relative z-10">
               <h2 className="text-white font-black text-[20px] md:text-[28px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] tracking-[-0.5px]">10.10 Shopping Fest</h2>
               <p className="text-white text-[11px] font-bold tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">9 OCT 15:00 - 19 OCT • Up to 80% OFF • Zero Second Fast</p>
             </div>
          </div>
        </div>
      </div>

      {/* Voucher Bar */}
      <div className="w-full max-w-[1200px] mx-auto px-0 lg:px-4 mt-0 md:mt-3">
        <div className="w-full h-[42px] bg-white md:rounded-[20px] flex items-center px-3 justify-between border-b md:border border-black/5 relative overflow-hidden"
             style={{
               background: 'rgba(255,255,255,0.9)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
             }}>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-black">🎟️ Claim Vouchers to Save More!</span>
            <span className="hidden md:flex items-center gap-2">
              <span className="bg-[#FFF3E0] text-[#F85606] text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">5% OFF</span>
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">৳80 Free Shipping</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#F85606]">Collect All →</span>
        </div>
      </div>

      {/* Flash Sale */}
      <div id="flash-sale" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20 relative">
        <FlashSale />
      </div>

      {/* Categories */}
      <div id="categories" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20 relative">
        <Categories />
      </div>

      {/* Baharaz Mall */}
      <div id="baharaz-mall" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20 relative">
        <BaharazMall />
      </div>

      {/* Just For You */}
      <div id="just-for-you" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20 relative">
        <JustForYou />
      </div>

      {/* Footer Spacer */}
      <div className="w-full h-[120px] block md:hidden bg-transparent" />
      <div className="w-full h-[40px] hidden md:block bg-transparent" />

      {/* Floating Side Nav */}
      <div className="hidden lg:block">
        <FloatingSideNav />
      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}