'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const BannerSlider = dynamic(() => import('./BannerSlider'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-[180px] md:h-[344px] bg-[#e5e5e5] animate-pulse md:rounded-[4px]"></div>
  )
})

const FlashSale = dynamic(() => import('./FlashSale'), {
  ssr: true,
  loading: () => (
    <div className="w-full bg-white md:rounded-[4px] p-4">
      <div className="h-6 w-32 bg-gray-200 animate-pulse mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-0 border border-[#e5e5e5]">
        {Array.from({length:6}).map((_,i)=> (
          <div key={i} className="h-[220px] bg-gray-50 animate-pulse border-r border-b border-[#e5e5e5]"></div>
        ))}
      </div>
    </div>
  )
})

const DailySheraDeals = dynamic(() => import('./DailySheraDeals'), {
  ssr: true,
  loading: () => (
    <div className="w-full bg-white md:rounded-[4px] p-4">
      <div className="h-6 w-48 bg-gray-200 animate-pulse mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-0 border border-[#e5e5e5]">
        {Array.from({length:6}).map((_,i)=> (
          <div key={i} className="h-[220px] bg-gray-50 animate-pulse border-r border-b border-[#e5e5e5]"></div>
        ))}
      </div>
    </div>
  )
})

const TopRanking = dynamic(() => import('./TopRanking'), {
  ssr: true,
  loading: () => (
    <div className="w-full bg-white md:rounded-[4px] p-4">
      <div className="h-6 w-32 bg-gray-200 animate-pulse mb-4"></div>
      <div className="flex gap-3">
        {Array.from({length:6}).map((_,i)=> (
          <div key={i} className="min-w-[188px] h-[220px] bg-gray-50 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
})

const Categories = dynamic(() => import('./Categories'), {
  ssr: true,
  loading: () => (
    <div className="w-full bg-white md:rounded-[4px] p-4">
      <div className="h-6 w-24 bg-gray-200 animate-pulse mb-4"></div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-0 border border-[#e5e5e5]">
        {Array.from({length:16}).map((_,i)=> (
          <div key={i} className="h-[148px] bg-gray-50 animate-pulse border-r border-b border-[#e5e5e5]"></div>
        ))}
      </div>
    </div>
  )
})

const JustForYouMobile = dynamic(() => import('./JustForYouMobile'), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="bg-white px-2 py-2 flex gap-2 overflow-x-auto scrollbar-hide mb-[6px]">
        {Array.from({length:8}).map((_,i)=> <div key={i} className="h-8 w-28 bg-gray-100 animate-pulse rounded-full flex-shrink-0"/>)}
      </div>
      <div className="grid grid-cols-2 gap-[6px] p-[6px]">
        {Array.from({length:12}).map((_,i)=> <div key={i} className="h-[260px] bg-white animate-pulse rounded-[10px]"/>)}
      </div>
    </div>
  )
})

const JustForYouDesktop = dynamic(() => import('./JustForYouDesktop'), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-3 p-3">
        {Array.from({length:18}).map((_,i)=> <div key={i} className="h-[260px] bg-white animate-pulse"/>)}
      </div>
    </div>
  )
})

const BaharazMall = dynamic(() => import('./BaharazMall'), {
  ssr: false,
  loading: () => <div className="w-full h-[200px] bg-white animate-pulse md:rounded-[4px]"></div>
})

const FloatingSideNav = dynamic(() => import('./FloatingSideNav'), {
  ssr: false,
  loading: () => null
})

export default function HomeClient(){
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(()=>{
    try{
      const token = localStorage.getItem('token') || localStorage.getItem('baharaz_token') || localStorage.getItem('baharaz_user') || sessionStorage.getItem('user')
      if(token) setIsLoggedIn(true)
    }catch{}
  }, [])

  return (
    <div className="w-full bg-[#f5f5f5] min-h-screen">
      <div className="w-full max-w-[1188px] mx-auto">
        
        {/* Banner - Desktop 344px as Daraz */}
        <div id="top" className="w-full">
          {!isLoggedIn ? (
            <>
              <div className="hidden md:block mt-3">
                <BannerSlider />
              </div>
              <div className="block md:hidden mt-0 w-full h-[76px] bg-gradient-to-r from-[#FFC107] to-[#FF5722] flex items-center justify-center relative">
                <div className="bg-[#D32F2F] text-white font-black px-3 py-1 rounded-full text-[10px] absolute left-3">SHOP NOW</div>
                <div className="text-center">
                  <h2 className="text-white font-black text-[18px]">10.10 Shopping Fest</h2>
                  <p className="text-white text-[10px] font-bold">9 OCT - 19 OCT • Up to 80% OFF</p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Voucher Strip - Daraz Like */}
        <div className="w-full mt-0 md:mt-3">
          <div className="w-full h-[40px] bg-white md:rounded-[4px] flex items-center px-3 justify-between border-b md:border border-[#e5e5e5] md:border-b">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-normal">🎟️ Claim Vouchers to Save More!</span>
              <span className="hidden md:flex gap-2">
                <span className="bg-[#fff3e0] text-[#f85606] text-[11px] px-2 py-0.5 rounded">5% OFF</span>
                <span className="bg-[#e8f5e9] text-[#2e7d32] text-[11px] px-2 py-0.5 rounded">৳80 Free Shipping</span>
              </span>
            </div>
            <span className="text-[12px] font-bold text-[#1a9cb7]">Collect All &gt;</span>
          </div>
        </div>

        {/* Flash Sale - DESKTOP + MOBILE BOTH */}
        <div id="flash-sale" className="w-full mt-0 md:mt-4 bg-white md:rounded-[4px] overflow-hidden">
          <FlashSale />
        </div>

        {/* Categories - DESKTOP ONLY - Phone Hide */}
        <div id="categories" className="w-full mt-3 md:mt-4 bg-white md:rounded-[4px] overflow-hidden hidden md:block">
          <div className="px-4 pt-4 pb-0">
            <h2 className="text-[20px] md:text-[22px] font-normal text-[#424242]">Categories</h2>
          </div>
          <div className="mt-3">
            <Categories />
          </div>
        </div>

        {/* Top Ranking - MOBILE ONLY - Desktop Hide */}
        <div id="top-ranking" className="w-full mt-[6px] md:mt-4 bg-white md:rounded-[4px] overflow-hidden block md:hidden">
          <TopRanking />
        </div>

        {/* BaharazMall - MOBILE ONLY - Desktop Hide */}
        <div id="baharaz-mall" className="w-full mt-[6px] md:mt-4 bg-white md:rounded-[4px] overflow-hidden block md:hidden">
          <BaharazMall />
        </div>

        {/* Daily Deals - MOBILE ONLY - Desktop Hide */}
        <div id="daily-deals" className="w-full mt-[6px] md:mt-4 bg-white md:rounded-[4px] overflow-hidden block md:hidden">
          <DailySheraDeals />
        </div>

        {/* Just For You - ALADA ALADA FILE - Phone Alada Desktop Alada */}
        <div id="just-for-you" className="w-full mt-[6px] md:mt-4">
          <div className="px-3 md:px-0 mb-2 flex justify-between items-center bg-white md:bg-transparent py-3 md:py-0">
            <h2 className="text-[16px] md:text-[22px] font-bold md:font-normal text-[#212121] md:text-[#424242]">Just For You</h2>
            <Link href="/just-for-you" className="text-[#1a9cb7] text-[12px] md:text-[14px] font-medium md:font-normal border border-[#1a9cb7] md:border-[#1a9cb7] px-3 md:px-4 py-1 md:py-1.5 rounded-[2px] hover:bg-[#e3f2fd]">VIEW ALL</Link>
          </div>
          {/* Phone - TAB সহ */}
          <div className="block md:hidden">
            <JustForYouMobile />
          </div>
          {/* Desktop - TAB ছাড়া - Daraz Style */}
          <div className="hidden md:block">
            <JustForYouDesktop />
          </div>
        </div>

        <div className="w-full h-[80px] md:h-[40px]" />
      </div>

      <div className="hidden lg:block">
        <FloatingSideNav />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}