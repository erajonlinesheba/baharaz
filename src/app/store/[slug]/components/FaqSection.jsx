"use client";

import { useState } from "react";

export default function FaqSection({ store }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: `How to order from ${store?.shop_name || "this store"}?`,
      a: "Product এ Click করে Order Now Button এ Click করুন, তারপর Address, Phone দিয়ে Place Order করুন। Order করার আগে Live Chat Icon এ Click করে Seller এর সাথে Chat করতে পারবেন Size, Color, Delivery নিয়ে!",
    },
    {
      q: "Cash On Delivery Available?",
      a: "Yes! 100% Cash On Delivery Available All Over Bangladesh. Product হাতে পেয়ে Check করে টাকা দিবেন। Dhaka তে Delivery Charge 60-80TK, Outside Dhaka 120-150TK।",
    },
    {
      q: "Can I chat before ordering?",
      a: "Yes! একদম পারবেন! প্রতিটা Product Card এ 💬 Chat Icon আছে, ওটাতে Click করে Order এর আগেই Seller এর সাথে Live Chat করতে পারবেন। Size, Color, Stock, Delivery Time সব জিজ্ঞেস করতে পারবেন!",
    },
    {
      q: "What is delivery time?",
      a: "Inside Dhaka 24-48 Hours, Outside Dhaka 48-72 Hours. Emergency Delivery Available In Dhaka City Within 6 Hours (Extra Charge). You will get tracking after order confirm!",
    },
    {
      q: "Return Policy কি?",
      a: "7 Days Easy Return! Product এ Defect থাকলে বা Wrong Product গেলে Free Return. Product Unused এবং Tag সহ থাকতে হবে। Return এর জন্য Live Chat এ Message করুন, 30 Min এর মধ্যে Reply পাবেন!",
    },
    {
      q: `Is ${store?.shop_name || "this store"} trusted?`,
      a: "100% Trusted & Verified Seller! 500+ Happy Customers, 4.8★ Rating, Fast Reply In Live Chat, Cash On Delivery, 7 Days Return - সব আছে! আপনি নিশ্চিন্তে Order করতে পারেন!",
    },
  ];

  return (
    <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm p-4 md:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-slate-900 text-white rounded-[10px] flex items-center justify-center text-[16px] font-black">?</div>
        <div>
          <h3 className="text-[16px] font-black text-slate-900">Frequently Asked Questions</h3>
          <p className="text-[11px] text-slate-500 font-medium">Order করার আগে জেনে নিন - Chat করতে পারবেন যেকোনো সময়!</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={`border rounded-[12px] transition-all duration-200 overflow-hidden ${isOpen? "border-slate-900 bg-[#f8fafc] shadow-[0_4px_12px_rgba(0,0,0,0.05)]" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <button onClick={() => setOpenIndex(isOpen? -1 : i)} className="w-full flex items-center justify-between gap-3 p-3.5 md:p-4 text-left">
                <p className={`text-[12px] md:text-[13px] font-bold leading-[1.4] ${isOpen? "text-slate-900" : "text-slate-700"}`}>{faq.q}</p>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 transition-all ${isOpen? "bg-slate-900 text-white rotate-180" : "bg-[#f1f5f9] text-slate-500"}`}>⌄</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0">
                  <div className="h-px bg-slate-200 mb-3"></div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{faq.a}</p>
                  {i === 2 && (
                    <button onClick={() => { const t = document.getElementById("live-chat-trigger"); if (t) t.click(); }} className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-[11px] font-bold shadow-sm transition-all">
                      💬 Chat Now Before Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 bg-slate-900 rounded-[12px] flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-[11px] text-white/90 font-medium">Still have questions? Chat with us before ordering!</p>
        <button onClick={() => { const t = document.getElementById("live-chat-trigger"); if (t) t.click(); }} className="px-5 py-2 bg-white text-slate-900 rounded-full text-[11px] font-black hover:bg-slate-100 transition-all active:scale-95">
          💬 Live Chat
        </button>
      </div>
    </div>
  );
}