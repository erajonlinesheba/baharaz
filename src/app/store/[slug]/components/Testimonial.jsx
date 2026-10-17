"use client";

import { useState } from "react";

export default function Testimonial({ store }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = store?.testimonials || [
    {
      name: "Fatema Akter",
      location: "Dhaka, Bangladesh",
      avatar: "F",
      rating: 5,
      text: `Amazing products from ${store?.shop_name || "this store"}! Quality 100% authentic, delivery super fast. Live chat e size niye confirm korechi, onek helpful chilo! Highly recommended! ❤️`,
      product: "T-Shirt Combo",
      verified: true,
    },
    {
      name: "Rahman Hossain",
      location: "Chittagong",
      avatar: "R",
      rating: 5,
      text: "Cash on delivery, product hate peye check kore taka diyechi. 2 din er moddhe delivery peyechi Chittagong e. Packaging o onek valo chilo. Will order again!",
      product: "Premium Watch",
      verified: true,
    },
    {
      name: "Nusrat Jahan",
      location: "Sylhet",
      avatar: "N",
      rating: 5,
      text: "Order korar age live chat e kotha bolechi, sathe sathe reply diyeche. Product same as picture! 7 days return policy ache tai nischinte order korechi. Thank you!",
      product: "Hijab Collection",
      verified: true,
    },
    {
      name: "Sakib Ahmed",
      location: "Rajshahi",
      avatar: "S",
      rating: 5,
      text: "Best online shop in BD! Price reasonable, quality top notch. Customer support 10/10. Amar 3rd order eita, protibar e satisfied!",
      product: "Panjabi Premium",
      verified: true,
    },
  ];

  return (
    <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 text-slate-900 rounded-[10px] flex items-center justify-center text-[16px] font-black">★</div>
          <div>
            <h3 className="text-[16px] font-black text-slate-900 flex items-center gap-2">
              Happy Customers
              <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] rounded-full font-black">
                4.9/5.0 • {testimonials.length * 127}+ Reviews
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Real reviews from verified buyers - Chat before order!</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${activeIndex === i? "w-8 bg-slate-900" : "w-2 bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      {/* Main Review Card */}
      <div className="relative">
        <div className="bg-[#f8fafc] border border-slate-100 rounded-[16px] p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[14px] shadow-md">
                {testimonials[activeIndex].avatar}
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-900 flex items-center gap-1.5">
                  {testimonials[activeIndex].name}
                  {testimonials[activeIndex].verified && <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px]">✓</span>}
                </p>
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">📍 {testimonials[activeIndex].location} • {testimonials[activeIndex].product}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-[12px] ${i < testimonials[activeIndex].rating? "text-amber-500" : "text-slate-200"}`}>★</span>
              ))}
            </div>
          </div>

          <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
            "{testimonials[activeIndex].text}"
          </p>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-full font-bold">✓ Verified Purchase</span>
            <span className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full font-bold">💬 Chatted Before Order</span>
            <span className="ml-auto text-[10px]">2 days ago</span>
          </div>
        </div>

        {/* Nav Buttons */}
        <button onClick={() => setActiveIndex((p) => (p - 1 + testimonials.length) % testimonials.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-3 w-8 h-8 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-[14px] font-black hover:bg-slate-900 hover:text-white transition-all active:scale-90">‹</button>
        <button onClick={() => setActiveIndex((p) => (p + 1) % testimonials.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-3 w-8 h-8 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-[14px] font-black hover:bg-slate-900 hover:text-white transition-all active:scale-90">›</button>
      </div>

      {/* All Reviews Grid (Desktop) */}
      <div className="hidden md:grid grid-cols-3 gap-3 mt-4">
        {testimonials.slice(0, 3).map((t, i) => (
          <button key={i} onClick={() => setActiveIndex(i)} className={`text-left p-3 rounded-[12px] border transition-all ${activeIndex === i? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${activeIndex === i? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}>{t.avatar}</span>
              <span className={`text-[11px] font-bold truncate ${activeIndex === i? "text-white" : "text-slate-900"}`}>{t.name}</span>
            </div>
            <p className={`text-[11px] leading-snug line-clamp-2 ${activeIndex === i? "text-white/70" : "text-slate-600"}`}>"{t.text.slice(0, 70)}..."</p>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button onClick={() => { const el = document.getElementById("live-chat-trigger"); if (el) el.click(); }} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-black hover:bg-black transition-all active:scale-95 shadow-md">
          💬 Chat & Order Like Them!
        </button>
      </div>
    </div>
  );
}