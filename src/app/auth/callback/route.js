import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session) {
      const userId = session.user.id
      const email = session.user.email

      // Customer Email Check - এইটা Customer, Seller না
      if (email === 'erajonlinesheba@gmail.com') {
        return NextResponse.redirect(`${origin}/`)
      }

      // Seller Table Check করো
      const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', userId).maybeSingle()
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()

      // যদি next=/seller/dashboard হয় এবং সে Seller হয়, তাহলে Seller Dashboard এ যাবে
      if (next.includes('/seller')) {
        if (seller || profile?.role === 'seller') {
          return NextResponse.redirect(`${origin}/seller/dashboard`)
        } else {
          // Seller না হলে তাকে Seller Register এ পাঠাও
          return NextResponse.redirect(`${origin}/seller/register`)
        }
      }

      // Customer Login হলে Home এ যাবে
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}