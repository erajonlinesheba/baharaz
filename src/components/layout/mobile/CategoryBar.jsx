"use client";
import Link from "next/link";
import { memo, useCallback } from "react";

const MobileCategoryBar = memo(function MobileCategoryBar() {
  const handleHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  }, []);

  return (
    <div className="w-full bg-white px-3 py-3">
      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1">
        <Link href="/coins" onClick={handleHaptic} className="min-w-[68px] flex flex-col items-center gap-2 shrink-0">
          <div className="w-14 h-14 rounded-xl flex overflow-hidden border bg-white shadow-sm">
            <div className="w-6 h-full flex flex-col items-center justify-center text-white" style={{ background: 'linear-gradient(180deg, #0a5cff, #0040cc)' }}><span className="text-[5px] font-[800]">BAHARAZ</span><span className="text-[7px] font-[800]">COINS</span></div>
            <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #fff9e6, #ffefb8)' }}><p className="text-[12px] font-[900] text-black leading-none">70%</p><p className="text-[12px] font-[900] text-black leading-none">OFF</p></div>
          </div>
          <p className="text-[11px] font-[700] text-[#FF6A00]">Shop here ›</p>
        </Link>
        <Link href="/choice" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border bg-[#FFDE00] shadow-sm"><span className="text-[7px] font-[900] text-black">BAHARAZ</span><span className="text-[10px] font-[900] text-black">CHOICE</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">BAHARAZ<br/>CHOICE</p></Link>
        <Link href="/official-mobile" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center relative border bg-[#ede0ff] shadow-sm"><span className="text-[24px]">📱</span><span className="absolute -bottom-1 text-white text-[5px] px-1.5 py-0.5 rounded-full bg-[#6a00ff] font-[800]">OFFICIAL</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Official<br/>Mobile</p></Link>
        <Link href="/freebie" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center relative border bg-[#e8f0ff] shadow-sm"><span className="text-[24px]">🎁</span><span className="absolute -bottom-1 text-white text-[5px] px-1.5 py-0.5 rounded-full bg-[#ff0040] font-[800]">FREE</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Baharaz<br/>Freebie</p></Link>
        <Link href="/buy-more-save-more" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border bg-[#FFE0B0] shadow-sm"><span className="font-[900] text-center text-[8px] leading-[9px]">BUY+<br/>SAVE+</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Buy More<br/>Save More</p></Link>
        <Link href="/mall" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border bg-[#e0d4ff] shadow-sm"><span className="font-[900] text-[24px] text-[#6a00ff]">b</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Baharaz<br/>Mall</p></Link>
        <Link href="/flash-sale" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border bg-[#ffdddd] shadow-sm"><span className="font-[900] text-center text-[9px] leading-[10px]">⚡<br/>FLASH</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Flash<br/>Sale</p></Link>
        <Link href="/vouchers" onClick={handleHaptic} className="min-w-[64px] flex flex-col items-center gap-2 shrink-0"><div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border bg-[#d4ffe0] shadow-sm"><span className="font-[900] text-center text-[8px] leading-[9px]">🎫<br/>VOUCHER</span></div><p className="text-[11px] text-center font-[600] leading-[12px]">Voucher<br/>Max</p></Link>
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none;}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
});
export default MobileCategoryBar;