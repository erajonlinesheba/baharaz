'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowUp, Globe, Flag, Truck, Users, TrendingUp, Award, BarChart3, Package, DollarSign, Star, Store, Calculator, Zap, ShieldCheck, Clock, Gift, MessageCircle, Phone, CheckCircle, PlayCircle, Rocket, BadgeCheck, Flame, ShoppingBag, Headphones, FileCheck, Video, Layers, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function SellerPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState('register');
  const [showToast, setShowToast] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [calcPrice, setCalcPrice] = useState(1000);
  const [liveSellers, setLiveSellers] = useState(50234);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          // FIXED: Only profiles table, no users table
          const { data: userData } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();

          let finalData = userData;
          if (!finalData) {
            const { data: sellerData } = await supabase.from('sellers').select('id').eq('user_id', session.user.id).maybeSingle();
            if (sellerData) finalData = { role: 'seller' };
          }

          if(finalData?.role === 'seller') {
            router.replace('/seller/dashboard');
            return;
          }
          if(isMounted) setChecking(false);
          return;
        }
        if(isMounted) setChecking(false);
      } catch (err) {
        if(isMounted) setChecking(false);
      }
    }
    checkUser()
    return () => { isMounted = false }
  }, [router])

  useEffect(() => {
    const timer = setInterval(() => setStoryIndex((prev) => (prev + 1) % 3), 4000);
    const liveTimer = setInterval(() => setLiveSellers((prev) => prev + Math.floor(Math.random() * 3)), 3000);
    return () => { clearInterval(timer); clearInterval(liveTimer); }
  }, []);

  const showMessage = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 4000);
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/seller/dashboard`,
        queryParams: { prompt: 'select_account' }
      }
    })
    if (error) { showMessage(error.message); setLoading(false) }
  }

  const handleSendOTP = async () => {
    if(phone.length < 10) return showMessage('Valid 11 digit phone number din')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: '+880' + phone })
    setLoading(false)
    if (error) showMessage(error.message)
    else {
      showMessage('OTP sent to +880' + phone)
      setActiveTab('otp')
    }
  }

  const handleVerifyOTP = async () => {
    if(otp.length < 6) return showMessage('6 digit OTP din')
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({ phone: '+880' + phone, token: otp, type: 'sms' })
    setLoading(false)
    if (error) showMessage(error.message)
    else {
      if(data.user) {
        // FIXED: Only profiles table
        await supabase.from('profiles').upsert({ id: data.user.id, phone: '+880' + phone, role: 'seller', email: data.user.email }, { onConflict: 'id' })
        await supabase.from('sellers').upsert({ user_id: data.user.id, phone: '+880' + phone, status: 'pending' }, { onConflict: 'user_id' }).catch(()=>{})
      }
      router.replace('/seller/dashboard')
    }
  }

  const handleEmailLogin = async () => {
    if(!email ||!password) return showMessage('Email and Password required')
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      return showMessage(error.message)
    }
    if(data.user) {
      const { data: userData } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
      const { data: sellerData } = await supabase.from('sellers').select('id').eq('user_id', data.user.id).maybeSingle()
      if(userData?.role === 'seller' || sellerData) {
        setLoading(false)
        router.replace('/seller/dashboard')
      } else {
        setLoading(false)
        showMessage('You are not a seller. Please register as seller.')
      }
    }
  }

  const benefits = [
    {icon: <Award className="w-12 h-12 text-[#F85606]"/>, title: '0% Commission', desc: '0% Platform commission fee for first 30 Days. After that only 3% starting.'},
    {icon: <Truck className="w-12 h-12 text-[#F85606]"/>, title: 'Free Shipping', desc: 'Offer Free Shipping via programs like FSM and increase your sales by 40%.'},
    {icon: <Globe className="w-12 h-12 text-[#F85606]"/>, title: 'Nationwide Reach', desc: 'Deliver your product to 64 districts with our 20+ logistics partners.'},
    {icon: <Users className="w-12 h-12 text-[#F85606]"/>, title: 'Dedicated Support', desc: 'Get 90 days incubation specialist support to grow your business faster.'},
    {icon: <TrendingUp className="w-12 h-12 text-[#F85606]"/>, title: 'Marketing Tools', desc: 'Create Product Ads, Vouchers, and Campaigns to increase visibility.'},
    {icon: <BarChart3 className="w-12 h-12 text-[#F85606]"/>, title: 'Seller Analytics', desc: 'Track your sales, traffic and customer behavior with detailed reports.'},
    {icon: <Package className="w-12 h-12 text-[#F85606]"/>, title: 'Easy Listing', desc: 'List 1000 products in minutes with bulk upload and AI description tool.'},
    {icon: <DollarSign className="w-12 h-12 text-[#F85606]"/>, title: 'Seller Financing', desc: 'Get up to 10 Lakh BDT loan to grow your inventory with 0% interest.'},
  ]

  const steps = [
    {num: '01', title: 'Sign up with a phone number', desc: 'Register with your phone number and verify with OTP. Takes less than 2 minutes to complete.'},
    {num: '02', title: 'Complete Seller Profile', desc: 'Add shop information, logo, address and bank details to get verified within 24 hours.'},
    {num: '03', title: 'Start Listing Products', desc: 'Upload products with photos, price, stock and description. Use AI to generate descriptions.'},
    {num: '04', title: 'Get Your First Order', desc: 'Our AI recommendation system will show your products to right customers automatically.'},
    {num: '05', title: 'Grow Your Business', desc: 'Use analytics, ads and campaigns to scale your business 10x in 6 months.'},
  ]

  const faqs = [
    {q: 'How can I sell on Baharaz?', a: 'Simply register with your phone number, complete your seller profile, and start listing products. Our team will help you with onboarding and training.'},
    {q: 'What categories can I sell?', a: 'You can sell Fashion, Electronics, Home & Living, Beauty, Grocery, Sports, Books and 20+ other categories.'},
    {q: 'What commission does Baharaz charge?', a: '0% commission for the first 30 days. After that, commission starts from only 3%.'},
    {q: 'What is the payment policy?', a: 'We do weekly payments every Thursday. Money will be transferred directly to your bank account.'},
    {q: 'How does shipping work?', a: 'We have 20+ logistics partners. You can choose your preferred courier. We also offer Free Shipping program.'},
    {q: 'Is there any listing fee?', a: 'No. Listing products is 100% free. You only pay commission when you make a sale.'},
  ]

  const stories = [
    {name: 'Alvina Akhter', shop: 'Alvina\'s Fashion World', sales: '300%', text: 'Since joining Baharaz, my sales have soared 300%. The platform helped me reach customers across Bangladesh. Support team is amazing.', img: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800'},
    {name: 'Rahim Electronics', shop: 'Rahim Gadget', sales: '1000%', text: 'Baharaz University and dedicated support helped me scale from 10 orders to 1000 orders per month. Best platform for sellers.', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'},
    {name: 'Fatema Home Decor', shop: 'Decor BD', sales: '250%', text: 'I started with 5 products. Now I have 500 products. Weekly payment and marketing tools helped me grow so fast.', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'},
  ]

  const commission = calcPrice * 0.03;
  const earnings = calcPrice - commission;

  if(checking) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-2xl font-bold text-[#F85606] animate-pulse flex items-center gap-2"><Rocket className="w-8 h-8 animate-bounce"/> Loading Seller Center...</div></div>

  return (
    <div className="min-h-screen bg-white font-sans">
      {showToast && <div className={`fixed top-5 right-5 ${showToast.includes('sent')? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce font-bold`}>{showToast}</div>}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F85606] to-[#FF8A00] rounded-lg flex items-center justify-center shadow-md"><span className="text-white font-black text-xl">B</span></div>
            <span className="font-bold text-xl">Baharaz Seller Center</span>
            <span className="ml-3 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live {liveSellers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+880" className="hidden md:flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4"/> Seller Helpline</a>
            <div className="bg-[#F85606] text-white text-sm font-bold px-4 py-2 rounded-full hidden md:block animate-pulse shadow-lg">0% Fee for 30 Days!</div>
          </div>
        </div>
      </header>

      <div className="bg-[#111] text-white py-2 overflow-hidden text-sm font-medium border-b-2 border-[#F85606]">
        <div className="animate-marquee whitespace-nowrap flex gap-10">
          <span>🔥 {liveSellers.toLocaleString()} Sellers Joined Today</span>
          <span>📦 12,500 Orders Delivered Today</span>
          <span>💰 ৳2.3 Crore Paid to Sellers This Week</span>
          <span>🚚 Free Delivery Campaign Live</span>
          <span>⭐ 4.8/5 Seller Rating</span>
          <span>🎉 Baharaz 0% Commission Offer!</span>
        </div>
      </div>

      <section className="bg-gradient-to-r from-[#F85606] via-[#FF6A00] to-[#FF8A00] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-4 font-bold border border-white/20"><Gift className="w-4 h-4"/> New Seller Offer Active <Sparkles className="w-4 h-4 text-yellow-200"/></div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">GROW YOUR BUSINESS WITH US!</h1>
            <p className="text-lg mb-8 opacity-90">Join 50,000+ sellers and reach millions of customers nationwide. Start selling in 5 minutes.</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/20"><p className="text-3xl font-bold">5M+</p><p className="text-sm opacity-80">Active Buyers</p></div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/20"><p className="text-3xl font-bold">22M+</p><p className="text-sm opacity-80">Monthly Visits</p></div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/20"><p className="text-3xl font-bold">0%</p><p className="text-sm opacity-80">First Month Fee</p></div>
            </div>
            <div className="flex gap-4 mt-8 text-sm font-semibold">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Secure Payment</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 24H Verification</span>
              <span className="flex items-center gap-1"><Zap className="w-4 h-4"/> Instant Listing</span>
            </div>
            <div className="mt-8 bg-black/20 backdrop-blur rounded-xl p-4 border border-white/10 flex gap-6">
              <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-yellow-300"/><span className="text-sm font-bold">{liveSellers.toLocaleString()} Live</span></div>
              <div className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-green-200"/><span className="text-sm font-bold">12k Orders</span></div>
              <div className="flex items-center gap-2"><Headphones className="w-5 h-5 text-blue-200"/><span className="text-sm font-bold">24/7 Help</span></div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-2xl p-8 border-t-4 border-[#F85606]">
            <div className="flex border-b mb-6">
              <button onClick={() => setActiveTab('register')} className={`flex-1 pb-3 font-bold transition-all ${activeTab === 'register'? 'border-b-4 border-[#F85606] text-[#F85606]' : 'text-gray-500'}`}>Register</button>
              <button onClick={() => setActiveTab('login')} className={`flex-1 pb-3 font-bold transition-all ${activeTab === 'login'? 'border-b-4 border-[#F85606] text-[#F85606]' : 'text-gray-500'}`}>Login</button>
            </div>

            {activeTab === 'register' && (
              <div className="space-y-4">
                <button onClick={() => router.push('/seller/register')} className="w-full bg-gradient-to-r from-[#F85606] to-[#FF8A00] text-white font-black py-4 rounded-xl hover:shadow-[0_12px_30px_rgba(248,86,6,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 text-[16px]">
                  <Store className="w-5 h-5"/> CREATE SELLER →
                </button>

                <div className="flex items-center my-2"><div className="flex-1 h-px bg-gray-200"></div><span className="px-4 text-gray-400 text-xs font-bold">OR</span><div className="flex-1 h-px bg-gray-200"></div></div>

                <button onClick={handleGoogleLogin} disabled={loading} className="w-full border-2 border-gray-200 bg-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#F85606]/30 hover:shadow-md transition-all disabled:opacity-50">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google"/>
                  <span className="text-gray-700">{loading? 'Loading...' : 'Continue with Google'}</span>
                </button>

                <div className="bg-gradient-to-br from-[#FFF1EB] to-[#FFEBE0] border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F85606] rounded-full flex items-center justify-center flex-shrink-0 shadow-md"><Gift className="w-4 h-4 text-white"/></div>
                  <div><p className="text-[12px] font-black text-[#F85606]">New Seller Benefits</p><p className="text-[11px] text-gray-600 font-medium">0% Fee • Free Training • Fast Verify</p></div>
                </div>
              </div>
            )}

            {activeTab === 'login' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@example.com" className="w-full border-2 rounded-xl px-4 py-3 mt-2 focus:border-[#F85606] outline-none transition-all"/>
                </div>
                <div>
                  <label className="text-sm font-bold">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="w-full border-2 rounded-xl px-4 py-3 mt-2 focus:border-[#F85606] outline-none transition-all"/>
                </div>
                <button onClick={handleEmailLogin} disabled={loading} className="w-full bg-[#F85606] text-white font-bold py-3.5 rounded-xl hover:bg-[#E04D05] hover:shadow-lg transition-all disabled:opacity-50 shadow-md">
                  {loading? 'Logging in...' : 'LOGIN TO SELLER CENTER'}
                </button>

                <div className="flex items-center"><div className="flex-1 h-px bg-gray-200"></div><span className="px-4 text-gray-400 text-xs font-bold">OR</span><div className="flex-1 h-px bg-gray-200"></div></div>

                <button onClick={handleGoogleLogin} disabled={loading} className="w-full border-2 border-gray-200 bg-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#F85606]/30 hover:shadow-md transition-all disabled:opacity-50">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google"/>
                  <span className="text-gray-700">Login with Google</span>
                </button>

                <p className="text-xs text-center text-gray-500">Customer? <a href="/login" className="text-[#F85606] font-bold">Go to Customer Login</a></p>
              </div>
            )}

            {activeTab === 'otp' && (
              <div>
                <p className="mb-4 text-sm">We sent a 6-digit code to <b>+880{phone}</b></p>
                <input type="text" placeholder="Enter 6 digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 mb-4 focus:border-[#F85606] outline-none text-center text-2xl tracking-widest font-bold" maxLength={6}/>
                <button onClick={handleVerifyOTP} disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                  {loading? 'Verifying...' : 'Verify & Start Selling'}
                </button>
                <button onClick={() => setActiveTab('register')} className="w-full mt-3 text-sm text-gray-600 hover:text-[#F85606] font-medium">Change Number</button>
              </div>
            )}

            <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-orange-50/50 rounded-xl border-2 border-dashed border-[#F85606]/20">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 font-bold"><Calculator className="w-5 h-5 text-[#F85606]"/> Earnings Calculator</div><span className="bg-[#F85606] text-white text-[9px] px-2 py-1 rounded-full font-black">LIVE</span></div>
              <label className="text-xs font-bold">Product Price: ৳{calcPrice}</label>
              <input type="range" min="100" max="10000" step="100" value={calcPrice} onChange={(e)=>setCalcPrice(Number(e.target.value))} className="w-full mt-2 accent-[#F85606]"/>
              <div className="flex justify-between text-xs mt-2 font-bold">
                <span className="text-gray-500">Commission (3%): ৳{commission.toFixed(0)}</span>
                <span className="font-bold text-green-600">You Earn: ৳{earnings.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-[11px] text-center">
              <div className="flex flex-col items-center gap-1 p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm"><FileCheck className="w-5 h-5 text-green-600"/><span className="font-bold">KYC Verified</span></div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100 shadow-sm"><Video className="w-5 h-5 text-[#F85606]"/><span className="font-bold">Video Training</span></div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm"><Layers className="w-5 h-5 text-purple-600"/><span className="font-bold">Bulk Upload</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-4">New Seller Benefits</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need to start and grow your business</p>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((b,i)=>(
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2 hover:border-[#F85606]/30 group">
                <div className="mb-4 bg-[#FFF1EB] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#FFE4D6] transition-colors">{b.icon}</div>
                <h3 className="font-bold text-xl mb-3">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-4">Steps to Start Selling</h2>
          <p className="text-center text-gray-600 mb-12">Get started in just 5 simple steps</p>
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((s,i)=>(
              <div key={i} className="flex gap-6 items-start group">
                <div className="w-16 h-16 bg-[#F85606] text-white font-bold text-xl rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200">{s.num}</div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#F85606] flex-1 group-hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="bg-black text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:bg-gray-800 transition-all"><PlayCircle className="w-5 h-5"/> Watch Tutorial</button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-4">Seller Success Stories</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border">
            <div className="md:flex">
              <img src={stories[storyIndex].img} className="md:w-1/3 h-64 object-cover" alt="story"/>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_,i)=><Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic">"{stories[storyIndex].text}"</p>
                <p className="font-bold text-xl">{stories[storyIndex].name}</p>
                <p className="text-gray-600">{stories[storyIndex].shop}</p>
                <p className="text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> Sales Increased: {stories[storyIndex].sales}</p>
                <div className="flex gap-2 mt-6">
                  {stories.map((_,i)=><button key={i} onClick={()=>setStoryIndex(i)} className={`h-3 rounded-full transition-all ${storyIndex===i? 'bg-[#F85606] w-8' : 'bg-gray-300 w-3'}`}></button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
          {faqs.map((f,i)=>(
            <div key={i} className="mb-4 bg-white rounded-xl shadow-md overflow-hidden">
              <button onClick={()=>setOpenFaq(openFaq===i? null : i)} className="w-full flex justify-between items-center p-6 text-left font-bold text-lg hover:bg-orange-50 transition-colors">
                {f.q}
                <ChevronDown className={`w-5 h-5 transition-transform ${openFaq===i? 'rotate-180' : ''}`}/>
              </button>
              {openFaq===i && <p className="px-6 pb-6 text-gray-600 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#F85606] rounded-lg flex items-center justify-center"><span className="font-black text-white">B</span></div>
            <span className="font-bold text-xl text-white">Baharaz</span>
          </div>
          <p className="mb-4">Seller Center | 50k+ Sellers Trust Us | 24/7 Support</p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4"/> Live Chat</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> 09638-123456</span>
          </div>
          <p className="mt-6 text-xs">© 2026 Baharaz. All rights reserved. Built with ❤️ for Bangladeshi Sellers</p>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6">
        <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="bg-[#F85606] text-white font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 hover:bg-[#E04D05] transition-transform"><ArrowUp className="w-4 h-4"/> TOP</button>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%) } 100% { transform: translateX(-100%) } }
      .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  )
}