'use client'
import BannerSlider from './BannerSlider'
import FlashSale from './FlashSale'
import Categories from './Categories'
import JustForYou from './JustForYou'

export default function HomeClient(){
  return (
    <div className="w-full bg-[#f5f5f5] min-h-screen">
      <div id="top" className="w-full max-w-[1200px] mx-auto px-0 lg:px-4">
        <div className="w-full"><BannerSlider /></div>
        <div className="w-full mt-2 h-[90px] md:h-[110px] bg-gradient-to-r from-[#FFC107] to-[#FF5722] lg:rounded-[12px] flex items-center overflow-hidden relative shadow-sm">
           <div className="absolute left-4 bg-[#D32F2F] text-white font-black px-4 py-1.5 rounded-full text-[11px] animate-pulse shadow">SHOP NOW</div>
           <div className="mx-auto text-center"><h2 className="text-white font-black text-[20px] md:text-[28px] drop-shadow">10.10 Shopping Fest</h2><p className="text-white text-[11px] font-bold tracking-widest">9 OCT 15:00 - 19 OCT • Up to 80% OFF</p></div>
        </div>
      </div>
      <div id="flash-sale" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20"><FlashSale /></div>
      <div id="categories" className="max-w-[1200px] mx-auto mt-3 px-2 lg:px-4 scroll-mt-20"><Categories /></div>
      <div id="just-for-you" className="max-w-[1200px] mx-auto mt-3 pb-[80px] px-2 lg:px-4 scroll-mt-20"><JustForYou /></div>
    </div>
  )
}