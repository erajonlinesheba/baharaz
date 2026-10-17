"use client"
import Link from "next/link"
import { useState } from "react"
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Sparkles, Headphones, ShieldCheck } from "lucide-react"

export default function ContactUsPage(){
  const [name,setName]=useState('')
  const [msg,setMsg]=useState('')
  const [sent,setSent]=useState(false)

  return(
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="max-w-[1200px] mx-auto px-4 pt-[90px] pb-20">
        <Link href="/help" className="text-[11px] font-black bg-white px-4 py-2 rounded-full border shadow-sm hover:bg-black hover:text-white transition">← Back to Help Center</Link>

        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-[26px] p-8 md:p-12 mt-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f85606]/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>
          <div className="relative z-10 max-w-[700px]">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-[11px] font-black border border-white/10"><Sparkles size={14}/> WE ARE HERE 24/7 FOR YOU</div>
            <h1 className="text-[32px] md:text-[48px] font-black leading-[0.9] mt-5">Contact Us<br/>We Love To Hear<br/>From You 💬</h1>
            <p className="text-[13px] md:text-[14px] opacity-70 mt-4 leading-[22px]">Have a question? Complaint? Or just want to say Hi? Our team is online 24/7. Average reply time is only 2 minutes on Live Chat!</p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-black flex items-center gap-1.5"><Clock size={12}/> Avg Reply 2 min</span>
              <span className="px-3 py-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full text-[10px] font-black flex items-center gap-1.5"><Headphones size={12}/> 1M+ Happy Customers</span>
              <span className="px-3 py-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full text-[10px] font-black flex items-center gap-1.5"><ShieldCheck size={12}/> 100% Secure & Trusted</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-[20px] border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-[14px] bg-[#f0fdf4] flex items-center justify-center text-green-600"><Phone size={22}/></div>
            <h3 className="font-black text-[14px] mt-4">Call Hotline</h3>
            <p className="text-[20px] font-black mt-2 text-[#f85606]">09613-800800</p>
            <p className="text-[11px] text-gray-500 mt-1">Everyday 9AM - 9PM - Free Call</p>
            <p className="text-[11px] text-gray-500">64 Districts Support</p>
            <button className="mt-4 w-full bg-black text-white py-3 rounded-full text-[11px] font-black hover:bg-[#f85606] transition">Call Now →</button>
          </div>
          <div className="bg-white rounded-[20px] border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-[14px] bg-[#eff6ff] flex items-center justify-center text-blue-600"><MessageCircle size={22}/></div>
            <h3 className="font-black text-[14px] mt-4">Live Chat</h3>
            <p className="text-[13px] font-black mt-2">Instant Reply in 2 Minutes</p>
            <p className="text-[11px] text-gray-500 mt-1">We are online 24/7</p>
            <p className="text-[11px] text-gray-500">Chat with real human</p>
            <button className="mt-4 w-full bg-[#f85606] text-white py-3 rounded-full text-[11px] font-black hover:bg-black transition">Start Chat →</button>
          </div>
          <div className="bg-white rounded-[20px] border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-[14px] bg-[#fff7ed] flex items-center justify-center text-[#f85606]"><Mail size={22}/></div>
            <h3 className="font-black text-[14px] mt-4">Email Support</h3>
            <p className="text-[13px] font-black mt-2">support@baharaz.com</p>
            <p className="text-[11px] text-gray-500 mt-1">Reply within 6 hours</p>
            <p className="text-[11px] text-gray-500">For any issue</p>
            <button className="mt-4 w-full bg-white border text-black py-3 rounded-full text-[11px] font-black hover:bg-black hover:text-white transition">Send Email →</button>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
          <div className="bg-white rounded-[24px] border p-7 md:p-8 shadow-sm">
            <h2 className="font-black text-[20px]">Send Us a Message ✉️</h2>
            <p className="text-[12px] text-gray-500 mt-2">Fill the form and we will reply super fast!</p>
            <div className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-black mb-2">Your Name</p>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Rahim Ahmed" className="w-full border rounded-full px-5 py-3.5 text-[13px] outline-none focus:ring-2 focus:ring-black"/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-2">Phone Number</p>
                  <input placeholder="01XXXXXXXXX" className="w-full border rounded-full px-5 py-3.5 text-[13px] outline-none focus:ring-2 focus:ring-black"/>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black mb-2">Email</p>
                <input placeholder="you@email.com" className="w-full border rounded-full px-5 py-3.5 text-[13px] outline-none focus:ring-2 focus:ring-black"/>
              </div>
              <div>
                <p className="text-[11px] font-black mb-2">Your Message</p>
                <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Write your problem in details..." rows={5} className="w-full border rounded-[18px] px-5 py-4 text-[13px] outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
              </div>
              {sent? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-[14px] text-[12px] font-bold">✅ Message Sent! We will reply within 2 minutes!</div>
              ) : (
                <button onClick={()=>setSent(true)} className="w-full bg-black text-white py-4 rounded-full text-[13px] font-black hover:bg-[#f85606] transition flex items-center justify-center gap-2"><Send size={16}/> Send Message</button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-[20px] border p-6 shadow-sm">
              <h3 className="font-black text-[14px] flex items-center gap-2"><MapPin size={16}/> Office Address</h3>
              <p className="text-[12px] text-gray-600 mt-3 leading-[20px]">Baharaz HQ, Level 5, Gulshan-1<br/>Dhaka-1212, Bangladesh<br/>64 Districts Coverage</p>
              <div className="mt-4 w-full h-[140px] bg-[#f8f8fb] rounded-[14px] border flex items-center justify-center text-[11px] font-black text-gray-400">🗺️ Google Map View</div>
            </div>
            <div className="bg-[#f85606] rounded-[20px] p-6 text-white">
              <h3 className="font-black text-[14px]">Emergency?</h3>
              <p className="text-[11px] opacity-80 mt-2 leading-[18px]">If your order is urgent or payment failed, call us directly. No waiting!</p>
              <p className="text-[22px] font-black mt-3">09613-800800</p>
              <p className="text-[10px] opacity-70 mt-1">24/7 Emergency Line</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}