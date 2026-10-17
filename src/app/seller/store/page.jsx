"use client";
import { useStore } from "./layout";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function OverviewPage() {
  const { storeData, stats: contextStats, myProducts: contextProducts, liveViewers, completion: layoutCompletion } = useStore();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSocialCheck, setShowSocialCheck] = useState(false);
  const [realStats, setRealStats] = useState(null);
  const [realProducts, setRealProducts] = useState(null);

  useEffect(() => {
    const iv = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return
        let realSellerId = null;
        let realViews = 0;
        let realOrders = 0;
        try {
          const { data: seller } = await supabase.from('sellers').select('id,total_views,total_orders').eq('user_id', user.id).maybeSingle()
          if(seller?.id) {
            realSellerId = seller.id;
            realViews = seller.total_views || 0;
            realOrders = seller.total_orders || 0;
          }
        } catch(e) {}
        let products = [];
        if(realSellerId){
          try {
            const { data } = await supabase.from('products').select('*').eq('seller_id', realSellerId).order('created_at', { ascending: false }).limit(20)
            if(data && data.length > 0) products = data
          } catch(e){}
        }
        if(products.length === 0){
          try {
            const { data } = await supabase.from('products').select('*').eq('seller_user_id', user.id).order('created_at', { ascending: false }).limit(20)
            if(data && data.length > 0) products = data
          } catch(e){}
        }
        if(products.length === 0){
          try {
            const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
            if(data && data.length > 0) products = data
          } catch(e){}
        }
        const total = products.length;
        const active = products.filter(p => p.is_active!== false).length;
        setRealStats({ total: total, active: active, inactive: total - active, views: realViews, orders: realOrders })
        if(products) setRealProducts(products)
      } catch(err) { console.log(err.message) }
    }
    fetchRealData()
  }, [])

  const shortUrl = `baharaz.com/store/${storeData?.shop_slug || "your-shop"}`;

  const stats = useMemo(() => {
    if(realStats && realStats.total >= 0) return { total: realStats.total, active: realStats.active, inactive: realStats.inactive, views: realStats.views || 0, orders: realStats.orders || 0,...contextStats,...realStats };
    if(contextStats && contextStats.total >= 0) return contextStats;
    return { total: 0, active: 0, inactive: 0, views: 0, orders: 0 }
  }, [contextStats, realStats])

  const myProducts = useMemo(() => {
    if(realProducts && realProducts.length > 0) return realProducts
    return contextProducts || []
  }, [contextProducts, realProducts])

  const completion = useMemo(() => [
    { label: "Branding", sub: "Logo + Name", done:!!storeData?.shop_logo &&!!storeData?.shop_name && storeData?.shop_name?.length >= 10, path: "/seller/store/branding", icon: "🎨" },
    { label: "Banner", sub: "Hero Banner", done:!!storeData?.hero_image ||!!storeData?.shop_banner, path: "/seller/store/banner", icon: "🖼️" },
    { label: "Description", sub: "Store About", done:!!storeData?.shop_description && storeData?.shop_description?.length > 100, path: "/seller/store/branding", icon: "📝" },
    { label: "Contact", sub: "Phone + Address", done:!!storeData?.phone &&!!storeData?.address, path: "/seller/store/social", icon: "📞" },
    { label: "Facebook", sub: "Facebook Page", done:!!storeData?.facebook_url, path: "/seller/store/social", icon: "📘" },
    { label: "Instagram", sub: "Instagram", done:!!storeData?.instagram_url, path: "/seller/store/social", icon: "📸" },
    { label: "TikTok", sub: "TikTok", done:!!storeData?.tiktok_url, path: "/seller/store/social", icon: "🎵" },
    { label: "Google Maps", sub: "Location", done:!!storeData?.google_maps_url ||!!storeData?.address, path: "/seller/store/social", icon: "📍" },
    { label: "Shipping", sub: "Delivery Charge", done:!!storeData?.delivery_charge_inside &&!!storeData?.delivery_charge_outside, path: "/seller/store/shipping", icon: "🚚" },
    { label: "Payment", sub: "Payment Method", done:!!storeData?.bkash_number || storeData?.enable_cod, path: "/seller/store/payment", icon: "💳" },
    { label: "SEO", sub: "SEO Info", done:!!storeData?.seo_title &&!!storeData?.seo_description, path: "/seller/store/seo", icon: "🚀" },
    { label: "Products", sub: "Product Catalog", done: (stats?.total || 0) > 0, path: "/seller/products", icon: "📦" },
  ], [storeData, stats]);

  const completedCount = completion.filter(c => c.done).length;
  const completionPercent = Math.round((completedCount / completion.length) * 100);
  const socialCompletion = completion.filter(c => ["Facebook", "Instagram", "TikTok", "Google Maps"].includes(c.label));
  const socialDone = socialCompletion.filter(c => c.done).length;

  const recentProducts = useMemo(() => (myProducts || []).slice(0, showAllProducts? 12 : 8), [myProducts, showAllProducts]);

  const socialPlatforms = [
    { name: "Facebook", url: storeData?.facebook_url, icon: "📘", done:!!storeData?.facebook_url, color: "bg-[#1877F2]", link: storeData?.facebook_url || "https://facebook.com" },
    { name: "Instagram", url: storeData?.instagram_url, icon: "📸", done:!!storeData?.instagram_url, color: "bg-gradient-to-br from-purple-600 to-pink-500", link: storeData?.instagram_url || "https://instagram.com" },
    { name: "TikTok", url: storeData?.tiktok_url, icon: "🎵", done:!!storeData?.tiktok_url, color: "bg-black", link: storeData?.tiktok_url || "https://tiktok.com" },
    { name: "YouTube", url: storeData?.youtube_url, icon: "▶️", done:!!storeData?.youtube_url, color: "bg-red-600", link: storeData?.youtube_url || "https://youtube.com" },
    { name: "WhatsApp", url: storeData?.whatsapp_number, icon: "💬", done:!!storeData?.whatsapp_number, color: "bg-[#25D366]", link: `https://wa.me/${storeData?.whatsapp_number || ""}` },
    { name: "Google Maps", url: storeData?.google_maps_url, icon: "📍", done:!!storeData?.google_maps_url ||!!storeData?.address, color: "bg-green-600", link: storeData?.google_maps_url || "https://maps.google.com" },
  ];

  if (!storeData) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
        <p className="text-[11px] mt-3 font-bold text-slate-500">Loading Store...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10 w-full max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-3 w-full">
        <div className="flex-1 min-w-0 w-full">
          <h1 className="text-[20px] font-black tracking-tight flex items-center gap-2">
            <span>Store Overview</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold">{liveViewers} Live</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white border font-bold">{currentTime.toLocaleTimeString()}</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-1.5">Monitor your store performance and manage products</p>
        </div>
        <button onClick={() => setShowSocialCheck(true)} className="w-full md:w-auto px-4 py-2.5 rounded-full bg-white border text-slate-900 text-xs font-bold">Social Profiles</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="p-5 rounded-[20px] bg-white border shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Total Products</p>
          <p className="text-[28px] font-black mt-1">{stats.total}</p>
          <p className="text-[11px] mt-2 text-slate-500">{stats.active} Active • {stats.inactive} Inactive</p>
        </div>
        <div className="p-5 rounded-[20px] bg-white border shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Store Views</p>
          <p className="text-[28px] font-black mt-1">{stats.views}</p>
          <p className="text-[11px] mt-2 text-slate-500 truncate">{shortUrl}</p>
        </div>
        <div className="p-5 rounded-[20px] bg-white border shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Live Viewers</p>
          <p className="text-[28px] font-black mt-1">{liveViewers}</p>
          <p className="text-[11px] mt-2 text-slate-500">Currently viewing your store</p>
        </div>
        <div className="p-5 rounded-[20px] bg-slate-900 text-white shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-white/60 font-bold">Store Rating</p>
          <p className="text-[28px] font-black mt-1">{storeData.rating || 4.9} ⭐</p>
          <p className="text-[11px] mt-2 text-white/70">{layoutCompletion}% Setup Complete</p>
        </div>
      </div>

      <div className="p-5 rounded-[20px] border bg-white w-full">
        <h3 className="font-black text-[13px]">Social Profiles • {socialDone}/{socialPlatforms.length} Connected</h3>
        <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
          {socialPlatforms.map((s,i)=>(
            <a key={i} href={s.link} target="_blank" className={`p-3 rounded-[12px] text-center border ${s.done? "bg-white border-slate-900" : "bg-slate-50 border-slate-200"}`}>
              <p className="text-[16px]">{s.icon}</p>
              <p className="text-[10px] font-bold mt-1">{s.name}</p>
              <p className="text-[9px] mt-0.5 text-slate-500">{s.done? "Connected" : "Not Set"}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-[20px] border bg-white w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[13px]">Store Setup • {completedCount}/{completion.length} • {completionPercent}%</h3>
          <div className="h-2 w-24 rounded-full bg-slate-100"><div className="h-full bg-slate-900 rounded-full transition-all" style={{ width: `${completionPercent}%` }}></div></div>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {completion.map((c,i)=>(
            <Link key={i} href={c.path} className={`p-3 rounded-[12px] border ${c.done? "bg-white border-slate-200" : "bg-amber-50 border-amber-200"}`}>
              <p className="text-[12px] font-bold flex items-center gap-1"><span>{c.icon}</span> {c.label}</p>
              <p className="text-[9px] text-slate-500 mt-1">{c.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-[20px] border bg-white w-full">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-[14px] bg-slate-100 border overflow-hidden flex items-center justify-center shrink-0">
            {storeData.shop_logo? <img src={storeData.shop_logo} alt="logo" className="w-full h-full object-cover" /> : <span className="font-black">{storeData.shop_name?.[0]}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[16px] truncate">{storeData.shop_name}</h3>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{storeData.shop_description}</p>
            <div className="mt-3 flex gap-2">
              <Link href="/seller/store/branding" className="px-4 py-2 bg-slate-900 text-white rounded-full text-[11px] font-bold">Edit Store</Link>
              <Link href={`/store/${storeData.shop_slug}`} target="_blank" className="px-4 py-2 bg-white border rounded-full text-[11px] font-bold">View Store ↗</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-[20px] border bg-white w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[13px]">Recent Products • {stats.total} Total</h3>
          <div className="flex gap-2">
            <button onClick={() => setShowAllProducts(!showAllProducts)} className="text-[11px] px-3 py-1.5 rounded-full border font-bold">{showAllProducts? "Show Less" : `View All ${stats.total} →`}</button>
            <Link href="/seller/products/new" className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold">+ Add Product</Link>
          </div>
        </div>
        {myProducts.length > 0? (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {recentProducts.map(p => (
              <Link key={p.id} href={`/seller/products/${p.id}`} className="border rounded-[14px] overflow-hidden hover:shadow-md transition-all bg-white">
                <div className="aspect-square bg-slate-50 overflow-hidden"><img src={p.images?.[0] || p.image || "https://via.placeholder.com/200"} alt={p.name || p.title} className="w-full h-full object-cover" /></div>
                <div className="p-2.5"><p className="text-[11px] font-bold truncate">{p.name || p.title}</p><p className="text-[13px] font-black mt-0.5">৳{p.price}</p></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-10 border border-dashed rounded-[16px] bg-slate-50">
            <p className="text-[13px] font-bold">No products yet</p>
            <p className="text-[11px] text-slate-500 mt-1">Add your first product to get started</p>
            <Link href="/seller/products/new" className="inline-block mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-bold">+ Add First Product</Link>
          </div>
        )}
      </div>

      {showSocialCheck && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-3">
          <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex justify-between items-center"><h3 className="font-black text-[16px]">Social Profiles • {socialDone}/{socialPlatforms.length}</h3><button onClick={() => setShowSocialCheck(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button></div>
            <div className="mt-5 space-y-3">
              {socialPlatforms.map((s, i) => (
                <div key={i} className="p-4 rounded-[14px] border flex justify-between items-center">
                  <div className="flex gap-3 items-center"><span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${s.color}`}>{s.icon}</span><div><p className="font-bold text-sm">{s.name}</p><p className="text-[10px] text-slate-500 truncate max-w-[200px]">{s.url || "Not connected"}</p></div></div>
                  {s.url? <a href={s.link} target="_blank" className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">View ↗</a> : <Link href="/seller/store/social" className="text-[11px] font-bold text-slate-900">Setup →</Link>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}