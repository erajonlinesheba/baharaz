"use client";
import { useStore } from "../layout";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";

const themeColors = [
  { name: "Midnight Pro", primary: "#0f172a", secondary: "#3b82f6", accent: "#38bdf8", bg: "from-slate-900 to-blue-600", bestFor: "Electronics, Tech" },
  { name: "Ocean Blue", primary: "#0e7490", secondary: "#06b6d4", accent: "#22d3ee", bg: "from-cyan-700 to-teal-400", bestFor: "Health, Pharmacy" },
  { name: "Emerald Fashion", primary: "#065f46", secondary: "#10b981", accent: "#34d399", bg: "from-emerald-700 to-green-400", bestFor: "Clothing, Fashion" },
  { name: "Amazon Black", primary: "#131921", secondary: "#febd69", accent: "#FF9900", bg: "from-zinc-900 to-amber-400", bestFor: "General Store" },
  { name: "Baharaz Purple", primary: "#5d2a87", secondary: "#f57224", accent: "#f57224", bg: "from-violet-800 to-orange-500", bestFor: "Fashion, BD Market" },
  { name: "Luxury Gold", primary: "#000000", secondary: "#FFD700", accent: "#FFA500", bg: "from-black to-yellow-400", bestFor: "Jewelry, Luxury" },
  { name: "Rose Pink", primary: "#831843", secondary: "#ec4899", accent: "#f472b6", bg: "from-pink-800 to-rose-400", bestFor: "Beauty, Cosmetics" },
  { name: "Royal Red", primary: "#7f1d1d", secondary: "#ef4444", accent: "#f87171", bg: "from-red-900 to-red-500", bestFor: "Food, Sale" },
  { name: "Sunset Orange", primary: "#7c2d12", secondary: "#f97316", accent: "#fb923c", bg: "from-orange-900 to-orange-400", bestFor: "Food, Restaurant" },
  { name: "Deep Navy", primary: "#1e1b4b", secondary: "#6366f1", accent: "#818cf8", bg: "from-indigo-900 to-indigo-500", bestFor: "Formal Wear" },
  { name: "Forest Green", primary: "#14532d", secondary: "#22c55e", accent: "#4ade80", bg: "from-green-900 to-green-500", bestFor: "Organic, Eco" },
  { name: "Charcoal Minimal", primary: "#18181b", secondary: "#71717a", accent: "#a1a1aa", bg: "from-zinc-900 to-zinc-500", bestFor: "Minimal, Premium" },
];

const fonts = [
  { id: "inter", name: "Inter - Modern - Recommended", family: "Inter, sans-serif", style: "Clean, modern, best readability" },
  { id: "poppins", name: "Poppins - Fashion - Rounded", family: "Poppins, sans-serif", style: "Fashion, friendly, rounded" },
  { id: "manrope", name: "Manrope - Premium", family: "Manrope, sans-serif", style: "Premium, elegant" },
  { id: "outfit", name: "Outfit - Minimal", family: "Outfit, sans-serif", style: "Minimal, clean" },
  { id: "hind", name: "Hind Siliguri - Bangla", family: "'Hind Siliguri', sans-serif", style: "Bangla + English - Best for BD" },
];

const layouts = [
  { id: "amazon", name: "Amazon Style - Grid - Recommended", desc: "Left sidebar, grid products - Highest conversion" },
  { id: "Baharaz", name: "Baharaz Style - Horizontal", desc: "Top scroll categories, flash sale - BD love" },
  { id: "shopify", name: "Shopify Minimal - Clean", desc: "Minimal, big images - Premium" },
  { id: "facebook", name: "Facebook Shop - Feed", desc: "Feed style - Social commerce" },
  { id: "instagram", name: "Instagram Shop - Visual", desc: "Visual first, stories on top - Fashion" },
];

