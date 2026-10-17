'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RoleSwitcher() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Supabase Client
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          setLoading(false)
          return
        }
        // FIXED: users -> profiles, single() -> maybeSingle()
        const { data } = await supabase
         .from('profiles')
         .select('id, role, roles, active_role')
         .eq('id', authUser.id)
         .maybeSingle()

        // Fallback: যদি profiles এ role field এ seller থাকে
        if (data) {
          // profiles এ যদি roles column না থাকে, role দিয়ে check করো
          const hasSellerAccess = data.roles?.includes('seller') || data.role === 'seller' || data.role === 'admin'

          if (hasSellerAccess) {
            setUser(data)
          } else {
            // sellers table ও চেক করো
            const { data: sellerData } = await supabase.from('sellers').select('id').eq('user_id', authUser.id).maybeSingle()
            if (sellerData) {
              setUser({...data, roles: ['seller'], active_role: data.active_role || 'customer' })
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) return null

  // FIXED: Check logic for both role and roles
  const isSeller = user?.roles?.includes('seller') || user?.role === 'seller'
  if (!isSeller) return null

  const switchRole = async () => {
    const toRole = user.active_role === 'customer'? 'seller' : 'customer'
    await fetch('/api/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toRole })
    })
    window.location.href = toRole === 'seller'? '/seller/dashboard' : '/'
  }

  return (
    <button onClick={switchRole} className="fixed bottom-[80px] right-[16px] z-[999] border-2 border-black px-4 py-2 rounded-full text-[12px] font-black bg-[#F85606] text-white shadow-lg lg:bottom-[20px] hover:scale-105 transition-transform">
      {user.active_role === 'customer'? 'Seller Dashboard' : 'Customer View'}
    </button>
  )
}