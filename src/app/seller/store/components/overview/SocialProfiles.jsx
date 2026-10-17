"use client";
import { useStore } from "../../layout";

export function SocialProfiles({ socialPlatforms }) {
  return (
    <div className="p-5 rounded-[20px] border-2 bg-white w-full">
      <h3 className="font-black text-[13px]">Social Profiles • {socialPlatforms?.filter(s=>s.done).length}/{socialPlatforms?.length} Connected</h3>
      <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
        {socialPlatforms?.map((s,i)=>(
          <a key={i} href={s.link} target="_blank" className={`p-3 rounded-[12px] text-center border-2 ${s.done? "bg-green-50 border-green-200" : "bg-slate-50"}`}>
            <p className="text-[16px]">{s.icon}</p>
            <p className="text-[10px] font-bold mt-1">{s.name}</p>
            <p className="text-[8px]">{s.done? "✓ Connected" : "Not Set"}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
export default SocialProfiles;