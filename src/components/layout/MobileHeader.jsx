"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Banner from "./mobile/Banner";
import SearchBar from "./mobile/SearchBar";
import TrustBar from "./mobile/TrustBar";
import QuickLinks from "./mobile/QuickLinks";

export default function MobileHeader({ cartCount = 0, wishlistCount = 0 }) {
  const [coins, setCoins] = useState(350);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const loadCoins = () => {
      const saved = Number(localStorage.getItem('baharaz_coins') || '350');
      setCoins(saved);
    };
    loadCoins();
    window.addEventListener('coinsUpdated', loadCoins);
    window.addEventListener('storage', loadCoins);
    const interval = setInterval(loadCoins, 2000);
    return () => {
      window.removeEventListener('coinsUpdated', loadCoins);
      window.removeEventListener('storage', loadCoins);
      clearInterval(interval);
    };
  }, []);

  // ✅ Product / Other Page এ - শুধু SearchBar, Banner না
  if (!isHomePage) {
    return (
      <div className="w-full md:hidden bg-white relative overflow-hidden" suppressHydrationWarning>
        <SearchBar />
      </div>
    );
  }

  return (
    <div className="w-full md:hidden bg-white relative overflow-hidden" suppressHydrationWarning>
      <div className="w-full relative overflow-hidden">
        <Banner />
        <div className="absolute top-0 left-0 right-0 z-20">
          <SearchBar />
          <Link 
            href="/account/coins" 
            className="absolute top-[60px] right-3 z-30 bg-white/95 backdrop-blur-sm text-black px-2.5 py-1 rounded-full text-[10px] font-bold shadow-[0_2px_12px_rgba(0,0,0,0.25)] flex items-center gap-1 active:scale-95"
          >
            <span>🪙 {coins}</span>
            <span className="bg-[#FF6F00] text-white text-[9px] px-1 rounded-full">৳{Math.floor(coins/10)}</span>
          </Link>
        </div>
      </div>
      <TrustBar />
      <QuickLinks cartCount={cartCount} wishlistCount={wishlistCount} coins={coins} />
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none;}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
    </div>
  );
}