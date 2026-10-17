import Link from "next/link"
import { ArrowLeft, ShieldCheck, Award, Clock, Wrench, CheckCircle2 } from "lucide-react"
export default function WarrantyPage(){
  return(
    <div className='min-h-screen bg-[#f8f8fb]'>
      <div className='max-w-[900px] mx-auto px-4 py-6 md:py-10'>
        <Link href='/help' className='inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-gray-200 hover:bg-[#f85606] hover:text-white hover:border-[#f85606] text-gray-800 px-6 py-3 rounded-full text-[13px] font-black shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(248,86,6,0.3)] transition-all'>
          <ArrowLeft size={16}/> Back to Help Center
        </Link>

        <div className='bg-white rounded-[28px] border border-gray-100 p-7 md:p-10 mt-6 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-[16px] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-lg'>
              <ShieldCheck/>
            </div>
            <div>
              <h1 className='text-[24px] md:text-[28px] font-black tracking-tight'>Warranty Policy - Official</h1>
              <p className='text-[13px] text-gray-500 mt-1'>Official warranty protection on every product</p>
            </div>
          </div>

          <div className='mt-8 grid md:grid-cols-3 gap-4'>
            <div className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-[20px] shadow-lg'>
              <Award size={28}/><p className='font-black text-[15px] mt-3'>Official Warranty</p><p className='text-[12px] mt-2 opacity-90 leading-[18px]'>All products come with official brand warranty as mentioned on product page</p>
            </div>
            <div className='bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-[20px] shadow-lg'>
              <Clock size={28}/><p className='font-black text-[15px] mt-3'>7 Days Replacement</p><p className='text-[12px] mt-2 opacity-90 leading-[18px]'>If product is defective or damaged, get instant replacement within 7 days</p>
            </div>
            <div className='bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-[20px] shadow-lg'>
              <Wrench size={28}/><p className='font-black text-[15px] mt-3'>Service Support</p><p className='text-[12px] mt-2 opacity-90 leading-[18px]'>Free service support at authorized service centers across Bangladesh</p>
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='font-black text-[18px]'>How to claim warranty</h2>
            <div className='mt-5 space-y-4'>
              <div className='flex gap-4'><div className='w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-[13px]'>1</div><div className='flex-1 bg-[#f8f8fb] border border-gray-100 rounded-[16px] p-4'><p className='font-bold text-[14px]'>Go to My Orders</p><p className='text-[12px] text-gray-600 mt-1'>Open My Account, My Orders, select the product and tap Warranty Claim</p></div></div>
              <div className='flex gap-4'><div className='w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-[13px]'>2</div><div className='flex-1 bg-[#f8f8fb] border border-gray-100 rounded-[16px] p-4'><p className='font-bold text-[14px]'>Describe the issue</p><p className='text-[12px] text-gray-600 mt-1'>Add photo or video of the issue and submit your claim</p></div></div>
              <div className='flex gap-4'><div className='w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-black text-[13px]'>3</div><div className='flex-1 bg-green-50 border border-green-200 rounded-[16px] p-4'><p className='font-bold text-[14px] text-green-800'>Fast Resolution</p><p className='text-[12px] text-gray-600 mt-1'>Our team reviews in 24 hours and arranges repair, replacement or refund</p></div></div>
            </div>
          </div>

          <div className='mt-8 p-5 bg-[#f8f8fb] rounded-[16px] border border-gray-100 flex gap-3'>
            <CheckCircle2 className='text-green-600 shrink-0'/><p className='text-[12px] leading-[20px]'><b>Note:</b> Warranty does not cover physical damage, water damage or misuse. Please keep invoice and warranty card. Warranty period is mentioned on product page.</p>
          </div>

          <div className='mt-8 p-5 bg-gray-900 text-white rounded-[20px] flex justify-between items-center'>
            <div><p className='font-black text-[14px]'>Need help with warranty</p><p className='text-[11px] mt-1 opacity-70'>Chat with us 24x7 - Average reply 2 minutes</p></div>
            <Link href='/help/contact-us' className='bg-white text-black px-5 py-2.5 rounded-full text-[12px] font-black'>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

