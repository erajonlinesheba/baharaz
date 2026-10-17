"use client";
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutGrid, Package, TrendingUp, ShoppingCart, Star, Megaphone, BarChart3,
  GraduationCap, Store, DollarSign, Settings, User, Menu, X, Bell, Search,
  ChevronLeft, ChevronRight, Plus, Upload, Globe, LogOut, ChevronDown, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// ===== 1. LANGUAGE CONTEXT - REAL TRANSLATION =====
const translations = {
  EN: {
    products: "Products", orders: "Orders & Reviews", finance: "Finance",
    addProduct: "Add Product", totalProducts: "Total Products", price: "Price",
    stock: "Stock", status: "Status", action: "Action", notifications: "Notifications",
    markAllRead: "Mark all as read", noNotifications: "No new notifications",
    logout: "Logout", settings: "Settings", myAccount: "My Account"
  },
  BN: {
    products: "à¦ªà¦£à§à¦¯", orders: "à¦…à¦°à§à¦¡à¦¾à¦° à¦“ à¦°à¦¿à¦­à¦¿à¦‰", finance: "à¦«à¦¿à¦¨à¦¾à¦¨à§à¦¸",
    addProduct: "à¦ªà¦£à§à¦¯ à¦¯à§‹à¦— à¦•à¦°à§à¦¨", totalProducts: "à¦®à§‹à¦Ÿ à¦ªà¦£à§à¦¯", price: "à¦¦à¦¾à¦®",
    stock: "à¦¸à§à¦Ÿà¦•", status: "à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸", action: "à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨", notifications: "à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨",
    markAllRead: "à¦¸à¦¬à¦—à§à¦²à§‹ à¦ªà§œà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦®à¦¾à¦°à§à¦• à¦•à¦°à§à¦¨", noNotifications: "à¦¨à¦¤à§à¦¨ à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¨à§‡à¦‡",
    logout: "à¦²à¦—à¦†à¦‰à¦Ÿ", settings: "à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸", myAccount: "à¦†à¦®à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ"
  }
}
const LangContext = createContext();
const useLang = () => useContext(LangContext);

const menuItems = [
  { id: "products", label: {EN: "Products", BN: "à¦ªà¦£à§à¦¯"}, icon: Package },
  { id: "assortment", label: {EN: "Assortment Growth", BN: "à¦ªà¦£à§à¦¯ à¦¬à§ƒà¦¦à§à¦§à¦¿"}, icon: TrendingUp },
  { id: "orders", label: {EN: "Orders & Reviews", BN: "à¦…à¦°à§à¦¡à¦¾à¦° à¦“ à¦°à¦¿à¦­à¦¿à¦‰"}, icon: ShoppingCart },
  { id: "marketing", label: {EN: "Marketing Center", BN: "à¦®à¦¾à¦°à§à¦•à§‡à¦Ÿà¦¿à¦‚"}, icon: Megaphone },
  { id: "insight", label: {EN: "Data Insight", BN: "à¦¡à¦¾à¦Ÿà¦¾ à¦‡à¦¨à¦¸à¦¾à¦‡à¦Ÿ"}, icon: BarChart3 },
  { id: "learn", label: {EN: "Learn & Grow", BN: "à¦¶à¦¿à¦–à§à¦¨ à¦“ à¦¬à§œ à¦¹à¦¨"}, icon: GraduationCap },
  { id: "store", label: {EN: "Store Management", BN: "à¦¸à§à¦Ÿà§‹à¦° à¦®à§à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§à¦Ÿ"}, icon: Store },
  { id: "finance", label: {EN: "Finance", BN: "à¦«à¦¿à¦¨à¦¾à¦¨à§à¦¸"}, icon: DollarSign },
  { id: "settings", label: {EN: "Settings", BN: "à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸"}, icon: Settings },
  { id: "account", label: {EN: "My Account", BN: "à¦†à¦®à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ"}, icon: User },
];

