"use client";
import { useState } from "react";
import { useStore } from "../layout";

export default function LivePreview() {
  const { storeData, liveViewers, stats, myProducts } = useStore();
  const [device, setDevice] = useState("mobile");

  const productsToShow = myProducts?.length? myProducts.slice(0, 4).map(p => ({
    name: p.name || p.title || "Untitled Product",
    price: p.price || "0",
    oldPrice: p.old_price || p.compare_price || Math.floor(Number(p.price || 0) * 1.4).toString(),
    rating: p.rating || "4.9",
    sold: p.sold || p.total_orders || Math.floor(Math.random() * 500 + 50).toString(),
    images: p.images || (p.image? [p.image] : []),
    id: p.id,
    category: p.category || "General",
    stock: p.stock?? "In Stock"
  })) : [
    { name: "Premium Cotton Panjabi", price: "1250", oldPrice: "1890", rating: "4.9", sold: "342", images: [], category: "Panjabi" },
    { name: "Luxury T-Shirt Combo", price: "890", oldPrice: "1200", rating: "4.8", sold: "210", images: [], category: "T-Shirt" },
    { name: "Designer Shirt", price: "1550", oldPrice: "2200", rating: "5.0", sold: "128", images: [], category: "Shirt" },
    { name: "Original Jeans Pant", price: "1800", oldPrice: "2500", rating: "4.9", sold: "512", images: [], category: "Jeans" },
  ];

  const themeColor = storeData.theme_color || "#0f172a";
  const secondaryColor = storeData.secondary_color || "#3b82f6";
  const accentColor = storeData.accent_color || "#f59e0b";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b-2 rounded-t-[20px]">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Live Preview • {stats.total} Products</p>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold animate-pulse">LIVE • {liveViewers} • {stats.total} Live</span>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border">
          <button onClick={()=>setDevice("mobile")} className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] transition ${device==='mobile'? 'bg-white shadow border text-slate-900' : 'text-slate-400'}`}>📱</button>
          <button onClick={()=>setDevice("desktop")} className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] transition ${device==='desktop'? 'bg-white shadow border text-slate-900' : 'text-slate-400'}`}>💻</button>
        </div>
      </div>

      <div className={`mx-auto bg-[#f1f5f9] p-2 transition-all duration-500 ${device==='mobile'? 'max-w-[340px]' : 'max-w-full'}`}>
        <div className="bg-white rounded-[22px] border-[6px] border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden relative">
          {device==='mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-[10px] z-20"></div>
          )}

          <div className="bg-slate-900 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">🔒</div>
              <p className="text-[10px] text-white/80 truncate font-medium">baharaz.com/store/{storeData.shop_slug} • {stats.total} Products</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white">↗</div>
          </div>

          {storeData.show_announcement!== false && storeData.announcement_text && (
            <div
              className="px-3 py-2.5 text-center relative overflow-hidden"
              style={{
                background: storeData.announcement_style==='gradient'
               ? `linear-gradient(90deg, ${themeColor}, ${secondaryColor}, ${accentColor})`
                  : storeData.announcement_bg_color || themeColor
              }}
            >
              <p className="text-[10px] font-black text-white tracking-wide">{storeData.announcement_text || `🎉 Free Delivery on ${storeData.min_order_free_delivery || 999}+ TK | 7 Days Return | ${stats.total} Products Live`}</p>
              {storeData.announcement_second_line && (
                <p className="text-[9px] text-white/90 font-bold mt-0.5">{storeData.announcement_second_line}</p>
              )}
              {storeData.show_coupon_in_bar!== false && storeData.coupon_code && (
                <span className="inline-block mt-1 text-[8px] px-2 py-0.5 rounded-full bg-white text-black font-black">
                  CODE: {storeData.coupon_code} • {storeData.coupon_discount || "10% OFF"}
                </span>
              )}
            </div>
          )}

          <div className="px-3 py-3 flex items-center justify-between bg-white border-b">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-[12px] overflow-hidden border-2 shadow-sm shrink-0 flex items-center justify-center" style={{ background: themeColor }}>
                {storeData.shop_logo? (
                  <img src={storeData.shop_logo} className="w-full h-full object-cover" alt="logo" />
                ) : (
                  <span className="text-white font-black">{storeData.shop_name?.[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-black text-[13px] leading-none truncate">{storeData.shop_name}</p>
                  {storeData.is_verified && <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]">✓</span>}
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-black">{liveViewers} Live</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px]">⭐ {storeData.rating || 4.9}</span>
                  <span className="text-[8px] text-slate-400">• {stats.total} Products • {storeData.district} • Unlimited OK</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-full bg-slate-50 border flex items-center justify-center">🔍</div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center relative">
                🛒
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{stats.total > 9? "9+" : stats.total || 2}</span>
              </div>
            </div>
          </div>

          <div className="relative h-[200px] overflow-hidden bg-slate-100 group/banner">
            {storeData.hero_image || storeData.shop_banner? (
              <img src={storeData.hero_image || storeData.shop_banner} className="w-full h-full object-cover group-hover/banner:scale-105 transition duration-700" alt="banner" />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${secondaryColor} 100%)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/30 font-black text-xl">1600x600 Banner • {stats.total} Products</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-center">
              <div className="flex gap-1.5 mb-2 flex-wrap">
                <span className="text-[7px] px-2 py-1 rounded-full bg-white text-black font-black shadow">✓ {storeData.hero_badge1 || "VERIFIED STORE"}</span>
                <span className="text-[7px] px-2 py-1 rounded-full bg-yellow-400 text-black font-black shadow">★ {storeData.hero_badge2 || `TOP RATED ${storeData.rating || 4.9}`}</span>
                <span className="text-[7px] px-2 py-1 rounded-full bg-green-500 text-white font-black shadow">{storeData.hero_badge3 || `FREE DELIVERY ${storeData.min_order_free_delivery || 999}+`}</span>
              </div>
              <h2 className="text-white font-black text-[15px] leading-tight max-w-[75%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-2">{storeData.hero_title || `${storeData.shop_name} - Best in ${storeData.district}`}</h2>
              <p className="text-white/90 text-[9px] mt-1.5 max-w-[80%] leading-relaxed line-clamp-2 drop-shadow">{storeData.hero_subtitle || `Shop ${stats.total} authentic products with COD, bKash, 7 days return - Trusted by 10k+ customers in Bangladesh`}</p>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 bg-white text-black rounded-full text-[10px] font-black shadow-lg hover:scale-105 transition">{storeData.hero_cta_text || `Shop ${stats.total} Products`} →</button>
                <button className="px-3 py-2 bg-white/20 backdrop-blur border border-white/30 text-white rounded-full text-[9px] font-bold">{liveViewers} Live Viewing • {storeData.district}</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 p-2 bg-[#fffbeb] border-y border-amber-100">
            {[
              { icon: "🚚", t: "Free Delivery", s: `${storeData.min_order_free_delivery || 999}+ TK` },
              { icon: "💳", t: "COD", s: "All BD" },
              { icon: "↩️", t: "7 Days", s: "Return" },
              { icon: "🛡️", t: "100% Authentic", s: `${stats.total} Products` },
            ].map((b,i)=>(
              <div key={i} className="text-center py-1">
                <p className="text-[13px]">{b.icon}</p>
                <p className="text-[7px] font-black leading-tight">{b.t}</p>
                <p className="text-[6px] text-slate-500">{b.s}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All",...new Set(productsToShow.map(p => p.category))].slice(0, 5).map((cat,i)=>(
                <span key={i} className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap border ${i===0? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200'}`}>{cat}</span>
              ))}
            </div>
          </div>

          <div className="p-3 pt-0">
            <div className="flex justify-between items-center mb-2.5">
              <p className="font-black text-[12px]">🔥 Best Selling • {stats.total} Items • {liveViewers} Live</p>
              <p className="text-[9px] font-bold text-slate-500">View All {stats.total} →</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {productsToShow.map((p, i) => (
                <div key={i} className="bg-white border-2 rounded-[14px] overflow-hidden hover:shadow-lg transition group cursor-pointer">
                  <div className="h-[95px] bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                    {p.images?.[0]? (
                      <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.name} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[26px] opacity-20 group-hover:opacity-10">👕</div>
                    )}
                    <span className="absolute top-1.5 left-1.5 text-[7px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-black shadow">-{(15+i*5)}% OFF</span>
                    <span className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full border shadow flex items-center justify-center text-[10px] group-hover:bg-red-50 transition">♡</span>
                    <span className="absolute bottom-1 left-1.5 text-[6px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold">✓ {p.stock || "In Stock"}</span>
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                      <button className="px-3 py-1.5 bg-white text-black rounded-full text-[8px] font-black shadow-lg hover:scale-105 transition">👁️ QUICK VIEW</button>
                      <button className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-[8px] font-black border border-white/20 shadow-lg hover:scale-105 transition">🛒 ADD TO CART</button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-bold truncate leading-tight">{p.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-[12px] font-black" style={{ color: themeColor }}>৳{p.price}</p>
                      <p className="text-[8px] text-slate-400 line-through">৳{p.oldPrice}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8px]">⭐ {p.rating} • {p.sold} sold</span>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] group-hover:scale-110 transition" style={{ background: themeColor }}>+</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {myProducts?.length === 0 && (
              <p className="text-[9px] text-slate-400 mt-2 text-center">Demo Products - Real {stats.total} products will show here when added via seller_id</p>
            )}
          </div>

          {storeData.show_coupon!== false && storeData.coupon_code && (
            <div className="mx-3 mb-3 p-3 rounded-[14px] border-2 border-dashed flex items-center justify-between" style={{ background: `${themeColor}10`, borderColor: themeColor }}>
              <div>
                <p className="text-[10px] font-black" style={{ color: themeColor }}>🎟️ {storeData.coupon_code} • {storeData.coupon_discount || "10% OFF"}</p>
                <p className="text-[8px] text-slate-600">Min Order ৳{storeData.coupon_min_order || storeData.min_order_free_delivery || 999} • {storeData.coupon_expiry || "Ends Tonight"} • {stats.total} Products</p>
              </div>
              <button className="px-3 py-1.5 rounded-full text-white text-[9px] font-black" style={{ background: themeColor }}>COPY</button>
            </div>
          )}

          <div className="m-3 p-3 bg-slate-900 rounded-[14px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex gap-2.5 relative">
              <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center text-black font-black shrink-0">{storeData.shop_name?.[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-[12px] truncate">{storeData.shop_name}</p>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-bold">VERIFIED</span>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold">{stats.total} PRODUCTS</span>
                </div>
                <p className="text-[8px] text-white/60 mt-0.5 line-clamp-2 leading-relaxed">{storeData.shop_description?.substring(0, 100) || `Best store in ${storeData.district} with ${stats.total} products`}...</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-[7px] px-2 py-1 rounded-full bg-white/10 border border-white/20">📍 {storeData.district}</span>
                  <span className="text-[7px] px-2 py-1 rounded-full bg-white/10 border border-white/20">📞 {storeData.phone?.slice(0,11) || "No Phone"}</span>
                  <span className="text-[7px] px-2 py-1 rounded-full bg-white/10 border border-white/20">🚚 {storeData.delivery_charge_inside || 60}৳ • Free {storeData.min_order_free_delivery || 999}৳+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 bg-white flex items-center justify-center">
            <div className="w-20 h-1 bg-slate-900 rounded-full"></div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-white border-2 rounded-[12px] p-2 text-center">
            <p className="text-[11px] font-black">{stats.total} • Unlimited</p>
            <p className="text-[7px] text-slate-500 font-bold uppercase">Products</p>
          </div>
          <div className="bg-white border-2 rounded-[12px] p-2 text-center">
            <p className="text-[11px] font-black">{liveViewers} Live</p>
            <p className="text-[7px] text-slate-500 font-bold uppercase">Live Now</p>
          </div>
          <div className="bg-white border-2 rounded-[12px] p-2 text-center">
            <p className="text-[11px] font-black">{storeData.rating || 4.9} ⭐</p>
            <p className="text-[7px] text-slate-500 font-bold uppercase">Rating • {stats.total} Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}