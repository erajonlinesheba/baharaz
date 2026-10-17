"use client";
import Link from "next/link";
import { useStore } from "../../layout";

export function StoreCard({ storeData, shortUrl }) {
  const { liveViewers, stats } = useStore();
  return (
    <div className="p-5 rounded-[20px] border-2 bg-white w-full">
      <h3 className="font-black text-[18px]">{storeData.shop_name} • {liveViewers} Live • {stats?.total || 0} Products</h3>
      <p className="text-[11px] mt-2 bg-slate-50 p-2 rounded-xl border line-clamp-2">{storeData.shop_description}</p>
      <div className="mt-3 flex gap-2">
        <Link href="/seller/store/branding" className="px-4 py-2 bg-slate-900 text-white rounded-full text-[11px] font-bold">Edit Branding</Link>
        <Link href={`/store/${storeData.shop_slug}`} target="_blank" className="px-4 py-2 bg-white border-2 rounded-full text-[11px] font-bold">View Live ↗</Link>
      </div>
    </div>
  )
}
export default StoreCard;