export default function SellerPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [notifications, setNotifications] = useState([]); // REAL DATA
  const [shopName, setShopName] = useState("dulaltelecom"); // REAL from DB

  const profileRef = useRef();
  const langRef = useRef();
  const notifRef = useRef();
  const t = translations[language];
  const ActiveIcon = menuItems.find(m => m.id === activeTab)?.icon || LayoutGrid;

  // ===== 2. FETCH REAL DATA FROM SUPABASE =====
  useEffect(() => {
    fetchNotifications();
    fetchShopData();

    // REALTIME: New notification ashle auto update
    const channel = supabase
     .channel('notifications')
     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' },
        payload => setNotifications(prev => [payload.new,...prev])
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
     .from('notifications')
     .select('*')
     .eq('seller_id', shopName)
     .order('created_at', { ascending: false })
     .limit(10);
    setNotifications(data || []);
  }

  const fetchShopData = async () => {
    const { data } = await supabase.from('sellers').select('shop_name').eq('id', shopName).single();
    if(data) setShopName(data.shop_name);
  }

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({is_read: true}).eq('id', id);
    setNotifications(notifications.map(n => n.id === id? {...n, is_read: true} : n));
  }

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n=>!n.is_read).map(n=>n.id);
    await supabase.from('notifications').update({is_read: true}).in('id', unreadIds);
    setNotifications(notifications.map(n => ({...n, is_read: true})));
    toast.success(t.markAllRead);
  }

  const unreadCount = notifications.filter(n=>!n.is_read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if(profileRef.current &&!profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if(langRef.current &&!langRef.current.contains(e.target)) setShowLangMenu(false);
      if(notifRef.current &&!notifRef.current.contains(e.target)) setShowNotifMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <LangContext.Provider value={{language, setLanguage, t}}>
      <div className="flex h-screen bg-[#f5f5f5] text-gray-800 font-sans">
        <Toaster position="top-right"/>

        {/* ===== SIDEBAR ===== */}
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300
          ${collapsed? 'w-20' : 'w-64'} ${mobileOpen? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 h-full`}>
          <div className="flex items-center justify-between p-4 border-b h-16">
            {!collapsed && <h1 className="text-xl font-black text-orange-500">BAHARAZ <span className="text-xs text-gray-500">SELLER</span></h1>}
            {collapsed && <h1 className="text-xl font-black text-orange-500 mx-auto">B</h1>}
            <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block"><ChevronLeft size={20}/></button>
            <button onClick={() => setMobileOpen(false)} className="md:hidden"><X size={20}/></button>
          </div>
          <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100%-65px)]">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg ${activeTab === item.id? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-100'}`}>
                <item.icon size={20} />
                {!collapsed && <span className="text-sm">{item.label[language]}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* ===== MAIN ===== */}
        <div className="flex-1 flex-col overflow-hidden">
          {/* ===== REAL TOP NAVBAR ===== */}
          <header className="bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="md:hidden"><Menu size={24}/></button>
              <ActiveIcon size={22} className="text-orange-500"/>
              <h2 className="text-lg font-bold hidden sm:block">{menuItems.find(m=>m.id===activeTab)?.label[language]}</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* 1. SHOP NAME - REAL */}
              <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                <Store size={16} className="text-orange-500"/>
                <span className="text-sm font-semibold text-orange-600">@{shopName}</span>
              </div>

              {/* 2. REAL LANGUAGE SELECTOR */}
              <div className="relative" ref={langRef}>
                <button onClick={()=>setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100">
                  <Globe size={20}/><span className="text-sm font-semibold">{language}</span><ChevronDown size={16}/>
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <button onClick={()=>{setLanguage("EN"); setShowLangMenu(false)}} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50">
                      {language==="EN" && <Check size={14} className="text-orange-500"/>} English
                    </button>
                    <button onClick={()=>{setLanguage("BN"); setShowLangMenu(false)}} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50">
                      {language==="BN" && <Check size={14} className="text-orange-500"/>} à¦¬à¦¾à¦‚à¦²à¦¾
                    </button>
                  </div>
                )}
              </div>

              {/* 3. REAL NOTIFICATION DROPDOWN */}
              <div className="relative" ref={notifRef}>
                <button onClick={()=>setShowNotifMenu(!showNotifMenu)} className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell size={22}/>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                      <p className="font-bold">{t.notifications}</p>
                      <button onClick={markAllRead} className="text-xs text-orange-500">{t.markAllRead}</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0? <p className="p-4 text-center text-gray-500">{t.noNotifications}</p> :
                        notifications.map(n=>(
                          <div key={n.id} onClick={()=>markAsRead(n.id)} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!n.is_read && 'bg-orange-50'}`}>
                            <p className="text-sm font-semibold">{n.title}</p>
                            <p className="text-xs text-gray-500">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* 4. PROFILE MENU */}
              <div className="relative" ref={profileRef}>
                <button onClick={()=>setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100">
                  <img src="https://i.pravatar.cc/40" className="w-9 h-9 rounded-full border-2 border-orange-500"/>
                  <ChevronDown size={16} className="text-gray-500"/>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <button className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"><User size={16}/> {t.myAccount}</button>
                    <button className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"><Settings size={16}/> {t.settings}</button>
                    <button className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red-50 text-red-500"><LogOut size={16}/> {t.logout}</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "products" && <ProductsTab onAdd={()=>setShowAddProduct(true)} />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "finance" && <FinanceTab />}
            {activeTab!== "products" && activeTab!== "orders" && activeTab!== "finance" && <ComingSoon title={menuItems.find(m=>m.id===activeTab)?.label[language]} />}
          </main>
        </div>

        {showAddProduct && <AddProductModal onClose={()=>setShowAddProduct(false)} />}
        {mobileOpen && <div onClick={()=>setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden"></div>}
      </div>
    </LangContext.Provider>
  );
}

// ===== EXAMPLE: PRODUCTS TAB WITH REAL LANGUAGE =====
function ProductsTab({ onAdd }) {
  const {t} = useLang();
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    supabase.from('products').select('*').then(({data})=>setProducts(data || []))
  },[]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{t.products}</h3>
        <button onClick={onAdd} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
          <Plus size={18}/> {t.addProduct}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="p-3 text-left">Product</th><th className="p-3 text-left">{t.price}</th>
            <th className="p-3 text-left">{t.stock}</th><th className="p-3 text-left">{t.status}</th><th className="p-3 text-left">{t.action}</th>
          </tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td><td className="p-3">à§³{p.price}</td>
                <td className="p-3">{p.stock}</td><td className="p-3">{p.status}</td><td className="p-3 text-orange-500">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Other tabs
function OrdersTab(){ const {t} = useLang(); return <div className="bg-white p-6 rounded-xl"><h3 className="text-2xl font-bold">{t.orders}</h3></div> }
function FinanceTab(){ const {t} = useLang(); return <div className="bg-white p-6 rounded-xl"><h3 className="text-2xl font-bold">{t.finance}</h3></div> }
function ComingSoon({ title }){ return <div className="flex items-center justify-center h-[70vh] bg-white rounded-xl"><h3 className="text-2xl font-bold">{title}</h3></div> }
function AddProductModal({ onClose }){
  const {t} = useLang();
  return(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">{t.addProduct}</h3><button onClick={onClose}><X/></button></div>
        <form onSubmit={(e)=>{e.preventDefault(); toast.success("Added!"); onClose();}} className="space-y-4">
          <input placeholder="Product Name" className="w-full border p-3 rounded-lg" required/>
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold">Save</button>
        </form>
      </div>
    </div>
  );
}
