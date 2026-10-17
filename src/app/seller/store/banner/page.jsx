"use client";
import { useStore } from "../layout";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";

export default function BannerPage(){
  const { storeData, setStoreData, handleImageUpload } = useStore();
  const [activeTab, setActiveTab] = useState("desktop");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const onHeroUpload = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    handleImageUpload(e, "hero_image");
    setTimeout(()=>{
      setStoreData(prev=>{
        const img = prev.hero_image;
        return {...prev, shop_banner: img, banner_url: img, og_image: prev.og_image || img };
      });
    }, 600);
  };
  const onMobileUpload = (e) => handleImageUpload(e, "hero_mobile_image");
  const onSecondBannerUpload = (e) => handleImageUpload(e, "second_banner");

  const handleBannerSave = async () => {
    try {
      setSaving(true);
      setSaveMsg("Saving...");

      let sellerId = storeData?.id || storeData?.seller_id;

      if (!sellerId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).single();
          if (seller) sellerId = seller.id;
        }
      }

      if (!sellerId || sellerId === "undefined") {
        throw new Error("Seller ID missing! Refresh page or login again. Go to /seller/login");
      }

      const bannerPayload = {
        hero_image: storeData.hero_image || null,
        hero_mobile_image: storeData.hero_mobile_image || null,
        second_banner: storeData.second_banner || null,
        shop_banner: storeData.shop_banner || storeData.hero_image || null,
        banner_url: storeData.banner_url || storeData.hero_image || null,
        hero_title: storeData.hero_title || null,
        hero_subtitle: storeData.hero_subtitle || null,
        hero_cta_text: storeData.hero_cta_text || null,
        hero_cta_link: storeData.hero_cta_link || null,
        hero_badge1: storeData.hero_badge1 || null,
        hero_badge2: storeData.hero_badge2 || null,
        hero_badge3: storeData.hero_badge3 || null,
        banner_overlay: storeData.banner_overlay? parseInt(storeData.banner_overlay) : 55,
        banner_height: storeData.banner_height || "480",
        banner_text_position: storeData.banner_text_position || "left",
        banner_template: storeData.banner_template || "default",
        banner_show_button: storeData.banner_show_button!== false,
        banner_show_badges: storeData.banner_show_badges!== false,
        banner_parallax:!!storeData.banner_parallax,
        og_image: storeData.og_image || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('sellers').update(bannerPayload).eq('id', sellerId).select();

      if (error) {
        console.log("SUPABASE ERROR:", JSON.stringify(error, null, 2));
        throw new Error(error.message);
      }

      setSaveMsg("✅ Banner Saved Successfully - Live on Store!");
      setTimeout(()=> setSaveMsg(""), 3000);
    } catch (err) {
      console.log("CATCH:", err);
      setSaveMsg("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const bannerTemplates = [
    { id: "default", name: "Default Left", desc: "Left aligned - Most converting - Recommended", preview: "Left align + badges + CTA", bestFor: "All stores - 70% use left" },
    { id: "center", name: "Center Bold", desc: "Center aligned - Premium typography", preview: "Center + big title", bestFor: "Premium, Luxury" },
    { id: "minimal", name: "Minimal Clean", desc: "Small banner - Clean - Minimal", preview: "Small height + clean", bestFor: "Minimal style" },
    { id: "bold", name: "Bold Sale", desc: "Large typography - Sale focus - Urgency", preview: "Big SALE text", bestFor: "Flash Sale" },
    { id: "split", name: "Split", desc: "Left image right text - Modern", preview: "Image left, text right", bestFor: "Fashion - Model + text" },
    { id: "video", name: "Video Banner", desc: "Video background - Premium", preview: "Video background", bestFor: "Premium stores" },
    { id: "carousel", name: "Carousel", desc: "Swipe 3 banners", preview: "3 banners swipe", bestFor: "Multiple offers" },
    { id: "gradient", name: "Gradient Only", desc: "No image - Gradient background", preview: "Gradient + text", bestFor: "Fast loading" },
  ];

  const textPositions = [
    { id: "left", label: "Left - Recommended", desc: "Most converting - 70% use" },
    { id: "center", label: "Center - Premium", desc: "Premium, balanced" },
    { id: "right", label: "Right - Modern", desc: "Modern - If image left" },
  ];

  const bannerHeights = [
    { id: "320", label: "Small - 320px", use: "Minimal - Products visible" },
    { id: "400", label: "Medium Small - 400px", use: "Balanced" },
    { id: "480", label: "Medium - 480px - Recommended", use: "Amazon style - Best conversion" },
    { id: "560", label: "Large - 560px", use: "Bold - Sale" },
    { id: "640", label: "Extra Large - 640px", use: "Hero - Premium" },
    { id: "720", label: "Full Hero - 720px", use: "Full screen - Landing" },
  ];

  const ctaIdeas = ["Shop Now", "Explore Collection", "View Products", "50% OFF - Shop Now", "New Arrivals", "Best Sellers", "Limited Offer", "Order Now"];

  const bannerScore = useMemo(() => {
    let s=0;
    if(storeData.hero_image) s+=30;
    if(storeData.hero_title && storeData.hero_title.length>=10) s+=20;
    if(storeData.hero_subtitle && storeData.hero_subtitle.length>=20) s+=15;
    if(storeData.hero_cta_text) s+=10;
    if(storeData.hero_mobile_image) s+=10;
    if(storeData.banner_overlay) s+=5;
    if(storeData.banner_template) s+=10;
    return Math.min(s,100);
  }, [storeData]);

  const themeGradient = `linear-gradient(135deg, ${storeData.theme_color || "#0f172a"} 0%, ${storeData.secondary_color || "#3b82f6"} 100%)`;

  return (
    <div className="space-y-6 max-w-4xl pb-24">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2">Store Banner <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold">HERO BANNER</span></h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Main hero banner displayed on storefront - First impression = 90% trust - 1600x600 HD required - Shows title, badges, CTA</p>
        </div>
        <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${bannerScore>=80? "bg-green-50 text-green-700 border-green-200" : bannerScore>=50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{bannerScore}/100 - {bannerScore>=80? "PROFESSIONAL" : bannerScore>=50? "AVERAGE" : "POOR"}</div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between items-center"><p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Banner Quality</p><p className="text-xs font-black">{bannerScore}% Complete</p></div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full transition-all ${bannerScore>=80? "bg-green-500" : bannerScore>=50? "bg-amber-500" : "bg-red-500"}`} style={{ width:`${bannerScore}%` }}></div></div>
        <div className="mt-4 grid grid-cols-7 gap-2 text-[10px]">
          {[{ label:"Desktop", done:!!storeData.hero_image },{ label:"Mobile", done:!!storeData.hero_mobile_image },{ label:"Title", done:!!storeData.hero_title && storeData.hero_title.length>=10 },{ label:"Subtitle", done:!!storeData.hero_subtitle },{ label:"CTA", done:!!storeData.hero_cta_text },{ label:"Badges", done:!!storeData.hero_badge1 },{ label:"Template", done:!!storeData.banner_template }].map((s,i)=>(
            <div key={i} className={`p-2.5 rounded-xl border-2 text-center ${s.done? "bg-green-50 border-green-200" : "bg-slate-50"}`}><p>{s.done? "✓" : "○"}</p><p className="text-[9px] font-bold mt-1">{s.label}</p></div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-20">
        <button onClick={()=>setActiveTab("desktop")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 transition-all ${activeTab==="desktop"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>DESKTOP - 1600x600</button>
        <button onClick={()=>setActiveTab("mobile")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 transition-all ${activeTab==="mobile"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>MOBILE - 800x1000</button>
        <button onClick={()=>setActiveTab("preview")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 transition-all ${activeTab==="preview"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>LIVE PREVIEW</button>
        <button onClick={()=>setActiveTab("templates")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 transition-all ${activeTab==="templates"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>TEMPLATES - 8</button>
      </div>

      {activeTab === "templates" && (
        <div className="p-6 rounded-[16px] border-2 bg-white space-y-5 shadow-sm">
          <h3 className="font-black text-[14px]">Banner Templates - 8 Professional Styles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bannerTemplates.map(t=>{
              const isActive = (storeData.banner_template || "default") === t.id;
              return (
                <button key={t.id} onClick={()=> setStoreData({...storeData, banner_template:t.id})} className={`p-4 rounded-[14px] border-2 text-left transition-all hover:shadow-md ${isActive? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 hover:border-slate-900"}`}>
                  <div className="flex justify-between"><p className="text-xs font-black">{t.name}</p>{isActive && <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px]">✓</span>}</div>
                  <p className={`text-[11px] mt-1 ${isActive? "text-white/60" : "text-slate-500"}`}>{t.desc}</p>
                  <div className="mt-3 h-12 rounded-xl border flex items-center justify-center text-[10px] font-bold" style={{ background: isActive? "rgba(255,255,255,0.1)" : "#f8fafc" }}>{t.preview}</div>
                  <p className={`text-[10px] mt-2 font-bold ${isActive? "text-white/80" : "text-slate-600"}`}>{t.bestFor}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab!== "mobile" && activeTab!== "templates" && (
        <div className="p-6 rounded-[16px] border-2 bg-white space-y-5 shadow-sm">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-black uppercase tracking-widest">Desktop Banner - 1600x600px - Max 5MB <span className="text-red-500">*</span></label>
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold border-2 ${storeData.hero_image? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{storeData.hero_image? "✓ Uploaded" : "Required"}</span>
          </div>
          <input type="file" accept="image/*" onChange={onHeroUpload} className="w-full text-sm file:mr-3 file:px-5 file:py-3 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-black border-2 border-dashed rounded-[14px] p-2 bg-slate-50" />
          <div className="rounded-[14px] overflow-hidden border-2 bg-slate-50 relative h-[360px]">
            {storeData.hero_image? (
              <>
                <img src={storeData.hero_image} alt="hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background:`linear-gradient(to right, rgba(0,0,0,${(storeData.banner_overlay || 55)/100}) 0%, rgba(0,0,0,0.1) 80%)` }}></div>
                <div className={`absolute inset-0 p-8 flex flex-col justify-center ${storeData.banner_text_position === "center"? "items-center text-center" : storeData.banner_text_position === "right"? "items-end text-right" : "items-start"}`}>
                  <div className="flex gap-2 mb-4"><span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">{storeData.hero_badge1 || "✓ VERIFIED"}</span><span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-black">{storeData.hero_badge2 || "TOP RATED"}</span></div>
                  <h3 className="text-white font-black text-[24px] leading-tight max-w-[65%]">{storeData.hero_title || "Your banner title"}</h3>
                  <p className="text-white/80 text-[13px] mt-3 max-w-[60%] line-clamp-2">{storeData.hero_subtitle || "Your subtitle"}</p>
                  {(storeData.banner_show_button!==false) && <span className="mt-5 inline-flex px-6 py-3 bg-white text-black rounded-full text-xs font-black">{storeData.hero_cta_text || "Shop Now"} →</span>}
                </div>
                <button onClick={()=>setStoreData({...storeData, hero_image:"", shop_banner:""})} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center">✕</button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3"><span className="text-3xl">🖼️</span><p className="text-[13px] font-bold">No banner uploaded - 1600x600 recommended</p><p className="text-[11px] text-slate-400">First impression = 90% trust</p></div>
            )}
          </div>
        </div>
      )}

      {activeTab === "mobile" && (
        <div className="p-6 rounded-[16px] border-2 bg-white space-y-5 shadow-sm">
          <label className="text-[11px] font-black uppercase">Mobile Banner - 800x1000 Portrait - Optional - 70% traffic mobile</label>
          <input type="file" accept="image/*" onChange={onMobileUpload} className="w-full text-xs file:px-4 file:py-2.5 file:rounded-full file:border-0 file:bg-white file:border-2 file:font-bold border-2 border-dashed rounded-xl p-2 bg-slate-50" />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[14px] overflow-hidden border-2 bg-slate-50 h-[420px] flex items-center justify-center">{storeData.hero_mobile_image? <img src={storeData.hero_mobile_image} className="w-full h-full object-cover" alt="mobile" /> : <p className="text-xs text-slate-400">No mobile banner - Desktop will be cropped</p>}</div>
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100 text-[11px] leading-relaxed"><p className="font-black">Mobile Tips:</p><ul className="list-disc pl-4 mt-2 space-y-1"><li>800x1000 portrait recommended</li><li>70% BD traffic is mobile</li><li>Keep text center for mobile crop</li><li>CTA 44px minimum height</li></ul></div>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="p-6 rounded-[16px] border-2 bg-white space-y-5 shadow-sm">
          <h3 className="font-black text-[14px]">Live Preview - Desktop + Mobile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><p className="text-[11px] font-bold uppercase">Desktop - 1200px</p><div className="mt-3 rounded-[14px] overflow-hidden border-2 h-[260px] relative" style={{ background: themeGradient }}>{storeData.hero_image? <img src={storeData.hero_image} className="w-full h-full object-cover" alt="preview" /> : <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">No banner</div>}<div className="absolute inset-0 p-5 flex flex-col justify-center" style={{ background:`linear-gradient(to right, rgba(0,0,0,${(storeData.banner_overlay||55)/100}), transparent)` }}><p className="text-white font-black text-[18px] max-w-[60%]">{storeData.hero_title || "Title"}</p><span className="mt-3 px-4 py-2 bg-white text-black rounded-full text-[11px] font-black w-fit">{storeData.hero_cta_text || "Shop Now"} →</span></div></div></div>
            <div><p className="text-[11px] font-bold uppercase">Mobile - 390px</p><div className="mt-3 mx-auto max-w-[320px] rounded-[14px] overflow-hidden border-2 h-[420px] relative bg-slate-900">{(storeData.hero_mobile_image || storeData.hero_image)? <img src={storeData.hero_mobile_image || storeData.hero_image} className="w-full h-full object-cover" alt="mobile preview" /> : <div className="w-full h-full flex items-center justify-center text-white/60">No banner</div>}<div className="absolute inset-0 p-5 flex flex-col justify-center items-center text-center bg-gradient-to-t from-black/70 to-transparent"><p className="text-white font-black text-[16px]">{storeData.hero_title || "Title Mobile"}</p><span className="mt-4 px-5 py-2.5 bg-white text-black rounded-full text-[11px] font-black">{storeData.hero_cta_text || "Shop Now"} →</span></div></div></div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-[16px] border-2 bg-white space-y-6 shadow-sm">
        <h3 className="font-black text-[14px]">Banner Content - Title, Subtitle, CTA, Badges</h3>
        <div>
          <label className="text-[11px] font-black uppercase">Banner Title * - 70 chars max</label>
          <input value={storeData.hero_title || ""} onChange={e=>setStoreData({...storeData, hero_title:e.target.value})} maxLength={70} className="mt-2.5 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 focus:bg-white outline-none focus:border-slate-900 text-sm font-black" placeholder="Welcome to TAMID NEW FASHION - Trusted by 10k+ Customers" />
        </div>
        <div>
          <label className="text-[11px] font-black uppercase">Subtitle - 130 chars max</label>
          <input value={storeData.hero_subtitle || ""} onChange={e=>setStoreData({...storeData, hero_subtitle:e.target.value})} maxLength={130} className="mt-2.5 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 focus:bg-white outline-none focus:border-slate-900 text-sm" placeholder="100% Authentic • Fast Delivery • COD • 7 Days Return" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-[11px] font-black uppercase">CTA Button Text *</label><input value={storeData.hero_cta_text || ""} onChange={e=>setStoreData({...storeData, hero_cta_text:e.target.value})} className="mt-2.5 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 focus:bg-white text-sm font-black" placeholder="Shop Now" /><div className="mt-2 flex gap-1.5 flex-wrap">{ctaIdeas.map((cta,i)=><button key={i} onClick={()=>setStoreData({...storeData, hero_cta_text:cta})} className="text-[10px] px-2.5 py-1 rounded-full bg-white border-2 font-bold hover:bg-slate-900 hover:text-white">{cta}</button>)}</div></div>
          <div><label className="text-[11px] font-black uppercase">CTA Link</label><input value={storeData.hero_cta_link || "#products"} onChange={e=>setStoreData({...storeData, hero_cta_link:e.target.value})} className="mt-2.5 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 focus:bg-white text-sm font-bold" placeholder="#products" /></div>
        </div>
        <div>
          <label className="text-[11px] font-black uppercase">Trust Badges - 3 max</label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <input value={storeData.hero_badge1 || ""} onChange={e=>setStoreData({...storeData, hero_badge1:e.target.value})} className="px-3 py-3 rounded-[12px] border-2 bg-slate-50 text-xs font-bold" placeholder="✓ VERIFIED" />
            <input value={storeData.hero_badge2 || ""} onChange={e=>setStoreData({...storeData, hero_badge2:e.target.value})} className="px-3 py-3 rounded-[12px] border-2 bg-slate-50 text-xs font-bold" placeholder="TOP RATED • 4.9" />
            <input value={storeData.hero_badge3 || ""} onChange={e=>setStoreData({...storeData, hero_badge3:e.target.value})} className="px-3 py-3 rounded-[12px] border-2 bg-slate-50 text-xs font-bold" placeholder="FREE DELIVERY 999+" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm">
        <button onClick={()=>setShowAdvanced(!showAdvanced)} className="w-full flex justify-between items-center"><h3 className="font-black text-[14px]">Advanced Settings - Overlay, Height, Position</h3><span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${showAdvanced? "bg-slate-900 text-white" : "bg-white"}`}>{showAdvanced? "−" : "+"}</span></button>
        {showAdvanced && (
          <div className="mt-6 space-y-6 pt-6 border-t-2 border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-[11px] font-black uppercase">Overlay Opacity - 0-85% - 55% recommended</label><div className="mt-4 flex items-center gap-4"><input type="range" min="0" max="85" value={storeData.banner_overlay || 55} onChange={e=>setStoreData({...storeData, banner_overlay: e.target.value})} className="flex-1 accent-slate-900" /><span className="text-xs font-black px-4 py-2 rounded-full bg-slate-900 text-white">{storeData.banner_overlay || 55}%</span></div></div>
              <div><label className="text-[11px] font-black uppercase">Banner Height - 480px recommended</label><select value={storeData.banner_height || "480"} onChange={e=>setStoreData({...storeData, banner_height: e.target.value})} className="mt-4 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold">{bannerHeights.map(h=><option key={h.id} value={h.id}>{h.label} - {h.use}</option>)}</select></div>
            </div>
            <div><label className="text-[11px] font-black uppercase">Text Position - Left most converting</label><div className="mt-4 grid grid-cols-3 gap-3">{textPositions.map(pos=>{ const active = (storeData.banner_text_position || "left") === pos.id; return <button key={pos.id} onClick={()=>setStoreData({...storeData, banner_text_position: pos.id})} className={`p-4 rounded-[14px] border-2 text-left ${active? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-200"}`}><p className="text-xs font-black">{pos.label}</p><p className={`text-[11px] mt-2 ${active? "text-white/60" : "text-slate-500"}`}>{pos.desc}</p></button>})}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Show CTA Button</p><p className="text-[10px] text-slate-500">Recommended ON</p></div><button onClick={()=>setStoreData({...storeData, banner_show_button: storeData.banner_show_button===false? true :!storeData.banner_show_button})} className={`w-12 h-7 rounded-full p-1 ${storeData.banner_show_button!==false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.banner_show_button!==false? "translate-x-5" : ""}`}></div></button></div>
              <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Show Badges</p><p className="text-[10px] text-slate-500">Trust +30%</p></div><button onClick={()=>setStoreData({...storeData, banner_show_badges: storeData.banner_show_badges===false? true :!storeData.banner_show_badges})} className={`w-12 h-7 rounded-full p-1 ${storeData.banner_show_badges!==false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.banner_show_badges!==false? "translate-x-5" : ""}`}></div></button></div>
              <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Parallax Effect</p><p className="text-[10px] text-slate-500">Premium feel</p></div><button onClick={()=>setStoreData({...storeData, banner_parallax:!storeData.banner_parallax})} className={`w-12 h-7 rounded-full p-1 ${storeData.banner_parallax? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.banner_parallax? "translate-x-5" : ""}`}></div></button></div>
            </div>
            <div><label className="text-[11px] font-black uppercase">Second Banner - Optional - Below products - 1200x300</label><input type="file" accept="image/*" onChange={onSecondBannerUpload} className="mt-2 w-full text-xs file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-white file:border-2 file:font-bold border-2 border-dashed rounded-xl p-2 bg-slate-50" /><div className="mt-3 rounded-xl overflow-hidden border bg-slate-50 h-[80px] flex items-center justify-center">{storeData.second_banner? <img src={storeData.second_banner} className="w-full h-full object-cover" alt="second" /> : <span className="text-xs text-slate-400">No second banner - Optional</span>}</div></div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleBannerSave} disabled={saving} className="w-full py-5 rounded-[14px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] flex items-center justify-center gap-3 text-sm">
          {saving? "Saving..." : `Save Banner - ${bannerScore}/100 - Live on Store`}
        </button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.includes("✅")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}