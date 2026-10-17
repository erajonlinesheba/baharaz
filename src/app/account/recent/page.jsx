"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/store-data";
import { Eye, Trash2, Clock, ShoppingBag } from "lucide-react";

export default function RecentlyViewedPage() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const rv = JSON.parse(localStorage.getItem('baharaz_recently_viewed') || '[]');
      setRecentlyViewed(Array.isArray(rv)? rv : []);
      const u = JSON.parse(localStorage.getItem('baharaz_user') || 'null');
      setUser(u);
    } catch {}
  }, []);

  const clearRecentlyViewed = () => {
    if (confirm('Clear recently viewed history?')) {
      setRecentlyViewed([]);
      localStorage.removeItem('baharaz_recently_viewed');
    }
  };

  const removeItem = (id) => {
    const updated = recentlyViewed.filter(p => p.id!== id);
    setRecentlyViewed(updated);
    localStorage.setItem('baharaz_recently_viewed', JSON.stringify(updated));
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm min-h-[600px]">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-[22px] font-black flex items-center gap-2"><Eye className="text-[#f85606]"/> Recently Viewed <span className="text-[11px] bg-[#f5f5f5] px-3 py-1 rounded-full">{recentlyViewed.length}</span></h2>
        {recentlyViewed.length>0 && <button onClick={clearRecentlyViewed} className="text-[11px] font-black bg-gray-100 px-4 py-2 rounded-full hover:bg-black hover:text-white flex items-center gap-1 transition"><Trash2 size={12}/> Clear History</button>}
      </div>

      <p className="text-[12px] text-gray-500 mt-2">Hi {displayName}, your browsing history - last viewed products appear here 👁️</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {recentlyViewed.map(p => (
          <div key={p.id} className="border-2 border-gray-100 rounded-[14px] p-3 hover:shadow-xl transition-all hover:border-[#f85606]/20 group hover:-translate-y-1 bg-white relative">
            <button onClick={() => removeItem(p.id)} className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 z-10 text-[10px]">✕</button>
            <Link href={`/product/${p.id}`}>
              <div className="bg-[#fafafa] rounded-[10px] p-2 relative">
                <img src={p.image||p.image_url} alt={p.name} className="h-[140px] w-full object-contain group-hover:scale-105 transition duration-500" />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-1 rounded-full flex items-center gap-1"><Clock size={8}/> Viewed 2h ago</span>
              </div>
              <p className="text-[12px] mt-3 line-clamp-2 font-medium leading-[16px] min-h-[32px]">{p.name||p.title}</p>
              <p className="text-[13px] text-[#f85606] font-black mt-1">{formatPrice(p.price||0)}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Eye size={10}/> Viewed by {displayName}</p>
            </Link>
          </div>
        ))}

        {!recentlyViewed.length && (
          <div className="col-span-4 text-center py-16 border-2 border-dashed border-gray-200 rounded-[20px] bg-[#fafafa]">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-3xl">👁️</div>
            <p className="font-black text-[16px] mt-4">No recently viewed products</p>
            <p className="text-[12px] opacity-60 mt-1">Hi {displayName}, your browsing history will appear here - Start exploring!</p>
            <Link href="/" className="inline-block mt-5 bg-black text-white px-8 py-3 rounded-full text-[12px] font-black hover:bg-[#f85606] transition">Start Browsing - Baharaz</Link>
          </div>
        )}
      </div>
    </div>
  );
}