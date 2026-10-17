"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

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
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);

    // DYNAMIC NAME - Fixed নাম বাদ, Customer এর আসল নাম দেখাবে
    const loadUser = async () => {
      // 1. Local Cache থেকে
      const cached = localStorage.getItem("eraj_user_cache");
      if (cached) {
        try {
          const u = JSON.parse(cached);
          const name = u?.user_metadata?.full_name || u?.user_metadata?.name || u?.user_metadata?.user_name || u?.email?.split("@")[0] || "";
          if (name) setDisplayName(name);
          setAvatar(u?.user_metadata?.picture || u?.user_metadata?.avatar_url || null);
        } catch {}
      }

      // 2. Supabase থেকে Real Name
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        const meta = user.user_metadata || {};
        const realName = meta.full_name || meta.name || meta.user_name || meta.display_name || user.email?.split("@")[0] || "User";
        setDisplayName(realName);
        setAvatar(meta.picture || meta.avatar_url || meta.avatar || null);
        // Cache update
        localStorage.setItem("eraj_user_cache", JSON.stringify(user));
      } else {
        // No user হলে Guest না, খালি রাখো
        if (!displayName) setDisplayName("My Account");
      }

      // 3. Auth State Change শুনবে - নতুন Customer আসলে নাম Auto Change হবে
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        const u = session?.user;
        if (u) {
          const m = u.user_metadata || {};
          const n = m.full_name || m.name || m.user_name || u.email?.split("@")[0] || "User";
          setDisplayName(n);
          setAvatar(m.picture || m.avatar_url || null);
        }
      });

      return () => listener?.subscription?.unsubscribe();
    };

    loadUser();
    return () => window.removeEventListener("resize", check);
  }, []);

  const isOpen = isMobile? true : hovered;
  const firstLetter = displayName? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="fix-root">
      <div className="fix-wrapper">
        <aside className={`fix-sidebar ${isOpen? "open" : "closed"}`} onMouseEnter={() =>!isMobile && setHovered(true)} onMouseLeave={() =>!isMobile && setHovered(false)}>
          <div className="fix-scroll">
            <div className="fix-head">
              <div className="fix-avatar">{avatar? <img src={avatar} alt="" /> : firstLetter}</div>
              {isOpen && <div className="fix-user"><b>{displayName || "My Account"}</b><span>◆ Platinum • Level 4</span></div>}
            </div>

            <div className="fix-menu">
              {menu.map((m) => {
                const active = pathname === m.href || (m.href!== "/account" && pathname.startsWith(m.href));
                return (
                  <Link key={m.href} href={m.href} className={`fix-item ${active? "active" : ""}`} style={{ "--c": m.color }}>
                    <div className="fix-icon" style={{ background: active? m.color : `${m.color}18`, color: active? "#fff" : m.color }}>{m.icon}</div>
                    {isOpen && <span>{m.label}</span>}
                  </Link>
                );
              })}
            </div>

            {isOpen && (
              <div className="fix-foot">
                <div className="fix-card"><p>✦ 21 Orders • ৳26k Spent</p><div className="fix-bar"><div></div></div></div>
              </div>
            )}
          </div>
        </aside>

        <main className="fix-main"><div className="fix-main-scroll">{children}</div></main>
      </div>

      <style>{`
.fix-root {
        background: #f5f7fb;
        width: 100%;
        margin-top: 28px;
        height: calc(100vh - 190px);
        min-height: calc(100vh - 190px);
        overflow: hidden;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
      }
.fix-wrapper {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        gap: 16px;
        height: 100%;
        padding: 0 16px 16px 16px;
        box-sizing: border-box;
      }
.fix-sidebar {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #eef0f4;
        box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: width 0.3s cubic-bezier(0.2,0.8,0.2,1);
      }
.fix-sidebar.closed { width: 88px!important; min-width: 88px!important; }
.fix-sidebar.open { width: 250px!important; min-width: 250px!important; box-shadow: 0 14px 40px rgba(0,0,0,0.12); }
.fix-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; scrollbar-width: none; }
.fix-scroll::-webkit-scrollbar { display: none; }
.fix-head {
        padding: 18px 12px;
        display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid #f1f2f5;
        background: #fff;
        position: sticky; top: 0; z-index: 2;
        flex-shrink: 0;
        justify-content: center;
      }
.fix-sidebar.open.fix-head { justify-content: flex-start; }
.fix-avatar {
        width: 42px; height: 42px; min-width: 42px;
        border-radius: 12px;
        background: #111;
        color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-weight: 900; font-size: 14px;
        overflow: hidden;
        flex-shrink: 0;
      }
.fix-avatar img { width: 100%; height: 100%; object-fit: cover; }
.fix-user { min-width: 0; overflow: hidden; }
.fix-user b { display: block; font-size: 13px; font-weight: 800; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1; text-transform: capitalize; }
.fix-user span { display: inline-block; margin-top: 5px; font-size: 9.5px; font-weight: 800; color: #f85606; background: #fff1eb; padding: 3px 8px; border-radius: 20px; }
.fix-menu { padding: 12px 10px; display: flex; flex-direction: column; gap: 6px; flex: 1; align-items: center; }
.fix-sidebar.open.fix-menu { align-items: stretch; }
.fix-item {
        display: flex; align-items: center; gap: 12px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 12px;
        text-decoration: none;
        color: #8b90a0;
        transition: all 0.2s;
        font-weight: 500;
        justify-content: center;
      }
.fix-sidebar.open.fix-item { justify-content: flex-start; }
.fix-item:hover { background: #f7f8fa; color: #111; }
.fix-item.active { background: #f7f8fa; color: #111; font-weight: 700; }
.fix-sidebar.open.fix-item.active { background: #111; color: #fff; }
.fix-icon {
        width: 38px; height: 38px; min-width: 38px;
        border-radius: 11px;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }
.fix-item span { font-size: 13px; font-weight: 600; white-space: nowrap; margin: 0; }
.fix-foot { padding: 14px; border-top: 1px solid #f1f2f5; margin-top: auto; position: sticky; bottom: 0; background: #fff; }
.fix-card { background: linear-gradient(135deg, #fff7f3, #fff); border: 1px solid #ffe4d6; border-radius: 11px; padding: 11px; }
.fix-card p { margin: 0; font-size: 10.5px; font-weight: 700; color: #111; }
.fix-bar { margin-top: 9px; height: 4px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
.fix-bar div { width: 72%; height: 100%; background: linear-gradient(90deg,#f85606,#ff8a00); }
.fix-main { flex: 1; min-width: 0; height: 100%; overflow: hidden; border-radius: 16px; }
.fix-main-scroll { height: 100%; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; }
      @media (max-width: 900px) {
 .fix-root { height: auto; min-height: auto; overflow: visible; margin-top: 12px; }
 .fix-wrapper { flex-direction: column; height: auto; overflow: visible; }
 .fix-sidebar { width: 100%!important; min-width: 100%!important; height: auto; overflow: visible; }
 .fix-scroll { overflow: visible; height: auto; }
 .fix-main { height: auto; overflow: visible; }
 .fix-main-scroll { height: auto; overflow: visible; }
 .fix-menu { flex-direction: row; overflow-x: auto; justify-content: flex-start; }
 .fix-menu::-webkit-scrollbar { display: none; }
 .fix-item { flex-shrink: 0; width: auto; }
      }
      `}</style>
    </div>
  );
}