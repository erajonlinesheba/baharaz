'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Login করা আছে কিনা চেক
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Login state change হলে
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://baharaz.vercel.app'
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">BAHARAZ এ আপনাকে স্বাগতম</h1>
      <p className="mb-8">Bangladesh এর সেরা Shopping Site</p>
      
      {user ? (
        <div className="text-center">
          <p>স্বাগতম, {user.email}</p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg"
        >
          Google দিয়ে Login
        </button>
      )}
    </main>
  )
}