import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export default function Page(){
  return(
    <div className='min-h-screen bg-[#f8f8fb]'>
      <div className='max-w-[900px] mx-auto px-4 py-6 md:py-10'>
        <Link href='/help' className='inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-gray-200 hover:bg-[#f85606] hover:text-white hover:border-[#f85606] text-gray-800 px-6 py-3 rounded-full text-[13px] font-black shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(248,86,6,0.3)] transition-all'>
          <ArrowLeft size={16}/> Back to Help Center
        </Link>
        <div className='bg-white rounded-[24px] border border-gray-100 p-7 md:p-10 mt-6 shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-[16px] bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-[28px] shadow-lg'>🏪</div>
            <div>
              <h1 className='text-[24px] md:text-[28px] font-black tracking-tight'>Start Selling on Baharaz</h1>
              <p className='text-[13px] text-gray-500 mt-1'>Grow your business with millions of customers</p>
            </div>
          </div>
          <div className='mt-8'><div className='space-y-3 text-[13px] leading-[24px]'><p><b>1. Register as a Seller</b> - Click Become a Seller and fill shop details</p><p><b>2. Get Verified</b> - Our team reviews within 24 hours</p><p><b>3. Add Products</b> - Upload products from Seller Dashboard</p><p><b>4. Ship and Earn</b> - Ship on time, earnings go to wallet</p></div></div>
          <div className='mt-8 p-5 bg-[#f8f8fb] rounded-[16px] border border-gray-100 flex justify-between items-center'>
            <div>
              <p className='font-black text-[13px]'>Need more help</p>
              <p className='text-[11px] text-gray-500 mt-1'>Our support team is here 24x7</p>
            </div>
            <Link href='/help/contact-us' className='bg-gray-900 text-white px-5 py-2.5 rounded-full text-[12px] font-black'>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}



