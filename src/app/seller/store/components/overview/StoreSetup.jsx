"use client";
import Link from "next/link";
import { useStore } from "../../layout";

export function StoreSetup({ completion, completedCount, completionPercent }) {
  return (
    <div className="p-5 rounded-[20px] border-2 bg-white w-full">
      <h3 className="font-black text-[13px]">Store Setup • {completedCount}/{completion?.length} • {completionPercent}% Complete</h3>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
        {completion?.map((c,i)=>(
          <Link key={i} href={c.path} className={`p-3 rounded-[12px] border-2 ${c.done? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <p className="text-[14px]">{c.icon} {c.label}</p>
            <p className="text-[9px] text-slate-500">{c.sub}</p>
            <p className="text-[9px] font-bold mt-1">{c.done? "✓ Done" : "Need Fix"}</p>
          </Link>
        ))}
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full bg-slate-900 transition-all" style={{ width: `${completionPercent}%` }}></div></div>
    </div>
  )
}
export default StoreSetup;