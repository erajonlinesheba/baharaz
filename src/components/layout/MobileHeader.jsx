"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MobileHeader({ cartCount = 0, wishlistCount = 0 }) {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState("bra for girls");
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const placeholders = ["bra for girls", "smart watch", "watch for man", "t-shirt for men", "earbuds"];
  
  const banners = [
    { id: 1, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", title: "Fashion Fest", subtitle: "Up to 70% OFF", bg: "linear-gradient(135deg, #FF6B9D, #FF8A00)" },
    { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", title: "Flash Sale", subtitle: "Live Now", bg: "linear-gradient(135deg, #667EEA, #764BA2)" },
    { id: 3, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800", title: "Mega Deal", subtitle: "Today Only", bg: "linear-gradient(135deg, #F093FB, #F5576C)" },
  ];

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      idx = (idx + 1) % placeholders.length;
      setPlaceholder(placeholders[idx]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const b = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(b);
  }, []);

  const handleHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  const handleSearch = () => {
    handleHaptic();
    const q = searchText.trim() || placeholder;
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="w-full md:hidden bg-white relative overflow-hidden">
      
      {/* BANNER + SEARCH - Search Box ছোট, Banner Size ঠিক */}
      <div className="w-full relative overflow-hidden" style={{ height: '185px' }}>
        
        {/* Banner Background - সুন্দর করে দেখাবে */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: banner.bg }}
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>
            </div>
          ))}
        </div>

        {/* SEARCH BAR - ছোট Size - 40px - ঠিক মাপ */}
        <div className="relative z-20 w-full px-2.5 pt-[8px] pb-2 flex items-center gap-2">
          <div className="flex-1 h-[40px] flex items-center pl-3 pr-1 gap-2 overflow-hidden shrink min-w-0 transition-all duration-500"
               style={{
                 background: isFocused ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.94)',
                 backdropFilter: 'blur(24px) saturate(180%)',
                 WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                 borderRadius: '20px',
                 border: isFocused ? '1.5px solid #F85606' : '0.5px solid rgba(255,255,255,0.9)',
                 boxShadow: isFocused 
                   ? '0 0 0 3px rgba(248,86,6,0.12), 0 6px 20px rgba(0,0,0,0.20)'
                   : '0 3px 12px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,1)',
               }}>
            
            <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0"
                 style={{
                   background: isFocused ? '#F85606' : 'rgba(248,86,6,0.12)',
                   color: isFocused ? 'white' : '#F85606'
                 }}>
              <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholder}
              className="flex-1 h-full bg-transparent outline-none border-0 text-[13px] text-black placeholder:text-[#a0a0a0] min-w-0 font-[600]"
            />
            
            <button
              onClick={() => { handleHaptic(); router.push('/search/image'); }}
              className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-full active:scale-90 transition-all duration-200"
              style={{
                background: 'rgba(0,0,0,0.05)',
              }}>
              <svg className="w-[16px] h-[16px] text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={handleSearch}
              className="h-[30px] px-[14px] shrink-0 text-white rounded-full flex items-center justify-center font-[700] text-[12px] active:scale-90 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #FF7A45 0%, #F85606 100%)',
                boxShadow: '0 3px 10px rgba(248,86,6,0.30)',
              }}>
              Search
            </button>
          </div>

          <Link href="/digital-goods" onClick={handleHaptic} className="w-[46px] h-[40px] shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-[12px] active:scale-95 transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  backdropFilter: 'blur(16px)',
                  border: '0.5px solid rgba(255,255,255,1)',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.12)'
                }}>
            <span className="text-[14px] leading-none">📱</span>
            <span className="text-[5px] font-[800] leading-[5px] text-center text-[#1a1a1a]">DIGITAL<br/>GOODS</span>
          </Link>
        </div>

        {/* Banner Content - Fashion Fest - Banner এর নিচে সুন্দর */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 100%)' }}>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-white text-[18px] font-[900] leading-[18px] tracking-[-0.3px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {banners[currentBanner].title}
              </h2>
              <p className="text-white/95 text-[11px] font-[600] mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {banners[currentBanner].subtitle}
              </p>
              <div className="flex gap-1 mt-2">
                {banners.map((_, idx) => (
                  <span key={idx} className={`h-[3px] rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-[14px] bg-white' : 'w-[3px] bg-white/50'}`}></span>
                ))}
              </div>
            </div>
            <button className="bg-white text-black text-[10px] font-[800] px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] active:scale-95 transition-all">
              Shop Now ›
            </button>
          </div>
        </div>
      </div>

      {/* Safe Payment - Banner এর নিচে আলাদা */}
      <div className="w-full h-[36px] bg-[#2B2B2B] flex items-center justify-between px-4 text-white text-[10px] font-[700] tracking-[0.2px]">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,255,255,0.15)' }}>🛡️</span>
          <span>Safe Payment</span>
        </div>
        <span className="w-[0.5px] h-[14px] bg-white/15 shrink-0"></span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,255,255,0.15)' }}>🚚</span>
          <span>Fast Delivery</span>
        </div>
        <span className="w-[0.5px] h-[14px] bg-white/15 shrink-0"></span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,255,255,0.15)' }}>↩️</span>
          <span>Free Return</span>
        </div>
      </div>

      {/* Icons - Banner এর নিচে আলাদা সাদা Background */}
      <div className="w-full bg-white px-2 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1">
          <Link href="/coins" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-[60px] h-[54px] rounded-[14px] flex overflow-hidden border bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="w-[26px] h-full flex flex-col items-center justify-center text-white" style={{ background: 'linear-gradient(180deg, #0a5cff, #0040cc)' }}>
                <span className="text-[5px] font-[800] leading-[5px]">BAHARAZ</span>
                <span className="text-[7px] font-[800]">COINS</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #fff9e6, #ffefb8)' }}>
                <p className="text-[12px] font-[900] leading-[11px] text-black">70%</p>
                <p className="text-[12px] font-[900] leading-[11px] text-black">OFF</p>
              </div>
            </div>
            <p className="text-[9px] font-[700] text-[#FF6A00]">Shop here ›</p>
          </Link>

          <Link href="/choice" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center border bg-[#FFDE00]">
              <span className="text-[7px] font-[900] leading-[7px] text-black">BAHARAZ</span>
              <span className="text-[8px] font-[900] leading-[8px] text-black">CHOICE</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">BAHARAZ{"\n"}CHOICE</p>
          </Link>

          <Link href="/official-mobile" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center relative border" style={{ background: '#ede0ff' }}>
              <span className="text-[20px] leading-none">📱</span>
              <span className="absolute -bottom-1 text-white text-[5px] px-1 py-0.5 rounded-full font-[800]" style={{ background: '#6a00ff' }}>OFFICIAL</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Official{"\n"}Mobile</p>
          </Link>

          <Link href="/freebie" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center relative border" style={{ background: '#e8f0ff' }}>
              <span className="text-[20px] leading-none">🎁</span>
              <span className="absolute -bottom-1 text-white text-[5px] px-1 py-0.5 rounded-full font-[800]" style={{ background: '#ff0040' }}>FREE</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Baharaz{"\n"}Freebie</p>
          </Link>

          <Link href="/buy-more-save-more" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center border" style={{ background: '#FFE0B0' }}>
              <span className="font-[900] text-center leading-[7px] text-[7px] text-black">BUY+{"\n"}SAVE+</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Buy More{"\n"}Save More</p>
          </Link>

          <Link href="/mall" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center border" style={{ background: '#e0d4ff' }}>
              <span className="font-[900] text-[20px] text-[#6a00ff]">b</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Baharaz{"\n"}Mall</p>
          </Link>

          <Link href="/flash-sale" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center border" style={{ background: '#ffdddd' }}>
              <span className="font-[900] text-center leading-[7px] text-[7px] text-black">⚡{"\n"}FLASH</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Flash{"\n"}Sale</p>
          </Link>

          <Link href="/vouchers" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
            <div className="w-[50px] h-[50px] rounded-[12px] flex flex-col items-center justify-center border" style={{ background: '#d4ffe0' }}>
              <span className="font-[900] text-center leading-[7px] text-[7px] text-black">🎫{"\n"}VOUCHER</span>
            </div>
            <p className="text-[8px] leading-[8px] text-center text-[#333] whitespace-pre font-[500]">Voucher{"\n"}Max</p>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}