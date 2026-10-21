"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/store-data";
import { Eye, Trash2, Clock, Heart, Search, Package } from "lucide-react";

function SafeImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || "");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(src || "");
    setFailed(false);
  }, [src]);

  if (!imgSrc || failed) {
    return (
      <div className="h-[150px] w-full bg-[#f5f5f5] rounded-[10px] flex flex-col items-center justify-center gap-1">
        <Package size={24} className="text-gray-300" />
        <span className="text-[10px] text-gray-400 font-bold">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="h-[150px] w-full object-contain"
      onError={() => {
        // Try fallback, if still fail show placeholder
        if (imgSrc.includes("http")) {
          setFailed(true);
        } else {
          setImgSrc(`https://via.placeholder.com/200x200/f5f5f5/999?text=${encodeURIComponent(alt?.slice(0,15) || "Product")}`);
        }
      }}
      loading="lazy"
    />
  );
}

export default function RecentlyViewedPage() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const keys = ["baharaz_recently_viewed", "baharaz_recent", "recently_viewed", "baharaz_recentlyViewed", "recentProducts", "recentlyViewed"];
      let merged = [];
      keys.forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) return;
          const rv = JSON.parse(raw);
          const list = Array.isArray(rv) ? rv : [rv];
          list.forEach(item => {
            if (!item) return;
            // Normalize id
            const id = item.id || item.product_id || item._id;
            if (!id) return;
            if (!merged.find(m => (m.id || m.product_id) === id)) {
              merged.push({
                ...item,
                id: id,
                name: item.name || item.title || item.product_name || "Product",
                image: item.image || item.image_url || item.thumbnail || (Array.isArray(item.images) ? item.images[0] : "") || item.img || "",
                price: item.price || item.selling_price || 0,
              });
            }
          });
        } catch {}
      });
      setRecentlyViewed(merged);
      
      const userKeys = ["eraj_user_cache", "baharaz_user", "baharaz_user_cache"];
      for (let k of userKeys) {
        try {
          const u = JSON.parse(localStorage.getItem(k) || 'null');
          if (u) { setUser(u); break; }
        } catch {}
      }
    } catch {}
  }, []);

  const clearRecentlyViewed = () => {
    if (confirm('Clear recently viewed history?')) {
      setRecentlyViewed([]);
      ["baharaz_recently_viewed", "baharaz_recent", "recently_viewed", "baharaz_recentlyViewed", "recentProducts", "recentlyViewed"].forEach(k => localStorage.removeItem(k));
    }
  };

  const removeItem = (id) => {
    const updated = recentlyViewed.filter(p => p.id !== id);
    setRecentlyViewed(updated);
    localStorage.setItem('baharaz_recently_viewed', JSON.stringify(updated));
    localStorage.setItem('baharaz_recent', JSON.stringify(updated));
  };

  const displayName = user?.user_metadata?.full_name || user?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "E-RAJ SHOP";

  const filtered = recentlyViewed.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.name || p.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-10">
      <div className="max-w-[1320px] mx-auto px-4 pt-2">
        <div className="max-w-[1100px] mx-auto">
          
          <div className="bg-white rounded-[16px] p-5 md:p-6 shadow-sm border">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-[18px] font-black flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#f85606] text-white rounded-full flex items-center justify-center"><Eye size={14} /></span>
                  Recently Viewed 
                  <span className="text-[11px] bg-black text-white px-3 py-1 rounded-full">{recentlyViewed.length}</span>
                </h2>
                <p className="text-[12px] text-gray-500 mt-2">Hi <b>{displayName}</b>, your browsing history - last viewed products appear here 👁️ • Daraz style history</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-[240px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Search viewed products..." className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-gray-100 text-[12px] font-medium focus:border-[#f85606] outline-none" />
                </div>
                {recentlyViewed.length > 0 && (
                  <button onClick={clearRecentlyViewed} className="text-[11px] font-black bg-gray-100 px-4 py-2.5 rounded-full hover:bg-black hover:text-white flex items-center gap-1 transition whitespace-nowrap">
                    <Trash2 size={12}/> Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-5 md:p-6 shadow-sm border mt-4 min-h-[500px]">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filtered.map(p => {
                  const img = p.image || p.image_url || p.thumbnail || "";
                  return (
                    <div key={p.id} className="border-2 border-gray-100 rounded-[14px] p-2.5 hover:shadow-xl transition-all hover:border-[#f85606]/20 group hover:-translate-y-1 bg-white relative flex flex-col">
                      <button onClick={() => removeItem(p.id)} className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 z-20 text-[10px]">✕</button>
                      
                      <Link href={`/product/${p.id}`} className="block">
                        <div className="bg-[#fafafa] rounded-[10px] p-2 relative overflow-hidden border border-gray-100">
                          <SafeImage src={img} alt={p.name} />
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1 font-bold z-10"><Clock size={8}/> Viewed recently</span>
                        </div>
                        <p className="text-[11px] md:text-[12px] mt-3 line-clamp-2 font-medium leading-[14px] min-h-[28px] text-[#111]">{p.name || p.title}</p>
                        <p className="text-[13px] text-[#f85606] font-black mt-1">{formatPrice(p.price || 0)}</p>
                        <p className="text-[9px] text-gray-400 mt-1">👁️ Viewed by {displayName.split(" ")[0]}</p>
                      </Link>

                      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                        <Link href={`/product/${p.id}`} className="bg-black text-white text-[10px] font-black py-2 rounded-full text-center hover:bg-[#f85606] transition">View</Link>
                        <Link href={`/product/${p.id}`} className="bg-[#fff1eb] text-[#f85606] border border-[#ffd1c0] text-[10px] font-black py-2 rounded-full text-center hover:bg-[#f85606] hover:text-white transition">Buy</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[20px] bg-[#fafafa] mt-2">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-3xl">👁️</div>
                <p className="font-black text-[16px] mt-4">No recently viewed products</p>
                <p className="text-[12px] opacity-60 mt-1 max-w-[320px] mx-auto">Hi {displayName}, start exploring Baharaz - your history will appear here!</p>
                <Link href="/" className="inline-block mt-5 bg-[#f85606] text-white px-8 py-3 rounded-full text-[12px] font-black hover:bg-black transition shadow-md">Start Browsing</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}