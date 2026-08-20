"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const banners = [
    { title: "PAYDAY MEGA SALE", subtitle: "18 Aug - 31 Aug | Free Delivery", discount: "UP TO 80% OFF", bg: "from-orange-500 via-red-500 to-pink-600", img: "https://images.unsplash.com/photo-1555529669-ebe57ecb89fe?q=80&w=1200" },
    { title: "COOK SMART", subtitle: "Kitchen Essentials", discount: "UP TO 50% OFF", bg: "from-purple-600 via-pink-500 to-orange-500", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200" },
    { title: "NEW ARRIVALS", subtitle: "Latest Fashion & Gadgets", discount: "UP TO 60% OFF", bg: "from-blue-500 via-purple-500 to-pink-500", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200" }
  ];

  const categories = [
    { name: "Fashion", icon: "👗", color: "bg-pink-100" }, { name: "Electronics", icon: "📱", color: "bg-blue-100" },
    { name: "Home", icon: "🏠", color: "bg-green-100" }, { name: "Beauty", icon: "💄", color: "bg-purple-100" },
    { name: "Groceries", icon: "🛒", color: "bg-yellow-100" }, { name: "Sports", icon: "⚽", color: "bg-orange-100" },
    { name: "Toys", icon: "🧸", color: "bg-red-100" }, { name: "Books", icon: "📚", color: "bg-indigo-100" },
  ];

  const products = [
    { id: 1, name: "Smart Watch X8 Pro", price: 1299, oldPrice: 2500, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", rating: 4.8, sold: 240 },
    { id: 2, name: "Bluetooth Earbuds", price: 899, oldPrice: 1800, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400", rating: 4.6, sold: 180 },
    { id: 3, name: "Kitchen Mixer Grinder", price: 2499, oldPrice: 4000, img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=400", rating: 4.9, sold: 120 },
    { id: 4, name: "Men's Casual Shirt", price: 699, oldPrice: 1200, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f7d?q=80&w=400", rating: 4.5, sold: 300 },
    { id: 5, name: "Women's Handbag", price: 1199, oldPrice: 2200, img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400", rating: 4.7, sold: 150 },
    { id: 6, name: "Gaming Mouse RGB", price: 799, oldPrice: 1500, img: "https://images.unsplash.com/photo-1615666662877-1e7f5b1a5e8c?q=80&w=400", rating: 4.8, sold: 200 },
    { id: 7, name: "Wall Decor Frame", price: 499, oldPrice: 999, img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=400", rating: 4.4, sold: 90 },
    { id: 8, name: "Skincare Combo Pack", price: 1599, oldPrice: 3000, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400", rating: 4.9, sold: 110 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} Cart এ Add হইছে!`);
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="bg-white text-gray-600 text-xs border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end gap-6">
          <a href="#" className="hover:text-orange-500">SAVE MORE ON APP</a>
          <a href="#" className="hover:text-orange-500">BECOME A SELLER</a>
          <a href="#" className="hover:text-orange-500">LOGIN</a>
        </div>
      </div>

      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">BAHARAZ</h1>
          <input type="text" placeholder="Search in BAHARAZ" className="flex-1 rounded-full border-2 border-orange-200 px-6 py-2 focus:outline-none focus:border-orange-500" />
          <button onClick={() => setShowCart(true)} className="text-2xl relative">🛒<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5">{cart.length}</span></button>
        </div>
      </nav>

      {/* CART POPUP */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-white rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Your Cart - {cart.length} Items</h2>
            {cart.length === 0? <p>Cart খালি</p> : cart.map((item, i) => <div key={i} className="flex justify-between py-2 border-b"><p>{item.name}</p><p>৳{item.price}</p></div>)}
            <p className="font-bold text-lg mt-4">Total: ৳{total}</p>
            <button className="bg-green-500 text-white w-full py-3 rounded-lg mt-4 font-bold">Checkout on WhatsApp</button>
            <button onClick={() => setShowCart(false)} className="w-full py-2 mt-2">Close</button>
          </div>
        </div>
      )}

      <div className={`bg-gradient-to-r ${banners[current].bg} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex-col md:flex-row items-center gap-8">
          <div className="text-white flex-1">
            <h2 className="text-5xl font-black">{banners[current].title}</h2>
            <p className="text-xl mt-2">{banners[current].subtitle}</p>
            <div className="bg-yellow-400 text-black font-bold rounded-full w-24 h-24 flex items-center justify-center mt-4">{banners[current].discount}</div>
            <button className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full mt-6 hover:scale-105">Shop Now</button>
          </div>
          <img src={banners[current].img} className="w-96 rounded-2xl shadow-2xl" alt="banner" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Shop By Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(c => (<div key={c.name} className={`${c.color} rounded-2xl p-4 text-center cursor-pointer hover:scale-110 transition`}><div className="text-4xl">{c.icon}</div><p className="text-sm font-semibold mt-2">{c.name}</p></div>))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🔥 Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md p-3 hover:shadow-xl hover:-translate-y-1 transition">
              <img src={p.img} className="rounded-lg h-40 w-full object-cover" alt={p.name} />
              <h3 className="font-semibold mt-2 text-sm">{p.name}</h3>
              <p className="text-orange-500 font-black text-lg">৳{p.price}</p>
              <p className="text-gray-400 line-through text-xs">৳{p.oldPrice}</p>
              <div className="text-xs text-gray-500">⭐ {p.rating} | Sold {p.sold}</div>
              <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white w-full py-2 mt-2 rounded-lg font-bold hover:scale-105">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}