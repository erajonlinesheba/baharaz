'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealUser() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Real Supabase Session - Professional
    const getReal = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          // Real profile from DB
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
          if (data) {
            const finalProfile = {
             ...data,
              full_name: data.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
              avatar_url: data.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              email: data.email || session.user.email
            }
            setProfile(finalProfile)
          } else {
            setProfile({
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              email: session.user.email
            })
          }
          // Sync to LocalStorage for old code - Real Backup
          localStorage.setItem('baharaz_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          }))
        } else {
          // No session - check local backup
          const saved = localStorage.getItem('baharaz_user')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              setUser(parsed)
              setProfile(parsed)
            } catch {}
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (e) {
        console.log('useRealUser error', e)
      } finally {
        setLoading(false)
      }
    }

    getReal()

    // 2. Supabase Real-Time Auth Listener - Professional
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        getReal()
        // Broadcast to all tabs
        if (typeof BroadcastChannel!== 'undefined') {
          const bc = new BroadcastChannel('baharaz_auth')
          bc.postMessage({ type: 'SIGNED_IN', user: session.user })
          bc.close()
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        localStorage.removeItem('baharaz_user')
        localStorage.removeItem('baharaz_token')
        // === CART CLEAR ON LOGOUT - Professional ===
        localStorage.setItem('baharaz_cart', '[]')
        localStorage.setItem('cart', '[]')
        localStorage.setItem('eRajCart', '[]')
        window.dispatchEvent(new Event('cartUpdated'))
        window.dispatchEvent(new CustomEvent('cart-cleared'))
        if (typeof BroadcastChannel!== 'undefined') {
          const bc = new BroadcastChannel('baharaz_auth')
          bc.postMessage({ type: 'SIGNED_OUT' })
          bc.close()
        }
      }
    })

    // 3. Other Tab Sync - Professional (Cart Listener Remove - Fix)
    const bc = typeof BroadcastChannel!== 'undefined'? new BroadcastChannel('baharaz_auth') : null
    const onMessage = (e) => {
      if (e.data?.type === 'SIGNED_IN') getReal()
      if (e.data?.type === 'SIGNED_OUT') { setUser(null); setProfile(null) }
    }
    const onStorage = (e) => {
      // FIX: Only user related keys - cart key remove - এটাই তোমার Cart আটকে রাখছিল!
      if (e.key === 'baharaz_user') getReal()
    }
    const onUserUpdate = () => getReal()

    bc?.addEventListener('message', onMessage)
    window.addEventListener('storage', onStorage)
    window.addEventListener('userUpdated', onUserUpdate)

    return () => {
      subscription.unsubscribe()
      bc?.removeEventListener('message', onMessage)
      bc?.close()
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('userUpdated', onUserUpdate)
    }
  }, [])

  return { user, profile, loading }
}