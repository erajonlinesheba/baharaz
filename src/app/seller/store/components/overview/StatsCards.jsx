"use client";
import Link from "next/link";
import { useStore } from "../../layout";

export function StatsCards({ stats, storeData, shortUrl, socialScore, liveViewers }) {
  const { completion } = useStore();
  const total = stats?.total?? 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="p-5 rounded-[20px] bg-white border-2">
        <p className="text-[10px] uppercase text-slate-400 font-bold">Total Products</p>
        <p className="text-[28px] font-black">{total}</p>
        <p className="text-[10px] text-green-600 font-bold">{total} Live • Unlimited OK</p>
        <Link href="/seller/products" className="text-[9px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold mt-2 inline-block">Manage → {completion}%</Link>
      </div>
      <div className="p-5 rounded-[20px] bg-white border-2">
        <p className="text-[10px] uppercase text-slate-400 font-bold">Store Views</p>
        <p className="text-[28px] font-black">{total * 124}</p>
        <p className="text-[10px] text-blue-600 font-bold">{liveViewers} Live Now</p>
        <p className="text-[10px] truncate bg-slate-50 px-2 py-1 rounded-full border mt-2">{shortUrl}</p>
      </div>
      <div className="p-5 rounded-[20px] bg-white border-2">
        <p className="text-[10px] uppercase text-slate-400 font-bold">Orders</p>
        <p className="text-[28px] font-black">0</p>
        <p className="text-[10px]">{socialScore}% Social Score</p>
      </div>
      <div className="p-5 rounded-[20px] bg-slate-900 text-white">
        <p className="text-[10px] uppercase text-white/60 font-bold">Rating</p>
        <p className="text-[28px] font-black">{storeData?.rating || 4.9} ⭐</p>
        <p className="text-[10px]">{completion}% Complete</p>
      </div>
    </div>
  );
}
export default StatsCards;