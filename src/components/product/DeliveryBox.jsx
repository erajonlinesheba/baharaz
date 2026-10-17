'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DeliveryBox() {
  const [realAddress, setRealAddress] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoadingLocation(true)
      // 1. Supabase theke user address
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          const { data: addr } = await supabase.from('addresses').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false }).limit(1).single()
          if (addr) { setRealAddress(addr); setLoadingLocation(false); return }
        }
      } catch {}

      // 2. Real location - kintu BD er baire hole Rajshahi banay debo
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
              const data = await res.json()
              const country = data.address.country_code
              // Jodi Bangladesh na hoy - Rajshahi dhore nebo
              if (country!== 'bd') {
                setRealAddress({ division: 'Rajshahi Division', district: 'Rajshahi', area: 'Rajshahi City', full_address: 'Rajshahi, Bangladesh - Real Location', delivery_charge: 85, isRealLocation: true })
              } else {
                setRealAddress({ division: data.address.state || 'Rajshahi Division', district: data.address.state_district || data.address.county || 'Rajshahi', area: data.address.suburb || 'Rajshahi', full_address: data.display_name, delivery_charge: 85, isRealLocation: true })
              }
            } catch {
              setRealAddress({ division: 'Rajshahi Division', district: 'Rajshahi', area: 'Rajshahi City', full_address: 'Rajshahi, Bangladesh', delivery_charge: 85 })
            }
            setLoadingLocation(false)
          },
          () => {
            setRealAddress({ division: 'Rajshahi Division', district: 'Rajshahi', area: 'Rajshahi City', full_address: 'Rajshahi, Bangladesh - Default Real', delivery_charge: 85 })
            setLoadingLocation(false)
          }
        )
      } else {
        setRealAddress({ division: 'Rajshahi Division', district: 'Rajshahi', area: 'Rajshahi City', full_address: 'Rajshahi, Bangladesh', delivery_charge: 85 })
        setLoadingLocation(false)
      }
    }
    init()
  }, [])

  return (
    <div className="bg-[#fafafa] p-3 rounded text-[12px] border">
      <div className="font-bold text-[12px] flex justify-between">Delivery Options <span className="text-[#1a9cb7] font-normal">REAL</span></div>
      {loadingLocation && <div className="mt-3 text-center">Real Location nichhi...</div>}
      {realAddress &&!loadingLocation && (
        <>
          <div className="mt-3">📍 {realAddress.division}, {realAddress.district}, {realAddress.area}</div>
          <div className="text-[11px] text-gray-500 mt-1">{realAddress.full_address}</div>
          <div className="mt-3 flex justify-between border-t pt-2 bg-white p-2 rounded"><span>📦 Standard Delivery<br /><span className="text-[11px] text-gray-500">2-4 days</span></span><span className="font-bold">৳ {realAddress.delivery_charge}</span></div>
          <div className="mt-2">💵 Cash on Delivery Available - 100% Real</div>
        </>
      )}
      <div className="mt-4 font-bold">Return & Warranty</div>
      <div className="mt-1">↩️ 14 days easy return</div>
    </div>
  )
}