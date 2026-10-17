"use client"
import Link from "next/link"
import { useState } from "react"
import { Store, TrendingUp, Package, DollarSign, Truck, ShieldCheck, Users, BarChart3, Sparkles, ArrowRight, Check, Play, Headphones } from "lucide-react"

export default function SellOnBaharazPage(){
  const [phone,setPhone]=useState('')
  return(
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="max-w-[1200px] mx-auto px-4 pt-[90px] pb-20">

        <div className="bg-gradient-to-br from-[#f85606] via-[#ff6a00] to-[#ff8a00] rounded-[28px] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/20 rounded-full blur-[60px] -ml-20 -mb-20"></div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white text-[#f85606] px-4 py-2 rounded-full text-[11px] font-black shadow-xl"><Sparkles size={14}/> BECOME A BAHARAZ SELLER</div>
              <h1 className="text-[32px] md:text-[50px] font-black leading-[0.9] mt-6">Sell On Baharaz<br/>Earn ৳50k+<br/>Every Month! 🏪</h1>
              <p className="text-[14px] opacity-90 mt-4 leading-[22px] max-w-[500px]">Join 50,000+ sellers, reach 10M+ customers in 64 districts. 0% commission for first 30 days!</p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-black">✓ Free Registration</span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur border border-white/20 rounded-full text-[10px] font-black">✓ 24/7 Seller Support</span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur border border-white/20 rounded-full text-[10px] font-black">✓ Fast Payment</span>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="bg-black text-white px-8 py-4 rounded-full text-[13px] font-black hover:bg-white hover:text-black transition flex items-center gap-2">Start Selling Now <ArrowRight size={16}/></button>
                <button className="bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-4 rounded-full text-[12px] font-black flex items-center gap-2"><Play size={14}/> How It Works</button>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-7 text-black shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
              <h3 className="font-black text-[18px]">Register as Seller - Free!</h3>
              <p className="text-[11px] text-gray-500 mt-1">Takes only 2 minutes - Start selling today</p>
              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-[11px] font-black mb-1.5">Shop Name</p>
                  <input placeholder="e.g. Rahim Fashion Store" className="w-full border rounded-full px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-black"/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-1.5">Phone Number</p>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full border rounded-full px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-black"/>
                </div>
                <div>
                  <p className="text-[11px] font-black mb-1.5">What do you sell?</p>
                  <select className="w-full border rounded-full px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-black bg-white">
                    <option>Fashion & Clothing</option>
                    <option>Electronics</option>
                    <option>Beauty & Health</option>
                    <option>Home & Living</option>
                    <option>Groceries</option>
                    <option>Others</option>
                  </select>
                </div>
                <button className="w-full bg-[#f85606] text-white py-4 rounded-full font-black text-[13px] hover:bg-black transition">Create Seller Account →</button>
                <p className="text-[10px] text-center text-gray-500">By registering, you agree to Baharaz Seller Terms</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-[18px] border p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#fff7ed] flex items-center justify-center text-[#f85606]"><Users size={22}/></div>
            <p className="font-black text-[20px] mt-3">10M+</p>
            <p className="text-[11px] text-gray-500">Active Customers</p>
          </div>
          <div className="bg-white rounded-[18px] border p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f0fdf4] flex items-center justify-center text-green-600"><Store size={22}/></div>
            <p className="font-black text-[20px] mt-3">50K+</p>
            <p className="text-[11px] text-gray-500">Active Sellers</p>
          </div>
          <div className="bg-white rounded-[18px] border p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#eff6ff] flex items-center justify-center text-blue-600"><Package size={22}/></div>
            <p className="font-black text-[20px] mt-3">12M+</p>
            <p className="text-[11px] text-gray-500">Products Listed</p>
          </div>
          <div className="bg-white rounded-[18px] border p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#faf5ff] flex items-center justify-center text-purple-600"><DollarSign size={22}/></div>
            <p className="font-black text-[20px] mt-3">৳50k+</p>
            <p className="text-[11px] text-gray-500">Avg Monthly Earn</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border p-7 md:p-10 mt-6 shadow-sm">
          <h2 className="font-black text-[22px] text-center">Why Sell on Baharaz? - 6 Big Benefits</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"><TrendingUp size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">Reach Millions</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">64 districts, 490+ upazila - Your product will be seen by 10M+ customers every day.</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-[#f85606] text-white flex items-center justify-center"><DollarSign size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">0% Commission - First 30 Days</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Start with 0% commission. Lowest commission after that - only 5% to 10%.</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center"><Truck size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">We Handle Delivery</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">We pick from your shop and deliver to customer. You just pack - we do rest.</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><BarChart3 size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">Seller Dashboard</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Real-time sales, orders, earnings - All in one super easy dashboard app.</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center"><ShieldCheck size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">Fast Payment - 7 Days</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Payment every 7 days directly to your bKash, Nagad, Bank - No delay.</p>
            </div>
            <div className="p-6 rounded-[18px] bg-[#f8f8fb] border">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center"><Headphones size={18}/></div>
              <h3 className="font-black text-[13px] mt-4">24/7 Seller Support</h3>
              <p className="text-[11px] text-gray-600 mt-2 leading-[18px]">Dedicated seller support team - Call, chat, email anytime you need help.</p>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-[24px] p-8 mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-[20px]">Ready to Start? Join Today!</h3>
            <p className="text-[12px] opacity-60 mt-2">50,000+ sellers already earning - You can be next! Free registration - 2 min only.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/help/seller-help" className="px-6 py-3 bg-white/10 rounded-full text-[12px] font-black border border-white/20 hover:bg-white hover:text-black transition">Learn More</Link>
            <button className="px-8 py-3 bg-[#f85606] rounded-full text-[12px] font-black hover:bg-white hover:text-black transition">Register Now →</button>
          </div>
        </div>

      </div>
    </div>
  )
}