'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client.js'

let globalBuildCache = null
let lastFetch = 0

export default function AutoUpdater() {
  const supabaseRef = useRef(null)
  const checkedRef = useRef(false)

  if(!supabaseRef.current){
    supabaseRef.current = createClient()
  }

  useEffect(() => {
    // FIX: Dev Mode এ AutoUpdater চলবে না - Dev Speed 10x বাড়বে!
    if(process.env.NODE_ENV !== 'production') return

    if(checkedRef.current) return
    checkedRef.current = true

    const check = async () => {
      try {
        const now = Date.now()
        if(globalBuildCache && now - lastFetch < 5*60*1000) return

        const { data } = await supabaseRef.current.from('app_build').select('last_update').eq('id', 1).single()
        if (!data) return

        globalBuildCache = data.last_update
        lastFetch = now

        const saved = localStorage.getItem('baharaz_build')
        if (saved && saved !== data.last_update) {
          localStorage.setItem('baharaz_build', data.last_update)
          window.location.reload()
        } else if (!saved) {
          localStorage.setItem('baharaz_build', data.last_update)
        }
      } catch {}
    }

    check()
    const interval = setInterval(check, 300000)
    
    return () => {
      clearInterval(interval)
      setTimeout(()=>{ checkedRef.current = false }, 5000)
    }
  }, [])
  
  return null
}