"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const banners = [
    { title: "MEGA SALE 2026", subtitle: "Up To 80% OFF + Free Delivery", bg: "from-rose-600 via-orange-500 to-yellow-500" },
    { title: "NEON TECH WEEK", subtitle: "Latest Gadgets 60% OFF", bg: "from-cyan-500 via-blue-600 to-purple-600" },
    { title: "FASHION DROP", subtitle: "Trending Styles For You", bg: "from-pink-500 via-red-500 to-orange-500" }
  ];

  const categories = [
    { name: "Fashion", icon: "👗", color: "from-pink-500 to-rose-500" },
    { name: "Electronics", icon: "📱", color: "from-blue-500 to-cyan-500" },
    { name: "Home", icon: "🏠", color: "from-green-500 to-emerald-500" },
    { name: "Beauty", icon: "💄", color: "from-purple-500 to-fuchsia-500" },
    { name: "Groceries", icon: "🛒", color: "from-yellow-500 to-orange-500" },
    { name: "Sports", icon: "⚽", color: "from-orange-500 to-red-500" },
    { name: "Toys", icon: "🧸", color: "from-red-500 to-pink-500" },
    { name: "Books", icon: "📚", color: "from-indigo-500 to-blue-500" },
  ];

  const products = [
    { id: 1, name: "Apple Watch Ultra 2", price: 12999, oldPrice: 25000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", rating: 4.8, sold: 1240 },
    { id: 2, name: "AirPods Pro Max", price: 8999, oldPrice: 18000, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400", rating: 4.6, sold: 980 },
    { id: 3, name: "Smart Air Fryer 6L", price: 2499, oldPrice: 4000, img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=400", rating: 4.9, sold: 520 },
    { id: 4, name: "Premium Hoodie 2026", price: 699, oldPrice: 1200, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f7d?q=80&w=400", rating: 4.5, sold: 1300 },
    { id: 5, name: "Gucci Style Handbag", price: 1199, oldPrice: 2200, img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400", rating: 4.7, sold: 650 },
    { id: 6, name: "Mechanical Keyboard RGB", price: 799, oldPrice: 1500, img: "https://images.unsplash.com/photo-1615666662877-1e7f5b1a5e8c?q=80&w=400", rating: 4.8, sold: 800 },
    { id: 7, name: "LED Neon Wall Light", price: 499, oldPrice: 999, img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=400", rating: 4.4, sold: 390 },
    { id: 8, name: "Glow Skincare Set", price: 1599, oldPrice: 3000, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400", rating: 4.9, sold: 710 },
    { id: 9, name: "4K Smart TV 43 Inch", price: 34999, oldPrice: 50000, img: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a0?q=80&w=400", rating: 4.9, sold: 210 },
    { id: 10, name: "Nike Air Jordan Shoes", price: 4599, oldPrice: 8000, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", rating: 4.7, sold: 540 },
    { id: 11, name: "Dyson Hair Dryer", price: 12999, oldPrice: 20000, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400", rating: 4.8, sold: 320 },
    { id: 12, name: "PS5 Gaming Console", price: 59999, oldPrice: 70000, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400", rating: 5.0, sold: 150 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} Cart এ Add হইছে!`);
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const loginWithGoogle = () => { setUser({ name: "You", email: "you@gmail.com" }); setShowLogin(false); }
  const loginWithPhone = () => { const phone = prompt("নাম্বার দিন:"); if(phone) setUser({ name: "User", phone: phone }); setShowLogin(false); }

  const placeOrder = (e) => {
    e.preventDefault();
    alert(`Order Placed! Total: ৳${total}. আমরা 30 মিনিটের মধ্যে কল দিবো।`);
    setCart([]); setShowCheckout(false); setShowCart(false);
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0a0a1a] text-white min-h-screen">

      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">BAHARAZ</h1>
          <input type="text" placeholder="Search Products, Brands..." className="flex-1 rounded-full bg-white/10 border-white/20 px-6 py-3 text-white" />
          {user? <button className="bg-green-500/20 px-4 py-2 rounded-full">👤 {user.name}</button> : <button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-full font-bold">Login</button>}
          <button onClick={() => setShowCart(true)} className="text-3xl relative">🛒<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6">{cart.length}</span></button>
        </div>
      </nav>

      {/* SMALL BANNER - No Image, Only Gradient */}
      <div className={`bg-gradient-to-r ${banners[current].bg} transition-all duration-1000 py-8`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black drop-shadow-2xl">{banners[current].title}</h2>
          <p className="text-xl mt-2 text-white/90">{banners[current].subtitle}</p>
          <button onClick={() => window.scrollTo({top: 400, behavior: 'smooth'})} className="bg-white text-purple-600 font-black px-10 py-3 rounded-full mt-4 hover:scale-110 transition">Shop Now ⚡</button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-black mb-6">Shop By Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(c => (
            <div key={c.name} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 text-center cursor-pointer hover:scale-110 transition`}>
              <div className="text-4xl">{c.icon}</div>
              <p className="text-sm font-bold mt-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FULL PRODUCTS GRID - 12 PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-black mb-6">🔥 All Products For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white/5 backdrop-blur-xl rounded-2xl border-white/10 p-4 hover:bg-white/10 hover:-translate-y-2 transition">
              <img src={p.img} className="rounded-xl h-48 w-full object-cover" alt={p.name} />
              <h3 className="font-bold mt-3 text-sm">{p.name}</h3>
              <p className="text-cyan-400 font-black text-xl">৳{p.price}</p>
              <p className="text-white/50 line-through text-xs">৳{p.oldPrice}</p>
              <div className="text-xs text-white/70">⭐ {p.rating} | Sold {p.sold}</div>
              <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white w-full py-2 mt-3 rounded-lg font-bold hover:scale-105">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 mt-12 py-8 border-t border-white/10 text-center">
        <p>© 2026 BAHARAZ. All Rights Reserved.</p>
      </footer>

      {/* CART & LOGIN & CHECKOUT */}
      {showCart && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowCart(false)}><div className="bg-gray-800 rounded-3xl p-6 w-96" onClick={(e) => e.stopPropagation()}><h2 className="text-2xl font-black mb-4">Your Cart</h2>{cart.length === 0? <p>Cart খালি</p> : cart.map((item, i) => <div key={i} className="flex justify-between py-2"><p>{item.name}</p><p>৳{item.price}</p></div>)}<p className="font-black text-2xl mt-4">Total: ৳{total}</p><button onClick={() => setShowCheckout(true)} className="bg-green-500 text-white w-full py-3 rounded-xl mt-4 font-black">Place Order</button></div></div>}
      {showLogin && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowLogin(false)}><div className="bg-gray-800 rounded-3xl p-8 w-96"><h2 className="text-2xl font-black mb-6">Login to BAHARAZ</h2><button onClick={loginWithGoogle} className="bg-white text-black w-full py-3 rounded-xl font-bold mb-3">🔵 Continue with Google</button><button onClick={loginWithPhone} className="bg-green-500 text-white w-full py-3 rounded-xl font-bold">📱 Continue with Phone</button></div></div>}
      {showCheckout && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"><form onSubmit={placeOrder} className="bg-gray-800 rounded-3xl p-6 w-96"><h2 className="text-2xl font-black mb-4">Checkout</h2><input name="name" placeholder="Your Name" required className="w-full bg-white/10 p-3 rounded-lg mb-3" /><input name="phone" placeholder="Phone Number" required className="w-full bg-white/10 p-3 rounded-lg mb-3" /><input name="address" placeholder="Full Address" required className="w-full bg-white/10 p-3 rounded-lg mb-3" /><button type="submit" className="bg-green-500 text-white w-full py-3 rounded-xl font-black">Confirm Order</button></form></div>}
    </div>
  );
}