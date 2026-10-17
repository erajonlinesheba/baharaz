"use client";
import { useStore } from "../layout";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { storeData, setStoreData, handleSave, saving, saveMsg } = useStore();
  const [activeTab, setActiveTab] = useState("general");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [localSaving, setLocalSaving] = useState(false);
  const [localMsg, setLocalMsg] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUid() {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    }
    getUid();
  }, []);

  const completion = useMemo(() => {
    let done = 0;
    if (storeData?.shop_name || storeData?.name) done++;
    if (storeData?.phone) done++;
    if (storeData?.address) done++;
    if (storeData?.shop_logo) done++;
    if (storeData?.bkash_number || storeData?.bank_name) done++;
    if (storeData?.shipping_policy) done++;
    return { done, total: 6, percent: Math.round((done / 6) * 100) };
  }, [storeData]);

  const handleToggle = (field) => {
    setStoreData({...storeData, [field]:!storeData[field] });
  };

  const handleLocalSave = async () => {
    setLocalSaving(true);
    setLocalMsg("");
    try {
      const fixedData = {
      ...storeData,
        name: storeData?.name || storeData?.shop_name || storeData?.store_name || "My Store",
        shop_name: storeData?.shop_name || storeData?.name || storeData?.store_name || "My Store",
      };
      if(!fixedData.name || fixedData.name === "My Store" &&!storeData?.shop_name){
        throw new Error("Store Name is required! Please add Shop Name");
      }
      setStoreData(fixedData);
      if (handleSave) {
        await handleSave(fixedData);
        setLocalMsg("✅ Settings saved successfully - Live now");
      }
    } catch (e) {
      setLocalMsg("❌ " + (e.message || "Failed"));
    } finally {
      setLocalSaving(false);
      setTimeout(() => setLocalMsg(""), 4000);
    }
  };

  const handleDeleteStore = async () => {
    if(deleteText!== "DELETE"){
      setLocalMsg("❌ Please type DELETE correctly");
      return;
    }
    if(!currentUserId){
      setLocalMsg("❌ No user ID found - Login again");
      return;
    }
    const ok = window.confirm("Are you 100% sure? This will delete your Store + All Products + Orders from EVERYWHERE permanently!");
    if(!ok) return;

    setDeleting(true);
    setLocalMsg("Deleting store from everywhere...");
    try{
      const { error: prodError } = await supabase.from('products').delete().eq('seller_id', currentUserId);
      if(prodError) console.log("product delete error (maybe no products):", prodError.message);

      const { error: orderError } = await supabase.from('orders').delete().eq('seller_id', currentUserId);
      if(orderError) console.log("order delete error:", orderError.message);

      const { error: sellerError } = await supabase.from('sellers').delete().eq('user_id', currentUserId);
      if(sellerError) throw sellerError;

      setLocalMsg("✅ Store deleted from everywhere successfully. Redirecting...");
      setTimeout(()=>{
        router.push('/');
        router.refresh();
      }, 1500);
    } catch(e){
      setLocalMsg("❌ Delete failed: " + e.message + " - Go to Supabase > Table Editor > sellers > RLS Policies > Enable DELETE for authenticated users where auth.uid() = user_id");
    } finally {
      setDeleting(false);
    }
  };

  const isSaving = saving || localSaving;
  const displayMsg = saveMsg || localMsg;

  return (
    <div className="space-y-6 max-w-3xl pb-28">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight">Store Settings</h1>
          <p className="text-xs text-slate-500 mt-2">General, notifications, privacy, security, advanced - Control your entire store</p>
        </div>
        <div className={`text-[11px] px-3 py-1.5 rounded-full font-black border-2 ${completion.percent >= 80? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
          {completion.done}/{completion.total} - {completion.percent}%
        </div>
      </div>

      <div className="p-5 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between">
          <p className="text-[11px] font-black uppercase text-slate-500">Store Setup Progress</p>
          <p className="text-xs font-black">{completion.percent}% Complete</p>
        </div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full ${completion.percent >= 80? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${completion.percent}%` }}></div>
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-10 overflow-x-auto">
        {[
          { id: "general", label: "GENERAL" },
          { id: "notifications", label: "NOTIFICATIONS" },
          { id: "privacy", label: "PRIVACY" },
          { id: "security", label: "SECURITY" },
          { id: "advanced", label: "ADVANCED" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 px-3 py-3 rounded-[10px] text-[11px] font-black border-2 whitespace-nowrap ${activeTab === t.id? "bg-white border-slate-900 shadow-sm" : "border-transparent text-slate-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">General Store Settings</h3>
            <div>
              <label className="text-[11px] font-black uppercase">Store Name * (Required)</label>
              <input value={storeData?.shop_name || storeData?.name || ""} onChange={(e) => setStoreData({...storeData, shop_name: e.target.value, name: e.target.value })} placeholder="TAMID NEW FASHION" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold" />
              <p className="text-[10px] text-slate-400 mt-1">This will be saved to both name and shop_name columns</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black uppercase">Store Status</label>
                <select value={storeData?.store_status || "active"} onChange={(e) => setStoreData({...storeData, store_status: e.target.value })} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold">
                  <option value="active">🟢 Active - Open for orders</option>
                  <option value="inactive">🔴 Inactive - Closed temporarily</option>
                  <option value="vacation">🏖️ Vacation Mode - Back soon</option>
                  <option value="maintenance">🔧 Maintenance - Updating store</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase">Store Language</label>
                <select value={storeData?.store_language || "en"} onChange={(e) => setStoreData({...storeData, store_language: e.target.value })} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold">
                  <option value="en">English</option>
                  <option value="bn">Bangla - বাংলা</option>
                  <option value="both">Both - English + Bangla</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black uppercase">Currency</label>
                <select value={storeData?.currency || "BDT"} onChange={(e) => setStoreData({...storeData, currency: e.target.value })} className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-bold">
                  <option value="BDT">৳ BDT - Bangladeshi Taka</option>
                  <option value="USD">$ USD - US Dollar</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase">Order Prefix</label>
                <input value={storeData?.order_prefix || "BAH-"} onChange={(e) => setStoreData({...storeData, order_prefix: e.target.value })} placeholder="BAH-" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono font-bold" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2">
                <div><p className="text-xs font-black">Show stock quantity?</p><p className="text-[11px] text-slate-500">If ON, customers see "Only 5 left"</p></div>
                <button onClick={() => handleToggle("show_stock")} className={`w-12 h-7 rounded-full p-1 ${storeData?.show_stock!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.show_stock!== false? "translate-x-5" : ""}`}></div></button>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2">
                <div><p className="text-xs font-black">Allow reviews & ratings?</p></div>
                <button onClick={() => handleToggle("allow_reviews")} className={`w-12 h-7 rounded-full p-1 ${storeData?.allow_reviews!== false? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.allow_reviews!== false? "translate-x-5" : ""}`}></div></button>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2">
                <div><p className="text-xs font-black">Show sold count?</p></div>
                <button onClick={() => handleToggle("show_sold_count")} className={`w-12 h-7 rounded-full p-1 ${storeData?.show_sold_count!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.show_sold_count!== false? "translate-x-5" : ""}`}></div></button>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2">
                <div><p className="text-xs font-black">Auto accept orders?</p></div>
                <button onClick={() => handleToggle("auto_accept_orders")} className={`w-12 h-7 rounded-full p-1 ${storeData?.auto_accept_orders? "bg-amber-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.auto_accept_orders? "translate-x-5" : ""}`}></div></button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase">Store Hours</label>
              <input value={storeData?.store_hours || ""} onChange={(e) => setStoreData({...storeData, store_hours: e.target.value })} placeholder="9 AM - 10 PM, Everyday" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm" />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase">Auto Reply Message</label>
              <textarea value={storeData?.auto_message || ""} onChange={(e) => setStoreData({...storeData, auto_message: e.target.value })} rows={3} placeholder="Assalamu Alaikum! Thank you..." className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm resize-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Notification Settings</h3>
          <div className="space-y-3">
            {[
              { field: "notify_new_order", label: "New Order Notification", desc: "Most important" },
              { field: "notify_order_cancel", label: "Order Cancel", desc: "When customer cancels" },
              { field: "notify_low_stock", label: "Low Stock Alert", desc: "Stock < 5" },
              { field: "notify_review", label: "New Review", desc: "When review comes" },
              { field: "notify_payment", label: "Payment Received", desc: "bKash confirmed" },
              { field: "notify_payout", label: "Payout Notification", desc: "Bank payout" },
              { field: "notify_message", label: "New Message", desc: "Customer chat" },
              { field: "email_notifications", label: "Email Notifications", desc: "Email also" },
              { field: "sms_notifications", label: "SMS Notifications", desc: "1TK per SMS" },
              { field: "whatsapp_notifications", label: "WhatsApp", desc: "Free - Recommended" },
            ].map((item) => (
              <div key={item.field} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2">
                <div><p className="text-xs font-black">{item.label}</p><p className="text-[11px] text-slate-500">{item.desc}</p></div>
                <button onClick={() => handleToggle(item.field)} className={`w-12 h-7 rounded-full p-1 ${storeData?.[item.field]!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.[item.field]!== false? "translate-x-5" : ""}`}></div></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Privacy & Visibility</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Show phone public?</p></div><button onClick={() => handleToggle("show_phone_public")} className={`w-12 h-7 rounded-full p-1 ${storeData?.show_phone_public!== false? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.show_phone_public!== false? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Show email public?</p></div><button onClick={() => handleToggle("show_email_public")} className={`w-12 h-7 rounded-full p-1 ${storeData?.show_email_public? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.show_email_public? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Show address public?</p></div><button onClick={() => handleToggle("show_address_public")} className={`w-12 h-7 rounded-full p-1 ${storeData?.show_address_public!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.show_address_public!== false? "translate-x-5" : ""}`}></div></button></div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Allow Google indexing?</p></div><button onClick={() => handleToggle("allow_indexing")} className={`w-12 h-7 rounded-full p-1 ${storeData?.allow_indexing!== false? "bg-green-500" : "bg-red-500"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.allow_indexing!== false? "translate-x-5" : ""}`}></div></button></div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-5">
          <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
            <h3 className="font-black text-[14px]">Security Settings</h3>
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100 flex gap-3">
              <span className="text-xl">🔐</span>
              <div><p className="text-xs font-black text-blue-900">Secured with Supabase Auth</p><p className="text-[11px] text-blue-700 mt-1">User ID: {currentUserId? currentUserId.slice(0, 20) + "..." : "Not connected"}</p></div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Two-Factor Authentication?</p></div><button onClick={() => handleToggle("enable_2fa")} className={`w-12 h-7 rounded-full p-1 ${storeData?.enable_2fa? "bg-green-500" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.enable_2fa? "translate-x-5" : ""}`}></div></button></div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border-2"><div><p className="text-xs font-black">Login alert via Email?</p></div><button onClick={() => handleToggle("login_alert")} className={`w-12 h-7 rounded-full p-1 ${storeData?.login_alert!== false? "bg-slate-900" : "bg-slate-300"}`}><div className={`w-5 h-5 rounded-full bg-white transition ${storeData?.login_alert!== false? "translate-x-5" : ""}`}></div></button></div>
            </div>
          </div>

          <div className="p-6 rounded-[16px] border-2 border-red-200 bg-red-50 space-y-4">
            <h3 className="font-black text-[14px] text-red-800">Danger Zone - Delete Store</h3>
            <p className="text-xs text-red-700">Deleting your store will permanently remove all products, orders, and settings from EVERYWHERE - Homepage, Search, Store page. This cannot be undone. Your payouts will still be processed for 7 days.</p>
            {!showDeleteConfirm? (
              <button onClick={() => setShowDeleteConfirm(true)} className="px-5 py-3 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700">Delete My Store - Permanent</button>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-white border-2 border-red-200">
                <p className="text-xs font-black text-red-800">Type DELETE to confirm - Case sensitive</p>
                <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="Type DELETE here" className="w-full px-4 py-3 rounded-xl border-2 border-red-200 text-sm font-mono font-bold" />
                <div className="flex gap-2">
                  <button onClick={handleDeleteStore} disabled={deleteText!== "DELETE" || deleting} className="px-5 py-3 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-30 flex items-center gap-2">
                    {deleting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {deleting? "Deleting Everywhere..." : "Confirm Delete - I understand"}
                  </button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }} className="px-5 py-3 rounded-xl bg-slate-100 border-2 text-xs font-bold">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Advanced Settings</h3>
          <div><label className="text-[11px] font-black uppercase">Custom Domain</label><input value={storeData?.custom_domain || ""} onChange={(e) => setStoreData({...storeData, custom_domain: e.target.value })} placeholder="www.yourstore.com" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono" /></div>
          <div><label className="text-[11px] font-black uppercase">Webhook URL</label><input value={storeData?.webhook_url || ""} onChange={(e) => setStoreData({...storeData, webhook_url: e.target.value })} placeholder="https://your-app.com/webhook" className="mt-2 w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 text-sm font-mono" /></div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-3">
        <button onClick={handleLocalSave} disabled={isSaving} className="w-full py-5 rounded-[16px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-50 shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-sm flex items-center justify-center gap-2">
          {isSaving? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Saving...</> : `💾 Save Settings - ${completion.percent}% Complete - Live Now`}
        </button>
        {displayMsg && <div className={`p-4 rounded-xl text-xs font-bold text-center border-2 ${displayMsg.toLowerCase().includes("success") || displayMsg.includes("✅")? "bg-green-50 border-green-300 text-green-800" : displayMsg.includes("❌")? "bg-red-50 border-red-200 text-red-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>{displayMsg}</div>}
      </div>
    </div>
  );
}