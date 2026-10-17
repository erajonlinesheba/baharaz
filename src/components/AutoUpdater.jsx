'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client.js'

export default function AutoUpdater() {
  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('app_build').select('last_update').eq('id', 1).single()
        if (!data) return
        const saved = localStorage.getItem('baharaz_build')
        if (saved && saved!== data.last_update) {
          localStorage.setItem('baharaz_build', data.last_update)
          window.location.reload()
        } else if (!saved) {
          localStorage.setItem('baharaz_build', data.last_update)
        }
      } catch {}
    }
    check()
    const interval = setInterval(check, 120000)
    return () => clearInterval(interval)
  }, [])
  return null
}