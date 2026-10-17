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
  const [imgError, setImgError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const cached = localStorage.getItem("eraj_user_cache");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch {}
    }
    try { 
      setWishlist(JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]")); 
      const cart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      setCartCount(cart.length);
    } catch {}

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) { 
        loadLocalOrders();
        return; 
      }
      setUser(currentUser);
      localStorage.setItem("eraj_user_cache", JSON.stringify(currentUser));
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
      if (prof) {
        setProfile(prof);
        // FIX: Profile পাওয়ার সাথে সাথে TopBar + Header কে জানাবে
        window.dispatchEvent(new Event('profileUpdated'));
        window.dispatchEvent(new Event('authChanged'));
      }
      
      let merged = [];
      try {
        const keys = ["eraj_all_orders", "baharaz_orders", "eraj_orders", "all_orders"];
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
        const last = localStorage.getItem("eraj_last_order");
        if (last) {
          const l = JSON.parse(last);
          if (l?.id && !merged.find(m => m.id === l.id)) {
            merged.push({ id: l.id, total: l.total||0, total_amount: l.total||0, status: l.status||"pending", created_at: l.created_at||new Date().toISOString(), items: l.items||[] });
          }
        }
      } catch {}

      try {
        const { data: orderData } = await supabase.from("orders").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(20);
        if (orderData) {
          orderData.forEach(o => {
            if (!merged.find(m => m.id === o.id)) merged.push(o);
          });
        }
      } catch {}

      const seen = new Set();
      const unique = [];
      merged.forEach(o => {
        if (!seen.has(o.id)) { seen.add(o.id); unique.push(o); }
      });
      unique.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(unique);
    }

    function loadLocalOrders() {
      let merged = [];
      try {
        const keys = ["eraj_all_orders", "baharaz_orders"];
        keys.forEach(k => {
          const raw = localStorage.getItem(k);
          if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
              arr.forEach(o => {
                if (o.id || o.orderId) {
                  merged.push({ id: o.orderId || o.id, total: o.total||0, total_amount: o.total||0, status: o.status||"pending", created_at: o.date || o.created_at || new Date().toISOString(), items: o.items||[] });
                }
              });
            }
          }
        });
        const last = localStorage.getItem("eraj_last_order");
        if (last) {
          const l = JSON.parse(last);
          if (l?.id && !merged.find(m => m.id === l.id)) {
            merged.push({ id: l.id, total: l.total||0, total_amount: l.total||0, status: l.status||"pending", created_at: l.created_at||new Date().toISOString(), items: l.items||[] });
          }
        }
      } catch {}
      const seen = new Set();
      const unique = [];
      merged.forEach(o => { if(!seen.has(o.id)){ seen.add(o.id); unique.push(o);} });
      unique.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(unique);
    }

    load();
    const onStorage = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
        setCartCount(cart.length);
        setWishlist(JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]"));
      } catch {}
    };
    const onProfileUpdated = () => {
      load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onStorage);
    window.addEventListener("profileUpdated", onProfileUpdated);
    window.addEventListener("authChanged", onProfileUpdated);
    return () => { 
      window.removeEventListener("storage", onStorage); 
      window.removeEventListener("cartUpdated", onStorage);
      window.removeEventListener("profileUpdated", onProfileUpdated);
      window.removeEventListener("authChanged", onProfileUpdated);
    };
  }, []);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || Number(o.total_amount) || 0), 0);
    const delivered = orders.filter(o => o.status === "delivered" || o.status === "completed").length;
    const pending = orders.filter(o => o.status === "pending").length;
    const shipped = orders.filter(o => o.status === "shipped").length;
    return { totalOrders: orders.length, totalSpent, delivered, pending, shipped, wishlistCount: wishlist.length };
  }, [orders, wishlist]);

  const getDisplayName = () => {
    const meta = user?.user_metadata || {};
    // FIX: Profile Table এর নাম আগে, তারপর Gmail এর নাম
    return profile?.full_name || meta.full_name || meta.name || user?.email?.split("@")[0] || "E-RAJ SHOP";
  };
  const getAvatarUrl = () => {
    const meta = user?.user_metadata || {};
    return meta.picture || meta.avatar_url || profile?.avatar_url || null;
  };

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  const memberTier = stats.totalOrders > 10 ? "Platinum" : stats.totalOrders > 3 ? "Gold" : "Silver";
  const nextTierOrders = memberTier === "Silver" ? 4 - stats.totalOrders : memberTier === "Gold" ? 11 - stats.totalOrders : 0;
  const progress = memberTier === "Silver" ? (stats.totalOrders / 4) * 100 : memberTier === "Gold" ? (stats.totalOrders / 11) * 100 : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", paddingTop: "24px", marginTop: "10px" }}>
      {/* Welcome Card */}
      <div style={{ background: "linear-gradient(135deg,#f85606 0%,#ff8a00 50%,#ff6a00 100%)", borderRadius: "20px", padding: "20px", color: "white", display: "flex", gap: "16px", alignItems: "center", position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(248,86,6,0.3)", width: "100%", maxWidth: "100%", boxSizing: "border-box", flexWrap: "wrap" }}>
        <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", background: "rgba(255,255,255,0.15)", borderRadius: "50%" }}></div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "white", color: "#f85606", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "26px", overflow: "hidden", flexShrink: 0, border: "3px solid rgba(255,255,255,0.5)", zIndex: 2 }}>
          {avatarUrl && !imgError ? <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : displayName.charAt(0).toUpperCase()}
        </div>
        <div style={{ zIndex: 2, flex: "1 1 200px", minWidth: "0" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <p style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "1px", background: "rgba(0,0,0,0.25)", display: "inline-block", padding: "4px 10px", borderRadius: "20px", margin: 0 }}>✨ {memberTier} MEMBER</p>
            {nextTierOrders > 0 && nextTierOrders <= 10 && <p style={{ fontSize: "9px", background: "white", color: "#f85606", padding: "3px 8px", borderRadius: "20px", fontWeight: "900", margin: 0 }}>{nextTierOrders} more to {memberTier === "Silver" ? "Gold" : "Platinum"}</p>}
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "900", marginTop: "8px", marginBottom: "0" }}>Welcome, {displayName} 👋</h1>
          <p style={{ fontSize: "11px", opacity: 0.95, marginTop: "4px", marginBottom: "0" }}>{user?.email || "erajonlinesheba@gmail.com"} • {stats.totalOrders} Orders</p>
          <div style={{ marginTop: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", height: "6px", overflow: "hidden", width: "280px", maxWidth: "100%" }}>
            <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: "white", borderRadius: "10px" }}></div>
          </div>
        </div>
        <Link href="/account/profile" style={{ zIndex: 2, background: "white", color: "#f85606", padding: "8px 16px", borderRadius: "30px", fontWeight: "900", fontSize: "11px", textDecoration: "none", flexShrink: 0 }}>Edit →</Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>TOTAL ORDERS</p>
          <p style={{ fontSize: "26px", fontWeight: "900", margin: "6px 0 0 0" }}>{stats.totalOrders}</p>
          <p style={{ fontSize: "10px", color: "#f85606", fontWeight: "800", marginTop: "6px", background: "#fff1eb", display: "inline-block", padding: "3px 8px", borderRadius: "20px" }}>{memberTier} • {stats.pending} Pending</p>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>TOTAL SPENT</p>
          <p style={{ fontSize: "22px", fontWeight: "900", color: "#f85606", margin: "6px 0 0 0" }}>{safeFormatPrice(stats.totalSpent)}</p>
          <p style={{ fontSize: "10px", color: "#16a34a", fontWeight: "800", marginTop: "6px" }}>💰 Saved ৳{Math.floor(stats.totalSpent*0.05)}</p>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>DELIVERED</p>
          <p style={{ fontSize: "26px", fontWeight: "900", color: "#16a34a", margin: "6px 0 0 0" }}>{stats.delivered}</p>
          <div style={{ marginTop: "6px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", background: "#f0fdf4", color: "#15803d", padding: "3px 7px", borderRadius: "20px", fontWeight: "900" }}>✅ {stats.delivered} Done</span>
            <span style={{ fontSize: "9px", background: "#fef3c7", color: "#92400e", padding: "3px 7px", borderRadius: "20px", fontWeight: "900" }}>🚚 {stats.shipped}</span>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: "10px", fontWeight: "900", color: "#999", margin: 0 }}>WISHLIST & CART</p>
          <p style={{ fontSize: "26px", fontWeight: "900", margin: "6px 0 0 0" }}>{stats.wishlistCount + cartCount}</p>
          <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <Link href="/account/wishlist" style={{ fontSize: "10px", fontWeight: "900", background: "black", color: "white", padding: "4px 10px", borderRadius: "20px", textDecoration: "none" }}>❤️ {stats.wishlistCount}</Link>
            <Link href="/cart" style={{ fontSize: "10px", fontWeight: "900", background: "#f85606", color: "white", padding: "4px 10px", borderRadius: "20px", textDecoration: "none" }}>🛒 {cartCount}</Link>
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "16px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "18px", border: "1px solid #f0f0f0", minWidth: "0", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: "900", fontSize: "14px", margin: 0 }}>📦 Recent Orders - {orders.length}</h2>
            <Link href="/account/orders" style={{ fontSize: "11px", fontWeight: "900", color: "#f85606", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", border: "2px dashed #eee", borderRadius: "12px" }}>
                <p style={{ fontSize: "30px", margin: 0 }}>🛍️</p>
                <p style={{ fontSize: "12px", fontWeight: "900", marginTop: "8px" }}>No orders yet</p>
                <Link href="/" style={{ display: "inline-block", marginTop: "12px", background: "#f85606", color: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "11px", fontWeight: "900", textDecoration: "none" }}>Start Shopping</Link>
              </div>
            ) : (
              orders.slice(0, 5).map((o, idx) => (
                <div key={o.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#fafafa", borderRadius: "10px", border: "1px solid #f0f0f0", gap: "10px", minWidth: "0" }}>
                  <div style={{ minWidth: "0", flex: "1" }}>
                    <p style={{ fontSize: "12px", fontWeight: "900", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>#{String(o.id).slice(0, 8).toUpperCase()} • {new Date(o.created_at).toLocaleDateString()}</p>
                    <p style={{ fontSize: "11px", color: "#666", margin: "2px 0 0 0" }}>{o.items?.length || 1} items • {o.status}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: "900", color: "#f85606", margin: 0 }}>{safeFormatPrice(o.total || o.total_amount || 0)}</p>
                    <p style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "10px", background: o.status === "pending" ? "#fef3c7" : "#dcfce7", color: o.status === "pending" ? "#92400e" : "#166534", fontWeight: "900", display: "inline-block", marginTop: "2px" }}>{o.status?.toUpperCase()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0" }}>
            <h2 style={{ fontWeight: "900", fontSize: "13px", margin: 0 }}>⚡ Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "14px" }}>
              <Link href="/account/orders" style={{ background: "#fff1eb", padding: "12px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px", border: "1px solid #ffe4d6" }}>📦<br />My Orders<br /><span style={{ fontSize: "9px", color: "#f85606" }}>{stats.totalOrders} orders</span></Link>
              <Link href="/account/wishlist" style={{ background: "#fef2f2", padding: "12px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px", border: "1px solid #fecaca" }}>❤️<br />Wishlist<br /><span style={{ fontSize: "9px", color: "#dc2626" }}>{stats.wishlistCount} items</span></Link>
              <Link href="/account/profile" style={{ background: "#f0f9ff", padding: "12px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px", border: "1px solid #bae6fd" }}>🛡️<br />Edit Profile</Link>
              <Link href="/cart" style={{ background: "#f0fdf4", padding: "12px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "black", fontWeight: "800", fontSize: "11px", border: "1px solid #bbf7d0" }}>🛒<br />My Cart<br /><span style={{ fontSize: "9px", color: "#16a34a" }}>{cartCount} items</span></Link>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg,#000,#333)", borderRadius: "16px", padding: "16px", color: "white" }}>
            <p style={{ fontSize: "12px", fontWeight: "900", margin: 0 }}>🎧 Need Help?</p>
            <p style={{ fontSize: "11px", opacity: 0.8, marginTop: "6px" }}>Delivery ৳55 Fixed • COD • 7 Days Return</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <Link href="/customer-care" style={{ flex: "1", background: "white", color: "black", textAlign: "center", padding: "8px", borderRadius: "20px", fontSize: "10px", fontWeight: "900", textDecoration: "none" }}>Support</Link>
              <Link href="/" style={{ flex: "1", background: "#f85606", color: "white", textAlign: "center", padding: "8px", borderRadius: "20px", fontSize: "10px", fontWeight: "900", textDecoration: "none" }}>Shop Now</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @media(max-width:1100px){ div[style*="grid-template-columns: 1.7fr 1fr"]{grid-template-columns:1fr!important} }
        @media(max-width:700px){ div[style*="grid-template-columns: repeat(auto-fit"]{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:480px){ div[style*="grid-template-columns: repeat(auto-fit"]{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
}