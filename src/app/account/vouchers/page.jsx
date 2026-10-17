"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Ticket, Crown, Copy, Gift, Sparkles, Star, Wallet, Award } from "lucide-react";

export default function PaymentPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) { window.location.href = "/login"; return; }
      setUser(currentUser);
      const { data: orderData } = await supabase.from('orders').select('*').eq('user_id', currentUser.id);
      if (orderData) setOrders(orderData);
      setLoading(false);
    }
    load();
  }, []);

  const copyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) return <div className="bg-white rounded-[12px] p-10 text-center shadow-sm">Loading Vouchers...</div>;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const memberTier = orders.length > 10? 'Platinum' : orders.length > 3? 'Gold' : 'Silver';
  const totalPoints = orders.length * 100;
  const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || Number(o.total_amount) || 0), 0);

  const vouchers = [
    { code: "WELCOME100", discount: "100TK OFF", condition: "Above ৳1000", color: "orange", bg: "bg-[#fffaf5]", border: "border-orange-300", text: "text-[#f85606]" },
    { code: "FREESHIP", discount: "FREE DELIVERY", condition: "All Orders", color: "green", bg: "bg-[#f6fff6]", border: "border-green-300", text: "text-[#2e7d32]" },
    { code: "BAHARAZ50", discount: "50TK OFF", condition: "Above ৳500", color: "blue", bg: "bg-[#f5f8ff]", border: "border-blue-300", text: "text-blue-700" },
    { code: `${memberTier.toUpperCase()}20`, discount: "20% OFF", condition: `${memberTier} Members Only`, color: "purple", bg: "bg-[#faf5ff]", border: "border-purple-300", text: "text-purple-700" },
  ];

  return (
    <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm min-h-[600px]">
      <h2 className="text-[22px] font-black flex items-center gap-2"><Ticket className="text-[#f85606]"/> Vouchers & Loyalty • {displayName}</h2>
      <p className="text-[12px] text-gray-500 mt-1">You have {memberTier} status - Enjoy exclusive benefits!</p>

      <div className="bg-gradient-to-r from-[#f85606] via-[#ff6a00] to-[#ff8a00] text-white rounded-[20px] p-6 md:p-8 mt-6 shadow-[0_12px_30px_rgba(248,86,6,0.4)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
        <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-[11px] opacity-80 tracking-[2px] font-black flex items-center gap-2"><Crown size={12}/> LOYALTY POINTS - BAHARAZ {memberTier.toUpperCase()} CLUB • {displayName.toUpperCase()}</p>
            <p className="text-[44px] font-black mt-3 flex items-baseline gap-2">{totalPoints} <span className="text-[18px] font-bold">Points</span> <Sparkles size={18} className="text-yellow-200" /></p>
            <div className="flex gap-6 mt-2">
              <div><p className="text-[10px] opacity-70 uppercase tracking-widest">Total Spent</p><p className="text-[14px] font-black">৳{totalSpent.toLocaleString()}</p></div>
              <div><p className="text-[10px] opacity-70 uppercase tracking-widest">Total Orders</p><p className="text-[14px] font-black">{orders.length} Orders</p></div>
              <div><p className="text-[10px] opacity-70 uppercase tracking-widest">Value</p><p className="text-[14px] font-black">৳{Math.floor(totalPoints / 10)} Discount</p></div>
            </div>
            <p className="text-[11px] mt-4 opacity-90 font-medium bg-black/20 inline-block px-3 py-1 rounded-full">100 points = ৳10 discount • {displayName} you have {memberTier} status!</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1"><Gift size={10}/> Free Shipping</span>
              <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1"><Award size={10}/> Priority Support</span>
              <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1"><Star size={10}/> Early Access</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-[14px] flex items-center justify-center shadow-inner"><Crown size={28} className="text-white"/></div>
        </div>
        <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${Math.min((orders.length / 15) * 100, 100)}%` }}></div>
        </div>
        <p className="text-[10px] mt-2 opacity-80">{15 - orders.length > 0? `${15 - orders.length} more orders to reach Platinum!` : "You are Platinum! Max benefits unlocked!"}</p>
      </div>

      <h3 className="font-black text-[15px] mt-8 flex items-center gap-2"><Gift size={16} className="text-[#f85606]" /> Available Vouchers for {displayName}</h3>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {vouchers.map((v, i) => (
          <div key={i} className={`border-dashed border-2 ${v.border} rounded-[16px] p-5 text-center hover:border-[#f85606] hover:bg-[#fff1eb] transition-all ${v.bg} group hover:scale-[1.02] hover:shadow-lg`}>
            <p className={`font-black ${v.text} text-[18px] tracking-widest`}>{v.code}</p>
            <p className="text-[13px] font-black mt-1">{v.discount}</p>
            <p className="text-[11px] opacity-60 mt-1">{v.condition} • For {displayName}</p>
            <button onClick={()=>copyVoucher(v.code)} className="mt-4 text-[11px] font-black bg-black text-white px-5 py-2 rounded-full flex items-center gap-2 mx-auto hover:bg-[#f85606] transition shadow-md">
              <Copy size={12}/>{copiedCode===v.code? 'COPIED! ✓' : 'COPY CODE'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#fafafa] rounded-[12px] border">
        <p className="text-[12px] font-black flex items-center gap-2"><Wallet size={14} className="text-[#f85606]" /> How to use Vouchers - {displayName}?</p>
        <ul className="text-[11px] text-gray-600 mt-2 space-y-1 list-disc pl-4">
          <li>Copy voucher code and apply at checkout page</li>
          <li>100 Loyalty Points = ৳10 instant discount - auto applied</li>
          <li>{memberTier} members get extra 5-20% off + free shipping</li>
          <li>Points earned after delivered orders - {orders.length * 100} points available</li>
        </ul>
      </div>
    </div>
  );
}