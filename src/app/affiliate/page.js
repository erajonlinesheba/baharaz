"use client"
import Link from "next/link"
import { useState } from "react"
import { DollarSign, Share2, TrendingUp, Users, Gift, Wallet, Link2, BarChart3, ShieldCheck, Zap, Star, ArrowRight, Play, Check, Sparkles, Award, Clock, Smartphone } from "lucide-react"

export default function Affiliate(){
  const [phone,setPhone]=useState('')
  const [calcAmount,setCalcAmount]=useState(10000)
  const [toast,setToast]=useState('')
  const [faqOpen,setFaqOpen]=useState(null)

  const showToast = (m) => { setToast(m); setTimeout(()=> setToast(''), 3000) }

  const handleJoin = (e) => {
    e.preventDefault()
    if(phone.length < 11){ showToast('⚠️ Valid Phone দিন!'); return }
    showToast('🎉 Affiliate Account Created! Dashboard link sent to your phone!')
  }

  const commission = Math.round(calcAmount * 0.1)
  const faqs = [
    {q:'How much can I earn as affiliate?', a:'Up to 10% per sale! If you sell ৳10,000 product, you get ৳1,000 commission. No limit - Sell more, earn more. Top affiliates earn ৳50k to ৳2L per month.'},
    {q:'When will I get paid?', a:'Daily payout! Minimum withdraw ৳100. Payment directly to bKash, Nagad, Rocket or Bank. Instant withdrawal 24/7.'},
    {q:'Do I need to buy products?', a:'No! 100% free. Just share product link from Baharaz app/website. When someone buys via your link, you earn commission automatically.'},
    {q:'How to share products?', a:'Go to any product > Click Share > Copy Affiliate Link > Share on Facebook, Messenger, WhatsApp, TikTok, YouTube. Every purchase via link = commission!'},
  ]

  return (
    <div className="min-h-screen bg-[#f8f8fb]">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[13px] font-black z-[9999] shadow-2xl animate-bounce border border-white/10">{toast}</div>}

      <div className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="pt-[90px] md:pt-[110px] pb-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white shadow-sm border-2 border-gray-100 rounded-full text-xs md:text-sm font-black hover:bg-black hover:text-white hover:border-black transition">← Back to Home</Link>
          <Link href="/help" className="text-[11px] font-bold text-gray-500 hover:text-black">Need Help? →</Link>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a1a00] text-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f85606]/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[11px] font-black shadow-xl"><Sparkles size={14}/> BAHARAZ AFFILIATE PROGRAM</div>
              <h1 className="text-[28px] md:text-[48px] font-black leading-[0.9] mt-6 tracking-tight">Baharaz Affiliate<br/><span className="text-[#f85606] bg-gradient-to-r from-[#f85606] to-[#ff8a00] bg-clip-text text-transparent">Earn 10% Commission</span><br/>Per Sale! 💰</h1>
              <p className="mt-4 text-[13px] md:text-[15px] text-gray-300 leading-[22px] max-w-[500px]">Share products and earn on every sale. No investment, no stock, no delivery hassle! 50k+ products - Just share & earn. Top affiliates earn ৳1L+ monthly!</p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-black">✓ Free to Join</span>
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-black">✓ No Investment</span>
                <span className="px-3 py-1.5 bg-[#f85606] rounded-full text-[10px] font-black">✓ Daily Payout</span>
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-black">✓ 10% Commission</span>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={()=> document.getElementById('join-form')?.scrollIntoView({behavior:'smooth'})} className="bg-[#f85606] text-white px-8 py-4 rounded-full text-[13px] font-black hover:bg-white hover:text-black transition flex items-center gap-2 shadow-xl">Join Free Now <ArrowRight size={16}/></button>
                <button className="bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-4 rounded-full text-[12px] font-black flex items-center gap-2 hover:bg-white hover:text-black transition"><Play size={14}/> How It Works</button>
              </div>
            </div>

            <div id="join-form" className="bg-white rounded-[24px] p-6 md:p-7 text-black shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <h3 className="font-black text-[18px] flex items-center gap-2"><Gift size={20} className="text-[#f85606]"/> Start Earning Today - Free!</h3>
              <p className="text-[11px] text-gray-500 mt-1">Join 20,000+ affiliates - Earn from first share</p>
              
              <form onSubmit={handleJoin} className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-black mb-1.5">Phone Number *</p>
                  <input value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9]/g,''))} placeholder="01XXXXXXXXX" className="w-full border-2 border-gray-100 rounded-full px-4 py-3 text-[13px] outline-none focus:border-black focus:ring-2 focus:ring-black/10" required/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-1.5">Where will you share? (Facebook, TikTok...)</p>
                  <select className="w-full border-2 border-gray-100 rounded-full px-4 py-3 text-[13px] outline-none focus:border-black bg-white">
                    <option>Facebook Page / Group</option>
                    <option>Facebook Profile</option>
                    <option>Messenger / WhatsApp</option>
                    <option>TikTok / YouTube</option>
                    <option>Instagram</option>
                    <option>Website / Blog</option>
                  </select>
                </div>

                {/* Calculator */}
                <div className="bg-[#f8f8fb] border-2 border-gray-100 rounded-[16px] p-4">
                  <p className="text-[11px] font-black flex items-center gap-1"><BarChart3 size={12}/> Earnings Calculator</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[12px] font-bold">৳</span>
                    <input type="range" min="1000" max="100000" step="1000" value={calcAmount} onChange={e=>setCalcAmount(Number(e.target.value))} className="flex-1 accent-[#f85606]"/>
                    <span className="text-[12px] font-black bg-white px-2 py-1 rounded-full border">৳{calcAmount.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center bg-black text-white rounded-full px-4 py-2">
                    <span className="text-[11px] font-bold">Your Commission (10%)</span>
                    <span className="text-[14px] font-black text-[#f85606]">৳{commission.toLocaleString()} 💰</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-black text-[13px] hover:bg-[#f85606] transition shadow-lg flex items-center justify-center gap-2">Join Affiliate - Free → <ArrowRight size={16}/></button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 bg-[#f0fdf4] border border-[#c8e6c9] p-2.5 rounded-full">
                  <ShieldCheck size={14} className="text-green-600"/> <span>100% Free • No Investment • Instant Approval</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {[
            {label:'Commission', value:'Up to 10%', icon:<DollarSign size={18}/>, color:'text-[#f85606] bg-[#fff1e6]'},
            {label:'Products', value:'50k+ Products', icon:<Share2 size={18}/>, color:'text-blue-600 bg-[#eff6ff]'},
            {label:'Payout', value:'Daily Payout', icon:<Wallet size={18}/>, color:'text-green-600 bg-[#f0fdf4]'},
            {label:'Affiliates', value:'20k+ Joined', icon:<Users size={18}/>, color:'text-purple-600 bg-[#faf5ff]'},
            {label:'Avg Earning', value:'৳25k+/month', icon:<TrendingUp size={18}/>, color:'text-orange-600 bg-[#fff7ed]'},
            {label:'Withdraw', value:'Min ৳100', icon:<Zap size={18}/>, color:'text-black bg-gray-100'},
          ].map((s,i)=>(
            <div key={i} className="bg-white border-2 border-gray-100 rounded-[16px] p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${s.color} mb-2`}>{s.icon}</div>
              <p className="font-black text-[13px]">{s.value}</p>
              <p className="text-[10px] text-gray-500 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-white border-2 border-gray-100 rounded-[24px] p-6 md:p-10 mt-6 shadow-sm">
          <h2 className="font-black text-[22px] text-center">How Affiliate Works - Earn in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {step:'01', title:'Join Free & Get Link', desc:'Register free, go to any product, click Share → Copy your unique affiliate link.', icon:<Link2 size={22}/>, color:'bg-black'},
              {step:'02', title:'Share Anywhere', desc:'Share link on Facebook, Messenger, WhatsApp, TikTok, YouTube, Instagram - Anywhere!', icon:<Share2 size={22}/>, color:'bg-[#f85606]'},
              {step:'03', title:'Earn Commission', desc:'When someone buys via your link, you get 10% commission instantly in wallet. Withdraw daily!', icon:<Wallet size={22}/>, color:'bg-green-600'},
            ].map((s,i)=>(
              <div key={i} className="relative p-6 rounded-[18px] bg-[#f8f8fb] border-2 border-gray-100 hover:border-black hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-full ${s.color} text-white flex items-center justify-center shadow`}>{s.icon}</div>
                <div className="absolute top-4 right-4 text-[36px] font-black text-gray-100">{s.step}</div>
                <h3 className="font-black text-[14px] mt-4">{s.step}. {s.title}</h3>
                <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">{s.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-green-600"><Check size={12}/> No investment needed</div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="bg-black text-white rounded-[24px] p-7 md:p-10 mt-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f85606]/20 rounded-full blur-[60px]"></div>
          <h2 className="font-black text-[22px] text-center relative z-10">Commission Structure - Earn More When You Sell More 🚀</h2>
          <div className="grid md:grid-cols-4 gap-4 mt-8 relative z-10">
            {[
              {tier:'Starter', sales:'1-10 Sales', commission:'5%', bonus:'৳0', color:'bg-white/10'},
              {tier:'Silver', sales:'11-50 Sales', commission:'7%', bonus:'৳500 Bonus', color:'bg-[#f85606]/20 border border-[#f85606]/30'},
              {tier:'Gold', sales:'51-200 Sales', commission:'10%', bonus:'৳2,000 Bonus', color:'bg-yellow-500/20 border border-yellow-500/30'},
              {tier:'Diamond', sales:'200+ Sales', commission:'12% + Bonus', bonus:'৳10,000 Bonus', color:'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/50'},
            ].map((t,i)=>(
              <div key={i} className={`${t.color} rounded-[16px] p-5 text-center`}>
                <p className="text-[11px] font-black opacity-60">{t.tier}</p>
                <p className="font-black text-[16px] mt-1">{t.sales}</p>
                <p className="text-[24px] font-black text-[#f85606] mt-2">{t.commission}</p>
                <p className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded-full inline-block mt-2">{t.bonus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white border-2 border-gray-100 rounded-[24px] p-6 md:p-10 mt-6">
          <h2 className="font-black text-[22px] text-center">Affiliate FAQ - Common Questions</h2>
          <div className="mt-6 space-y-3 max-w-[800px] mx-auto">
            {faqs.map((f,i)=>(
              <div key={i} className="border-2 border-gray-100 rounded-[16px] overflow-hidden">
                <button onClick={()=> setFaqOpen(faqOpen===i? null : i)} className="w-full flex justify-between items-center p-4 text-left hover:bg-[#f8f8fb] transition">
                  <span className="font-bold text-[13px]">{f.q}</span>
                  <span className={`w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[12px] transition ${faqOpen===i? 'rotate-45':''}`}>+</span>
                </button>
                {faqOpen===i && <div className="p-4 pt-0 text-[12px] text-gray-600 leading-[20px] bg-[#f8f8fb]">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#f85606] to-[#ff8a00] rounded-[24px] p-8 mt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-[0_20px_40px_rgba(248,86,6,0.3)]">
          <div>
            <h3 className="font-black text-[22px] flex items-center gap-2"><Award size={22}/> Ready to Earn? Join 20,000+ Affiliates!</h3>
            <p className="text-[12px] opacity-90 mt-2">Free registration • No investment • Daily payout • Start earning from first share!</p>
          </div>
          <button onClick={()=> document.getElementById('join-form')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-3 bg-black rounded-full text-[13px] font-black hover:bg-white hover:text-black transition shadow-xl flex items-center gap-2 whitespace-nowrap">Join Now - Free <ArrowRight size={16}/></button>
        </div>
      </div>
    </div>
  )
}