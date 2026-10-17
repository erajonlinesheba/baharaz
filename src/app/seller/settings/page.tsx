'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

function getSupabase(){
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true }
  })
}

export default function SellerSettingsFix(){
  const supabase = getSupabase()
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewLogo, setPreviewLogo] = useState('')
  const [previewBanner, setPreviewBanner] = useState('')

  useEffect(()=>{
    const load = async () => {
      // FIX: getSession - localStorage theke ney, server e fetch kore na!
      const { data: { session } } = await supabase.auth.getSession()
      let user = session?.user

      // Jodi session na pay, localStorage theke force ber koro
      if(!user){
        try{
          const keys = Object.keys(localStorage)
          const authKey = keys.find(k=>k.includes('supabase') && k.includes('auth'))
          if(authKey){
            const raw = JSON.parse(localStorage.getItem(authKey) || '{}')
            user = raw?.user || raw?.currentSession?.user
          }
        }catch{}
      }

      if(!user){
        // Still not found - try getUser as last chance (may fail if blocked)
        const { data } = await supabase.auth.getUser().catch(()=>({data:{user:null}} as any))
        user = data?.user as any
      }

      if(!user){
        setLoading(false)
        return // will show login msg
      }

      // Real profile load
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setStore(data)
      setPreviewLogo(data?.avatar_url || '')
      setPreviewBanner(data?.store_banner || '')
      setLoading(false)
    }
    load()
  },[])

  const toBase64 = (file: File) => new Promise<string>((res, rej)=>{
    const r = new FileReader()
    r.readAsDataURL(file)
    r.onload = () => res(r.result as string)
    r.onerror = e => rej(e)
  })

  const handleSave = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || store?.id
    if(!userId){ alert('Login expire! abar /login e jao'); setSaving(false); return }

    const { error } = await supabase.from('profiles').update({
      shop_name: store.shop_name,
      bio: store.bio,
      store_slug: store.store_slug.toLowerCase().replace(/\s+/g,'-'),
      avatar_url: store.avatar_url,
      store_banner: store.store_banner,
      phone: store.phone
    }).eq('id', userId)

    if(error){ alert('Error: '+error.message); setSaving(false); return }
    alert('✅ DONE! Bucket chara save hoyeche! Ekhon store e jao!')
    window.location.href = `/store/${store.store_slug}`
    setSaving(false)
  }

  if(loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black">Loading... Block bypass hocche...</div>

  if(!store) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-black text-white p-8 rounded-[20px] max-w-[400px] w-full text-center">
        <p className="font-black text-[18px]">Session expire! Block er jonno!</p>
        <p className="text-[12px] text-white/60 mt-2">Tumi homepage e login acho, kintu auth block tai settings e dhukche na</p>
        <button onClick={()=>{ localStorage.clear(); window.location.href='/login' }} className="mt-5 w-full bg-white text-black py-3 rounded-full font-black">🔑 Abar Login Koro</button>
        <p className="text-[10px] text-white/40 mt-3">Phone data ON kore login koro, 100% hobe</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f6f8] p-4">
      <div className="max-w-[720px] mx-auto">
        <h1 className="font-black text-[20px]">⚙️ REAL SETTINGS - BLOCK BYPASS FIX</h1>
        <p className="text-[11px] text-black/60">Phone data diye login kore thakle ebar kaj korbe, server call chara!</p>

        <div className="bg-white rounded-[20px] p-6 mt-5 shadow border space-y-4">
          <input value={store.shop_name||''} onChange={e=>setStore({...store, shop_name:e.target.value})} placeholder="Shop Name" className="w-full bg-[#f6f6f8] px-4 py-3 rounded-full border text-[13px]" />
          <input value={store.store_slug||''} onChange={e=>setStore({...store, store_slug:e.target.value})} placeholder="store slug" className="w-full bg-[#f6f6f8] px-4 py-3 rounded-full border text-[13px]" />
          <textarea value={store.bio||''} onChange={e=>setStore({...store, bio:e.target.value})} placeholder="Bio" className="w-full bg-[#f6f6f8] px-4 py-3 rounded-[16px] border text-[13px] h-[80px]" />
          <input value={store.phone||''} onChange={e=>setStore({...store, phone:e.target.value})} placeholder="Phone" className="w-full bg-[#f6f6f8] px-4 py-3 rounded-full border text-[13px]" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-black text-[10px]">LOGO</p>
              <div className="h-[120px] bg-[#f6f6f8] rounded-[12px] mt-2 overflow-hidden relative border flex items-center justify-center">
                {previewLogo? <Image src={previewLogo} alt="logo" fill className="object-cover" /> : <span className="text-[10px]">No Logo</span>}
              </div>
              <input type="file" accept="image/*" className="text-[10px] mt-2" onChange={async e=>{ const f=e.target.files?.[0]; if(!f)return; const b=await toBase64(f); setPreviewLogo(b); setStore({...store, avatar_url:b}) }} />
            </div>
            <div>
              <p className="font-black text-[10px]">BANNER</p>
              <div className="h-[120px] bg-[#f6f6f8] rounded-[12px] mt-2 overflow-hidden relative border flex items-center justify-center">
                {previewBanner? <Image src={previewBanner} alt="banner" fill className="object-cover" /> : <span className="text-[10px]">No Banner</span>}
              </div>
              <input type="file" accept="image/*" className="text-[10px] mt-2" onChange={async e=>{ const f=e.target.files?.[0]; if(!f)return; const b=await toBase64(f); setPreviewBanner(b); setStore({...store, store_banner:b}) }} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-black text-white py-4 rounded-full font-black text-[13px]">{saving?'Saving...':'💾 SAVE REAL - NO BLOCK'}</button>
        </div>
      </div>
    </div>
  )
}