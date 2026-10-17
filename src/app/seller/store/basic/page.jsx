"use client";
import { useStore } from "../layout";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function BasicPage() {
  const { storeData, setStoreData } = useStore();
  const [activeTab, setActiveTab] = useState("basic");
  const [showNameIdeas, setShowNameIdeas] = useState(false);
  const [showCategoryHelp, setShowCategoryHelp] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function getUid() {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || storeData?.user_id || null);
    }
    getUid();
  }, [storeData]);

  const generateSlug = (text) => (text || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

  const categories = [
    { id: "fashion", name: "Fashion & Clothing", icon: "👗", sub: ["T-Shirt", "Panjabi", "Shirt", "Pant", "Saree", "Hijab", "Borka", "Kids Fashion"] },
    { id: "electronics", name: "Electronics", icon: "📱", sub: ["Mobile", "Gadget", "Headphone", "Charger", "Power Bank"] },
    { id: "beauty", name: "Beauty & Cosmetics", icon: "💄", sub: ["Makeup", "Skincare", "Perfume", "Hair Care"] },
    { id: "home", name: "Home & Living", icon: "🏠", sub: ["Furniture", "Decor", "Kitchen", "Bedding"] },
    { id: "shoes", name: "Shoes & Bags", icon: "👟", sub: ["Shoe", "Sneaker", "Bag", "Wallet"] },
    { id: "groceries", name: "Groceries & Food", icon: "🛒", sub: ["Food", "Snacks", "Organic", "Spices"] },
    { id: "kids", name: "Kids & Baby", icon: "👶", sub: ["Baby Dress", "Toys", "Diaper", "Baby Food"] },
    { id: "sports", name: "Sports & Outdoor", icon: "⚽", sub: ["Jersey", "Gym", "Cycling", "Cricket"] },
    { id: "other", name: "Other", icon: "📦", sub: ["Other"] },
  ];

  const nameIdeas = [
    "TAMID NEW FASHION - Rajshahi Original - Since 2020",
    "Rajshahi Fashion House - Authentic & Trusted - Premium",
    "Style Bazar Rajshahi - Premium Clothing Store",
    "Urban Fashion Rajshahi - Best Clothing Store",
    "Classic Panjabi Store Rajshahi - Authentic",
    "Premium Clothing Rajshahi - 100% Authentic Guarantee",
    "Rajshahi's Best Fashion - TAMID - Official Store",
    "Authentic Fashion Rajshahi - Direct From Factory",
    "TAMID Fashion - Rajshahi's Most Trusted - 10k+ Customers",
    "Royal Fashion Rajshahi - Premium Quality - Best Price"
  ];

  const basicScore = useMemo(() => {
    let s = 0;
    if (storeData?.shop_name && storeData.shop_name.length >= 5) s += 25;
    if (storeData?.shop_description && storeData.shop_description.length >= 100) s += 30;
    if (storeData?.shop_category) s += 20;
    if (storeData?.store_motto) s += 10;
    if (storeData?.brand_story || storeData?.mission_statement) s += 15;
    return { score: Math.min(s, 100), level: s >= 80? "Excellent" : s >= 50? "Average" : "Needs Work" };
  }, [storeData]);

  const wordCount = (text) => (text || "").trim().split(/\s+/).filter(Boolean).length;

  const handleNameChange = (newName) => {
    const newSlug = generateSlug(newName);
    if(!storeData?.shop_slug || storeData.shop_slug.length < 3){
      setStoreData({...storeData, shop_name: newName, name: newName, shop_slug: newSlug, slug: newSlug });
    } else {
      setStoreData({...storeData, shop_name: newName, name: newName });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      let uid = currentUserId;
      if(!uid){
        const { data: { session } } = await supabase.auth.getSession();
        uid = session?.user?.id || null;
      }
      if(!uid) throw new Error("Session expired - Please login again");

      let payload = {
        user_id: uid,
        name: storeData.shop_name,
        shop_name: storeData.shop_name,
        slug: storeData.shop_slug,
        shop_slug: storeData.shop_slug,
        description: storeData.shop_description,
        shop_description: storeData.shop_description,
        shop_category: storeData.shop_category,
        sub_categories: storeData.sub_categories,
        store_motto: storeData.store_motto,
        brand_story: storeData.brand_story,
        mission_statement: storeData.mission_statement,
        vision_statement: storeData.vision_statement,
        business_type: storeData.business_type,
        founded_year: storeData.founded_year,
        total_products: storeData.total_products? parseInt(storeData.total_products) : null,
        seo_keywords: storeData.seo_keywords,
        meta_keywords: storeData.seo_keywords,
        updated_at: new Date().toISOString(),
      };

      Object.keys(payload).forEach(k => {
        if(payload[k] === undefined) delete payload[k];
        if(payload[k] === "" &&!["shop_name","name","shop_slug","slug","shop_description","description"].includes(k)) delete payload[k];
      });

      const { data: exists } = await supabase.from("sellers").select("id").eq("user_id", uid).maybeSingle();
      let result;
      if(exists){
        result = await supabase.from("sellers").update(payload).eq("user_id", uid).select().single();
      } else {
        result = await supabase.from("sellers").insert({...payload, created_at: new Date().toISOString()}).select().single();
      }

      if(result.error) throw result.error;

      setStoreData(prev => ({...prev,...result.data}));
      setSaveMsg(`Saved Successfully - ${result.data.name} updated in Supabase - Score ${basicScore.score}/100`);

    } catch(e){
      setSaveMsg("Error: " + (e.message || "Failed to save"));
    } finally {
      setSaving(false);
      setTimeout(()=> setSaveMsg(""), 6000);
    }
  };

  return (
    <div className="space-y-6 w-full pb-28">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight">Basic Store Info</h1>
          <p className="text-[12px] text-slate-500 mt-1">Professional store identity for storefront and SEO.</p>
        </div>
        <div className={`text-[11px] px-4 py-2 rounded-full font-black border-2 h-fit ${basicScore.score >= 80? "bg-green-50 text-green-700 border-green-200" : basicScore.score >= 50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {basicScore.score}/100 - {basicScore.level}
        </div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between">
          <p className="text-[11px] font-black uppercase text-slate-500">Basic Info Completion</p>
          <p className="text-xs font-black">{basicScore.score}%</p>
        </div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${basicScore.score >= 80? "bg-green-500" : basicScore.score >= 50? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${basicScore.score}%` }}></div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
          {[
            { label: "Name", done:!!storeData?.shop_name && storeData.shop_name.length >= 5 },
            { label: "About", done: (storeData?.shop_description?.length || 0) >= 100 },
            { label: "Category", done:!!storeData?.shop_category },
            { label: "Story", done:!!storeData?.brand_story ||!!storeData?.mission_statement },
          ].map((p, i) => (
            <div key={`score-${p.label}-${i}`} className={`p-2.5 rounded-xl border-2 text-center font-bold ${p.done? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 text-slate-500"}`}>{p.done? "✓" : "○"} {p.label}</div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10">
        <button onClick={() => setActiveTab("basic")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab === "basic"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>BASIC INFO</button>
        <button onClick={() => setActiveTab("category")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab === "category"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>CATEGORY</button>
        <button onClick={() => setActiveTab("story")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab === "story"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>STORY</button>
      </div>

      {activeTab === "basic" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[14px]">Store Basic Information</h3>
            <button onClick={() => setShowNameIdeas(!showNameIdeas)} className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold">{showNameIdeas? "Hide Ideas" : "Name Ideas"}</button>
          </div>

          {showNameIdeas && (
            <div className="grid md:grid-cols-2 gap-2 p-4 rounded-[14px] bg-slate-900 border-2">
              {nameIdeas.map((n, i) => (
                <button key={`idea-${i}-${n.slice(0,5)}`} onClick={() => handleNameChange(n)} className="text-left p-3 rounded-[10px] bg-white/10 text-white text-[11px] border border-white/10 hover:bg-white/20">
                  <p className="font-bold">{n}</p>
                  <p className="text-[10px] opacity-60 mt-1">/{generateSlug(n)}</p>
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest">Shop Name * - 5-50 chars</label>
            <input value={storeData?.shop_name || ""} onChange={(e) => handleNameChange(e.target.value)} placeholder="Your Store Name" className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none focus:border-slate-900 text-sm font-black" />
            <div className="mt-2 flex justify-between text-[11px]"><span className={`${(storeData?.shop_name?.length||0) >= 5? "text-green-600 font-bold" : "text-amber-600"}`}>{(storeData?.shop_name?.length||0)}/50</span><span className="text-slate-400">{wordCount(storeData?.shop_name)} words</span></div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest">Store URL Preview</label>
            <div className="mt-2 flex items-center px-4 py-3 rounded-xl border-2 bg-slate-50">
              <span className="text-slate-400 text-sm font-mono">/store/</span>
              <span className="ml-2 font-mono text-sm font-bold">{storeData?.shop_slug || "your-store"}</span>
              <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-white border font-bold">{storeData?.shop_slug? "LOCKED FOR SEO" : "AUTO"}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest">Shop Description * - 100-500 chars</label>
            <textarea value={storeData?.shop_description || ""} onChange={(e) => setStoreData({...storeData, shop_description: e.target.value, description: e.target.value })} rows={6} placeholder="We are your store - Since 2020. We provide 100% authentic products direct from factory..." className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none focus:border-slate-900 text-sm leading-relaxed resize-none" />
            <div className="mt-2 flex justify-between text-[11px]"><span className={`${(storeData?.shop_description?.length||0) >= 100? "text-green-600 font-bold" : "text-amber-600"}`}>{(storeData?.shop_description?.length||0)}/500 chars</span><span className="text-slate-400">{wordCount(storeData?.shop_description)} words</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-black uppercase">Store Motto / Tagline</label>
              <input value={storeData?.store_motto || ""} onChange={(e) => setStoreData({...storeData, store_motto: e.target.value })} placeholder="Trusted by 10k+ Customers" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase">Business Type</label>
              <select value={storeData?.business_type || "retail"} onChange={(e) => setStoreData({...storeData, business_type: e.target.value })} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold outline-none focus:bg-white focus:border-slate-900">
                <option value="retail">Retail - Single Store</option>
                <option value="wholesale">Wholesale</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="brand">Brand</option>
                <option value="reseller">Reseller</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[11px] font-black uppercase">Founded Year</label><input value={storeData?.founded_year || ""} onChange={(e) => setStoreData({...storeData, founded_year: e.target.value })} placeholder="2020" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" /></div>
            <div><label className="text-[11px] font-black uppercase">Total Products</label><input type="number" value={storeData?.total_products || ""} onChange={(e) => setStoreData({...storeData, total_products: e.target.value })} placeholder="52" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" /></div>
          </div>
        </div>
      )}

      {activeTab === "category" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <div className="flex justify-between">
            <h3 className="font-black text-[14px]">Shop Category</h3>
            <button onClick={() => setShowCategoryHelp(!showCategoryHelp)} className="text-[11px] px-3 py-1.5 rounded-full bg-slate-50 border-2 font-bold">{showCategoryHelp? "Hide Help" : "Help"}</button>
          </div>
          {showCategoryHelp && <div className="p-4 rounded-xl bg-slate-50 border-2 text-[11px] text-slate-700 leading-relaxed"><p className="font-black">Why Category Matters?</p><p className="mt-1">Selecting correct category helps customers find your store easily, improves SEO and increases chance to be featured on homepage.</p></div>}
          <div><label className="text-[11px] font-black uppercase">Main Category *</label><div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">{categories.map((cat) => { const active = storeData?.shop_category === cat.id; return <button key={`cat-${cat.id}`} onClick={() => setStoreData({...storeData, shop_category: cat.id })} className={`p-4 rounded-xl border-2 text-left flex gap-3 items-start transition-all ${active? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white border-slate-200 hover:border-slate-900 hover:shadow-sm"}`}><span className="text-xl">{cat.icon}</span><div><p className="text-sm font-black flex items-center gap-2">{cat.name} {active && <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px]">✓</span>}</p><p className={`text-[11px] mt-1 ${active? "text-white/60" : "text-slate-500"}`}>{cat.sub.join(", ")}</p></div></button>})}</div></div>
          <div><label className="text-[11px] font-black uppercase">Sub Categories - Comma Separated</label><input value={storeData?.sub_categories || ""} onChange={(e) => setStoreData({...storeData, sub_categories: e.target.value })} placeholder="T-Shirt, Panjabi, Shirt, Pant" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" /></div>
          <div><label className="text-[11px] font-black uppercase">Keywords - For SEO</label><input value={storeData?.seo_keywords || storeData?.meta_keywords || ""} onChange={(e) => setStoreData({...storeData, seo_keywords: e.target.value, meta_keywords: e.target.value })} placeholder="fashion store rajshahi, clothing shop rajshahi" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm focus:bg-white focus:border-slate-900 outline-none" /></div>
        </div>
      )}

      {activeTab === "story" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Brand Story</h3>
          <div>
            <label className="text-[11px] font-black uppercase">Brand Story - 200-800 chars</label>
            <textarea value={storeData?.brand_story || storeData?.shop_description || ""} onChange={(e) => setStoreData({...storeData, brand_story: e.target.value, shop_description: storeData.shop_description || e.target.value, description: e.target.value })} rows={6} placeholder="Started in 2020 from Rajshahi. We started with a small shop and now we serve 10k+ customers..." className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm leading-relaxed resize-none focus:bg-white focus:border-slate-900 outline-none" />
            <div className="mt-2 flex justify-between text-[11px]"><span className="text-slate-500">{(storeData?.brand_story?.length || 0)}/800</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-black uppercase">Mission Statement</label><input value={storeData?.mission_statement || ""} onChange={(e) => setStoreData({...storeData, mission_statement: e.target.value })} placeholder="Provide 100% authentic products at best price" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" /></div>
            <div><label className="text-[11px] font-black uppercase">Vision Statement</label><input value={storeData?.vision_statement || ""} onChange={(e) => setStoreData({...storeData, vision_statement: e.target.value })} placeholder="Become most trusted fashion store" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none" /></div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 text-white">
            <p className="text-[11px] font-black uppercase opacity-60">Live Preview</p>
            <h4 className="font-black mt-2 text-[16px]">{storeData?.shop_name || "Your Store"}</h4>
            <p className="text-[12px] opacity-70 mt-1 leading-relaxed">{storeData?.brand_story?.slice(0,120) || storeData?.shop_description?.slice(0,120) || "Your brand story will appear here..."}</p>
          </div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[16px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm flex items-center justify-center gap-2 transition-all">
          {saving? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Saving Basic Info...</> : `Save Basic Info - ${basicScore.score}/100`}
        </button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.toLowerCase().includes("saved")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  );
}