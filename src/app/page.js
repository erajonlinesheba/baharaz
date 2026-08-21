"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [time, setTime] = useState(86400);
  const [products, setProducts] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  // বড় বড় Banner Image - নষ্ট হবে না
  const banners = [
    {
      title: "MEGA SALE 2026",
      subtitle: "Up To 80% OFF + Free Delivery Over ৳999",
      bg: "from-pink-600 via-purple-600 to-blue-600",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000"
    },
    {
      title: "FLASH SALE",
      subtitle: "Everything Must Go! 70% OFF | 12 Month EMI",
      bg: "from-orange-600 via-red-600 to-pink-600",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000"
    },
    {
      title: "NEW ARRIVALS",
      subtitle: "Latest Fashion & Tech Just Dropped",
      bg: "from-cyan-600 via-green-600 to-emerald-600",
      img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000"
    }
  ];

  const categories = [
    { name: "Fashion", icon: "👗", color: "from-pink-500 via-red-500 to-orange-500", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=300" },
    { name: "Electronics", icon: "📱", color: "from-blue-500 via-cyan-500 to-teal-500", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300" },
    { name: "Home", icon: "🏠", color: "from-green-500 via-emerald-500 to-lime-500", img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=300" },
    { name: "Beauty", icon: "💄", color: "from-purple-500 via-fuchsia-500 to-pink-500", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=300" },
    { name: "Groceries", icon: "🛒", color: "from-yellow-500 via-amber-500 to-orange-500", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300" },
    { name: "Sports", icon: "⚽", color: "from-orange-500 via-red-500 to-rose-500", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=300" },
    { name: "Toys", icon: "🧸", color: "from-red-500 via-pink-500 to-purple-500", img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=300" },
    { name: "Books", icon: "📚", color: "from-indigo-500 via-blue-500 to-cyan-500", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300" },
  ];

  const initialProducts = [
    { id: 1, name: "Apple Watch Ultra 2", price: 12999, oldPrice: 25000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400", rating: 4.8, sold: 1240, tag: "BEST SELLER" },
    { id: 2, name: "AirPods Pro Max", price: 8999, oldPrice: 18000, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400", rating: 4.6, sold: 980, tag: "NEW" },
    { id: 3, name: "Smart Air Fryer 6L", price: 2499, oldPrice: 4000, img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=400", rating: 4.9, sold: 520, tag: "HOT" },
    { id: 4, name: "Premium Hoodie 2026", price: 699, oldPrice: 1200, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f7d?q=80&w=400", rating: 4.5, sold: 1300, tag: "TRENDING" },
    { id: 5, name: "Gucci Style Handbag", price: 1199, oldPrice: 2200, img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400", rating: 4.7, sold: 650, tag: "SALE" },
    { id: 6, name: "Mechanical Keyboard RGB", price: 799, oldPrice: 1500, img: "https://images.unsplash.com/photo-1615666662877-1e7f5b1a5e8c?q=80&w=400", rating: 4.8, sold: 800, tag: "GAMING" },
    { id: 7, name: "LED Neon Wall Light", price: 499, oldPrice: 999, img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=400", rating: 4.4, sold: 390, tag: "DECOR" },
    { id: 8, name: "Glow Skincare Set", price: 1599, oldPrice: 3000, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400", rating: 4.9, sold: 710, tag: "BEAUTY" },
  ];

  useEffect(() => { setProducts(initialProducts) }, [])

  const addToCart = (product) => {
    setCart([...cart, product]);
    showToast(`${product.name} Cart এ Add হইছে ✅`);
  }

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    showToast("Cart থেকে Remove হলো");
  }

  const toggleWishlist = (id) => {
    if(wishlist.includes(id)) {
      setWishlist(wishlist.filter(i => i!==id));
      showToast("Wishlist থেকে Remove হলো");
    } else {
      setWishlist([...wishlist, id]);
      showToast("Wishlist এ Add হলো ❤️");
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const loginWithGoogle = () => { setUser({ name: "You", email: "you@gmail.com" }); setShowLogin(false); showToast("Login Success!"); }
  const loginWithPhone = () => { const phone = prompt("নাম্বার দিন:"); if(phone) setUser({ name: "User", phone: phone }); setShowLogin(false); showToast("Login Success!"); }
  const logout = () => { setUser(null); showToast("Logout Success"); }

  const placeOrder = (e) => {
    e.preventDefault();
    if(!user) { setShowLogin(true); return; }
    const form = e.target;
    showToast(`Order Placed! Total: ৳${total}. আমরা ${form.phone.value} এ কল দিবো।`);
    setCart([]); setShowCheckout(false); setShowCart(false);
  }

  const becomeSeller = (e) => {
    e.preventDefault();
    showToast("Seller Application Submit হলো! 24 ঘন্টার মধ্যে Approve হবে");
    setShowSeller(false);
  }

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev > 0? prev - 1 : 86400), 1000);
    return () => clearInterval(timer);
  }, []);

  // Banner Auto Slide 4s পর পর
  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Popup after 3 sec
  useEffect(() => {
    setTimeout(() => setShowPopup(true), 3000);
  }, []);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#0a1a2a] text-white min-h-screen font-sans">

      {/* WELCOME POPUP */}
      {showPopup && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-8 text-center shadow-2xl border-2 border-white/20">
          <h2 className="text-5xl font-black">GET 10% OFF!</h2>
          <p className="text-2xl mt-2">Use Code: WELCOME10</p>
          <button onClick={() => setShowPopup(false)} className="bg-white text-black px-10 py-4 rounded-full mt-4 font-black text-xl hover:scale-110 transition">Claim Now</button>
        </div>
      </div>}

      {/* TOAST */}
      {toast && <div className="fixed top-20 right-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold z-50 shadow-2xl animate-bounce">{toast}</div>}

      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">BAHARAZ</h1>
          <input type="text" placeholder="🔍 Search 10,000+ Products..." className="flex-1 rounded-full bg-white/10 border-2 border-cyan-400 px-6 py-3 text-white focus:outline-none focus:border-pink-400" />
          
          <button onClick={() => setShowSeller(true)} className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full font-bold hover:scale-110">🏪 Sell</button>
          
          {user? 
            <div className="flex gap-2">
              <button className="bg-green-500/30 px-4 py-2 rounded-full">👤 {user.name}</button>
              <button onClick={logout} className="bg-red-500/30 px-4 py-2 rounded-full">Logout</button>
            </div>
            : <button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-full font-bold hover:scale-110">Login</button>
          }
          <button onClick={() => showToast(`Wishlist: ${wishlist.length} items`)} className="text-3xl relative hover:scale-125">❤️<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6">{wishlist.length}</span></button>
          <button onClick={() => setShowCart(true)} className="text-4xl relative hover:scale-125">🛒<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6">{cart.length}</span></button>
        </div>
      </nav>

      {/* FLASH SALE TIMER */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-center py-3 shadow-lg">
        <p className="font-bold text-xl">⚡ FLASH SALE ENDS IN: {hours}h {minutes}m {seconds}s ⚡</p>
      </div>

      {/* FULL WIDTH BIG BANNER WITH REAL IMAGE */}
      <div className={`relative w-full h-[550px] bg-gradient-to-r ${banners[current].bg} transition-all duration-1000 overflow-hidden`}>
        <img 
          src={banners[current].img} 
          className="absolute inset-0 w-full h-full object-cover opacity-50" 
          alt="sale banner" 
          onError={(e) => e.target.style.display='none'} // Image না আসলে লুকাবে
        />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center z-10">
          <div className="flex-1">
            <h2 className="text-8xl font-black drop-shadow-2xl">{banners[current].title}</h2>
            <p className="text-3xl mt-4 text-white/90 font-semibold">{banners[current].subtitle}</p>
            <button onClick={() => document.getElementById('products').scrollIntoView()} className="bg-white text-purple-600 font-black px-12 py-5 rounded-full mt-6 hover:scale-110 transition shadow-2xl text-2xl">Shop Now ⚡</button>
          </div>
        </div>
        {/* Banner Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`w-4 h-4 rounded-full transition ${i===current? 'bg-white scale-125' : 'bg-white/50'}`}></button>)}
        </div>
      </div>

      {/* GLOWING CATEGORIES WITH IMAGE */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-black mb-10 text-center bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map(c => (
            <div key={c.name} className={`bg-gradient-to-br ${c.color} rounded-3xl p-6 text-center cursor-pointer hover:scale-110 hover:rotate-3 transition shadow-2xl border-white/20`}>
              <img src={c.img} className="w-20 h-20 mx-auto rounded-2xl mb-3 object-cover" alt={c.name}/>
              <div className="text-5xl">{c.icon}</div>
              <p className="text-lg font-bold mt-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="products" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-black mb-10 text-center">🔥 Trending Products 🔥</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/20 p-4 hover:bg-white/20 hover:-translate-y-4 transition group shadow-xl">
              <div className="relative">
                <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs rounded-full font-black animate-pulse z-10">{p.tag}</span>
                <button onClick={() => toggleWishlist(p.id)} className="absolute top-2 right-2 text-4xl hover:scale-125 z-10">{wishlist.includes(p.id)? '❤️' : '🤍'}</button>
                <img src={p.img} className="rounded-2xl h-56 w-full object-cover group-hover:scale-110 transition" alt={p.name} />
              </div>
              <h3 className="font-bold mt-3 text-lg">{p.name}</h3>
              <p className="text-cyan-400 font-black text-3xl">৳{p.price}</p>
              <p className="text-white/50 line-through">৳{p.oldPrice}</p>
              <div className="text-sm text-yellow-400">⭐ {p.rating} | Sold {p.sold}</div>
              <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white w-full py-3 mt-3 rounded-xl font-black hover:scale-105 transition text-lg">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black/30 border-t border-white/20 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">BAHARAZ</p>
          <p className="text-white/60 mt-2">Bangladesh's Biggest Online Marketplace</p>
        </div>
      </footer>

      {/* CART MODAL */}
      {showCart && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowCart(false)}>
        <div className="bg-gray-900 rounded-3xl p-6 w-96 border-2 border-cyan-400" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-black mb-4">Your Cart</h2>
          {cart.length === 0? <p>Cart খালি</p> : 
            cart.map((item, i) => <div key={i} className="flex justify-between py-2 border-b border-white/10">
              <p>{item.name}</p>
              <div><p>৳{item.price}</p><button onClick={() => removeFromCart(i)} className="text-red-400 text-xs">Remove</button></div>
            </div>)
          }
          <p className="font-black text-2xl mt-4">Total: ৳{total}</p>
          <button onClick={() => setShowCheckout(true)} className="bg-green-500 text-white w-full py-3 rounded-xl mt-4 font-black hover:scale-105">Place Order</button>
        </div>
      </div>}

      {/* LOGIN MODAL */}
      {showLogin && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowLogin(false)}>
        <div className="bg-gray-900 rounded-3xl p-8 w-96 border-2 border-cyan-400"><h2 className="text-2xl font-black mb-6">Login to BAHARAZ</h2>
        <button onClick={loginWithGoogle} className="bg-white text-black w-full py-3 rounded-xl font-bold mb-3 hover:scale-105">🔵 Continue with Google</button>
        <button onClick={loginWithPhone} className="bg-green-500 text-white w-full py-3 rounded-xl font-bold hover:scale-105">📱 Continue with Phone</button>
      </div></div>}

      {/* SELLER MODAL */}
      {showSeller && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowSeller(false)}>
        <form onSubmit={becomeSeller} className="bg-gray-900 rounded-3xl p-6 w-96 border-2 border-yellow-400" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-black mb-4">🏪 Become a Seller</h2>
          <input name="shop" placeholder="Shop Name" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
          <input name="phone" placeholder="Phone Number" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
          <button type="submit" className="bg-yellow-500 text-black w-full py-3 rounded-xl font-black">Apply Now</button>
        </form>
      </div>}

      {/* CHECKOUT MODAL */}
      {showCheckout && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
        <form onSubmit={placeOrder} className="bg-gray-900 rounded-3xl p-6 w-96 border-2 border-green-400">
          <h2 className="text-2xl font-black mb-4">Checkout - Cash on Delivery</h2>
          <input name="name" placeholder="Your Name" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
          <input name="phone" placeholder="Phone Number" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
          <input name="address" placeholder="Full Address" required className="w-full bg-white/10 p-3 rounded-lg mb-3" />
          <button type="submit" className="bg-green-500 text-white w-full py-3 rounded-xl font-black hover:scale-105">Confirm Order</button>
        </form>
      </div>}
    </div>
  );
}