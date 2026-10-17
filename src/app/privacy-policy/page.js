import Link from "next/link"
import { Lock, ShieldCheck, EyeOff, Cookie, Phone, Mail, User, CreditCard, MapPin, Fingerprint, Clock, Globe, Baby, Trash2, FileText, AlertTriangle } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-3 md:px-4 pb-20">

        {/* Back Button - FIXED ZERO GAP */}
        <div className="pt-[88px] md:pt-[92px] pb-3 relative z-20">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border shadow-sm rounded-full text-[11px] md:text-[12px] font-bold hover:bg-black hover:text-white hover:border-black transition-all">
            ← Back to Home
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-[16px] md:rounded-[24px] border p-5 md:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-[#111] flex items-center justify-center shrink-0">
              <Lock className="text-white" size={22} />
            </div>
            <div className="flex-1">
              <h1 className="text-[20px] md:text-[28px] font-black leading-tight text-[#111]">Privacy Policy - Protected & Secure</h1>
              <p className="text-[11px] md:text-[13px] text-gray-500 mt-1">Your data is encrypted with 256-bit SSL, never sold. Last updated: 27 Sep 2026 | Baharaz Bangladesh</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-[#f0fdf4] border border-green-200 text-green-700 rounded-full text-[10px] font-bold">✓ 100% Safe</span>
                <span className="px-3 py-1 bg-[#eff6ff] border border-blue-200 text-blue-700 rounded-full text-[10px] font-bold">✓ No Spam</span>
                <span className="px-3 py-1 bg-[#fef3c7] border border-orange-200 text-orange-700 rounded-full text-[10px] font-bold">✓ BD Law Compliant</span>
                <span className="px-3 py-1 bg-[#f5f3ff] border border-purple-200 text-purple-700 rounded-full text-[10px] font-bold">✓ 256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Bar */}
        <div className="bg-[#111] text-white rounded-[16px] p-4 mt-4 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]"><FileText size={14} className="text-[#f85606]" /> <span>Reading time: 3 min | No legal jargon, plain Bangla + English</span></div>
          <div className="text-[10px] text-gray-400">Effective for all Baharaz users, sellers & visitors</div>
        </div>

        {/* What We Collect */}
        <div className="bg-white rounded-[16px] md:rounded-[20px] border p-5 md:p-6 mt-4">
          <h2 className="font-black text-[14px] md:text-[16px] flex items-center gap-2"><User size={16} className="text-orange-500" /> What we collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-[#fffbeb] border border-orange-100 rounded-xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 font-bold text-[12px]"><MapPin size={14} /> Delivery Info</div>
              <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">Name, phone number, full address. Only to deliver your order. We never ask NID unless for high-value return above 50,000 BDT.</p>
            </div>
            <div className="bg-[#f0fdf4] border border-green-100 rounded-xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 font-bold text-[12px]"><CreditCard size={14} /> Payment Info</div>
              <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">bKash, Nagad, Card last 4 digits only. Full number never stored. Encrypted with Secure PIN. PCI-DSS compliant.</p>
            </div>
            <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 font-bold text-[12px]"><EyeOff size={14} /> Browsing</div>
              <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">What you view, search, add to cart. To show better products. You can clear anytime from My Activity.</p>
            </div>
          </div>
        </div>

        {/* How We Use & Secure PIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-[#f0fdf4] border border-green-200 rounded-[16px] p-5">
            <h3 className="font-black text-[13px] flex items-center gap-2 text-green-800"><ShieldCheck size={16} /> We NEVER sell your data</h3>
            <p className="text-[11px] md:text-[12px] text-gray-700 mt-2 leading-relaxed">Your data is only used to: 1) Deliver orders 2) Customer support 3) Fraud prevention 4) Improve Baharaz. Never shared with third party for ads. Never sold. No exceptions.</p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] bg-white border px-2 py-1 rounded-full font-bold">No Ads Partner</span>
              <span className="text-[10px] bg-white border px-2 py-1 rounded-full font-bold">No Data Broker</span>
            </div>
          </div>
          <div className="bg-[#111] text-white rounded-[16px] p-5">
            <h3 className="font-black text-[13px] flex items-center gap-2"><Fingerprint size={16} className="text-[#f85606]" /> Secure PIN Protection</h3>
            <p className="text-[11px] md:text-[12px] text-gray-300 mt-2 leading-relaxed">Your 4-digit Secure PIN is hashed with bcrypt + salt. Even Baharaz team cannot see it. Every payment needs PIN. 3 wrong tries = 30 min lock + SMS alert to you.</p>
            <div className="mt-3 text-[10px] text-[#f85606] font-bold">🔐 Bank-level security by Baharaz</div>
          </div>
        </div>

        {/* NEW: Data Retention & Children & International */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-bold text-[12px] flex items-center gap-2"><Clock size={14} /> Data Retention</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">Order data 5 years for warranty (BD law). After account delete, all data erased in 7 days. Logs auto-delete in 30 days.</p>
          </div>
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-bold text-[12px] flex items-center gap-2"><Baby size={14} /> Children Privacy</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">Baharaz is for 18+ only. We never knowingly collect data from children under 18. If found, deleted instantly.</p>
          </div>
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-bold text-[12px] flex items-center gap-2"><Globe size={14} /> International</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">Your data stays in Bangladesh & Singapore AWS. Never transferred outside without your consent. GDPR & BD DSA compliant.</p>
          </div>
        </div>

        {/* Cookies & Rights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-bold text-[13px] flex items-center gap-2"><Cookie size={16} className="text-orange-500" /> Cookies & Tracking</h3>
            <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">We use essential cookies to keep you logged in and remember cart. No tracking cookies, no Facebook Pixel for personal data. You can block from browser settings - site will still work.</p>
          </div>
          <div className="bg-white border rounded-[16px] p-5">
            <h3 className="font-bold text-[13px] flex items-center gap-2"><Trash2 size={16} /> Your Rights (BD Digital Security Act 2023)</h3>
            <ul className="text-[11px] text-gray-600 mt-2 space-y-1.5 list-disc pl-4">
              <li>See what data we have - download from My Account</li>
              <li>Delete your account anytime - all data erased in 7 days</li>
              <li>Stop marketing SMS with STOP reply - instant</li>
              <li>Complain to privacy@baharaz.com - reply in 48 hours</li>
            </ul>
          </div>
        </div>

        {/* NEW: Security Incident */}
        <div className="bg-[#fff1f2] border border-red-200 rounded-[16px] p-5 mt-4">
          <h3 className="font-black text-[13px] flex items-center gap-2 text-red-700"><AlertTriangle size={16} /> If Data Breach Happens?</h3>
          <p className="text-[11px] text-gray-700 mt-2 leading-relaxed">Though never happened, if breach occurs: We will SMS + Email you within 24 hours, inform BD Govt, block affected accounts, force PIN reset. Transparency is our policy.</p>
        </div>

        {/* Contact */}
        <div className="bg-white border rounded-[16px] p-5 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-[14px]">Questions about privacy?</h3>
            <p className="text-[11px] text-gray-500">Our Data Protection Officer replies within 2 hours | 9AM - 11PM</p>
          </div>
          <div className="flex gap-2">
            <a href="tel:09613-xxxxxx" className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-full text-[11px] font-bold border hover:bg-black hover:text-white transition"><Phone size={14} /> 09613-XXXXXX</a>
            <a href="mailto:privacy@baharaz.com" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold hover:bg-[#f85606] transition"><Mail size={14} /> privacy@baharaz.com</a>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">© 2026 Baharaz Bangladesh Ltd. All rights reserved. Baharaz is a registered brand. Trade License: TRAD/DNCC/XXXXX | This policy is governed by Laws of Bangladesh.</p>

      </div>
    </div>
  )
}