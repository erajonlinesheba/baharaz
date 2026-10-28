"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    const toggle = () => { if (window.innerWidth <= 900) setMobileOpen(v => !v); };
    window.addEventListener("toggleAccountSidebar", toggle);
    const style = document.createElement('style');
    style.id = 'account-only-hide-scrollbar';
    style.innerHTML = `html,body{scrollbar-width:none!important;-ms-overflow-style:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}`;
    document.head.appendChild(style);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("toggleAccountSidebar", toggle);
      const s = document.getElementById('account-only-hide-scrollbar');
      if (s) s.remove();
    };
  }, []);

  useEffect(() => {
    if (!isMobile) { setHover(false); return; }
    if (pathname === "/account") setMobileOpen(false);
    else if (pathname.startsWith("/account/")) setMobileOpen(true);
  }, [pathname, isMobile]);

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

  if (!mounted) return null;
  const sideW = isMobile ? (mobileOpen ? 64 : 0) : hover ? 210 : 64;

  return (
    <div className="account-wrap" style={{ gridTemplateColumns: `${sideW}px 1fr` }}>
      <aside onMouseEnter={() => !isMobile && setHover(true)} onMouseLeave={() => !isMobile && setHover(false)} className={`side ${isMobile ? (mobileOpen ? "open" : "close") : "open"} ${hover ? "hovered" : ""} ${isMobile ? "mobile" : "desktop"}`}>
        <Link href="/" className="top"><div className="logo">B</div><b className="brand">Baharaz</b></Link>
        <div className="list">
          {MENU.map(m => {
            const ac = m.href === "/account" ? pathname === "/account" : pathname.startsWith(m.href);
            return (<Link key={m.href} href={m.href} className={ac ? "it ac" : "it"}><span className="ic"><m.Icon/></span><span className="lb">{m.label}</span></Link>);
          })}
          <div className="logout-wrap">
            <div className="divline" />
            <button onClick={handleLogout} className="it logout"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span><span className="lb">Logout</span></button>
          </div>
        </div>
      </aside>
      <main className="page">
        <div className="page-in">
          <div className="content-inner">{children}</div>
        </div>
      </main>
      <style>{`
        .account-wrap{display:grid;width:100%;max-width:1188px;margin:0 auto;background:#f5f5f5;align-items:start;height:calc(100vh - 80px);min-height:calc(100vh - 80px);max-height:calc(100vh - 80px);overflow:hidden;transition:grid-template-columns 0.15s ease}
        .side{display:flex;flex-direction:column;height:calc(100vh - 80px);max-height:calc(100vh - 80px);min-height:calc(100vh - 80px);background:#fff;border-right:1px solid #e5e7eb;overflow:hidden;position:sticky;top:0;align-self:start;transition:all 0.15s ease;z-index:20}
        .side.desktop{width:64px !important;min-width:64px !important}
        .side.desktop.hovered{width:210px !important;min-width:210px !important;box-shadow:4px 0 20px rgba(0,0,0,0.08);z-index:30}
        .top{height:42px;min-height:42px;max-height:42px;display:flex;align-items:center;gap:8px;padding:0 10px;border-bottom:1px solid #f0f0f0;background:#fff;text-decoration:none;flex-shrink:0}
        .logo{width:26px;height:26px;background:#F85606;border-radius:6px;color:#fff;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .brand{white-space:nowrap;color:#111;font-weight:800;font-size:13px}
        .list{flex:1;overflow-y:auto !important;overflow-x:hidden !important;padding:4px;display:flex;flex-direction:column;gap:1px;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior:contain}
        .list::-webkit-scrollbar{display:none !important;width:0 !important}
        .it{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:8px;text-decoration:none;color:#555;font-size:12.5px;font-weight:500;white-space:nowrap;border:none;background:transparent;width:100%;cursor:pointer;min-height:32px;flex-shrink:0;transition:all 0.22s cubic-bezier(0.4,0,0.2,1);position:relative}
        .it .ic{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:7px;background:transparent;transition:all 0.22s cubic-bezier(0.4,0,0.2,1)}
        .it:hover{background:linear-gradient(90deg, #FFF5F0 0%, #FFEEE6 100%) !important;color:#F85606 !important;box-shadow:0 3px 10px rgba(248,86,6,0.14), 0 1px 2px rgba(248,86,6,0.08), inset 3px 0 0 #F85606 !important;transform:translateX(3px)}
        .it:hover .ic{background:#fff !important;box-shadow:0 2px 8px rgba(248,86,6,0.18), 0 0 0 1px rgba(248,86,6,0.1) !important;transform:scale(1.08)}
        .it.ac{background:#F85606 !important;color:#fff !important;box-shadow:0 4px 12px rgba(248,86,6,0.28) !important}
        .it.ac .ic{background:rgba(255,255,255,0.22) !important;box-shadow:none !important}
        .it.ac:hover{transform:none !important}
        .it.logout{color:#ef4444}
        .it.logout:hover{background:linear-gradient(90deg, #FFF1F2 0%, #FFE4E6 100%) !important;color:#dc2626 !important;box-shadow:0 3px 10px rgba(220,38,38,0.12), inset 3px 0 0 #ef4444 !important}
        .ic svg{width:16px;height:16px}
        .divline{height:1px;background:#f0f0f0;margin:4px 4px 2px 4px;flex-shrink:0}
        .logout-wrap{margin-top:6px !important;padding:2px 0 0 0;background:#fff;flex-shrink:0}
        .side.desktop:not(.hovered) .brand,.side.desktop:not(.hovered) .lb{display:none !important}
        .side.desktop:not(.hovered) .it{justify-content:center;padding:5px 2px !important;gap:0}
        .side.desktop:not(.hovered) .it:hover{transform:scale(1.08) !important}
        .side.desktop:not(.hovered) .top{justify-content:center;padding:0 6px}
        .page{width:100%;height:calc(100vh - 80px);max-height:calc(100vh - 80px);min-height:calc(100vh - 80px);background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;align-self:start}
        .page-in{flex:1;width:100%;height:100%;min-height:0;max-height:calc(100vh - 80px);overflow-y:auto !important;overflow-x:hidden !important;background:#f5f5f5;overscroll-behavior:contain;scrollbar-width:thin !important;scrollbar-color:#D1D5DB transparent !important;-webkit-overflow-scrolling:touch}
        .page-in::-webkit-scrollbar{display:block !important;width:5px !important;height:5px !important}
        .page-in::-webkit-scrollbar-track{background:transparent !important}
        .page-in::-webkit-scrollbar-thumb{background:#D1D5DB !important;border-radius:100px !important}
        .page-in::-webkit-scrollbar-thumb:hover{background:#9CA3AF !important}
        .content-inner{padding:10px 10px 140px 10px !important;background:#f5f5f5;width:100%;box-sizing:border-box;min-height:100%}

        /* Desktop - আরেকটু উপরে - 22px */
        @media(min-width:901px){
          .account-wrap{
            height:calc(100vh - 80px - 22px) !important;
            max-height:calc(100vh - 80px - 22px) !important;
            min-height:calc(100vh - 80px - 22px) !important;
          }
          .side{
            height:calc(100vh - 80px - 22px) !important;
            max-height:calc(100vh - 80px - 22px) !important;
            min-height:calc(100vh - 80px - 22px) !important;
          }
          .page{height:calc(100vh - 80px - 22px) !important;max-height:calc(100vh - 80px - 22px) !important}
          .page-in{max-height:calc(100vh - 80px - 22px) !important}
          .list{padding-bottom:2px !important}
          .logout-wrap{padding:6px 4px 16px 4px !important;border-top:1px solid #f0f0f0 !important}
          .side.desktop:not(.hovered) .logout-wrap{padding-bottom:20px !important}
        }

        @media(max-width:900px){
          .account-wrap{grid-template-columns:${sideW}px 1fr !important;max-width:100% !important;height:calc(100dvh - 56px) !important;max-height:calc(100dvh - 56px) !important;min-height:calc(100dvh - 56px) !important;overflow:hidden !important;margin:0 !important}
          .side{position:sticky !important;top:0 !important;height:calc(100dvh - 56px) !important;max-height:calc(100dvh - 56px) !important;min-height:calc(100dvh - 56px) !important}
          .side.mobile{width:64px !important;border-right:${mobileOpen ? '1px solid #e5e7eb' : '0'} !important}
          .side.mobile.close{width:0 !important;min-width:0 !important;border:0 !important;overflow:hidden !important;transform:translateX(-100%) !important}
          .side.mobile.open{transform:translateX(0) !important}
          .side.mobile .top{justify-content:center;padding:0 6px;height:42px;min-height:42px}
          .side.mobile .top .brand{display:none}
          .side.mobile .it{flex-direction:column;justify-content:center;gap:2px;padding:6px 2px !important;font-size:8.5px;text-align:center;white-space:normal;font-weight:600;min-height:40px;line-height:1.1}
          .side.mobile .it .lb{font-size:8.5px;white-space:normal;overflow:hidden;text-overflow:ellipsis;max-width:56px}
          .side.mobile .it .ic{width:22px;height:22px;border-radius:6px;background:#f8fafc;display:flex;align-items:center;justify-content:center}
          .side.mobile .it.ac .ic{background:#F85606 !important;color:#fff}
          .side.mobile .it.ac{background:#fff5f0 !important;color:#F85606 !important}
          .page{width:100% !important;height:calc(100dvh - 56px) !important;max-height:calc(100dvh - 56px) !important;min-height:calc(100dvh - 56px) !important;overflow:hidden !important}
          .page-in{width:100% !important;height:calc(100dvh - 56px) !important;max-height:calc(100dvh - 56px) !important;overflow-y:auto !important;scrollbar-width:none !important;-ms-overflow-style:none !important}
          .page-in::-webkit-scrollbar{display:none !important;width:0 !important;height:0 !important}
          .content-inner{padding:8px 8px 140px 8px !important;width:100% !important;max-width:100% !important;margin:0 !important}
        }
      `}</style>
    </div>
  );
}