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

export default function BuyMoreSaveMorePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("All Deals");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const tabs = ["All Deals", "Buy 2 Save 15%", "Buy 3 Save 25%", "Buy 5 Save 40%", "Combo Deals"];

  const tierDiscount = (count) => {
    if (count >= 5) return 40;
    if (count >= 3) return 25;
    if (count >= 2) return 15;
    return 0;
  };

  const calculateSavings = useMemo(() => {
    const total = selected.reduce((s, p) => s + Number(p.price || 0), 0);
    const count = selected.length;
    const discountPercent = tierDiscount(count);
    const discountAmount = (total * discountPercent) / 100;
    const finalTotal = total - discountAmount;
    return { total, count, discountPercent, discountAmount, finalTotal };
  }, [selected]);

  useEffect(() => {
    try {
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      setCart(localCart);
    } catch {}

    async function loadRealProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(50);
        if (error) throw error;
        if (data && data.length > 0) {
          const realProducts = data.map(p => ({
            id: p.id,
            title: p.title || p.name,
            name: p.name || p.title,
            price: Number(p.price || p.current_price || 0),
            original_price: Number(p.original_price || p.price * 1.5 || 0),
            image: p.image || p.image_url || p.thumbnail || p.images?.[0],
            image_url: p.image_url || p.image || p.thumbnail,
            thumbnail: p.thumbnail || p.image_url || p.image,
            rating: p.rating || (4.2 + Math.random() * 0.6).toFixed(1),
            sold: p.sold_count || p.sold || Math.floor(Math.random() * 1000),
            category: p.category || "General",
            stock: p.stock || p.quantity || 100,
            is_choice: p.is_choice || false,
          }));
          setProducts(realProducts);
          setFiltered(realProducts);
        } else {
          setProducts([]);
          setFiltered([]);
        }
      } catch (e) {
        console.log("Real load error:", e);
        setProducts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }

    loadRealProducts();

    const onCartUpdate = () => {
      try {
        setCart(JSON.parse(localStorage.getItem("baharaz_cart") || "[]"));
      } catch {}
    };
    window.addEventListener("cartUpdated", onCartUpdate);
    window.addEventListener("cart-update", onCartUpdate);
    window.addEventListener("storage", onCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", onCartUpdate);
      window.removeEventListener("cart-update", onCartUpdate);
      window.removeEventListener("storage", onCartUpdate);
    };
  }, [supabase]);

  useEffect(() => {
    let result = [...products];
    if (activeTab === "Buy 2 Save 15%") result = result.slice(0, 20);
    else if (activeTab === "Buy 3 Save 25%") result = result.slice(0, 30);
    else if (activeTab === "Buy 5 Save 40%") result = result;
    else if (activeTab === "Combo Deals") result = result.filter((_, i) => i % 2 === 0);
    if (search.trim()) {
      result = result.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [activeTab, search, products]);

  const toggleSelect = (product) => {
    setSelected(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const addBundleToCart = () => {
    if (selected.length < 2) {
      alert("Select at least 2 products to save more!");
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const discountPercent = tierDiscount(selected.length);
      selected.forEach(product => {
        const discountedPrice = Number(product.price) * (1 - discountPercent / 100);
        const idx = existing.findIndex(item => (item.id || item.product_id) === product.id);
        if (idx > -1) {
          existing[idx].quantity = (existing[idx].quantity || 1) + 1;
          existing[idx].bundle_discount = discountPercent;
          existing[idx].discounted_price = discountedPrice;
        } else {
          existing.push({
            ...product,
            product_id: product.id,
            quantity: 1,
            original_bundle_price: Number(product.price),
            discounted_price: discountedPrice,
            bundle_discount: discountPercent,
            is_bundle: true,
          });
        }
      });
      localStorage.setItem("baharaz_cart", JSON.stringify(existing));
      setCart(existing);
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("cart-update"));
      alert(`Added ${selected.length} items with ${discountPercent}% OFF! Saved ${safeFormatPrice(calculateSavings.discountAmount)}`);
      setSelected([]);
    } catch (e) {
      console.log("Bundle cart error", e);
    }
  };

  const clearSelection = () => setSelected([]);

  const isSelected = (id) => selected.some(p => p.id === id);

  if (loading) {
    return (
      <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", padding: "12px" }}>
        <div style={{ background: "white", borderRadius: "16px", height: "160px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: "white", borderRadius: "12px", height: "220px", animation: "pulse 1.5s infinite" }} />)}
        </div>
        <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", paddingBottom: "90px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#F85606 0%,#FF3B30 100%)", padding: "12px 12px 14px 12px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "white", flex: 1 }}>Buy More Save More 🔥</h1>
          <Link href="/cart" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cart.length > 0 && <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "white", color: "#F85606", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "2px solid rgba(255,255,255,0.3)" }}><p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "white" }}>Buy 2</p><p style={{ margin: 0, fontSize: "11px", color: "white", fontWeight: "800" }}>Save 15%</p></div>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "10px", padding: "8px", textAlign: "center", border: "2px solid white" }}><p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "white" }}>Buy 3</p><p style={{ margin: 0, fontSize: "11px", color: "white", fontWeight: "800" }}>Save 25%</p></div>
          <div style={{ background: "white", borderRadius: "10px", padding: "8px", textAlign: "center" }}><p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#F85606" }}>Buy 5</p><p style={{ margin: 0, fontSize: "11px", color: "#F85606", fontWeight: "800" }}>Save 40%</p></div>
        </div>
      </div>

      {/* Search + Tabs */}
      <div style={{ background: "white", padding: "10px 12px", position: "sticky", top: "88px", zIndex: 10, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ background: "#f5f5f5", borderRadius: "10px", display: "flex", alignItems: "center", padding: "0 12px", height: "38px", marginBottom: "10px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products to bundle..." style={{ flex: 1, border: "none", outline: "none", marginLeft: "8px", fontSize: "13px", background: "transparent" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ whiteSpace: "nowrap", padding: "7px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", border: activeTab === tab ? "none" : "1px solid #eee", background: activeTab === tab ? "#111" : "white", color: activeTab === tab ? "white" : "#333", cursor: "pointer", touchAction: "manipulation" }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Selected Summary Bar - Real Calculation */}
      {selected.length > 0 && (
        <div style={{ background: "white", margin: "8px", borderRadius: "12px", padding: "12px", border: "2px solid #F85606", position: "sticky", top: "150px", zIndex: 9, boxShadow: "0 4px 16px rgba(248,86,6,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "900" }}>{selected.length} Items Selected {calculateSavings.discountPercent > 0 ? `🔥 ${calculateSavings.discountPercent}% OFF` : ""}</p>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#666" }}>Total: {safeFormatPrice(calculateSavings.total)} → <b style={{ color: "#F85606" }}>{safeFormatPrice(calculateSavings.finalTotal)}</b> Save {safeFormatPrice(calculateSavings.discountAmount)}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={clearSelection} style={{ background: "#f5f5f5", color: "#111", border: "none", padding: "8px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Clear</button>
              <button onClick={addBundleToCart} style={{ background: "linear-gradient(135deg,#F85606,#FF3B30)", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>Add Bundle 🛒</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginTop: "8px" }}>
            {selected.map(p => (
              <div key={p.id} style={{ minWidth: "50px", position: "relative" }}>
                <img src={p.image || p.image_url} alt="" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", border: "2px solid #F85606" }} />
                <button onClick={() => toggleSelect(p)} style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", borderRadius: "50%", background: "#111", color: "white", border: "none", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid - Real Data */}
      <div style={{ padding: "10px 8px" }}>
        <p style={{ margin: "0 0 10px 4px", fontSize: "13px", fontWeight: "800" }}>{filtered.length} Products - Tap to select for bundle discount</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {filtered.map((p) => (
            <div key={p.id} onClick={() => toggleSelect(p)} style={{ background: isSelected(p.id) ? "#FFF1EB" : "white", borderRadius: "12px", overflow: "hidden", border: isSelected(p.id) ? "2px solid #F85606" : "1px solid #f0f0f0", position: "relative", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#fafafa" }}>
                <img src={p.image || p.image_url || p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                <div style={{ position: "absolute", top: "6px", left: "6px", background: isSelected(p.id) ? "#F85606" : "rgba(0,0,0,0.7)", color: "white", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "900", border: "2px solid white" }}>{isSelected(p.id) ? "✓" : "+"}</div>
                <span style={{ position: "absolute", top: "6px", right: "6px", background: "#111", color: "white", fontSize: "8px", fontWeight: "900", padding: "3px 6px", borderRadius: "4px" }}>BUNDLE</span>
                {p.original_price > p.price && <span style={{ position: "absolute", bottom: "6px", left: "6px", background: "#F85606", color: "white", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px" }}>-{Math.round(((p.original_price - p.price) / p.original_price) * 100)}%</span>}
              </div>
              <div style={{ padding: "8px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#111", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "28px" }}>{p.title || p.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "900", color: "#F85606" }}>{safeFormatPrice(p.price)}</span>
                  {p.original_price > p.price && <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>{safeFormatPrice(p.original_price)}</span>}
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "9px", color: "#16a34a", fontWeight: "700" }}>Bundle: {safeFormatPrice(p.price * 0.85)} with 2 | {safeFormatPrice(p.price * 0.75)} with 3 | {safeFormatPrice(p.price * 0.6)} with 5</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "12px", marginTop: "12px" }}>
            <p style={{ fontSize: "40px", margin: 0 }}>🛍️</p>
            <p style={{ fontSize: "14px", fontWeight: "800", marginTop: "10px" }}>No products found in database</p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Add products to Supabase products table</p>
            <Link href="/" style={{ display: "inline-block", marginTop: "14px", background: "#F85606", color: "white", padding: "8px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textDecoration: "none" }}>Go Shopping</Link>
          </div>
        )}
      </div>

      {/* Bottom Bundle CTA */}
      {selected.length >= 2 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eee", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 30, boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}>
          <div>
            <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{selected.length} items • {calculateSavings.discountPercent}% OFF</p>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "900" }}><span style={{ textDecoration: "line-through", color: "#999", fontSize: "11px" }}>{safeFormatPrice(calculateSavings.total)}</span> <span style={{ color: "#F85606" }}>{safeFormatPrice(calculateSavings.finalTotal)}</span></p>
          </div>
          <button onClick={addBundleToCart} style={{ background: "linear-gradient(135deg,#F85606,#FF3B30)", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: "pointer", touchAction: "manipulation" }}>Add {selected.length} to Cart - Save {safeFormatPrice(calculateSavings.discountAmount)}</button>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}