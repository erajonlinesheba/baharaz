import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Public Routes - সবাই দেখতে পারবে
  if (path.startsWith('/store/') || path === '/' || path.startsWith('/product/')) {
    return supabaseResponse
  }

  // Seller Protected Routes
  if (path.startsWith('/seller/dashboard') || path.startsWith('/seller/store') || path.startsWith('/seller/products') || path.startsWith('/seller/orders')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/seller'
      return NextResponse.redirect(url)
    }

    // Role Check - Customer হলে Seller Dashboard এ ঢুকতে পারবে না
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle()

    const isSeller = profile?.role === 'seller' || !!seller

    // Customer কে Seller Dashboard এ ঢুকতে দিবে না, Home এ পাঠাবে
    if (!isSeller) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Customer Protected Routes (Optional)
  if (path.startsWith('/account') || path.startsWith('/checkout')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}