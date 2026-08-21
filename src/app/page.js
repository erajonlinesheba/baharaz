"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const banners = [
    { title: "2026 MEGA SALE", subtitle: "Experience The Future of Shopping", discount: "UP TO 80% OFF", bg: "from-fuchsia-600 via-purple-600 to-blue-600", img: "https://images.unsplash.com/photo-1555529669-ebe57ecb89fe?q=80&w=1200" },
    { title: "NEON TECH DROP", subtitle: "Latest Gadgets with RGB Lights", discount: "UP TO 60% OFF", bg: "from-cyan-500 via-blue-500 to-purple-600", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" },
  ];

  const categories = [
    { name: "Fashion", icon: "👗", color: "from-pink-400 to-rose-400" },
    { name: "Electronics", icon: "📱", color: "from-blue-400 to-cyan-400" },
    { name: "Home", icon: "🏠", color: "from-green-400 to-emerald-400" },
    { name: "Beauty", icon: "💄", color: "from-purple-400 to-fuchsia-400" },
    { name: "Groceries", icon: "🛒", color: "from-yellow-400 to-orange-400" },
    { name: "Sports", icon: "⚽", color: "from-orange-400 to-red-400" },
    { name: "Toys", icon: "🧸", color: "from-red-400 to-pink-400" },
    { name: "Books", icon: "📚", color: "from-indigo-400 to-blue-400" },
  ];

  const products = [
    { id: 1, name: "Smart Watch X9 Ultra", price: 1299, oldPrice: 2500, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", rating: 4.8, sold: 240 },
    { id: 2, name: "RGB Gaming Headset", price: 899, oldPrice: 1800, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400", rating: 4.6, sold: 180 },
    { id: 3, name: "Smart Air Fryer", price: 2499, oldPrice: 4000, img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=400", rating: 4.9, sold: 120 },
    { id: 4, name: "Premium Hoodie 2026", price: 699, oldPrice: 1200, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f7d?q=80&w=400", rating: 4.5, sold: 300 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} Cart এ Add হইছে!`);
  }

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i!== index);
    setCart(newCart);
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const loginWithGoogle = () => {
    setUser({ name: "Demo User", email: "demo@gmail.com" });
    setShowLogin(false);
    alert("Google দিয়ে Login Success!");
  }

  const loginWithPhone = () => {
    const phone = prompt("আপনার নাম্বার দিন:");
    if(phone) {
      setUser({ name: "User", phone: phone });
      setShowLogin(false);
      alert("OTP Sent! Login Success!");
    }
  }

  const placeOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: total,
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      status: "Pending"
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
    alert(`Order #${newOrder.id} Placed! আমরা কল দিবো।`);
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen">

      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">BAHARAZ</h1>
          <input type="text" placeholder="Search 2026 Collection..." className="flex-1 rounded-full bg-white/10 border border-white/20 px-6 py-2 text-white" />

          {user? (
            <button onClick={() => alert(`Welcome ${user.name}`)} className="bg-green-500 px-4 py-2 rounded-full">👤 {user.name}</button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-full font-bold">Login</button>
          )}

          <button onClick={() => setShowCart(true)} className="text-3xl relative">🛒<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6">{cart.length}</span></button>
        </div>
      </nav>

      {/* LOGIN POPUP */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowLogin(false)}>
          <div className="bg-gray-800 rounded-3xl p-8 w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-6 text-center">Login to BAHARAZ</h2>
            <button onClick={loginWithGoogle} className="bg-white text-black w-full py-3 rounded-xl font-bold mb-3">🔵 Continue with Google</button>
            <button onClick={loginWithPhone} className="bg-green-500 text-white w-full py-3 rounded-xl font-bold">📱 Continue with Phone</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className={`bg-gradient-to-r ${banners[current].bg}`}>
        <div className="max-w-7xl mx-auto px-4 py-12 flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-6xl font-black">{banners[current].title}</h2>
            <p className="text-2xl mt-2">{banners[current].subtitle}</p>
            <button className="bg-white text-purple-600 font-black px-10 py-4 rounded-full mt-6 hover:scale-110">Shop Now ⚡</button>
          </div>
          <img src={banners[current].img} className="w-96 rounded-3xl" alt="banner" />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">Shop By Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(c => (
            <div key={c.name} onClick={() => alert(`${c.name} Category Coming Soon!`)} className={`bg-gradient-to-br ${c.color} rounded-3xl p-6 text-center cursor-pointer hover:scale-110 transition`}>
              <div className="text-5xl">{c.icon}</div>
              <p className="text-sm font-bold mt-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">🔥 Trending in 2026</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-4 hover:-translate-y-2 transition">
              <img src={p.img} className="rounded-2xl h-44 w-full object-cover" alt={p.name} />
              <h3 className="font-bold mt-3">{p.name}</h3>
              <p className="text-cyan-400 font-black text-xl">৳{p.price}</p>
              <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white w-full py-3 mt-3 rounded-xl font-black">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-gray-800 rounded-3xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-4">Your Cart</h2>
            {cart.length === 0? <p>Cart খালি</p> : cart.map((item, i) =>
              <div key={i} className="flex justify-between py-2 border-b">
                <p>{item.name}</p>
                <button onClick={() => removeFromCart(i)} className="text-red-500">X</button>
              </div>
            )}
            <p className="font-black text-2xl mt-4">Total: ৳{total}</p>
            <button onClick={() => setShowCheckout(true)} disabled={cart.length===0} className="bg-green-500 text-white w-full py-3 rounded-xl mt-4 font-black disabled:bg-gray-500">Place Order</button>
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <form onSubmit={placeOrder} className="bg-gray-800 rounded-3xl p-6 w-96">
            <h2 className="text-2xl font-black mb-4">Checkout - Cash on Delivery</h2>
            <input name="name" placeholder="Your Name" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
            <input name="phone" placeholder="Phone Number" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
            <input name="address" placeholder="Full Address" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
            <p className="font-black text-xl mb-4">Total: ৳{total}</p>
            <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-full py-3 rounded-xl font-black">Confirm Order</button>
          </form>
        </div>
      )}
    </div>
  );
}