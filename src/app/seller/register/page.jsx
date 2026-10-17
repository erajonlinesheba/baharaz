'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Store, Mail, Phone, FileText, MapPin, ShieldCheck, Upload, Star, Check, Lock, Sparkles, Rocket, BadgeCheck, Globe } from 'lucide-react'
import Link from 'next/link'

export default function SellerRegister(){
  const [form,setForm]=useState({name:'',email:'',phone:'',description:''})
  const [extra,setExtra]=useState({category:'Fashion', address:'', city:'Rajshahi', agree:true})
  const [loading,setLoading]=useState(false)
  const [user,setUser]=useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){
        // User login না থাকলে /login এ যাবে - এখন comment রাখলাম যাতে Guest ও দেখতে পারে
      } else {
        setUser(user)
        setForm(f=>({...f, email: user.email || f.email }))
      }
    })()
  },[])

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!extra.agree){ alert('Terms Accept করুন'); return; }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user){ alert('Please login first'); router.push('/login?next=/seller/register'); setLoading(false); return }

    // slug auto generate
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-') + '-' + Math.floor(Math.random()*10000)

    const { error } = await supabase.from('sellers').insert({
      user_id: user.id,
      name: form.name,
      shop_name: form.name,
      shop_slug: slug,
      email: form.email,
      phone: form.phone,
      description: form.description,
      shop_description: form.description,
      category: extra.category,
      address: extra.address,
      full_address: extra.address,
      city: extra.city,
      status: 'pending',
      verification_status: 'pending',
      is_verified: false,
      rating: 4.5
    })

    if(error){
      alert(error.message)
      setLoading(false)
    }
    else {
      alert('✅ Shop Created! Pending for Verification - Admin will approve soon - 24h এর মধ্যে Approve হবে');
      router.push('/seller/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf6f1] relative overflow-hidden flex items-center justify-center py-10 px-4">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/20 to-red-400/15 rounded-full blur-[120px] -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-yellow-400/15 to-orange-400/15 rounded-full blur-[120px] -mr-32 -mb-32"></div>

      <div className="w-full max-w-[1100px] bg-white rounded-[28px] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border flex overflow-hidden relative z-10">

        <div className="hidden lg:flex w-[44%] bg-[#0a0a0a] p-9 flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f57224]/40 via-[#ff006a]/20 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#f57224] to-[#ff8a00] rounded-full blur-[80px] opacity-40"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center rounded-[12px]">B</div>
              <span className="font-black text-white text-[20px] tracking-tighter">Baharaz Seller</span>
              <span className="ml-auto bg-gradient-to-r from-[#f57224] to-[#ff8a00] text-white text-[8px] font-black px-3 py-1 rounded-full flex items-center gap-1"><Sparkles size={10}/> OFFICIAL</span>
            </div>

            <div className="mt-10">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black tracking-[1.5px] text-white/70"><Rocket size={10} className="text-orange-400"/> SELLER CENTER 2.0</div>
              <h1 className="text-[34px] font-black text-white leading-[0.9] tracking-tighter mt-3">Open Your<br/><span className="bg-gradient-to-r from-[#f57224] to-[#ff8a00] bg-clip-text text-transparent">Store</span> -<br/>Unlimited</h1>
              <p className="text-[12px] text-white/50 mt-3 leading-5">64 জেলায় Sell করুন। 10 Lakh+ Customer। Daily Payment। 0% Commission শুরুতে।</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-3">
                <p className="text-[20px] font-black text-white">৳0</p>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Joining Fee</p>
              </div>
              <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-3">
                <p className="text-[20px] font-black text-white">24h</p>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Verification</p>
              </div>
              <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-3">
                <p className="text-[20px] font-black text-white">10L+</p>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Customers</p>
              </div>
              <div className="bg-gradient-to-r from-[#f57224] to-[#ff8a00] rounded-[16px] p-3">
                <p className="text-[20px] font-black text-white">100%</p>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Halal & Safe</p>
              </div>
            </div>

            <div className="mt-7 space-y-2.5">
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-[11px] text-white/80"><div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><Check size={12}/></div> Free Seller Dashboard + Analytics</div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-[11px] text-white/80"><div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><Globe size={12}/></div> Your Shop Link: baharaz.com/store/slug</div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-[11px] text-white/80"><div className="w-6 h-6 bg-[#f57224] rounded-full flex items-center justify-center"><ShieldCheck size={12}/></div> Pending for Verification - Fast Approve</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[56%] p-7 md:p-9 bg-white relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[26px] font-black tracking-tighter leading-none">Create Seller Store</h2>
              <p className="text-[11px] text-gray-400 font-bold mt-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Admin will verify within 24 hours</p>
            </div>
            <Link href="/register" className="text-[11px] font-black bg-black text-white px-4 py-2 rounded-full hover:bg-[#f57224] transition">Customer? →</Link>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-black">1</div>
              <p className="text-[11px] font-black">Business Info</p>
              <div className="flex-1 h-[2px] bg-black"></div>
            </div>
            <div className="flex items-center gap-2 flex-1 opacity-40">
              <div className="w-7 h-7 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-[11px] font-black">2</div>
              <p className="text-[11px] font-black">Verification</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><Store size={12}/> Shop Name - ex: Fashion World BD *</label>
                <input required placeholder="Shop Name - ex: Fashion World BD" className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] font-bold outline-none transition" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                <p className="text-[10px] text-gray-400 mt-1">Shop Link: /store/{form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'your-shop'}</p>
              </div>

              <div>
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><BadgeCheck size={12}/> Category *</label>
                <select value={extra.category} onChange={e=>setExtra({...extra, category:e.target.value})} className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] font-bold outline-none">
                  <option>Fashion</option><option>Electronics</option><option>Beauty</option><option>Home & Living</option><option>Grocery</option><option>Kids</option><option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><MapPin size={12}/> City *</label>
                <select value={extra.city} onChange={e=>setExtra({...extra, city:e.target.value})} className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] font-bold outline-none">
                  <option>Rajshahi</option><option>Dhaka</option><option>Chattogram</option><option>Khulna</option><option>Sylhet</option><option>Barishal</option><option>Rangpur</option><option>Mymensingh</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><Mail size={12}/> Email *</label>
                <input required type="email" placeholder="seller@email.com" className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] outline-none" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>

              <div>
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><Phone size={12}/> Phone *</label>
                <input required placeholder="01XXXXXXXXX" className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] outline-none" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><MapPin size={12}/> Full Address</label>
                <input placeholder="Shop Address, Area, District" className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] outline-none" value={extra.address} onChange={e=>setExtra({...extra, address:e.target.value})}/>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black tracking-[1.2px] uppercase flex items-center gap-1.5"><FileText size={12}/> Shop Description</label>
                <textarea placeholder="আপনার দোকান সম্পর্কে লিখুন - কি কি Product বিক্রি করেন - 100% Trusted লিখুন..." className="w-full mt-1.5 border-2 border-transparent bg-[#f8f8f8] focus:bg-white focus:border-black p-[13px] rounded-[14px] text-[13px] min-h-[90px] outline-none resize-none" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
              </div>
            </div>

            <div className="bg-[#fff7f0] border-2 border-dashed border-orange-200 rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white border rounded-full flex items-center justify-center"><Upload size={16}/></div>
              <div>
                <p className="text-[11px] font-black">Shop Logo / Banner (Optional - New Feature)</p>
                <p className="text-[10px] text-gray-500">পরে /seller/store থেকে Upload করতে পারবেন</p>
              </div>
              <span className="ml-auto text-[9px] font-black bg-black text-white px-2.5 py-1 rounded-full">SOON</span>
            </div>

            <label className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-[14px] border">
              <input type="checkbox" checked={extra.agree} onChange={e=>setExtra({...extra, agree:e.target.checked})} className="mt-0.5 accent-black w-4 h-4" required/>
              <span className="text-[11px] leading-4 text-gray-600">I agree to Baharaz Seller <b className="text-black">Terms</b>, আমি 100% অরিজিনাল Product দেবো, Pending Status এ Admin Approve করবে। Fake হলে Ban হবে।</span>
            </label>

            <button disabled={loading} className="w-full h-[52px] bg-gradient-to-r from-black to-[#222] hover:from-[#f57224] hover:to-[#ff8a00] text-white font-black rounded-[14px] text-[13px] tracking-widest flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all">
              {loading? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating Store...</> : <><Store size={16}/> Create Store - Pending Verification →</>}
            </button>

            <div className="flex justify-center gap-3 text-[10px] font-bold text-gray-400">
              <span className="flex items-center gap-1"><Lock size={10}/> SSL Secured</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-green-500"/> Verified Platform</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Star size={10} className="text-orange-400"/> Trusted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}