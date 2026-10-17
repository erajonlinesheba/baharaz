'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Eye, EyeOff, ShieldCheck, Sparkles, Gift, Truck, Lock, Heart, Star } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPass: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        window.location.href = '/account';
      }
    };
    checkSession();
  }, []);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password!== form.confirmPass) {
      setError('পাসওয়ার্ড মিলছে না! আবার চেক করুন');
      return;
    }
    if (form.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!');
      return;
    }

    setLoading(true);
    try {
      // 1. Real Supabase Signup
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
            display_name: form.fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (error) throw error;

      // 2. Save to profiles table - REAL
      if (data.user) {
        const { error: profileError } = await supabase
       .from('profiles')
       .upsert({
            id: data.user.id,
            full_name: form.fullName,
            email: form.email.trim().toLowerCase(),
            phone: form.phone,
            created_at: new Date().toISOString(),
          });

        if (profileError) console.log('Profile save error:', profileError.message);
      }

      setSuccess(true);
      setTimeout(() => window.location.href = '/login', 2500);

    } catch (err) {
      setError(err.message.includes('already registered')? 'এই ইমেইল দিয়ে আগেই একাউন্ট আছে! Login করুন' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: `${window.location.origin}/account` }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center bg-[#fdf6f1] py-8 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#f57224]/15 to-[#ff006a]/10 rounded-full blur-[100px] -ml-20 -mt-20"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#ff8a00]/10 to-[#f57224]/10 rounded-full blur-[100px] -mr-20 -mb-20"></div>

      <div className="w-full max-w-[1100px] bg-white/90 backdrop-blur-2xl rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">

        {/* Left - Baharaz Style + NEW FUTURE */}
        <div className="hidden md:flex md:w-[42%] bg-[#0a0a0a] p-8 flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f57224]/30 via-[#ff006a]/15 to-transparent"></div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-[#f57224]/20 to-[#ff8a00]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center rounded-[12px] text-[18px]">B</div>
              <span className="font-black text-white text-[20px] tracking-tighter">Baharaz</span>
              <span className="ml-auto bg-gradient-to-r from-[#f57224] to-[#ff8a00] text-white text-[8px] font-black px-3 py-1.5 rounded-full flex items-center gap-1"><Heart size={10} className="fill-white"/> LOVED</span>
            </div>

            <div className="mt-10">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white/70"><Sparkles size={10} className="text-orange-400"/> NEW CUSTOMER OFFER</div>
              <h2 className="text-[28px] font-black text-white leading-[0.95] tracking-tighter mt-3">Create your<br/><span className="bg-gradient-to-r from-[#f57224] to-[#ff8a00] bg-clip-text text-transparent">Baharaz Account</span></h2>
              <p className="text-[12.5px] text-white/50 mt-3 leading-5">Join Baharaz and get access to exclusive deals, 10 Lakh+ Products! 100% Halal.</p>
            </div>

            <div className="mt-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[18px] p-4">
              <img src="https://img.lazcdn.com/g/tps/tfs/TB1H2eGQXXXXXXaXXXXXXXXXXXX-360-360.png" alt="signup" className="w-full rounded-[12px] bg-white p-2 shadow-sm hidden" onError={(e)=>e.target.style.display='none'} />
              <div className="w-full h-[160px] bg-gradient-to-br from-white to-[#f5f5f5] rounded-[14px] flex flex-col items-center justify-center shadow-lg border border-white">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl">🛒</div>
                <p className="text-[11px] font-black mt-3 tracking-widest text-black">BAHARAZ CLUB</p>
                <p className="text-[10px] text-[#999] flex items-center gap-1"><ShieldCheck size={10} className="text-green-500"/> 100% Safe & Secure</p>
                <div className="mt-3 flex gap-1">
                  <span className="text-[10px]">⭐⭐⭐⭐⭐</span>
                  <span className="text-[9px] font-bold">4.9/5 (25k+)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 text-[11px]">
              <p className="flex gap-2 items-center bg-white/5 px-3 py-2 rounded-full border border-white/5 text-white/80"><span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span> Free Delivery on First Order</p>
              <p className="flex gap-2 items-center bg-white/5 px-3 py-2 rounded-full border border-white/5 text-white/80"><span className="w-5 h-5 bg-[#f57224] rounded-full flex items-center justify-center text-white text-[10px]">%</span> Extra 10% Discount - NEW</p>
              <p className="flex gap-2 items-center bg-white/5 px-3 py-2 rounded-full border border-white/5 text-white/80"><span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]"><Lock size={10}/></span> 100% Buyer Protection</p>
            </div>

            <div className="mt-6 bg-gradient-to-r from-[#f57224]/20 to-[#ff8a00]/10 border border-[#f57224]/20 rounded-[14px] p-3 flex items-center gap-2">
              <Gift size={16} className="text-[#f57224]"/>
              <p className="text-[11px] text-white font-bold">Sign Up করলেই ৳100 Voucher FREE!</p>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-[58%] p-7 md:p-9 bg-gradient-to-br from-white to-[#fdfdfd] relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f57224]/5 to-transparent rounded-full blur-xl"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h1 className="text-[26px] font-black text-black tracking-tighter">Sign Up</h1>
              <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mt-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 100% Safe - Trusted by 10 Lakh+ families</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-[11px] text-[#757575]">Already member?</p>
              <Link href="/login" className="text-[12px] font-black bg-black text-white px-5 py-2 rounded-full hover:bg-gradient-to-r hover:from-[#f57224] hover:to-[#ff8a00] transition">Login here →</Link>
            </div>
          </div>

          <div className="flex gap-2 mb-6 relative z-10">
            <Link href="/register" className="flex-1 py-2.5 rounded-full bg-black text-white text-[11px] font-black text-center tracking-widest">CUSTOMER</Link>
            <Link href="/seller/register" className="flex-1 py-2.5 rounded-full bg-[#fff4ee] border-2 border-[#f57224]/20 text-[#f57224] text-[11px] font-black text-center tracking-widest hover:bg-[#f57224] hover:text-white transition">🏪 SELLER REGISTER</Link>
          </div>

          {error && <div className="bg-[#fff1f0] border-2 border-[#ffa39e] text-[#cf1322] text-[12px] p-3 rounded-[14px] mb-4 font-bold flex items-center gap-2"><span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">!</span>{error}</div>}
          {success && <div className="bg-[#f6ffed] border-2 border-[#b7eb8f] text-[#389e0d] text-[12px] p-3 rounded-[14px] mb-4 font-bold flex items-center gap-2"><span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>Account Created! Email Verification পাঠানো হয়েছে। Login এ যাচ্ছি...</div>}

          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-black text-black tracking-[1.5px] uppercase block mb-1.5">Full Name*</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Enter your full name" className="w-full px-4 py-[12px] bg-[#f9f9f9] border-2 border-transparent focus:border-black focus:bg-white rounded-[14px] text-[13px] placeholder:text-[#aaa] outline-none transition font-medium" />
            </div>

            <div>
              <label className="text-[10px] font-black text-black tracking-[1.5px] uppercase block mb-1.5">Email Address*</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Please enter your email" className="w-full px-4 py-[12px] bg-[#f9f9f9] border-2 border-transparent focus:border-black focus:bg-white rounded-[14px] text-[13px] placeholder:text-[#aaa] outline-none transition font-medium" />
            </div>

            <div>
              <label className="text-[10px] font-black text-black tracking-[1.5px] uppercase block mb-1.5">Phone Number*</label>
              <div className="flex">
                <span className="px-4 py-[12px] border-2 border-r-0 border-transparent bg-[#f0f0f0] text-[13px] text-black h-[46px] flex items-center rounded-l-[14px] font-black">+880</span>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="1XXXXXXXXX" className="flex-1 px-4 py-[12px] bg-[#f9f9f9] border-2 border-transparent focus:border-black focus:bg-white rounded-r-[14px] text-[13px] outline-none transition font-medium" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-black tracking-[1.5px] uppercase block mb-1.5">Password*</label>
              <div className="relative">
                <input name="password" type={showPass? "text":"password"} value={form.password} onChange={handleChange} required placeholder="Minimum 6 characters with number & letter" className="w-full px-4 py-[12px] bg-[#f9f9f9] border-2 border-transparent focus:border-black focus:bg-white rounded-[14px] text-[13px] pr-12 outline-none transition font-medium" />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-1.5 top-[6px] w-9 h-9 bg-white border rounded-full flex items-center justify-center text-gray-400 hover:text-black shadow-sm">{showPass? <EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
              <div className="mt-1.5 flex gap-1">
                <div className={`h-1 flex-1 rounded-full ${form.password.length >= 2? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${form.password.length >= 4? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${form.password.length >= 6? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-black tracking-[1.5px] uppercase block mb-1.5">Confirm Password*</label>
              <input name="confirmPass" type="password" value={form.confirmPass} onChange={handleChange} required placeholder="Confirm your password" className="w-full px-4 py-[12px] bg-[#f9f9f9] border-2 border-transparent focus:border-black focus:bg-white rounded-[14px] text-[13px] outline-none transition font-medium" />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" required className="mt-0.5 accent-black w-4 h-4" />
                <span className="text-[11px] text-[#757575] leading-[16px] group-hover:text-black">I agree to <Link href="/terms" className="text-black font-black underline decoration-2 underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-black font-black underline decoration-2 underline-offset-4">Privacy Policy</Link>. I also agree to receive promotional emails.</span>
              </label>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-black to-[#1a1a1a] hover:from-[#f57224] hover:to-[#ff8a00] text-white py-[14px] rounded-[14px] text-[12px] font-black tracking-[1px] disabled:opacity-60 h-[48px] mt-2 shadow-[0_10px_24px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> CREATING ACCOUNT...</> : 'SIGN UP →'}
            </button>
          </form>

          <div className="mt-7 relative z-10">
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#f9f9f9] px-4 py-1 rounded-full border text-[10px] font-black tracking-widest text-[#999]">OR, SIGN UP WITH</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button type="button" onClick={()=>handleSocial('facebook')} className="border-2 border-gray-100 py-[12px] rounded-[14px] text-[12px] font-black hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition flex items-center justify-center gap-2 bg-white shadow-sm"><span className="w-5 h-5 bg-[#1877f2] text-white rounded-full flex items-center justify-center text-[11px] font-black">f</span> Facebook</button>
              <button type="button" onClick={()=>handleSocial('google')} className="border-2 border-gray-100 py-[12px] rounded-[14px] text-[12px] font-black hover:bg-black hover:text-white transition flex items-center justify-center gap-2 bg-white shadow-sm"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="g"/> Google</button>
            </div>
            <div className="mt-5 flex justify-center gap-4 text-[10px] text-gray-400 font-medium">
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border"><Truck size={10}/> Free Delivery</span>
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border"><ShieldCheck size={10} className="text-green-500"/> SSL Safe</span>
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border"><Star size={10} className="text-orange-400"/> Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}