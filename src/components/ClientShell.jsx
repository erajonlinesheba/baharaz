"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

import Header from "./layout/Header";
import MobileHeader from "./layout/MobileHeader";
import MobileCategoryChips from "./layout/MobileCategoryChips";

const TopBar = dynamic(() => import("./layout/TopBar"), { 
  ssr: false,
  loading: () => <div className="w-full h-[28px] bg-[#F85606]" />
});
const Footer = dynamic(() => import("./layout/Footer"), { ssr: false });
const Navbar = dynamic(() => import("./layout/Navbar"), { ssr: false });
const CategoryBar = dynamic(() => import("./layout/CategoryBar"), { ssr: false });
const CartSync = dynamic(() => import("./product/CartSync"), { ssr: false });
const ClientExtras = dynamic(() => import("./ClientExtras"), { ssr: false });
const AutoUpdater = dynamic(() => import("./AutoUpdater"), { ssr: false });
const RoleSwitcher = dynamic(() => import("./RoleSwitcher"), { ssr: false });

const NO_LAYOUT_ROUTES = ["/admin", "/seller", "/auth", "/login", "/register"];
const CATEGORY_ROUTES = ["/product", "/category", "/search", "/flash-sale", "/brand", "/deal", "/collection", "/shop", "/store", "/just-for-you", "/mall"];

const supabase = createClient();

export default function ClientShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(112);
  const [cartCount, setCartCount] = useState(0);
  const headerRef = useRef(null);
  const pathname = usePathname();

  const isNoLayout = pathname ? NO_LAYOUT_ROUTES.some((r) => pathname.startsWith(r)) : false;
  const isCategoryPage = pathname ? (pathname === "/" || CATEGORY_ROUTES.some((r) => pathname.startsWith(r))) : false;
  const isHomePage = pathname === "/";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let mountedFlag = true;

    const fetchRealCartCount = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          if (mountedFlag) setCartCount(0);
          return;
        }
        const { count, error } = await supabase
          .from('carts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (!error && mountedFlag) {
          setCartCount(count || 0);
        }
      } catch (e) {
        if (mountedFlag) setCartCount(0);
      }
    };

    fetchRealCartCount();

    const channel = supabase
      .channel('cart-changes-final-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'carts' }, () => {
        fetchRealCartCount();
      })
      .subscribe();

    const handleCartUpdate = () => fetchRealCartCount();
    window.addEventListener('cart-update', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('authChanged', handleCartUpdate);

    return () => {
      mountedFlag = false;
      supabase.removeChannel(channel);
      window.removeEventListener('cart-update', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('authChanged', handleCartUpdate);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [mounted, hideTopBar, isCategoryPage, pathname]);

  useEffect(() => {
    if (!mounted) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setHideTopBar(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted, pathname]);

  if (isNoLayout) {
    return <main className="w-full min-h-screen bg-[#f5f5f5]">{children}</main>;
  }

  return (
    <>
      <CartSync />
      <AutoUpdater />

      {/* WEB HEADER - Fixed ঠিক আছে */}
      <div ref={headerRef} className="hidden md:flex fixed top-0 left-0 right-0 z-[9999] w-full bg-[#F85606] flex-col shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="w-full bg-[#F85606] flex flex-col">
          <div className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${hideTopBar ? 'max-h-0' : 'max-h-[50px] min-h-[28px]'}`}>
            <div className="w-full max-w-[1188px] mx-auto"><TopBar /></div>
          </div>
          <div className="w-full max-w-[1188px] mx-auto"><Header /></div>
        </div>
        {isCategoryPage && <div className="w-full bg-white border-b border-[#eee]"><CategoryBar /></div>}
      </div>
      <div style={{ height: mounted ? `${headerHeight}px` : '112px' }} className="hidden md:block w-full shrink-0 bg-[#f5f5f5]" />

      {/* ✅ MOBILE HEADER - শুধু Home Page এ Banner দেখাবে */}
      <div className="flex md:hidden relative w-full flex-col bg-[#FFE100] overflow-visible">
        {isHomePage ? (
          <>
            <MobileHeader cartCount={cartCount} />
            <MobileCategoryChips />
          </>
        ) : (
          // ✅ অন্য পেজ - /account, /dashboard এ Banner দেখাবে না
          <div className="w-full h-0 overflow-hidden">
            <MobileHeader cartCount={cartCount} />
          </div>
        )}
      </div>

      <main className="w-full bg-[#f5f5f5] min-h-[60vh] overflow-visible">{children}</main>

      <div className="w-full overflow-visible">
        <div className="block md:hidden w-full bg-white"><Footer /><div className="h-[75px] w-full bg-[#f5f5f5]" /></div>
        <div className="hidden md:block w-full"><Footer /></div>
      </div>

      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-[9998]"><Navbar /></div>
      <ClientExtras />
      <RoleSwitcher />
    </>
  );
}