"use client";
import { useStore } from "../layout";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export default function VerificationPage(){
  const { storeData, setStoreData, handleImageUpload, handleSave, saving, saveMsg } = useStore();
  const [activeTab, setActiveTab] = useState("status");
  const [showNidGuide, setShowNidGuide] = useState(false);
  const [liveCheck, setLiveCheck] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setLiveCheck(c=>c+1), 3000);
    return () => clearInterval(iv);
  }, []);

  const verificationScore = useMemo(() => {
    let s=0;
    if(storeData.shop_logo) s+=12;
    if(storeData.shop_banner || storeData.hero_image) s+=12;
    if(storeData.shop_description && storeData.shop_description.length>=100) s+=12;
    if(storeData.shop_description && storeData.shop_description.length>=150) s+=3;
    if(storeData.phone && storeData.phone.length>=11) s+=8;
    if(storeData.whatsapp_number && storeData.whatsapp_number.length>=11) s+=5;
    if(storeData.address && storeData.address.length>=20) s+=8;
    if(storeData.full_address && storeData.full_address.length>=30) s+=2;
    if(storeData.facebook_url) s+=8;
    if(storeData.instagram_url) s+=3;
    if(storeData.youtube_url) s+=2;
    if(storeData.tiktok_url) s+=2;
    if(storeData.shop_name && storeData.shop_name.length>=10) s+=8;
    if(storeData.delivery_charge_inside && storeData.delivery_charge_outside) s+=8;
    if(storeData.nid_front) s+=4;
    if(storeData.nid_back) s+=3;
    if(storeData.trade_license || storeData.address_proof) s+=2;
    if(storeData.google_maps_url) s+=2;
    return Math.min(s,100);
  }, [storeData, liveCheck]);

  const socialChecks = useMemo(() => [
    { label:"Facebook Page", field:"facebook_url", done:!!storeData.facebook_url, link: storeData.facebook_url, icon:"📘", color:"bg-[#1877F2] text-white", points:10, tip:"Facebook page MUST - 80% customers check FB before buying - Trust +50%", pastPage:"Facebook page - 100+ likes - Active - Last post within 7 days", must:true },
    { label:"Instagram", field:"instagram_url", done:!!storeData.instagram_url, link: storeData.instagram_url, icon:"📸", color:"bg-gradient-to-br from-purple-600 to-pink-500 text-white", points:5, tip:"Instagram - 40% traffic - Fashion must have", pastPage:"Instagram - 500+ followers - 10+ posts - Story highlights", must:false },
    { label:"YouTube", field:"youtube_url", done:!!storeData.youtube_url, link: storeData.youtube_url, icon:"▶️", color:"bg-red-600 text-white", points:3, tip:"YouTube - Video reviews - Trust +20%", pastPage:"YouTube channel - 2+ videos - Product videos", must:false },
    { label:"TikTok", field:"tiktok_url", done:!!storeData.tiktok_url, link: storeData.tiktok_url, icon:"🎵", color:"bg-black text-white", points:3, tip:"TikTok - Viral - 100k+ views possible", pastPage:"TikTok - 5+ videos - Viral potential", must:false },
    { label:"WhatsApp Channel", field:"whatsapp_channel_url", done:!!storeData.whatsapp_channel_url ||!!storeData.whatsapp_number, link: storeData.whatsapp_channel_url, icon:"💬", color:"bg-[#25D366] text-white", points:8, tip:"WhatsApp - 90% BD customers use WA - Fast reply", pastPage:"WhatsApp Business - Catalog - Fast reply 30min", must:true },
    { label:"Google Maps", field:"google_maps_url", done:!!storeData.google_maps_url ||!!storeData.address, link: storeData.google_maps_url, icon:"📍", color:"bg-green-600 text-white", points:5, tip:"Google Maps - Local SEO +30% - Google My Business", pastPage:"Google Maps - 4.9 rating - 50+ reviews - Address verified", must:true },
    { label:"Website", field:"website_url", done:!!storeData.website_url ||!!storeData.shop_slug, link: storeData.website_url || `https://baharaz.com/store/${storeData.shop_slug}`, icon:"🌐", color:"bg-slate-900 text-white", points:8, tip:"Website - baharaz.com/store/your-shop - Official", pastPage:"Baharaz store - Official - All social bio links point here", must:true },
    { label:"Phone Verified", field:"phone", done:!!storeData.phone && storeData.phone.length>=11, link:`tel:${storeData.phone}`, icon:"📞", color:"bg-green-500 text-white", points:8, tip:"Phone verified - OTP verification", pastPage:"Phone - OTP verified - WhatsApp same number", must:true },
  ], [storeData]);

  const docChecks = [
    { label:"NID Front - Required", field:"nid_front", done:!!storeData.nid_front, points:5, required:true, tip:"NID front - Clear - All 4 corners visible - Name matches owner" },
    { label:"NID Back - Required", field:"nid_back", done:!!storeData.nid_back, points:3, required:true, tip:"NID back - Clear - Address visible - Must match district" },
    { label:"Trade License - Optional", field:"trade_license", done:!!storeData.trade_license, points:2, required:false, tip:"Trade license - Helps faster verification - Baharaz Mall requires" },
    { label:"Address Proof - Required", field:"address_proof", done:!!storeData.address_proof, points:4, required:true, tip:"Address proof - Electricity bill, rent agreement, shop photo with signboard" },
    { label:"Shop Front Photo", field:"shop_front_photo", done:!!storeData.shop_front_photo, points:3, required:false, tip:"Shop front with signboard - TAMID NEW FASHION visible" },
    { label:"Shop Inside Photo", field:"shop_inside_photo", done:!!storeData.shop_inside_photo, points:2, required:false, tip:"Shop inside - Products display - Real inventory" },
    { label:"Selfie with NID", field:"selfie_nid", done:!!storeData.selfie_nid, points:2, required:false, tip:"Selfie holding NID - Face + NID same frame" },
    { label:"Bank Statement", field:"bank_statement", done:!!storeData.bank_statement, points:1, required:false, tip:"Bank statement - For bKash/Nagad/bank verification" },
  ];

  const benefits = [
    { title:"Trust +30% - Blue Tick ✓", icon:"✅", desc:"Blue verified tick next to shop name - Like Baharaz Mall, Amazon Verified - Customers trust verified 30% more - 90% customers check verified before buying expensive products", stats:"+30% Trust - Verified stores 30% more trust", color:"bg-blue-50 border-blue-200" },
    { title:"Google Ranking +50% - Local SEO", icon:"🚀", desc:"Google loves verified businesses - Verified badge = Higher ranking for 'clothing store rajshahi' - 40% BD searches include city - Local SEO boost", stats:"+50% Ranking - Verified stores rank 50% higher", color:"bg-green-50 border-green-200" },
    { title:"Facebook Shop Approval +20% Traffic", icon:"📘", desc:"Facebook Shop requires verification - Verified badge on Baharaz helps FB Shop approval - FB Shop = Extra traffic - 20% traffic from Facebook Shop", stats:"+20% Traffic - Facebook Shop", color:"bg-[#1877F2]/10 border-blue-200" },
    { title:"Higher Conversion +20%", icon:"📈", desc:"Verified = Trust = Buy - Conversion 20% higher - Especially for expensive products 1000+ TK - Non-verified 2% conversion, verified 2.4%", stats:"+20% Conversion - Expensive products", color:"bg-purple-50 border-purple-200" },
    { title:"Homepage Featured +1000 views/day", icon:"⭐", desc:"Baharaz homepage featured stores - Verified stores get priority - Homepage = 1000+ views per day free - Verified = Featured - More views - More orders", stats:"+1000 Views/day - Homepage featured", color:"bg-amber-50 border-amber-200" },
    { title:"Support Priority + No Penalty", icon:"🛡️", desc:"Verified stores less penalty - Warning first - Support priority - Verified sellers get fast support - WhatsApp priority - 1h reply vs 24h", stats:"Support Priority - 1h reply", color:"bg-slate-50 border-slate-200" },
    { title:"Social Past Page Everywhere", icon:"🌐", desc:"Past page on FB, IG, TikTok, YouTube, WA, Google Maps - Same logo, name, address, phone - Consistent branding - Trust +50% - Customer checks FB sees same logo as Baharaz", stats:"Consistent Everywhere - Trust +50%", color:"bg-pink-50 border-pink-200" },
    { title:"Customer Reviews = 3x Conversion", icon:"👥", desc:"10 reviews = 3x conversion - 50 reviews = 5x conversion - Customers trust customers - Real customer photos - 4.9 rating - Social proof", stats:"10 Reviews = 3x Conversion", color:"bg-green-50 border-green-200" },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-24">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2 flex-wrap">Verification - Get Verified Badge ✓ <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border-2 font-black">TRUST +30% - RANKING +50%</span> <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border-2 font-black">SOCIAL PAST PAGE EVERYWHERE</span></h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Get blue verified badge ✓ - Like Baharaz Mall - Trust +30% - Higher Google ranking +50% - Need 80%+ completion + NID + Address proof + Social past page everywhere - 24-48h verification</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${verificationScore>=80? "bg-green-50 text-green-700 border-green-200" : verificationScore>=50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>Score {verificationScore}/100 - {verificationScore>=80? "READY FOR BADGE" : `Need ${80-verificationScore}% more`}</div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-bold">{storeData.is_verified? "✅ Verified - Blue Tick Active" : `${verificationScore>=80? "Ready to apply" : "Complete 80%+ to apply"}`} • Live #{liveCheck}</p>
        </div>
      </div>

      <div className="p-1.5 rounded-[16px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-20 overflow-x-auto">
        <button onClick={()=>setActiveTab("status")} className={`flex-1 py-3 rounded-xl text-[11px] font-black border-2 whitespace-nowrap ${activeTab==="status"? "bg-white border-slate-200 shadow-sm text-slate-900" : "border-transparent text-slate-500"}`}>STATUS - {verificationScore}%</button>
        <button onClick={()=>setActiveTab("social")} className={`flex-1 py-3 rounded-xl text-[11px] font-black border-2 whitespace-nowrap ${activeTab==="social"? "bg-white border-slate-200 shadow-sm text-slate-900" : "border-transparent text-slate-500"}`}>SOCIAL PAST PAGE - 8 PLATFORMS</button>
        <button onClick={()=>setActiveTab("documents")} className={`flex-1 py-3 rounded-xl text-[11px] font-black border-2 whitespace-nowrap ${activeTab==="documents"? "bg-white border-slate-200 shadow-sm text-slate-900" : "border-transparent text-slate-500"}`}>DOCUMENTS - NID, LICENSE</button>
        <button onClick={()=>setActiveTab("benefits")} className={`flex-1 py-3 rounded-xl text-[11px] font-black border-2 whitespace-nowrap ${activeTab==="benefits"? "bg-white border-slate-200 shadow-sm text-slate-900" : "border-transparent text-slate-500"}`}>BENEFITS - 8 BENEFITS</button>
      </div>

      {activeTab==="status" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[20px] border-2 bg-white shadow-sm space-y-6">
            <div className="flex gap-5 items-center">
              <div className="w-24 h-24 rounded-[20px] bg-slate-100 border-2 flex items-center justify-center overflow-hidden shrink-0">
                {storeData.shop_logo? <img src={storeData.shop_logo} className="w-full h-full object-cover" alt="logo" /> : <span className="font-black text-2xl">{storeData.shop_name?.[0] || "S"}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[20px] flex items-center gap-3 flex-wrap">{storeData.shop_name || "Your Store"} {storeData.is_verified? <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">✓</span> : <span className="text-[11px] px-3 py-1 rounded-full bg-amber-50 text-amber-700 border-2 font-black">Not Verified</span>} <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-black">{storeData.district || "Rajshahi"} • ⭐ {storeData.rating || 4.9}</span></p>
                <p className="text-xs text-slate-500 mt-2 font-mono bg-slate-50 px-3 py-1.5 rounded-full border inline-block">baharaz.com/store/{storeData.shop_slug || "your-shop"} • {verificationScore}% complete</p>
                <div className="mt-4 w-full h-4 rounded-full bg-slate-100 overflow-hidden p-1 flex"><div className={`h-full rounded-full ${verificationScore>=80? "bg-green-500" : verificationScore>=50? "bg-amber-500" : "bg-red-500"}`} style={{ width:`${verificationScore}%` }}></div></div>
              </div>
              <div className="text-right shrink-0"><p className="text-[11px] font-black uppercase text-slate-500">Status</p><p className={`text-2xl font-black mt-1 ${storeData.is_verified? "text-blue-600" : verificationScore>=80? "text-green-600" : "text-amber-600"}`}>{storeData.is_verified? "VERIFIED ✓" : verificationScore>=80? "READY" : "NOT READY"}</p></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:"Logo 200x200", done:!!storeData.shop_logo, points:12, path:"/seller/store/branding" },
                { label:"Banner 1600x600", done:!!storeData.shop_banner ||!!storeData.hero_image, points:12, path:"/seller/store/banner" },
                { label:"Description 150+", done:!!storeData.shop_description && storeData.shop_description.length>=150, points:12, path:"/seller/store/branding" },
                { label:"Phone 11 digits", done:!!storeData.phone && storeData.phone.length>=11, points:8, path:"/seller/store/social" },
                { label:"WhatsApp", done:!!storeData.whatsapp_number, points:5, path:"/seller/store/social" },
                { label:"Address Full", done:!!storeData.address && storeData.address.length>=20, points:10, path:"/seller/store/social" },
                { label:"Facebook Page", done:!!storeData.facebook_url, points:8, path:"/seller/store/social" },
                { label:"Shop Name + City", done:!!storeData.shop_name && storeData.shop_name.length>=10, points:8, path:"/seller/store/branding" },
                { label:"Shipping Charges", done:!!storeData.delivery_charge_inside, points:8, path:"/seller/store/shipping" },
                { label:"NID Front", done:!!storeData.nid_front, points:4, path:"" },
                { label:"Google Maps", done:!!storeData.google_maps_url, points:3, path:"/seller/store/social" },
              ].map((c,i)=><Link key={i} href={c.path} className={`p-4 rounded-[16px] border-2 text-center ${c.done? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-900"}`}><p className="text-lg">{c.done? "✅" : "⭕"}</p><p className="text-[11px] font-black mt-2">{c.label} - {c.points}pts</p><p className={`mt-2 text-[10px] px-2 py-1 rounded-full font-black inline-block border ${c.done? "bg-green-500 text-white" : "bg-white border-slate-200"}`}>{c.done? "Done ✓" : "Todo →"}</p></Link>)}
            </div>

            {verificationScore>=80? <div className="p-6 rounded-[16px] bg-green-50 border-2 border-green-200"><div className="flex gap-4"><span className="text-3xl">✅</span><div><p className="font-black text-green-900 text-sm">Ready for Verified Badge - Contact Support - 24-48h Verification</p><p className="text-[11px] text-green-800 mt-3 leading-relaxed">You have {verificationScore}% - Ready - Contact Baharaz support via WhatsApp: Provide NID front/back, Trade License, Shop address proof, Phone verification, Social media past page links - Facebook, Instagram, TikTok, YouTube, WhatsApp Channel, Google Maps - All must have same logo, name, address, phone - Consistent branding - 24-48h verification - Blue tick</p><div className="mt-4 flex gap-2"><button className="px-6 py-3 rounded-full bg-green-600 text-white text-xs font-black">Contact Support - WhatsApp - Get Verified in 24-48h →</button></div></div></div></div> : <div className="p-6 rounded-[16px] bg-amber-50 border-2 border-amber-200"><div className="flex gap-4"><span className="text-3xl">⚠️</span><div><p className="font-black text-amber-900 text-sm">Need {80-verificationScore}% more for Verified Badge</p><p className="text-[11px] text-amber-800 mt-3">Complete: Logo, Banner, Description 150+, Phone, WhatsApp, Full address, Facebook page, Shop name with city, Shipping charges, NID front, Google Maps - Then social past page everywhere consistent</p></div></div></div>}
          </div>

          <div className="p-6 rounded-[20px] border-2 bg-slate-900 text-white">
            <h3 className="font-black text-sm">🌐 Social Media Past Page Everywhere - Why Important - Trust +50%</h3>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="p-4 rounded-[16px] bg-white/10 border"><p className="font-black text-amber-300">What is Past Page Everywhere?</p><p className="mt-3 opacity-80 leading-relaxed">Your shop has presence on every platform - Facebook, Instagram, TikTok, YouTube, WhatsApp Channel, Google Maps, Baharaz - All have SAME logo, SAME name, SAME address, SAME phone - Consistent branding everywhere - Customer checks FB sees same logo as Baharaz store - Consistent = Trust +50%</p></div>
              <div className="p-4 rounded-[16px] bg-white/10 border"><p className="font-black text-blue-300">How Verification Team Checks:</p><p className="mt-3 opacity-80 leading-relaxed">Team checks: Logo same? Name same? Address same? Phone same? Banner similar? Description similar? If consistent, verified - If not consistent, reject - Must be same everywhere - Professional - Real business</p></div>
            </div>
            <div className="mt-5 p-4 rounded-xl bg-white/5 border">
              <p className="text-xs font-black">✅ Past Page Everywhere Checklist - 8 Platforms:</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">📘 Facebook</p><p className="opacity-70 mt-1">facebook.com/tamidfashion - Same logo, name - 100+ likes</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">📸 Instagram</p><p className="opacity-70 mt-1">instagram.com/tamidfashion - Same logo - 500+ followers</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">🎵 TikTok</p><p className="opacity-70 mt-1">tiktok.com/@tamidfashion - Same logo - 5+ videos</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">▶️ YouTube</p><p className="opacity-70 mt-1">youtube.com/@tamidfashion - Shop tour videos</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">💬 WhatsApp</p><p className="opacity-70 mt-1">WA Business - Catalog - Fast reply 30min</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">📍 Google Maps</p><p className="opacity-70 mt-1">Google My Business - 4.9 rating - 50+ reviews</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">🌐 Baharaz</p><p className="opacity-70 mt-1">baharaz.com/store/tamid-fashion - Official website</p></div>
                <div className="p-2.5 rounded-xl bg-white/10 border"><p className="font-black">📞 Phone</p><p className="opacity-70 mt-1">017XXXXXXXX - OTP verified - Same everywhere</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab==="social" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[20px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Social Media Past Page Everywhere - 8 Platforms - Consistent Branding - Same Logo, Name, Address, Phone - Trust +50% - Required for Verified Badge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialChecks.map((s,i)=>(
                <div key={i} className={`p-5 rounded-[16px] border-2 ${s.done? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-900"}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center"><span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</span><div><p className="font-black text-sm flex items-center gap-2">{s.label} {s.must && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">MUST</span>} {s.done? "✓" : "○"}</p><p className="text-[11px] text-slate-500 mt-1">{s.points} points</p></div></div>
                    {s.link && <a href={s.link} target="_blank" className="text-[11px] px-3 py-1.5 rounded-full bg-white border-2 font-black hover:bg-slate-900 hover:text-white">View ↗</a>}
                  </div>
                  <div className="mt-4 space-y-3">
                    <div><label className="text-[11px] font-black uppercase">{s.label} URL</label><input value={storeData[s.field] || ""} onChange={e=>setStoreData({...storeData, [s.field]: e.target.value})} placeholder={s.label.includes('Facebook')? "https://facebook.com/tamidfashion" : s.label.includes('Instagram')? "https://instagram.com/tamidfashion" : "Past page URL"} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-white text-sm font-bold" /></div>
                    <div className="p-3 rounded-xl bg-white border-2"><p className="text-[11px] font-black">What team checks:</p><p className="text-[11px] text-slate-600 mt-1">{s.pastPage}</p><p className="text-[11px] text-slate-500 mt-1">{s.tip}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==="documents" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[20px] border-2 bg-white shadow-sm space-y-6">
            <div className="flex justify-between"><div><h3 className="font-black text-[14px]">Documents - NID, License, Address Proof, Shop Photos - Secure - Only Support Sees</h3><p className="text-xs text-slate-500 mt-1">Secure - Encrypted - Only verification team sees - Not public - Required for verified badge</p></div><button onClick={()=>setShowNidGuide(!showNidGuide)} className="text-[11px] px-4 py-2 rounded-full bg-slate-50 border-2 font-black">{showNidGuide? "Hide Guide" : "NID Photo Guide 📘"}</button></div>
            {showNidGuide && <div className="p-5 rounded-[16px] bg-slate-900 text-white grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]"><div><p className="font-black text-amber-300">✅ Good NID Photo:</p><ul className="mt-3 space-y-2 list-disc pl-4 opacity-80"><li>All 4 corners visible - Not cropped</li><li>Not blurry - Sharp - Text readable</li><li>No glare - No flash reflection</li><li>Name matches shop owner</li></ul></div><div><p className="font-black text-red-300">❌ Bad NID Photo:</p><ul className="mt-3 space-y-2 list-disc pl-4 opacity-80"><li>Blurry - Text not readable - Reject</li><li>Cropped - Corners cut - Reject</li><li>Glare - Flash reflection - Reject</li><li>Dark - Poor lighting - Reject</li></ul></div></div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {docChecks.map((doc,i)=>(
                <div key={i} className={`p-5 rounded-[16px] border-2 space-y-4 ${doc.done? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex justify-between"><div><label className="text-[11px] font-black uppercase">{doc.label} {doc.required && <span className="text-red-500">*</span>} - {doc.points}pts</label><p className="text-[11px] text-slate-500 mt-1">{doc.tip}</p></div><span className={`text-[10px] px-2.5 py-1 rounded-full font-black border-2 shrink-0 ${doc.done? "bg-green-500 text-white border-green-500" : doc.required? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 border-slate-200"}`}>{doc.done? "✓ Uploaded" : doc.required? "Required" : "Optional"}</span></div>
                  <input type="file" accept="image/*" onChange={e=>handleImageUpload(e, doc.field)} className="w-full text-xs file:mr-3 file:px-4 file:py-2.5 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:font-black border-2 border-dashed rounded-xl p-2 bg-white" />
                  <div className="rounded-[16px] overflow-hidden border-2 bg-white h-[180px] flex items-center justify-center">{storeData[doc.field]? <img src={storeData[doc.field]} className="w-full h-full object-cover" alt={doc.label} /> : <div className="text-center p-4"><span className="text-2xl">📄</span><p className="text-xs font-bold text-slate-600 mt-2">No {doc.label}</p></div>}</div>
                  {storeData[doc.field] && <div className="flex gap-2"><button onClick={()=>setStoreData({...storeData, [doc.field]:""})} className="text-xs px-4 py-2 rounded-full bg-red-50 text-red-600 border-2 font-black">Remove ✕</button><a href={storeData[doc.field]} target="_blank" className="text-xs px-4 py-2 rounded-full bg-white border-2 font-black">View Full ↗</a></div>}
                </div>
              ))}
            </div>
            <div className="p-5 rounded-[16px] bg-blue-50 border-2 border-blue-200 flex gap-3"><span className="text-xl">🔒</span><div><p className="text-xs font-black text-blue-900">Privacy - Secure - Encrypted - Only Verification Team Sees:</p><p className="text-[11px] text-blue-800 mt-2 leading-relaxed">Your documents are secure - Encrypted - Only verification team sees - Not public - GDPR compliant - You can request deletion after verification - Don't share NID photos on Facebook - Only upload here</p></div></div>
          </div>
        </div>
      )}

      {activeTab==="benefits" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[20px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Benefits of Verified Badge - 8 Benefits - Why You Must Get Verified - Trust +30% - Ranking +50%</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((b,i)=>(
                <div key={i} className={`p-5 rounded-[16px] border-2 ${b.color}`}>
                  <div className="flex gap-3"><span className="text-2xl">{b.icon}</span><div><p className="text-xs font-black">{b.title}</p><p className="text-[11px] text-slate-700 mt-3 leading-relaxed">{b.desc}</p><div className="mt-4 p-3 rounded-xl bg-white border-2"><p className="text-[11px] font-black">📊 Stats:</p><p className="text-[11px] text-slate-600 mt-1 font-bold">{b.stats}</p></div></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[16px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">
          {saving? "Saving Verification..." : `💾 Save Verification - Score ${verificationScore}/100 - ${verificationScore>=80? "Ready for Badge ✅" : `Need ${80-verificationScore}% more`} - ${socialChecks.filter(s=>s.done).length}/8 Platforms`}
        </button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}