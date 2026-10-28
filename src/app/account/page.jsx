"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const safeFormatPrice = (price) => {
  try {
    const num = Number(price || 0);
    return `৳${num.toFixed(0)}`;
  } catch {
    return `৳0`;
  }
};

export default function AccountDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(350);
  const [vouchers, setVouchers] = useState(2);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;
    let profileChannel = null;
    try {
      const localCoins = Number(localStorage.getItem('baharaz_coins') || '350');
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const localWishlist = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      const localRecent = JSON.parse(localStorage.getItem("baharaz_recent") || localStorage.getItem("recently_viewed") || "[]");
      const localVouchers = JSON.parse(localStorage.getItem("baharaz_vouchers") || "[]");
      if (isMounted) {
        setCoins(localCoins);
        setCartCount(localCart.length);
        if (localWishlist.length > 0) setWishlist(localWishlist);
        if (localRecent.length > 0) setRecent(localRecent);
        setVouchers(localVouchers.length || 2);
      }
      let merged = [];
      try {
        const keys = ["baharaz_orders", "eraj_all_orders", "eraj_orders", "all_orders"];
        keys.forEach(k => {
          const raw = localStorage.getItem(k);
          if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
              arr.forEach(o => {
                if (o.id || o.orderId) {
                  merged.push({
                    id: o.orderId || o.id,
                    total: o.total || o.total_amount || 0,
                    total_amount: o.total || o.total_amount || 0,
                    status: o.status || "pending",
                    created_at: o.date || o.created_at || new Date().toISOString(),
                    items: o.items || []
                  });
                }
              });
            }
          }
        });
      } catch {}
      const seen = new Set();
      const unique = [];
      merged.forEach(o => { if (!seen.has(o.id)) { seen.add(o.id); unique.push(o); } });
      unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      if (isMounted && unique.length > 0) setOrders(unique);
    } catch {}

    async function load() {
      if (!isMounted) return;
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user;
        if (sessionError) console.log("Session error:", sessionError);
        if (!currentUser) {
          if (isMounted) setLoading(false);
          return;
        }
        if (isMounted) setUser(currentUser);
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
        if (isMounted && prof) { setProfile(prof); setImgError(false); }
        profileChannel = supabase.channel(`profile-dashboard-${currentUser.id}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${currentUser.id}` }, (payload) => {
            if (isMounted && payload.new) { setProfile(payload.new); setImgError(false); }
          }).subscribe();
        supabase.from("orders").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(20).then(({ data: orderData }) => {
          if (!isMounted) return;
          if (orderData && orderData.length > 0) {
            setOrders(prev => {
              const seen = new Set(orderData.map(o => o.id));
              const mergedLocal = [...orderData];
              prev.forEach(o => { if (!seen.has(o.id)) mergedLocal.push(o); });
              mergedLocal.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              return mergedLocal;
            });
          }
        });
        supabase.from("carts").select("*", { count: "exact", head: true }).eq("user_id", currentUser.id).then(({ count }) => {
          if (isMounted && count !== null) setCartCount(count);
        });
        supabase.from("wishlists").select("id").eq("user_id", currentUser.id).then(({ data }) => {
          if (isMounted && data && data.length > 0) setWishlist(data);
        });
      } catch (e) { console.log("Load error", e); } finally { if (isMounted) setLoading(false); }
    }
    load();
    const onProfileUpdated = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user;
        if (currentUser && isMounted) {
          const { data: prof } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
          if (prof) { setProfile(prof); setImgError(false); }
          setUser(currentUser);
        }
      } catch {}
    };
    const onStorage = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
        const coinsNow = Number(localStorage.getItem('baharaz_coins') || '350');
        if (isMounted) {
          setCartCount(cart.length);
          setCoins(coinsNow);
          setWishlist(JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]"));
          setRecent(JSON.parse(localStorage.getItem("baharaz_recent") || "[]"));
        }
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onStorage);
    window.addEventListener("cart-update", onStorage);
    window.addEventListener("coinsUpdated", onStorage);
    window.addEventListener("profileUpdated", onProfileUpdated);
    window.addEventListener("authChanged", onProfileUpdated);
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted && session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        if (prof) setProfile(prof);
      }
      if (event === "SIGNED_OUT" && isMounted) { setUser(null); setProfile(null); }
    });
    return () => {
      isMounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onStorage);
      window.removeEventListener("cart-update", onStorage);
      window.removeEventListener("coinsUpdated", onStorage);
      window.removeEventListener("profileUpdated", onProfileUpdated);
      window.removeEventListener("authChanged", onProfileUpdated);
      if (profileChannel) supabase.removeChannel(profileChannel);
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || Number(o.total_amount) || 0), 0);
    const pending = orders.filter(o => o.status === "pending" || o.status === "to_pay").length;
    const shipped = orders.filter(o => o.status === "shipped" || o.status === "processing" || o.status === "to_ship").length;
    const toReceive = orders.filter(o => o.status === "shipped").length;
    const delivered = orders.filter(o => o.status === "delivered" || o.status === "completed").length;
    return { totalOrders: orders.length, totalSpent, pending, shipped, toReceive, delivered, toReview: delivered, wishlistCount: wishlist.length };
  }, [orders, wishlist]);

  const getDisplayName = () => {
    const meta = user?.user_metadata || {};
    return profile?.full_name || meta.full_name || meta.name || user?.email?.split("@")[0] || "BAHARAZ USER";
  };
  const getAvatarUrl = () => {
    const meta = user?.user_metadata || {};
    if (profile?.avatar_url) return profile.avatar_url;
    if (meta.picture) return meta.picture;
    if (meta.avatar_url) return meta.avatar_url;
    return null;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#f5f5f5] p-3">
        <div className="bg-white rounded-[16px] p-4 flex gap-3 items-center animate-pulse"><div className="w-[60px] h-[60px] rounded-full bg-[#f0f0f0]"></div><div className="flex-1"><div className="h-[18px] w-[120px] bg-[#f0f0f0] rounded mb-2"></div><div className="h-[12px] w-[180px] bg-[#f0f0f0] rounded"></div></div></div>
      </div>
    );
  }

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  const isLoggedIn = !!user;

  return (
    <div className="w-full bg-[#f5f5f5] overflow-x-hidden" style={{ minHeight: "auto", paddingBottom: "0px" }}>
      {/* Mobile - FULL FUTURE - GAP FIXED */}
      <div className="block lg:hidden w-full bg-[#f5f5f5]">
        <div style={{ background: isLoggedIn ? "linear-gradient(180deg, #ffe9e5 0%, #fff5f1 50%, #fff 100%)" : "#f8f8f8", padding: "16px 12px 14px 12px" }}>
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "white", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", overflow: "hidden", flexShrink: 0 }}>
                {avatarUrl && !imgError ? <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontWeight: 900, color: "#f85606" }}>{displayName.charAt(0).toUpperCase()}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "900", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</h2>
                <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#555" }}><b>{stats.wishlistCount}</b> Wishlist · <b>{cartCount}</b> Cart · <b>{vouchers}</b> Vouchers · 🪙 <b>{coins}</b></p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.dispatchEvent(new Event('toggleAccountSidebar')); }} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)", cursor: "pointer", touchAction: "manipulation", flexShrink: 0, transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)" }} aria-label="Open Menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <p style={{ margin: "0 0 14px 0", fontSize: "16px", color: "#333" }}>Hello, Welcome to Baharaz !</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Link href="/login" style={{ background: "#f85606", color: "white", padding: "10px 38px", borderRadius: "8px", fontWeight: "800", textDecoration: "none", fontSize: "15px" }}>Login</Link>
                <Link href="/signup" style={{ background: "white", color: "#f85606", padding: "10px 28px", borderRadius: "8px", fontWeight: "800", textDecoration: "none", fontSize: "15px", border: "1.5px solid #ffd1c0" }}>Sign Up</Link>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "white", padding: "10px", display: "flex", gap: "8px" }}>
          <Link href="/account/coins" style={{ flex: 1, background: "#eef3ff", borderRadius: "10px", padding: "8px", display: "flex", gap: "8px", alignItems: "center", textDecoration: "none", border: "1px solid #dbe8ff" }}>
            <div style={{ width: "52px", height: "52px", background: "#0a3cff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "10px", textAlign: "center", lineHeight: "1.1" }}>UP TO<br/>70%<br/>OFF</div>
            <div><p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#111" }}>Baharaz Coins ❯</p><p style={{ margin: 0, fontSize: "12px", color: "#e60012", fontWeight: "900" }}>70% OFF</p><span style={{ background: "#f85606", color: "white", fontSize: "9px", padding: "2px 8px", borderRadius: "4px", fontWeight: "800" }}>SHOP HERE</span></div>
          </Link>
          <Link href="/invite" style={{ flex: 1, background: "#f5e8ff", borderRadius: "10px", padding: "8px", display: "flex", gap: "8px", alignItems: "center", textDecoration: "none", border: "1px solid #e8d0ff" }}>
            <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg,#a020f0,#ff00ff)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📱</div>
            <div><p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#111" }}>Baharaz</p><p style={{ margin: 0, fontSize: "12px", color: "#e60012", fontWeight: "900" }}>Invite & Win</p><span style={{ background: "#ff6a00", color: "white", fontSize: "9px", padding: "2px 12px", borderRadius: "4px", fontWeight: "800" }}>Play</span></div>
          </Link>
        </div>

        <div style={{ background: "white", padding: "12px 8px 8px", display: "flex", gap: "2px", overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            { i: "🌳", t: "Baharaz\nLand", c: "#d4f5d4", link: "/baharaz-land" },
            { i: "🍬", t: "Baharaz\nCandy", c: "#ffe082", link: "/baharaz-candy" },
            { i: "💰", t: "Buy More\nSave More", c: "#ffcc80", link: "/buy-more" },
            { i: "🎫", t: "Vouchers", c: "#e1bee7", link: "/account/vouchers" },
            { i: "🪙", t: "Coins", c: "#FFF8E1", link: "/account/coins" },
            { i: "🏬", t: "Baharaz\nMall", c: "#c8e6c9", link: "/mall" },
          ].map((x, idx) => (
            <Link key={idx} href={x.link} style={{ minWidth: "70px", textAlign: "center", textDecoration: "none", color: "#111" }}>
              <div style={{ width: "48px", height: "48px", margin: "0 auto", borderRadius: "12px", background: x.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{x.i}</div>
              <p style={{ fontSize: "11px", margin: "4px 0 0 0", whiteSpace: "pre", lineHeight: "1.1", fontWeight: "500" }}>{x.t}</p>
            </Link>
          ))}
        </div>

        <div style={{ background: "white", marginTop: "8px", padding: "12px 12px 14px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900" }}>My Orders</h3>
            <Link href="/account/orders" style={{ fontSize: "13px", color: "#666", textDecoration: "none" }}>View All Orders ›</Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            {[
              { k: "To Pay", icon: "💳", count: stats.pending },
              { k: "To Ship", icon: "📦", count: stats.shipped },
              { k: "To Receive", icon: "🚚", count: stats.toReceive },
              { k: "To Review", icon: "💬", count: stats.toReview },
              { k: "Returns&\nCancellations", icon: "↩️", count: 0 },
            ].map((o, idx) => (
              <Link key={idx} href={`/account/orders?filter=${encodeURIComponent(o.k)}`} style={{ textAlign: "center", textDecoration: "none", color: "#111", flex: 1 }}>
                <div style={{ position: "relative", width: "36px", margin: "0 auto" }}>
                  <div style={{ fontSize: "28px", color: "#f85606", lineHeight: "1" }}>{o.icon}</div>
                  {o.count > 0 && <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "#f85606", color: "white", fontSize: "10px", minWidth: "16px", height: "16px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", padding: "0 3px" }}>{o.count}</span>}
                </div>
                <p style={{ fontSize: "11px", margin: "6px 0 0 0", whiteSpace: "pre", lineHeight: "1.1", fontWeight: "500" }}>{o.k}</p>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: "white", marginTop: "8px", padding: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900" }}>Recently Viewed</h3>
            <Link href="/account/recent" style={{ fontSize: "13px", color: "#666", textDecoration: "none" }}>{isLoggedIn ? "View More ›" : "Log in to view ›"}</Link>
          </div>
          {isLoggedIn && recent.length > 0 ? (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginTop: "10px", paddingBottom: "4px" }}>
              {recent.slice(0, 6).map((p, i) => (
                <div key={i} style={{ minWidth: "110px", border: "1px solid #f0f0f0", borderRadius: "8px", overflow: "hidden", background: "white" }}>
                  <img src={p.image || p.thumbnail || p.image_url} alt="" style={{ width: "100%", height: "90px", objectFit: "cover" }} />
                  <div style={{ padding: "4px 6px" }}><p style={{ margin: 0, fontSize: "12px", color: "#f85606", fontWeight: "800" }}>{safeFormatPrice(p.price)}</p></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: "1.4" }}>Rediscover delightful items<br/>you've viewed recently!</p>
                <Link href="/account/recent" style={{ display: "inline-block", marginTop: "8px", background: "#f85606", color: "white", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", textDecoration: "none" }}>View More</Link>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "64px", height: "64px", background: "#f5f5f5", borderRadius: "8px" }}></div>
                <div style={{ width: "64px", height: "64px", background: "#f5f5f5", borderRadius: "8px" }}></div>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "white", marginTop: "8px", padding: "14px 0 14px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "18px 0" }}>
            {[
              { icon: "🍬", label: "Baharaz Candy", link: "/baharaz-candy" },
              { icon: "🛒", label: "Buy\nAny 3", link: "/buy-any-3" },
              { icon: "📦", label: "Pickup Points", link: "/pickup-points" },
              { icon: "👥", label: "My Affiliates", link: "/affiliate" },
              { icon: "❓", label: "Help Center", link: "/help" },
              { icon: "🎧", label: "Contact\nCustomer Care", link: "/customer-care" },
              { icon: "⭐", label: "My Reviews", link: "/account/reviews" },
              { icon: "💳", label: "Payment\nOptions", link: "/account/payment" },
            ].map((m, idx) => (
              <Link key={idx} href={m.link} style={{ textAlign: "center", textDecoration: "none", color: "#111" }}>
                <div style={{ width: "40px", height: "40px", margin: "0 auto", borderRadius: "10px", background: idx === 0 ? "#e8f0ff" : idx === 4 ? "#e0f2ff" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{m.icon}</div>
                <p style={{ fontSize: "11px", margin: "6px 0 0 0", whiteSpace: "pre", lineHeight: "1.2", fontWeight: "500" }}>{m.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop - FIXED - No Cut - Full Width Inside 1188px Layout */}
      <div className="hidden lg:flex flex-col gap-[14px] w-full max-w-full">
        <div style={{ background: "linear-gradient(135deg,#f85606 0%,#ff8a00 100%)", borderRadius: "18px", padding: "18px", color: "white", display: "flex", gap: "16px", alignItems: "center", boxShadow: "0 8px 24px rgba(248,86,6,0.25)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "white", color: "#f85606", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "24px", overflow: "hidden", flexShrink: 0, border: "3px solid rgba(255,255,255,0.6)" }}>
            {avatarUrl && !imgError ? <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "10px", fontWeight: "900", background: "rgba(0,0,0,0.25)", display: "inline-block", padding: "3px 10px", borderRadius: "20px", margin: 0 }}>✨ BAHARAZ MEMBER</p>
            <h1 style={{ fontSize: "18px", fontWeight: "900", margin: "6px 0 0 0" }}>Welcome, {displayName} 👋 🪙 {coins}</h1>
            <p style={{ fontSize: "11px", opacity: 0.95, margin: "4px 0 0 0" }}>{user?.email || ""} • {stats.totalOrders} Orders • ৳{stats.totalSpent} Spent</p>
          </div>
          <Link href="/account/profile" style={{ background: "white", color: "#f85606", padding: "9px 18px", borderRadius: "20px", fontWeight: "900", fontSize: "12px", textDecoration: "none" }}>Edit Profile →</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>TOTAL ORDERS</p>
            <p style={{ fontSize: "26px", fontWeight: "900", margin: "6px 0 0 0" }}>{stats.totalOrders}</p>
            <p style={{ fontSize: "10px", color: "#f85606", fontWeight: "800", marginTop: "6px", background: "#fff1eb", display: "inline-block", padding: "3px 8px", borderRadius: "20px" }}>{stats.pending} Pending</p>
          </div>
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>TOTAL SPENT</p>
            <p style={{ fontSize: "24px", fontWeight: "900", color: "#f85606", margin: "6px 0 0 0" }}>{safeFormatPrice(stats.totalSpent)}</p>
            <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: "800", marginTop: "6px" }}>💰 Saved ৳{Math.floor(stats.totalSpent * 0.05)}</p>
          </div>
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>DELIVERED</p>
            <p style={{ fontSize: "26px", fontWeight: "900", color: "#16a34a", margin: "6px 0 0 0" }}>{stats.delivered}</p>
            <p style={{ fontSize: "10px", background: "#f0fdf4", color: "#15803d", padding: "3px 8px", borderRadius: "20px", fontWeight: "900", display: "inline-block", marginTop: "6px" }}>✅ {stats.delivered} Completed</p>
          </div>
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>WISHLIST & CART</p>
            <p style={{ fontSize: "26px", fontWeight: "900", margin: "6px 0 0 0" }}>{stats.wishlistCount + cartCount}</p>
            <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
              <Link href="/account/wishlist" style={{ fontSize: "10px", fontWeight: "900", background: "black", color: "white", padding: "4px 10px", borderRadius: "20px", textDecoration: "none" }}>❤️ {stats.wishlistCount}</Link>
              <Link href="/cart" style={{ fontSize: "10px", fontWeight: "900", background: "#f85606", color: "white", padding: "4px 10px", borderRadius: "20px", textDecoration: "none" }}>🛒 {cartCount}</Link>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "14px" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: "900", fontSize: "14px", margin: 0 }}>📦 Recent Orders</h2>
              <Link href="/account/orders" style={{ fontSize: "11px", fontWeight: "900", color: "#f85606", textDecoration: "none" }}>View All →</Link>
            </div>
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", border: "2px dashed #eee", borderRadius: "12px" }}>
                  <p style={{ fontSize: "32px", margin: 0 }}>🛍️</p>
                  <p style={{ fontSize: "13px", fontWeight: "900", marginTop: "8px" }}>No orders yet - Shop on Baharaz</p>
                  <Link href="/" style={{ display: "inline-block", marginTop: "12px", background: "#f85606", color: "white", padding: "8px 18px", borderRadius: "20px", fontSize: "11px", fontWeight: "900", textDecoration: "none" }}>Start Shopping</Link>
                </div>
              ) : (
                orders.slice(0, 5).map((o, idx) => (
                  <div key={o.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: "900", margin: 0 }}>#{String(o.id).slice(0, 8).toUpperCase()} • {new Date(o.created_at).toLocaleDateString()}</p>
                      <p style={{ fontSize: "11px", color: "#666", margin: "3px 0 0 0" }}>{o.items?.length || 1} items • {o.status}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "13px", fontWeight: "900", color: "#f85606", margin: 0 }}>{safeFormatPrice(o.total || o.total_amount || 0)}</p>
                      <p style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "10px", background: o.status === "pending" ? "#fef3c7" : "#dcfce7", color: o.status === "pending" ? "#92400e" : "#166534", fontWeight: "900", display: "inline-block", marginTop: "3px" }}>{o.status?.toUpperCase()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #f0f0f0" }}>
              <h2 style={{ fontWeight: "900", fontSize: "13px", margin: 0 }}>⚡ Quick Actions - Baharaz</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                <Link href="/account/orders" style={{ background: "#fff1eb", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>📦<br />My Orders<br /><span style={{ fontSize: "9px", color: "#f85606" }}>{stats.totalOrders} orders</span></Link>
                <Link href="/account/wishlist" style={{ background: "#fef2f2", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>❤️<br />Wishlist<br /><span style={{ fontSize: "9px", color: "#dc2626" }}>{stats.wishlistCount} items</span></Link>
                <Link href="/account/coins" style={{ background: "#FFF8E1", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>🪙<br />My Coins<br /><span style={{ fontSize: "9px", color: "#E65100" }}>{coins} coins</span></Link>
                <Link href="/account/vouchers" style={{ background: "#E8F5E9", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>🎫<br />Vouchers<br /><span style={{ fontSize: "9px", color: "#2E7D32" }}>{vouchers} vouchers</span></Link>
                <Link href="/account/profile" style={{ background: "#f0f9ff", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>🛡️<br />Edit Profile</Link>
                <Link href="/cart" style={{ background: "#f0fdf4", padding: "14px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px" }}>🛒<br />My Cart<br /><span style={{ fontSize: "9px", color: "#16a34a" }}>{cartCount} items</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}