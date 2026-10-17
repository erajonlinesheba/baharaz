"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Package, MapPin, Calendar, Truck, Search, X, Clock, CheckCircle, XCircle, RotateCcw, FileText, Phone, Home, Navigation, Copy, Check, User, Lock, LogIn } from "lucide-react";

const formatPrice = (price) => `৳${Number(price || 0).toFixed(0)}`;
const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'delivered' || s === 'completed') return 'bg-green-50 text-green-700 border-green-200';
  if (s === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (s === 'cancelled' || s === 'canceled') return 'bg-red-50 text-red-700 border-red-200';
  if (s === 'shipped' || s === 'out_for_delivery') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-orange-50 text-orange-700 border-orange-200';
};

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(''), 3000); };
  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast(`📋 Copied: ${id}`);
    setTimeout(()=> setCopiedId(null), 2000);
  };

  useEffect(() => {
    let mounted = true;
    async function loadAccount() {
      setLoading(true);
      setError("");
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;
        if (!currentUser) {
          if (mounted) {
            setUser(null);
            setOrders([]);
            setLoading(false);
          }
          return;
        }
        if (mounted) setUser(currentUser);
        let mergedOrders = [];
        try {
          const localKeys = ["eraj_all_orders", "baharaz_orders", "eraj_orders", "all_orders", "eraj_last_order"];
          for (let k of localKeys) {
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed)? parsed : [parsed];
            list.forEach(item => {
              if (!item) return;
              if (item.user_id && item.user_id !== currentUser.id) return;
              if (item.email && item.email !== currentUser.email) return;
              if (item.orderId || item.id?.startsWith?.("ERAJ-") || item.id?.startsWith?.("BAH-") || (item.total && item.items)) {
                mergedOrders.push({
                  id: item.orderId || item.id,
                  fullId: item.orderId || item.id,
                  total: item.total || item.total_amount || 0,
                  total_amount: item.total || item.total_amount || 0,
                  status: item.status || "pending",
                  created_at: item.date || item.created_at || new Date().toISOString(),
                  items: item.items || item.order_items || [],
                  order_items: item.items || item.order_items || [],
                  payment_method: item.payment || item.payment_method || "COD",
                  shipping_address: item.shipping_address || item.address || {},
                  delivery_charge: item.delivery_charge || item.deliveryCharge || 55,
                  type: item.type?.toUpperCase() || (item.buyNow? "BUY NOW" : "CART"),
                  phone: item.shipping_address?.phone || item.phone,
                  customer_name: item.shipping_address?.full_name || item.customer_name || currentUser.email?.split('@')[0] || "Customer",
                  subtotal: item.subtotal || 0,
                  discount: item.discount || 0
                });
              }
            });
          }
        } catch (e) { console.log("local read error", e); }

        if (currentUser) {
          try {
            const response = await fetch("/api/orders", {
              headers: { Authorization: `Bearer ${sessionData.session?.access_token || ""}` },
            });
            const data = await response.json();
            if (response.ok) {
              const apiOrders = Array.isArray(data)? data : data.orders || [];
              apiOrders.forEach(o => {
                if (!mergedOrders.find(m => m.id === o.id)) mergedOrders.push({ ...o, fullId: o.id, customer_name: o.shipping_address?.full_name || currentUser.email });
              });
            }
          } catch (e) { console.log("api error", e); }

          try {
            const { data: orderData, error } = await supabase
             .from('orders')
             .select('*')
             .eq('user_id', currentUser.id)
             .order('created_at', { ascending: false })
             .limit(100);
            if (!error && orderData) {
              orderData.forEach(o => {
                if (!mergedOrders.find(m => m.id === o.id)) {
                  mergedOrders.push({
                    id: o.id,
                    fullId: o.id,
                    total: o.total || o.total_amount || 0,
                    total_amount: o.total || o.total_amount || 0,
                    status: o.status || "pending",
                    created_at: o.created_at,
                    items: o.items || [],
                    order_items: o.items || [],
                    payment_method: o.payment_method || "COD",
                    shipping_address: o.shipping_address || {},
                    delivery_charge: o.delivery_charge || 55,
                    phone: o.phone,
                    district: o.district,
                    type: "SUPABASE",
                    customer_name: o.shipping_address?.full_name || currentUser.email?.split('@')[0] || "Customer",
                    subtotal: o.subtotal || 0,
                    discount: o.coupon_discount || 0
                  });
                }
              });
            }
          } catch (e) { console.log("supabase direct error", e); }
        }

        const unique = [];
        const seen = new Set();
        for (let o of mergedOrders) {
          const orderId = o.id || o.orderId;
          if (orderId &&!seen.has(orderId)) {
            seen.add(orderId);
            unique.push({
             ...o,
              id: orderId,
              fullId: orderId,
              total: o.total || o.total_amount || 0,
              total_amount: o.total || o.total_amount || 0,
              status: o.status || "pending",
              created_at: o.created_at || new Date().toISOString(),
              items: o.items || o.order_items || [],
              order_items: o.items || o.order_items || []
            });
          }
        }
        unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (mounted) setOrders(unique);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAccount();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setUser(null);
          setOrders([]);
          setLoading(false);
        }
      }
      if (event === 'SIGNED_IN') {
        loadAccount();
      }
    });
    return () => { 
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (selectedOrder) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderFilter !== 'all') list = list.filter(o => o.status?.toLowerCase() === orderFilter);
    if (typeFilter !== 'all') list = list.filter(o => (o.type || '').toLowerCase().includes(typeFilter.toLowerCase()));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => o.fullId?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q) || o.items?.some(i=> (i.name||i.title||'').toLowerCase().includes(q)));
    }
    return list;
  }, [orders, orderFilter, typeFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o=> o.status?.toLowerCase()==='pending').length,
      delivered: orders.filter(o=> ['delivered','completed'].includes(o.status?.toLowerCase())).length,
      spent: orders.reduce((s,o)=> s + Number(o.total||o.total_amount||0), 0)
    };
  }, [orders]);

  async function reorder(order) {
    try {
      let cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]');
      const items = order.items || order.order_items || [];
      items.forEach(i => {
        cart.push({
          id: i.id || Date.now() + Math.random(),
          title: i.title || i.name,
          name: i.name || i.title,
          price: i.price,
          qty: i.qty || i.quantity || 1,
          image: i.image || i.image_url
        });
      });
      localStorage.setItem('baharaz_cart', JSON.stringify(cart));
      localStorage.setItem('eRajCart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new CustomEvent('cart-cleared'));
      showToast('🛒 Added to Cart - Reorder Success');
      setTimeout(()=> router.push('/cart'), 800);
    } catch (e) {
      router.push('/cart');
    }
  }

  const cancelOrder = async (id) => {
    if(!confirm('Cancel this order?')) return;
    const updated = orders.map(o=> o.id===id? {...o, status:'cancelled'}: o);
    setOrders(updated);
    localStorage.setItem('eraj_all_orders', JSON.stringify(updated));
    showToast('❌ Order Cancelled');
    setSelectedOrder(null);
    try {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    } catch {}
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen pt-[56px]">
        <div className="max-w-[1320px] mx-auto px-4 pt-2">
          <div className="max-w-[900px] mx-auto bg-white rounded-[16px] p-10 flex flex-col items-center justify-center gap-4 shadow-sm min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#f85606] border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] font-black tracking-widest text-gray-500 animate-pulse">LOADING YOUR ORDERS FROM SUPABASE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen pb-10 pt-[56px]">
        <div className="max-w-[900px] mx-auto px-4 pt-2">
          <div className="bg-white rounded-[20px] p-12 text-center border-2 shadow-sm">
            <div className="w-20 h-20 bg-[#fff3e6] border-2 border-[#ffddc2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#f85606]" />
            </div>
            <h2 className="text-[20px] font-black">স্যার দয়া করে লগইন করুন</h2>
            <p className="text-[13px] text-gray-600 mt-3 font-bold leading-relaxed">
              স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏<br />
              <span className="text-[11px] text-gray-500 font-normal">লগইন না করা পর্যন্ত অর্ডার দেখা যাবে না এবং অর্ডার Create হবে না</span>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login?next=/account/orders" className="bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] flex items-center justify-center gap-2 hover:bg-black transition">
                <LogIn size={14} /> Gmail / Number দিয়ে লগইন করুন
              </Link>
              <Link href="/" className="bg-[#f5f5f5] border px-8 py-3 rounded-full font-black text-[13px] hover:bg-black hover:text-white transition">হোমে যান</Link>
            </div>
            <p className="text-[10px] text-gray-400 mt-6">Baharaz #1 • Secure • 01752-595491</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-10 pt-[56px]">
      <div className="max-w-[1320px] mx-auto px-4 pt-2">
        <div className="max-w-[900px] mx-auto">
          {toast && <div style={{zIndex: 2147483647}} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold shadow-xl">{toast}</div>}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase">Total Orders</p>
              <p className="text-[22px] font-black mt-1">{stats.total}</p>
              <p className="text-[11px] text-gray-500">All time orders</p>
            </div>
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-yellow-600 uppercase">Pending</p>
              <p className="text-[22px] font-black mt-1 text-yellow-600">{stats.pending}</p>
              <p className="text-[11px] text-gray-500">To be shipped</p>
            </div>
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-green-600 uppercase">Delivered</p>
              <p className="text-[22px] font-black mt-1 text-green-600">{stats.delivered}</p>
              <p className="text-[11px] text-gray-500">Completed</p>
            </div>
            <div className="bg-gradient-to-br from-[#f85606] to-[#ff8a00] rounded-[14px] p-4 text-white shadow-sm">
              <p className="text-[10px] font-black uppercase opacity-80">Total Spent</p>
              <p className="text-[22px] font-black mt-1">{formatPrice(stats.spent)}</p>
              <p className="text-[11px] opacity-80">Lifetime value</p>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-5 md:p-6 shadow-sm border">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <h2 className="text-[20px] font-black tracking-tight flex items-center gap-2"><Package className="text-[#f85606]" size={20} /> My Orders <span className="text-[11px] bg-black text-white px-3 py-1 rounded-full">{filteredOrders.length} / {orders.length}</span> <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full">{user?.email}</span></h2>
              <div className="relative flex-1 lg:max-w-[280px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} placeholder="Search Full Order ID e.g. ERAJ-17921..." className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-gray-100 text-[12px] font-medium focus:border-[#f85606] outline-none" />
                {searchQuery && <button onClick={()=> setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} /></button>}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase">Status:</span>
                {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(s => <button key={s} onClick={() => setOrderFilter(s)} className={`px-4 py-2 rounded-full text-[11px] font-black capitalize border-2 transition-all ${orderFilter === s? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-[#666] border-gray-100 hover:border-[#f85606] hover:text-[#f85606]'}`}>{s}</button>)}
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase">Type:</span>
                {['all', 'cart', 'buy_now', 'supabase'].map(s => <button key={s} onClick={() => setTypeFilter(s)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold capitalize border transition-all ${typeFilter === s? 'bg-[#f85606] text-white border-[#f85606]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{s.replace('_',' ')}</button>)}
              </div>
            </div>

            {error && <p className="mt-6 rounded-[12px] bg-red-50 p-4 text-red-700 text-[12px] border-2 border-red-200 font-bold">⚠️ {error}</p>}

            {!filteredOrders.length &&!error && (
              <div className="mt-10 text-center border-2 border-dashed border-gray-200 rounded-[20px] py-16 px-6">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                <p className="text-[16px] font-black">No orders in {orderFilter} {searchQuery? `for "${searchQuery}"`:''}</p>
                <p className="text-[13px] opacity-60 mt-2">Checkout করলে Supabase + Local দুই জায়গায় Save হবে - শুধু {user?.email} এর Order</p>
                <Link href="/" className="inline-block mt-6 bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] shadow-lg hover:bg-black transition">Start Shopping Now</Link>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              {filteredOrders.map((order) => (
                <article key={order.fullId} className="rounded-[16px] border-2 border-gray-100 p-5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#f85606]/20 transition-all bg-white group">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap justify-between gap-2 items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="font-black text-[12px] bg-[#fff3e6] border border-[#ffddc2] px-3 py-1.5 rounded-full text-[#f85606]">Order ID: {order.fullId}</p>
                        <button onClick={() => copyId(order.fullId)} className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#f85606] transition">
                          {copiedId === order.fullId ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1"><Calendar size={11} /> {new Date(order.created_at).toLocaleDateString()} {order.type && <span style={{ background: order.type==="SUPABASE"? "#16a34a" : order.type==="BUY NOW"? "#000" : "#f85606", color: "white", fontSize: "9px", padding: "3px 8px", borderRadius: "10px", fontWeight:900 }}>{order.type}</span>}</span>
                      </div>
                      <span className={`h-fit rounded-full px-4 py-1.5 text-[10px] font-black capitalize border-2 ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 flex items-center gap-2 flex-wrap"><span className="flex items-center gap-1"><User size={11} />{order.customer_name}</span> • <MapPin size={11} />{order.shipping_address?.district || order.shipping_address?.city || order.district || 'Rajshahi'} • {order.payment_method || 'COD'} • {order.items?.length || 0} items • Delivery ৳{order.delivery_charge || 55} • <Clock size={11} /> {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {(order.items || []).slice(0,4).map((it, i)=> (
                      <img key={i} src={it.image || it.image_url || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg border object-cover shrink-0" alt="" />
                    ))}
                    {(order.items || []).length > 4 && <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black">+{order.items.length-4}</span>}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-100">
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p><strong className="text-[#f85606] text-[18px]">{formatPrice(order.total || order.total_amount || 0)}</strong> {order.discount>0 && <span className="text-[10px] text-green-600 font-bold ml-2">-৳{order.discount} OFF</span>}</div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setSelectedOrder(order)} className="text-[11px] font-black bg-[#f5f5f5] px-4 py-2 rounded-full hover:bg-black hover:text-white transition border flex items-center gap-1"><FileText size={12} /> View</button>
                      <button onClick={() => reorder(order)} className="text-[11px] font-black bg-[#f85606] text-white px-4 py-2 rounded-full hover:bg-black transition shadow-md flex items-center gap-1"><RotateCcw size={12} /> Reorder</button>
                      <Link href={`/invoice/${order.fullId}`} className="text-[11px] font-black bg-black text-white px-4 py-2 rounded-full hover:bg-[#f85606] transition">Invoice</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '150px 12px 20px 12px', overflowY: 'auto' }} onClick={() => setSelectedOrder(null)}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 90px rgba(0,0,0,0.5)', maxHeight: 'calc(100vh - 160px)', marginTop: '0px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', backgroundColor: 'white', flexShrink: 0 }}>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-[11px] bg-[#fff3e6] border border-[#ffddc2] px-2 py-1 rounded-full text-[#f85606]">ID: {selectedOrder.fullId}</p>
                  <button onClick={() => copyId(selectedOrder.fullId)} className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center"><Copy size={10} /></button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><User size={10} />{selectedOrder.customer_name} • {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ width: '32px', height: '32px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto' }}>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ position: 'absolute', top: '12px', left: '14px', right: '14px', height: '3px', backgroundColor: '#f0f0f0', borderRadius: '999px' }}></div>
                <div style={{ position: 'absolute', top: '12px', left: '14px', height: '3px', backgroundColor: '#f85606', borderRadius: '999px', width: selectedOrder.status?.toLowerCase()==='delivered'||selectedOrder.status?.toLowerCase()==='completed'? '100%' : selectedOrder.status?.toLowerCase()==='shipped'? '66%' : '33%' }}></div>
                {[
                  { key:'pending', label:'Ordered', icon: Package },
                  { key:'shipped', label:'Shipped', icon: Truck },
                  { key:'out_for_delivery', label:'On Way', icon: Navigation },
                  { key:'delivered', label:'Delivered', icon: CheckCircle }
                ].map((step, idx)=> {
                  const active = ['pending','shipped','out_for_delivery','delivered','completed'].indexOf(selectedOrder.status?.toLowerCase()) >= idx;
                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', backgroundColor: active? '#f85606' : 'white', borderColor: active? '#f85606' : '#e5e5e5', color: active? 'white' : '#aaa' }}><step.icon size={11} /></div>
                      <span style={{ fontSize: '7px', fontWeight: 900, color: active? '#f85606' : '#aaa' }}>{step.label.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '10px', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#999' }}>STATUS</p>
                  <span style={{ marginTop: '6px', display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '9px', fontWeight: 900, border: '1px solid #fde68a', backgroundColor: '#fefce8', color: '#a16207' }}>{selectedOrder.status}</span>
                </div>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '10px', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#999' }}>PAYMENT</p>
                  <p style={{ marginTop: '6px', fontWeight: 900, fontSize: '11px' }}>{selectedOrder.payment_method || 'COD'}</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #fff8f3 0%, #ffeee3 100%)', borderRadius: '14px', padding: '12px', border: '1.5px solid #ffddc2', gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '8px', fontWeight: 900, color: '#999' }}>TOTAL PAID • {selectedOrder.fullId}</p>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#f85606', marginTop: '4px' }}>{formatPrice(selectedOrder.total || selectedOrder.total_amount || 0)}</p>
                  <p style={{ fontSize: '9px', color: '#666' }}>Customer: {selectedOrder.customer_name} • Inclusive of all taxes</p>
                </div>
              </div>
              <div style={{ border: '1.5px solid #f0f0f0', borderRadius: '14px', padding: '12px', marginBottom: '12px' }}>
                <p style={{ fontWeight: 900, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}><Home size={11} /> Shipping • {selectedOrder.customer_name} <span style={{ fontSize: '8px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '999px' }}>Verified</span></p>
                <div style={{ marginTop: '10px', backgroundColor: '#f9fafb', borderRadius: '10px', padding: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={10} style={{ color: '#f85606' }} /> {selectedOrder.shipping_address?.phone || selectedOrder.phone || 'N/A'}</p>
                  <p style={{ fontSize: '10px', color: '#555', marginTop: '6px', lineHeight: '1.5' }}>{typeof selectedOrder.shipping_address === 'object'? `${selectedOrder.shipping_address?.full_address || ''}, ${selectedOrder.shipping_address?.upazila || ''}, ${selectedOrder.shipping_address?.district || ''}, ${selectedOrder.shipping_address?.division || ''}` : (selectedOrder.shipping_address || 'Rajshahi, BD')}</p>
                </div>
              </div>
              <div style={{ border: '1.5px solid #f0f0f0', borderRadius: '14px', padding: '12px' }}>
                <p style={{ fontWeight: 900, fontSize: '11px' }}>Items ({selectedOrder.items?.length || 0})</p>
                {(selectedOrder.items || []).map((it, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i === (selectedOrder.items.length-1) ? 'none' : '1px dashed #eee', alignItems: 'center' }}>
                    <img src={it.image || it.image_url || 'https://via.placeholder.com/50'} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #eee', objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name || it.title}</p><p style={{ fontSize: '9px', color: '#888' }}>Qty {it.qty || it.quantity || 1} × {formatPrice(it.price)}</p></div>
                    <span style={{ fontWeight: 900, fontSize: '11px', color: '#f85606' }}>{formatPrice((it.price||0)*(it.qty||it.quantity||1))}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => { setSelectedOrder(null); reorder(selectedOrder); }} style={{ flex: 1, backgroundColor: '#f85606', color: 'white', padding: '13px', borderRadius: '999px', fontWeight: 900, fontSize: '12px', border: 'none' }}>Reorder Now</button>
                <Link href={`/invoice/${selectedOrder.fullId}`} style={{ flex: 1, backgroundColor: 'black', color: 'white', padding: '13px', borderRadius: '999px', fontWeight: 900, fontSize: '12px', textAlign: 'center', textDecoration: 'none' }}>Invoice</Link>
              </div>
              {selectedOrder.status?.toLowerCase()==='pending' && <button onClick={()=> cancelOrder(selectedOrder.id)} style={{ width: '100%', marginTop: '8px', backgroundColor: 'white', border: '1.5px solid #fecaca', color: '#dc2626', padding: '10px', borderRadius: '999px', fontWeight: 900, fontSize: '11px' }}>Cancel Order</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}