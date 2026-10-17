"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  if (!product) return null;
  const price = product.price || product.sale_price || 0;
  const img = product.image || product.thumbnail || product.images?.[0] || '/placeholder.png';
  const slug = product.slug || product.objectID || product.id;
  const name = product.name || product.title || 'Product';

  return (
    <Link href={`/product/${slug}`} className="bg-white rounded-[10px] border border-[#f0f0f0] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group block">
      <div className="aspect-square bg-[#f9f9f9] relative overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-[#f85606] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-[12.5px] leading-[1.3] text-[#212121] line-clamp-2 h-[32px] font-medium group-hover:text-[#f85606]">{name}</h3>
        <div className="mt-2">
          <span className="text-[14px] font-bold text-[#f85606]">৳{Number(price).toLocaleString()}</span>
          {product.original_price && (
            <span className="text-[11px] text-[#9e9e9e] line-through ml-1.5">৳{product.original_price}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] text-[#faca51]">★★★★★</span>
          <span className="text-[10px] text-[#999]">({product.rating_count || 0})</span>
        </div>
      </div>
    </Link>
  );
}