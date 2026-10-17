"use client";

export default function StoreDecoration({ store, productsCount, activeTab, onTabChange, hideNameInBanner = true }) {
  // 100% Unified Logic - avatar কে প্রথমে নেবে, না হলে shop_logo, না হলে logo_url
  const realName = store?.name || store?.shop_name || "My Store";
  const realLogo = store?.avatar || store?.shop_logo || store?.logo_url || "/default-logo.png";
  const realBanner = store?.banner_url || store?.cover_url || store?.banner || store?.cover_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1300&h=400&fit=crop";

  return (
    <div className="relative w-full overflow-hidden bg-white md:rounded-t-[18px] border-x md:border border-slate-200 shadow-sm">
      <div className="relative w-full h-[185px] md:h-[340px] bg-[#e5e7eb]">
        <img
          src={realBanner}
          alt={`${realName} Banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {!hideNameInBanner && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
            <img src={realLogo} className="w-6 h-6 rounded-full bg-white object-cover" alt={realName} />
            <span className="text-white font-black text-[12px]">{realName}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 p-2.5 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none">
        <button onClick={()=>onTabChange && onTabChange("home-top")} className={`px-4 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition ${activeTab==="home-top"?"bg-slate-900 text-white shadow":"bg-[#f5f5f7] text-slate-700 hover:bg-slate-200"}`}>Home</button>
        <button onClick={()=>document.getElementById("products-section")?.scrollIntoView({behavior:"smooth"})} className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#f5f5f7] whitespace-nowrap hover:bg-slate-200 transition">Products ({productsCount || 0})</button>
        <button onClick={()=>document.getElementById("categories-section")?.scrollIntoView({behavior:"smooth"})} className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#f5f5f7] whitespace-nowrap hover:bg-slate-200 transition">Categories</button>
        <button onClick={()=>document.getElementById("profile-section")?.scrollIntoView({behavior:"smooth"})} className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#f5f5f7] whitespace-nowrap hover:bg-slate-200 transition">Profile</button>
        <button onClick={()=>document.getElementById("testimonial-section")?.scrollIntoView({behavior:"smooth"})} className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#f5f5f7] whitespace-nowrap hover:bg-slate-200 transition">Reviews</button>
      </div>
    </div>
  );
}