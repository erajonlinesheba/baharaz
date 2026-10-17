import Link from "next/link"
import { RotateCcw, ShieldCheck, Clock, Package, Phone, Mail, CheckCircle, AlertTriangle, Truck, CreditCard } from "lucide-react"

export default function ReturnRefund() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-3 md:px-4 pb-20">

        {/* Back Button - Zero Gap Fixed */}
        <div className="pt-[88px] md:pt-[92px] pb-3 relative z-20">
          <Link href="/help" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border shadow-sm rounded-full text-[11px] md:text-[12px] font-bold hover:bg-black hover:text-white transition-all">
            ← Back to Help
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-[16px] md:rounded-[24px] border p-5 md:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-[#111] flex items-center justify-center shrink-0">
              <RotateCcw className="text-white" size={22} />
            </div>
            <div className="flex-1">
              <h1 className="text-[20px] md:text-[28px] font-black leading-tight text-[#111]">Return & Refund - 7 Days Free</h1>
              <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">No question asked return. 7 days e free return, 24 hours e refund. Last updated: 27 Sep 2026</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-[#f0fdf4] border border-green-200 text-green-700 rounded-full text-[10px] font-bold">✓ 7 Days Return</span>
                <span className="px-3 py-1 bg-[#eff6ff] border border-blue-200 text-blue-700 rounded-full text-[10px] font-bold">✓ Free Pickup</span>
                <span className="px-3 py-1 bg-[#fef3c7] border border-orange-200 text-orange-700 rounded-full text-[10px] font-bold">✓ 24h Refund</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white border rounded-[16px] p-5">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">1</div>
            <h3 className="font-black text-[13px] mt-3 flex items-center gap-2"><Package size={14} /> Request Return</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">My Orders → Select Product → Return → Reason select korun. 30 second e request done.</p>
          </div>
          <div className="bg-white border rounded-[16px] p-5">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">2</div>
            <h3 className="font-black text-[13px] mt-3 flex items-center gap-2"><Truck size={14} /> Free Pickup</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">Rider 24h er moddhe apnar basha theke free pickup korbe. Kono charge nai. Package ready rakun.</p>
          </div>
          <div className="bg-[#111] text-white border border-[#222] rounded-[16px] p-5">
            <div className="w-8 h-8 bg-[#f85606] text-white rounded-full flex items-center justify-center font-black text-[12px]">3</div>
            <h3 className="font-black text-[13px] mt-3 flex items-center gap-2"><CreditCard size={14} className="text-[#f85606]" /> Instant Refund</h3>
            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">Product warehouse e pouchalei 24h e bKash / Bank e refund. SMS paben.</p>
          </div>
        </div>

        {/* What Can Return */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-[#f0fdf4] border border-green-200 rounded-[16px] p-5">
            <h3 className="font-black text-[13px] flex items-center gap-2 text-green-800"><CheckCircle size={16} /> Return Kora Jabe</h3>
            <ul className="text-[11px] text-gray-700 mt-3 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Size choto / boro hole</li>
              <li>Product damaged / defect</li>
              <li>Wrong product / color</li>
              <li>Quality bhalo na lagle</li>
              <li>7 din er moddhe - kono question chara</li>
            </ul>
          </div>
          <div className="bg-[#fff1f2] border border-red-200 rounded-[16px] p-5">
            <h3 className="font-black text-[13px] flex items-center gap-2 text-red-700"><AlertTriangle size={16} /> Return Hobe Na</h3>
            <ul className="text-[11px] text-gray-700 mt-3 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Underwear, cosmetics (hygiene)</li>
              <li>7 din er beshi hole</li>
              <li>Tag kata / use kora product</li>
              <li>Flash Sale - Final Sale item</li>
              <li>Free gift item</li>
            </ul>
          </div>
        </div>

        {/* Refund Time */}
        <div className="bg-white border rounded-[16px] p-5 mt-4">
          <h3 className="font-black text-[13px] flex items-center gap-2"><Clock size={16} /> Refund Time - Koto Din Lage?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="bg-[#f5f5f5] rounded-xl p-3 border"><div className="font-bold text-[11px]">bKash / Nagad</div><div className="text-[11px] text-gray-600 mt-1">24 hours - Instant</div></div>
            <div className="bg-[#f5f5f5] rounded-xl p-3 border"><div className="font-bold text-[11px]">Bank Card</div><div className="text-[11px] text-gray-600 mt-1">3-5 working days</div></div>
            <div className="bg-[#f5f5f5] rounded-xl p-3 border"><div className="font-bold text-[11px]">Baharaz Wallet</div><div className="text-[11px] text-gray-600 mt-1">2 hours - Fastest</div></div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border rounded-[16px] p-5 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-[14px] flex items-center gap-2"><ShieldCheck size={16} className="text-green-600" /> 100% Buyer Protection by Baharaz</h3>
            <p className="text-[11px] text-gray-500 mt-1">Return niye problem? Amra 5 minute e solve korbo</p>
          </div>
          <div className="flex gap-2">
            <a href="tel:09613-xxxxxx" className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-full text-[11px] font-bold border hover:bg-black hover:text-white transition"><Phone size={14} /> 09613-XXXXXX</a>
            <Link href="/help/contact-us" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold hover:bg-[#f85606] transition"><Mail size={14} /> Contact Us</Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6">© 2026 Baharaz Bangladesh Ltd. | 7 Days Free Return Policy - BD Consumer Law Compliant</p>

      </div>
    </div>
  )
}