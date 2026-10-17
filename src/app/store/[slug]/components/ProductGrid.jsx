"use client";
import Link from "next/link";

export default function ProductGrid({ products = [], store }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-[18px] border-2 border-dashed p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-[24px]">📦</div>
        <p className="text-[15px] font-black mt-4">No Products Yet</p>
        <p className="text-[12px] text-slate-500 mt-2 max-w-[300px] mx-auto">
          {store?.name? `${store.name} এখনো কোনো প্রোডাক্ট এড করে নাই। খুব শীঘ্রই প্রোডাক্ট আসবে।` : 'This store has no products yet.'}
        </p>
        <div className="mt-4 inline-block bg-[#f5f5f7] px-3 py-1.5 rounded-full">
          <p className="text-[10px] font-bold text-slate-600">Store: {store?.name || 'Baharaz Store'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[18px] border shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-[14px] md:text-[15px] flex items-center gap-2">
          All Products
          <span className="bg-[#0a1931] text-white text-[11px] px-2.5 py-1 rounded-full">{products.length}</span>
        </h3>
        <p className="text-[11px] text-slate-500 font-bold">From {store?.name || 'Store'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((p) => {
          const img = p.image || p.image_url || p.thumbnail || (Array.isArray(p.images) && p.images[0]) || "https://via.placeholder.com/300x300?text=No+Image";
          const title = p.title || p.name || "Baharaz Product";
          const price = Number(p.discount_price || p.price || 0);
          const originalPrice = Number(p.price || 0);
          const hasDiscount = p.discount_price && Number(p.discount_price) < Number(p.price);
          const discountPercent = hasDiscount? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
          const stock = p.stock?? p.quantity?? 100;
          const link = `/product/${p.slug || p.id}`;

          return (
            <Link key={p.id} href={link} className="border border-slate-100 rounded-[16px] overflow-hidden bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 group flex flex-col">
              <div className="aspect-square bg-[#fcfcfc] overflow-hidden relative">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
                {hasDiscount && discountPercent > 0 && (
                  <span className="absolute top-2.5 left-2.5 bg-[#ff1a00] text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
                    -{discountPercent}%
                  </span>
                )}
                {stock <= 0 && (
                  <span className="absolute inset-0 bg-white/80 flex items-center justify-center text-[11px] font-black text-red-600">Out of Stock</span>
                )}
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h4 className="text-[12px] font-bold line-clamp-2 leading-[18px] min-h-[36px] text-[#111] group-hover:text-[#ff1a00] transition">
                  {title}
                </h4>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <p className="text-[15px] font-black text-[#0a1931]">৳{price.toLocaleString()}</p>
                  {hasDiscount && (
                    <p className="text-[11px] text-slate-400 line-through">৳{originalPrice.toLocaleString()}</p>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold flex items-center gap-1">
                    {stock > 0? <span className="text-green-600">✓ In Stock • {stock} left</span> : <span className="text-red-500">Out of Stock</span>}
                  </p>
                  {p.rating > 0 && (
                    <p className="text-[10px] font-black bg-[#fff8e1] px-1.5 py-0.5 rounded-full">★ {Number(p.rating).toFixed(1)}</p>
                  )}
                </div>

                <div className="mt-3 h-[32px] bg-[#0a1931] text-white rounded-[10px] flex items-center justify-center text-[11px] font-black group-hover:bg-black transition">
                  View Details
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}