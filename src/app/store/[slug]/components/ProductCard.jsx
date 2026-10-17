"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product, store }) {
  const [imgError, setImgError] = useState(false);

  // ✅ PRICE FIX - Baharaz Rules
  const originalPrice = Number(product?.price) || 0;
  const discountPrice = Number(product?.discount_price || product?.sale_price || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < originalPrice;
  const finalPrice = hasDiscount? discountPrice : originalPrice;
  const discountPercent = hasDiscount? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  // ✅ IMAGE FIX - সব জায়গা থেকে Image নিবে - TAMID RAJ SHOP Product এর Image 100% আসবে
  const getImageUrl = () => {
    if (imgError) return "https://via.placeholder.com/400x400/f1f5f9/94a3b8?text=No+Image";
    if (product?.images && Array.isArray(product.images) && product.images[0]) return product.images[0];
    if (product?.image_url) return product.image_url;
    if (product?.image) return product.image;
    if (product?.images && typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed[0]) return parsed[0];
      } catch {}
      return product.images;
    }
    return "https://via.placeholder.com/400x400/f1f5f9/94a3b8?text=No+Image";
  };
  const imageUrl = getImageUrl();

  // ✅ TITLE + SLUG FIX
  const title = product?.title || product?.name || "Untitled Product - Baharaz";
  const productSlug = product?.slug || product?.id;
  const isMall = product?.is_mall === true || product?.is_baharaz_mall === true;
  const rating = Number(product?.rating) || 4.8;
  const soldCount = product?.sold_count || product?.sold || 127;

  return (
    <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black hover:-translate-y-[2px] transition-all duration-300 overflow-hidden group flex flex-col h-full">

      {/* Image Area */}
      <Link href={`/product/${productSlug}`} className="relative block aspect-square overflow-hidden bg-[#f8fafc]">
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Baharaz Mall Badge */}
        {isMall && (
          <div className="absolute top-2.5 left-2.5 bg-[#7b1fa2] text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow">
            BAHARAZ MALL
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount &&!isMall && (
          <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)]">
            -{discountPercent}% OFF
          </div>
        )}
        {hasDiscount && isMall && (
          <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Badge */}
        {product?.stock!== undefined && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-amber-400 text-black text-[9px] font-black px-2 py-1 rounded-full">
            Only {product.stock} Left!
          </div>
        )}

        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-[11px] font-black px-4 py-1.5 rounded-full">SOLD OUT</span>
          </div>
        )}

        {/* Wishlist */}
        <button className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
          ♡
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category */}
        {product?.category && (
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1 truncate">{product.category}</p>
        )}

        {/* Title - FIXED */}
        <Link href={`/product/${productSlug}`}>
          <h3 className="text-[13px] md:text-[13.5px] font-bold text-slate-900 leading-[1.3] line-clamp-2 min-h-[36px] hover:text-[#ff1a00] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-[11px] text-amber-400">★★★★★</div>
          <span className="text-[11px] font-bold text-slate-700">({rating.toFixed(1)})</span>
          <span className="text-[10px] text-slate-400">• {soldCount} sold</span>
        </div>

        {/* Price - FIXED */}
        <div className="mt-2.5 flex items-end gap-2">
          <span className="text-[17px] font-black text-[#ff1a00] tracking-tight">
            ৳{finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[12px] text-slate-400 line-through font-medium mb-0.5">৳{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Store Name - Customer Page Fix */}
        {store?.name && (
          <div className="mt-1 text-[10px] text-[#1a9cb7] font-bold truncate">
            {store.name} {isMall? '• Mall' : '• Verified Seller'}
          </div>
        )}

        {/* Delivery Info */}
        <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
          <span className="text-[10px]">🚚</span> Free Delivery in Dhaka • COD
        </div>

        {/* Buttons - Order Now + Chat */}
        <div className="mt-3 grid grid-cols-[1fr_36px] gap-2">
          <Link href={`/product/${productSlug}`} className="h-[38px] bg-slate-900 hover:bg-black text-white rounded-full text-[12px] font-black flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] transition-all active:scale-[0.98]">
            🛒 Order Now
          </Link>
          <button
            onClick={() => {
              const trigger = document.getElementById("live-chat-trigger");
              if (trigger) trigger.click();
              else window.location.href = `/chat?seller=${store?.id || product?.seller_id}&product=${product?.id}`;
            }}
            className="h-[38px] bg-green-50 hover:bg-green-500 border border-green-200 hover:border-green-500 text-green-600 hover:text-white rounded-full flex items-center justify-center text-[16px] transition-all active:scale-95"
            title="Chat before order"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
}