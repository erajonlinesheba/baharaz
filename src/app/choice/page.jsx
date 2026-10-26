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

export default function ChoicePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const categories = ["All", "Choice", "Free Shipping", "Top Rated", "Under ৳500", "Best Selling"];

  useEffect(() => {
    try {
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const localWishlist = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      setCart(localCart);
      setWishlist(localWishlist.map(w => w.id || w.product_id));
    } catch {}

    async function loadProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("is_choice", true).limit(40);
        if (!error && data && data.length > 0) {
          setProducts(data);
          setFiltered(data);
        } else {
          const mock = Array.from({ length: 24 }).map((_, i) => ({
            id: `choice-${i + 1}`,
            title: `Baharaz Choice Premium Product ${i + 1}`,
            name: `Baharaz Choice Product ${i + 1}`,
            price: 199 + i * 45,
            original_price: 399 + i * 80,
            image: `https://picsum.photos/300/300?random=${i + 10}`,
            image_url: `https://picsum.photos/300/300?random=${i + 10}`,
            thumbnail: `https://picsum.photos/300/300?random=${i + 10}`,
            rating: (4.2 + Math.random() * 0.7).toFixed(1),
            sold: Math.floor(100 + Math.random() * 2000),
            is_choice: true,
            free_shipping: i % 2 === 0,
            choice_badge: true,
          }));
          setProducts(mock);
          setFiltered(mock);
        }
      } catch {
        const mock = Array.from({ length: 24 }).map((_, i) => ({
          id: `choice-${i + 1}`,
          title: `Baharaz Choice Premium Product ${i + 1}`,
          name: `Baharaz Choice Product ${i + 1}`,
          price: 199 + i * 45,
          original_price: 399 + i * 80,
          image: `https://picsum.photos/300/300?random=${i + 10}`,
          image_url: `https://picsum.photos/300/300?random=${i + 10}`,
          thumbnail: `https://picsum.photos/300/300?random=${i + 10}`,
          rating: (4.2 + Math.random() * 0.7).toFixed(1),
          sold: Math.floor(100 + Math.random() * 2000),
          is_choice: true,
          free_shipping: i % 2 === 0,
          choice_badge: true,
        }));
        setProducts(mock);
        setFiltered(mock);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [supabase]);

  useEffect(() => {
    let result = [...products];
    if (activeCat === "Free Shipping") result = result.filter(p => p.free_shipping);
    else if (activeCat === "Top Rated") result = result.filter(p => Number(p.rating) >= 4.5);
    else if (activeCat === "Under ৳500") result = result.filter(p => Number(p.price) < 500);
    else if (activeCat === "Best Selling") result = result.sort((a, b) => b.sold - a.sold);
    if (search.trim()) {
      result = result.filter(p => (p.title || p.name || "").toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [activeCat, search, products]);

  const addToCart = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const idx = existing.findIndex(item => (item.id || item.product_id) === product.id);
      if (idx > -1) existing[idx].quantity = (existing[idx].quantity || 1) + 1;
      else existing.push({ ...product, product_id: product.id, quantity: 1 });
      localStorage.setItem("baharaz_cart", JSON.stringify(existing));
      setCart(existing);
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("cart-update"));
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
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {}
  };

  const isInCart = (id) => cart.some(item => (item.id || item.product_id) === id);
  const isInWishlist = (id) => wishlist.includes(id);

  if (loading) {
    return (
      <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", padding: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", height: "240px", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#F85606 0%,#FF8A4C 100%)", padding: "12px 12px 16px 12px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </Link>
          <div style={{ flex: 1, background: "white", borderRadius: "10px", display: "flex", alignItems: "center", padding: "0 12px", height: "40px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Choice products..." style={{ flex: 1, border: "none", outline: "none", marginLeft: "8px", fontSize: "14px" }} />
          </div>
          <Link href="/cart" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cart.length > 0 && <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "white", color: "#F85606", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ background: "#F85606", color: "white", fontSize: "10px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px" }}>Choice</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#111" }}>Baharaz Choice - Trusted Quality</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: "white", padding: "10px 0", position: "sticky", top: "72px", zIndex: 9, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 12px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", border: activeCat === cat ? "none" : "1px solid #eee", background: activeCat === cat ? "linear-gradient(135deg,#F85606,#FF8A4C)" : "white", color: activeCat === cat ? "white" : "#333", cursor: "pointer", touchAction: "manipulation", transition: "all 0.2s" }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ padding: "10px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", padding: "0 4px" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#111" }}>{filtered.length} Choice Products Found</p>
          <span style={{ fontSize: "11px", background: "#FFF1EB", color: "#F85606", padding: "4px 10px", borderRadius: "12px", fontWeight: "800" }}>✓ Free Returns</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #f5f5f5", position: "relative", display: "flex", flexDirection: "column" }}>
              <Link href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", position: "relative", display: "block" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#fafafa", overflow: "hidden" }}>
                  <img src={p.image || p.image_url || p.thumbnail} alt={p.title || p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", top: "6px", left: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ background: "linear-gradient(135deg,#F85606,#FF6B2B)", color: "white", fontSize: "9px", fontWeight: "900", padding: "3px 7px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "2px" }}>★ Choice</span>
                    {p.free_shipping && <span style={{ background: "#16a34a", color: "white", fontSize: "8px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px" }}>FREE SHIPPING</span>}
                  </div>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} style={{ position: "absolute", top: "6px", right: "6px", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", touchAction: "manipulation" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(p.id) ? "#F85606" : "none"} stroke={isInWishlist(p.id) ? "#F85606" : "#666"} strokeWidth="1.8"><path d="M19.5 5.5a4.5 4.5 0 0 0-6.36 0L12 6.64 10.86 5.5a4.5 4.5 0 0 0-6.36 6.36l1.14 1.14L12 19.36l6.36-6.36 1.14-1.14a4.5 4.5 0 0 0 0-6.36z"/></svg>
                  </button>
                  {p.original_price && Number(p.original_price) > Number(p.price) && <span style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(0,0,0,0.75)", color: "white", fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px" }}>-{Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100)}%</span>}
                </div>
                <div style={{ padding: "8px 8px 6px 8px", flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#111", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "31px", fontWeight: "500" }}>{p.title || p.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#F85606" }}>{safeFormatPrice(p.price)}</span>
                    {p.original_price && <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>{safeFormatPrice(p.original_price)}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "10px", color: "#ffa500" }}>★ {p.rating}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>({p.sold} sold)</span>
                    <span style={{ fontSize: "9px", background: "#f0fdf4", color: "#16a34a", padding: "1px 5px", borderRadius: "3px", fontWeight: "700", marginLeft: "auto" }}>Choice</span>
                  </div>
                </div>
              </Link>
              <div style={{ padding: "0 8px 8px 8px" }}>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} style={{ width: "100%", background: isInCart(p.id) ? "#111" : "linear-gradient(135deg,#F85606,#FF8A4C)", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", touchAction: "manipulation", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", transition: "all 0.2s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  {isInCart(p.id) ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "12px", marginTop: "12px" }}>
            <p style={{ fontSize: "40px", margin: 0 }}>🔍</p>
            <p style={{ fontSize: "14px", fontWeight: "800", marginTop: "10px" }}>No Choice products found</p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Try another category or search</p>
            <button onClick={() => { setActiveCat("All"); setSearch(""); }} style={{ marginTop: "14px", background: "#F85606", color: "white", border: "none", padding: "8px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>Clear Filter</button>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button:active { transform: scale(0.96); }
      `}</style>
    </div>
  );
}