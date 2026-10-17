'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SellerSetup(){
  const [shopName,setShopName]=useState('')
  const [district,setDistrict]=useState('Rajshahi')
  const supabase = createClient()
  const router = useRouter()
  const [loading,setLoading]=useState(false)

  const handleCreateShop = async()=>{
    if(!shopName) return alert('Shop Name দাও ভাই!')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return alert('Login করো আগে!')

    // 100% ORIGINAL NAME - Seller Center থেকে - এটাই Customer দেখবে
    const { data, error } = await supabase.from('sellers').insert([{
      id: user.id, // user id = seller id
      user_id: user.id,
      name: shopName, // <-- ORIGINAL STORE NAME
      shop_slug: shopName.toLowerCase().replace(/\s+/g,'-'),
      district: district,
      status: 'pending', // তুমি Approve করবা
      is_verified: false,
      rating: 0
    }]).select().single()

    if(error){
      // যদি আগে থেকে থাকে তাহলে Update
      await supabase.from('sellers').update({ name: shopName, district }).eq('id', user.id)
    }

    alert(`Shop Created: ${shopName} - এখন Admin Approve করলে Customer Product Page এ Original নাম দেখাবে!`)
    router.push('/seller/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#ff6a00] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[440px] p-8 rounded-[24px] shadow-2xl">
        <h1 className="text-[24px] font-black">আপনার দোকানের নাম দিন</h1>
        <p className="text-[12px] text-gray-500 mt-1">এই নামটাই Customer Product Page এ Original দেখাবে</p>

        <input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="যেমন: Fashion World Rajshahi" className="w-full mt-6 h-[52px] border-2 rounded-xl px-4 font-bold outline-none focus:border-black" />

        <select value={district} onChange={e=>setDistrict(e.target.value)} className="w-full mt-3 h-[52px] border-2 rounded-xl px-4 font-bold">
          <option>Rajshahi</option><option>Dhaka</option><option>Chittagong</option><option>Khulna</option><option>Sylhet</option><option>Rangpur</option>
        </select>

        <button onClick={handleCreateShop} disabled={loading} className="w-full mt-6 h-[52px] bg-black text-white font-black rounded-xl">
          {loading?'Creating...':'Create My Original Store →'}
        </button>
      </div>
    </div>
  )
}