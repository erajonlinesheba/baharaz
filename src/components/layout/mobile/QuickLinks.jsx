"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function QuickLinks() {
  const [coins, setCoins] = useState(350);

  useEffect(() => {
    const loadCoins = () => {
      const saved = Number(localStorage.getItem('baharaz_coins') || '350');
      setCoins(saved);
    };
    loadCoins();
    window.addEventListener('coinsUpdated', loadCoins);
    const i = setInterval(loadCoins, 2000);
    return () => {
      window.removeEventListener('coinsUpdated', loadCoins);
      clearInterval(i);
    };
  }, []);

  const handleHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className="w-full bg-white px-2.5 py-2.5">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        
        {/* COINS - FIXED ✅ */}
        <Link href="/account/coins" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex flex-col items-center justify-center relative shadow-sm border border-[#FFC107]/20" style={{ background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)' }}>
            <span className="text-[18px] leading-none">🪙</span>
            <span className="text-[10px] font-[900] text-[#E65100] leading-none mt-0.5">{coins}</span>
            <div className="absolute -top-1 -right-1 bg-[#FF3D00] text-white text-[8px] font-black px-1 py-0.5 rounded-full leading-none">৳{Math.floor(coins/10)}</div>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Coins</p>
        </Link>

        {/* CHOICE */}
        <Link href="/choice" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex flex-col items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #FFEB3B 0%, #FFC107 100%)' }}>
            <span className="text-[6px] font-[900] text-black leading-none">BAHARAZ</span>
            <span className="text-[8px] font-[900] text-black leading-none">CHOICE</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Choice</p>
        </Link>

        {/* Official */}
        <Link href="/official-mobile" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shadow-sm bg-[#F3E5F5] border border-[#E1BEE7]">
            <span className="text-[20px]">📱</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none text-center">Official</p>
        </Link>

        {/* Freebie */}
        <Link href="/freebie" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shadow-sm bg-[#E3F2FD] border border-[#BBDEFB]">
            <span className="text-[20px]">🎁</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Freebie</p>
        </Link>

        {/* Buy More */}
        <Link href="/buy-more-save-more" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex flex-col items-center justify-center shadow-sm bg-[#FFF3E0] border border-[#FFE0B2]">
            <span className="text-[8px] font-[900] text-[#E65100] leading-[9px] text-center">BUY<br/>SAVE</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none text-center">Buy More</p>
        </Link>

        {/* Mall */}
        <Link href="/mall" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shadow-sm bg-[#EDE7F6] border border-[#D1C4E9]">
            <span className="text-[18px] font-black text-[#6200EA]">B</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Mall</p>
        </Link>

        {/* Flash */}
        <Link href="/flash-sale" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex flex-col items-center justify-center shadow-sm bg-[#FFEBEE] border border-[#FFCDD2]">
            <span className="text-[14px]">⚡</span>
            <span className="text-[7px] font-[900] text-[#D32F2F]">FLASH</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Flash</p>
        </Link>

        {/* VOUCHER - FIXED ✅ */}
        <Link href="/account/vouchers" onClick={handleHaptic} className="min-w-[56px] flex flex-col items-center gap-1 shrink-0">
          <div className="w-[48px] h-[48px] rounded-[12px] flex flex-col items-center justify-center shadow-sm bg-[#E8F5E9] border border-[#C8E6C9]">
            <span className="text-[16px]">🎫</span>
          </div>
          <p className="text-[9.5px] font-[600] text-[#333] leading-none">Voucher</p>
        </Link>

      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none;}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
}