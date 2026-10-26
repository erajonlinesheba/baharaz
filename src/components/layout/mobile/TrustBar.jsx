"use client";

export default function TrustBar() {
  return (
    <div className="w-full h-[36px] bg-white flex items-center justify-between px-3 border-b border-gray-100">
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-[9px]" aria-hidden="true">🛡️</span>
        <span className="text-[11px] font-[600] text-[#333]">Safe Payment</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center text-[9px]" aria-hidden="true">📦</span>
        <span className="text-[11px] font-[600] text-[#333]">Fast Delivery</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-[9px]" aria-hidden="true">↩️</span>
        <span className="text-[11px] font-[600] text-[#333]">Free Return</span>
      </div>
    </div>
  );
}