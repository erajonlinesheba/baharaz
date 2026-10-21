"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CATS = [
  { name: "All", icon: "🏠", href: "/", live: true },
  { name: "Fashion", icon: "👗", href: "/category/fashion", hot: true },
  { name: "Mobile", icon: "📱", href: "/category/mobile" },
  { name: "Gadget", icon: "🎧", href: "/category/gadget", new: true },
  { name: "Beauty", icon: "💄", href: "/category/beauty" },
  { name: "Home", icon: "🏡", href: "/category/home" },
  { name: "Kids", icon: "🧒", href: "/category/kids" },
  { name: "Flash", icon: "⚡", href: "/flash-sale", flash: true },
  { name: "Mart", icon: "🛒", href: "/mart" },
  { name: "Appliance", icon: "🔌", href: "/category/appliance" },
];

export default function MobileCategoryChips() {
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Detect Active - Fixed Map
  useEffect(() => {
    if (!pathname) return;
    let idx = 0;
    if (pathname === "/") {
      idx = 0;
    } else {
      const found = CATS.findIndex((c) => {
        if (c.href === "/") return false;
        return pathname.startsWith(c.href);
      });
      if (found !== -1) idx = found;
    }
    setActiveIndex(idx);
  }, [pathname]);

  // Auto Scroll to Active - Center
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.children[activeIndex]) {
      const activeEl = scrollRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeIndex]);

  // Fade Shadow Logic
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    handleScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
      return () => {
        el.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  const handleHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
  };

  const isActive = (i) => i === activeIndex;

  return (
    <div className="relative w-full h-[56px] flex items-center overflow-hidden md:hidden"
         style={{
           background: 'rgba(255,255,255,0.72)',
           backdropFilter: 'blur(40px) saturate(180%)',
           WebkitBackdropFilter: 'blur(40px) saturate(180%)',
           borderBottom: '0.5px solid rgba(0,0,0,0.06)',
           boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -0.5px 0 rgba(0,0,0,0.04)'
         }}>
      
      {/* iOS 26 Top Shine - তোমার MobileHeader এর মতো */}
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

      {/* Left Fade - iOS 26 Glass */}
      <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
           style={{
             background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
             backdropFilter: 'blur(10px)',
             WebkitBackdropFilter: 'blur(10px)'
           }} />
      
      {/* Right Fade - iOS 26 Glass */}
      <div className={`absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
           style={{
             background: 'linear-gradient(270deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
             backdropFilter: 'blur(10px)',
             WebkitBackdropFilter: 'blur(10px)'
           }} />

      <div
        ref={scrollRef}
        className="w-full flex items-center gap-2.5 px-3 overflow-x-auto scrollbar-hide scroll-smooth relative z-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATS.map((cat, i) => {
          const active = isActive(i);
          return (
            <Link
              key={`${cat.name}-${cat.href}-${i}`}
              href={cat.href}
              onClick={handleHaptic}
              className={`
                relative whitespace-nowrap h-[36px] px-4 rounded-full text-[13px] font-[700] flex items-center gap-1.5 shrink-0 transition-all duration-300 select-none active:scale-[0.96]
                ${active 
                  ? 'text-white' 
                  : cat.flash
                    ? 'text-[#F85606]'
                    : 'text-[#2a2a2a]'
                }
              `}
              style={
                active 
                  ? {
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #121212 100%)',
                      border: '0.5px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
                      fontFamily: '-apple-system, SF Pro Display, sans-serif'
                    }
                  : cat.flash
                    ? {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,241,235,0.9))',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '0.5px solid rgba(248,86,6,0.18)',
                        boxShadow: '0 4px 16px rgba(248,86,6,0.12), inset 0 1px 0 rgba(255,255,255,1)'
                      }
                    : {
                        background: 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '0.5px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
                        fontFamily: '-apple-system, SF Pro Display, sans-serif'
                      }
              }
            >
              {/* Glass Shine for Inactive */}
              {!active && <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none"></div>}
              
              {/* Active Shine */}
              {active && <div className="absolute inset-0 bg-gradient-to-b from-white/12 to-transparent rounded-full pointer-events-none"></div>}

              <span className="text-[13px] leading-none relative z-10">{cat.icon}</span>
              <span className="tracking-[-0.1px] relative z-10">{cat.name}</span>
              
              {/* BADGES - iOS 26 */}
              {cat.live && (
                <span className="ml-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none relative z-10"
                      style={{
                        background: active ? '#F85606' : 'linear-gradient(135deg, #FF7A45, #F85606)',
                        color: 'white',
                        boxShadow: '0 2px 6px rgba(248,86,6,0.3)',
                        border: '0.5px solid rgba(255,255,255,0.2)'
                      }}>LIVE</span>
              )}
              {cat.hot && !active && (
                <span className="ml-0.5 w-1.5 h-1.5 rounded-full animate-pulse relative z-10"
                      style={{ background: '#FF3B30', boxShadow: '0 0 6px rgba(255,59,48,0.5)' }} />
              )}
              {cat.new && (
                <span className="ml-0.5 text-[7px] font-black px-1 py-0.5 rounded-full leading-none relative z-10"
                      style={active 
                        ? { background: 'white', color: 'black', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }
                        : { background: '#121212', color: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }
                      }>NEW</span>
              )}
              {cat.flash && !active && (
                <span className="ml-0.5 text-[10px] animate-bounce relative z-10">🔥</span>
              )}

              {/* Active Indicator Dot - iOS 26 */}
              {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.3)]" />}
            </Link>
          );
        })}

        {/* Extra Spacer for Right Fade */}
        <div className="w-3 h-1 shrink-0" />
      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}