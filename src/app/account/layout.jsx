"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const MENU = [
  { href: "/account", label: "Dashboard", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg> },
  { href: "/account/orders", label: "My Orders", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { href: "/account/return", label: "Return & Cancel", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 14L4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg> },
  { href: "/account/wishlist", label: "Wishlist", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19.5 5.5a4.5 4.5 0 0 0-6.36 0L12 6.64 10.86 5.5a4.5 4.5 0 0 0-6.36 6.36l1.14 1.14L12 19.36l6.36-6.36 1.14-1.14a4.5 4.5 0 0 0 0-6.36z"/></svg> },
  { href: "/account/following", label: "Following", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { href: "/account/payment", label: "Payment", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg> },
  { href: "/account/vouchers", label: "Vouchers", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h16v4"/><path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h16v-4"/><path d="M20 12h2"/><path d="M2 12h2"/></svg> },
  { href: "/account/coins", label: "Coins", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><path d="M9 10c0-1 1.5-2 3-2s3 1 3 2-1.5 2-3 2-3 1-3 2 1.5 2 3 2 3-1 3-2"/></svg> },
  { href: "/account/security", label: "Security", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { href: "/account/recent", label: "Recently Viewed", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
  { href: "/account/address", label: "My Address", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="2.5"/></svg> },
  { href: "/account/profile", label: "My Profile", Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    const toggle = () => setOpen(v => !v);
    window.addEventListener("toggleAccountSidebar", toggle);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("toggleAccountSidebar", toggle);
    };
  }, []);

  // ✅ FIXED: আগের মত pathname এ setOpen(false) করবে না, তাই আর লাফাবে না
  useEffect(() => {
    setHover(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      localStorage.clear();
      router.push("/");
      setTimeout(() => { window.location.href = "/"; }, 200);
    } catch { router.push("/"); }
  };

  const sideW = !open ? 0 : isMobile ? 72 : hover ? 220 : 72;

  return (
    <div className="account-wrap" style={{ gridTemplateColumns: `${sideW}px 1fr` }}>
      <aside onMouseEnter={() => !isMobile && open && setHover(true)} onMouseLeave={() => !isMobile && setHover(false)} className={`side ${open ? "open" : "close"} ${hover ? "hovered" : ""} ${isMobile ? "mobile" : "desktop"}`}>
        <Link href="/" className="top"><div className="logo">B</div><b className="brand">Baharaz</b></Link>
        <div className="list">
          {MENU.map(m => {
            const ac = m.href === "/account" ? pathname === "/account" : pathname.startsWith(m.href);
            return (<Link key={m.href} href={m.href} className={ac ? "it ac" : "it"}><span className="ic"><m.Icon/></span><span className="lb">{m.label}</span></Link>);
          })}
          <div className="divline" />
          <button onClick={handleLogout} className="it logout"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span><span className="lb">Logout</span></button>
        </div>
      </aside>
      <main className="page">
        <div key={pathname} ref={scrollRef} className="page-in">
          <div className="content-inner">{children}</div>
        </div>
      </main>
      <style>{`
        .account-wrap{display:grid;width:100%;height:calc(100dvh - 112px);min-height:calc(100dvh - 112px);background:linear-gradient(180deg,#fff7f2 0%,#f8fafc 100%);transition:grid-template-columns 0.22s ease;overflow:hidden}
        .side{display:flex;flex-direction:column;position:relative;height:calc(100dvh - 112px);background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-right:1px solid rgba(248,86,6,0.08);z-index:20;overflow:hidden;transition:all 0.22s ease;box-shadow:0 0 0 1px rgba(248,86,6,0.04), 4px 0 24px rgba(248,86,6,0.06)}
        .side.close{width:0 !important;min-width:0 !important;border:0;overflow:hidden}
        .top{height:58px;min-height:58px;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid rgba(248,86,6,0.08);background:linear-gradient(135deg, rgba(248,86,6,0.08) 0%, rgba(255,138,76,0.08) 100%);flex-shrink:0;text-decoration:none}
        .logo{width:34px;height:34px;background:linear-gradient(135deg,#F85606 0%,#FF8A4C 100%);border-radius:10px;color:#fff;font-weight:900;font-size:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(248,86,6,0.3)}
        .brand{white-space:nowrap;transition:opacity .15s;color:#111;font-weight:800;letter-spacing:-0.2px}
        .list{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:10px 8px 20px 8px;display:flex;flex-direction:column;gap:3px}
        .it{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;text-decoration:none;color:#444;font-size:13.5px;font-weight:500;white-space:nowrap;border:none;background:transparent;width:100%;cursor:pointer;text-align:left;transition:all 0.2s cubic-bezier(0.2,0.8,0.2,1)}
        .it:hover{background:rgba(248,86,6,0.08);color:#F85606;transform:translateX(2px)}
        .it.ac{background:linear-gradient(135deg,#F85606 0%,#FF6B2B 100%);color:#fff;box-shadow:0 4px 14px rgba(248,86,6,0.35), 0 1px 3px rgba(0,0,0,0.1);transform:translateX(1px)}
        .it.logout{color:#ff3b30}
        .it.logout:hover{background:rgba(255,59,48,0.08);color:#ff3b30}
        .ic{width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.2s}
        .it:hover .ic{transform:scale(1.1)}
        .ic svg{width:20px;height:20px}
        .lb{white-space:nowrap;transition:opacity .15s}
        .divline{height:1px;background:linear-gradient(90deg, transparent, rgba(248,86,6,0.15), transparent);margin:12px 8px}
        .side.desktop:not(.hovered) .brand,.side.desktop:not(.hovered) .lb{opacity:0;width:0;overflow:hidden;pointer-events:none}
        .side.desktop:not(.hovered) .it{justify-content:center;padding:11px 2px;gap:0}
        .side.mobile .top .brand{display:none}
        .side.mobile .it{flex-direction:column;justify-content:center;gap:4px;padding:10px 2px;font-size:9.5px;text-align:center;line-height:1.1;white-space:normal;font-weight:600}
        .side.mobile .it .ic{background:rgba(248,86,6,0.08);width:32px;height:32px;border-radius:10px}
        .side.mobile .it.ac .ic{background:rgba(255,255,255,0.2)}
        .side.mobile .lb{font-size:8.5px}
        .page{width:100%;height:calc(100dvh - 112px);min-height:calc(100dvh - 112px);background:transparent;display:flex;flex-direction:column;overflow:hidden}
        .page-in{flex:1;width:100%;height:100%;min-height:0;overflow-y:scroll !important;overflow-x:hidden !important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:transparent;scrollbar-width:thin;scrollbar-color:rgba(248,86,6,0.3) transparent}
        .content-inner{padding:16px 14px 120px 14px;min-height:calc(100% + 2px)}
        .page-in::-webkit-scrollbar{width:6px !important;display:block !important}
        .page-in::-webkit-scrollbar-track{background:rgba(248,86,6,0.06) !important;border-radius:100px !important}
        .page-in::-webkit-scrollbar-thumb{background:linear-gradient(180deg, #F85606, #FF8A4C) !important;border-radius:100px !important;min-height:40px !important}
        @media(max-width:900px){.account-wrap{grid-template-columns:${sideW}px 1fr !important;height:calc(100dvh - 60px);min-height:calc(100dvh - 60px)}.side{height:calc(100dvh - 60px)}.page{height:calc(100dvh - 60px);min-height:calc(100dvh - 60px)}}
      `}</style>
    </div>
  );
}