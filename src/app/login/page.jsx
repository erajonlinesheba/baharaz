'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Truck, RotateCcw, Heart, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || searchParams.get('redirect') || null;
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if(!supabase?.auth) return;
        const { data } = await supabase.auth.getSession();
        if (!data?.session) return;

        if (nextUrl) {
          router.push(nextUrl);
          return;
        }

        const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', data.session.user.id).maybeSingle();
        if (seller) {
          router.push('/seller/dashboard');
        } else {
          if (window.location.pathname === '/login') {
            return;
          }
          router.push('/');
        }
      } catch {}
    };
    checkSession();
  }, [nextUrl, router, supabase]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (data?.session) {
        if (nextUrl) {
          router.push(nextUrl);
          router.refresh();
          return;
        }
        const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', data.session.user.id).maybeSingle();
        if (seller) {
          router.push('/seller/dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'? 'Email or Password Wrong!' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) { setError('Enter Email'); return; }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/reset-password` });
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setError('');
    setLoading(true);
    try {
      const redirectTo = nextUrl? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}` : `${window.location.origin}/auth/callback?next=/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: { access_type: 'offline', prompt: 'consent' },
          scopes: provider === 'google'? 'email profile openid' : 'email public_profile'
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#fdf6f1] py-8 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#f57224]/15 to-[#ff006a]/10 rounded-full blur-[120px] -ml-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-[#ff8a00]/15 to-[#f57224]/10 rounded-full blur-[120px] -mr-20 -mb-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#f57224]/5 to-transparent rounded-full blur-[80px]"></div>

      <div className="w-full max-w-[1120px] bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-[0_32px_100px_rgba(0,0,0,0.12)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">

        <div className="hidden md:flex md:w-[50%] bg-[#0a0a0a] p-9 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f57224]/40 via-[#ff006a]/20 to-transparent"></div>
          <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-br from-[#f57224]/30 to-[#ff8a00]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-[#ff006a]/20 to-[#f57224]/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-[#f5f5f5] text-black font-black text-[22px] flex items-center justify-center rounded-[16px] shadow-[0_10px_30px_rgba(255,255,255,0.2)]">B</div>
              <span className="font-black text-[24px] text-white tracking-tighter">Baharaz</span>
              <span className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-[#f57224] to-[#ff8a00] text-white text-[9px] font-black px-3.5 py-2 rounded-full shadow-lg"><Heart size={11} className="fill-white"/> LOVED BY FAMILIES</span>
            </div>

            <div className="mt-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white/80 mb-4">
                <Sparkles size={12} className="text-[#f57224]"/> TRUSTED SHOPPING
              </div>
              <h2 className="text-[38px] font-black text-white leading-[0.95] tracking-tighter">Shopping with<br/><span className="bg-gradient-to-r from-[#f57224] to-[#ff8a00] bg-clip-text text-transparent">Trust & Love</span></h2>
              <p className="text-[13.5px] text-white/60 mt-5 leading-[22px] font-medium">10 Lakh+ Bangladeshi families trust us every day. Safe payment, fast delivery, easy return - We care for your happiness.</p>
            </div>

            <div className="mt-8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[22px] p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex">
                  <img src="https://i.pravatar.cc/100?img=32" className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] shadow-lg" alt="user"/>
                  <img src="https://i.pravatar.cc/100?img=26" className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] shadow-lg -ml-3" alt="user"/>
                  <img src="https://i.pravatar.cc/100?img=15" className="w-10 h-10 rounded-full border-[3px] border-[#0a0a0a] shadow-lg -ml-3" alt="user"/>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f57224] to-[#ff8a00] border-[3px] border-[#0a0a0a] shadow-lg -ml-3 flex items-center justify-center text-white font-black text-[11px]">10L+</div>
                </div>
                <div className="ml-2">
                  <p className="text-white font-black text-[13px] tracking-tight">10 Lakh+ Happy Families</p>
                  <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase">Trusted • Verified • Loved</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 bg-black/30 rounded-full px-3 py-2 w-fit">
                <span className="text-yellow-400 text-[13px]">★★★★★</span>
                <span className="text-white text-[11px] font-bold">4.9/5</span>
                <span className="text-white/50 text-[10px]">(25,000+ Reviews)</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3 mt-8">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-[18px] p-4 text-center shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mx-auto mb-2"><Truck size={18} className="text-white"/></div>
                <p className="text-[11px] font-black text-black">Free Delivery</p>
                <p className="text-[9px] text-gray-500 font-bold">All Bangladesh</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[18px] p-4 text-center text-white">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2"><RotateCcw size={18}/></div>
                <p className="text-[11px] font-black">Easy Return</p>
                <p className="text-[9px] opacity-60 font-bold">7 Days Return</p>
              </div>
              <div className="bg-gradient-to-br from-[#f57224] to-[#ff8a00] rounded-[18px] p-4 text-center text-white shadow-[0_8px_20px_rgba(245,114,36,0.3)]">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2"><ShieldCheck size={18}/></div>
                <p className="text-[11px] font-black">100% Safe</p>
                <p className="text-[9px] opacity-80 font-bold">Secure Pay</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"><Lock size={16} className="text-white"/></div>
              <div><p className="text-white text-[12px] font-black tracking-tight">Your data is 100% safe with us</p><p className="text-white/50 text-[10px] font-medium">SSL Secured • We never share your info • Protected</p></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[50%] p-8 md:p-11 bg-gradient-to-br from-white to-[#fdfdfd] relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#f57224]/5 to-transparent rounded-full blur-2xl"></div>

          <div className="flex justify-between items-center mb-9 relative z-10">
            <div>
              <h1 className="text-[30px] font-black text-black tracking-tighter leading-none">{resetMode? 'Reset Password' : 'Welcome Back'}</h1>
              <p className="text-[12px] text-gray-500 font-medium mt-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>{resetMode? 'We will send you a reset link to your email' : 'Login to your Baharaz account to continue'}</p>
            </div>
            <Link href="/register" className="group text-[12px] font-black bg-black text-white px-6 py-3 rounded-full hover:bg-gradient-to-r hover:from-[#f57224] hover:to-[#ff8a00] transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center gap-1">Create <span className="group-hover:translate-x-1 transition">→</span></Link>
          </div>

          {error && <div className="bg-gradient-to-r from-[#fff1f1] to-[#ffe4e4] text-[#e11d48] text-[13px] p-4 rounded-[16px] mb-6 border-2 border-red-100 font-bold flex items-center gap-2"><span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[12px]">!</span>{error}</div>}
          {resetSent && <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] text-green-700 text-[13px] p-4 rounded-[16px] mb-6 border-2 border-green-100 font-bold flex items-center gap-2"><span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">✓</span>Reset link sent! Please check your email.</div>}

          <form onSubmit={resetMode? handleReset : handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="text-[11px] font-black text-black uppercase tracking-[1.5px] flex items-center gap-1.5">Email Address <span className="text-[#f57224]">*</span></label>
              <div className="relative mt-3 group">
                <input type="text" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-6 py-[16px] bg-[#f9f9f9] border-2 border-transparent group-hover:border-gray-200 focus:border-black focus:bg-white rounded-[16px] text-[14px] font-medium outline-none transition-all placeholder:text-gray-400" />
              </div>
            </div>

            {!resetMode && (
              <div>
                <label className="text-[11px] font-black text-black uppercase tracking-[1.5px] flex items-center gap-1.5">Password <span className="text-[#f57224]">*</span></label>
                <div className="relative mt-3 group">
                  <input type={showPass? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-6 py-[16px] bg-[#f9f9f9] border-2 border-transparent group-hover:border-gray-200 focus:border-black focus:bg-white rounded-[16px] text-[14px] font-medium pr-14 outline-none transition-all placeholder:text-gray-400" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-[8px] w-10 h-10 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black shadow-sm">{showPass? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
            )}

            {!resetMode && (
              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2.5 text-[12px] font-medium text-gray-600 cursor-pointer"><input type="checkbox" defaultChecked className="accent-black w-[18px] h-[18px] rounded-md" /> <span>Keep me logged in</span></label>
                <button type="button" onClick={() => setResetMode(true)} className="text-[12px] font-black text-black underline underline-offset-[6px] decoration-2 hover:text-[#f57224]">Forgot Password?</button>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-[#1a1a1a] hover:from-[#f57224] hover:to-[#ff8a00] text-white py-[17px] rounded-[16px] text-[13.5px] font-black tracking-[1px] active:scale-[0.98] transition-all shadow-[0_14px_32px_rgba(0,0,0,0.18)] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Please wait...</span> : resetMode? 'Send Reset Link →' : 'Login to Baharaz →'}
            </button>

            {resetMode && (
              <button type="button" onClick={() => { setResetMode(false); setResetSent(false); setError(''); }} className="w-full bg-[#f5f5f5] hover:bg-black hover:text-white py-[14px] rounded-[16px] text-[11px] font-black tracking-widest transition-all border-2 border-gray-100 hover:border-black">← BACK TO LOGIN</button>
            )}
          </form>

          {!resetMode && (
            <>
              <div className="flex items-center gap-4 my-8 relative z-10">
                <div className="h-[2px] bg-gradient-to-r from-transparent to-gray-100 flex-1"></div>
                <p className="text-[10px] font-black tracking-[2.5px] text-gray-400 bg-[#f9f9f9] px-4 py-1.5 rounded-full border">OR CONTINUE WITH</p>
                <div className="h-[2px] bg-gradient-to-l from-transparent to-gray-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 relative z-10">
                <button onClick={() => handleSocial('google')} className="group py-4 rounded-[16px] border-2 border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2.5 text-[13px] font-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition" alt="g"/> Google</button>
                <button onClick={() => handleSocial('facebook')} className="group py-4 rounded-[16px] border-2 border-gray-100 hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-all flex items-center justify-center gap-2.5 text-[13px] font-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]"><span className="w-6 h-6 bg-[#1877f2] group-hover:bg-white text-white group-hover:text-[#1877f2] rounded-full flex items-center justify-center text-[12px] font-black">f</span> Facebook</button>
              </div>

              <div className="mt-7 flex items-center justify-center gap-5 text-[11px] text-gray-400 font-medium relative z-10">
                <span className="flex items-center gap-1.5 bg-[#f9f9f9] px-3 py-1.5 rounded-full border"><ShieldCheck size={13} className="text-green-500"/> SSL Secured</span>
                <span className="flex items-center gap-1.5 bg-[#f9f9f9] px-3 py-1.5 rounded-full border"><Lock size={13} className="text-black"/> 100% Safe</span>
                <span className="flex items-center gap-1.5 bg-[#f9f9f9] px-3 py-1.5 rounded-full border"><Heart size={13} className="text-red-500 fill-red-500"/> Trusted</span>
              </div>

              <p className="text-[10px] text-center text-gray-400 mt-6 leading-[15px] relative z-10">By logging in, you agree to our Terms of Service and Privacy Policy.<br/>Your information is safe and never shared. <span className="font-bold text-black">Trusted by 10 Lakh+ families.</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}