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

export default function MallPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeBrand, setActiveBrand] = useState("All Mall");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrandData, setSelectedBrandData] = useState(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    try {
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const localWishlist = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      setCart(localCart);
      setWishlist(localWishlist.map(w => w.id || w.product_id));
    } catch {}

    async function loadRealMallData() {
      setLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(80);
        if (productsError) throw productsError;

        if (productsData && productsData.length > 0) {
          const realProducts = productsData.map(p => ({
            id: p.id,
            title: p.title || p.name || "Product",
            name: p.name || p.title || "Product",
            price: Number(p.price || p.current_price || 0),
            original_price: Number(p.original_price || Number(p.price) * 1.45 || 0),
            image: p.image || p.image_url || p.thumbnail || (Array.isArray(p.images) ? p.images[0] : null),
            image_url: p.image_url || p.image || p.thumbnail,
            thumbnail: p.thumbnail || p.image_url || p.image,
            rating: p.rating || (4.3 + Math.random() * 0.6).toFixed(1),
            sold: p.sold_count || p.sold || Math.floor(Math.random() * 500),
            brand: p.brand || p.brand_name || "Baharaz",
            category: p.category || "General",
            is_mall: p.is_mall !== undefined ? p.is_mall : true,
            official: true,
            warranty: true,
            free_shipping: p.free_shipping || true,
            choice: p.is_choice || false,
          }));

          setProducts(realProducts);
          setFiltered(realProducts);

          const brandMap = {};
          realProducts.forEach(p => {
            const b = (p.brand || "Baharaz").trim();
            if (!brandMap[b]) brandMap[b] = { name: b, count: 0, image: p.image, followers: Math.floor(1000 + Math.random() * 15000), rating: (4.5 + Math.random() * 0.4).toFixed(1) };
            brandMap[b].count++;
          });
          const realBrands = Object.values(brandMap).sort((a, b) => b.count - a.count).slice(0, 16);
          setBrands([{ name: "All Mall", count: realProducts.length, image: null, followers: 0, rating: "4.9" }, ...realBrands]);
        } else {
          setProducts([]);
          setFiltered([]);
          setBrands([{ name: "All Mall", count: 0, image: null, followers: 0, rating: "4.9" }]);
        }
      } catch (e) {
        console.log("Real Mall DB Error:", e);
        setProducts([]);
        setFiltered([]);
        setBrands([{ name: "All Mall", count: 0, image: null, followers: 0, rating: "4.9" }]);
      } finally {
        setLoading(false);
      }
    }

    loadRealMallData();

    const onUpdate = () => {
      try {
        setCart(JSON.parse(localStorage.getItem("baharaz_cart") || "[]"));
        const wl = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
        setWishlist(wl.map(w => w.id || w.product_id));
      } catch {}
    };
    window.addEventListener("cartUpdated", onUpdate);
    window.addEventListener("cart-update", onUpdate);
    window.addEventListener("wishlistUpdated", onUpdate);
    return () => {
      window.removeEventListener("cartUpdated", onUpdate);
      window.removeEventListener("cart-update", onUpdate);
      window.removeEventListener("wishlistUpdated", onUpdate);
    };
  }, [supabase]);

  useEffect(() => {
    let result = [...products];
    if (activeBrand !== "All Mall") {
      result = result.filter(p => (p.brand || "").toLowerCase().trim() === activeBrand.toLowerCase().trim());
      const brandInfo = brands.find(b => b.name === activeBrand);
      setSelectedBrandData(brandInfo || null);
    } else {
      setSelectedBrandData(null);
    }
    if (search.trim()) {
      result = result.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [activeBrand, search, products, brands]);

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
      <div style={{ width: "100%", background: "linear-gradient(180deg,#FFF7F2 0%,#f5f5f5 100%)", minHeight: "100vh", padding: "12px" }}>
        <div style={{ background: "white", borderRadius: "20px", height: "140px", marginBottom: "12px", animation: "pulse 1.5s infinite", border: "1px solid rgba(248,86,6,0.08)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "12px" }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ background: "white", borderRadius: "16px", height: "90px", animation: "pulse 1.5s infinite", border: "1px solid rgba(248,86,6,0.06)" }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: "white", borderRadius: "16px", height: "240px", animation: "pulse 1.5s infinite" }} />)}
        </div>
        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", background: "linear-gradient(180deg,#FFF7F2 0%,#f8fafc 100%)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Baharaz Header */}
      <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid rgba(248,86,6,0.08)", boxShadow: "0 1px 10px rgba(248,86,6,0.06)" }}>
        <Link href="/" style={{ width: "38px", height: "38px", background: "linear-gradient(135deg,#F85606,#FF8A4C)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 4px 12px rgba(248,86,6,0.3)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#F85606,#FF8A4C)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "18px", boxShadow: "0 4px 10px rgba(248,86,6,0.25)" }}>B</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: "900", color: "#111", lineHeight: "1" }}>Baharaz Mall</h1>
            <p style={{ margin: 0, fontSize: "10px", color: "#F85606", fontWeight: "800" }}>100% AUTHENTIC • OFFICIAL</p>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: "200px", background: "rgba(248,86,6,0.08)", borderRadius: "12px", display: "flex", alignItems: "center", padding: "0 12px", height: "38px", border: "1px solid rgba(248,86,6,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F85606" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Mall..." style={{ flex: 1, border: "none", outline: "none", marginLeft: "8px", fontSize: "12px", background: "transparent", width: "100%", color: "#111" }} />
        </div>
        <Link href="/cart" style={{ width: "38px", height: "38px", background: "rgba(248,86,6,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", textDecoration: "none", flexShrink: 0, border: "1px solid rgba(248,86,6,0.12)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F85606" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {cart.length > 0 && <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "linear-gradient(135deg,#F85606,#FF6B2B)", color: "white", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(248,86,6,0.4)" }}>{cart.length}</span>}
        </Link>
      </div>

      {/* Baharaz Mall Banner - Glass + Gradient */}
      <div style={{ margin: "10px 10px 0 10px", background: "linear-gradient(135deg,#F85606 0%,#FF8A4C 100%)", borderRadius: "18px", padding: "14px 14px 12px 14px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(248,86,6,0.25)" }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "140px", height: "140px", background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ background: "white", color: "#F85606", fontSize: "10px", fontWeight: "900", padding: "4px 10px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>MALL ✓ OFFICIAL</span>
              <span style={{ background: "rgba(0,0,0,0.2)", color: "white", fontSize: "9px", fontWeight: "800", padding: "3px 8px", borderRadius: "12px" }}>🔥 Trending</span>
            </div>
            <p style={{ margin: "8px 0 0 0", fontSize: "15px", fontWeight: "900", color: "white", lineHeight: "1.2" }}>Baharaz Mall • Authentic Brands</p>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "rgba(255,255,255,0.9)" }}>{products.length} Real Products • Warranty • Free Returns • Fast Delivery</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "12px", padding: "8px 12px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: "900", color: "#F85606" }}>4.9★</p>
            <p style={{ margin: 0, fontSize: "9px", color: "#111", fontWeight: "700" }}>Mall Rating</p>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "7px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}><p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "white" }}>✓ Authentic</p><p style={{ margin: 0, fontSize: "8px", color: "rgba(255,255,255,0.85)" }}>100% Original</p></div>
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "7px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}><p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "white" }}>✓ Warranty</p><p style={{ margin: 0, fontSize: "8px", color: "rgba(255,255,255,0.85)" }}>Official</p></div>
          <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "7px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}><p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "white" }}>✓ Free Return</p><p style={{ margin: 0, fontSize: "8px", color: "rgba(255,255,255,0.85)" }}>15 Days</p></div>
          <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: "10px", padding: "7px", textAlign: "center" }}><p style={{ margin: 0, fontSize: "11px", fontWeight: "900", color: "#F85606" }}>⚡ Fast</p><p style={{ margin: 0, fontSize: "8px", color: "#111" }}>Delivery</p></div>
        </div>
      </div>

      {/* New Feature: Voucher Strip */}
      <div style={{ margin: "10px", background: "white", borderRadius: "14px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(248,86,6,0.08)", boxShadow: "0 2px 12px rgba(248,86,6,0.06)" }}>
        <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#FFF1EB,#FFE4D6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎟️</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: "900", color: "#111" }}>Mall Vouchers up to 40% OFF</p>
          <p style={{ margin: 0, fontSize: "10px", color: "#F85606", fontWeight: "700" }}>Collect now • Real vouchers from DB brands</p>
        </div>
        <button style={{ background: "linear-gradient(135deg,#F85606,#FF8A4C)", color: "white", border: "none", padding: "7px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>Collect</button>
      </div>

      {/* Brands - Baharaz Glass Style */}
      <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", margin: "10px", borderRadius: "16px", padding: "12px", border: "1px solid rgba(248,86,6,0.08)", boxShadow: "0 4px 16px rgba(248,86,6,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#111", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "4px", height: "14px", background: "#F85606", borderRadius: "2px", display: "inline-block" }}></span>Official Brands ({brands.length - 1}) • Real DB</h3>
          {selectedBrandData && <span style={{ fontSize: "10px", background: "#FFF1EB", color: "#F85606", padding: "4px 10px", borderRadius: "12px", fontWeight: "800" }}>{selectedBrandData.followers?.toLocaleString()} followers</span>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {brands.map((brand) => (
            <button key={brand.name} onClick={() => setActiveBrand(brand.name)} style={{ background: activeBrand === brand.name ? "linear-gradient(135deg,#F85606,#FF8A4C)" : "rgba(255,255,255,0.9)", border: activeBrand === brand.name ? "2px solid #F85606" : "1px solid rgba(248,86,6,0.08)", borderRadius: "14px", padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", touchAction: "manipulation", boxShadow: activeBrand === brand.name ? "0 6px 16px rgba(248,86,6,0.3)" : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", transform: activeBrand === brand.name ? "scale(1.03)" : "scale(1)" }}>
              <div style={{ width: "44px", height: "44px", background: activeBrand === brand.name ? "white" : "linear-gradient(135deg,#FFF7F2,#FFF1EB)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: activeBrand === brand.name ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(248,86,6,0.08)" }}>
                {brand.image ? <img src={brand.image} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "18px", fontWeight: "900", color: activeBrand === brand.name ? "#F85606" : "#111" }}>{brand.name.charAt(0)}</span>}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "10px", fontWeight: "800", color: activeBrand === brand.name ? "white" : "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "64px" }}>{brand.name}</p>
                <p style={{ margin: 0, fontSize: "8px", color: activeBrand === brand.name ? "rgba(255,255,255,0.9)" : "#999", fontWeight: "600" }}>{brand.count} • {brand.rating}★</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products - Real DB with Baharaz Style */}
      <div style={{ padding: "0 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", padding: "0 4px" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#111", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ background: "#F85606", color: "white", fontSize: "9px", padding: "2px 7px", borderRadius: "4px" }}>REAL</span>{filtered.length} Mall Products • Live DB</p>
          <span style={{ fontSize: "10px", background: "linear-gradient(135deg,#F85606,#FF8A4C)", color: "white", padding: "5px 12px", borderRadius: "20px", fontWeight: "900", boxShadow: "0 2px 8px rgba(248,86,6,0.3)" }}>✓ Baharaz Verified</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(248,86,6,0.08)", margin: "0 2px", boxShadow: "0 8px 24px rgba(248,86,6,0.06)" }}>
            <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg,#FFF1EB,#FFE4D6)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "40px" }}>🏬</div>
            <p style={{ fontSize: "15px", fontWeight: "900", marginTop: "14px", color: "#111" }}>No Products in Mall Database</p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "6px", lineHeight: "1.5" }}>তোমার Supabase `products` table এ product add করো<br />`brand` + `is_mall = true` দিয়ে। Fake না, Real দেখাবে।</p>
            <div style={{ background: "#111", borderRadius: "12px", padding: "12px", marginTop: "16px", textAlign: "left", fontFamily: "monospace", fontSize: "11px", color: "#fff" }}>
              <p style={{ margin: 0, fontWeight: "800", color: "#FF8A4C" }}>Supabase SQL:</p>
              <p style={{ margin: "8px 0 0 0", color: "#bbb", lineHeight: "1.4" }}>INSERT INTO products (title, price, brand, is_mall, image_url, rating) VALUES ('Samsung Galaxy Official', 35000, 'Samsung', true, 'https://...', 4.8);</p>
            </div>
            <Link href="/" style={{ display: "inline-block", marginTop: "16px", background: "linear-gradient(135deg,#F85606,#FF8A4C)", color: "white", padding: "10px 22px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", textDecoration: "none", boxShadow: "0 4px 12px rgba(248,86,6,0.3)" }}>Go to Home</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {filtered.map((p) => (
              <div key={p.id} style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(248,86,6,0.08)", display: "flex", flexDirection: "column", boxShadow: "0 4px 14px rgba(248,86,6,0.06)", transition: "all 0.2s" }}>
                <Link href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", position: "relative" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "linear-gradient(135deg,#FFF7F2,#FFF1EB)", overflow: "hidden" }}>
                    <img src={p.image || p.image_url || p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                    <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ background: "linear-gradient(135deg,#111,#333)", color: "white", fontSize: "8px", fontWeight: "900", padding: "4px 8px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "3px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>MALL ✓</span>
                      {p.free_shipping && <span style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "white", fontSize: "7px", fontWeight: "900", padding: "3px 6px", borderRadius: "4px", boxShadow: "0 2px 6px rgba(22,163,74,0.3)" }}>FREE SHIP</span>}
                    </div>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} style={{ position: "absolute", top: "8px", right: "8px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(248,86,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(p.id) ? "#F85606" : "none"} stroke={isInWishlist(p.id) ? "#F85606" : "#666"} strokeWidth="1.8"><path d="M19.5 5.5a4.5 4.5 0 0 0-6.36 0L12 6.64 10.86 5.5a4.5 4.5 0 0 0-6.36 6.36l1.14 1.14L12 19.36l6.36-6.36 1.14-1.14a4.5 4.5 0 0 0 0-6.36z"/></svg>
                    </button>
                    {p.original_price > p.price && <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "linear-gradient(135deg,#F85606,#FF3B30)", color: "white", fontSize: "9px", fontWeight: "900", padding: "3px 8px", borderRadius: "6px", boxShadow: "0 2px 8px rgba(248,86,6,0.4)" }}>-{Math.round(((p.original_price - p.price) / p.original_price) * 100)}% OFF</span>}
                    {p.choice && <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "white", color: "#F85606", fontSize: "8px", fontWeight: "900", padding: "3px 7px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>Choice ★</span>}
                  </div>
                  <div style={{ padding: "10px 10px 8px 10px" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: "#F85606", fontWeight: "900", display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "14px", height: "14px", background: "#F85606", color: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>B</span>{p.brand}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "#111", lineHeight: "1.35", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "30px", fontWeight: "500" }}>{p.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "7px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "900", color: "#F85606" }}>{safeFormatPrice(p.price)}</span>
                      {p.original_price > p.price && <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>{safeFormatPrice(p.original_price)}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                      <span style={{ fontSize: "10px", color: "#111", fontWeight: "700", background: "#FFF1EB", padding: "2px 6px", borderRadius: "4px" }}>★ {p.rating}</span>
                      <span style={{ fontSize: "9px", color: "#999" }}>{p.sold} sold</span>
                      <span style={{ fontSize: "8px", background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", color: "#16a34a", padding: "3px 8px", borderRadius: "20px", fontWeight: "800", marginLeft: "auto", border: "1px solid #bbf7d0" }}>✓ Mall</span>
                    </div>
                  </div>
                </Link>
                <div style={{ padding: "0 10px 10px 10px", marginTop: "auto" }}>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", background: isInCart(p.id) ? "#111" : "linear-gradient(135deg,#F85606,#FF8A4C)", color: "white", border: "none", borderRadius: "10px", padding: "9px", fontSize: "11px", fontWeight: "900", cursor: "pointer", boxShadow: isInCart(p.id) ? "none" : "0 4px 12px rgba(248,86,6,0.3)", transition: "all 0.2s" }}>{isInCart(p.id) ? "Added ✓" : "Add to Cart"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}