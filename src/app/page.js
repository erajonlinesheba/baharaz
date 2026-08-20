"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);

  const banners = [
    "https://via.placeholder.com/1200x300/007bff/ffffff?text=HOT+DEALS+UPTO+60%+OFF",
    "https://via.placeholder.com/1200x300/ff6a00/ffffff?text=UNILEVER+DHAKA+DEAL",
    "https://via.placeholder.com/1200x300/28a745/ffffff?text=FREE+DELIVERY+NATIONWIDE"
  ];

  const categories = [
    { name: "Bath & Decor", icon: "🛁" }, { name: "Kitchen Storage", icon: "🍳" },
    { name: "Home Decoration", icon: "🏠" }, { name: "Books", icon: "📚" },
    { name: "Watches", icon: "⌚" }, { name: "Toddler", icon: "🧸" },
    { name: "Food", icon: "🍔" }, { name: "Pets", icon: "🐶" },
  ];

  const products = Array(12).fill(null).map((_, i) => ({
    id: i, name: `BAHARAZ Product ${i+1}`, price: 599 + i*100, oldPrice: 1200 + i*100, image: "https://via.placeholder.com/200"
  }));

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Navbar - WHITE */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-orange-500">BAHARAZ</h1>
          <input type="text" placeholder="Search in BAHARAZ" className="flex-1 rounded border px-4 py-2" />
          <button className="text-2xl">🛒</button>
        </div>
      </nav>

      {/* Banner Slider */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <img src={banners[current]} className="rounded-lg w-full shadow" alt="banner" />
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(c => (
            <div key={c.name} className="text-center cursor-pointer hover:text-orange-500">
              <div className="text-4xl">{c.icon}</div>
              <p className="text-xs mt-1">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Just For You */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Just For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-2 hover:shadow-lg">
              <img src={p.image} alt={p.name} />
              <h3 className="font-semibold mt-1 text-xs">{p.name}</h3>
              <p className="text-red-600 font-bold text-sm">৳{p.price}</p>
              <p className="text-gray-400 line-through text-xs">৳{p.oldPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}