export default function ThemePage(){
  const { storeData, setStoreData } = useStore();
  const [activeTab, setActiveTab] = useState("colors");
  const [customPrimary, setCustomPrimary] = useState(storeData.theme_color || "#0f172a");
  const [customSecondary, setCustomSecondary] = useState(storeData.secondary_color || "#3b82f6");
  const [customAccent, setCustomAccent] = useState(storeData.accent_color || "#38bdf8");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const selectedTheme = useMemo(() => themeColors.find(t => t.primary === storeData.theme_color) || themeColors[0], [storeData.theme_color]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMsg("Saving...");
      let sellerId = storeData?.id;
      if (!sellerId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('sellers').select('id').eq('user_id', user.id).single();
          sellerId = data?.id;
        }
      }
      if (!sellerId) throw new Error("Seller ID not found!");

      // FIX: Only Theme fields - No Shipping/Coupon field = No Error
      const payload = {
        theme_name: selectedTheme.name,
        theme_color: storeData.theme_color || "#0f172a",
        secondary_color: storeData.secondary_color || "#3b82f6",
        accent_color: storeData.accent_color || "#38bdf8",
        font_family: storeData.font_family || "inter",
        store_layout: storeData.store_layout || "amazon",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('sellers').update(payload).eq('id', sellerId);
      if (error) throw error;
      setSaveMsg("✅ Theme Saved - Live on Store!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-24">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2">Theme & Design <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold">{selectedTheme.name}</span></h1>
          <p className="text-xs text-slate-500 mt-2">Store colors, fonts, layout - Affects conversion 25%</p>
        </div>
        <span className="text-[11px] px-3 py-1.5 rounded-full bg-green-50 text-green-700 border-2 font-bold">Live Preview Below</span>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Live Store Preview</p>
        <div className="mt-5 rounded-[14px] overflow-hidden border-2 shadow-sm">
          <div className="p-4 flex justify-between items-center text-white" style={{ background: `linear-gradient(135deg, ${storeData.theme_color || "#0f172a"}, ${storeData.secondary_color || "#3b82f6"})` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center font-black">{(storeData.shop_name||"T").charAt(0)}</div>
              <div><p className="font-black text-sm">{storeData.shop_name || "TAHMID NEW FASHION"}</p><p className="text-[11px] opacity-80 mt-1">📍 {storeData.district || "Rajshahi"} • ⭐ 4.9</p></div>
            </div>
            <div className="flex gap-2"><span className="w-9 h-9 rounded-full bg-white/20 border flex items-center justify-center">🔍</span><span className="w-9 h-9 rounded-full bg-white/20 border flex items-center justify-center">🛒</span></div>
          </div>
          <div className="p-3 bg-slate-50 border-b flex gap-2 overflow-x-auto">
            <span className="px-3 py-1.5 rounded-full text-white text-[11px] font-black" style={{ background: storeData.theme_color || "#0f172a" }}>All Products</span>
            <span className="px-3 py-1.5 rounded-full bg-white border text-[11px] font-bold">Panjabi • 12</span>
            <span className="px-3 py-1.5 rounded-full bg-white border text-[11px] font-bold">T-Shirt • 20</span>
          </div>
          <div className="p-4 bg-white grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="border rounded-xl p-2.5">
                <div className="h-24 rounded-lg bg-slate-100 border relative"><div className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full text-white font-black" style={{ background: storeData.accent_color || "#38bdf8" }}>{i===1? "-20% OFF" : "New"}</div></div>
                <p className="font-bold text-xs mt-2">Premium Panjabi {i}</p>
                <p className="font-black text-sm mt-1" style={{ color: storeData.theme_color || "#0f172a" }}>৳{800 + i*100}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10">
        <button onClick={()=>setActiveTab("colors")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="colors"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>COLORS</button>
        <button onClick={()=>setActiveTab("fonts")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="fonts"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>FONTS</button>
        <button onClick={()=>setActiveTab("layout")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="layout"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>LAYOUT</button>
        <button onClick={()=>setActiveTab("custom")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="custom"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>CUSTOM</button>
      </div>

      {activeTab === "colors" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Theme Colors - 12 Professional Themes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themeColors.map(t=>{
              const active = storeData.theme_color === t.primary;
              return (
                <button key={t.name} onClick={()=>setStoreData({...storeData, theme_color:t.primary, secondary_color:t.secondary, accent_color:t.accent, theme_name:t.name})} className={`p-4 rounded-[14px] border-2 text-left transition-all ${active? "border-slate-900 bg-slate-50 scale-[1.02]" : "border-slate-100 bg-white"}`}>
                  <div className={`w-full h-16 rounded-xl bg-gradient-to-r ${t.bg}`}></div>
                  <p className="text-[13px] font-black mt-3">{t.name}</p><p className="text-[10px] font-bold text-slate-500 mt-1">{t.bestFor}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === "fonts" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-3">
          {fonts.map(f=>{
            const active = (storeData.font_family || "inter") === f.id;
            return <button key={f.id} onClick={()=>setStoreData({...storeData, font_family:f.id})} className={`w-full p-4 rounded-[14px] border-2 text-left ${active? "bg-slate-900 text-white" : "bg-white"}`}><p className="font-black text-sm">{f.name}</p><p className="text-[11px] opacity-70">{f.style}</p></button>
          })}
        </div>
      )}

      {activeTab === "layout" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-3">
          {layouts.map(l=>{
            const active = (storeData.store_layout || "amazon") === l.id;
            return <button key={l.id} onClick={()=>setStoreData({...storeData, store_layout:l.id})} className={`w-full p-4 rounded-[14px] border-2 text-left ${active? "bg-slate-900 text-white" : "bg-white"}`}><p className="font-black text-sm">{l.name}</p><p className="text-[11px] opacity-70">{l.desc}</p></button>
          })}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Custom Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-[14px] border-2 bg-slate-50"><label className="text-[11px] font-black uppercase">Primary</label><div className="mt-3 flex gap-3"><input type="color" value={customPrimary} onChange={e=>setCustomPrimary(e.target.value)} className="w-16 h-12 rounded-xl border-2" /><input value={customPrimary} onChange={e=>setCustomPrimary(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border-2 bg-white text-sm font-mono font-bold" /></div><button onClick={()=>setStoreData({...storeData, theme_color:customPrimary})} className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black">Apply</button></div>
            <div className="p-4 rounded-[14px] border-2 bg-slate-50"><label className="text-[11px] font-black uppercase">Secondary</label><div className="mt-3 flex gap-3"><input type="color" value={customSecondary} onChange={e=>setCustomSecondary(e.target.value)} className="w-16 h-12 rounded-xl border-2" /><input value={customSecondary} onChange={e=>setCustomSecondary(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border-2 bg-white text-sm font-mono font-bold" /></div><button onClick={()=>setStoreData({...storeData, secondary_color:customSecondary})} className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black">Apply</button></div>
            <div className="p-4 rounded-[14px] border-2 bg-slate-50"><label className="text-[11px] font-black uppercase">Accent</label><div className="mt-3 flex gap-3"><input type="color" value={customAccent} onChange={e=>setCustomAccent(e.target.value)} className="w-16 h-12 rounded-xl border-2" /><input value={customAccent} onChange={e=>setCustomAccent(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border-2 bg-white text-sm font-mono font-bold" /></div><button onClick={()=>setStoreData({...storeData, accent_color:customAccent})} className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black">Apply</button></div>
          </div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[14px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">
          {saving? "Saving..." : "Save Theme"}
        </button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.includes("✅")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}