"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  Search,
  X,
  Clock,
  CheckCircle,
  RotateCcw,
  FileText,
  Phone,
  Home,
  Navigation,
  Copy,
  Check,
  User,
  Lock,
  LogIn,
  Headset,
  Star,
  ShieldCheck,
  Ban,
  DollarSign,
  Info,
  Gift,
  AlertTriangle
} from "lucide-react";

const formatPrice = (price) => `৳${Number(price || 0).toFixed(0)}`;

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'delivered' || s === 'completed') {
    return 'bg-green-50 text-green-700 border-green-200';
  }
  if (s === 'pending' || s === 'to_pay') {
    return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
  if (s === 'cancelled' || s === 'canceled') {
    return 'bg-red-50 text-red-700 border-red-200';
  }
  if (s === 'shipped' || s === 'to_ship' || s === 'out_for_delivery' || s === 'to_receive') {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  return 'bg-orange-50 text-orange-700 border-orange-200';
};

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter")?.toLowerCase() || 'all';
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState(
    initialFilter === 'to pay' ? 'pending' : 
    initialFilter === 'to ship' ? 'shipped' : 
    initialFilter === 'to receive' ? 'to_receive' : 
    initialFilter === 'to review' ? 'delivered' : 'all'
  );
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const supabase = createClient();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast(`📋 Copied: ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      if (!mounted) {
        return;
      }
      setError("");

      try {
        const cachedUser = localStorage.getItem("baharaz_user_cache") || localStorage.getItem("eraj_user_cache");
        if (cachedUser && mounted) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch {}
        }

        const localKeys = [
          "eraj_all_orders",
          "baharaz_orders",
          "eraj_orders",
          "all_orders",
          "eraj_last_order"
        ];

        let quickOrders = [];

        for (let k of localKeys) {
          const raw = localStorage.getItem(k);
          if (!raw) {
            continue;
          }
          try {
            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed) ? parsed : [parsed];
            list.forEach(item => {
              if (!item) {
                return;
              }
              if (item.orderId || item.id) {
                quickOrders.push({
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
                  type: item.type?.toUpperCase() || (item.buyNow ? "BUY NOW" : "CART"),
                  phone: item.shipping_address?.phone || item.phone,
                  customer_name: item.shipping_address?.full_name || item.customer_name || "Customer",
                  subtotal: item.subtotal || 0,
                  discount: item.discount || 0
                });
              }
            });
          } catch {}
        }

        if (quickOrders.length > 0 && mounted) {
          const seen = new Set();
          const uniq = [];
          quickOrders.forEach(o => {
            if (!seen.has(o.id)) {
              seen.add(o.id);
              uniq.push(o);
            }
          });
          uniq.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setOrders(uniq);
        }
      } catch {}

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user || null;

        if (!currentUser) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        if (mounted) {
          setUser(currentUser);
        }

        localStorage.setItem("baharaz_user_cache", JSON.stringify(currentUser));

        let mergedOrders = [...orders];

        try {
          const response = await fetch("/api/orders", {
            headers: {
              Authorization: `Bearer ${sessionData.session?.access_token || ""}`
            },
          });

          const data = await response.json();

          if (response.ok) {
            const apiOrders = Array.isArray(data) ? data : data.orders || [];
            apiOrders.forEach(o => {
              if (!mergedOrders.find(m => m.id === o.id)) {
                mergedOrders.push({
                  ...o,
                  fullId: o.id,
                  customer_name: o.shipping_address?.full_name || currentUser.email
                });
              }
            });
          }
        } catch (e) {
          console.log("api error", e);
        }

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
        } catch (e) {
          console.log("supabase direct error", e);
        }

        try {
          const localKeys = [
            "eraj_all_orders",
            "baharaz_orders",
            "eraj_orders",
            "all_orders",
            "eraj_last_order"
          ];

          for (let k of localKeys) {
            const raw = localStorage.getItem(k);
            if (!raw) {
              continue;
            }

            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed) ? parsed : [parsed];

            list.forEach(item => {
              if (!item) {
                return;
              }
              if (item.user_id && item.user_id !== currentUser.id) {
                return;
              }
              if (item.email && item.email !== currentUser.email) {
                return;
              }

              if (item.orderId || item.id?.startsWith?.("ERAJ-") || item.id?.startsWith?.("BAH-") || (item.total && item.items)) {
                const id = item.orderId || item.id;

                if (!mergedOrders.find(m => m.id === id)) {
                  mergedOrders.push({
                    id: id,
                    fullId: id,
                    total: item.total || item.total_amount || 0,
                    total_amount: item.total || item.total_amount || 0,
                    status: item.status || "pending",
                    created_at: item.date || item.created_at || new Date().toISOString(),
                    items: item.items || item.order_items || [],
                    order_items: item.items || item.order_items || [],
                    payment_method: item.payment || item.payment_method || "COD",
                    shipping_address: item.shipping_address || item.address || {},
                    delivery_charge: item.delivery_charge || item.deliveryCharge || 55,
                    type: item.type?.toUpperCase() || (item.buyNow ? "BUY NOW" : "CART"),
                    phone: item.shipping_address?.phone || item.phone,
                    customer_name: item.shipping_address?.full_name || item.customer_name || currentUser.email?.split('@')[0] || "Customer",
                    subtotal: item.subtotal || 0,
                    discount: item.discount || 0
                  });
                }
              }
            });
          }
        } catch (e) {
          console.log("local read error", e);
        }

        const unique = [];
        const seen = new Set();

        for (let o of mergedOrders) {
          const orderId = o.id || o.orderId;
          if (orderId && !seen.has(orderId)) {
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

        if (mounted) {
          setOrders(unique);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      }
    }

    loadAccount();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) {
          setUser(null);
          setOrders([]);
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
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    let list = orders;

    if (orderFilter !== 'all') {
      if (orderFilter === 'to_receive') {
        list = list.filter(o => ['shipped', 'out_for_delivery', 'to_receive'].includes(o.status?.toLowerCase()));
      } else {
        list = list.filter(o => o.status?.toLowerCase() === orderFilter || (orderFilter === 'pending' && o.status?.toLowerCase() === 'to_pay'));
      }
    }

    if (typeFilter !== 'all') {
      list = list.filter(o => (o.type || '').toLowerCase().includes(typeFilter.toLowerCase()));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o =>
        o.fullId?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q) ||
        o.items?.some(i => (i.name || i.title || '').toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, orderFilter, typeFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'to_pay'].includes(o.status?.toLowerCase())).length,
      shipped: orders.filter(o => ['shipped', 'to_ship', 'processing'].includes(o.status?.toLowerCase())).length,
      toReceive: orders.filter(o => ['shipped', 'out_for_delivery', 'to_receive'].includes(o.status?.toLowerCase())).length,
      delivered: orders.filter(o => ['delivered', 'completed'].includes(o.status?.toLowerCase())).length,
      spent: orders.reduce((s, o) => s + Number(o.total || o.total_amount || 0), 0)
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
      window.dispatchEvent(new Event('cart-update'));
      window.dispatchEvent(new CustomEvent('cart-cleared'));
      showToast('🛒 Added to Cart - Reorder Success');
      setTimeout(() => router.push('/cart'), 800);
    } catch (e) {
      router.push('/cart');
    }
  }

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order? আপনি কি অর্ডার Cancel করতে চান?')) {
      return;
    }

    const updated = orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o);
    setOrders(updated);
    localStorage.setItem('baharaz_orders', JSON.stringify(updated));
    localStorage.setItem('eraj_all_orders', JSON.stringify(updated));
    showToast('❌ Order Cancelled');
    setSelectedOrder(null);

    try {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    } catch {}
  };

  if (!user) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen pb-10">
        <div className="max-w-[900px] mx-auto px-4 pt-2">
          <div className="bg-white rounded-[20px] p-12 text-center border-2 shadow-sm">
            <div className="w-20 h-20 bg-[#fff3e6] border-2 border-[#ffddc2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#f85606]" />
            </div>
            <h2 className="text-[20px] font-black">স্যার দয়া করে লগইন করুন</h2>
            <p className="text-[13px] text-gray-600 mt-3 font-bold leading-relaxed">
              স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏<br />
              <span className="text-[11px] text-gray-500 font-normal">লগইন না করা পর্যন্ত অর্ডার দেখা যাবে না</span>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login?next=/account/orders"
                className="bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] flex items-center justify-center gap-2 hover:bg-black transition"
              >
                <LogIn size={14} /> Gmail / Number দিয়ে লগইন করুন
              </Link>
              <Link
                href="/"
                className="bg-[#f5f5f5] border px-8 py-3 rounded-full font-black text-[13px] hover:bg-black hover:text-white transition"
              >
                হোমে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-10">
      <div className="max-w-[1320px] mx-auto px-4 pt-2">
        <div className="max-w-[900px] mx-auto">

          {toast && (
            <div
              style={{ zIndex: 2147483647 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold shadow-xl"
            >
              {toast}
            </div>
          )}

          <div className="bg-white rounded-[14px] p-2 border shadow-sm mb-3 flex gap-1 overflow-x-auto">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'pending', label: 'To Pay', count: stats.pending },
              { key: 'shipped', label: 'To Ship', count: stats.shipped },
              { key: 'to_receive', label: 'To Receive', count: stats.toReceive },
              { key: 'delivered', label: 'To Review', count: stats.delivered },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setOrderFilter(t.key)}
                className={`flex-1 min-w-[70px] px-3 py-2.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${orderFilter === t.key ? 'bg-[#f85606] text-white shadow-md' : 'bg-[#f5f5f5] text-[#666] hover:bg-black hover:text-white'}`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${orderFilter === t.key ? 'bg-white text-[#f85606]' : 'bg-black text-white'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase">Total Orders</p>
              <p className="text-[22px] font-black mt-1">{stats.total}</p>
              <p className="text-[11px] text-gray-500">All time</p>
            </div>
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-yellow-600 uppercase">Pending</p>
              <p className="text-[22px] font-black mt-1 text-yellow-600">{stats.pending}</p>
              <p className="text-[11px] text-gray-500">To be paid</p>
            </div>
            <div className="bg-white rounded-[14px] p-4 border shadow-sm">
              <p className="text-[10px] font-black text-blue-600 uppercase">To Receive</p>
              <p className="text-[22px] font-black mt-1 text-blue-600">{stats.toReceive}</p>
              <p className="text-[11px] text-gray-500">On the way</p>
            </div>
            <div className="bg-gradient-to-br from-[#f85606] to-[#ff8a00] rounded-[14px] p-4 text-white shadow-sm">
              <p className="text-[10px] font-black uppercase opacity-80">Total Spent</p>
              <p className="text-[22px] font-black mt-1">{formatPrice(stats.spent)}</p>
              <p className="text-[11px] opacity-80">Lifetime value</p>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-5 md:p-6 shadow-sm border">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <h2 className="text-[18px] font-black tracking-tight flex items-center gap-2">
                <Package className="text-[#f85606]" size={18} />
                My Orders - Baharaz
                <span className="text-[10px] bg-black text-white px-2.5 py-1 rounded-full">
                  {filteredOrders.length}/{orders.length}
                </span>
              </h2>
              <div className="relative flex-1 lg:max-w-[280px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Order ID..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border-2 border-gray-100 text-[12px] font-medium focus:border-[#f85606] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-6 rounded-[12px] bg-red-50 p-4 text-red-700 text-[12px] border-2 border-red-200 font-bold">
                ⚠️ {error}
              </p>
            )}

            {!filteredOrders.length && !error && (
              <div className="mt-10 text-center border-2 border-dashed border-gray-200 rounded-[20px] py-16 px-6">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📦
                </div>
                <p className="text-[16px] font-black">No orders in {orderFilter}</p>
                <p className="text-[13px] opacity-60 mt-2">Checkout করলে এখানে দেখাবে - শুধু {user?.email} এর Order</p>
                <Link
                  href="/"
                  className="inline-block mt-6 bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] shadow-lg hover:bg-black transition"
                >
                  Start Shopping Now - Baharaz
                </Link>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              {filteredOrders.map((order) => (
                <article
                  key={order.fullId}
                  className="rounded-[16px] border-2 border-gray-100 p-5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#f85606]/20 transition-all bg-white group"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap justify-between gap-2 items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="font-black text-[11px] bg-[#fff3e6] border border-[#ffddc2] px-3 py-1.5 rounded-full text-[#f85606]">
                          Order ID: {order.fullId}
                        </p>
                        <button
                          onClick={() => copyId(order.fullId)}
                          className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#f85606] transition"
                        >
                          {copiedId === order.fullId ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar size={11} /> {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`h-fit rounded-full px-4 py-1.5 text-[10px] font-black capitalize border-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {order.customer_name}
                      </span>
                      •
                      <MapPin size={11} />
                      {order.shipping_address?.district || order.district || 'Rajshahi'}
                      •
                      {order.payment_method || 'COD'}
                      •
                      {order.items?.length || 0} items
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {(order.items || []).slice(0, 4).map((it, i) => (
                      <img
                        key={i}
                        src={it.image || it.image_url || 'https://via.placeholder.com/40'}
                        className="w-10 h-10 rounded-lg border object-cover shrink-0"
                        alt=""
                      />
                    ))}
                    {(order.items || []).length > 4 && (
                      <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-3 mt-4 pt-4 border-t border-dashed border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p>
                      <strong className="text-[#f85606] text-[18px]">
                        {formatPrice(order.total || order.total_amount || 0)}
                      </strong>
                      <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-1">
                        <ShieldCheck size={10} className="text-green-600" />
                        7 Days Return • Free Delivery
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap items-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[11px] font-black bg-[#f5f5f5] px-4 py-2 rounded-full hover:bg-black hover:text-white transition border flex items-center gap-1"
                      >
                        <FileText size={12} /> View
                      </button>

                      {order.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-[11px] font-black bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition flex items-center gap-1"
                        >
                          <Ban size={12} /> Cancel
                        </button>
                      )}

                      <button
                        onClick={() => reorder(order)}
                        className="text-[11px] font-black bg-[#f85606] text-white px-4 py-2 rounded-full hover:bg-black transition shadow-md flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Reorder
                      </button>

                      <Link
                        href={`/invoice/${order.fullId}`}
                        className="text-[11px] font-black bg-black text-white px-4 py-2 rounded-full hover:bg-[#f85606] transition"
                      >
                        Invoice
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FINAL - 5 Point নিচে + Mobile ছোট 360px Web বড় 520px + Cancel বাইরে */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[99999]">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setSelectedOrder(null)}
          ></div>

          <div className="fixed top-[187px] md:top-[140px] left-0 right-0 bottom-0 flex justify-center items-start overflow-y-auto px-3 pb-6 pointer-events-none">
            <div
              className="pointer-events-auto w-full bg-white rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden max-w-[360px] max-h-[calc(100vh-200px)] md:max-w-[520px] md:max-h-[calc(100vh-155px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-2.5 flex justify-between items-center border-b bg-white shrink-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] md:text-[11px] font-black bg-[#fff3e6] border border-[#ffddc2] px-2.5 py-1 rounded-full text-[#f85606]">
                    ID: {selectedOrder.fullId?.slice(0, 12)}
                  </p>
                  <button
                    onClick={() => copyId(selectedOrder.fullId)}
                    className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    <Copy size={10} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
                <div className="relative flex justify-between">
                  <div className="absolute top-[10px] left-[12px] right-[12px] h-[2px] bg-[#f0f0f0] rounded-full"></div>
                  <div
                    className="absolute top-[10px] left-[12px] h-[2px] bg-[#f85606] rounded-full"
                    style={{
                      width: selectedOrder.status?.toLowerCase() === 'delivered' || selectedOrder.status?.toLowerCase() === 'completed' ? '100%' :
                        selectedOrder.status?.toLowerCase() === 'shipped' || selectedOrder.status?.toLowerCase() === 'out_for_delivery' ? '66%' : '33%'
                    }}
                  ></div>
                  {[
                    { key: 'pending', label: 'Ordered', icon: Package },
                    { key: 'shipped', label: 'Shipped', icon: Truck },
                    { key: 'out_for_delivery', label: 'On Way', icon: Navigation },
                    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
                  ].map((step, idx) => {
                    const active = ['pending', 'shipped', 'out_for_delivery', 'delivered', 'completed'].indexOf(selectedOrder.status?.toLowerCase()) >= idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-1 z-10">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 ${active ? 'bg-[#f85606] border-[#f85606] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                          <step.icon size={12} />
                        </div>
                        <span className={`text-[7px] md:text-[8px] font-black ${active ? 'text-[#f85606]' : 'text-gray-400'}`}>
                          {step.label.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-3 border">
                    <p className="text-[7px] font-black text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> STATUS
                    </p>
                    <p className="text-[11px] md:text-[13px] font-black mt-1 capitalize">
                      {selectedOrder.status}
                    </p>
                    <p className="text-[8px] text-gray-500 mt-1">
                      Est. {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border">
                    <p className="text-[7px] font-black text-gray-400 flex items-center gap-1">
                      <DollarSign size={10} /> PAYMENT
                    </p>
                    <p className="text-[11px] md:text-[13px] font-black mt-1">
                      {selectedOrder.payment_method || 'COD'}
                    </p>
                    <p className="text-[8px] text-green-600 font-bold flex items-center gap-1">
                      <ShieldCheck size={8} /> Secure
                    </p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-br from-[#fff8f3] to-[#ffeee3] border border-[#ffddc2] rounded-xl p-3">
                    <p className="text-[7px] font-black text-gray-500">
                      TOTAL PAID - BAHARAZ • {selectedOrder.items?.length || 0} Items
                    </p>
                    <div className="flex justify-between items-end">
                      <p className="text-[20px] md:text-[24px] font-black text-[#f85606]">
                        {formatPrice(selectedOrder.total || selectedOrder.total_amount || 0)}
                      </p>
                      <p className="text-[8px] text-gray-600">
                        Subtotal {formatPrice(selectedOrder.subtotal || selectedOrder.total)} • Delivery {formatPrice(selectedOrder.delivery_charge || 55)}
                      </p>
                    </div>
                    <p className="text-[9px] md:text-[10px] text-gray-600">
                      Customer: {selectedOrder.customer_name} • {selectedOrder.shipping_address?.district || 'Rajshahi'}
                    </p>
                  </div>
                </div>

                <div className="border rounded-xl p-3 bg-white">
                  <p className="text-[11px] md:text-[12px] font-black flex items-center gap-1">
                    <Home size={11} /> Shipping • {selectedOrder.customer_name}
                    <span className="ml-auto text-[8px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </p>
                  <div className="mt-2 bg-gray-50 rounded-lg p-2.5 border border-dashed">
                    <p className="text-[11px] font-bold flex items-center gap-1">
                      <Phone size={10} className="text-[#f85606]" />
                      {selectedOrder.shipping_address?.phone || selectedOrder.phone || 'N/A'} • {selectedOrder.shipping_address?.district || 'Rajshahi'}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                      {typeof selectedOrder.shipping_address === 'object'
                        ? `${selectedOrder.shipping_address?.full_address || ''}, ${selectedOrder.shipping_address?.upazila || ''}, ${selectedOrder.shipping_address?.district || ''}, Bangladesh`
                        : (selectedOrder.shipping_address || 'Rajshahi, BD')}
                    </p>
                  </div>
                </div>

                <div className="border rounded-xl p-3">
                  <p className="text-[11px] md:text-[12px] font-black flex items-center justify-between">
                    Items ({selectedOrder.items?.length || 0}) - Baharaz
                    <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full">Baharaz Mall</span>
                  </p>
                  {(selectedOrder.items || []).map((it, i) => (
                    <div key={i} className="flex gap-2 py-2.5 border-b last:border-0 border-dashed items-center">
                      <img
                        src={it.image || it.image_url || 'https://via.placeholder.com/40'}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg border object-cover"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] md:text-[13px] font-bold truncate">
                          {it.name || it.title}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-gray-500">
                          Qty {it.qty || it.quantity || 1} × {formatPrice(it.price)} • <span className="text-green-600 font-bold">7 Days Return</span>
                        </p>
                      </div>
                      <span className="text-[11px] md:text-[13px] font-black text-[#f85606]">
                        {formatPrice((it.price || 0) * (it.qty || it.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="border rounded-xl p-2.5 flex items-center gap-2 hover:bg-gray-50 transition">
                    <Headset size={14} className="text-[#f85606]" />
                    <div className="text-left">
                      <p className="text-[10px] font-black">Help Center</p>
                      <p className="text-[8px] text-gray-500">Chat with us</p>
                    </div>
                  </button>
                  <button className="border rounded-xl p-2.5 flex items-center gap-2 hover:bg-gray-50 transition">
                    <Star size={14} className="text-yellow-500" />
                    <div className="text-left">
                      <p className="text-[10px] font-black">Rate Order</p>
                      <p className="text-[8px] text-gray-500">Give Review</p>
                    </div>
                  </button>
                  <div className="col-span-2 border rounded-xl p-2.5 flex items-center gap-2 bg-yellow-50 border-yellow-200">
                    <Info size={14} className="text-yellow-600" />
                    <p className="text-[9px] font-bold text-yellow-800">FREE Delivery ৳499+ • 7 Days Return • Flash Sale Active</p>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-4 border-t bg-white shrink-0 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedOrder(null); reorder(selectedOrder); }}
                    className="flex-1 bg-[#f85606] text-white py-3 md:py-3.5 rounded-full font-black text-[12px] md:text-[13px] hover:bg-black transition"
                  >
                    Reorder Now
                  </button>
                  <Link
                    href={`/invoice/${selectedOrder.fullId}`}
                    className="flex-1 bg-black text-white py-3 md:py-3.5 rounded-full font-black text-[12px] md:text-[13px] text-center hover:bg-[#f85606] transition"
                  >
                    Invoice
                  </Link>
                </div>
                {selectedOrder.status?.toLowerCase() === 'pending' && (
                  <button
                    onClick={() => cancelOrder(selectedOrder.id)}
                    className="w-full py-2.5 rounded-full border-2 border-red-200 text-red-600 font-black text-[11px] bg-white hover:bg-red-50 transition"
                  >
                    Cancel Order • View এর পাশে বাইরেও আছে
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function OrdersPageSkeleton() {
  return <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div></div>;
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersPageContent />
    </Suspense>
  );
}
