"use client";
import { useStore } from "../layout";
import { useState, useMemo } from "react";

export default function SeoPage() {
  const { storeData, setStoreData, handleSave, saving, saveMsg } = useStore();
  const [activeTab, setActiveTab] = useState("google");
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const seoScore = useMemo(() => {
    let score = 0; let checks = [];
    if(storeData.seo_title && storeData.seo_title.length >= 50 && storeData.seo_title.length <= 65){ score+=20; checks.push({ ok:true, label:"Title 50-65 chars - Perfect for Google" }); } else if(storeData.seo_title && storeData.seo_title.length >= 30){ score+=10; checks.push({ ok:false, label:"Title too short/long - Should be 50-65" }); } else checks.push({ ok:false, label:"Title Missing - Most important" });
    if(storeData.seo_description && storeData.seo_description.length >= 120 && storeData.seo_description.length <= 165){ score+=20; checks.push({ ok:true, label:"Description 120-165 chars - Perfect" }); } else if(storeData.seo_description && storeData.seo_description.length >= 50){ score+=10; checks.push({ ok:false, label:"Description short" }); } else checks.push({ ok:false, label:"Description Missing" });
    if(storeData.meta_keywords || storeData.seo_keywords){ score+=15; checks.push({ ok:true, label:"Keywords added" }); } else checks.push({ ok:false, label:"Keywords missing - Add 5-10" });
    if(storeData.shop_name && storeData.shop_description && storeData.shop_description.length > 80){ score+=15; checks.push({ ok:true, label:"Shop info complete" }); } else checks.push({ ok:false, label:"Shop description short - Add 100+ chars" });
    if(storeData.shop_logo || storeData.shop_banner){ score+=10; checks.push({ ok:true, label:"Logo/Banner added" }); } else checks.push({ ok:false, label:"No logo/banner" });
    if(storeData.shop_slug && storeData.shop_slug.length >= 3){ score+=10; checks.push({ ok:true, label:"Slug SEO friendly" }); } else checks.push({ ok:false, label:"Slug missing" });
    if(storeData.seo_title?.toLowerCase().includes((storeData.district?.toLowerCase() || "rajshahi")) || storeData.seo_description?.toLowerCase().includes("rajshahi")){ score+=10; checks.push({ ok:true, label:"Local SEO - City included" }); } else checks.push({ ok:false, label:"No city name - Add Rajshahi" });
    return { score: Math.min(score, 100), checks };
  }, [storeData]);

  const keywordsArray = useMemo(() => {
    const raw = storeData.meta_keywords || storeData.seo_keywords || "";
    return raw.split(",").map(k => k.trim()).filter(Boolean);
  }, [storeData.meta_keywords, storeData.seo_keywords]);

  const addKeyword = () => {
    if(!keywordInput.trim()) return;
    const current = storeData.meta_keywords || "";
    const newVal = current? `${current}, ${keywordInput.trim()}` : keywordInput.trim();
    setStoreData({...storeData, meta_keywords: newVal, seo_keywords: newVal});
    setKeywordInput("");
  };

  const removeKeyword = (idx) => {
    const arr = keywordsArray.filter((_, i) => i!== idx);
    const newVal = arr.join(", ");
    setStoreData({...storeData, meta_keywords: newVal, seo_keywords: newVal});
  };

  const googlePreviewTitle = storeData.seo_title || `${storeData.shop_name || "Your Shop"} - Best ${storeData.shop_category || "Fashion"} Store in ${storeData.district || "Rajshahi"} | BAHARAZ`;
  const googlePreviewDesc = storeData.seo_description || `${storeData.shop_description || "Shop authentic products"} - 100% authentic, fast delivery, COD, 7 days return, trusted by 10k+ customers in ${storeData.district || "Rajshahi"}.`;
  const googlePreviewUrl = `https://baharaz.com/store/${storeData.shop_slug || "your-shop-name"}`;

  return (
    <div className="space-y-6 max-w-3xl pb-24">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2">SEO Settings <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border font-bold">Google + Facebook SEO</span></h1>
          <p className="text-xs text-slate-500 mt-2">Google ranking, Facebook share, WhatsApp preview - Rank #1 for Rajshahi</p>
        </div>
        <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${seoScore.score >= 80? "bg-green-50 text-green-700 border-green-200" : seoScore.score >= 50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>SEO {seoScore.score}/100</div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between"><p className="text-[11px] font-black uppercase text-slate-500">SEO Health</p><p className="text-xs font-black">{seoScore.score}% • {seoScore.checks.filter(c=>c.ok).length}/{seoScore.checks.length} passed</p></div>
        <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${seoScore.score >= 80? "bg-green-500" : seoScore.score >= 50? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${seoScore.score}%` }}></div></div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
          {seoScore.checks.map((c,i) => (
            <div key={i} className={`p-3 rounded-xl border-2 flex gap-2 items-start ${c.ok? "bg-green-50 border-green-200" : "bg-red-50 border-red-100"}`}><span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${c.ok? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{c.ok? "✓" : "!"}</span><p className={`text-[11px] font-bold ${c.ok? "text-green-800" : "text-red-700"}`}>{c.label}</p></div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10">
        <button onClick={()=>setActiveTab("google")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="google"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>GOOGLE - TITLE & DESC</button>
        <button onClick={()=>setActiveTab("keywords")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="keywords"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>KEYWORDS - LOCAL SEO</button>
        <button onClick={()=>setActiveTab("social")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="social"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>SOCIAL - FB / WA</button>
        <button onClick={()=>setActiveTab("advanced")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="advanced"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>ADVANCED - PIXEL</button>
      </div>

      {activeTab === "google" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-start"><h3 className="font-black text-[14px]">Google Search Title & Description - Most Important - 80% of SEO</h3><button onClick={()=>setShowCompetitor(!showCompetitor)} className="text-[11px] px-4 py-2 rounded-full bg-slate-50 border-2 font-bold shrink-0">{showCompetitor? "Hide Examples" : "Examples"}</button></div>
            {showCompetitor && <div className="p-4 rounded-xl bg-slate-900 text-white grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div><p className="font-black text-amber-300">🏆 #1 Ranking Example:</p><p className="mt-2 text-blue-300">TAMID NEW FASHION - Best Clothing Store in Rajshahi | BAHARAZ</p><p className="text-green-300 mt-1">https://baharaz.com/store/tamid-fashion - ⭐ 4.9 • Rajshahi</p><p className="text-white/70 mt-1">Shop authentic clothing... 100% authentic, fast delivery, COD...</p></div><div><p className="font-black text-red-300">❌ Bad Example:</p><p className="mt-2">My Shop - Official Store</p><p className="text-white/50 mt-1">We sell products.</p><p className="text-red-300 mt-2">Why bad: No city, no category, too short</p></div></div>}
            <div><label className="text-[11px] font-black uppercase">SEO Title (60 chars) - Include Shop Name + Category + City *</label><input value={storeData.seo_title || ""} onChange={e=>setStoreData({...storeData, seo_title:e.target.value})} maxLength={70} placeholder={`${storeData.shop_name || "TAMID"} - Best ${storeData.shop_category || "Clothing"} Store in ${storeData.district || "Rajshahi"} | BAHARAZ`} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm font-bold" /><div className="mt-3 flex justify-between items-center"><div className="flex gap-2"><span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${storeData.seo_title?.includes(storeData.shop_name || " ")? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{storeData.seo_title?.includes(storeData.shop_name || "___")? "✓ Has Shop Name" : "✕ Missing Shop Name"}</span><span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${storeData.seo_title?.toLowerCase().includes((storeData.district||"rajshahi").toLowerCase())? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{storeData.seo_title?.toLowerCase().includes((storeData.district||"rajshahi").toLowerCase())? "✓ Has City" : "✕ Add City"}</span></div><p className="text-[11px] font-black">{(storeData.seo_title||"").length}/70 - {(storeData.seo_title||"").length>=50 && (storeData.seo_title||"").length<=60? "Perfect" : (storeData.seo_title||"").length>65? "Too long" : "Too short"}</p></div><p className="text-[11px] text-slate-400 mt-3">Formula: [Shop Name] - Best [Category] Store in [City] | BAHARAZ - Keep 50-60 chars</p></div>
            <div><label className="text-[11px] font-black uppercase">SEO Description (160 chars) - Must have trust signals + city *</label><textarea value={storeData.seo_description || ""} onChange={e=>setStoreData({...storeData, seo_description:e.target.value})} maxLength={170} rows={4} placeholder={`Shop authentic ${storeData.shop_category || "clothing"} from ${storeData.shop_name || "TAMID"} in ${storeData.district || "Rajshahi"}. 100% authentic, fast delivery, COD, 7 days return, trusted by 10k+.`} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" /><div className="mt-3 flex justify-between"><div className="flex gap-2"><span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${storeData.seo_description?.toLowerCase().includes("authentic")? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700"}`}>{storeData.seo_description?.toLowerCase().includes("authentic")? "✓ Authentic" : "✕ Add Authentic"}</span><span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${storeData.seo_description?.toLowerCase().includes("delivery")? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50"}`}>{storeData.seo_description?.toLowerCase().includes("delivery")? "✓ Delivery" : "✕ Add Delivery"}</span></div><p className="text-[11px] font-black">{(storeData.seo_description||"").length}/170 - {(storeData.seo_description||"").length>=120 && (storeData.seo_description||"").length<=160? "Perfect" : (storeData.seo_description||"").length>160? "Too long" : "Too short"}</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="text-[11px] font-black uppercase">Shop Slug - SEO URL *</label><div className="mt-2 flex"><span className="px-4 py-4 rounded-l-xl bg-slate-100 border-2 border-r-0 text-xs font-mono font-bold">/store/</span><input value={storeData.shop_slug || ""} onChange={e=>setStoreData({...storeData, shop_slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/--+/g,"-")})} placeholder="tamid-fashion-rajshahi" className="flex-1 px-4 py-4 rounded-r-xl border-2 bg-slate-50 text-sm font-mono font-black" /></div></div><div><label className="text-[11px] font-black uppercase">Canonical URL - Optional</label><input value={storeData.canonical_url || ""} onChange={e=>setStoreData({...storeData, canonical_url:e.target.value})} placeholder="https://baharaz.com/store/tamid-fashion" className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm font-mono" /></div></div>
          </div>
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm">
            <p className="text-[11px] font-black uppercase text-slate-500">Google Search Preview - Live</p>
            <div className="mt-5 p-5 rounded-[14px] bg-white border-2 max-w-[600px]">
              <div className="flex gap-2 items-center text-[11px] text-slate-500"><span className="w-7 h-7 rounded-full bg-slate-100 border flex items-center justify-center text-[10px] font-black">B</span><span className="font-bold">Baharaz</span><span className="text-slate-400">https://baharaz.com › store › {storeData.shop_slug || "your-shop"}</span></div>
              <p className="text-[#1a0dab] text-[19px] leading-[1.3] mt-2 font-medium">{googlePreviewTitle}</p>
              <p className="text-[12px] text-slate-600 mt-2">⭐ {storeData.rating || 4.9} • {storeData.total_reviews || 127} reviews • {storeData.district || "Rajshahi"}</p>
              <p className="text-[13px] text-[#4d5156] mt-2 leading-[1.5]">{googlePreviewDesc}</p>
            </div>
          </div>
          <div className="p-5 rounded-[16px] border-2 bg-white"><p className="text-[11px] font-black uppercase text-slate-500">Mobile Google Preview - 70% traffic mobile</p><div className="mt-4 max-w-[360px] mx-auto p-4 rounded-[14px] border-2 bg-white shadow-sm"><p className="text-[10px] text-slate-400">🔍 Google Search • {storeData.district || "Rajshahi"}</p><div className="mt-3 flex gap-3"><div className="w-16 h-16 rounded-xl bg-slate-100 border shrink-0 overflow-hidden">{storeData.shop_logo? <img src={storeData.shop_logo} className="w-full h-full object-cover" alt="logo" /> : <div className="w-full h-full flex items-center justify-center text-[10px]">LOGO</div>}</div><div className="flex-1"><p className="text-[#1a0dab] text-[15px] leading-tight font-medium">{googlePreviewTitle.slice(0,58)}</p><p className="text-[11px] text-[#4d5156] mt-1">{googlePreviewDesc.slice(0,110)}...</p></div></div></div></div>
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <div className="flex justify-between"><h3 className="font-black text-[14px]">SEO Keywords - Local SEO - 5-10 keywords - Include city</h3><span className="text-[10px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border font-bold">{keywordsArray.length} keywords</span></div>
            <div><label className="text-[11px] font-black uppercase">Add Keywords - Type & Enter</label><div className="mt-2 flex gap-2"><input value={keywordInput} onChange={e=>setKeywordInput(e.target.value)} onKeyDown={e=>{ if(e.key === "Enter"){ e.preventDefault(); addKeyword(); }}} placeholder="Type keyword & Enter - Ex: clothing store rajshahi" className="flex-1 px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /><button onClick={addKeyword} className="px-6 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-black">+ Add</button></div><div className="mt-3 p-3 rounded-xl bg-slate-50 border-2 flex gap-2 flex-wrap min-h-[60px]">{keywordsArray.length === 0? <p className="text-xs text-slate-400">No keywords yet - Add 5-10 keywords - Click ✕ to remove</p> : keywordsArray.map((kw, idx) => (<span key={idx} className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-2">{kw} <button onClick={()=>removeKeyword(idx)} className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">✕</button></span>))}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] font-black uppercase">Meta Keywords (comma separated)</label><input value={storeData.meta_keywords || ""} onChange={e=>setStoreData({...storeData, meta_keywords:e.target.value, seo_keywords:e.target.value})} placeholder="fashion, t-shirt, clothing store rajshahi" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div><div><label className="text-[11px] font-black uppercase">Focus Keyword - Main 1 keyword</label><input value={storeData.focus_keyword || ""} onChange={e=>setStoreData({...storeData, focus_keyword:e.target.value})} placeholder="clothing store rajshahi" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-black" /></div></div>
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200"><p className="text-xs font-black text-amber-900">Keyword Ideas - Click to Apply:</p><div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]"><button onClick={()=>setStoreData({...storeData, meta_keywords: `${storeData.shop_name || "fashion"} store ${storeData.district || "rajshahi"}, clothing store ${storeData.district || "rajshahi"}, best fashion shop ${storeData.district || "rajshahi"}`, seo_keywords: `${storeData.shop_name || "fashion"} store ${storeData.district || "rajshahi"}, clothing store ${storeData.district || "rajshahi"}`})} className="p-2.5 rounded-xl bg-white border text-left"><p className="font-black">Fashion Store Rajshahi Template</p><p className="text-slate-500 mt-1">fashion store rajshahi, clothing store rajshahi, best fashion shop rajshahi</p></button><button onClick={()=>setStoreData({...storeData, meta_keywords: `electronics store ${storeData.district || "rajshahi"}, mobile shop ${storeData.district || "rajshahi"}, gadget shop rajshahi`, seo_keywords: `electronics store ${storeData.district || "rajshahi"}`})} className="p-2.5 rounded-xl bg-white border text-left"><p className="font-black">Electronics Template</p><p className="text-slate-500 mt-1">electronics store rajshahi, mobile shop rajshahi</p></button></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="text-[11px] font-black uppercase">District / City *</label><input value={storeData.district || ""} onChange={e=>setStoreData({...storeData, district:e.target.value})} placeholder="Rajshahi" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div><div><label className="text-[11px] font-black uppercase">Area / Thana</label><input value={storeData.area || ""} onChange={e=>setStoreData({...storeData, area:e.target.value})} placeholder="Shaheb Bazar" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div></div>
            <div><label className="text-[11px] font-black uppercase">Long-tail Keywords - Questions</label><textarea value={storeData.longtail_keywords || ""} onChange={e=>setStoreData({...storeData, longtail_keywords:e.target.value})} rows={3} placeholder="Where to buy best clothing in Rajshahi?" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" /></div>
          </div>
          <div className="p-6 rounded-[16px] bg-slate-900 text-white"><p className="text-[11px] font-black uppercase opacity-60">Google Ranking Simulator</p><div className="mt-4 space-y-3"><div className="flex justify-between items-center p-3 rounded-xl bg-white/10 border"><span className="text-xs">Keyword: "clothing store {storeData.district || "rajshahi"}"</span><span className={`text-[11px] px-3 py-1 rounded-full font-black ${keywordsArray.join(" ").toLowerCase().includes("clothing store")? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{keywordsArray.join(" ").toLowerCase().includes("clothing store")? "Will Rank ✅" : "Won't Rank ❌"}</span></div></div></div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Facebook / WhatsApp Preview - Open Graph</h3>
            <div><label className="text-[11px] font-black uppercase">OG Title - Facebook Title</label><input value={storeData.og_title || storeData.seo_title || ""} onChange={e=>setStoreData({...storeData, og_title:e.target.value})} placeholder="🔥 TAMID - Best Clothing Store in Rajshahi - 50% OFF!" className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div>
            <div><label className="text-[11px] font-black uppercase">OG Description - Facebook Description</label><textarea value={storeData.og_description || storeData.seo_description || ""} onChange={e=>setStoreData({...storeData, og_description:e.target.value})} rows={3} placeholder="🔥 Shop authentic clothing - 50% OFF today only, free delivery 999TK+" className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" /></div>
            <div><label className="text-[11px] font-black uppercase">OG Image - 1200x630px - Must be 1200x630</label><input value={storeData.og_image || storeData.shop_banner || ""} onChange={e=>setStoreData({...storeData, og_image:e.target.value})} placeholder="https://.../banner.jpg - 1200x630" className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm" /></div>
            <div className="p-5 rounded-[14px] bg-[#f0f2f5] border-2"><p className="text-[11px] font-black uppercase text-slate-500">Facebook Share Preview</p><div className="mt-4 bg-white rounded-[12px] border-2 overflow-hidden max-w-[500px]"><div className="h-[263px] bg-slate-200 relative overflow-hidden">{storeData.og_image || storeData.shop_banner? <img src={storeData.og_image || storeData.shop_banner} className="w-full h-full object-cover" alt="og" /> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">🖼️ 1200x630 OG Image</div>}</div><div className="p-3 bg-[#f0f2f5] border-t"><p className="text-[11px] text-slate-500 uppercase font-bold">BAHARAZ.COM</p><p className="font-black text-[16px] mt-1">{storeData.og_title || storeData.seo_title || "Your Store"}</p><p className="text-[13px] text-slate-600 mt-1">{storeData.og_description || storeData.seo_description || "Shop authentic products"}</p></div></div><div className="mt-4 flex gap-2"><a href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(googlePreviewUrl)}`} target="_blank" className="text-[11px] px-4 py-2 rounded-full bg-[#1877F2] text-white font-black">Test on Facebook Debugger →</a><button onClick={()=>navigator.clipboard.writeText(googlePreviewUrl)} className="text-[11px] px-4 py-2 rounded-full bg-white border-2 font-black">Copy Link</button></div></div>
            <div className="p-5 rounded-[14px] bg-[#e5ddd5] border-2"><p className="text-[11px] font-black uppercase">WhatsApp Preview</p><div className="mt-4 max-w-[320px] bg-white rounded-[12px] border overflow-hidden"><div className="p-2 bg-[#f0f0f0] flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-300"></div><div><p className="text-xs font-black">Baharaz Store</p><p className="text-[10px] text-slate-500">Shared a link • Now</p></div></div><div className="h-40 bg-slate-100">{storeData.og_image || storeData.shop_banner? <img src={storeData.og_image || storeData.shop_banner} className="w-full h-full object-cover" alt="wa" /> : <div className="w-full h-full flex items-center justify-center text-[10px]">OG Image</div>}</div><div className="p-3"><p className="text-[13px] font-bold">{storeData.og_title || storeData.seo_title || "Your Store"}</p><p className="text-[10px] text-[#0084ff] mt-2 truncate">{googlePreviewUrl}</p></div></div></div>
          </div>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Advanced SEO - Schema, Analytics, Pixels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="text-[11px] font-black uppercase">Google Analytics ID - GA4</label><input value={storeData.ga_id || ""} onChange={e=>setStoreData({...storeData, ga_id:e.target.value})} placeholder="G-XXXXXXXXXX" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono font-bold" /></div><div><label className="text-[11px] font-black uppercase">Facebook Pixel ID *</label><input value={storeData.facebook_pixel || storeData.fb_pixel || ""} onChange={e=>setStoreData({...storeData, facebook_pixel:e.target.value, fb_pixel:e.target.value})} placeholder="123456789012345 - 15 digits" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono font-bold" /></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="text-[11px] font-black uppercase">Google Tag Manager ID</label><input value={storeData.gtm_id || ""} onChange={e=>setStoreData({...storeData, gtm_id:e.target.value})} placeholder="GTM-XXXXXXX" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono" /></div><div><label className="text-[11px] font-black uppercase">Facebook Domain Verification</label><input value={storeData.fb_domain_verification || ""} onChange={e=>setStoreData({...storeData, fb_domain_verification:e.target.value})} placeholder="xxxxxxxxxxxxxxxx" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono" /></div></div>
            <div><label className="text-[11px] font-black uppercase">Custom Meta Tags - Verification</label><textarea value={storeData.custom_meta || ""} onChange={e=>setStoreData({...storeData, custom_meta:e.target.value})} rows={4} placeholder={`<meta name="google-site-verification" content="your-code" />`} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-xs font-mono resize-none" /></div>
            <div className="space-y-3"><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">NoIndex - Hide from Google?</p><p className="text-[11px] text-slate-500">If ON, store not appear on Google - Keep OFF</p></div><button onClick={()=>setStoreData({...storeData, noindex:!storeData.noindex})} className={`w-12 h-7 rounded-full p-1 ${storeData.noindex? "bg-red-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.noindex? "translate-x-5" : ""}`}></div></button></div><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Enable Schema.org JSON-LD - Rich results - Stars, price</p><p className="text-[11px] text-slate-500">Shows rating stars ⭐ 4.9 - Increases CTR 30% - Recommended ON</p></div><button onClick={()=>setStoreData({...storeData, enable_schema: storeData.enable_schema!== false? false : true})} className={`w-12 h-7 rounded-full p-1 ${storeData.enable_schema!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.enable_schema!== false? "translate-x-5" : ""}`}></div></button></div></div>
          </div>
          <div className="p-6 rounded-[16px] bg-slate-900 text-white"><p className="text-[11px] font-black uppercase opacity-60">Schema Preview - JSON-LD - Google Rich Results</p><pre className="mt-4 p-4 rounded-xl bg-white/10 border text-[11px] overflow-x-auto">{`{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "${storeData.shop_name || "Your Store"}",
  "url": "https://baharaz.com/store/${storeData.shop_slug || "your-shop"}",
  "address": { "addressLocality": "${storeData.district || "Rajshahi"}" },
  "aggregateRating": { "ratingValue": "${storeData.rating || 4.9}", "reviewCount": "${storeData.total_reviews || 127}" }
}`}</pre></div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[16px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">{saving? "Saving SEO..." : `Save SEO - Score ${seoScore.score}/100 - ${seoScore.score >= 80? "Ready to Rank #1 🚀" : "Needs Work"} - Live on Google & Facebook`}</button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.toLowerCase().includes("saved")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}