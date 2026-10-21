"use client"
import Link from "next/link"
import { useState } from "react"
import { Store, TrendingUp, Package, DollarSign, Truck, ShieldCheck, Users, BarChart3, Sparkles, ArrowRight, Check, Play, Headphones, Clock, Wallet, Award, Zap, Gift, Phone, Mail, MapPin, Star, ChevronDown } from "lucide-react"

export default function SellOnBaharazPage(){
  const [phone,setPhone]=useState('')
  const [shopName,setShopName]=useState('')
  const [category,setCategory]=useState('Fashion & Clothing')
  const [loading,setLoading]=useState(false)
  const [toast,setToast]=useState('')
  const [faqOpen,setFaqOpen]=useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(()=> setToast(''), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!shopName || !phone){
      showToast('⚠️ Please fill Shop Name & Phone!')
      return
    }
    if(phone.length < 11){
      showToast('⚠️ Valid Phone Number দিন!')
      return
    }
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      showToast('🎉 Seller Registration Success! We will call you in 24h - Baharaz Team')
      setShopName('')
      setPhone('')
    }, 1500)
  }

  const faqs = [
    {q: 'How much does it cost to start selling?', a: '100% FREE! No registration fee. 0% commission for first 30 days. After that only 5% to 12% commission.'},
    {q: 'How do I get paid?', a: 'Payment every 7 days directly to your bKash, Nagad, Rocket or Bank Account. Automatic payment, no delay.'},
    {q: 'Who handles delivery?', a: 'Baharaz handles everything! We pick from your shop and deliver to customer. You just pack the product.'},
    {q: 'How long to get seller account approved?', a: 'Only 24 hours! Submit your info, we verify and approve within 24 hours and call you.'},
    {q: 'Can I sell from any district?', a: 'Yes! 64 districts, 490+ upazila supported. Sell from anywhere in Bangladesh - Rajshahi, Dhaka, Chittagong all!'},
  ]

  return(
    <div className="min-h-screen bg-[#f8f8fb]">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[13px] font-black z-[9999] shadow-2xl animate-bounce border border-white/10">{toast}</div>}

      <div className="max-w-[1200px] mx-auto px-4 pt-[80px] pb-20">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#f85606] via-[#ff6a00] to-[#ff8a00] rounded-[28px] p-6 md:p-12 text-white relative overflow-hidden shadow-[0_20px_60px_rgba(248,86,6,0.3)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/20 rounded-full blur-[60px] -ml-20 -mb-20"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-yellow-300/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white text-[#f85606] px-4 py-2 rounded-full text-[11px] font-black shadow-xl animate-pulse"><Sparkles size={14}/> BECOME A BAHARAZ SELLER • 50,000+ SELLERS</div>
              <h1 className="text-[32px] md:text-[50px] font-black leading-[0.9] mt-6 tracking-tight">Sell On Baharaz<br/>Earn ৳50k+<br/>Every Month! 🏪</h1>
              <p className="text-[14px] opacity-95 mt-4 leading-[22px] max-w-[500px] font-medium">Join 50,000+ sellers, reach 10M+ customers in 64 districts. 0% commission for first 30 days! Free registration - 2 min only.</p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-black shadow">✓ Free Registration</span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur border border-white/20 rounded-full text-[10px] font-black">✓ 24/7 Seller Support</span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur border border-white/20 rounded-full text-[10px] font-black">✓ Fast Payment in 7 Days</span>
                <span className="px-3 py-1.5 bg-black text-white rounded-full text-[10px] font-black">✓ 10M+ Customers</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={()=> document.getElementById('seller-form')?.scrollIntoView({behavior:'smooth'})} className="bg-black text-white px-8 py-4 rounded-full text-[13px] font-black hover:bg-white hover:text-black transition flex items-center gap-2 shadow-xl">Start Selling Now <ArrowRight size={16}/></button>
                <button className="bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-4 rounded-full text-[12px] font-black flex items-center gap-2 hover:bg-white hover:text-black transition"><Play size={14}/> How It Works - 2 Min</button>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i=> <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-[#f85606] flex items-center justify-center text-[12px] font-black text-black">{String.fromCharCode(64+i)}</div>)}
                </div>
                <p className="text-[11px] font-bold">Trusted by 50k+ sellers • ⭐ 4.9/5 Rating</p>
              </div>
            </div>

            <div id="seller-form" className="bg-white rounded-[24px] p-6 md:p-7 text-black shadow-[0_30px_80px_rgba(0,0,0,0.3)] border border-white/20">
              <h3 className="font-black text-[20px] flex items-center gap-2"><Store size={20} className="text-[#f85606]"/> Register as Seller - Free!</h3>
              <p className="text-[11px] text-gray-500 mt-1">Takes only 2 minutes - Start selling today • 0% Commission 30 Days</p>
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-black mb-1.5 flex items-center gap-1"><Store size={12}/> Shop Name *</p>
                  <input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="e.g. Rahim Fashion Store, Rajshahi" className="w-full border-2 border-gray-100 rounded-full px-4 py-3 text-[13px] outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition" required/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-1.5 flex items-center gap-1"><Phone size={12}/> Phone Number *</p>
                  <input value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9]/g,''))} placeholder="01XXXXXXXXX" className="w-full border-2 border-gray-100 rounded-full px-4 py-3 text-[13px] outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition" required/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-1.5 flex items-center gap-1"><Package size={12}/> What do you sell? *</p>
                  <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full border-2 border-gray-100 rounded-full px-4 py-3 text-[13px] outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition bg-white">
                    <option>Fashion & Clothing</option>
                    <option>Electronics & Gadgets</option>
                    <option>Beauty & Health</option>
                    <option>Home & Living</option>
                    <option>Mobiles & Accessories</option>
                    <option>Groceries & Food</option>
                    <option>Kids & Toys</option>
                    <option>Sports & Fitness</option>
                    <option>Others</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#f85606] to-[#ff8a00] text-white py-4 rounded-full font-black text-[13px] hover:from-black hover:to-black transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? 'Creating Account...' : <>Create Seller Account → <ArrowRight size={16}/></>}
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 bg-[#f8f8fb] p-2.5 rounded-full">
                  <ShieldCheck size={14} className="text-green-600"/> <span>100% Secure • Free Registration • No Hidden Fee</span>
                </div>
                <p className="text-[10px] text-center text-gray-500">By registering, you agree to Baharaz Seller Terms & Privacy</p>
              </form>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-[18px] border-2 border-gray-100 p-5 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#fff7ed] border border-[#ffe1d2] flex items-center justify-center text-[#f85606]"><Users size={22}/></div>
            <p className="font-black text-[24px] mt-3">10M+</p>
            <p className="text-[11px] text-gray-500 font-bold">Active Customers</p>
            <p className="text-[9px] text-green-600 font-black mt-1">+15% this month</p>
          </div>
          <div className="bg-white rounded-[18px] border-2 border-gray-100 p-5 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f0fdf4] border border-[#c8e6c9] flex items-center justify-center text-green-600"><Store size={22}/></div>
            <p className="font-black text-[24px] mt-3">50K+</p>
            <p className="text-[11px] text-gray-500 font-bold">Active Sellers</p>
            <p className="text-[9px] text-green-600 font-black mt-1">500+ joined today</p>
          </div>
          <div className="bg-white rounded-[18px] border-2 border-gray-100 p-5 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center text-blue-600"><Package size={22}/></div>
            <p className="font-black text-[24px] mt-3">12M+</p>
            <p className="text-[11px] text-gray-500 font-bold">Products Listed</p>
            <p className="text-[9px] text-blue-600 font-black mt-1">Unlimited Products</p>
          </div>
          <div className="bg-white rounded-[18px] border-2 border-gray-100 p-5 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#faf5ff] border border-[#e9d5ff] flex items-center justify-center text-purple-600"><DollarSign size={22}/></div>
            <p className="font-black text-[24px] mt-3">৳50k+</p>
            <p className="text-[11px] text-gray-500 font-bold">Avg Monthly Earn</p>
            <p className="text-[9px] text-purple-600 font-black mt-1">Top sellers earn ৳5L+</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-[24px] border-2 border-gray-100 p-7 md:p-10 mt-6 shadow-sm">
          <h2 className="font-black text-[22px] md:text-[26px] text-center">How to Start Selling in 4 Steps</h2>
          <p className="text-[12px] text-gray-500 text-center mt-2">2 minutes registration • 24h approval • Start earning same day</p>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {[
              {step:'01', title:'Register Free', desc:'Fill shop name & phone - 2 min only', icon: <Store size={20}/>, color:'bg-black'},
              {step:'02', title:'Add Products', desc:'Upload product photos & price from seller app', icon: <Package size={20}/>, color:'bg-[#f85606]'},
              {step:'03', title:'Get Orders', desc:'Receive orders & pack products - we notify you', icon: <TrendingUp size={20}/>, color:'bg-blue-600'},
              {step:'04', title:'Earn Money', desc:'We deliver & pay you every 7 days to bKash', icon: <Wallet size={20}/>, color:'bg-green-600'},
            ].map((s,i)=>(
              <div key={i} className="relative p-6 rounded-[18px] bg-[#f8f8fb] border-2 border-gray-100 hover:border-black hover:shadow-lg transition-all group">
                <div className={`w-12 h-12 rounded-full ${s.color} text-white flex items-center justify-center shadow`}>{s.icon}</div>
                <div className="absolute top-4 right-4 text-[32px] font-black text-gray-100 group-hover:text-gray-200">{s.step}</div>
                <h3 className="font-black text-[14px] mt-4">{s.step}. {s.title}</h3>
                <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-[24px] border-2 border-gray-100 p-7 md:p-10 mt-6 shadow-sm">
          <h2 className="font-black text-[22px] md:text-[26px] text-center">Why Sell on Baharaz? - 6 Big Benefits</h2>
          <p className="text-[12px] text-gray-500 text-center mt-2">More customers, less hassle, more profit - Than any other platform</p>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border-2 border-gray-100 hover:border-black hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition"><TrendingUp size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">Reach Millions - 64 Districts</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">64 districts, 490+ upazila - Your product will be seen by 10M+ customers every day. Unlimited reach.</p>
              <p className="text-[10px] font-black text-[#f85606] mt-3">✓ 10M+ Daily Visitors</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#fff7ed] border-2 border-[#ffe1d2] hover:border-[#f85606] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-[#f85606] text-white flex items-center justify-center group-hover:scale-110 transition"><DollarSign size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">0% Commission - First 30 Days</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Start with 0% commission. Lowest commission after that - only 5% to 10% - Lowest in Bangladesh!</p>
              <p className="text-[10px] font-black text-[#f85606] mt-3">✓ Lowest Commission in BD</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f0fdf4] border-2 border-[#c8e6c9] hover:border-green-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center group-hover:scale-110 transition"><Truck size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">We Handle Delivery - Free Pickup</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">We pick from your shop and deliver to customer. You just pack - we do rest. 64 districts delivery.</p>
              <p className="text-[10px] font-black text-green-600 mt-3">✓ Free Pickup from Your Shop</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#eff6ff] border-2 border-[#dbeafe] hover:border-blue-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition"><BarChart3 size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">Seller Dashboard - Super App</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Real-time sales, orders, earnings, analytics - All in one super easy dashboard app. Mobile app available.</p>
              <p className="text-[10px] font-black text-blue-600 mt-3">✓ Real-time Analytics</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#faf5ff] border-2 border-[#e9d5ff] hover:border-purple-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition"><ShieldCheck size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">Fast Payment - Every 7 Days</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Payment every 7 days directly to your bKash, Nagad, Bank - No delay. Automatic payment system.</p>
              <p className="text-[10px] font-black text-purple-600 mt-3">✓ Auto Payment to bKash</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#fff7ed] border-2 border-[#fed7aa] hover:border-orange-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition"><Headphones size={20}/></div>
              <h3 className="font-black text-[14px] mt-4">24/7 Seller Support - Dedicated</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Dedicated seller support team - Call, chat, email anytime you need help. Rajshahi, Dhaka office.</p>
              <p className="text-[10px] font-black text-orange-600 mt-3">✓ Call: 09638-XXXXXX</p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-br from-black to-[#1a1a1a] rounded-[24px] p-7 md:p-10 mt-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f85606]/20 rounded-full blur-[60px]"></div>
          <h2 className="font-black text-[22px] text-center relative z-10">Success Stories - Real Sellers, Real Earnings 💰</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8 relative z-10">
            {[
              {name:'Rahim Fashion, Rajshahi', earn:'৳2.5L/month', story:'Started with 10 products, now 500+ products. Baharaz changed my life!', rating:5},
              {name:'Ayesha Beauty, Dhaka', earn:'৳1.8L/month', story:'Housewife to businesswoman - Baharaz gave me freedom to earn from home.', rating:5},
              {name:'Karim Electronics, Bogura', earn:'৳4L/month', story:'From small shop to big brand - Now I supply all over Bangladesh via Baharaz!', rating:5},
            ].map((s,i)=>(
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-[18px] p-5">
                <div className="flex gap-1 mb-2">{[...Array(s.rating)].map((_,j)=> <Star key={j} size={12} className="fill-yellow-400 text-yellow-400"/>)}</div>
                <p className="text-[12px] leading-[18px] opacity-90">"{s.story}"</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-[11px] font-black">{s.name}</p>
                  <p className="text-[11px] font-black bg-[#f85606] px-2 py-1 rounded-full">{s.earn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-[24px] border-2 border-gray-100 p-7 md:p-10 mt-6 shadow-sm">
          <h2 className="font-black text-[22px] text-center">Frequently Asked Questions - Seller FAQ</h2>
          <div className="mt-6 space-y-3 max-w-[800px] mx-auto">
            {faqs.map((f,i)=>(
              <div key={i} className="border-2 border-gray-100 rounded-[16px] overflow-hidden">
                <button onClick={()=> setFaqOpen(faqOpen===i? null : i)} className="w-full flex justify-between items-center p-4 text-left hover:bg-[#f8f8fb] transition">
                  <span className="font-bold text-[13px]">{f.q}</span>
                  <ChevronDown size={16} className={`transition ${faqOpen===i? 'rotate-180':''}`}/>
                </button>
                {faqOpen===i && <div className="p-4 pt-0 text-[12px] text-gray-600 leading-[20px] bg-[#f8f8fb]">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-black text-white rounded-[24px] p-8 mt-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#f85606]/20 rounded-full blur-[50px]"></div>
          <div className="relative z-10">
            <h3 className="font-black text-[22px] flex items-center gap-2"><Zap size={20} className="text-[#f85606]"/> Ready to Start? Join Today - Free!</h3>
            <p className="text-[12px] opacity-60 mt-2 max-w-[500px]">50,000+ sellers already earning - You can be next! Free registration - 2 min only. 0% commission 30 days. Start today!</p>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">✓ Free Registration</span>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">✓ 24h Approval</span>
              <span className="text-[10px] bg-[#f85606] px-2 py-1 rounded-full">✓ Start Earning Today</span>
            </div>
          </div>
          <div className="flex gap-3 relative z-10">
            <Link href="/help/seller-help" className="px-6 py-3 bg-white/10 rounded-full text-[12px] font-black border border-white/20 hover:bg-white hover:text-black transition">Learn More</Link>
            <button onClick={()=> document.getElementById('seller-form')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-3 bg-[#f85606] rounded-full text-[12px] font-black hover:bg-white hover:text-black transition shadow-lg flex items-center gap-2">Register Now <ArrowRight size={14}/> →</button>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-[24px] border-2 border-gray-100 p-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[12px]"><Phone size={16} className="text-[#f85606]"/><span className="font-bold">09638-XXXXXX</span></div>
            <div className="flex items-center gap-2 text-[12px]"><Mail size={16} className="text-[#f85606]"/><span className="font-bold">seller@baharaz.com</span></div>
            <div className="flex items-center gap-2 text-[12px]"><MapPin size={16} className="text-[#f85606]"/><span className="font-bold">Rajshahi, Dhaka</span></div>
          </div>
          <p className="text-[11px] text-gray-500">© 2026 Baharaz - Bangladesh's Most Loved Shopping Mall</p>
        </div>

      </div>
    </div>
  )
}