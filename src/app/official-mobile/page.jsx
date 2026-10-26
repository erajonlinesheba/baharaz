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

export default function OfficialMobilePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(12500);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const tabs = ["All", "Mobile", "Accessories", "Gadgets", "Best Selling", "New Arrival"];

  useEffect(() => {
    try {
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const localWishlist = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      const localFollowing = localStorage.getItem("baharaz_official_follow") === "true";
      setCart(localCart);
      setWishlist(localWishlist.map(w => w.id || w.product_id));
      setFollowing(localFollowing);
      if (localFollowing) setFollowers(12501);
    } catch {}

    async function load() {
      try {
        const { data } = await supabase.from("products").select("*").ilike("category", "%mobile%").limit(30);
        if (data && data.length > 0) {
          setProducts(data);
          setFiltered(data);
        } else {
          const mock = Array.from({ length: 24 }).map((_, i) => ({
            id: `official-mobile-${i + 1}`,
            title: i % 3 === 0 ? `Official Samsung Galaxy M${i + 1} 5G Smartphone` : i % 3 === 1 ? `Official iPhone ${14 + (i % 3)} Pro Max Cover Case` : `Official Fast Charger 65W Type-C Cable`,
            name: `Official Mobile Product ${i + 1}`,
            price: 899 + i * 120,
            original_price: 1299 + i * 200,
            image: `https://picsum.photos/300/300?random=${i + 100}`,
            image_url: `https://picsum.photos/300/300?random=${i + 100}`,
            thumbnail: `https://picsum.photos/300/300?random=${i + 100}`,
            rating: (4.3 + Math.random() * 0.6).toFixed(1),
            sold: Math.floor(200 + Math.random() * 5000),
            category: i % 3 === 0 ? "Mobile" : i % 3 === 1 ? "Accessories" : "Gadgets",
            is_official: true,
            warranty: true,
            free_shipping: i % 2 === 0,
          }));
          setProducts(mock);
          setFiltered(mock);
        }
      } catch {
        const mock = Array.from({ length: 24 }).map((_, i) => ({
          id: `official-mobile-${i + 1}`,
          title: `Official Mobile Product ${i + 1}`,
          name: `Official Mobile Product ${i + 1}`,
          price: 899 + i * 120,
          original_price: 1299 + i * 200,
          image: `https://picsum.photos/300/300?random=${i + 100}`,
          image_url: `https://picsum.photos/300/300?random=${i + 100}`,
          thumbnail: `https://picsum.photos/300/300?random=${i + 100}`,
          rating: (4.3 + Math.random() * 0.6).toFixed(1),
          sold: Math.floor(200 + Math.random() * 5000),
          category: i % 3 === 0 ? "Mobile" : "Accessories",
          is_official: true,
          warranty: true,
          free_shipping: i % 2 === 0,
        }));
        setProducts(mock);
        setFiltered(mock);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase]);

  useEffect(() => {
    let result = [...products];
    if (activeTab !== "All" && activeTab !== "Best Selling" && activeTab !== "New Arrival") {
      result = result.filter(p => p.category === activeTab);
    } else if (activeTab === "Best Selling") {
      result = [...result].sort((a, b) => b.sold - a.sold);
    } else if (activeTab === "New Arrival") {
      result = [...result].reverse();
    }
    if (search.trim()) {
      result = result.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [activeTab, search, products]);

  const addToCart = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const idx = existing.findIndex(item => (item.id || item.product_id) === product.id);
      if (idx > -1) existing[idx].quantity = (existing[idx].quantity || 1) + 1;
      else existing.push({ ...product, product_id: product.id, quantity: 1 });
      localStorage.setItem("baharaz_cart", JSON.stringify(existing));
      setCart(existing);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {}
  };

  const toggleWishlist = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      const idx = existing.findIndex(item => (item.id || item.product_id) === product.id);
      let updated;
      if (idx > -1) updated = existing.filter((_, i) => i !== idx);
      else updated = [...existing, { ...product, product_id: product.id }];
      localStorage.setItem("baharaz_wishlist", JSON.stringify(updated));
      setWishlist(updated.map(w => w.id || w.product_id));
    } catch {}
  };

  const toggleFollow = () => {
    const newVal = !following;
    setFollowing(newVal);
    setFollowers(f => newVal ? f + 1 : f - 1);
    localStorage.setItem("baharaz_official_follow", String(newVal));
  };

  const isInCart = (id) => cart.some(item => (item.id || item.product_id) === id);
  const isInWishlist = (id) => wishlist.includes(id);

  if (loading) {
    return (
      <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", padding: "12px" }}>
        <div style={{ background: "white", borderRadius: "16px", height: "180px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: "white", borderRadius: "12px", height: "220px", animation: "pulse 1.5s infinite" }} />)}
        </div>
        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid #f0f0f0" }}>
        <Link href="/" style={{ width: "36px", height: "36px", background: "#f5f5f5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <div style={{ flex: 1, background: "#f5f5f5", borderRadius: "10px", display: "flex", alignItems: "center", padding: "0 12px", height: "38px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in Official Store..." style={{ flex: 1, border: "none", outline: "none", marginLeft: "8px", fontSize: "13px", background: "transparent" }} />
        </div>
        <Link href="/cart" style={{ width: "36px", height: "36px", background: "#FFF1EB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F85606" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {cart.length > 0 && <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#F85606", color: "white", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
        </Link>
      </div>

      {/* Official Store Banner */}
      <div style={{ background: "linear-gradient(135deg,#0f0f0f 0%,#2a2a2a 100%)", padding: "16px 12px 14px 12px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", background: "radial-gradient(circle, rgba(248,86,6,0.25) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", gap: "12px", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: "64px", height: "64px", background: "white", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0, border: "2px solid #F85606" }}>📱</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "white" }}>Baharaz Official Mobile</h1>
              <span style={{ background: "#F85606", color: "white", fontSize: "8px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "2px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/></svg>
                OFFICIAL
              </span>
            </div>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#bbb" }}>{followers.toLocaleString()} Followers • 98% Positive Rating • Dhaka</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "9px", padding: "3px 8px", borderRadius: "12px", fontWeight: "700" }}>✓ 100% Authentic</span>
              <span style={{ background: "rgba(22,163,74,0.2)", color: "#4ade80", fontSize: "9px", padding: "3px 8px", borderRadius: "12px", fontWeight: "700" }}>✓ 1 Year Warranty</span>
            </div>
          </div>
          <button onClick={toggleFollow} style={{ background: following ? "white" : "#F85606", color: following ? "#111" : "white", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", cursor: "pointer", touchAction: "manipulation", flexShrink: 0, transition: "all 0.2s" }}>{following ? "Following ✓" : "+ Follow"}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "14px", position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "white" }}>4.8★</p><p style={{ margin: 0, fontSize: "9px", color: "#aaa" }}>Store Rating</p></div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "white" }}>2.5k+</p><p style={{ margin: 0, fontSize: "9px", color: "#aaa" }}>Products</p></div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}><p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#4ade80" }}>24h</p><p style={{ margin: 0, fontSize: "9px", color: "#aaa" }}>Fast Delivery</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", padding: "8px 0", position: "sticky", top: "58px", zIndex: 10, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 12px", scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", border: activeTab === tab ? "none" : "1px solid #eee", background: activeTab === tab ? "#111" : "white", color: activeTab === tab ? "white" : "#333", cursor: "pointer", touchAction: "manipulation" }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: "10px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", padding: "0 4px" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "800" }}>{filtered.length} Official Products</p>
          <span style={{ fontSize: "10px", background: "#111", color: "white", padding: "4px 10px", borderRadius: "12px", fontWeight: "800" }}>✓ Official Warranty</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column" }}>
              <Link href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", position: "relative" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#fafafa" }}>
                  <img src={p.image || p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", top: "6px", left: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ background: "#111", color: "white", fontSize: "8px", fontWeight: "900", padding: "3px 6px", borderRadius: "4px" }}>OFFICIAL</span>
                    {p.warranty && <span style={{ background: "#16a34a", color: "white", fontSize: "7px", fontWeight: "900", padding: "2px 5px", borderRadius: "3px" }}>WARRANTY</span>}
                  </div>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} style={{ position: "absolute", top: "6px", right: "6px", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(p.id) ? "#F85606" : "none"} stroke={isInWishlist(p.id) ? "#F85606" : "#666"} strokeWidth="1.8"><path d="M19.5 5.5a4.5 4.5 0 0 0-6.36 0L12 6.64 10.86 5.5a4.5 4.5 0 0 0-6.36 6.36l1.14 1.14L12 19.36l6.36-6.36 1.14-1.14a4.5 4.5 0 0 0 0-6.36z"/></svg>
                  </button>
                </div>
                <div style={{ padding: "8px" }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "#111", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "28px" }}>{p.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#F85606" }}>{safeFormatPrice(p.price)}</span>
                    <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>{safeFormatPrice(p.original_price)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "10px", color: "#ffa500" }}>★ {p.rating}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>({p.sold})</span>
                    <span style={{ fontSize: "8px", background: "#f0fdf4", color: "#16a34a", padding: "2px 6px", borderRadius: "4px", fontWeight: "800", marginLeft: "auto" }}>✓ Official</span>
                  </div>
                </div>
              </Link>
              <div style={{ padding: "0 8px 8px 8px" }}>
                <button onClick={() => addToCart(p)} style={{ width: "100%", background: isInCart(p.id) ? "#111" : "#F85606", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>{isInCart(p.id) ? "Added ✓" : "Add to Cart"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button:active { transform: scale(0.96); }
      `}</style>
    </div>
  );
}