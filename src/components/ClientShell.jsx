"use client";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import TopBar from "./layout/TopBar";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import CartSync from "./product/CartSync";
import ClientExtras from "./ClientExtras";
import AutoUpdater from "./AutoUpdater";
import RoleSwitcher from "./RoleSwitcher";

const NO_LAYOUT_ROUTES = ["/admin", "/seller", "/auth", "/login", "/register"];
const CATEGORY_ROUTES = ["/product", "/category", "/products", "/search", "/flash-sale"];

export default function ClientShell({ children }) {
  const [hideTopBar, setHideTopBar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(()=>{
    setMounted(true);
    const onScroll = () => {
      const y = window.scrollY;
      if(y > 100) setHideTopBar(true);
      else if(y < 20) setHideTopBar(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);

  const isNoLayout = NO_LAYOUT_ROUTES.some((r)=> pathname?.startsWith(r));

  const showCategories = useMemo(()=>{
    if(!pathname) return false;
    return CATEGORY_ROUTES.some(p => pathname.startsWith(p));
  }, [pathname]);

  // FIX: আসল Height হিসাব - TopBar 26 + Header 75 + Categories 36
  const headerHeight = useMemo(()=>{
    const topBarH = hideTopBar? 0 : 26;
    const headerH = 75;
    const catH = showCategories? 36 : 0;
    return topBarH + headerH + catH;
  }, [hideTopBar, showCategories]);

  if(!mounted){
    return <div className="w-full min-h-screen bg-[#f5f5f5]" />
  }

  return (
    <>
      <CartSync />
      <AutoUpdater />

      {isNoLayout? (
        <main className="w-full min-h-screen bg-[#f5f5f5]">{children}</main>
      ) : (
        <>
          <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-[#F85606] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center overflow-hidden">
            {/* TopBar - Smooth Hide, display:none না */}
            <div className={`w-full flex justify-center bg-[#f5f5f5] transition-all duration-300 ease-in-out overflow-hidden ${hideTopBar? 'max-h-0 opacity-0' : 'max-h-[26px] opacity-100'}`}>
              <TopBar />
            </div>
            <div className="w-full flex justify-center bg-[#F85606]">
              <Header />
            </div>
          </div>

          {/* FIX: Spacer এখন Dynamic - Flash Sale আর কাটবে না */}
          <div style={{ height: `${headerHeight}px` }} className="w-full shrink-0 transition-all duration-300 ease-in-out" />

          <div className="lg:hidden"><Navbar /></div>
          <main className="w-full min-h-screen bg-[#f5f5f5] pb-[60px] lg:pb-0 relative z-0">
            {children}
          </main>
          <Footer />
        </>
      )}

      <ClientExtras />
      <RoleSwitcher />
    </>
  );
}