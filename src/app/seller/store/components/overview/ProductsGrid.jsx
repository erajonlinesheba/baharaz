"use client";
import Link from "next/link";
import { useStore } from "../../layout";

export function ProductsGrid({ myProducts, stats, showAllProducts, setShowAllProducts, recentProducts }) {
  const { storeData, liveViewers } = useStore();
  const total = stats?.total?? myProducts?.length?? 0;

  return (
    <div className="p-5 rounded-[20px] border-2 bg-white w-full overflow-hidden shadow-sm">
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[13px] flex items-center gap-2 flex-wrap">
            Recent Products - {total} Total
            {total === 4 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500 text-white animate-pulse">4 Live • Unlimited OK</span>}
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-white">{liveViewers} Live Viewers</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Seller ID: {storeData?.shop_slug} • {total > 0? `${total} products linked via seller_id` : "No products linked yet"} • Baharaz Unlimited</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setShowAllProducts(!showAllProducts)} className="text-[11px] px-3 py-1.5 rounded-full border-2 font-bold bg-white hover:border-slate-900 hover:bg-slate-50 transition-all">
            {showAllProducts? "Show Less" : `View All ${total} →`}
          </button>
          <Link href="/seller/products/new" className="text-[11px] px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-bold hover:bg-black shadow-sm">+ Add Product</Link>
        </div>
      </div>

      {myProducts.length > 0? (
        <>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {recentProducts.map((p) => {
              const img = p.images?.[0] || p.image || p.thumbnail || "https://via.placeholder.com/300?text=No+Image";
              const isActive = p.is_active!== false && p.status!== 'inactive';
              return (
                <Link key={p.id} href={`/seller/products/${p.id}`} className="group border-2 rounded-[14px] overflow-hidden hover:shadow-md hover:border-slate-900 transition-all bg-white">
                  <div className="aspect-square bg-slate-50 overflow-hidden relative">
                    <img src={img} alt={p.name || p.title || "Product"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {!isActive && <span className="absolute top-2 left-2 text-[8px] px-2 py-0.5 rounded-full bg-red-500 text-white font-black">Inactive</span>}
                    {isActive && <span className="absolute top-2 left-2 text-[8px] px-2 py-0.5 rounded-full bg-green-500 text-white font-black">Active</span>}
                    <span className="absolute bottom-2 right-2 text-[8px] px-2 py-0.5 rounded-full bg-black/70 text-white font-bold backdrop-blur-sm">৳{p.price}</span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold truncate leading-tight">{p.name || p.title || "Untitled Product"}</p>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-[13px] font-black">৳{(p.price || 0).toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{p.category || "General"} • Stock {p.stock?? "∞"}</p>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-50 border font-bold">ID: {p.id?.substring(0, 8)}...</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">{p.seller_id? "seller_id OK" : "Old Data"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {total > recentProducts.length &&!showAllProducts && (
            <button onClick={() => setShowAllProducts(true)} className="mt-4 w-full py-2.5 rounded-full border-2 border-dashed font-bold text-[11px] hover:border-slate-900 hover:bg-slate-50 transition-all">
              Show {total - recentProducts.length} More Products • Total {total} • Unlimited Seller
            </button>
          )}

          <div className="mt-4 p-3 rounded-[12px] bg-slate-900 text-white flex flex-wrap justify-between items-center gap-2 text-[10px] font-bold">
            <span>✅ Unlimited Logic: seller_id = {storeData?.shop_slug} • {total} Products Found • No OR Crash</span>
            <Link href={`/store/${storeData?.shop_slug}`} target="_blank" className="px-3 py-1 rounded-full bg-white text-black">View Customer Store ↗ {total} Products Live</Link>
          </div>
        </>
      ) : (
        <div className="mt-4 text-center py-10 border-2 border-dashed rounded-[16px] bg-slate-50">
          <div className="w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center mx-auto text-xl">📦</div>
          <p className="text-[13px] font-black mt-3">No products yet - Add 5 products for 3x more views</p>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[320px] mx-auto">Unlimited Seller Ready: Add product with seller_id = sellers.id • Trigger will auto set seller_id • Works for all new sellers lifetime</p>
          <Link href="/seller/products/new" className="inline-block mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-bold hover:bg-black shadow-sm">+ Add First Product</Link>
        </div>
      )}
    </div>
  )
}