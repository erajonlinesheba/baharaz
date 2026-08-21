'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    // Listen for login/logout
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
  }, [])

  const login = async () => { 
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: 'https://baharaz.vercel.app'
      }
    }) 
  }
  
  const logout = async () => { 
    await supabase.auth.signOut() 
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between p-4 bg-gray-900 items-center sticky top-0">
        <h1 className="text-3xl font-black text-purple-400">BAHARAZ</h1>
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="text-sm hidden md:block">{user.email}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold">Logout</button>
          </div>
        ) : (
          <button onClick={login} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-bold">Google দিয়ে Login</button>
        )}
      </div>

      {/* Flash Sale Banner */}
      <div className="bg-red-600 text-center p-2 font-bold text-sm">FLASH SALE ENDS IN: 23h 57m 13s</div>
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071" 
          className="w-full h-96 object-cover"
          alt="Flash Sale"
        />
        <div className="absolute top-1/4 left-10">
          <h2 className="text-6xl font-black">FLASH SALE</h2>
          <p className="text-xl mt-2">Everything Must Go! 70% OFF | 12 Month EMI</p>
          <button className="bg-white text-black px-8 py-3 rounded-full mt-4 font-bold text-lg">Shop Now</button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="p-10 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to BAHARAZ</h2>
        <p className="text-gray-400">
          {user ? `Welcome back, ${user.email}` : "Login করে Order করুন"}
        </p>
      </div>
    </div>
  )
}