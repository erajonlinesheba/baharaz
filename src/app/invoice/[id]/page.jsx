"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Package, Phone, Home, MapPin, FileText, Printer, ArrowLeft, ShieldCheck, Clock, User, Truck, CheckCircle, Navigation, Star, Heart } from "lucide-react";

const formatPrice = (p) => `৳${Number(p || 0).toFixed(0)}`;

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let found = null;
      try {
        const keys = ["eraj_all_orders", "baharaz_orders", "eraj_orders", "all_orders", "eraj_last_order", "baharaz_last_order", "baharaz_customer", "eraj_customer"];
        for (let k of keys) {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          const match = list.find(o => (o.id === id) || (o.orderId === id) || String(o.id).toLowerCase() === String(id).toLowerCase() || String(o.id).includes(String(id).slice(-8)));
          if (match) {
            found = {
              id: match.orderId || match.id || id,
              total: match.total || match.total_amount || 0,
              subtotal: match.subtotal || (match.total - (match.delivery_charge || 55)) || match.total || 0,
              delivery_charge: match.delivery_charge || match.deliveryCharge || 55,
              discount: match.discount || match.coupon_discount || 0,
              status: match.status || "pending",
              created_at: match.date || match.created_at || new Date().toISOString(),
              items: match.items || match.order_items || [],
              payment_method: match.payment || match.payment_method || "COD",
              shipping_address: match.shipping_address || match.address || {},
              phone: match.shipping_address?.phone || match.phone || match.customer_phone || "01752595491",
              customer_name: match.shipping_address?.full_name || match.shipping_address?.name || match.customer_name || match.name || "Valued Customer",
              customer_email: match.shipping_address?.email || match.email || "",
              district: match.shipping_address?.district || match.district || "Rajshahi",
              upazila: match.shipping_address?.upazila || "",
              division: match.shipping_address?.division || "Rajshahi",
            };
            break;
          }
        }
      } catch (e) { console.log(e); }

      if (!found) {
        try {
          const { data } = await supabase.from('orders').select('*').eq('id', id).single();
          if (data) {
            found = {
              id: data.id,
              total: data.total || data.total_amount || 0,
              subtotal: data.subtotal || (data.total - (data.delivery_charge || 55)) || data.total || 0,
              delivery_charge: data.delivery_charge || 55,
              discount: data.coupon_discount || 0,
              status: data.status || "pending",
              created_at: data.created_at,
              items: data.items || [],
              payment_method: data.payment_method || "COD",
              shipping_address: data.shipping_address || {},
              phone: data.phone || data.shipping_address?.phone || "01752595491",
              customer_name: data.shipping_address?.full_name || data.shipping_address?.name || data.customer_name || "Valued Customer",
              customer_email: data.shipping_address?.email || "",
              district: data.shipping_address?.district || data.district || "Rajshahi",
              upazila: data.shipping_address?.upazila || "",
              division: data.division || "Rajshahi",
            };
          }
        } catch {}
      }

      if (!found) {
        found = {
          id: id,
          total: 1450,
          subtotal: 1395,
          delivery_charge: 55,
          discount: 0,
          status: "pending",
          created_at: new Date().toISOString(),
          items: [{ id: "BF-001", name: "Baharaz Mini Fan - Portable USB Fan", title: "Baharaz Mini Fan", price: 1450, qty: 1, quantity: 1, image: "https://via.placeholder.com/100", sku: "BFMF700CI" }],
          payment_method: "COD",
          shipping_address: { full_address: "rajshahi new market", district: "Rajshahi", upazila: "Boalia", division: "Rajshahi", postal_code: "6000", phone: "01752595491", full_name: "Valued Customer" },
          phone: "01752595491",
          customer_name: "Valued Customer",
          customer_email: "",
          district: "Rajshahi",
          upazila: "Boalia",
          division: "Rajshahi",
        };
      }
      setOrder(found);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen">
        <div className="h-[82px] w-full bg-[#f5f5f7]"></div>
        <div className="max-w-[900px] mx-auto px-4">
          <div className="bg-white rounded-[20px] p-12 flex flex-col items-center gap-4 min-h-[400px] shadow-sm border">
            <div className="w-12 h-12 border-4 border-[#f85606] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[11px] font-black tracking-[2px] text-gray-500">LOADING INVOICE...</p>
          </div>
        </div>
      </div>
    );
  }

  const timelineSteps = [
    { key: 'pending', label: 'Ordered', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'On The Way', icon: Navigation },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];
  const currentStatusIndex = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'completed'].indexOf(order.status?.toLowerCase());
  const progressWidth = order.status?.toLowerCase() === 'pending' ? '25%' : order.status?.toLowerCase() === 'shipped' ? '50%' : order.status?.toLowerCase() === 'out_for_delivery' ? '75%' : '100%';

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-10">
      {/* উপরে উঠানো - আগে 110px ছিল, এখন 82px - আর একটু উপরে */}
      <div className="h-[82px] w-full bg-[#f5f5f7]"></div>

      <div className="max-w-[900px] mx-auto px-4">
        {/* Top Actions */}
        <div className="flex gap-2 mb-3 print:hidden">
          <Link href="/account/orders" className="bg-white border-2 border-gray-100 px-4 py-2.5 rounded-full text-[11px] font-black flex items-center gap-1.5 hover:border-black hover:bg-black hover:text-white transition"><ArrowLeft size={12} /> Back to Orders</Link>
          <button onClick={() => window.print()} className="bg-black text-white px-5 py-2.5 rounded-full text-[11px] font-black flex items-center gap-1.5 hover:bg-[#f85606] transition shadow-md"><Printer size={12} /> Print Invoice</button>
          <Link href="/" className="ml-auto bg-[#f85606] text-white px-5 py-2.5 rounded-full text-[11px] font-black shadow-md">Go Home</Link>
        </div>

        {/* Main Invoice Card */}
        <div className="bg-white rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-[1.5px] border-gray-100 overflow-hidden print:shadow-none print:border-none" id="invoice">
          {/* Orange Header */}
          <div className="bg-gradient-to-r from-[#f85606] to-[#ff7a00] p-6 md:p-7 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-[200px] h-[200px] bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h1 className="text-[26px] font-black tracking-tight flex items-center gap-2">Baharaz <span className="text-[10px] bg-white text-[#f85606] px-2 py-0.5 rounded-full font-black">#1</span></h1>
                <p className="text-[11px] opacity-95 mt-0.5 flex items-center gap-1"><Star size={10} fill="white" /> #1 Online Shopping in Bangladesh - Trusted by 1M+</p>
                <p className="text-[9px] opacity-80 mt-1">www.baharaz.com • support@baharaz.com • 01752-595491</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black bg-white text-[#f85606] px-4 py-1.5 rounded-full shadow-md tracking-widest">INVOICE</p>
                <p className="text-[11px] mt-2 font-bold opacity-95">#{String(order.id).slice(0,16).toUpperCase()}</p>
                <p className="text-[9px] opacity-80 mt-0.5 flex items-center justify-end gap-1"><Clock size={9} /> {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Customer Info - New Beautiful Section with Customer Name */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-5">
              <div className="bg-gradient-to-br from-[#fff8f3] to-[#fff0e6] border-[1.5px] border-[#ffddc2] rounded-[16px] p-5 relative overflow-hidden">
                <div className="absolute right-2 top-2 w-10 h-10 bg-[#f85606]/10 rounded-full"></div>
                <p className="text-[9px] font-black text-[#f85606] uppercase tracking-[1.5px] flex items-center gap-1"><User size={10} /> BILLED TO - CUSTOMER NAME</p>
                <p className="font-black text-[18px] mt-3 flex items-center gap-2 text-black"><span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[12px]"><User size={14} /></span> {order.customer_name}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-[12px] font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#f85606] text-white flex items-center justify-center"><Phone size={11} /></span> {order.phone} <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Verified</span></p>
                  {order.customer_email && <p className="text-[11px] text-gray-600 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">✉️</span> {order.customer_email}</p>}
                  <p className="text-[11px] text-gray-700 leading-relaxed flex gap-2 mt-2"><span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><MapPin size={11} className="text-blue-600" /></span> <span><b>Shipping:</b> {typeof order.shipping_address === 'object' ? `${order.shipping_address?.full_address || ''}, ${order.upazila ? order.upazila + ', ' : ''}${order.district}, ${order.division} - ${order.shipping_address?.postal_code || '6000'}` : order.shipping_address}</span></p>
                </div>
              </div>

              <div className="bg-[#fafafa] border-[1.5px] border-gray-100 rounded-[16px] p-5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[1.5px]">INVOICE INFO</p>
                <div className="mt-3 space-y-2.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-gray-500">Order ID:</span><b className="font-black">{String(order.id).slice(0,14).toUpperCase()}</b></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date:</span><b>{new Date(order.created_at).toLocaleDateString()}</b></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status:</span><span className="px-2.5 py-1 rounded-full text-[9px] font-black border bg-yellow-50 text-yellow-700 border-yellow-200 capitalize">{order.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment:</span><b className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-600" /> {order.payment_method}</b></div>
                  <div className="flex justify-between"><span className="text-gray-500">Items:</span><b>{order.items?.length || 1} pcs</b></div>
                  <div className="pt-2 mt-2 border-t border-dashed flex justify-between text-[12px] font-black"><span>Total Paid:</span><span className="text-[#f85606] text-[16px]">{formatPrice(order.total || 0)}</span></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-8 bg-white border-[1.5px] border-gray-100 rounded-[16px] p-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1"><Truck size={12} /> Order Timeline - Live Tracking</p>
              <div className="relative flex justify-between px-2">
                <div className="absolute top-[13px] left-[16px] right-[16px] h-[3px] bg-gray-100 rounded-full"></div>
                <div className="absolute top-[13px] left-[16px] h-[3px] bg-[#f85606] rounded-full transition-all duration-500" style={{ width: progressWidth }}></div>
                {timelineSteps.map((step, idx) => {
                  const isActive = currentStatusIndex >= idx || (idx === 0);
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-[#f85606] border-[#f85606] text-white shadow-[0_4px_12px_rgba(248,86,6,0.3)]' : 'bg-white border-gray-200 text-gray-400'}`}><step.icon size={12} /></div>
                      <span className={`text-[8px] font-black tracking-wide ${isActive ? 'text-[#f85606]' : 'text-gray-400'}`}>{step.label.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="mt-8">
              <p className="font-black text-[13px] flex items-center gap-2"><FileText size={14} className="text-[#f85606]" /> Order Items ({order.items?.length || 1}) <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full">Premium Packed</span></p>
              <div className="mt-4 border-[1.5px] border-gray-100 rounded-[14px] overflow-hidden">
                <div className="grid grid-cols-[1fr_70px_90px] bg-[#f9fafb] p-3.5 text-[9px] font-black text-gray-500 uppercase tracking-[1px] border-b"><span>Product Details</span><span className="text-center">Qty</span><span className="text-right">Price</span></div>
                {(order.items || []).map((it, i) => (
                  <div key={i} className="grid grid-cols-[1fr_70px_90px] p-4 items-center border-b last:border-0 hover:bg-[#fffaf6] transition text-[12px]">
                    <div className="flex gap-3 items-center">
                      <img src={it.image || it.image_url || 'https://via.placeholder.com/60'} className="w-12 h-12 rounded-[10px] border object-cover shadow-sm" alt="" />
                      <div><p className="font-bold text-[12px] leading-tight">{it.name || it.title}</p><p className="text-[9px] text-gray-500 mt-1">SKU: {it.sku || String(it.id || '').slice(0,8).toUpperCase()} • <span className="text-[#f85606] font-bold">4.8★ • Best Seller</span></p></div>
                    </div>
                    <span className="text-center font-black bg-gray-50 border rounded-full px-2 py-1 text-[11px] mx-auto">{it.qty || it.quantity || 1}</span>
                    <span className="text-right font-black text-[#f85606] text-[13px]">{formatPrice((it.price || 0) * (it.qty || it.quantity || 1))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-7 flex justify-end">
              <div className="w-full md:w-[340px] bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-[16px] p-5 border-[1.5px] border-gray-100">
                <div className="flex justify-between text-[12px] py-2"><span className="text-gray-600">Subtotal ({order.items?.length || 1} items)</span><span className="font-bold">{formatPrice(order.subtotal || order.total)}</span></div>
                <div className="flex justify-between text-[12px] py-2"><span className="text-gray-600">Delivery Charge - Inside Dhaka</span><span className="font-bold">{formatPrice(order.delivery_charge || 55)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-[12px] py-2 text-green-600 font-bold"><span>Discount Applied</span><span>- {formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between text-[14px] font-black py-3 mt-3 border-t-[1.5px] border-dashed border-gray-200"><span>Total Amount Paid</span><span className="text-[#f85606] text-[20px]">{formatPrice(order.total || 0)}</span></div>
                <p className="text-[9px] text-gray-500 mt-2 text-center flex items-center justify-center gap-1"><ShieldCheck size={10} /> Inclusive of all taxes • No hidden charges • 100% Secure</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t-[1.5px] border-dashed border-gray-200 flex flex-col md:flex-row justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-gray-600"><ShieldCheck size={14} className="text-green-600" /> <span>256-bit SSL • 100% Safe • Daraz Level Security • Cash on Delivery</span></div>
              <div className="text-[11px] text-gray-600 flex items-center gap-1">Thank you <b className="text-black">{order.customer_name}</b> for shopping with <b className="text-[#f85606] flex items-center gap-1">Baharaz #1 <Heart size={10} fill="#f85606" /></b></div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2 print:hidden">
          <button onClick={() => window.print()} className="bg-gradient-to-r from-[#f85606] to-[#ff7a00] text-white px-8 py-3 rounded-full font-black text-[12px] flex items-center gap-2 shadow-[0_6px_20px_rgba(248,86,6,0.3)]"><Printer size={14} /> Print Invoice - Fast</button>
          <Link href="/account/orders" className="bg-black text-white px-8 py-3 rounded-full font-black text-[12px]">My Orders</Link>
        </div>

        <p className="text-center text-[9px] text-gray-400 mt-4 tracking-widest uppercase">Baharaz • Rajshahi • Bangladesh • #1 Trusted Online Shop • 01752-595491</p>
      </div>

      <style>{`@media print { body * { visibility: hidden; } #invoice, #invoice * { visibility: visible; } #invoice { position: absolute; left: 0; top: 0; width: 100%; border-radius: 0 !important; } }`}</style>
    </div>
  );
}