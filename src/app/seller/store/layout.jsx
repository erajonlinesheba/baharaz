"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import StoreSidebar from "./components/StoreSidebar";
import LivePreview from "./components/LivePreview";

export const StoreContext = createContext(null);
export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreLayout");
  return ctx;
};

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [myProducts, setMyProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, views: 0, orders: 0, revenue: 0, followers: 0, rating: 4.9, active: 0, inactive: 0 });
  const [liveViewers, setLiveViewers] = useState(12);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [completion, setCompletion] = useState(0);
  const hasFetched = useRef(false);

  const [storeData, setStoreData] = useState({
    shop_name: "TAMID NEW FASHION",
    shop_slug: "tamid-fashion-rajshahi",
    shop_description: "We are TAMID NEW FASHION from Rajshahi - Direct from factory - 3 years selling - 100% authentic guarantee - Fast delivery 1-2 days Dhaka, 2-3 days outside, Rajshahi same day 40TK own rider - COD all BD - 7 days easy return - Trusted by 10k+ customers - 4.9 rating",
    shop_logo: "",
    shop_banner: "",
    shop_category: "Fashion",
    store_motto: "Trusted by 10k+ Customers - 100% Authentic",
    founded_year: "2020",
    total_customers: "10k+",
    brand_story: "",
    mission_statement: "",
    hero_title: "Welcome to TAMID NEW FASHION - Best Clothing Store in Rajshahi",
    hero_subtitle: "100% Authentic Products • Fast Delivery 1-2 Days Dhaka • Cash on Delivery All Over Bangladesh • 7 Days Easy Return • Trusted by 10k+ Customers",
    hero_image: "",
    hero_mobile_image: "",
    second_banner: "",
    banner_template: "default",
    banner_text_position: "left",
    banner_overlay: "55",
    banner_height: "480",
    banner_show_button: true,
    banner_show_badges: true,
    banner_parallax: false,
    hero_badge1: "✓ VERIFIED STORE",
    hero_badge2: "TOP RATED • 4.9",
    hero_badge3: "FREE DELIVERY 999+",
    hero_cta_text: "Shop Now",
    hero_cta_link: "#products",
    favicon: "",
    og_image: "",
    og_title: "",
    og_description: "",
    announcement_text: "🎉 Free Delivery on 999+ TK Order | 7 Days Easy Return | 100% Authentic - Trusted by 10k+ Customers",
    announcement_icon: "🎉",
    announcement_link: "#products",
    announcement_second_line: "Code: WELCOME10 - 10% OFF - Ends Tonight",
    show_announcement: true,
    announcement_style: "gradient",
    announcement_bg_color: "",
    announcement_text_color: "white",
    announcement_animation: "none",
    announcement_closable: true,
    announcement_all_pages: true,
    announcement_sticky: true,
    announcement_show_timer: false,
    announcement_timer_end: "",
    show_coupon_in_bar: true,
    theme_color: "#0f172a",
    secondary_color: "#3b82f6",
    accent_color: "#f59e0b",
    theme_name: "Midnight Pro",
    font_family: "inter",
    font_size: "base",
    font_weight: "bold",
    store_layout: "amazon",
    card_style: "rounded",
    image_ratio: "1:1",
    show_sidebar: true,
    show_flash_sale: false,
    button_style: "rounded-full",
    banner_style: "gradient",
    enable_dark_mode: false,
    custom_css: "",
    phone: "017XXXXXXXXX",
    whatsapp_number: "017XXXXXXXXX",
    email: "",
    address: "Shaheb Bazar, Zero Point, Boalia, Rajshahi-6000, Bangladesh",
    full_address: "Shop: TAMID NEW FASHION, Shaheb Bazar, Zero Point, Boalia, Rajshahi-6000, Bangladesh",
    district: "Rajshahi",
    thana: "Boalia",
    postal_code: "6000",
    google_maps_url: "",
    business_hours: "9AM-10PM",
    response_time: "30min",
    store_hours: "Open 9AM - 11PM",
    messenger_url: "",
    whatsapp_prefilled: "Assalamu Alaikum! I want to know about your products - From Baharaz store",
    auto_message: "Assalamu Alaikum! Thanks for visiting TAMID NEW FASHION - We are online 9AM-10PM - Typically replies within 30 minutes - For fast reply Call or WhatsApp - 100% authentic guarantee - Fast delivery - 7 days return",
    quick_replies: "Delivery time?, Return policy?, COD available?, Size chart?, Price?",
    away_message: "We are currently offline - 9AM-10PM online - Will reply within 30min after opening",
    enable_chat_widget: true,
    show_whatsapp_float: true,
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    tiktok_url: "",
    whatsapp_channel_url: "",
    telegram_url: "",
    linkedin_url: "",
    website_url: "",
    delivery_charge_inside: "60",
    delivery_charge_outside: "120",
    delivery_charge_rajshahi: "40",
    min_order_free_delivery: "999",
    cod_extra_charge: "0",
    weight_extra_per_kg: "20",
    remote_extra: "30",
    processing_time: "24h",
    delivery_time_inside: "1-2 days",
    delivery_time_outside: "2-3 days",
    courier_partner: "steadfast",
    steadfast_api_key: "",
    pathao_api_key: "",
    auto_sms_tracking: true,
    use_own_rider_rajshahi: true,
    pickup_address: "Shop: TAMID NEW FASHION, Shaheb Bazar, Rajshahi-6000, Phone: 01XXXXXXXXX",
    pickup_time: "10am-6pm",
    own_rider_info: "Rider: Karim - 017XXXXXXXX - Rajshahi city only",
    return_address: "",
    default_weight: "0.5",
    free_delivery_weight_limit: "5",
    fragile_handling: false,
    free_rajshahi: false,
    cod_handling_fee: false,
    shipping_note: "Delivery: Inside Dhaka 1-2 days, Outside 2-3 days, Rajshahi same day if ordered before 2PM - Free delivery on 999TK+",
    bkash_number: "",
    bkash_type: "personal",
    nagad_number: "",
    rocket_number: "",
    upay_number: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    bank_branch: "",
    bank_routing: "",
    enable_cod: true,
    cod_min_order: "0",
    enable_bkash: true,
    enable_nagad: false,
    enable_bank: false,
    advance_payment_percent: "0",
    seo_title: "TAMID NEW FASHION - Best Clothing Store in Rajshahi | BAHARAZ Official - 100% Authentic",
    seo_description: "Shop authentic clothing from TAMID NEW FASHION Rajshahi - 100% authentic guarantee - Fast delivery 1-2 days Dhaka, 2-3 days outside, Rajshahi same day 40TK - COD all BD - 7 days easy return - Trusted by 10k+ customers - 4.9 rating - Panjabi, T-Shirt, Shirt, Jeans, Shoes",
    seo_keywords: "clothing store rajshahi, fashion rajshahi, panjabi rajshahi, t-shirt rajshahi, tamid fashion, baharaz",
    return_policy: "7 Days Easy Return - If defective, wrong size, damaged - Need unboxing video - Tags intact - Return to shop address - Refund in 24-48h after receiving return",
    shipping_policy: "Delivery 1-2 days Dhaka, 2-4 days outside Dhaka, Rajshahi same day if ordered before 2PM - Courier: Steadfast, Pathao, Own rider for Rajshahi - Tracking via SMS",
    warranty_text: "100% Authentic Guarantee - 1 Year Service Warranty - Brand warranty available - If fake, 2x refund - Service center: Rajshahi City",
    return_days: "7",
    refund_time: "24-48h",
    authentic_badge: true,
    service_center: "Rajshahi City - Shaheb Bazar",
    terms_conditions: "",
    privacy_policy: "",
    holiday_mode: false,
    vacation_message: "We are on vacation for Eid from 10-15 April - Back on 16 April - Orders placed now will be shipped after 16 April - Thank you! Eid Mubarak!",
    vacation_start_date: "",
    vacation_return_date: "",
    vacation_disable_checkout: true,
    holiday_start: "",
    holiday_end: "",
    holiday_message: "",
    coupon_code: "WELCOME10",
    coupon_discount: "10% OFF",
    coupon_discount_value: "100",
    coupon_min_order: "999",
    coupon_expiry: "31 Dec 2024 - Ends Tonight 11:59PM",
    coupon_usage_limit: "100",
    coupon_used: "12",
    show_coupon: true,
    show_live_visitors: true,
    rating: 4.9,
    total_reviews: 127,
    joined_date: "2024",
    is_verified: false,
    is_top_rated: false,
    total_followers: 0,
    total_orders: 500,
    total_views: 1250,
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) { setUser(session.user); return; }
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) setUser(u);
    })();
  }, []);

  useEffect(() => {
    if (user &&!hasFetched.current) {
      hasFetched.current = true;
      fetchAll();
    }
  }, [user]);

  useEffect(() => {
    const iv = setInterval(() => {
      setLiveViewers(v => Math.max(3, v + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const storeCompletion = useMemo(() => {
    let done = 0; const total = 12;
    if(storeData.shop_name && storeData.shop_name.length>=10) done++;
    if(storeData.shop_slug && storeData.shop_slug.length>=3) done++;
    if(storeData.shop_description && storeData.shop_description.length>=100) done++;
    if(storeData.shop_logo) done++;
    if(storeData.shop_banner || storeData.hero_image) done++;
    if(storeData.phone && storeData.address) done++;
    if(storeData.theme_color && storeData.secondary_color) done++;
    if(storeData.announcement_text) done++;
    if(storeData.delivery_charge_inside && storeData.delivery_charge_outside) done++;
    if(storeData.facebook_url || storeData.instagram_url) done++;
    if(storeData.seo_title && storeData.seo_description) done++;
    if(storeData.return_policy && storeData.shipping_policy) done++;
    return { done, total, percent: Math.round(done/total*100) };
  }, [storeData]);

  useEffect(() => { setCompletion(storeCompletion.percent); }, [storeCompletion]);

  const fetchAll = async () => {
    try {
      const { data } = await supabase.from("sellers").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setStoreData(prev => ({
      ...prev,
          shop_name: data.shop_name || data.name || prev.shop_name,
          shop_slug: data.shop_slug || prev.shop_slug,
          shop_description: data.shop_description || data.description || prev.shop_description,
          shop_logo: data.shop_logo || data.logo_url || prev.shop_logo,
          shop_banner: data.shop_banner || data.banner_url || data.hero_image || prev.shop_banner,
          hero_title: data.hero_title || prev.hero_title,
          hero_subtitle: data.hero_subtitle || prev.hero_subtitle,
          hero_image: data.hero_image || data.shop_banner || prev.hero_image,
          hero_mobile_image: data.hero_mobile_image || prev.hero_mobile_image,
          announcement_text: data.announcement_text || prev.announcement_text,
          show_announcement: data.show_announcement?? prev.show_announcement,
          announcement_style: data.announcement_style || prev.announcement_style,
          announcement_bg_color: data.announcement_bg_color || prev.announcement_bg_color,
          announcement_show_timer: data.announcement_show_timer || prev.announcement_show_timer,
          banner_template: data.banner_template || prev.banner_template,
          banner_text_position: data.banner_text_position || prev.banner_text_position,
          banner_overlay: data.banner_overlay || prev.banner_overlay,
          banner_height: data.banner_height || prev.banner_height,
          theme_color: data.theme_color || prev.theme_color,
          secondary_color: data.secondary_color || prev.secondary_color,
          accent_color: data.accent_color || prev.accent_color,
          font_family: data.font_family || prev.font_family,
          store_layout: data.store_layout || prev.store_layout,
          phone: data.phone || prev.phone,
          whatsapp_number: data.whatsapp_number || prev.whatsapp_number,
          email: data.email || prev.email,
          address: data.address || prev.address,
          full_address: data.full_address || data.address || prev.full_address,
          district: data.district || prev.district,
          thana: data.thana || prev.thana,
          facebook_url: data.facebook_url || prev.facebook_url,
          instagram_url: data.instagram_url || prev.instagram_url,
          youtube_url: data.youtube_url || prev.youtube_url,
          tiktok_url: data.tiktok_url || prev.tiktok_url,
          seo_title: data.seo_title || prev.seo_title,
          seo_description: data.seo_description || prev.seo_description,
          return_policy: data.return_policy || prev.return_policy,
          shipping_policy: data.shipping_policy || prev.shipping_policy,
          warranty_text: data.warranty_text || prev.warranty_text,
          store_motto: data.store_motto || prev.store_motto,
          coupon_code: data.coupon_code || prev.coupon_code,
          coupon_discount: data.coupon_discount || prev.coupon_discount,
          delivery_charge_inside: data.delivery_charge_inside || prev.delivery_charge_inside,
          delivery_charge_outside: data.delivery_charge_outside || prev.delivery_charge_outside,
          delivery_charge_rajshahi: data.delivery_charge_rajshahi || prev.delivery_charge_rajshahi,
          min_order_free_delivery: data.min_order_free_delivery || prev.min_order_free_delivery,
          courier_partner: data.courier_partner || prev.courier_partner,
          bkash_number: data.bkash_number || prev.bkash_number,
          nagad_number: data.nagad_number || prev.nagad_number,
          enable_cod: data.enable_cod?? prev.enable_cod,
          show_coupon: data.show_coupon?? prev.show_coupon,
          show_live_visitors: data.show_live_visitors?? prev.show_live_visitors,
          holiday_mode: data.holiday_mode || prev.holiday_mode,
          vacation_message: data.vacation_message || prev.vacation_message,
          joined_date: data.created_at? new Date(data.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : "2024",
          is_verified: data.is_verified || false,
          is_top_rated: data.is_top_rated || false,
          id: data.id,
        }));
      }

      let realSellerId = data?.id || null;
      if(!realSellerId){
        try {
          const { data: sellerRow } = await supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
          if(sellerRow?.id) realSellerId = sellerRow.id;
        } catch(e) {}
      }

      let prods = [];
      let count = 0;

      if(realSellerId){
        try {
          const res1 = await supabase.from("products").select("id,name,title,price,images,image,category,stock,is_active,status,created_at,seller_id").eq("seller_id", realSellerId).order("created_at", { ascending: false }).limit(100);
          if(res1.data && res1.data.length > 0){
            prods = res1.data;
            count = res1.data.length;
          }
        } catch(e) {}
      }

      if(prods.length === 0){
        try {
          const res2 = await supabase.from("products").select("id,name,title,price,images,image,category,stock,is_active,status,created_at,seller_id").eq("seller_user_id", user.id).order("created_at", { ascending: false }).limit(100);
          if(res2.data && res2.data.length > 0){
            prods = res2.data;
            count = res2.data.length;
          }
        } catch(e) {}
      }

      if(prods.length === 0){
        try {
          const res3 = await supabase.from("products").select("id,name,title,price,images,image,category,stock,is_active,status,created_at,seller_id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
          if(res3.data && res3.data.length > 0){
            prods = res3.data;
            count = res3.data.length;
          }
        } catch(e) {}
      }

      if (prods) {
        setMyProducts(prods);
        setCategories([...new Set(prods.map(p => p.category).filter(Boolean))]);
        // ✅ REAL VIEWS - NO FAKE *124 - Only DB Real Value
        const realViews = data?.total_views?? data?.store_views?? data?.views?? 0;
        const realOrders = data?.total_orders?? 0;
        setStats(prev => ({
      ...prev,
          total: count || prods.length,
          views: realViews,
          orders: realOrders,
          revenue: prods.reduce((a,b)=> a + (Number(b.price) || 0), 0),
          followers: data?.total_followers || 0,
          rating: data?.rating || 4.9,
          active: prods.filter(p=>p.is_active!==false).length,
          inactive: prods.filter(p=>p.is_active===false).length
        }));
      }

    } catch (e) { console.log("fetchAll error", e); }
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 35);

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return;
    if(file.size > 5*1024*1024){ setSaveMsg("Image too large - Max 5MB"); setTimeout(()=>setSaveMsg(""), 4000); return; }
    const localUrl = URL.createObjectURL(file);
    setStoreData(prev => ({...prev, [field]: localUrl }));
    try {
      const fileName = `${user.id}/${field}-${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
      const { error } = await supabase.storage.from("shop-images").upload(fileName, file, { upsert: true, cacheControl: "3600" });
      if (!error) {
        const { data } = supabase.storage.from("shop-images").getPublicUrl(fileName);
        if (field === "hero_image") {
          setStoreData(prev => ({...prev, hero_image: data.publicUrl, shop_banner: data.publicUrl }));
        } else {
          setStoreData(prev => ({...prev, [field]: data.publicUrl }));
        }
        setSaveMsg(`✓ ${field} uploaded`);
        setTimeout(()=>setSaveMsg(""), 3000);
      }
    } catch (err) { console.log(err); }
  };

  const handleSave = async (incomingData) => {
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const base = incomingData || storeData;
      let payload = {
        name: base.shop_name || base.name || "My Store",
        shop_name: base.shop_name || base.name || "My Store",
        shop_slug: base.shop_slug || generateSlug(base.shop_name || base.name || "my-store"),
        shop_description: base.shop_description,
        description: base.shop_description,
        shop_logo: base.shop_logo,
        logo_url: base.shop_logo,
        shop_banner: base.hero_image || base.shop_banner,
        banner_url: base.hero_image || base.shop_banner,
        hero_image: base.hero_image || base.shop_banner,
        hero_mobile_image: base.hero_mobile_image,
        hero_title: base.hero_title,
        hero_subtitle: base.hero_subtitle,
        announcement_text: base.announcement_text,
        show_announcement: base.show_announcement,
        announcement_style: base.announcement_style,
        banner_template: base.banner_template,
        banner_text_position: base.banner_text_position,
        banner_overlay: base.banner_overlay,
        banner_height: base.banner_height,
        theme_color: base.theme_color,
        secondary_color: base.secondary_color,
        accent_color: base.accent_color,
        font_family: base.font_family,
        store_layout: base.store_layout,
        phone: base.phone,
        whatsapp_number: base.whatsapp_number,
        email: base.email,
        address: base.address,
        full_address: base.full_address,
        district: base.district,
        thana: base.thana,
        postal_code: base.postal_code,
        facebook_url: base.facebook_url,
        instagram_url: base.instagram_url,
        youtube_url: base.youtube_url,
        tiktok_url: base.tiktok_url,
        seo_title: base.seo_title,
        seo_description: base.seo_description,
        return_policy: base.return_policy,
        shipping_policy: base.shipping_policy,
        delivery_charge_inside: base.delivery_charge_inside,
        delivery_charge_outside: base.delivery_charge_outside,
        delivery_charge_rajshahi: base.delivery_charge_rajshahi,
        min_order_free_delivery: base.min_order_free_delivery,
        courier_partner: base.courier_partner,
        bkash_number: base.bkash_number,
        nagad_number: base.nagad_number,
        enable_cod: base.enable_cod,
        show_coupon: base.show_coupon,
        show_live_visitors: base.show_live_visitors,
        holiday_mode: base.holiday_mode,
        coupon_code: base.coupon_code,
        coupon_discount: base.coupon_discount,
        shop_category: base.shop_category,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let lastError = null;
      for (let attempt = 0; attempt < 25; attempt++) {
        const { data: exists } = await supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
        let result;
        if (exists) {
          result = await supabase.from("sellers").update(payload).eq("user_id", user.id);
        } else {
          result = await supabase.from("sellers").insert({...payload, created_at: new Date().toISOString() });
        }
        if (!result.error) { lastError = null; break; }
        lastError = result.error;
        const m = result.error.message?.match(/'([^']+)' column of 'sellers'/);
        const m2 = result.error.message?.match(/column "([^"]+)" of relation "sellers"/);
        const badCol = (m && m[1]) || (m2 && m2[1]);
        if (badCol && badCol!== 'name' && payload[badCol]!== undefined) {
          delete payload[badCol];
          continue;
        }
        if(result.error.message?.includes('null value in column "name"')){
          payload.name = payload.shop_name || "My Store";
          continue;
        }
        break;
      }
      if (lastError) throw lastError;
      setSaveMsg("✅ Saved successfully");
    } catch (e) {
      console.log(e);
      setSaveMsg("❌ " + (e.message || "Failed to save"));
      throw e;
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 5000);
    }
  };

  return (
    <StoreContext.Provider value={{ storeData, setStoreData, user, myProducts, categories, stats, handleImageUpload, handleSave, saving, saveMsg, generateSlug, supabase, liveViewers, completion: storeCompletion.percent, shortUrl: `baharaz.com/store/${storeData.shop_slug}` }}>
      <div className="min-h-screen bg-[#f8fafc] w-full">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-[100] h-[64px]">
          <div className="flex items-center justify-between h-full px-3 md:px-4 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button onClick={()=>setShowMobileMenu(!showMobileMenu)} className="lg:hidden w-9 h-9 rounded-xl bg-slate-50 border-2 flex items-center justify-center shrink-0">☰</button>
              <div className="w-10 h-10 rounded-[12px] bg-slate-900 flex items-center justify-center overflow-hidden border-2 shrink-0">
                {storeData.shop_logo? <img src={storeData.shop_logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-white font-black text-[16px]">{storeData.shop_name?.[0] || "T"}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-[13px] md:text-[15px] truncate">{storeData.shop_name || "My Store"}</p>
                  {storeData.is_verified && <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[11px] shrink-0">✓</span>}
                  <span className="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border font-bold shrink-0">{liveViewers} Live</span>
                  <span className="hidden md:inline text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border font-bold">{completion}% Complete • {stats.total} Products</span>
                </div>
                <p className="text-[10px] md:text-[11px] text-slate-500 truncate">baharaz.com/store/{storeData.shop_slug} • {storeData.district} • {stats.total} products • Real Views</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={()=>setShowPreview(!showPreview)} className={`hidden lg:flex px-4 py-2 border-2 rounded-full text-[11px] font-black whitespace-nowrap ${showPreview? "bg-slate-900 text-white border-slate-900" : "bg-white hover:border-slate-900"}`}>
                {showPreview? "✕ Hide Preview" : "👁️ Live Preview"}
              </button>
              <Link href={`/store/${storeData.shop_slug}`} target="_blank" className="hidden md:flex px-4 py-2 bg-white border-2 rounded-full text-[11px] font-black hover:border-slate-900 whitespace-nowrap">View Store ↗ • {stats.total}</Link>
              <button onClick={()=>{ handleSave(); }} disabled={saving} className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-900 text-white rounded-full text-[11px] md:text-xs font-black disabled:opacity-50 whitespace-nowrap">{saving? "Saving..." : "💾 Save"}</button>
            </div>
          </div>
          <div className="h-[2px] w-full bg-slate-100"><div className="h-full bg-slate-900 transition-all duration-700" style={{ width:`${completion}%` }}></div></div>
        </div>

        <div className="flex w-full items-start">
          <aside className="group/sidebar hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 sticky top-[64px] h-[calc(100vh-64px)] w-[72px] hover:w-[320px] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden z-20">
            <StoreSidebar onClose={()=>setShowMobileMenu(false)} saveMsg={saveMsg} />
          </aside>

          {showMobileMenu && (
            <div className="fixed inset-0 z-[200] lg:hidden flex">
              <div className="absolute inset-0 bg-black/50" onClick={()=>setShowMobileMenu(false)}></div>
              <div className="relative w-[320px] bg-white h-full overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-3 border-b">
                  <p className="font-black">Menu • {stats.total} Products</p>
                  <button onClick={()=>setShowMobileMenu(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button>
                </div>
                <StoreSidebar onClose={()=>setShowMobileMenu(false)} saveMsg={saveMsg} />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 w-full pb-[150px]">
            <div className="w-full p-2 md:p-4">
              <div className="w-full flex flex-col xl:flex-row gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="bg-white rounded-[16px] md:rounded-[20px] border border-slate-200 min-h-[82vh] p-3 md:p-6 shadow-sm w-full overflow-visible">
                    {children}
                  </div>
                </div>
                {showPreview && (
                  <div className="w-full xl:w-[400px] shrink-0">
                    <div className="xl:sticky xl:top-[80px] space-y-3">
                      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shadow-sm">
                        <LivePreview />
                      </div>
                      <Link href={`/store/${storeData.shop_slug}`} target="_blank" className="hidden xl:flex w-full py-3 bg-slate-900 text-white rounded-full justify-center text-xs font-black">View Live Store ↗ • {liveViewers} Live • {stats.total} Products • Real Views {stats.views}</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreContext.Provider>
  )
}