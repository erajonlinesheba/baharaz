"use client";
import { useStore } from "../layout";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SocialPage() {
  const { storeData, setStoreData } = useStore();
  const [activeTab, setActiveTab] = useState("contact");
  const [showQr, setShowQr] = useState(false);
  const [testMessage, setTestMessage] = useState("Assalamu Alaikum! Product price koto?");
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
      if (!sellerId) throw new Error("Seller ID not found! Please refresh and login again.");

      // ONLY SOCIAL & CONTACT FIELDS - NO cod_min_order, NO default_weight
      const payload = {
        phone: storeData.phone || null,
        whatsapp_number: storeData.whatsapp_number || storeData.whatsapp || null,
        whatsapp: storeData.whatsapp_number || storeData.whatsapp || null,
        email: storeData.email || null,
        address: storeData.address || storeData.full_address || null,
        full_address: storeData.full_address || storeData.address || null,
        district: storeData.district || null,
        thana: storeData.thana || null,
        postal_code: storeData.postal_code || null,
        business_hours: storeData.business_hours || null,
        response_time: storeData.response_time || null,
        google_maps_url: storeData.google_maps_url || null,
        facebook_url: storeData.facebook_url || null,
        instagram_url: storeData.instagram_url || null,
        tiktok_url: storeData.tiktok_url || null,
        youtube_url: storeData.youtube_url || null,
        whatsapp_channel_url: storeData.whatsapp_channel_url || null,
        telegram_url: storeData.telegram_url || null,
        linkedin_url: storeData.linkedin_url || null,
        website_url: storeData.website_url || null,
        messenger_url: storeData.messenger_url || null,
        whatsapp_prefilled: storeData.whatsapp_prefilled || null,
        auto_message: storeData.auto_message || null,
        quick_replies: storeData.quick_replies || null,
        away_message: storeData.away_message || null,
        enable_chat_widget: storeData.enable_chat_widget!== false,
        show_whatsapp_float: storeData.show_whatsapp_float!== false,
        updated_at: new Date().toISOString(),
      };

      Object.keys(payload).forEach(k => { if (payload[k] === undefined) delete payload[k]; });

      const { error } = await supabase.from('sellers').update(payload).eq('id', sellerId);
      if (error) throw error;

      setSaveMsg("✅ Social & Contact Saved - Live on Store!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.log("SAVE ERROR:", JSON.stringify(err, null, 2));
      setSaveMsg("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const socialPlatforms = [
    { id: "facebook", name: "Facebook Page", icon: "📘", color: "bg-[#1877F2]", placeholder: "https://facebook.com/yourpage", field: "facebook_url", note: "80% BD customers check FB page before buying - Must have" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-gradient-to-br from-purple-600 to-pink-500", placeholder: "https://instagram.com/yourshop", field: "instagram_url", note: "Fashion 60% check Insta" },
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-black", placeholder: "https://tiktok.com/@yourshop", field: "tiktok_url", note: "Viral - Young customers" },
    { id: "youtube", name: "YouTube", icon: "▶️", color: "bg-red-600", placeholder: "https://youtube.com/@yourshop", field: "youtube_url", note: "Review videos - Trust 50%" },
    { id: "whatsapp_channel", name: "WhatsApp Channel", icon: "💬", color: "bg-[#25D366]", placeholder: "https://whatsapp.com/channel/xxx", field: "whatsapp_channel_url", note: "Broadcast offers" },
    { id: "telegram", name: "Telegram", icon: "✈️", color: "bg-[#0088cc]", placeholder: "https://t.me/yourshop", field: "telegram_url", note: "For offers" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-[#0A66C2]", placeholder: "https://linkedin.com/company/yourshop", field: "linkedin_url", note: "B2B - Optional" },
    { id: "website", name: "Website", icon: "🌐", color: "bg-slate-900", placeholder: "https://yourshop.com", field: "website_url", note: "If you have own website" },
  ];

  const contactCompletion = useMemo(() => {
    let done = 0;
    if(storeData.phone) done++;
    if(storeData.whatsapp_number) done++;
    if(storeData.address) done++;
    if(storeData.facebook_url) done++;
    if(storeData.instagram_url) done++;
    if(storeData.email) done++;
    return { done, total: 6, percent: Math.round(done/6*100) };
  }, [storeData]);

  const getWhatsAppLink = (number, message) => {
    const clean = (number || "").replace(/[^0-9]/g, "");
    const bdNumber = clean.startsWith("88")? clean : clean.startsWith("01")? `88${clean}` : clean;
    const encoded = encodeURIComponent(message || `Assalamu Alaikum! I want to know about ${storeData.shop_name || "your products"}. Link: https://baharaz.com/store/${storeData.shop_slug || ""}`);
    return `https://wa.me/${bdNumber}?text=${encoded}`;
  };

  return (
    <div className="space-y-6 max-w-3xl pb-24">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2">Social & Contact <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border font-bold">Trust +50%</span></h1>
          <p className="text-xs text-slate-500 mt-2">Phone, WhatsApp, address, social links - Shown on store - Required for verified badge</p>
        </div>
        <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${contactCompletion.percent >= 80? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{contactCompletion.done}/{contactCompletion.total} - {contactCompletion.percent}%</div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between"><p className="text-[11px] font-black uppercase text-slate-500">Contact Trust Score</p><p className="text-xs font-black">{contactCompletion.percent}%</p></div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${contactCompletion.percent >= 80? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${contactCompletion.percent}%` }}></div></div>
        <div className="mt-4 grid grid-cols-6 gap-2 text-[10px]">
          {[{ label: "Phone", done:!!storeData.phone },{ label: "WhatsApp", done:!!storeData.whatsapp_number },{ label: "Address", done:!!storeData.address },{ label: "Facebook", done:!!storeData.facebook_url },{ label: "Insta", done:!!storeData.instagram_url },{ label: "Email", done:!!storeData.email }].map((s,i) => (
            <div key={i} className={`p-2.5 rounded-xl border-2 text-center ${s.done? "bg-green-50 border-green-200" : "bg-slate-50"}`}><p>{s.done? "✓" : "○"}</p><p className="text-[9px] font-bold mt-1">{s.label}</p></div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10">
        <button onClick={()=>setActiveTab("contact")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="contact"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>CONTACT</button>
        <button onClick={()=>setActiveTab("social")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="social"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>SOCIAL - FB / INSTA</button>
        <button onClick={()=>setActiveTab("chat")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="chat"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>CHAT - AUTO REPLY</button>
      </div>

      {activeTab === "contact" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Contact Information - Shown on store header, footer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[14px] border-2 bg-slate-50">
                <label className="text-[11px] font-black uppercase">Phone Number - Main *</label>
                <input value={storeData.phone || ""} onChange={e=>setStoreData({...storeData, phone:e.target.value.replace(/[^0-9+]/g,"").slice(0,15)})} placeholder="01XXXXXXXXX" className="mt-3 w-full px-4 py-4 rounded-xl border-2 bg-white text-sm font-black" />
                <div className="mt-3 flex gap-2"><a href={`tel:${storeData.phone || ""}`} className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black text-center">📞 Test Call</a><button onClick={()=>setStoreData({...storeData, whatsapp_number: storeData.phone})} className="flex-1 py-2.5 rounded-xl bg-green-50 border-2 text-green-700 text-[11px] font-black">Copy to WhatsApp →</button></div>
              </div>
              <div className="p-4 rounded-[14px] border-2 bg-green-50 border-green-200">
                <label className="text-[11px] font-black uppercase">WhatsApp Number * - 60% orders via WA</label>
                <input value={storeData.whatsapp_number || ""} onChange={e=>setStoreData({...storeData, whatsapp_number:e.target.value.replace(/[^0-9+]/g,"").slice(0,15)})} placeholder="01XXXXXXXXX" className="mt-3 w-full px-4 py-4 rounded-xl border-2 bg-white text-sm font-black" />
                <div className="mt-3 grid grid-cols-2 gap-2"><a href={getWhatsAppLink(storeData.whatsapp_number || storeData.phone, testMessage)} target="_blank" className="py-2.5 rounded-xl bg-[#25D366] text-white text-[11px] font-black text-center">💬 Test WhatsApp</a><button onClick={()=>setShowQr(!showQr)} className="py-2.5 rounded-xl bg-white border-2 text-green-700 text-[11px] font-black">QR {showQr? "▲" : "▼"}</button></div>
                {showQr && <div className="mt-4 p-4 rounded-xl bg-white border-2 border-dashed text-center"><div className="w-32 h-32 mx-auto bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-mono">QR<br/>WA.ME/{(storeData.whatsapp_number||"").slice(-11)}</div><p className="text-[10px] mt-2 font-mono">{getWhatsAppLink(storeData.whatsapp_number, "")}</p></div>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-black uppercase">Email</label><input value={storeData.email || ""} onChange={e=>setStoreData({...storeData, email:e.target.value})} placeholder="yourshop@gmail.com" className="mt-3 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div>
              <div><label className="text-[11px] font-black uppercase">Business Hours</label><select value={storeData.business_hours || "9am-10pm"} onChange={e=>setStoreData({...storeData, business_hours:e.target.value})} className="mt-3 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="9am-10pm">9AM - 10PM - Standard</option><option value="24h">24 Hours</option><option value="10am-8pm">10AM - 8PM</option></select></div>
            </div>
            <div><label className="text-[11px] font-black uppercase">Full Address *</label><input value={storeData.address || ""} onChange={e=>setStoreData({...storeData, address:e.target.value})} placeholder="Shop: TAMID, Shaheb Bazar, Rajshahi-6000" className="mt-3 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm" /><textarea value={storeData.full_address || storeData.address || ""} onChange={e=>setStoreData({...storeData, full_address:e.target.value, address:e.target.value})} rows={3} className="mt-3 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="Full address with thana, district" /><div className="mt-3 grid grid-cols-3 gap-3"><input value={storeData.district || "Rajshahi"} onChange={e=>setStoreData({...storeData, district:e.target.value})} placeholder="District" className="px-3 py-3 rounded-xl border-2 bg-slate-50 text-sm font-bold" /><input value={storeData.thana || ""} onChange={e=>setStoreData({...storeData, thana:e.target.value})} placeholder="Thana" className="px-3 py-3 rounded-xl border-2 bg-slate-50 text-sm" /><input value={storeData.postal_code || ""} onChange={e=>setStoreData({...storeData, postal_code:e.target.value})} placeholder="Postal Code" className="px-3 py-3 rounded-xl border-2 bg-slate-50 text-sm" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="text-[11px] font-black uppercase">Google Maps Link</label><input value={storeData.google_maps_url || ""} onChange={e=>setStoreData({...storeData, google_maps_url:e.target.value})} placeholder="https://maps.app.goo.gl/xxxx" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div><div><label className="text-[11px] font-black uppercase">Response Time</label><select value={storeData.response_time || "30min"} onChange={e=>setStoreData({...storeData, response_time:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="5min">5 Minutes - Very Fast</option><option value="30min">30 Minutes - Fast</option><option value="2h">2 Hours</option></select></div></div>
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Social Links - Facebook, Instagram, TikTok - Trust +50%</h3>
          <div className="space-y-3">
            {socialPlatforms.map(platform => {
              const value = storeData[platform.field] || ""; const hasValue =!!value;
              return (
                <div key={platform.id} className={`p-4 rounded-[14px] border-2 ${hasValue? "bg-white border-slate-900" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex justify-between items-center"><div className="flex gap-3 items-center"><div className={`w-11 h-11 rounded-xl ${platform.color} text-white flex items-center justify-center text-lg`}>{platform.icon}</div><div><p className="font-black text-sm">{platform.name}</p><p className="text-[11px] text-slate-500">{platform.note}</p></div></div><span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${hasValue? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100"}`}>{hasValue? "ON" : "OFF"}</span></div>
                  <div className="mt-3 flex gap-2"><input value={value} onChange={e=>setStoreData({...storeData, [platform.field]: e.target.value})} placeholder={platform.placeholder} className="flex-1 px-4 py-3 rounded-xl border-2 bg-white text-sm" />{value && <button onClick={()=>setStoreData({...storeData, [platform.field]: ""})} className="px-4 py-3 rounded-xl bg-red-50 border-2 text-red-700 text-xs font-bold">Clear ✕</button>}</div>
                </div>
              )
            })}
          </div>
          <div className="p-5 rounded-[14px] border-2 bg-white">
            <p className="text-[11px] font-black uppercase text-slate-500">Preview - Footer social icons</p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border-2 flex flex-wrap gap-2">{socialPlatforms.filter(p => storeData[p.field]).length === 0? <p className="text-xs text-slate-400">No social links - Add Facebook at least</p> : socialPlatforms.filter(p => storeData[p.field]).map(p => (<a key={p.id} href={storeData[p.field]} target="_blank" className={`px-4 py-2.5 rounded-full ${p.color} text-white text-xs font-black`}>{p.icon} {p.name}</a>))}</div>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Chat & Auto Reply - Messenger + WhatsApp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-black uppercase">Facebook Messenger URL</label><input value={storeData.messenger_url || ""} onChange={e=>setStoreData({...storeData, messenger_url:e.target.value})} placeholder="https://m.me/yourpage" className="mt-3 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div>
            <div><label className="text-[11px] font-black uppercase">WhatsApp Pre-filled Message</label><input value={storeData.whatsapp_prefilled || ""} onChange={e=>setStoreData({...storeData, whatsapp_prefilled:e.target.value})} placeholder="Assalamu Alaikum! I want to know about..." className="mt-3 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div>
          </div>
          <div><label className="text-[11px] font-black uppercase">Auto Reply Message - When offline</label><textarea value={storeData.auto_message || ""} onChange={e=>setStoreData({...storeData, auto_message:e.target.value})} rows={5} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="Assalamu Alaikum! Thanks for visiting..." /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-black uppercase">Quick Replies - Comma separated</label><textarea value={storeData.quick_replies || ""} onChange={e=>setStoreData({...storeData, quick_replies:e.target.value})} rows={3} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="Delivery time?, Return policy?, COD?" /></div>
            <div><label className="text-[11px] font-black uppercase">Away Message</label><textarea value={storeData.away_message || ""} onChange={e=>setStoreData({...storeData, away_message:e.target.value})} rows={3} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="We are offline - Will reply within 30min" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Enable Chat Widget</p><p className="text-[10px] text-slate-500">On store bottom right</p></div><button onClick={()=>setStoreData({...storeData, enable_chat_widget:!storeData.enable_chat_widget})} className={`w-12 h-7 rounded-full p-1 ${storeData.enable_chat_widget!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.enable_chat_widget!== false? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Show WhatsApp Floating Button</p><p className="text-[10px] text-slate-500">Best for BD - 60% click WA</p></div><button onClick={()=>setStoreData({...storeData, show_whatsapp_float:!storeData.show_whatsapp_float})} className={`w-12 h-7 rounded-full p-1 ${storeData.show_whatsapp_float!== false? "bg-[#25D366]" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.show_whatsapp_float!== false? "translate-x-5" : ""}`}></div></button></div>
          </div>
          <div className="p-5 rounded-[14px] bg-[#e5ddd5] border-2">
            <p className="text-[11px] font-black uppercase">Chat Preview - WhatsApp</p>
            <div className="mt-4 max-w-[320px] bg-white rounded-[12px] border overflow-hidden">
              <div className="p-3 bg-[#075e54] text-white flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">🏪</div><div><p className="text-xs font-black">{storeData.shop_name || "Your Shop"}</p><p className="text-[10px] opacity-80">Online • {storeData.response_time || "30min"}</p></div></div>
              <div className="p-3 space-y-3 bg-[#e5ddd5] min-h-[180px]"><div className="bg-white p-3 rounded-[12px] rounded-tl-none shadow-sm max-w-[85%]"><p className="text-[12px] whitespace-pre-line">{storeData.auto_message || `Assalamu Alaikum! Thanks for visiting ${storeData.shop_name || "our store"}`}</p></div><div className="bg-[#dcf8c6] p-3 rounded-[12px] rounded-tr-none max-w-[85%] ml-auto"><p className="text-[12px]">{testMessage}</p></div></div>
              <div className="p-2 bg-[#f0f0f0] flex gap-2"><input value={testMessage} onChange={e=>setTestMessage(e.target.value)} className="flex-1 px-3 py-2 rounded-full border text-xs" placeholder="Type message..." /><button className="w-8 h-8 rounded-full bg-[#25D366] text-white">➤</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[14px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">{saving? "Saving..." : `Save Social & Contact - ${contactCompletion.percent}% Trust - Live`}</button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.includes("✅")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}