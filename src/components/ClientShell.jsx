"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

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
const MOBILE_HIDE_ROUTES = ["/cart", "/checkout", "/wishlist"];

export default function ClientShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const headerRef = useRef(null);
  const pathname = usePathname();

  const isNoLayout = useMemo(() => pathname ? NO_LAYOUT_ROUTES.some((r) => pathname.startsWith(r)) : false, [pathname]);
  const isHomePage = pathname === "/";
  const isAccountPage = useMemo(() => pathname ? pathname.startsWith("/account") : false, [pathname]);

  const isCategoryPage = useMemo(() => {
    if (!pathname) return false;
    if (isHomePage) return false;
    if (isAccountPage) return false;
    if (isNoLayout) return false;
    return CATEGORY_ROUTES.some((r) => pathname.startsWith(r));
  }, [pathname, isHomePage, isAccountPage, isNoLayout]);

  const isMobileHidePage = useMemo(() => {
    if (!pathname) return false;
    if (isNoLayout) return false;
    if (isAccountPage) return true;
    if (MOBILE_HIDE_ROUTES.some((r) => pathname.startsWith(r))) return true;
    return CATEGORY_ROUTES.some((r) => pathname.startsWith(r));
  }, [pathname, isAccountPage, isNoLayout]);

  const headerHeight = useMemo(() => {
    const topBar = hideTopBar ? 0 : 28;
    const mainHeader = 84;
    const categoryBar = isCategoryPage ? 40 : 0;
    return topBar + mainHeader + categoryBar;
  }, [hideTopBar, isCategoryPage]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let mountedFlag = true;
    let channel = null;
    const initCart = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
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
        const idleFetch = () => {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(fetchRealCartCount, { timeout: 2000 });
          } else {
            setTimeout(fetchRealCartCount, 1000);
          }
        };
        idleFetch();
        setTimeout(() => {
          if (!mountedFlag) return;
          channel = supabase
            .channel('cart-changes-final-v2')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'carts' }, () => {
              fetchRealCartCount();
            })
            .subscribe();
        }, 3000);
        const handleCartUpdate = () => fetchRealCartCount();
        window.addEventListener('cart-update', handleCartUpdate);
        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('authChanged', handleCartUpdate);
        return () => {
          window.removeEventListener('cart-update', handleCartUpdate);
          window.removeEventListener('cartUpdated', handleCartUpdate);
          window.removeEventListener('authChanged', handleCartUpdate);
        };
      } catch (e) {}
    };
    let cleanup;
    initCart().then((c) => { cleanup = c; });
    return () => {
      mountedFlag = false;
      if (cleanup) cleanup();
      if (channel) {
        import("@/lib/supabase/client").then(({ createClient }) => {
          createClient().removeChannel(channel);
        });
      }
    };
  }, [mounted]);

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
  }, [mounted]);

  if (isNoLayout) {
    return <main className="w-full min-h-screen bg-[#f5f5f5]">{children}</main>;
  }

  return (
    <>
      <CartSync />
      <AutoUpdater />

      <div ref={headerRef} className="hidden md:flex fixed top-0 left-0 right-0 z-[9999] w-full bg-[#F85606] flex-col shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="w-full bg-[#F85606] flex flex-col">
          <div className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${hideTopBar ? 'max-h-0' : 'max-h-[50px] min-h-[28px]'}`}>
            <div className="w-full max-w-[1188px] mx-auto"><TopBar /></div>
          </div>
          <div className="w-full max-w-[1188px] mx-auto"><Header /></div>
        </div>
        {isCategoryPage && <div className="w-full bg-white border-b border-[#eee]"><div className="w-full max-w-[1188px] mx-auto"><CategoryBar /></div></div>}
      </div>
      <div style={{ height: `${headerHeight}px` }} className="hidden md:block w-full shrink-0 bg-[#f5f5f5]" />

      {/* ✅ FINAL FIX - Desktop আগের মতোই, Mobile এ Cart/Product এ Header নাই */}
      <div className="flex md:hidden relative w-full flex-col bg-white overflow-visible">
        {isHomePage ? (
          <>
            <MobileHeader cartCount={cartCount} />
            <MobileCategoryChips />
          </>
        ) : isMobileHidePage ? (
          null
        ) : (
          <MobileHeader cartCount={cartCount} />
        )}
      </div>

      <main className="w-full bg-[#f5f5f5] min-h-[60vh] overflow-visible">{children}</main>

      {!isAccountPage && (
        <div className="w-full overflow-visible">
          <div className="block md:hidden w-full bg-white"><Footer /><div className="h-[75px] w-full bg-[#f5f5f5]" /></div>
          <div className="hidden md:block w-full"><Footer /></div>
        </div>
      )}

      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-[9998]"><Navbar /></div>
      <ClientExtras />
      <RoleSwitcher />
    </>
  );
}