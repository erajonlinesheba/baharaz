'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"

export default function SellerLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkSeller = async () => {
      if (pathname === '/seller') {
        setChecking(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.replace('/seller')
        return
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle()

      const isSeller = profile?.role === 'seller' || !!seller
      
      if (!isSeller) {
        router.replace('/')
        return
      }
      
      setChecking(false)
    }

    checkSeller()
  }, [pathname, router, supabase])

  if (checking && pathname !== '/seller') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-[13px] font-medium">Checking seller access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}