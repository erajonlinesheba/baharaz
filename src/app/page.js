export default function Home() {
  const flashProducts = [
    { id: 1, name: "Wireless Earbuds", price: 1299, oldPrice: 2999, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Smart Watch", price: 2499, oldPrice: 5999, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Backpack", price: 899, oldPrice: 1999, image: "https://via.placeholder.com/200" },
    { id: 4, name: "Hair Dryer", price: 1599, oldPrice: 3500, image: "https://via.placeholder.com/200" },
  ];

  return (
    <div className="bg-gray-100">
      {/* Top Bar */}
      <div className="bg-orange-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end gap-6">
          <a href="#">SAVE MORE ON APP</a>
          <a href="#">BECOME A SELLER</a>
          <a href="#">HELP & SUPPORT</a>
          <a href="#">LOGIN</a>
          <a href="#">SIGN UP</a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-orange-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">BAHARAZ</h1>
          <input type="text" placeholder="Search in BAHARAZ" className="flex-1 rounded px-4 py-2" />
          <div className="text-white text-2xl">🛒</div>
        </div>
      </nav>

      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-yellow-400 py-10">
        <div className="max-w-7xl mx-auto px-4 bg-yellow-300 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-red-600">PAYDAY SALE</h2>
            <p className="text-sm">18(8PM) - 31 AUG</p>
            <p className="text-xl font-bold mt-2">UP TO 80% OFF + FREE DELIVERY</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">SHOP NOW</button>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Flash Sale</h2>
        <p className="text-red-500 mb-4">On Sale Now</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashProducts.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-3">
              <img src={p.image} alt={p.name} />
              <h3 className="font-semibold mt-2 text-sm">{p.name}</h3>
              <p className="text-red-600 font-bold">৳{p.price}</p>
              <p className="text-gray-400 line-through text-xs">৳{p.oldPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}