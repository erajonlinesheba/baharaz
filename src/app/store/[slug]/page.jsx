"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import StoreDecoration from "./components/StoreDecoration";
import AnnouncementBar from "./components/AnnouncementBar";
import CategoryChips from "./components/CategoryChips";
import TrustBadges from "./components/TrustBadges";
import ProductGrid from "./components/ProductGrid";
import OwnerBar from "./components/OwnerBar";
import FaqSection from "./components/FaqSection";
import SocialLinks from "./components/SocialLinks";
import Testimonial from "./components/Testimonial";
import ShareButtons from "./components/ShareButtons";
import StoreFooter from "./components/StoreFooter";
import LiveChat from "./components/LiveChat";

export default function StorePage() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("home-top");
  const [liveViewers, setLiveViewers] = useState(12);

  useEffect(() => {
    if (slug) fetchStoreData();
    const iv = setInterval(() => {
      setLiveViewers(v => Math.max(3, v + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(iv);
  }, [slug]);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      let storeData = null;
      const currentSlug = Array.isArray(slug)? slug[0] : slug;
      const cleanSlug = decodeURIComponent(currentSlug).trim();
      const searchName = cleanSlug.replace(/-/g, " ").trim();

      // ✅ UNLIMITED SELLER FIND - 7 Way
      const { data: byShopSlug } = await supabase.from("sellers").select("*").eq("shop_slug", cleanSlug).maybeSingle();
      if (byShopSlug) storeData = byShopSlug;

      if (!storeData) {
        const { data: bySlug } = await supabase.from("sellers").select("*").eq("slug", cleanSlug).maybeSingle();
        if (bySlug) storeData = bySlug;
      }

      if (!storeData) {
        const { data: byId } = await supabase.from("sellers").select("*").eq("id", cleanSlug).maybeSingle();
        if (byId) storeData = byId;
      }

      if (!storeData) {
        const { data: byUserId } = await supabase.from("sellers").select("*").eq("user_id", cleanSlug).maybeSingle();
        if (byUserId) storeData = byUserId;
      }

      if (!storeData && searchName.length >= 2) {
        const { data: byName } = await supabase.from("sellers").select("*").ilike("shop_name", `%${searchName}%`).limit(10);
        if (byName && byName.length > 0) {
          const withLogo = byName.find((s) => s.shop_logo || s.logo_url || s.avatar || s.logo);
          storeData = withLogo || byName[0];
        }
        if (!storeData) {
          const { data: byName2 } = await supabase.from("sellers").select("*").ilike("name", `%${searchName}%`).limit(10);
          if (byName2 && byName2.length > 0) storeData = byName2[0];
        }
      }

      if (!storeData) {
        const { data: byProfile } = await supabase.from("profiles").select("*").ilike("shop_name", `%${searchName}%`).maybeSingle();
        if (byProfile) {
          storeData = {
            id: byProfile.id,
            user_id: byProfile.id,
            shop_name: byProfile.shop_name || byProfile.store_name || byProfile.full_name || byProfile.business_name || byProfile.name,
            name: byProfile.shop_name || byProfile.store_name || byProfile.full_name || byProfile.business_name || byProfile.name,
            shop_logo: byProfile.avatar || byProfile.logo_url || byProfile.shop_logo,
            logo_url: byProfile.avatar || byProfile.logo_url || byProfile.shop_logo,
            avatar: byProfile.avatar || byProfile.logo_url,
            logo: byProfile.avatar || byProfile.logo_url,
            shop_slug: byProfile.slug || byProfile.shop_slug || cleanSlug,
            slug: byProfile.slug || byProfile.shop_slug || cleanSlug,
            district: byProfile.district || byProfile.city || "Rajshahi",
            city: byProfile.district || byProfile.city || "Rajshahi",
            is_verified: byProfile.is_verified?? true,
         ...byProfile,
          };
        }
      }

      if (!storeData) {
        setStore(null);
        setLoading(false);
        return;
      }

      setStore(storeData);

      // ✅ UNLIMITED SELLER - PROFESSIONAL - No is_active crash for old data
      let finalProducts = [];
      const sId = storeData.id;
      const uId = storeData.user_id;

      // 1. Main
      const { data: p1 } = await supabase.from("products").select("*").eq("seller_id", sId).order("created_at", { ascending: false }).limit(100);
      if (p1 && p1.length > 0) finalProducts = p1;

      // 2. Fallback seller_user_id
      if (finalProducts.length === 0 && uId) {
        const { data: p2 } = await supabase.from("products").select("*").eq("seller_user_id", uId).order("created_at", { ascending: false }).limit(100);
        if (p2 && p2.length > 0) finalProducts = p2;
      }

      // 3. Fallback user_id
      if (finalProducts.length === 0 && uId) {
        const { data: p3 } = await supabase.from("products").select("*").or(`user_id.eq.${uId},seller_id.eq.${uId}`).order("created_at", { ascending: false }).limit(100);
        if (p3 && p3.length > 0) finalProducts = p3;
      }

      // Filter active in JS - Safe for null is_active
      const activeProducts = finalProducts.filter(p => p.is_active!== false && p.status!== 'inactive');
      setProducts(activeProducts.length > 0? activeProducts : finalProducts);
    } catch (error) {
      console.error("Store fetch error:", error);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const realName = store?.shop_name || store?.name || store?.business_name || store?.store_name || store?.full_name || "Baharaz Store";
  const realLogo = store?.shop_logo || store?.logo_url || store?.avatar || store?.logo || store?.shop_banner || "";
  const realDistrict = store?.district || store?.city || "Rajshahi";

  const allCategories = useMemo(() => products.map((p) => p.category).filter(Boolean), [products]);
  const uniqueCategories = useMemo(() => [...new Set(allCategories)], [allCategories]);
  const categories = useMemo(() => ["All",...uniqueCategories], [uniqueCategories]);
  const filteredProducts = useMemo(() => activeCategory === "All"? products : products.filter((p) => p.category === activeCategory), [products, activeCategory]);

  // ✅ Seller All Features for Customer Store
  const couponCode = store?.coupon_code || "WELCOME10";
  const couponDiscount = store?.coupon_discount || "10% OFF";
  const deliveryInside = store?.delivery_charge_inside || "60";
  const deliveryOutside = store?.delivery_charge_outside || "120";
  const deliveryRajshahi = store?.delivery_charge_rajshahi || "40";
  const minFreeDelivery = store?.min_order_free_delivery || "999";
  const themeColor = store?.theme_color || "#0f172a";
  const secondaryColor = store?.secondary_color || "#3b82f6";
  const showAnnouncement = store?.show_announcement!== false;
  const announcementText = store?.announcement_text || `🎉 Free Delivery on ${minFreeDelivery}+ TK Order | 7 Days Easy Return | 100% Authentic - Trusted by 10k+ Customers`;
  const announcementSecond = store?.announcement_second_line || `Code: ${couponCode} - ${couponDiscount} - Ends Tonight`;

  const storeSchema = store? {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": realName,
    "image": realLogo,
    "description": `${realName} - Best online shop in ${realDistrict}, Bangladesh. ${products.length} products available on Baharaz.com - Free Delivery ${minFreeDelivery}+ TK - COD - 7 Days Return`,
    "address": { "@type": "PostalAddress", "addressLocality": realDistrict, "addressCountry": "BD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": products.length > 0? products.length * 3 : 127 },
  } : null;

  const breadcrumbSchema = store? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://baharaz.com" },
      { "@type": "ListItem", "position": 2, "name": "Stores", "item": "https://baharaz.com/stores" },
      { "@type": "ListItem", "position": 3, "name": realName, "item": `https://baharaz.com/store/${store.shop_slug || store.slug || store.id}` }
    ]
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Loading {realName || "Store"}...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f6f7fb]">
        <div className="bg-white p-8 rounded-[18px] text-center border shadow-sm max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto font-black text-xl">!</div>
          <h2 className="font-black text-[16px] mt-4">Store Not Found - Baharaz</h2>
          <p className="text-[11px] text-slate-500 mt-2 break-all">Slug: {Array.isArray(slug)? slug[0] : slug}</p>
          <p className="text-[10px] text-slate-400 mt-2">This store is not available on Baharaz.com</p>
          <a href="/" className="mt-5 inline-block bg-slate-900 text-white px-6 py-2.5 rounded-full text-[12px] font-bold">Go to Baharaz Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {storeSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />}
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}

      <div id="home-top" className="max-w-[1300px] mx-auto px-0 md:px-6 pb-6">
        <h1 className="sr-only">{realName} - Official Store in {realDistrict} - Baharaz.com - {products.length} Products - Free Delivery {minFreeDelivery}+ TK</h1>

        {/* ✅ Seller Features - Announcement + Coupon - Live */}
        {showAnnouncement && (
          <AnnouncementBar
            store={{
             ...store,
              name: realName,
              logo: realLogo,
              announcement_text: announcementText,
              announcement_second_line: announcementSecond,
              coupon_code: couponCode,
              coupon_discount: couponDiscount,
              theme_color: themeColor,
              min_order_free_delivery: minFreeDelivery
            }}
          />
        )}

        <StoreDecoration store={{...store, name: realName, logo: realLogo, theme_color: themeColor, secondary_color: secondaryColor }} productsCount={products.length} activeTab={activeTab} onTabChange={setActiveTab} hideNameInBanner={true} />

        {/* ✅ Seller Header - All Info */}
        <div className="bg-white border-x md:border border-slate-200 px-4 py-3 flex items-center gap-3">
          {realLogo? (
            <img src={realLogo} className="w-11 h-11 rounded-[12px] border bg-white object-cover" alt={`${realName} logo - ${realDistrict} - Baharaz Store`} />
          ) : (
            <div className="w-11 h-11 rounded-[12px] bg-black text-white grid place-items-center font-black text-[16px]">{realName? realName.charAt(0).toUpperCase() : "S"}</div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-[15px] truncate flex items-center gap-1.5">
              {realName}
              {store?.is_verified && <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">✓ Verified</span>}
              <span className="bg-green-50 text-green-700 border text-[9px] px-2 py-0.5 rounded-full ml-1">{liveViewers} Live</span>
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              4.9 ★ • {products.length} Products • {realDistrict} • Delivery: {deliveryInside}৳ Dhaka • {deliveryRajshahi}৳ Rajshahi • Min Free {minFreeDelivery}৳ • COD ✓
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            {store?.is_verified && <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-bold">✓ Verified Store</span>}
            {couponCode && <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-black">{couponCode}: {couponDiscount}</span>}
          </div>
        </div>

        {/* ✅ Coupon + Shipping Bar - Seller Feature */}
        <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap gap-2 items-center justify-between text-[10px] font-bold border-x md:border">
          <div className="flex gap-3 flex-wrap">
            <span>🚚 Inside Dhaka {deliveryInside}৳</span>
            <span>• Outside {deliveryOutside}৳</span>
            <span>• Rajshahi {deliveryRajshahi}৳ Own Rider</span>
            <span>• Free Delivery {minFreeDelivery}৳+</span>
            <span>• COD {store?.enable_cod!== false? "✓" : "✕"}</span>
            <span>• bKash {store?.enable_bkash!== false || store?.bkash_number? "✓" : "✕"}</span>
          </div>
          {couponCode && <span className="bg-white text-black px-2.5 py-0.5 rounded-full">{couponCode} - {couponDiscount}</span>}
        </div>

        <div className="px-3 md:px-0 mt-4 space-y-4">
          <div id="categories-section">
            <CategoryChips categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>

          <div id="products-section" className="bg-white md:rounded-[16px] p-3 md:p-4 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black text-[13px] text-[#212121] uppercase tracking-wide">
                All Products ({filteredProducts.length}) {realName? `- ${realName} Official - ${realDistrict} - Baharaz` : ""}
              </h2>
              <span className="text-[11px] text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-full border">{activeCategory} • {filteredProducts.length} Items • {liveViewers} Live Viewers</span>
            </div>

            <ProductGrid products={filteredProducts} store={{...store, name: realName, logo: realLogo, theme_color: themeColor }} />

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed rounded-[16px] mt-4 bg-[#fcfcfc]">
                <p className="font-black text-[14px]">No Products Found in {activeCategory} - {realName} - Baharaz.com</p>
                <p className="text-[11px] text-slate-500 mt-2 max-w-[380px] mx-auto">
                  Store: {realName} ({realDistrict})<br />
                  Store ID: {store.id} • User ID: {store.user_id}<br />
                  {products.length === 0? `No products linked to this store yet. Add product with seller_id = ${store.id} in Supabase products table.` : `All ${products.length} products are in ${activeCategory === "All"? "other category" : activeCategory} filter. `}
                </p>
                <button onClick={() => setActiveCategory("All")} className="mt-4 bg-black text-white px-5 py-2 rounded-full text-[11px] font-black">
                  Show All {products.length} Products - {realName}
                </button>
              </div>
            )}
          </div>

          <div id="profile-section" className="space-y-4">
            <OwnerBar store={{...store, name: realName, logo: realLogo, theme_color: themeColor, phone: store.phone, address: store.full_address || store.address, district: realDistrict, whatsapp_number: store.whatsapp_number }} isOwner={true} />
            <TrustBadges store={store} />
          </div>

          <div id="testimonial-section">
            <Testimonial store={{...store, name: realName, logo: realLogo }} />
          </div>

          <SocialLinks store={{...store, name: realName, logo: realLogo }} />
          <FaqSection store={{...store, name: realName, return_policy: store.return_policy, shipping_policy: store.shipping_policy, warranty_text: store.warranty_text }} />
          <ShareButtons store={{...store, name: realName }} />
          <StoreFooter store={{...store, name: realName, delivery_charge_inside: deliveryInside, delivery_charge_outside: deliveryOutside, delivery_charge_rajshahi: deliveryRajshahi, min_order_free_delivery: minFreeDelivery, coupon_code: couponCode }} />
        </div>
      </div>

      <div id="chat-section">
        <LiveChat store={{...store, name: realName, logo: realLogo, whatsapp_number: store.whatsapp_number, phone: store.phone, theme_color: themeColor }} />
      </div>
    </div>
  );
}