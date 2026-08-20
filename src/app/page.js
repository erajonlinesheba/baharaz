"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);

  const banners = [
    {
      title: "COOK SMART, DINE IN SHINE",
      subtitle: "Premium Kitchen Picks Perfect Value",
      discount: "UP TO 50% OFF",
      bg: "from-orange-500 via-pink-500 to-purple-600",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800"
    },
    {
      title: "PAYDAY MEGA SALE",
      subtitle: "18 Aug - 31 Aug | Free Delivery",
      discount: "UP TO 80% OFF",
      bg: "from-yellow-400 via-orange-500 to-red-500",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800"
    }
  ];

  const categories = [
    { name: "Fashion", icon: "👗", color: "bg-pink-100" },
    { name: "Electronics", icon: "📱", color: "bg-blue-100" },
    { name: "Home", icon: "🏠", color: "bg-green-100" },
    { name: "Beauty", icon: "💄", color: "bg-purple-100" },
    { name: "Groceries", icon: "🛒", color: "bg-yellow-100" },
    { name: "Sports", icon: "⚽", color: "bg-orange-100" },
    { name: "Toys", icon: "🧸", color: "bg-red-100" },
    { name: "Books", icon: "📚", color: "bg-indigo-100" },
  ];

  const products = Array(8).fill(null).map((_, i) => ({
    id: i, name: `BAHARAZ Trending Product ${i+1}`, price: 699 + i*100, oldPrice: 1500 + i*100, rating: 4.5, sold: 120 + i*10
  }));

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white text-gray-600 text-xs border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end gap-6">
          <a href="#" className="hover:text-orange-500">SAVE MORE ON APP</a>
          <a href="#" className="hover:text-orange-500">BECOME A SELLER</a>
          <a href="#" className="hover:text-orange-500">LOGIN</a>
        </div>
      </div>

      {/* Navbar - Glass Effect */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">BAHARAZ</h1>
          <input type="text" placeholder="Search in BAHARAZ" className="flex-1 rounded-full border-2 border-orange-200 px-6 py-2 focus:outline-none focus:border-orange-500" />
          <button className="text-2xl relative">🛒<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5">0</span></button>
        </div>
      </nav>

      {/* HERO SECTION - Colorful Gradient */}
      <div className={`bg-gradient-to-r ${banners[current].bg} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-8">
          <div className="text-white flex-1">
            <h2 className="text-5xl font-black">{banners[current].title}</h2>
            <p className="text-xl mt-2">{banners[current].subtitle}</p>
            <div className="bg-yellow-400 text-black font-bold rounded-full w-24 h-24 flex items-center justify-center mt-4">
              {banners[current].discount}
            </div>
            <button className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full mt-6 hover:scale-105">Shop Now</button>
          </div>
          <img src={banners[current].img} className="w-96 rounded-2xl shadow-2xl" alt="banner" />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Shop By Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(c => (
            <div key={c.name} className={`${c.color} rounded-2xl p-4 text-center cursor-pointer hover:scale-110 transition`}>
              <div className="text-4xl">{c.icon}</div>
              <p className="text-sm font-semibold mt-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🔥 Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md p-3 hover:shadow-xl hover:-translate-y-1 transition">
              <img src="https://via.placeholder.com/200" className="rounded-lg" alt={p.name} />
              <h3 className="font-semibold mt-2 text-sm">{p.name}</h3>
              <p className="text-orange-500 font-black text-lg">৳{p.price}</p>
              <p className="text-gray-400 line-through text-xs">৳{p.oldPrice}</p>
              <div className="text-xs text-gray-500">⭐ {p.rating} | Sold {p.sold}</div>
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white w-full py-2 mt-2 rounded-lg font-bold">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}