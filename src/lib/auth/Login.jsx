'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      if (error) throw error
      setMsg('✅ Login success!')
      router.push('/') // Redirect to home
      router.refresh()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f5] px-4">
      <form onSubmit={handleLogin} className="bg-white w-full max-w-[400px] p-8 rounded-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between items-center mb-6"><h1 className="text-[22px]">Welcome to Baharaz!</h1><Link href="/signup" className="text-[12px] text-[#1a9cb7]">Register</Link></div>
        <div className="space-y-4">
          <div><label className="text-[12px] text-[#424242]">Email or Phone*</label><input required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="Please enter your Email" /></div>
          <div><label className="text-[12px] text-[#424242]">Password*</label><input required type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="Please enter your password" /></div>
        </div>
        <div className="text-right mt-2"><span className="text-[12px] text-[#1a9cb7] cursor-pointer">Reset Your Password</span></div>
        {msg && <div className="mt-4 text-[12px] p-2 bg-[#f5f5f5]">{msg}</div>}
        <button disabled={loading} className="w-full h-[48px] bg-[#f85606] text-white text-[14px] mt-6 hover:bg-[#d45500] disabled:opacity-60">{loading? 'LOGIN...' : 'LOGIN'}</button>
        <div className="text-[12px] text-[#757575] mt-6 text-center">Or, login with <span className="text-[#1877f2]">Facebook</span> <span className="text-[#ea4335]">Google</span></div>
      </form>
    </div>
  )
}