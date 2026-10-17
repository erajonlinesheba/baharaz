"use client";

export default function TrustBadges({ store }) {
  const badges = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Inside Dhaka 24-48h",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      dot: "bg-blue-500",
    },
    {
      icon: "💵",
      title: "Cash On Delivery",
      desc: "Pay after checking",
      color: "bg-green-50 border-green-200 text-green-700",
      dot: "bg-green-500",
    },
    {
      icon: "↩️",
      title: "Easy Return",
      desc: "7 Days Return Policy",
      color: "bg-amber-50 border-amber-200 text-amber-700",
      dot: "bg-amber-500",
    },
    {
      icon: "✅",
      title: "100% Authentic",
      desc: "Original Products Only",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      dot: "bg-emerald-500",
    },
    {
      icon: "💬",
      title: "Live Chat Support",
      desc: "Chat Before Order",
      color: "bg-violet-50 border-violet-200 text-violet-700",
      dot: "bg-violet-500",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      desc: "SSL Protected Checkout",
      color: "bg-slate-50 border-slate-200 text-slate-700",
      dot: "bg-slate-500",
    },
  ];

  return (
    <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-black text-slate-900 tracking-wide flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[12px]">🛡️</span>
          Why Shop From {store?.shop_name? store.shop_name.slice(0, 20) : "Us"}?
        </h3>
        <span className="hidden md:flex items-center gap-1 text-[10px] bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-bold">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Trusted Seller
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
        {badges.map((badge, i) => (
          <div key={i} className={`rounded-[14px] border p-3 md:p-3.5 flex flex-col items-center md:items-start text-center md:text-left gap-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all duration-200 ${badge.color}`}>
            <div className="flex items-center gap-2 w-full justify-center md:justify-start">
              <span className="text-[18px]">{badge.icon}</span>
              <span className={`hidden md:block w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`}></span>
            </div>
            <p className="text-[11px] font-black leading-tight mt-1">{badge.title}</p>
            <p className="text-[10px] font-medium opacity-80 leading-tight">{badge.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center md:justify-between gap-2 p-2.5 bg-[#f8fafc] border border-slate-100 rounded-[10px]">
        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
          <span className="text-[11px]">💡</span> Order করার আগে Live Chat এ Size, Color, Delivery নিয়ে Confirm করুন!
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">🇧🇩</span>
          <span className="text-[10px] font-bold text-slate-600">Made for Bangladesh - বিকাশ, নগদ, রকেট Available</span>
        </div>
      </div>
    </div>
  );
}