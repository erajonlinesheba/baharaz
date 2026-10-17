import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server.js'

export async function POST(req) {
  try {
    const { role } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    // Role switch logic
    return NextResponse.json({ success: true, role })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}