import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

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

  // ✅ Session Refresh - Fast + No Flicker
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Seller Protected
  if (
    path.startsWith('/seller/dashboard') ||
    path.startsWith('/seller/products') ||
    path.startsWith('/seller/orders') ||
    path.startsWith('/seller/store')
  ) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/seller'
      return NextResponse.redirect(url)
    }
  }

  // Buyer Protected
  if (path.startsWith('/checkout') || path.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

// ✅ FAST - শুধু Protected Route এ Middleware চলবে, Home Page এ না - তাই 0s Load
export const config = {
  matcher: [
    '/seller/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/wishlist/:path*',
  ],
}