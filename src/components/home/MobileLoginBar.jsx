'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function MobileLoginBar(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(()=>{
    // Check user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Auto hide after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      }
    })
    return () => subscription.unsubscribe()
  },[])
  
  const login = async()=>{ 
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      }) 
      if (error) throw error
    } catch (err) {
      console.error(err)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  if(user) return null
  
  return (
    <div className="fixed bottom-[74px] right-[12px] z-[9999] md:hidden pointer-events-auto">
      <div className="h-[36px] w-[260px] rounded-full relative overflow-hidden flex justify-between items-center px-3
      bg-[#111]/70 border border-white/20
      shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      ">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-[18px] h-[18px] rounded-full bg-[#F85606] flex items-center justify-center text-white font-black text-[8px] border border-white/20">B</div>
          <p className="text-[10px] font-bold text-white">Welcome to Baharaz!</p>
        </div>
        
        <button 
          onClick={login} 
          disabled={loading}
          className="relative z-10 h-[24px] px-3.5 rounded-full bg-[#F85606] text-white text-[9px] font-black active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? '...' : 'LOG IN NOW'}
        </button>
      </div>
    </div>
  )
}