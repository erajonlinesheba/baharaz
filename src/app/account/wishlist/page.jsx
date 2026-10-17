"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountWishlist() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("baharaz_wishlist") || "[]");
      setItems(saved);
    } catch {}
    setLoaded(true);
  }, []);

  const removeItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem("baharaz_wishlist", JSON.stringify(updated));
  };

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div style={{ background: "white", borderRadius: "12px", padding: "60px 20px", textAlign: "center", border: "1px solid #eee" }}>
        <div style={{ fontSize: "50px" }}>🤍</div>
        <h2 style={{ fontWeight: "900", fontSize: "18px", marginTop: "12px" }}>Your Wishlist is Empty</h2>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>Add items you love inside your account</p>
        <Link href="/" style={{ display: "inline-block", marginTop: "16px", background: "#f85606", color: "white", padding: "10px 24px", borderRadius: "8px", fontWeight: "900", fontSize: "13px", textDecoration: "none" }}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontWeight: "900", fontSize: "16px" }}>My Wishlist ({items.length})</h1>
        <Link href="/" style={{ fontSize: "12px", fontWeight: "900", color: "#f85606", textDecoration: "none" }}>Continue Shopping →</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "12px" }}>
        {items.map(item => (
          <div key={item.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #eee", overflow: "hidden" }}>
            <img src={item.image || item.thumbnail || "/placeholder.png"} alt={item.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <div style={{ padding: "12px" }}>
              <p style={{ fontWeight: "700", fontSize: "13px", height: "36px", overflow: "hidden" }}>{item.name || item.title}</p>
              <p style={{ color: "#f85606", fontWeight: "900", fontSize: "16px", marginTop: "6px" }}>৳{item.price}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <Link href={`/product/${item.slug || item.id}`} style={{ flex: 1, background: "#f85606", color: "white", textAlign: "center", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "900", textDecoration: "none" }}>Buy Now</Link>
                <button onClick={() => removeItem(item.id)} style={{ flex: 1, background: "#f5f5f5", border: "1px solid #ddd", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}