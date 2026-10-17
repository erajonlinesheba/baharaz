import Link from "next/link"
import { Fingerprint, ShieldCheck, Lock, EyeOff, AlertTriangle, Phone, KeyRound, Smartphone, Mail } from "lucide-react"

export default function SecurePin() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-3 md:px-4 pb-20">

        <div className="pt-[88px] md:pt-[92px] pb-3 relative z-20">
          <Link href="/help" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border shadow-sm rounded-full text-[11px] md:text-[12px] font-bold hover:bg-black hover:text-white transition-all">
            ← Back to Help
          </Link>
        </div>

        <div className="bg-white rounded-[16px] md:rounded-[24px] border p-5 md:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-[#111] flex items-center justify-center shrink-0">
              <Fingerprint className="text-white" size={22} />
            </div>
            <div className="flex-1">
              <h1 className="text-[20px] md:text-[28px] font-black leading-tight">Secure PIN Help - Bank Level Safety</h1>
              <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">Your 4-digit PIN protects every payment. Hashed with bcrypt, never visible to anyone.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-[#f0fdf4] border border-green-200 text-green-700 rounded-full text-[10px] font-bold">✓ 256-bit Encrypted</span>
                <span className="px-3 py-1 bg-[#eff6ff] border border-blue-200 text-blue-700 rounded-full text-[10px] font-bold">✓ 3 Try Lock</span>
                <span className="px-3 py-1 bg-[#fef3c7] border border-orange-200 text-orange-700 rounded-full text-[10px] font-bold">✓ Never Share</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-black text-[13px] flex items-center gap-2"><KeyRound size={16} /> Secure PIN কি?</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">এটা তোমার 4 সংখ্যার গোপন Code - যেমন bKash PIN। প্রত্যেকবার Payment এর সময় লাগবে। PIN ছাড়া কেউ তোমার টাকা নিতে পারবে না।</p>
          </div>
          <div className="bg-[#111] text-white rounded-[16px] p-5 border border-[#222]">
            <h3 className="font-black text-[13px] flex items-center gap-2"><ShieldCheck size={16} className="text-[#f85606]" /> কিভাবে Safe থাকে?</h3>
            <ul className="text-[11px] text-gray-300 mt-3 space-y-2 list-disc pl-4">
              <li>bcrypt + salt দিয়ে hash করা</li>
              <li>3 বার ভুল দিলে 30 মিনিট Lock</li>
              <li>Staff, Admin কেউ PIN দেখতে পারে না</li>
            </ul>
          </div>
        </div>

        <div className="bg-white border rounded-[16px] p-5 mt-4">
          <h3 className="font-black text-[14px]">PIN ভুলে গেছেন? 3 টা উপায় আছে</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-[#fffbeb] border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-[12px]"><Smartphone size={14} /> 1. OTP দিয়ে Reset</div>
              <p className="text-[11px] text-gray-600 mt-2">Login → Forgot PIN → Phone e OTP আসবে → নতুন PIN দিন।</p>
            </div>
            <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-[12px]"><Mail size={14} /> 2. Email দিয়ে</div>
              <p className="text-[11px] text-gray-600 mt-2">Email e link যাবে - click করে নতুন PIN set করুন।</p>
            </div>
            <div className="bg-[#f0fdf4] border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 font-bold text-[12px]"><Phone size={14} /> 3. Call Center</div>
              <p className="text-[11px] text-gray-600 mt-2">09613-XXXXXX e call দিন - NID verification করে Reset করে দেবো।</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}