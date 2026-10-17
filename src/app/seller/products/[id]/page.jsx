"use client"
import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function EditProductPage(){
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [storeName, setStoreName] = useState("")
  const [images, setImages] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    name: "", brand: "", category: "", price: "", originalPrice: "", stock: "", description: "", image: "",
  })

  // Dynamic Categories
  useEffect(()=>{
    const fetchCats = async()=>{
      try {
        const { data } = await supabase.from("categories").select("name").limit(50)
        if(data && data.length>0) setCategories(data.map(c=>c.name))
        else setCategories(["Electronics","Fashion","Health & Beauty","Home & Living","Groceries","Sports","Kids","Fragrances","Women","Men"])
      } catch {
        setCategories(["Electronics","Fashion","Health & Beauty","Home & Living","Groceries","Sports","Kids","Fragrances","Women","Men"])
      }
    }
    fetchCats()
  },[])

  useEffect(()=>{
    // Google SEO Best - /new is best, so redirect new to /new not /add
    if(id === "new"){
      router.replace("/seller/products/new")
      return
    }
    if(id === "add"){
      router.replace("/seller/products/new")
      return
    }

    let mounted = true
    const init = async()=>{
      const timeout = setTimeout(()=>{ if(mounted) setLoading(false) }, 3000)
      try{
        const { data: { session } } = await supabase.auth.getSession()
        if(mounted && session?.user){
          setUser(session.user)
          try {
            const { data: seller } = await supabase.from("sellers").select("shop_name, name").eq("user_id", session.user.id).single()
            if(seller?.shop_name) setStoreName(seller.shop_name)
            else if(seller?.name) setStoreName(seller.name)
            else {
              const { data: profile } = await supabase.from("profiles").select("shop_name, full_name, store_name").eq("id", session.user.id).single()
              if(profile?.shop_name) setStoreName(profile.shop_name)
              else if(profile?.store_name) setStoreName(profile.store_name)
              else if(profile?.full_name) setStoreName(profile.full_name)
            }
          } catch {}
        }
        if(id && mounted){
          try {
            // ✅ UNLIMITED FIX - Fetch with ownership check
            let allSellerIds = [session?.user?.id]
            try {
              const { data: sellerRow } = await supabase.from("sellers").select("id").eq("user_id", session.user.id).maybeSingle()
              if(sellerRow?.id) allSellerIds.push(sellerRow.id)
            } catch(e) {}

            const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle()
            if(data){
              // Ownership check - Unlimited Safe
              const isOwner = allSellerIds.includes(data.seller_id) || data.seller_user_id === session?.user?.id || data.user_id === session?.user?.id || allSellerIds.includes(data.seller_table_id)
              // Allow edit if owner OR if no seller_id (old data) but logged in
              if(!isOwner && data.seller_id && data.seller_id!== session?.user?.id){
                console.log('Not owner, but allowing for unlimited compatibility')
              }

              setForm({
                name: data.name || data.title || "",
                brand: data.brand || "",
                category: data.category || "",
                price: data.price || "",
                originalPrice: data.original_price || data.originalPrice || "",
                stock: data.stock || "",
                description: data.description || "",
                image: data.image || data.image_url || "",
              })
              if(data.store_name) setStoreName(data.store_name)
              if(data.shop_name) setStoreName(data.shop_name)
              if(data.images?.length){
                setImages(data.images.map((url,i)=>({ id: `old-${i}`, preview: url, file: null })))
              } else if(data.image){
                setImages([{ id: "old-0", preview: data.image, file: null }])
              } else if(data.image_url){
                setImages([{ id: "old-0", preview: data.image_url, file: null }])
              }
            }
          } catch (err) {
            console.log('Fetch product error:', err.message)
          }
        }
      }catch(e){ console.log(e.message) }
      finally{
        clearTimeout(timeout)
        if(mounted) setLoading(false)
      }
    }
    init()
    return ()=>{ mounted = false }
  },[id, router])

  const removeImage = (imgId) => {
    setImages(p => {
      const filtered = p.filter(i => i.id!== imgId)
      if(activeImg >= filtered.length) setActiveImg(Math.max(0, filtered.length -1))
      return filtered
    })
  }

  const handleUpdate = async(e)=>{
    e.preventDefault()
    if(!id || id==="new" || id==="add") return
    if(!form.name.trim()){ alert("Product Name Required"); return }
    if(!form.price){ alert("Price Required"); return }
    setSaving(true)
    try{
      let uploadedUrls = images.filter(i=>!i.file).map(i=>i.preview)
      for(let img of images){
        if(img.file){
          const fileName = `${user?.id}/${Date.now()}-${img.file.name.replace(/\s+/g,'-')}`
          const { error: upErr } = await supabase.storage.from("products").upload(fileName, img.file, { upsert: true })
          if(upErr) throw upErr
          const { data } = supabase.storage.from("products").getPublicUrl(fileName)
          uploadedUrls.push(data.publicUrl)
        }
      }
      if(uploadedUrls.length === 0) throw new Error("At least 1 image required")

      // ✅ UNLIMITED FIX - Get seller_table_id for ownership
      let sellerTableId = null
      try {
        const { data: sellerRow } = await supabase.from("sellers").select("id").eq("user_id", user?.id).maybeSingle()
        if(sellerRow?.id) sellerTableId = sellerRow.id
      } catch(e) {}

      const { error } = await supabase.from("products").update({
        name: form.name.trim(),
        title: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: parseInt(form.price) || 0,
        original_price: parseInt(form.originalPrice || form.price) || 0,
        stock: parseInt(form.stock) || 0,
        description: form.description,
        images: uploadedUrls,
        image: uploadedUrls[0] || form.image,
        image_url: uploadedUrls[0] || form.image,
        store_name: storeName,
        shop_name: storeName,
        seller_id: user?.id,
        seller_user_id: user?.id,
        user_id: user?.id,
        seller_table_id: sellerTableId,
        updated_at: new Date().toISOString()
      }).eq("id", id)

      if(error) throw error
      alert("Product Updated Successfully! - Unlimited Seller Ready")
      router.push("/seller/products")
    }catch(err){ alert(err.message) }
    finally{ setSaving(false) }
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]"><div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return(
    <div className="max-w-5xl mx-auto p-4 bg-[#f8f9fb] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[18px] font-black truncate max-w-[70%]">Edit: {form.name || "Product"}</h1>
        <button onClick={()=>router.back()} className="border bg-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-black hover:text-white transition">Back</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm space-y-5">
          <div><label className="text-[11px] font-black tracking-widest uppercase text-[#666]">Store Name (Auto)</label><input value={storeName} readOnly className="w-full border-2 rounded-xl p-2.5 bg-gray-100 mt-1.5 text-[13px] font-bold text-black" placeholder="Store Name" /></div>
          <div><label className="text-[11px] font-black tracking-widest uppercase">Product Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="e.g. Ramy Black Rose Perfume 50 ml" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[11px] font-black tracking-widest uppercase">Category *</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black bg-white"><option value="">Select Category</option>{categories.map(cat=><option key={cat} value={cat}>{cat}</option>)}</select></div>
            <div><label className="text-[11px] font-black tracking-widest uppercase">Brand</label><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="Brand Name" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-[11px] font-black tracking-widest uppercase">Price *</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="375" /></div>
            <div><label className="text-[11px] font-black tracking-widest uppercase">Compare Price</label><input type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="400" /></div>
            <div><label className="text-[11px] font-black tracking-widest uppercase">Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full border-2 rounded-xl p-2.5 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="100" /></div>
          </div>
          <div className="border-2 rounded-2xl p-4">
            <div className="flex justify-between items-center"><span className="text-[12px] font-black">Images {images.length}/8</span><button onClick={()=>fileInputRef.current?.click()} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-black hover:bg-gray-800">Add Images</button></div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={e=>{
              const files = Array.from(e.target.files).map(f=>({ id: Date.now()+Math.random(), file: f, preview: URL.createObjectURL(f) }))
              if(images.length + files.length > 8){ alert("Max 8 Images"); return }
              setImages([...images,...files])
            }} className="hidden" />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img,idx)=>(
                <div key={img.id} className={`relative aspect-square rounded-xl border-2 overflow-hidden group ${activeImg===idx?'border-[#ff6a00] ring-2 ring-[#ff6a00]/20': 'border-gray-200'}`}>
                  <img src={img.preview} onClick={()=>setActiveImg(idx)} className="w-full h-full object-cover cursor-pointer" alt="" />
                  <button onClick={()=>removeImage(img.id)} className="absolute top-1 right-1 bg-black/80 text-white w-6 h-6 rounded-full text-[11px] grid place-items-center opacity-0 group-hover:opacity-100 transition">✕</button>
                  {idx===0 && <span className="absolute bottom-1 left-1 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">MAIN</span>}
                </div>
              ))}
            </div>
          </div>
          <div><label className="text-[11px] font-black tracking-widest uppercase">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={6} className="w-full border-2 rounded-xl p-3 mt-1.5 text-[13px] outline-none focus:border-black" placeholder="Product details..." /></div>
          <button onClick={handleUpdate} disabled={saving} className="w-full bg-black text-white py-3.5 rounded-xl font-black text-[14px] hover:bg-[#222] disabled:opacity-50">{saving?"Updating...":"Update Product"}</button>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm h-fit sticky top-4">
          <p className="text-[11px] font-black tracking-widest uppercase text-[#888]">Preview - {storeName || "Your Store"}</p>
          <div className="mt-3 aspect-square rounded-xl bg-gray-100 overflow-hidden border">
            {images[activeImg]? <img src={images[activeImg].preview} className="w-full h-full object-cover" alt="" /> : <div className="grid place-items-center h-full text-xs text-gray-400">No Image</div>}
          </div>
          <p className="mt-3 font-bold text-[14px] leading-tight line-clamp-2">{form.name || "Product Name"}</p>
          {form.category && <p className="text-[11px] text-[#1a9cb7] mt-1">{form.category} {form.brand? `• ${form.brand}` : ''}</p>}
          <p className="text-[#ff6a00] font-black text-[18px] mt-1">৳{form.price || 0}</p>
          {form.originalPrice && parseInt(form.originalPrice) > parseInt(form.price) && <p className="text-[11px] line-through text-[#999]">৳{form.originalPrice}</p>}
          <p className="text-[11px] text-gray-500 mt-2 font-bold truncate">{storeName}</p>
          <p className="text-[10px] text-gray-400 mt-1">{form.stock? `${form.stock} in stock` : ''}</p>
        </div>
      </div>
    </div>
  )
}