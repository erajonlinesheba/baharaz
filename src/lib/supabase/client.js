'use client'
import { createBrowserClient } from '@supabase/ssr'

let browserClient = null

export function createClient() {
  if (browserClient) return browserClient
  
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return browserClient
}

// পুরানো import { supabase } এর জন্য - কিন্তু একই Client Reuse করবে
export const supabase = createClient()