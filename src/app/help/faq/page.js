"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react"
export default function FAQ(){
  const [open,setOpen]=useState(0)
  const faqs=[
    {q:'How do I place an order on Baharaz?',a:'Simply browse products, tap Add to Cart, go to checkout, select your delivery address, choose payment method and confirm your order. You will receive a confirmation right away.'},
    {q:'How can I track my order?',a:'Go to My Account, then My Orders, then View Details. You will see a timeline showing Pending, Confirmed, Shipped and Delivered status with updated time.'},
    {q:'What is the Secure Shopping PIN?',a:'Your Secure PIN is a 4-6 digit code you create to protect your purchases and payments. You will need it during checkout and for wallet payments to keep your account safe.'},
    {q:'I forgot my Secure PIN. What should I do?',a:'Go to My Account, then Security, then Reset PIN. Verify your email and set a new PIN. It only takes a minute and your account will be secured again.'},
    {q:'What is your return policy?',a:'We offer 7 days easy returns. If the product is unused with tags, go to My Orders, then Request Return, select reason and submit. Our team approves within 24 hours and we arrange free pickup.'},
    {q:'How much is the delivery charge?',a:'Inside Dhaka delivery is 60 Taka (1-2 days), Outside Dhaka delivery is 120 Taka (2-4 days). Members get free delivery on eligible orders.'},
    {q:'How can I become a seller on Baharaz?',a:'Click Become a Seller in the header, fill in your shop information and submit. Our team reviews within 24 hours and once approved you can start adding products from your Seller Dashboard.'},
    {q:'Which payment methods do you accept?',a:'We accept Cash on Delivery, bKash, Nagad, Rocket and all major debit and credit cards. All payments are protected by your Secure PIN.'},
  ]
  return(
    <div className='min-h-screen bg-[#f8f8fb]'>
      <div className='max-w-[900px] mx-auto px-4 py-6 md:py-10'>
        <Link href='/help' className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/50 hover:bg-[#f85606] hover:text-white hover:border-[#f85606] text-gray-800 px-6 py-3 rounded-full text-[13px] font-black shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(248,86,6,0.3)] transition-all'><ArrowLeft size={16}/> Back to Help Center</Link>
        <div className='bg-white rounded-[24px] border border-gray-100 p-7 md:p-10 mt-6 shadow-sm'>
          <div className='flex items-center gap-3'><div className='w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white'><HelpCircle/></div><div><h1 className='text-[26px] font-black tracking-tight'>Frequently Asked Questions</h1><p className='text-[13px] text-gray-500 mt-1'>Find quick answers to common questions</p></div></div>
          <div className='mt-8 space-y-3'>{faqs.map((f,i)=><div key={i} className={`rounded-[16px] border-2 transition-all ${open===i?'border-[#f85606]/20 bg-[#fff8f5] shadow-[0_10px_30px_rgba(248,86,6,0.08)]':'border-gray-100 bg-white hover:border-gray-200'}`}><button onClick={()=>setOpen(open===i?-1:i)} className='w-full text-left p-5 flex justify-between items-center gap-4'><span className='font-bold text-[14px] leading-[20px]'>{i+1}. {f.q}</span><span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${open===i?'bg-[#f85606] text-white rotate-180 shadow-lg':'bg-gray-100 text-gray-500'}`}><ChevronDown size={16}/></span></button>{open===i && <div className='px-5 pb-6'><div className='bg-white rounded-[12px] border border-orange-100 p-4 text-[13px] leading-[22px] text-gray-700'>{f.a}</div></div>}</div>)}</div>
        </div>
      </div>
    </div>
  )
}


