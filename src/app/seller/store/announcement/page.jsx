"use client";
import { useStore } from "../layout";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AnnouncementPage() {
  const { storeData, setStoreData } = useStore();
  const [activeTab, setActiveTab] = useState("content");
  const [previewAnimate, setPreviewAnimate] = useState(true);
  const [countdown, setCountdown] = useState({ h: 14, m: 23, s: 45 });
  const [showSchedule, setShowSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

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
      if (!sellerId) throw new Error("Seller ID not found! Refresh and login again.");

      const payload = {
        show_announcement: storeData.show_announcement!== false,
        announcement_enabled: storeData.show_announcement!== false,
        announcement_text: storeData.announcement_text || null,
        announcement_bar_text: storeData.announcement_text || null,
        announcement_icon: storeData.announcement_icon || null,
        announcement_link: storeData.announcement_link || null,
        announcement_second_line: storeData.announcement_second_line || null,
        announcement_style: storeData.announcement_style || "gradient",
        announcement_bg_color: storeData.announcement_bg_color || null,
        announcement_text_color: storeData.announcement_text_color || "white",
        announcement_animation: storeData.announcement_animation || "none",
        announcement_closable: storeData.announcement_closable!== false,
        announcement_all_pages: storeData.announcement_all_pages!== false,
        announcement_sticky: storeData.announcement_sticky!== false,
        announcement_show_timer:!!storeData.announcement_show_timer,
        announcement_timer_end: storeData.announcement_timer_end || null,
        show_coupon_in_bar:!!storeData.show_coupon_in_bar,
        coupon_code: storeData.coupon_code || null,
        coupon_discount: storeData.coupon_discount || null,
        coupon_expiry: storeData.coupon_expiry || null,
        holiday_mode:!!storeData.holiday_mode,
        vacation_message: storeData.vacation_message || null,
        vacation_start_date: storeData.vacation_start_date || null,
        vacation_return_date: storeData.vacation_return_date || null,
        vacation_disable_checkout:!!storeData.vacation_disable_checkout,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('sellers').update(payload).eq('id', sellerId);
      if (error) throw error;

      setSaveMsg("✅ Announcement Bar Saved - Live on Store!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.log("SAVE ERROR:", err);
      setSaveMsg("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev; s--;
        if(s<0){ s=59; m--; if(m<0){ m=59; h--; if(h<0) h=23; } }
        return { h,m,s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const templates = [
    { text: "🎉 Free Delivery on 999+ TK Order | 7 Days Easy Return | 100% Authentic", icon: "🎉", category: "Free Delivery - Best converting", best: true, ctr: "+22% Conversion" },
    { text: "⚡ Eid Offer - 25% OFF | Code: EID25 | Ends Tonight", icon: "⚡", category: "Eid Sale - Urgency", best: true, ctr: "+35% CTR during Eid" },
    { text: "🚚 Same Day Delivery in Rajshahi | Cash on Delivery | Order Before 2PM", icon: "🚚", category: "Local Delivery", best: true, ctr: "+25% Rajshahi" },
    { text: "🔥 Flash Sale Live - Up to 60% OFF | Limited Time - Ends in 2 Hours", icon: "🔥", category: "Flash Sale", best: true, ctr: "+40% CTR" },
    { text: "🎁 Buy 2 Get 1 Free + Free Delivery 1499+ TK", icon: "🎁", category: "BOGO Offer", best: false, ctr: "+30% AOV" },
    { text: "✅ 100% Authentic Guarantee | Trusted by 10k+ Customers | 4.9 Rating", icon: "✅", category: "Trust - New Stores", best: false, ctr: "+18% Trust" },
    { text: "📦 New Arrivals - 50 New Products Added Today", icon: "📦", category: "New Arrivals", best: false, ctr: "+15% Freshness" },
    { text: "💳 bKash Payment - 10% Extra OFF + Free Delivery", icon: "💳", category: "Payment Offer", best: false, ctr: "+12% bKash" },
    { text: "⭐ Top Rated Seller - 4.9 Rating - 500+ Orders Delivered", icon: "⭐", category: "Social Proof", best: false, ctr: "+20% Social proof" },
  ];

  const barStyles = [
    { id: "gradient", name: "Gradient - Recommended", bg: `linear-gradient(90deg, ${storeData.accent_color || "#f59e0b"}, ${storeData.secondary_color || "#3b82f6"})`, desc: "Most modern - Recommended", best: true },
    { id: "solid", name: "Solid Black - Professional", bg: "#0f172a", desc: "Professional - Trust", best: false },
    { id: "accent", name: "Accent Color", bg: storeData.accent_color || "#f59e0b", desc: "Your brand color", best: false },
    { id: "red", name: "Urgent Red - Sale", bg: "linear-gradient(90deg, #ef4444, #dc2626)", desc: "Urgency - Sale", best: true },
    { id: "green", name: "Success Green", bg: "linear-gradient(90deg, #10b981, #059669)", desc: "Free delivery, success", best: false },
    { id: "blue", name: "Trust Blue", bg: "linear-gradient(90deg, #3b82f6, #1d4ed8)", desc: "Trust, corporate", best: false },
    { id: "purple", name: "Purple - Fashion", bg: "linear-gradient(90deg, #7c3aed, #5b21b6)", desc: "Fashion - Trendy", best: false },
    { id: "orange", name: "Orange", bg: "linear-gradient(90deg, #f97316, #ea580c)", desc: "Food, energetic", best: false },
  ];

  const animations = [
    { id: "none", name: "Static - Recommended", desc: "Clean - No animation - Professional" },
    { id: "slide", name: "Slide In", desc: "Slides from top on load" },
    { id: "marquee", name: "Marquee - Scrolling", desc: "Scrolling text - Attention" },
    { id: "pulse", name: "Pulse - Blinking", desc: "Blinks - Urgency - Flash sale" },
    { id: "bounce", name: "Bounce", desc: "Emoji bounce - Playful" },
    { id: "shimmer", name: "Shimmer", desc: "Shine effect - Premium" },
  ];

  const announcementScore = useMemo(() => {
    let s=0;
    if(storeData.show_announcement) s+=20;
    if(storeData.announcement_text && storeData.announcement_text.length>=20) s+=25;
    if(storeData.announcement_text?.length >= 30 && storeData.announcement_text?.length <= 75) s+=15;
    if(storeData.announcement_style) s+=10;
    if(storeData.coupon_code && storeData.show_coupon_in_bar) s+=15;
    if(storeData.announcement_show_timer) s+=10;
    if(storeData.announcement_icon) s+=5;
    return Math.min(s,100);
  }, [storeData]);

  const currentBg = storeData.announcement_bg_color || barStyles.find(s=>s.id===(storeData.announcement_style || "gradient"))?.bg || barStyles[0].bg;

  return (
    <div className="space-y-6 max-w-4xl pb-24">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2">Announcement Bar <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border font-black">+18% Conversion</span></h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Top offer bar - First thing customer sees - Drives 18% conversion - Use for free delivery, flash sale, trust</p>
        </div>
        <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${announcementScore>=80? "bg-green-50 text-green-700 border-green-200" : announcementScore>=50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{announcementScore}/100</div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between"><p className="text-[11px] font-black uppercase text-slate-500">Effectiveness</p><p className="text-xs font-black">{announcementScore}%</p></div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${announcementScore>=80? "bg-green-500" : announcementScore>=50? "bg-amber-500" : "bg-slate-900"}`} style={{ width:`${announcementScore}%` }}></div></div>
        <div className="mt-4 grid grid-cols-7 gap-2 text-[10px]">
          {[{ label:"Enabled", done:!!storeData.show_announcement },{ label:"20+ chars", done:!!storeData.announcement_text && storeData.announcement_text.length>=20 },{ label:"Ideal 30-75", done:!!storeData.announcement_text && storeData.announcement_text.length>=30 && storeData.announcement_text.length<=75 },{ label:"Style", done:!!storeData.announcement_style },{ label:"Coupon", done:!!storeData.coupon_code && storeData.show_coupon_in_bar },{ label:"Timer", done:!!storeData.announcement_show_timer },{ label:"Icon", done:!!storeData.announcement_icon }].map((s,i)=>(
            <div key={i} className={`p-2.5 rounded-xl border-2 text-center ${s.done? "bg-green-50 border-green-200" : "bg-slate-50"}`}><p>{s.done? "✓" : "○"}</p><p className="text-[9px] font-bold mt-1">{s.label}</p></div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-20">
        <button onClick={()=>setActiveTab("content")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="content"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>CONTENT</button>
        <button onClick={()=>setActiveTab("style")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="style"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>STYLE</button>
        <button onClick={()=>setActiveTab("coupon")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="coupon"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>COUPON + TIMER</button>
        <button onClick={()=>setActiveTab("vacation")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="vacation"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>VACATION</button>
      </div>

      <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex gap-4"><div className="w-12 h-12 rounded-[14px] bg-slate-900 flex items-center justify-center text-white text-xl">📢</div><div><p className="text-[14px] font-black">Show Announcement Bar - +18% Conversion</p><p className="text-xs text-slate-500 mt-1">First thing customer sees - Free delivery message +22% conversion</p></div></div>
          <button onClick={()=>setStoreData({...storeData, show_announcement:!storeData.show_announcement})} className={`w-14 h-8 rounded-full p-1 transition-all ${storeData.show_announcement? "bg-slate-900" : "bg-slate-200"}`}><div className={`w-6 h-6 rounded-full bg-white shadow-md transition-all ${storeData.show_announcement? "translate-x-6" : ""}`}></div></button>
        </div>
      </div>

      {activeTab === "content" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
            <h3 className="font-black text-[14px]">Quick Templates - Click to Apply</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {templates.map((t,i)=>{
                const active = storeData.announcement_text===t.text;
                return (
                  <button key={i} onClick={()=>setStoreData({...storeData, announcement_text: t.text, announcement_icon: t.icon})} className={`text-left p-4 rounded-[14px] border-2 text-xs font-bold flex items-center gap-3 ${active? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-900"}`}>
                    <span className="w-10 h-10 rounded-xl bg-white border-2 flex items-center justify-center text-lg shrink-0">{t.icon}</span>
                    <div className="flex-1 min-w-0"><p className="truncate">{t.text}</p><div className="flex gap-2 mt-1"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-slate-600">{t.category}</span><span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${t.best? "bg-green-500 text-white" : "bg-slate-100"}`}>{t.ctr}</span></div></div>
                    {active && <span className="text-[10px] px-3 py-1 rounded-full bg-white text-black font-black">✓ SELECTED</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
            <div>
              <label className="text-[11px] font-black uppercase">Announcement Text * - 90 chars max - Under 75 for mobile</label>
              <div className="mt-3 relative">
                <input value={storeData.announcement_text || ""} onChange={e=>setStoreData({...storeData, announcement_text:e.target.value})} maxLength={95} className="w-full px-4 py-5 rounded-[12px] border-2 bg-slate-50 focus:bg-white focus:border-slate-900 font-bold text-sm pr-24" placeholder="🎉 Free Delivery on 999+ TK Order | 7 Days Easy Return" />
                <span className="absolute right-2 top-2 bottom-2 flex items-center text-[11px] px-3 py-1 rounded-full border-2 font-bold bg-white">{(storeData.announcement_text || "").length}/90</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-black uppercase">Icon Emoji</label><input value={storeData.announcement_icon || "🎉"} onChange={e=>setStoreData({...storeData, announcement_icon:e.target.value.slice(0,2)})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-center text-lg font-black" maxLength={2} /></div>
              <div><label className="text-[11px] font-black uppercase">Link - Optional</label><input value={storeData.announcement_link || ""} onChange={e=>setStoreData({...storeData, announcement_link:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold" placeholder="/sale or #products" /></div>
              <div><label className="text-[11px] font-black uppercase">Second Line - Optional</label><input value={storeData.announcement_second_line || ""} onChange={e=>setStoreData({...storeData, announcement_second_line:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="Code: EID25 - Ends Tonight" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "style" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Bar Style & Color - 8 Styles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {barStyles.map(s=>{
              const isActive = (storeData.announcement_style || "gradient") === s.id;
              return (
                <button key={s.id} onClick={()=>setStoreData({...storeData, announcement_style: s.id, announcement_bg_color:""})} className={`relative p-3 rounded-[14px] border-2 text-left ${isActive? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white hover:border-slate-900"}`}>
                  <div className="h-14 rounded-xl w-full" style={{ background: s.bg }}></div>
                  <p className="text-[12px] font-black mt-3">{s.name}</p><p className="text-[10px] text-slate-500 mt-1">{s.desc}</p>
                  {isActive && <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="text-[11px] font-black uppercase">Custom Background Color - Optional</label><div className="mt-2 flex items-center gap-3 p-2 rounded-xl border-2 bg-slate-50"><input type="color" value={storeData.announcement_bg_color || "#f59e0b"} onChange={e=>setStoreData({...storeData, announcement_bg_color: e.target.value})} className="w-12 h-12 rounded-xl border-2 p-1 bg-white" /><input value={storeData.announcement_bg_color || ""} onChange={e=>setStoreData({...storeData, announcement_bg_color: e.target.value})} className="flex-1 bg-transparent outline-none text-sm font-mono font-bold" placeholder="#f59e0b or gradient" /></div></div>
            <div><label className="text-[11px] font-black uppercase">Text Color</label><select value={storeData.announcement_text_color || "white"} onChange={e=>setStoreData({...storeData, announcement_text_color:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold"><option value="white">White - Recommended</option><option value="black">Black - Light bg</option></select></div>
          </div>
          <div><label className="text-[11px] font-black uppercase">Animation - Static recommended</label><div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">{animations.map(a=>{ const active = (storeData.announcement_animation || "none") === a.id; return <button key={a.id} onClick={()=>setStoreData({...storeData, announcement_animation: a.id})} className={`p-3 rounded-xl border-2 text-left ${active? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-100"}`}><p className="text-xs font-black">{a.name}</p><p className="text-[10px] mt-1 opacity-70">{a.desc}</p></button>})}</div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Closable</p><p className="text-[10px] text-slate-500">User can close - X button</p></div><button onClick={()=>setStoreData({...storeData, announcement_closable:!storeData.announcement_closable})} className={`w-12 h-7 rounded-full p-1 ${storeData.announcement_closable!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.announcement_closable!== false? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Show on all pages</p><p className="text-[10px] text-slate-500">Not just homepage</p></div><button onClick={()=>setStoreData({...storeData, announcement_all_pages: storeData.announcement_all_pages!== false? false : true})} className={`w-12 h-7 rounded-full p-1 ${storeData.announcement_all_pages!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.announcement_all_pages!== false? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Sticky top</p><p className="text-[10px] text-slate-500">Stays when scrolling</p></div><button onClick={()=>setStoreData({...storeData, announcement_sticky: storeData.announcement_sticky!== false? false : true})} className={`w-12 h-7 rounded-full p-1 ${storeData.announcement_sticky!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.announcement_sticky!== false? "translate-x-5" : ""}`}></div></button></div>
          </div>
        </div>
      )}

      {activeTab === "coupon" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
            <h3 className="font-black text-[14px]">Coupon in Bar - +12% Conversion - Show code inside bar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-black uppercase">Coupon Code</label><input value={storeData.coupon_code || ""} onChange={e=>setStoreData({...storeData, coupon_code:e.target.value.toUpperCase()})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-black tracking-widest" placeholder="WELCOME10" /></div>
              <div><label className="text-[11px] font-black uppercase">Discount Text</label><input value={storeData.coupon_discount || ""} onChange={e=>setStoreData({...storeData, coupon_discount:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold" placeholder="10% OFF" /></div>
              <div><label className="text-[11px] font-black uppercase">Expiry - Urgency</label><input value={storeData.coupon_expiry || ""} onChange={e=>setStoreData({...storeData, coupon_expiry:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold" placeholder="Ends Tonight 11:59PM" /></div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-[14px] bg-amber-50 border-2 border-amber-200"><p className="text-xs font-black">Show coupon inside bar - Code + Discount</p><button onClick={()=>setStoreData({...storeData, show_coupon_in_bar:!storeData.show_coupon_in_bar})} className={`w-14 h-8 rounded-full p-1 ${storeData.show_coupon_in_bar? "bg-amber-500" : "bg-slate-300"}`}><div className={`w-6 h-6 rounded-full bg-white transition ${storeData.show_coupon_in_bar? "translate-x-6" : ""}`}></div></button></div>
          </div>
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
            <div className="flex justify-between"><h3 className="font-black text-[14px]">Countdown Timer - +35% Urgency</h3><button onClick={()=>setShowSchedule(!showSchedule)} className="text-[11px] px-4 py-2 rounded-full bg-slate-50 border-2 font-bold">{showSchedule? "Hide" : "Schedule 📅"}</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-[14px] bg-slate-50 border-2"><div><p className="text-xs font-bold">Enable Countdown Timer</p><p className="text-[10px] text-slate-500">Urgency - Ends in 02:14:33</p></div><button onClick={()=>setStoreData({...storeData, announcement_show_timer:!storeData.announcement_show_timer})} className={`w-14 h-8 rounded-full p-1 ${storeData.announcement_show_timer? "bg-red-500" : "bg-slate-300"}`}><div className={`w-6 h-6 rounded-full bg-white transition ${storeData.announcement_show_timer? "translate-x-6" : ""}`}></div></button></div>
              <div><label className="text-[11px] font-black uppercase">Timer End Date</label><input type="datetime-local" value={storeData.announcement_timer_end || ""} onChange={e=>setStoreData({...storeData, announcement_timer_end:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-slate-50 text-sm font-bold" /></div>
            </div>
            <div className="p-5 rounded-[14px] border-2 bg-slate-50">
              <p className="text-[11px] font-black uppercase">Live Timer Preview</p>
              <div className="mt-4 p-4 rounded-xl text-center text-sm font-black text-white flex items-center justify-center gap-3" style={{ background: currentBg }}>
                <span>{storeData.announcement_icon || "🔥"}</span><span>{storeData.announcement_text?.slice(0,30) || "Flash Sale Live"}</span><span className="px-3 py-1 rounded-full bg-black/20 border text-xs font-mono">⏰ {String(countdown.h).padStart(2,"0")}:{String(countdown.m).padStart(2,"0")}:{String(countdown.s).padStart(2,"0")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "vacation" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Holiday / Vacation Mode - Pause Store</h3>
          <label className="flex gap-4 items-center p-5 bg-slate-50 border-2 rounded-[14px] cursor-pointer">
            <input type="checkbox" checked={storeData.holiday_mode || false} onChange={e=>setStoreData({...storeData, holiday_mode:e.target.checked})} className="w-6 h-6" />
            <div><p className="text-sm font-black">Enable Vacation Mode - Pause Store</p><p className="text-xs text-slate-600 mt-1">Checkout disabled - Customers browse only - Prevents negative reviews during vacation</p></div>
          </label>
          {storeData.holiday_mode && (
            <div className="space-y-5 p-5 rounded-[14px] bg-orange-50 border-2 border-orange-200">
              <div><label className="text-[11px] font-black uppercase">Vacation Message *</label><textarea value={storeData.vacation_message || ""} onChange={e=>setStoreData({...storeData, vacation_message:e.target.value})} className="mt-2 w-full px-4 py-4 rounded-[12px] border-2 bg-white text-sm" rows={4} placeholder="We are on vacation from 10-15 April - Back on 16 April - Orders ship after 16 April" /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-[11px] font-bold uppercase">Start Date</label><input type="date" value={storeData.vacation_start_date || ""} onChange={e=>setStoreData({...storeData, vacation_start_date:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-[12px] border-2 bg-white text-sm font-bold" /></div>
                <div><label className="text-[11px] font-bold uppercase">Return Date *</label><input type="date" value={storeData.vacation_return_date || ""} onChange={e=>setStoreData({...storeData, vacation_return_date:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-[12px] border-2 bg-white text-sm font-bold" /></div>
                <div><label className="text-[11px] font-bold uppercase">Disable Checkout?</label><div className="mt-2 p-3.5 rounded-xl bg-white border-2 flex justify-between items-center"><span className="text-xs font-bold">Pause orders</span><button onClick={()=>setStoreData({...storeData, vacation_disable_checkout:!storeData.vacation_disable_checkout})} className={`w-12 h-7 rounded-full p-1 ${storeData.vacation_disable_checkout!== false? "bg-orange-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.vacation_disable_checkout!== false? "translate-x-5" : ""}`}></div></button></div></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6 rounded-[16px] border-2 bg-slate-900 text-white shadow-lg">
        <p className="text-[11px] font-black uppercase opacity-60">Live Preview - How customers see it</p>
        <div className="mt-4 p-4 rounded-[14px] text-center text-sm font-black flex items-center justify-center gap-3 flex-wrap" style={{ background: currentBg, color: storeData.announcement_text_color === "black"? "black" : "white" }}>
          <span>{storeData.announcement_icon || "🎉"}</span><span className="truncate max-w-[400px]">{storeData.announcement_text || "Your announcement will appear here"}</span>
          {storeData.show_coupon_in_bar && storeData.coupon_code && <span className="px-3 py-1 rounded-full bg-black/20 border border-white/20 text-[11px]">CODE: {storeData.coupon_code}</span>}
          {storeData.announcement_show_timer && <span className="px-3 py-1.5 rounded-full bg-black/20 border border-white/20 font-mono text-xs">⏰ {String(countdown.h).padStart(2,"0")}:{String(countdown.m).padStart(2,"0")}:{String(countdown.s).padStart(2,"0")}</span>}
        </div>
        <p className="text-[10px] opacity-50 mt-3 text-center">Keep under 75 chars for 1 line on mobile - Use emoji for 2x attention - Free delivery +22% conversion</p>
      </div>

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[14px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">{saving? "Saving..." : `Save Announcement Bar - ${announcementScore}/100 - Live`}</button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.includes("✅")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}