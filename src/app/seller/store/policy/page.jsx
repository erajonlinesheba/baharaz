"use client";
import { useStore } from "../layout";
import { useState, useMemo } from "react";

export default function PolicyPage(){
  const { storeData, setStoreData, handleSave, saving, saveMsg } = useStore();
  const [activeTab, setActiveTab] = useState("shipping");
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLaw, setShowLaw] = useState(false);

  const templates = {
    shipping: [
      { name: "Baharaz Standard - Fast", text: "We ship within 24 hours. Inside Dhaka 1-2 days, Outside 2-3 days, Rajshahi Same Day. Courier: Steadfast / Pathao / RedX. Tracking via SMS. Free delivery on 999TK+. 60TK inside Dhaka, 120TK outside." },
      { name: "Amazon Style - Detailed", text: "All orders processed within 24 hours (except holidays). Dhaka Metro 1-2 days, Outside 2-4 days, Remote 3-5 days. Courier: Steadfast, Pathao, RedX, Sundarban. Tracking ID via SMS. Charges: Inside 60TK, Outside 120TK, Rajshahi 40TK. Free shipping above 999TK. Same day Rajshahi if ordered before 2PM." },
      { name: "Fashion - Short", text: "Fast delivery! 1-2 days Dhaka, 2-3 days outside. Free delivery on 999TK+ orders. COD available. Tracking via SMS." },
    ],
    return: [
      { name: "7 Days Baharaz - Best Converting", text: "7 Days Easy Return - If product is defective, wrong size/color, or damaged. Conditions: 1) Must have unboxing video 2) Product unused with tags 3) Request within 7 days 4) Return courier: Customer if not our fault, we if defective. Refund within 24-48h after QC. Exchange for size issue." },
      { name: "No Return for Cosmetics", text: "Due to hygiene, cosmetics, innerwear, food are non-returnable unless damaged/defective on arrival. For defective, need unboxing video within 24h. 7 days return for other categories." },
      { name: "Amazon 14 Days - Premium", text: "14 Days Return - 100% satisfied. Return within 14 days if not satisfied. Product must be unused with original packaging, tags, bills. Lingerie, cosmetics non-returnable for hygiene. Refund via bKash/Nagad/Bank within 48h after QC." },
    ],
    warranty: [
      { name: "100% Authentic + 1 Year Service", text: "100% Authentic Guaranteed. 1 Year Service Warranty on electronics. 7 days replacement if defect. Warranty does not cover physical, water damage, misuse. Keep invoice." },
      { name: "Clothing - Guarantee", text: "No warranty on clothing but guarantee authentic with correct size as per size chart. Exchange within 7 days if size issue. Color may vary slightly due to lighting." },
      { name: "Electronics - Brand Warranty", text: "Brand Warranty Applicable. 1 Year Official Brand Warranty + 1 Year Service Warranty from us. Warranty card included. For claim, contact with invoice and unboxing video." },
    ],
    terms: [
      { name: "Standard Terms", text: "By placing order, you agree to terms. Prices may change without notice. Stock not guaranteed until confirmed. We reserve right to cancel if fraud suspected. For dispute, Rajshahi court jurisdiction." },
    ]
  };

  const completionScore = useMemo(() => {
    let s = 0;
    if(storeData.shipping_policy && storeData.shipping_policy.length > 50) s+=20;
    if(storeData.return_policy && storeData.return_policy.length > 50) s+=25;
    if(storeData.warranty_text && storeData.warranty_text.length > 20) s+=15;
    if(storeData.terms_conditions && storeData.terms_conditions.length > 20) s+=15;
    if(storeData.privacy_policy && storeData.privacy_policy.length > 20) s+=15;
    if(storeData.return_days) s+=10;
    return s;
  }, [storeData]);

  const applyTemplate = (type, text) => {
    if(type === "shipping") setStoreData({...storeData, shipping_policy: text});
    if(type === "return") setStoreData({...storeData, return_policy: text});
    if(type === "warranty") setStoreData({...storeData, warranty_text: text});
    if(type === "terms") setStoreData({...storeData, terms_conditions: text});
  };

  return (
    <div className="space-y-6 max-w-3xl pb-24">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight">Store Policies - Legal Pages</h1>
          <p className="text-xs text-slate-500 mt-2">Shipping, return, warranty, terms, privacy - Shown on checkout & product page - Required for verified badge</p>
        </div>
        <span className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${completionScore >= 80? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{completionScore}% - {completionScore >= 80? "VERIFIED READY" : "INCOMPLETE"}</span>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between"><p className="text-[11px] font-black uppercase text-slate-500">Policy Completeness</p><p className="text-xs font-black">{completionScore}/100</p></div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${completionScore >= 80? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${completionScore}%`}}></div></div>
        <div className="mt-4 grid grid-cols-5 gap-2 text-[10px]">{[{ label: "Shipping", done: storeData.shipping_policy?.length > 50 },{ label: "Return", done: storeData.return_policy?.length > 50 },{ label: "Warranty", done: storeData.warranty_text?.length > 20 },{ label: "Terms", done: storeData.terms_conditions?.length > 20 },{ label: "Privacy", done: storeData.privacy_policy?.length > 20 }].map((p,i) => (<div key={i} className={`p-2.5 rounded-xl border-2 text-center font-bold ${p.done? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 text-slate-500"}`}>{p.done? "✓" : "○"} {p.label}</div>))}</div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10">
        <button onClick={()=>setActiveTab("shipping")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="shipping"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>SHIPPING</button>
        <button onClick={()=>setActiveTab("return")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="return"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>RETURN</button>
        <button onClick={()=>setActiveTab("warranty")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="warranty"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>WARRANTY</button>
        <button onClick={()=>setActiveTab("legal")} className={`flex-1 py-3 rounded-[10px] text-[11px] font-black border-2 ${activeTab==="legal"? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>LEGAL - T&C</button>
      </div>

      <div className="p-5 rounded-[16px] border-2 border-dashed bg-white">
        <div className="flex justify-between items-center"><h3 className="font-black text-sm">📋 1-Click Professional Templates - Baharaz & Amazon Verified</h3><button onClick={()=>setShowTemplates(!showTemplates)} className="text-[11px] px-4 py-2 rounded-full bg-slate-900 text-white font-bold">{showTemplates? "Hide" : "Show Templates"}</button></div>
        {showTemplates && (
          <div className="mt-5 grid grid-cols-1 gap-4">
            {Object.keys(templates).map(type => (
              <div key={type} className="space-y-2"><p className="text-[11px] font-black uppercase text-slate-500">{type} Templates</p><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{templates[type].map((tpl, idx) => (<button key={idx} onClick={()=>applyTemplate(type, tpl.text)} className="p-3 rounded-xl border-2 bg-slate-50 hover:bg-white hover:border-slate-900 text-left"><p className="text-xs font-black">{tpl.name}</p><p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tpl.text}</p><p className="text-[10px] font-bold text-blue-600 mt-2">Click to Apply →</p></button>))}</div></div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "shipping" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Shipping & Delivery Policy - Customer sees on product page & checkout</h3>
          <div><label className="text-[11px] font-black uppercase">Shipping Policy * - 100-500 chars recommended</label><textarea value={storeData.shipping_policy || ""} onChange={e=>setStoreData({...storeData, shipping_policy:e.target.value})} rows={6} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="Delivery within 1-2 days inside Dhaka, 2-4 days outside, Same day Rajshahi if ordered before 2PM. Courier: Steadfast, Pathao, RedX. Free delivery 999TK+. Tracking via SMS." /><p className={`text-[11px] font-bold mt-2 ${(storeData.shipping_policy||"").length > 80? "text-green-600" : "text-amber-600"}`}>{(storeData.shipping_policy||"").length} chars - {(storeData.shipping_policy||"").length > 80? "Good ✓" : "Add more - Min 80"}</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="text-[11px] font-black uppercase">Processing Time</label><select value={storeData.processing_time || "24h"} onChange={e=>setStoreData({...storeData, processing_time:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="same">Same Day</option><option value="24h">24 Hours - Recommended</option><option value="48h">48 Hours</option></select></div><div><label className="text-[11px] font-black uppercase">Inside Dhaka</label><select value={storeData.delivery_time_inside || "1-2 days"} onChange={e=>setStoreData({...storeData, delivery_time_inside:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option>Same Day</option><option>1-2 days - Recommended</option><option>2-3 days</option></select></div><div><label className="text-[11px] font-black uppercase">Outside Dhaka</label><select value={storeData.delivery_time_outside || "2-3 days"} onChange={e=>setStoreData({...storeData, delivery_time_outside:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option>1-2 days</option><option>2-3 days - Recommended</option><option>3-5 days</option></select></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="text-[11px] font-black uppercase">Courier Partners</label><input value={storeData.courier_partners || "Steadfast, Pathao, RedX"} onChange={e=>setStoreData({...storeData, courier_partners:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div><div><label className="text-[11px] font-black uppercase">Free Delivery Threshold</label><input type="number" value={storeData.free_delivery_min || "999"} onChange={e=>setStoreData({...storeData, free_delivery_min:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-black" /></div></div>
          <div className="space-y-3"><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Provide tracking via SMS?</p><p className="text-[11px] text-slate-500">Reduces WISMO 60% - Recommended ON</p></div><button onClick={()=>setStoreData({...storeData, provide_tracking:!storeData.provide_tracking})} className={`w-12 h-7 rounded-full p-1 ${storeData.provide_tracking!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.provide_tracking!== false? "translate-x-5" : ""}`}></div></button></div><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Same Day Rajshahi?</p><p className="text-[11px] text-slate-500">Own rider - +25% conversion</p></div><button onClick={()=>setStoreData({...storeData, same_day_rajshahi:!storeData.same_day_rajshahi})} className={`w-12 h-7 rounded-full p-1 ${storeData.same_day_rajshahi? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.same_day_rajshahi? "translate-x-5" : ""}`}></div></button></div></div>
        </div>
      )}

      {activeTab === "return" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Return & Exchange Policy - Most Important for Trust - +35% Conversion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="text-[11px] font-black uppercase">Return Window</label><select value={storeData.return_days || "7"} onChange={e=>setStoreData({...storeData, return_days:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-black"><option value="3">3 Days - Strict</option><option value="7">7 Days - Baharaz Standard - Recommended</option><option value="14">14 Days - Amazon Style - Premium</option><option value="30">30 Days</option></select></div><div><label className="text-[11px] font-black uppercase">Return Shipping Who Pays?</label><select value={storeData.return_shipping_payer || "customer_if_not_defect"} onChange={e=>setStoreData({...storeData, return_shipping_payer:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="customer_if_not_defect">Customer if not defect, We if defect - Recommended</option><option value="always_customer">Always Customer</option><option value="always_seller">Always We Pay - Premium</option></select></div><div><label className="text-[11px] font-black uppercase">Refund Time</label><select value={storeData.refund_time || "24-48h"} onChange={e=>setStoreData({...storeData, refund_time:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="24h">24 Hours</option><option value="24-48h">24-48h - Recommended</option><option value="3-5days">3-5 Days</option></select></div></div>
          <div><label className="text-[11px] font-black uppercase">Return Policy - Detailed *</label><textarea value={storeData.return_policy || ""} onChange={e=>setStoreData({...storeData, return_policy:e.target.value})} rows={6} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="7 days return if defective, wrong, or damaged. Conditions: unboxing video required, tags intact, unused, request within 7 days." /><p className={`text-[11px] font-bold mt-2 ${(storeData.return_policy||"").length > 80? "text-green-600" : "text-amber-600"}`}>{(storeData.return_policy||"").length} chars</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Require unboxing video?</p><p className="text-[11px] text-slate-500">Reduces fake returns 70% - MUST ON</p></div><button onClick={()=>setStoreData({...storeData, require_unboxing_return:!storeData.require_unboxing_return})} className={`w-12 h-7 rounded-full p-1 ${storeData.require_unboxing_return!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.require_unboxing_return!== false? "translate-x-5" : ""}`}></div></button></div><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Allow Exchange for Size?</p></div><button onClick={()=>setStoreData({...storeData, allow_exchange:!storeData.allow_exchange})} className={`w-12 h-7 rounded-full p-1 ${storeData.allow_exchange!== false? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.allow_exchange!== false? "translate-x-5" : ""}`}></div></button></div></div>
          <div><label className="text-[11px] font-black uppercase">Non-returnable Items</label><input value={storeData.non_returnable_list || ""} onChange={e=>setStoreData({...storeData, non_returnable_list:e.target.value})} placeholder="Cosmetics, innerwear, food - Unless damaged" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div>
          <div><label className="text-[11px] font-black uppercase">Return Process Steps</label><textarea value={storeData.return_process || ""} onChange={e=>setStoreData({...storeData, return_process:e.target.value})} rows={3} placeholder="1) WhatsApp with order ID + unboxing video 2) Approve in 24h 3) Send via Steadfast 4) Refund 24-48h" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" /></div>
        </div>
      )}

      {activeTab === "warranty" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Warranty & Authenticity - Builds 100% Trust</h3>
          <div><label className="text-[11px] font-black uppercase">Warranty / Guarantee Text *</label><textarea value={storeData.warranty_text || ""} onChange={e=>setStoreData({...storeData, warranty_text:e.target.value})} rows={4} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="1 year warranty - 100% authentic guarantee - 7 days replacement if defect" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="text-[11px] font-black uppercase">Warranty Type</label><select value={storeData.warranty_type || "service"} onChange={e=>setStoreData({...storeData, warranty_type:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="no">No Warranty - Fashion</option><option value="7days">7 Days Replacement</option><option value="service">1 Year Service - Recommended</option><option value="brand">Brand Warranty</option></select></div><div><label className="text-[11px] font-black uppercase">Warranty Period</label><select value={storeData.warranty_period || "1year"} onChange={e=>setStoreData({...storeData, warranty_period:e.target.value})} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold"><option value="none">No Warranty</option><option value="7days">7 Days</option><option value="1year">1 Year - Standard</option></select></div><div><label className="text-[11px] font-black uppercase">Service Center</label><input value={storeData.service_center || ""} onChange={e=>setStoreData({...storeData, service_center:e.target.value})} placeholder="Rajshahi City, WhatsApp 01XXX" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Authentic Guarantee Badge?</p></div><button onClick={()=>setStoreData({...storeData, authentic_badge:!storeData.authentic_badge})} className={`w-12 h-7 rounded-full p-1 ${storeData.authentic_badge!== false? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.authentic_badge!== false? "translate-x-5" : ""}`}></div></button></div><div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-bold">Keep invoice for warranty?</p></div><button onClick={()=>setStoreData({...storeData, keep_invoice:!storeData.keep_invoice})} className={`w-12 h-7 rounded-full p-1 ${storeData.keep_invoice!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData.keep_invoice!== false? "translate-x-5" : ""}`}></div></button></div></div>
          <div><label className="text-[11px] font-black uppercase">Warranty Not Covered</label><input value={storeData.warranty_exclusions || ""} onChange={e=>setStoreData({...storeData, warranty_exclusions:e.target.value})} placeholder="Physical damage, water damage, misuse - Not covered" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div>
        </div>
      )}

      {activeTab === "legal" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Legal Pages - Terms, Privacy, FAQ - Required for FB Shop</h3>
          <div><label className="text-[11px] font-black uppercase">Terms & Conditions</label><textarea value={storeData.terms_conditions || ""} onChange={e=>setStoreData({...storeData, terms_conditions:e.target.value})} rows={5} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="By placing order, you agree to terms..." /></div>
          <div><label className="text-[11px] font-black uppercase">Privacy Policy</label><textarea value={storeData.privacy_policy || ""} onChange={e=>setStoreData({...storeData, privacy_policy:e.target.value})} rows={5} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="We collect name, phone, address only for delivery..." /></div>
          <div><label className="text-[11px] font-black uppercase">FAQ</label><textarea value={storeData.faq_text || ""} onChange={e=>setStoreData({...storeData, faq_text:e.target.value})} rows={5} className="mt-2 w-full px-4 py-4 rounded-xl border-2 bg-slate-50 text-sm resize-none" placeholder="Q: Delivery time? A: 1-2 days Dhaka, 2-3 outside" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] font-black uppercase">Legal Email</label><input value={storeData.legal_email || ""} onChange={e=>setStoreData({...storeData, legal_email:e.target.value})} placeholder="legal@yourstore.com" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" /></div><div><label className="text-[11px] font-black uppercase">Jurisdiction</label><input value={storeData.jurisdiction || "Rajshahi, Bangladesh"} onChange={e=>setStoreData({...storeData, jurisdiction:e.target.value})} placeholder="Rajshahi, Bangladesh" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" /></div></div>
          <div className="p-4 rounded-xl bg-slate-900 text-white"><p className="text-xs font-black">📜 Bangladesh E-commerce Law - Digital Commerce Act 2023</p><ul className="mt-3 space-y-1 text-[11px] text-white/80 list-disc pl-4"><li>Return policy must be clearly mentioned - 7 days minimum recommended</li><li>Delivery time must be mentioned</li><li>Privacy policy required if using Facebook Pixel</li></ul><button onClick={()=>setShowLaw(!showLaw)} className="mt-4 text-[11px] px-3 py-1.5 rounded-full bg-white/10 border font-bold">{showLaw? "Hide Law" : "Show Law Details"}</button>{showLaw && <div className="mt-4 p-3 rounded-xl bg-white/10 border text-[11px]">As per Digital Commerce Guidelines 2023: Sellers must provide clear return policy, delivery timeline, contact. COD legal. Keep NID & Trade License ready.</div>}</div>
        </div>
      )}

      <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between items-center"><h3 className="font-black text-sm">Live Customer Preview - How customers see policies</h3><button onClick={()=>setShowPreview(!showPreview)} className="text-[11px] px-4 py-2 rounded-full bg-slate-50 border font-bold">{showPreview? "Hide" : "Show Preview"}</button></div>
        {showPreview && <div className="mt-5 space-y-4"><div className="p-4 rounded-xl bg-slate-50 border"><p className="text-[11px] font-black uppercase text-slate-500">Product Page - Trust Badges</p><div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3"><div className="p-3 rounded-xl bg-white border flex gap-3"><span className="text-lg">🚚</span><div><p className="text-xs font-black">Delivery - {storeData.delivery_time_inside || "1-2 days"}</p><p className="text-[11px] text-slate-500 line-clamp-3">{storeData.shipping_policy?.slice(0,120) || "Fast delivery - 1-2 days Dhaka..."}...</p></div></div><div className="p-3 rounded-xl bg-white border flex gap-3"><span className="text-lg">↩️</span><div><p className="text-xs font-black">{storeData.return_days || "7"} Days Return</p><p className="text-[11px] text-slate-500 line-clamp-3">{storeData.return_policy?.slice(0,120) || "7 days easy return..."}...</p></div></div><div className="p-3 rounded-xl bg-white border flex gap-3"><span className="text-lg">🛡️</span><div><p className="text-xs font-black">{storeData.warranty_period || "1 Year"} Warranty</p><p className="text-[11px] text-slate-500 line-clamp-3">{storeData.warranty_text?.slice(0,120) || "100% authentic..."}...</p></div></div></div></div></div>}
      </div>

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleSave} disabled={saving} className="w-full py-5 rounded-[16px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm">{saving? "Saving Policies..." : `Save Policies - ${completionScore}% Complete - Live on Store - ${completionScore >= 80? "✅ Verified Ready" : "⏳ Incomplete"}`}</button>
        {saveMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${saveMsg.toLowerCase().includes("success") || saveMsg.toLowerCase().includes("saved")? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}