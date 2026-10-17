'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function SignUp() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      // 1. Supabase Auth signup
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            phone: form.phone,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${form.full_name}`
          }
        }
      })
      if (error) throw error

      // 2. Profile will be auto-created by trigger you already added (handle_new_user)
      // But we also update phone + name to be safe
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: form.full_name,
          phone: form.phone,
          role: 'customer'
        })
        setMsg('✅ Success! Check your email to verify - Baharaz Global')
      }
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f5] px-4">
      <form onSubmit={handleSignUp} className="bg-white w-full max-w-[400px] p-8 rounded-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <h1 className="text-[22px] mb-6">Create your Baharaz Account</h1>
        <div className="space-y-4">
          <div><label className="text-[12px] text-[#424242]">Full Name*</label><input required value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="Md Natore" /></div>
          <div><label className="text-[12px] text-[#424242]">Phone*</label><input required value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="017xxxxxxxx" /></div>
          <div><label className="text-[12px] text-[#424242]">Email*</label><input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="you@baharaz.com" /></div>
          <div><label className="text-[12px] text-[#424242]">Password*</label><input required type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full h-10 border border-[#ddd] px-3 text-[14px] outline-none focus:border-[#f85606] mt-1" placeholder="Min 6 characters" /></div>
        </div>
        {msg && <div className="mt-4 text-[12px] p-2 bg-[#f5f5f5]">{msg}</div>}
        <button disabled={loading} className="w-full h-[48px] bg-[#f85606] text-white text-[14px] mt-6 hover:bg-[#d45500] disabled:opacity-60">{loading? 'Creating...' : 'SIGN UP'}</button>
        <div className="text-[12px] mt-4 text-center">Already have account? <Link href="/login" className="text-[#1a9cb7]">Login</Link></div>
      </form>
    </div>
  )
}