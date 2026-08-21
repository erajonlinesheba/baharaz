'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const login = async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }) }
  const logout = async () => { await supabase.auth.signOut() }

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh', padding:'50px', textAlign:'center'}}>
      <h1 style={{fontSize:'50px', fontWeight:'bold', color:'#a855f7'}}>BAHARAZ</h1>
      
      {user ? (
        <div style={{marginTop:'30px'}}>
          <h2>Welcome: {user.email}</h2>
          <button onClick={logout} style={{padding:'15px 30px', background:'red', color:'white', border:'none', borderRadius:'8px', fontSize:'18px', marginTop:'20px'}}>Logout</button>
        </div>
      ) : (
        <button onClick={login} style={{padding:'15px 30px', background:'green', color:'white', border:'none', borderRadius:'8px', fontSize:'18px', marginTop:'30px'}}>Google দিয়ে Login</button>
      )}
    </div>
  )
}