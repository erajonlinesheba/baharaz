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

export default function FreebiePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("All Freebie");
  const [cart, setCart] = useState([]);
  const [coins, setCoins] = useState(350);
  const [claimed, setClaimed] = useState([]);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [streak, setStreak] = useState(3);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const tabs = ["All Freebie", "0 Coin", "Daily Free", "Invite Free", "Task Free", "New User Free"];

  const dailyTasks = [
    { id: 1, title: "Daily Check-in", reward: 10, icon: "📅", done: dailyClaimed },
    { id: 2, title: "Browse 5 Products", reward: 5, icon: "👀", done: true },
    { id: 3, title: "Add to Cart", reward: 5, icon: "🛒", done: cart.length > 0 },
    { id: 4, title: "Share Product", reward: 10, icon: "📤", done: false },
    { id: 5, title: "Invite Friend", reward: 50, icon: "👥", done: false },
  ];

  useEffect(() => {
    try {
      const localCart = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
      const localCoins = Number(localStorage.getItem("baharaz_coins") || "350");
      const localClaimed = JSON.parse(localStorage.getItem("baharaz_freebie_claimed") || "[]");
      const localDaily = localStorage.getItem("baharaz_daily_claim") === new Date().toDateString();
      const localStreak = Number(localStorage.getItem("baharaz_streak") || "3");
      setCart(localCart);
      setCoins(localCoins);
      setClaimed(localClaimed);
      setDailyClaimed(localDaily);
      setStreak(localStreak);
    } catch {}

    async function load() {
      try {
        const { data } = await supabase.from("products").select("*").eq("is_freebie", true).limit(30);
        if (data && data.length > 0) {
          setProducts(data);
          setFiltered(data);
        } else {
          const mock = Array.from({ length: 24 }).map((_, i) => ({
            id: `freebie-${i + 1}`,
            title: i % 4 === 0 ? `Free Gift - Premium Earphone ${i + 1}` : i % 4 === 1 ? `Freebie - Stylish Watch ${i + 1} (0 Coin)` : i % 4 === 2 ? `Free Sample - Beauty Kit ${i + 1}` : `Freebie - Mobile Stand ${i + 1}`,
            name: `Freebie Product ${i + 1}`,
            price: 0,
            original_price: 299 + i * 50,
            coin_price: i % 3 === 0 ? 0 : i % 3 === 1 ? 10 : 30,
            image: `https://picsum.photos/300/300?random=${i + 200}`,
            image_url: `https://picsum.photos/300/300?random=${i + 200}`,
            thumbnail: `https://picsum.photos/300/300?random=${i + 200}`,
            rating: (4.5 + Math.random() * 0.4).toFixed(1),
            sold: Math.floor(500 + Math.random() * 5000),
            stock: Math.floor(10 + Math.random() * 50),
            category: i % 3 === 0 ? "0 Coin" : i % 3 === 1 ? "Daily Free" : "Task Free",
            is_freebie: true,
            free_shipping: true,
          }));
          setProducts(mock);
          setFiltered(mock);
        }
      } catch {
        const mock = Array.from({ length: 24 }).map((_, i) => ({
          id: `freebie-${i + 1}`,
          title: `Freebie Gift Product ${i + 1}`,
          name: `Freebie Product ${i + 1}`,
          price: 0,
          original_price: 299 + i * 50,
          coin_price: i % 3 === 0 ? 0 : 10,
          image: `https://picsum.photos/300/300?random=${i + 200}`,
          image_url: `https://picsum.photos/300/300?random=${i + 200}`,
          thumbnail: `https://picsum.photos/300/300?random=${i + 200}`,
          rating: (4.5 + Math.random() * 0.4).toFixed(1),
          sold: Math.floor(500 + Math.random() * 5000),
          stock: 20,
          category: "0 Coin",
          is_freebie: true,
          free_shipping: true,
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
    if (activeTab !== "All Freebie") {
      if (activeTab === "0 Coin") result = result.filter(p => Number(p.coin_price) === 0);
      else result = result.filter(p => p.category === activeTab);
    }
    if (search.trim()) result = result.filter(p => (p.title || "").toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [activeTab, search, products]);

  const claimDaily = () => {
    if (dailyClaimed) return;
    const newCoins = coins + 10 + streak;
    setCoins(newCoins);
    setDailyClaimed(true);
    setStreak(s => s + 1);
    localStorage.setItem("baharaz_coins", String(newCoins));
    localStorage.setItem("baharaz_daily_claim", new Date().toDateString());
    localStorage.setItem("baharaz_streak", String(streak + 1));
    window.dispatchEvent(new Event("coinsUpdated"));
  };

  const claimProduct = (product) => {
    if (claimed.includes(product.id)) return;
    if (Number(product.coin_price) > coins) {
      alert(`Not enough coins! Need ${product.coin_price}, you have ${coins}`);
      return;
    }
    const newCoins = coins - Number(product.coin_price);
    const newClaimed = [...claimed, product.id];
    setCoins(newCoins);
    setClaimed(newClaimed);
    localStorage.setItem("baharaz_coins", String(newCoins));
    localStorage.setItem("baharaz_freebie_claimed", JSON.stringify(newClaimed));
    const existing = JSON.parse(localStorage.getItem("baharaz_cart") || "[]");
    existing.push({ ...product, product_id: product.id, quantity: 1, price: 0 });
    localStorage.setItem("baharaz_cart", JSON.stringify(existing));
    setCart(existing);
    window.dispatchEvent(new Event("coinsUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const isClaimed = (id) => claimed.includes(id);

  if (loading) {
    return (
      <div style={{ width: "100%", background: "#f5f5f5", minHeight: "100vh", padding: "12px" }}>
        <div style={{ background: "white", borderRadius: "16px", height: "200px", marginBottom: "12px", animation: "pulse 1.5s infinite" }} />
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
      <div style={{ background: "linear-gradient(135deg,#FF6B00 0%,#FF9F00 100%)", padding: "12px 12px 16px 12px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "white", flex: 1 }}>Freebie 🎁</h1>
          <Link href="/account/coins" style={{ background: "rgba(0,0,0,0.25)", borderRadius: "20px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <span style={{ fontSize: "14px" }}>🪙</span>
            <span style={{ fontSize: "13px", fontWeight: "900", color: "white" }}>{coins}</span>
          </Link>
          <Link href="/cart" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M1 2h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cart.length > 0 && <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "white", color: "#FF6B00", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>}
          </Link>
        </div>
        {/* Daily Check-in */}
        <div style={{ background: "white", borderRadius: "14px", padding: "12px", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#FF6B00,#FF9F00)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🔥</div>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#111" }}>Daily Check-in Day {streak}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{dailyClaimed ? "Come back tomorrow!" : `Claim ${10 + streak} coins today`}</p>
            </div>
          </div>
          <button onClick={claimDaily} disabled={dailyClaimed} style={{ background: dailyClaimed ? "#eee" : "linear-gradient(135deg,#FF6B00,#FF9F00)", color: dailyClaimed ? "#999" : "white", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", cursor: dailyClaimed ? "not-allowed" : "pointer", touchAction: "manipulation" }}>{dailyClaimed ? "Claimed ✓" : `Claim ${10 + streak} 🪙`}</button>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ background: "white", margin: "8px", borderRadius: "12px", padding: "12px", border: "1px solid #f0f0f0" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "900" }}>🎯 Daily Tasks - Earn More Coins</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {dailyTasks.map(task => (
            <div key={task.id} style={{ background: task.done ? "#f0fdf4" : "#fafafa", borderRadius: "10px", padding: "8px", display: "flex", alignItems: "center", gap: "8px", border: task.done ? "1px solid #bbf7d0" : "1px solid #f0f0f0" }}>
              <div style={{ width: "28px", height: "28px", background: task.done ? "#16a34a" : "#f5f5f5", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{task.done ? "✓" : task.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</p>
                <p style={{ margin: 0, fontSize: "9px", color: task.done ? "#16a34a" : "#FF6B00", fontWeight: "800" }}>{task.done ? "Done" : `+${task.reward} 🪙`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", padding: "8px 0", position: "sticky", top: "90px", zIndex: 10, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 12px", scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", border: activeTab === tab ? "none" : "1px solid #eee", background: activeTab === tab ? "linear-gradient(135deg,#FF6B00,#FF9F00)" : "white", color: activeTab === tab ? "white" : "#333", cursor: "pointer", touchAction: "manipulation" }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: "10px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", padding: "0 4px" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "800" }}>{filtered.length} Free Gifts Available 🎁</p>
          <span style={{ fontSize: "10px", background: "#FFF7ED", color: "#FF6B00", padding: "4px 10px", borderRadius: "12px", fontWeight: "800" }}>🪙 {coins} coins</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", position: "relative" }}>
              <Link href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#fafafa" }}>
                  <img src={p.image || p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", top: "6px", left: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ background: Number(p.coin_price) === 0 ? "#16a34a" : "#FF6B00", color: "white", fontSize: "9px", fontWeight: "900", padding: "3px 7px", borderRadius: "4px" }}>{Number(p.coin_price) === 0 ? "FREE" : `${p.coin_price} COINS`}</span>
                    <span style={{ background: "rgba(0,0,0,0.75)", color: "white", fontSize: "8px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>{p.stock} left</span>
                  </div>
                  <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "rgba(255,255,255,0.92)", borderRadius: "12px", padding: "3px 8px", display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "800", color: "#111" }}>{safeFormatPrice(p.original_price)} value</span>
                  </div>
                </div>
                <div style={{ padding: "8px" }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "#111", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "28px" }}>{p.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "900", color: Number(p.coin_price) === 0 ? "#16a34a" : "#FF6B00" }}>{Number(p.coin_price) === 0 ? "FREE" : `🪙 ${p.coin_price}`}</span>
                    <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through", marginLeft: "4px" }}>{safeFormatPrice(p.original_price)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "10px", color: "#ffa500" }}>★ {p.rating}</span>
                    <span style={{ fontSize: "9px", color: "#999" }}>({p.sold} claimed)</span>
                    <div style={{ marginLeft: "auto", width: "40px", height: "4px", background: "#f0f0f0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(90, (p.sold / 100) * 10)}%`, height: "100%", background: "#FF6B00" }} />
                    </div>
                  </div>
                </div>
              </Link>
              <div style={{ padding: "0 8px 8px 8px" }}>
                <button onClick={() => claimProduct(p)} disabled={isClaimed(p.id) || Number(p.coin_price) > coins} style={{ width: "100%", background: isClaimed(p.id) ? "#eee" : Number(p.coin_price) > coins ? "#f5f5f5" : "linear-gradient(135deg,#FF6B00,#FF9F00)", color: isClaimed(p.id) ? "#999" : Number(p.coin_price) > coins ? "#999" : "white", border: "none", borderRadius: "8px", padding: "8px", fontSize: "11px", fontWeight: "900", cursor: isClaimed(p.id) || Number(p.coin_price) > coins ? "not-allowed" : "pointer", touchAction: "manipulation" }}>{isClaimed(p.id) ? "Claimed ✓" : Number(p.coin_price) > coins ? `Need ${p.coin_price} 🪙` : Number(p.coin_price) === 0 ? "Claim Free 🎁" : `Claim for ${p.coin_price} 🪙`}</button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "12px", marginTop: "12px" }}>
            <p style={{ fontSize: "40px", margin: 0 }}>🎁</p>
            <p style={{ fontSize: "14px", fontWeight: "800", marginTop: "10px" }}>No freebies found</p>
            <button onClick={() => { setActiveTab("All Freebie"); setSearch(""); }} style={{ marginTop: "14px", background: "#FF6B00", color: "white", border: "none", padding: "8px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>Clear Filter</button>
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