"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Star, MessageCircle, Award, Verified } from "lucide-react";

export default function ReviewsPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data?.session?.user;
      if (!currentUser) return;
      setUser(currentUser);
      const { data: orderData } = await supabase.from('orders').select('*').eq('user_id', currentUser.id).eq('status', 'delivered');
      if (orderData) setOrders(orderData);
    });
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm min-h-[600px]">
      <h2 className="text-[22px] font-black flex items-center gap-2"><Star className="text-yellow-500 fill-yellow-500" /> My Reviews • {displayName}</h2>
      <p className="text-[12px] text-gray-500 mt-2">Rate your delivered orders and earn 50 points per review!</p>

      <div className="mt-8 space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border-2 border-gray-100 rounded-[14px] p-5 flex justify-between items-center hover:shadow-md transition bg-gradient-to-r from-white to-[#fafafa]">
            <div><p className="font-bold text-[13px]">Order #{String(order.id).slice(0,8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString()}</p><p className="text-[11px] text-gray-500 mt-1">Delivered • {order.order_items?.length || 1} items</p><div className="flex gap-1 mt-2">{[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-gray-200" />)}</div></div>
            <button className="bg-[#f85606] text-white px-5 py-2 rounded-full text-[11px] font-black hover:bg-black transition flex items-center gap-1"><MessageCircle size={12}/> Write Review +50 Points</button>
          </div>
        ))}
        {!orders.length && (
          <div className="text-center py-16 border-2 border-dashed rounded-[20px] bg-[#fafafa]">
            <p className="text-4xl">⭐</p>
            <p className="font-black text-[15px] mt-3">No reviews yet</p>
            <p className="text-[12px] opacity-60 mt-1">Hi {displayName}, after delivery you can review products and earn loyalty points!</p>
            <p className="text-[11px] bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full inline-block mt-3 border border-yellow-200"><Award size={10} className="inline mr-1"/> 50 points per review • Verified Buyer Badge <Verified size={10} className="inline ml-1"/></p>
          </div>
        )}
      </div>
    </div>
  );
}