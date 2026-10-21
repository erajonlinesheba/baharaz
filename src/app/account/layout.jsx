"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const menu = [
  { label: "Dashboard", href: "/account", icon: "📊", color: "#f85606" },
  { label: "My Orders", href: "/account/orders", icon: "📦", color: "#6366f1" },
  { label: "Profile", href: "/account/profile", icon: "👤", color: "#10b981" },
  { label: "Address", href: "/account/address", icon: "📍", color: "#f59e0b" },
  { label: "Vouchers", href: "/account/vouchers", icon: "🎟️", color: "#ec4899" },
  { label: "Security", href: "/account/security", icon: "🔒", color: "#8b5cf6" },
  { label: "Wishlist", href: "/account/wishlist", icon: "❤️", color: "#ef4444" },
  { label: "Viewed", href: "/account/recent", icon: "👁️", color: "#06b6d4" },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // ✅ REAL LOGOUT - No Event Loop
      const { error } = await supabase.auth.signOut();
      if (error) console.log("Logout error:", error);
      
      // Force redirect
      router.push("/");
      setTimeout(() => {
        router.refresh();
        window.location.href = "/";
      }, 300);
    } catch (e) {
      console.log("Logout catch:", e);
      window.location.href = "/";
    }
  };

  // ✅ Hydration Fix - Server & Client Same Until Mounted
  if (!mounted) {
    return (
      <div className="fix-root">
        <div className="fix-wrapper">
          <aside className="fix-sidebar closed">
            <div className="fix-scroll">
              <div className="fix-menu">
                {menu.map((m) => {
                  const active = pathname === m.href || (m.href !== "/account" && pathname.startsWith(m.href));
                  return (
                    <Link key={m.href} href={m.href} className={`fix-item ${active ? "active" : ""}`}>
                      <div className="fix-icon" style={{ background: active ? m.color : `${m.color}18`, color: active ? "#fff" : m.color }}>
                        {m.icon}
                      </div>
                      <span className="m-label">{m.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="fix-foot">
                <button className="logout-btn"><span>🚪</span><span className="m-label">Logout</span></button>
              </div>
            </div>
          </aside>
          <main className="fix-main"><div className="fix-main-scroll">{children}</div></main>
        </div>
        <style>{`
          .fix-root { background: #f5f7fb; width: 100%; margin-top: 12px; min-height: calc(100vh - 140px); }
          .fix-wrapper { max-width: 1440px; margin: 0 auto; display: flex; gap: 14px; padding: 0 12px 90px 12px; }
          .fix-sidebar { background: #fff; border-radius: 16px; border: 1px solid #eef0f4; box-shadow: 0 8px 24px rgba(0,0,0,0.06); flex-shrink: 0; position: sticky; top: 86px; height: fit-content; min-height: 520px; width: 76px !important; min-width: 76px !important; overflow: hidden; }
          .fix-scroll { display: flex; flex-direction: column; min-height: 520px; }
          .fix-menu { padding: 12px 8px; display: flex; flex-direction: column; gap: 5px; align-items: center; }
          .fix-item { display: flex; align-items: center; justify-content: center; width: 100%; padding: 10px; border-radius: 10px; text-decoration: none; color: #8b90a0; }
          .fix-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justifyContent: center; }
          .m-label { display: none; }
          .fix-foot { padding: 10px; border-top: 1px solid #f1f2f5; margin-top: auto; }
          .logout-btn { width: 100%; background: #fff; color: #ef4444; border: 1px solid #ffe4e6; padding: 10px; border-radius: 10px; display: flex; align-items: center; justifyContent: center; }
          .fix-main { flex: 1; min-width: 0; }
        `}</style>
      </div>
    );
  }

  const isOpen = isMobile ? false : hovered;

  return (
    <div className="fix-root">
      <div className="fix-wrapper">
        <aside 
          className={`fix-sidebar ${isOpen ? "open" : "closed"}`} 
          onMouseEnter={() => !isMobile && setHovered(true)} 
          onMouseLeave={() => !isMobile && setHovered(false)}
        >
          <div className="fix-scroll">
            <div className="fix-menu">
              {menu.map((m) => {
                const active = pathname === m.href || (m.href !== "/account" && pathname.startsWith(m.href));
                return (
                  <Link key={m.href} href={m.href} className={`fix-item ${active ? "active" : ""}`}>
                    <div className="fix-icon" style={{ background: active ? m.color : `${m.color}18`, color: active ? "#fff" : m.color }}>
                      {m.icon}
                    </div>
                    {isOpen && <span className="d-label">{m.label}</span>}
                    {isMobile && <span className="m-label">{m.label}</span>}
                  </Link>
                );
              })}
            </div>

            <div className="fix-foot">
              <button onClick={handleLogout} disabled={loggingOut} className="logout-btn">
                <span>🚪</span>
                {isOpen && <span className="d-label">{loggingOut ? "Logging out..." : "Logout"}</span>}
                {isMobile && <span className="m-label">{loggingOut ? "..." : "Logout"}</span>}
              </button>
            </div>
          </div>
        </aside>

        <main className="fix-main"><div className="fix-main-scroll">{children}</div></main>
      </div>

      <style>{`
        .fix-root {
          background: #f5f7fb;
          width: 100%;
          margin-top: 12px;
          min-height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 1;
        }
        .fix-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          gap: 14px;
          padding: 0 12px 90px 12px;
          box-sizing: border-box;
          align-items: flex-start;
        }
        .fix-sidebar {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #eef0f4;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          flex-shrink: 0;
          position: sticky;
          top: 86px;
          height: fit-content;
          min-height: 520px;
          transition: width 0.25s cubic-bezier(0.2,0.8,0.2,1);
          overflow: hidden;
          z-index: 10;
        }
        .fix-sidebar.closed { width: 76px !important; min-width: 76px !important; }
        .fix-sidebar.open { width: 240px !important; min-width: 240px !important; }
        .fix-scroll { display: flex; flex-direction: column; height: 100%; min-height: 520px; }
        .fix-menu { padding: 12px 8px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .fix-sidebar.closed .fix-menu { align-items: center; }
        .fix-sidebar.open .fix-menu { align-items: stretch; }
        .fix-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%;
          box-sizing: border-box;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #8b90a0;
          transition: all 0.2s;
          font-weight: 500;
        }
        .fix-sidebar.closed .fix-item { justify-content: center; }
        .fix-sidebar.open .fix-item { justify-content: flex-start; }
        .fix-item:hover { background: #f7f8fa; color: #111; }
        .fix-item.active { background: #f7f8fa; color: #111; font-weight: 700; }
        .fix-sidebar.open .fix-item.active { background: #f85606; color: #fff; }
        .fix-icon {
          width: 32px; height: 32px; min-width: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justifyContent: center;
          font-size: 14px;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .d-label { font-size: 12px; font-weight: 600; white-space: nowrap; }
        .m-label { display: none; }
        .fix-foot { padding: 10px; border-top: 1px solid #f1f2f5; margin-top: auto; background: #fff; position: sticky; bottom: 0; }
        .logout-btn {
          width: 100%;
          background: #fff;
          color: #ef4444;
          border: 1px solid #ffe4e6;
          padding: 10px;
          border-radius: 10px;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 6px;
        }
        .logout-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
        .fix-main { flex: 1; min-width: 0; }
        .fix-main-scroll { width: 100%; }
        @media (max-width: 900px) {
          .fix-root { margin-top: 0; background: #f5f5f5; }
          .fix-wrapper { flex-direction: row; gap: 0; padding: 0 0 90px 0; }
          .fix-sidebar { width: 64px !important; min-width: 64px !important; border-radius: 14px; min-height: auto; top: 68px; position: sticky; margin: 8px 0 0 8px; display: flex !important; }
          .fix-sidebar.closed { width: 64px !important; min-width: 64px !important; }
          .fix-scroll { min-height: auto; }
          .fix-menu { padding: 6px; gap: 4px; align-items: center; }
          .fix-item { flex-direction: column; gap: 3px; padding: 6px 3px !important; border-radius: 10px; background: transparent !important; width: 100%; justify-content: center; }
          .fix-item.active { background: #111 !important; color: #fff; }
          .fix-item.active .fix-icon { background: #fff !important; color: #111 !important; }
          .fix-icon { width: 26px !important; height: 26px !important; min-width: 26px !important; font-size: 12px; }
          .d-label { display: none; }
          .m-label { display: block !important; font-size: 7.5px !important; font-weight: 700 !important; line-height: 1; text-align: center; }
          .fix-item.active .m-label { color: #fff; }
          .fix-foot { padding: 6px; }
          .logout-btn { flex-direction: column; gap: 2px; padding: 6px 3px; font-size: 7.5px; border-radius: 10px; background: #fff; border: 1px solid #eee; }
          .logout-btn span:first-child { font-size: 12px; }
          .fix-main { flex: 1; min-width: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}