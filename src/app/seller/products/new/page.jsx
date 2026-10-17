"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [sellerId, setSellerId] = useState(null) // ✅ Real sellers.id
  const [storeName, setStoreName] = useState("")
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [customColor, setCustomColor] = useState("")
  const [customSize, setCustomSize] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubCategoryName, setNewSubCategoryName] = useState("")
  const [seoChar, setSeoChar] = useState(0)
  const [deliveryCharge, setDeliveryCharge] = useState("60")
  const [showPreview, setShowPreview] = useState(true)

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    originalPrice: "",
    stock: "50",
    sku: "",
    weight: "500g",
    warranty: "No Warranty",
    delivery: "Free Delivery",
    returnPolicy: "7 Days Return",
    colors: [],
    sizes: [],
    description: "",
    highlights: "",
    whatsInBox: "",
    videoUrl: "",
    seoTags: "",
    condition: "New",
    dangerGoods: "No",
    parcelSize: "Medium",
  })

  const [images, setImages] = useState([])
  const [categories, setCategories] = useState({
    "Electronics": ["Mobile", "Laptop", "Tablet", "Headphone", "Charger", "Smart Watch", "Speaker", "Camera", "Power Bank", "Keyboard", "Mouse", "Monitor", "TV", "AC", "Refrigerator", "Washing Machine", "Router", "CCTV"],
    "Fashion": ["Men T-Shirt", "Women Dress", "Kids", "Shoes", "Bags", "Watch", "Sunglass", "Jewelry", "Hijab", "Panjabi", "Saree", "Kurta", "Jeans", "Jacket", "Lingerie", "Borka", "Wallet", "Belt"],
    "Home & Living": ["Fan", "Light", "Kitchen", "Furniture", "Bedding", "Decor", "Storage", "Cookware", "Curtain", "Carpet", "Mattress", "Pillow", "Towel", "Cleaning Tools", "Garden", "Bathroom"],
    "Beauty & Health": ["Makeup", "Skin Care", "Hair Care", "Perfume", "Health Care", "Lipstick", "Face Wash", "Cream", "Shampoo", "Oil", "Soap", "Nail Polish", "Beard Care", "Supplements"],
    "Gadgets & Toys": ["Mini Fan", "Torch", "Cable", "Holder", "Toys", "Gaming", "Drone", "Trimmer", "Earphone", "Mic", "Ring Light", "Tripod", "USB", "Adapter", "Car Gadget"],
    "Groceries": ["Food", "Drinks", "Baby Products", "Cleaning", "Pet Care", "Rice", "Oil", "Spices", "Snacks", "Biscuit", "Tea", "Coffee", "Baby Diaper", "Baby Food"],
    "Vehicles": ["Bike Parts", "Car Accessories", "Helmet", "Tools", "Engine Oil", "Tyre", "Battery", "Seat Cover", "Bike Light"],
    "Sports & Outdoors": ["Cricket", "Football", "Gym Equipment", "Cycle", "Exercise", "Badminton", "Treadmill", "Dumbbell"],
    "Books & Stationery": ["Books", "Pen", "Notebook", "Bag", "Art Supplies", "Calculator", "Office Supplies"],
  })

  const allColors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Beige", "Maroon", "Golden", "Silver", "Multicolor", "Transparent", "Cream", "Olive", "Sky Blue"]
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "Free Size", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "One Size", "0-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y", "5-6Y"]
  const brands = ["No Brand", "Baharaz", "Apple", "Samsung", "Xiaomi", "Nike", "Adidas", "Sony", "HP", "Dell", "Generic", "Local", "Anker", "Havit", "Remax", "Walton", "Vision", "Bata", "Apex", "Lotto", "Unilever", "Square", "ACI"]

  useEffect(() => {
    let mounted = true
    const safetyTimeout = setTimeout(() => { if (mounted) setLoading(false) }, 1500)
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted && session?.user) {
          setUser(session.user)
          let foundName = ""
          let foundSellerTableId = null
          try {
            const { data: seller } = await supabase.from("sellers").select("id, shop_name, name").eq("user_id", session.user.id).maybeSingle()
            if(seller){
              foundName = seller.shop_name || seller.name || ""
              foundSellerTableId = seller.id
            }
          } catch {}
          if(!foundName){
            try {
              const { data: profile } = await supabase.from("profiles").select("shop_name, store_name, full_name, business_name").eq("id", session.user.id).maybeSingle()
              foundName = profile?.shop_name || profile?.store_name || profile?.business_name || profile?.full_name || ""
            } catch {}
          }
          if(!foundName) foundName = session.user.email?.split("@")[0] || "My Store"
          if (mounted) {
            setStoreName(foundName)
            setSellerId(foundSellerTableId) // ✅ Real ID or null
          }
        }
      } catch(e){}
      finally {
        if (mounted) {
          generateSku()
          clearTimeout(safetyTimeout)
          setLoading(false)
        }
      }
    }
    init()
    return () => { mounted = false; clearTimeout(safetyTimeout) }
  }, [])

  const generateSku = () => {
    const skuAuto = `BHZ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
    setForm((p) => ({...p, sku: skuAuto }))
  }

  const processFiles = (files) => {
    if (images.length + files.length > 8) { alert("Max 8 images allowed!"); return }
    const newImgs = Array.from(files).map((f) => ({ id: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(f), file: f, name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))
    setImages((p) => [...p,...newImgs])
  }
  const handleImagePick = (e) => { if (e.target.files) processFiles(e.target.files) }
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else setDragActive(false) }
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) processFiles(e.dataTransfer.files) }
  const removeImage = (id) => {
    setImages((p) => {
      const filtered = p.filter((i) => i.id!== id)
      if(activeImg >= filtered.length) setActiveImg(Math.max(0, filtered.length-1))
      return filtered
    })
  }
  const toggleArray = (field, value) => {
    if (!value) return
    setForm((prev) => {
      const exists = prev[field].includes(value)
      return {...prev, [field]: exists? prev[field].filter((v) => v!== value) : [...prev[field], value] }
    })
  }
  const addCustom = (field, value, setValue) => {
    if (!value.trim()) return
    if (!form[field].includes(value.trim())) setForm((p) => ({...p, [field]: [...p[field], value.trim()] }))
    setValue("")
  }
  const handleAddNewCategory = () => {
    if(!newCategoryName.trim()) return
    const name = newCategoryName.trim()
    if(!categories[name]){
      setCategories(prev => ({...prev, [name]: []}))
      setForm(prev => ({...prev, category: name, subCategory: ""}))
    }
    setNewCategoryName("")
  }
  const handleAddNewSubCategory = () => {
    if(!newSubCategoryName.trim() ||!form.category) return
    const name = newSubCategoryName.trim()
    setCategories(prev => {
      const updated = {...prev}
      if(!updated[form.category].includes(name)){
        updated[form.category] = [...updated[form.category], name]
      }
      return updated
    })
    setForm(prev => ({...prev, subCategory: name}))
    setNewSubCategoryName("")
  }

  const handleAiGenerate = async () => {
    if (!form.name) { alert("Please enter Product Name first!"); return }
    setAiLoading(true)
    try {
      let aiSuccess = false
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `You are Baharaz AI. Write product details for: ${form.name}, Brand: ${form.brand}, Category: ${form.category} ${form.subCategory}. Return ONLY valid JSON like: {"title":"...", "description":"...", "highlights":"...", "whats_in_box":"...", "seo_tags":"..." }`
          })
        })
        const data = await res.json()
        if (data.text) {
          let clean = data.text.replace(/```json|```/g, "").replace(/```/g,"").trim()
          const parsed = JSON.parse(clean)
          setForm((p) => ({
           ...p,
            name: parsed.title || parsed.name || p.name,
            description: parsed.description || p.description,
            highlights: parsed.highlights || `✓ Premium ${p.brand} Product\n✓ Best Quality Guaranteed\n✓ Fast Delivery Inside Dhaka\n✓ ${p.warranty}\n✓ ${p.returnPolicy}`,
            whatsInBox: parsed.whats_in_box || parsed.whatsInBox || `1 x ${p.name}\n1 x User Manual\n1 x Warranty Card`,
            seoTags: parsed.seo_tags || parsed.seoTags || `${p.name}, ${p.brand}, ${p.category}, Baharaz`,
          }))
          setSeoChar((parsed.seo_tags || parsed.seoTags || "").length)
          aiSuccess = true
        }
      } catch (apiErr) {}
      if (!aiSuccess) {
        const brand = form.brand || ""
        const cat = form.category || ""
        const sub = form.subCategory || ""
        const autoDesc = `${form.name} - ${brand? brand + ' er' : ''} ${cat} ${sub} collection er best quality product. ${storeName? storeName + ' theke' : 'Baharaz theke'} kinun original product. ${form.warranty} soho ${form.returnPolicy} paben. Sara Bangladesh e fast delivery. Best price guarantee!`
        const autoHighlights = `✓ 100% Original ${brand || 'Product'} - Authentic Guarantee\n✓ Premium Quality - ${cat} ${sub} Collection\n✓ ${form.warranty} Available\n✓ ${form.returnPolicy} Facility\n✓ Fast Delivery - Inside Dhaka ${deliveryCharge}TK\n✓ Best Price in Bangladesh\n✓ Trusted Seller - ${storeName}`
        const autoBox = `1 x ${form.name}\n1 x Premium Packaging\n1 x User Manual\n1 x Warranty Card (If Applicable)`
        const autoTags = `${form.name}, ${brand}, ${cat}, ${sub}, ${form.colors.join(", ")}, online shopping bd, best price, original product, ${storeName}`
        setForm((p) => ({...p, description: autoDesc, highlights: autoHighlights, whatsInBox: autoBox, seoTags: autoTags }))
        setSeoChar(autoTags.length)
      }
    } catch (e) {}
    setAiLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { alert("Please login first!"); return }
    if (!form.name ||!form.price ||!form.category) { alert("Name, Price, Category required!"); return }
    if (images.length === 0) { alert("At least 1 image required!"); return }
    setSaving(true)
    try {
      let uploadedUrls = []
      for (let img of images) {
        if (img.file) {
          const fileExt = img.file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          let uploaded = false
          try {
            const { error } = await supabase.storage.from("products").upload(fileName, img.file, { cacheControl: "3600", upsert: true })
            if (!error) {
              const { data: urlData } = supabase.storage.from("products").getPublicUrl(fileName)
              uploadedUrls.push(urlData.publicUrl)
              uploaded = true
            }
          } catch {}
          if (!uploaded) {
            try {
              const { error: retryErr } = await supabase.storage.from("product-images").upload(fileName, img.file, { upsert: true })
              if (!retryErr) {
                const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName)
                uploadedUrls.push(urlData.publicUrl)
              }
            } catch {}
          }
        } else if (img.preview.startsWith("http")) {
          uploadedUrls.push(img.preview)
        }
      }
      if (uploadedUrls.length === 0) uploadedUrls = images.map((i) => i.preview)

      // ✅ UNLIMITED SELLER - PROFESSIONAL FIX - Real sellers.id Use
      const realSellerId = sellerId || user.id
      const payload = {
        name: form.name.trim(),
        title: form.name.trim(),
        brand: form.brand || "No Brand",
        category: form.category,
        sub_category: form.subCategory || "",
        price: parseInt(form.price) || 0,
        original_price: parseInt(form.originalPrice || form.price) || 0,
        stock: parseInt(form.stock || "10"),
        sku: form.sku,
        weight: form.weight || "500g",
        warranty: form.warranty,
        delivery_type: form.delivery,
        return_policy: form.returnPolicy,
        colors: form.colors,
        sizes: form.sizes,
        description: form.description || "",
        highlights: form.highlights || "",
        whats_in_box: form.whatsInBox || "",
        video_url: form.videoUrl || "",
        seo_tags: form.seoTags || "",
        images: uploadedUrls,
        image: uploadedUrls[0] || "",
        image_url: uploadedUrls[0] || "",
        store_name: storeName,
        shop_name: storeName,
        status: "active",
        is_active: true,
        condition: form.condition,
        danger_goods: form.dangerGoods,
        parcel_size: form.parcelSize,
        delivery_charge: parseInt(deliveryCharge) || 0,
        // ✅ FIXED - Unlimited Seller All Store Will Work
        seller_id: realSellerId,
        seller_user_id: user.id,
        user_id: user.id,
      }

      let { data, error } = await supabase.from("products").insert([payload]).select()
      if (error) {
        const minimalPayload = {
          name: form.name.trim(),
          title: form.name.trim(),
          price: parseInt(form.price) || 0,
          stock: parseInt(form.stock || "10"),
          sku: form.sku,
          category: form.category,
          sub_category: form.subCategory || "",
          images: uploadedUrls,
          image: uploadedUrls[0] || "",
          seller_id: realSellerId,
          seller_user_id: user.id,
          user_id: user.id,
          description: form.description || "",
          status: "active",
          is_active: true,
          shop_name: storeName,
        }
        const retry = await supabase.from("products").insert([minimalPayload]).select()
        if (retry.error) throw retry.error
        data = retry.data
      }
      alert(`✅ Published! ${form.name} is live on ${storeName}!`)
      router.push("/seller/products")
    } catch (err) {
      const msg = err?.message || JSON.stringify(err)
      alert(`❌ Error: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]"><div className="text-center"><div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto"></div><p className="text-[11px] mt-2 font-bold text-gray-500">Loading {storeName || "Baharaz"}...</p></div></div>

  const discount = form.originalPrice && form.price && parseInt(form.originalPrice) > parseInt(form.price)? Math.round(((parseInt(form.originalPrice) - parseInt(form.price)) / parseInt(form.originalPrice)) * 100) : 0

  return (
    <div className="max-w-[1600px] mx-auto p-2 md:p-5 bg-[#f5f5f5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-black text-[18px]">Add New Product - {storeName}</h1>
        <button type="button" onClick={()=>setShowPreview(!showPreview)} className="md:hidden px-4 py-2 rounded-full bg-black text-white text-[11px] font-bold">{showPreview? "Hide Preview" : "Show Preview"}</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 shadow-lg">
            <div className="rounded-[18px] bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow">{storeName? storeName.charAt(0).toUpperCase() : 'B'}</div>
                <div><h3 className="font-black text-[15px] leading-none">{storeName} AI PRO MAX</h3><p className="text-[11px] text-gray-500 mt-1">Auto Description • Auto SEO • {sellerId? `ID: ${sellerId.slice(0,8)}...` : 'Unlimited Seller'}</p></div>
              </div>
              <button type="button" onClick={handleAiGenerate} disabled={aiLoading} className="w-full md:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[12px] font-black shadow hover:scale-[1.02] transition disabled:opacity-50">{aiLoading? "✨ Writing..." : "✨ Generate with AI"}</button>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-2 border-b pb-3"><div className="w-1 h-5 bg-[#f57224] rounded-full"></div><h2 className="font-black text-[13px] uppercase tracking-widest">Basic Information - {storeName}</h2></div>
            <div><label className="text-[11px] font-black uppercase text-gray-700">Product Name *</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value })} placeholder="Ex: Ramy Black Rose Perfume 50ml" className="w-full mt-2 px-4 py-3.5 rounded-xl border-2 text-[14px] font-bold outline-none focus:border-[#f57224] bg-[#fafafa]" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-black uppercase">Brand *</label><select value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value })} className="w-full mt-2 px-4 py-3 rounded-xl border-2 text-[13px] font-bold bg-white outline-none focus:border-[#f57224]"><option value="">Select Brand</option>{brands.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
              <div><label className="text-[11px] font-black uppercase">SKU - Auto Generated</label><div className="flex gap-2 mt-2"><input value={form.sku} readOnly className="flex-1 px-4 py-3 rounded-xl border-2 text-[13px] font-mono bg-gray-50 font-bold" /><button type="button" onClick={generateSku} className="px-3 bg-black text-white rounded-xl text-[11px] font-bold">New</button></div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black uppercase">Category * - {Object.keys(categories).length} Categories</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value, subCategory: "" })} className="w-full mt-2 px-4 py-3 rounded-xl border-2 text-[13px] font-bold bg-white outline-none focus:border-[#f57224]">
                  <option value="">Select Category</option>
                  {Object.keys(categories).map((c) => <option key={c} value={c}>{c} ({categories[c].length})</option>)}
                </select>
                <div className="flex gap-2 mt-2">
                  <input value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} placeholder="New Category Name" className="flex-1 border-2 p-2 rounded-lg text-[11px] font-bold" />
                  <button type="button" onClick={handleAddNewCategory} className="px-3 bg-[#f57224] text-white rounded-lg text-[10px] font-black">+ ADD NEW</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase">Sub Category - {form.category? categories[form.category]?.length : 0} Subs</label>
                <select value={form.subCategory} onChange={(e) => setForm({...form, subCategory: e.target.value })} className="w-full mt-2 px-4 py-3 rounded-xl border-2 text-[13px] font-bold bg-white outline-none">
                  <option value="">Select Sub Category</option>
                  {form.category && categories[form.category]?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-2 mt-2">
                  <input value={newSubCategoryName} onChange={(e)=>setNewSubCategoryName(e.target.value)} placeholder="New Sub Category" disabled={!form.category} className="flex-1 border-2 p-2 rounded-lg text-[11px] font-bold disabled:bg-gray-100" />
                  <button type="button" onClick={handleAddNewSubCategory} disabled={!form.category} className="px-3 bg-black text-white rounded-lg text-[10px] font-black disabled:opacity-50">+ ADD SUB</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-[11px] font-black uppercase">Price * ৳</label><input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value })} placeholder="500" className="w-full mt-2 px-4 py-3 rounded-xl border-2 font-black text-[16px] outline-none focus:border-[#f57224]" /></div>
              <div><label className="text-[11px] font-black uppercase">Compare Price ৳</label><input type="number" value={form.originalPrice} onChange={(e) => setForm({...form, originalPrice: e.target.value })} placeholder="1000" className="w-full mt-2 px-4 py-3 rounded-xl border-2 font-bold text-gray-500 outline-none" /></div>
              <div><label className="text-[11px] font-black uppercase">Stock Qty *</label><input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value })} className="w-full mt-2 px-4 py-3 rounded-xl border-2 font-black outline-none" /></div>
            </div>
            {discount > 0 && <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between text-[12px] font-bold"><span className="text-green-700">💰 Discount: {discount}% OFF</span><span className="text-green-700">Save ৳{parseInt(form.originalPrice)-parseInt(form.price)}</span></div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input placeholder="Weight Ex: 500g" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value })} className="border-2 p-3 rounded-xl text-[12px] font-bold" />
              <select value={form.warranty} onChange={(e) => setForm({...form, warranty: e.target.value })} className="border-2 p-3 rounded-xl text-[12px] font-bold bg-white"><option>No Warranty</option><option>7 Days Warranty</option><option>1 Month Warranty</option><option>6 Month Warranty</option><option>1 Year Warranty</option><option>Lifetime Warranty</option></select>
              <select value={form.delivery} onChange={(e) => setForm({...form, delivery: e.target.value })} className="border-2 p-3 rounded-xl text-[12px] font-bold bg-white"><option>Free Delivery</option><option>Paid Delivery</option><option>Express Delivery</option></select>
              <select value={form.returnPolicy} onChange={(e) => setForm({...form, returnPolicy: e.target.value })} className="border-2 p-3 rounded-xl text-[12px] font-bold bg-white"><option>7 Days Return</option><option>14 Days Return</option><option>No Return</option></select>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3"><div className="flex items-center gap-2"><div className="w-1 h-5 bg-[#f57224] rounded-full"></div><h2 className="font-black text-[13px] uppercase">Product Images {images.length}/8</h2></div><span className="text-[10px] bg-black text-white px-3 py-1 rounded-full font-bold">800x800 • Drag & Drop</span></div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImagePick} className="hidden" />
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`rounded-2xl border-2 border-dashed p-4 transition ${dragActive? "border-[#f57224] bg-orange-50" : "border-gray-300 bg-[#fafafa]"}`}>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {images.map((img, idx) => (
                  <div key={img.id} className={`group relative aspect-square rounded-xl border-2 overflow-hidden bg-white shadow-sm ${activeImg === idx? "border-[#f57224] ring-2 ring-orange-200" : "border-gray-200"}`}>
                    <img src={img.preview} onClick={() => setActiveImg(idx)} className="w-full h-full object-cover cursor-pointer" alt="" />
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1 right-1 w-6 h-6 bg-black/80 text-white rounded-full text-[11px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#f57224] text-white text-[8px] font-black text-center py-0.5">MAIN</span>}
                  </div>
                ))}
                {images.length < 8 && <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-1 hover:border-[#f57224] hover:bg-orange-50 transition"><span className="text-2xl text-gray-400">+</span><span className="text-[9px] font-bold text-gray-500">Add Image</span></button>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3"><div className="w-1 h-5 bg-[#f57224] rounded-full"></div><h2 className="font-black text-[13px] uppercase">Variants</h2></div>
            <div><p className="text-[11px] font-black uppercase mb-2">Colors - {form.colors.length} Selected</p><div className="flex flex-wrap gap-2">{allColors.map((c) => <button key={c} type="button" onClick={() => toggleArray("colors", c)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition ${form.colors.includes(c)? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-black"}`}>{c}</button>)}</div>
              <div className="flex gap-2 mt-3"><input value={customColor} onChange={(e) => setCustomColor(e.target.value)} placeholder="Custom Color" className="flex-1 border-2 p-2.5 rounded-xl text-[12px]" /><button type="button" onClick={() => addCustom("colors", customColor, setCustomColor)} className="px-4 py-2 bg-black text-white rounded-xl text-[11px] font-black">Add</button></div>
            </div>
            <div><p className="text-[11px] font-black uppercase mb-2">Sizes - {form.sizes.length} Selected</p><div className="flex flex-wrap gap-2">{allSizes.map((s) => <button key={s} type="button" onClick={() => toggleArray("sizes", s)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition ${form.sizes.includes(s)? "bg-[#f57224] text-white border-[#f57224]" : "bg-white text-gray-600 border-gray-200 hover:border-[#f57224]"}`}>{s}</button>)}</div>
              <div className="flex gap-2 mt-3"><input value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Custom Size" className="flex-1 border-2 p-2.5 rounded-xl text-[12px]" /><button type="button" onClick={() => addCustom("sizes", customSize, setCustomSize)} className="px-4 py-2 bg-[#f57224] text-white rounded-xl text-[11px] font-black">Add</button></div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-2 border-b pb-3"><div className="w-1 h-5 bg-[#f57224] rounded-full"></div><h2 className="font-black text-[13px] uppercase">Description & SEO</h2></div>
            <div><label className="text-[11px] font-black uppercase">Description</label><textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value })} rows={4} className="w-full mt-2 p-3.5 rounded-xl border-2 text-[13px] bg-[#fafafa] outline-none focus:border-[#f57224]"></textarea></div>
            <div><label className="text-[11px] font-black uppercase">Highlights</label><textarea value={form.highlights} onChange={(e) => setForm({...form, highlights: e.target.value })} rows={5} className="w-full mt-2 p-3.5 rounded-xl border-2 text-[12px] font-medium bg-[#fafafa] outline-none"></textarea></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-black uppercase">What's In Box</label><textarea value={form.whatsInBox} onChange={(e) => setForm({...form, whatsInBox: e.target.value })} rows={3} className="w-full mt-2 p-3 rounded-xl border-2 text-[12px] bg-[#fafafa]"></textarea></div>
              <div className="space-y-3">
                <div><label className="text-[11px] font-black uppercase">Video URL</label><input value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value })} placeholder="https://youtube.com/..." className="w-full mt-2 p-3 rounded-xl border-2 text-[12px]" /></div>
                <div><label className="text-[11px] font-black uppercase">Delivery Charge ৳</label><input value={deliveryCharge} onChange={(e)=>setDeliveryCharge(e.target.value)} className="w-full mt-2 p-3 rounded-xl border-2 text-[12px] font-bold" /></div>
              </div>
            </div>
            <div><label className="text-[11px] font-black uppercase">SEO Tags - {seoChar}/200</label><textarea value={form.seoTags} onChange={(e) => { setForm({...form, seoTags: e.target.value }); setSeoChar(e.target.value.length) }} rows={2} className="w-full mt-2 p-3 rounded-xl border-2 text-[11px] bg-[#fafafa]"></textarea></div>
          </div>

          <button type="button" onClick={handleSubmit} disabled={saving} className="w-full py-4 rounded-full bg-[#f57224] hover:bg-[#e66a20] text-white font-black text-[15px] shadow-lg shadow-orange-200 transition disabled:opacity-50">
            {saving? "⏳ Publishing..." : `🚀 Publish ${form.name || 'Product'} - ${storeName}`}
          </button>
        </div>

        {showPreview && (
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[16px] border shadow-sm sticky top-[20px] overflow-hidden">
            <div className="p-3 border-b flex items-center justify-between bg-[#fafafa]"><p className="text-[11px] font-black uppercase">Live Preview - {storeName}</p><span className="text-[9px] px-2.5 py-1 rounded-full bg-green-500 text-white font-black animate-pulse">● LIVE</span></div>
            <div className="p-3">
              <div className="aspect-square rounded-xl bg-[#f5f5f5] overflow-hidden border relative">
                {images[activeImg]? <img src={images[activeImg].preview} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2"><span className="text-3xl">📸</span><span className="text-[11px]">No Image</span></div>}
                {discount > 0 && <span className="absolute top-2 left-2 bg-[#f57224] text-white text-[11px] font-black px-2 py-1 rounded">-{discount}%</span>}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2 py-1 rounded-full">{activeImg+1}/{images.length || 1}</span>
              </div>
              <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                {images.map((img, idx) => <img key={img.id} src={img.preview} onClick={() => setActiveImg(idx)} className={`w-12 h-12 rounded-lg border-2 object-cover cursor-pointer flex-shrink-0 ${activeImg === idx? "border-[#f57224]" : "border-gray-200 opacity-60"}`} alt="" />)}
              </div>
              <h2 className="font-bold text-[14px] mt-3 leading-snug line-clamp-2">{form.name || "Product Name"}</h2>
              <div className="flex items-center gap-2 mt-1"><span className="text-[10px] text-[#1a9cb7] font-medium">Brand: {form.brand || "No Brand"}</span><span className="text-[10px] text-gray-300">|</span><span className="text-[10px] text-gray-500">SKU: {form.sku}</span></div>
              {form.category && <div className="text-[10px] text-gray-500 mt-1 bg-gray-50 inline-block px-2 py-1 rounded-full">{form.category}{form.subCategory? ` › ${form.subCategory}` : ''}</div>}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[22px] font-black text-[#f57224]">৳{form.price || "0"}</span>
                {form.originalPrice && <span className="text-[12px] text-gray-400 line-through">৳{form.originalPrice}</span>}
                {discount > 0 && <span className="text-[11px] font-bold text-white bg-[#f57224] px-1.5 rounded">-{discount}%</span>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#f5f5f5] rounded-lg p-2"><p className="text-gray-500">Delivery</p><p className="font-bold mt-0.5">{form.delivery}</p><p className="text-[9px] text-gray-400">{deliveryCharge}৳ Charge</p></div>
                <div className="bg-[#f5f5f5] rounded-lg p-2"><p className="text-gray-500">Service</p><p className="font-bold mt-0.5">{form.returnPolicy}</p><p className="text-[9px] text-gray-400">{form.warranty}</p></div>
              </div>
              {form.colors.length > 0 && <div className="mt-3"><p className="text-[11px] font-bold">Colors: <span className="font-normal">{form.colors.join(", ")}</span></p></div>}
              {form.sizes.length > 0 && <div className="mt-2"><p className="text-[11px] font-bold">Size: <span className="font-normal">{form.sizes.join(", ")}</span></p></div>}
              <div className="mt-4 p-2.5 bg-[#f8f8f8] rounded-xl border">
                <p className="text-[10px] font-black uppercase text-gray-700">Sold by</p>
                <div className="flex items-center justify-between mt-1"><p className="text-[12px] font-bold truncate">{storeName || "Your Store"}</p><span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded shrink-0 ml-2">✓ Verified</span></div>
                <p className="text-[10px] text-gray-500 mt-1 truncate">{form.category}{form.subCategory? ` > ${form.subCategory}` : ''} • Fast Delivery</p>
                <p className="text-[8px] text-gray-400 mt-1 font-mono">Seller ID: {sellerId? sellerId.slice(0,12)+'...' : 'Auto'}</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}