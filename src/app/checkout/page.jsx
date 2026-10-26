"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
// ✅ শুধু তোমার ফাইল থেকেই ডাটা আসবে - এখানে আর কোনো BD_DATA লেখা নাই
import { BD_DATA, BD_UPAZILAS } from "@/data/bd-address.js";

const getPrice = (p) => {
  if (typeof p === 'number') return p;
  const num = Number(String(p||'').replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get('buy_now');

  const [cart, setCart] = useState(()=>{
    if(typeof window==='undefined') return [];
    try{
      const checkoutType = localStorage.getItem("baharaz_checkout_type");
      if(checkoutType==="buy_now"){
        const checkoutItems = JSON.parse(localStorage.getItem("baharaz_checkout_items")||"[]");
        if(checkoutItems?.length>0) return checkoutItems;
        const buyNowSingle = JSON.parse(localStorage.getItem("baharaz_buy_now")||"null");
        if(buyNowSingle) return Array.isArray(buyNowSingle)? buyNowSingle : [buyNowSingle];
      }
      const keys = ["baharaz_cart","cart","eRajCart","baharaz_cart_items","baharaz_checkout_items"];
      for(let k of keys){
        const v = localStorage.getItem(k);
        if(v){
          const p = JSON.parse(v);
          if(Array.isArray(p) && p.length>0) return p;
        }
      }
    }catch{}
    return [];
  });
  const [addresses, setAddresses] = useState(()=>{
    if(typeof window==='undefined') return [];
    try{
      const saved = localStorage.getItem("baharaz_addresses") || localStorage.getItem("eraj_addresses");
      if(saved) return JSON.parse(saved) || [];
    }catch{}
    return [];
  });
  const [selectedAddrId, setSelectedAddrId] = useState(()=>{
    if(typeof window==='undefined') return null;
    try{
      const defRaw = localStorage.getItem("baharaz_default_address") || localStorage.getItem("eraj_default_address");
      if(defRaw){ const d=JSON.parse(defRaw); if(d?.id) return d.id; }
      const addrs = JSON.parse(localStorage.getItem("baharaz_addresses")||"[]");
      if(addrs[0]?.id) return addrs[0].id;
    }catch{}
    return null;
  });
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState("");
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({ name:"", phone:"", full_address:"", division:"", district:"", upazila:"", postal:"", country:"Bangladesh" });
  const [isBuyNowMode, setIsBuyNowMode] = useState(()=>{
    if(typeof window==='undefined') return false;
    return localStorage.getItem("baharaz_checkout_type")==="buy_now" || false;
  });
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deliveryChargesMap, setDeliveryChargesMap] = useState({ Rajshahi:55, Bogura:60, Sirajganj:70, Natore:60, Pabna:65, Dhaka:80, Gazipur:80, Chattogram:100, Chittagong:100, Khulna:80, Sylhet:100, Barishal:95, Rangpur:60, Mymensingh:85, Cumilla:90, Comilla:90 });

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(""), 3000); };

  useEffect(() => {
    supabase.from('delivery_settings').select('*').then(({data})=>{
      if(data && data.length>0){
        const map = {};
        data.forEach(r=>{
          if(r.location) map[r.location]=Number(r.charge||r.price||r.fee);
          if(r.district) map[r.district]=Number(r.charge||r.price||r.fee);
          if(r.division) map[r.division]=Number(r.charge||r.price||r.fee);
        });
        if(Object.keys(map).length>0) setDeliveryChargesMap(map);
      }
    });
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user || null);
    });
    if(isBuyNowParam==="1"){
      try{
        const checkoutItems = JSON.parse(localStorage.getItem("baharaz_checkout_items")||"[]");
        if(checkoutItems?.length>0){ setCart(checkoutItems); setIsBuyNowMode(true); }
        else{
          const buyNowSingle = JSON.parse(localStorage.getItem("baharaz_buy_now")||"null");
          if(buyNowSingle){ setCart(Array.isArray(buyNowSingle)? buyNowSingle : [buyNowSingle]); setIsBuyNowMode(true); }
        }
      }catch{}
    }
  }, [isBuyNowParam]);

  const subtotal = useMemo(() => {
    return cart.reduce((s, i)=> {
      const price = getPrice(i?.price || 0);
      const qty = Number(i?.qty || i?.quantity || 1);
      return s + price * qty;
    }, 0);
  }, [cart]);

  const customerLocation = useMemo(()=>{
    const sel = addresses.find(a=> a.id===selectedAddrId);
    return {
      division: sel?.division || newAddrForm.division || "",
      district: sel?.district || newAddrForm.district || "",
      upazila: sel?.upazila || newAddrForm.upazila || ""
    };
  }, [selectedAddrId, addresses, newAddrForm]);

  const deliveryCharge = useMemo(() => {
    if(isBuyNowMode){
      try{
        const summary = JSON.parse(localStorage.getItem("baharaz_checkout_summary")||"{}");
        if(summary.deliveryFee) return Number(summary.deliveryFee);
        if(summary.deliveryCharge) return Number(summary.deliveryCharge);
      }catch{}
    }
    const { division, district } = customerLocation;
    if(!division && !district) return 0;
    if(district && deliveryChargesMap[district]) return deliveryChargesMap[district];
    if(division && deliveryChargesMap[division]) return deliveryChargesMap[division];
    const dKey = Object.keys(deliveryChargesMap).find(k=> k.toLowerCase() === district.toLowerCase());
    if(dKey) return deliveryChargesMap[dKey];
    const divKey = Object.keys(deliveryChargesMap).find(k=> k.toLowerCase() === division.toLowerCase());
    if(divKey) return deliveryChargesMap[divKey];
    return 60;
  }, [customerLocation, isBuyNowMode, deliveryChargesMap]);

  const total = subtotal + deliveryCharge - discount;

  const deliveryDateInfo = useMemo(() => {
    const { division, district } = customerLocation;
    let days = 2;
    if (district === "Rajshahi" || district === "Bogura" || district === "Sirajganj") days = 1;
    else if (division === "Rajshahi" || division === "Dhaka" || division === "Rangpur" || division === "Mymensingh") days = 2;
    else days = 3;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return {
      full: d.toLocaleDateString("en-GB", { weekday:"short", day:"2-digit", month:"short" }),
      days
    };
  }, [customerLocation]);

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c==="BAHARAZ10") { setDiscount(Math.round(subtotal*0.10)); showToast("10% OFF Applied"); }
    else if (c==="FREEDEL") { setDiscount(deliveryCharge); showToast("Free Delivery Applied"); }
    else { setDiscount(0); showToast("Invalid Coupon"); }
  };

  const handlePlaceOrder = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user || null;
    if (!currentUser) {
      setShowLoginModal(true);
      router.push("/login?next=/checkout");
      return;
    }
    if (cart.length===0) { showToast("Cart Empty"); return; }
    const selectedAddress = addresses.find(a=> a.id===selectedAddrId);
    const finalAddr = selectedAddress || newAddrForm;
    if (!finalAddr?.phone || !finalAddr?.full_address || !finalAddr?.division || !finalAddr?.district || !finalAddr?.upazila || !finalAddr?.postal) { 
      showToast("Please fill all address fields"); 
      setShowNewAddr(true); 
      return; 
    }
    setPlacing(true);
    try {
      const orderId = `BZ-${Date.now()}`;
      const orderPayload = { id: orderId, user_id: currentUser.id, email: currentUser.email, total, subtotal, delivery_charge: deliveryCharge, discount, payment_method: payment, status: "pending", shipping_address: finalAddr, items: cart, note, created_at: new Date().toISOString(), type: isBuyNowMode? "buy_now" : "cart" };
      const allOrders = JSON.parse(localStorage.getItem("baharaz_orders") || "[]");
      allOrders.unshift(orderPayload);
      localStorage.setItem("baharaz_orders", JSON.stringify(allOrders));
      localStorage.setItem("baharaz_last_order", JSON.stringify(orderPayload));
      supabase.from("orders").insert([{ id: orderId, user_id: currentUser.id, items: cart, total, subtotal, delivery_charge: deliveryCharge, coupon_discount: discount, payment_method: payment, status: "pending", shipping_address: finalAddr, phone: finalAddr.phone, district: finalAddr.district, division: finalAddr.division, upazila: finalAddr.upazila, full_address: finalAddr.full_address, postal_code: finalAddr.postal, country: finalAddr.country, customer_name: finalAddr.name, note }]).then(()=>{});
      if(!isBuyNowMode){ localStorage.setItem("baharaz_cart", "[]"); localStorage.removeItem("baharaz_checkout_items"); window.dispatchEvent(new Event('cartUpdated')); } else { localStorage.removeItem("baharaz_buy_now"); }
      showToast("Order Placed!");
      router.push(`/order-success?orderId=${orderId}`);
    } catch (e) { showToast("Failed: "+e.message); } finally { setPlacing(false); }
  };

  const currentDistrictList = newAddrForm.division ? (BD_DATA[newAddrForm.division] || []) : [];
  const currentUpazilaList = newAddrForm.district ? (BD_UPAZILAS[newAddrForm.district] || []) : (newAddrForm.division ? (BD_UPAZILAS[newAddrForm.division] || []) : []);

  if (cart.length===0) {
    return (
      <div style={{ maxWidth:"1188px", margin:"0 auto", padding:"40px 16px", textAlign:"center", background:"#f5f5f5", minHeight:"100vh" }}>
        <div style={{ fontSize:"48px" }}>🛒</div>
        <h1 style={{ fontWeight:"700", fontSize:"16px", marginTop:"8px" }}>Cart Empty</h1>
        <Link href="/" style={{ display:"inline-block", marginTop:"16px", background:"#f85606", color:"white", padding:"10px 20px", borderRadius:"6px", fontWeight:"700", fontSize:"12px", textDecoration:"none" }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ background:"#f5f5f5", minHeight:"100vh", paddingBottom:"80px" }}>
      {toast? <div style={{ position:"fixed", bottom:"20px", left:"50%", transform:"translateX(-50%)", background:"#222", color:"white", padding:"10px 16px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", zIndex:9999 }}>{toast}</div> : null}
      <div style={{ background:"white", borderBottom:"1px solid #eee", padding:"10px 0", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"1188px", margin:"0 auto", padding:"0 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Link href="/" style={{ fontWeight:"800", fontSize:"18px", color:"#f85606", textDecoration:"none" }}>Baharaz</Link>
          <div style={{ display:"flex", gap:"6px", fontSize:"11px", fontWeight:"700", alignItems:"center" }}>
            <span style={{ background:isBuyNowMode?"#222":"#f85606", color:"white", padding:"4px 10px", borderRadius:"12px" }}>{isBuyNowMode?"Buy Now":"Cart"}</span>
            <span>›</span>
            <span style={{ background:"#111", color:"white", padding:"4px 10px", borderRadius:"12px" }}>Checkout</span>
          </div>
        </div>
      </div>

      <div className="checkout-grid" style={{ maxWidth:"1188px", margin:"12px auto 0", padding:"0 8px", display:"grid", gridTemplateColumns:"1.6fr 0.8fr", gap:"12px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ background:"white", borderRadius:"8px", padding:"14px", border:"1px solid #e5e5e5" }}>
            <h2 style={{ fontWeight:"700", fontSize:"13px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>Delivery Address</span>
              <button onClick={()=> setShowNewAddr(!showNewAddr)} style={{ fontSize:"11px", background:"white", border:"1px solid #ddd", padding:"5px 12px", borderRadius:"4px", fontWeight:"600", cursor:"pointer" }}>{showNewAddr? "Close" : "+ New Address"}</button>
            </h2>
            {addresses.length > 0 && (
              <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
                {addresses.map(addr=> (
                  <div key={addr.id} onClick={()=> setSelectedAddrId(addr.id)} style={{ border: selectedAddrId===addr.id? "1px solid #f85606" : "1px solid #eee", borderRadius:"6px", padding:"10px", cursor:"pointer", background: selectedAddrId===addr.id? "#fff8f3" : "white" }}>
                    <div style={{ display:"flex", gap:"8px" }}><input type="radio" checked={selectedAddrId===addr.id} readOnly style={{ accentColor:"#f85606" }} /><div><p style={{ fontWeight:"600", fontSize:"11px" }}>{addr.name} - {addr.phone}</p><p style={{ fontSize:"10px", color:"#666", marginTop:"2px" }}>{addr.full_address}, {addr.upazila}, {addr.district}, {addr.division} - {addr.postal}</p></div></div>
                  </div>
                ))}
              </div>
            )}
            {(showNewAddr || addresses.length===0) && (
              <div style={{ marginTop:"12px", background:"#fafafa", padding:"12px", borderRadius:"6px", border:"1px solid #eee" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                  <input value={newAddrForm.name} onChange={e=> setNewAddrForm({...newAddrForm, name:e.target.value})} placeholder="Full Name *" style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px" }} />
                  <input value={newAddrForm.phone} onChange={e=> setNewAddrForm({...newAddrForm, phone:e.target.value.replace(/\D/g,"").slice(0,11)})} placeholder="Phone Number *" style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px" }} />
                  <input value={newAddrForm.full_address} onChange={e=> setNewAddrForm({...newAddrForm, full_address:e.target.value})} placeholder="Full Address *" style={{ gridColumn:"1 / -1", padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px" }} />
                  <select value={newAddrForm.division} onChange={e=> setNewAddrForm({...newAddrForm, division:e.target.value, district:"", upazila:""})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px", background:"white" }}>
                    <option value="">Select Division *</option>
                    {Object.keys(BD_DATA).map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={newAddrForm.district} onChange={e=> setNewAddrForm({...newAddrForm, district:e.target.value, upazila:""})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px", background:"white" }}>
                    <option value="">Select District *</option>
                    {currentDistrictList.map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={newAddrForm.upazila} onChange={e=> setNewAddrForm({...newAddrForm, upazila:e.target.value})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px", background:"white" }}>
                    <option value="">Select Upazila *</option>
                    {currentUpazilaList.map(u=> <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input value={newAddrForm.postal} onChange={e=> setNewAddrForm({...newAddrForm, postal:e.target.value})} placeholder="Postal Code *" style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px" }} />
                  <select value={newAddrForm.country} onChange={e=> setNewAddrForm({...newAddrForm, country:e.target.value})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px", background:"white", gridColumn:"1 / -1" }}>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>
                <button onClick={()=> { 
                  if(!newAddrForm.name || !newAddrForm.phone || !newAddrForm.full_address || !newAddrForm.division || !newAddrForm.district || !newAddrForm.upazila || !newAddrForm.postal){ showToast("Please fill all required fields"); return; }
                  const id=`addr_${Date.now()}`; 
                  const newAddr={ id, ...newAddrForm }; 
                  const updated=[newAddr,...addresses]; 
                  setAddresses(updated); 
                  localStorage.setItem("baharaz_addresses", JSON.stringify(updated)); 
                  localStorage.setItem("baharaz_default_address", JSON.stringify(newAddr)); 
                  setSelectedAddrId(id); 
                  setShowNewAddr(false); 
                  setNewAddrForm({ name:"", phone:"", full_address:"", division:"", district:"", upazila:"", postal:"", country:"Bangladesh" });
                  showToast("Address Saved");
                }} style={{ marginTop:"10px", background:"#f85606", color:"white", padding:"10px", borderRadius:"6px", fontWeight:"700", fontSize:"12px", border:"none", cursor:"pointer", width:"100%" }}>Save Address</button>
              </div>
            )}
          </div>

          <div style={{ background:"white", borderRadius:"8px", padding:"14px", border:"1px solid #e5e5e5" }}>
            <h2 style={{ fontWeight:"700", fontSize:"12px" }}>Delivery Option</h2>
            <div style={{ marginTop:"8px", display:"flex", gap:"10px", padding:"10px", border:"1px solid #eee", borderRadius:"6px", background:"#fff", alignItems:"center" }}>
              <div style={{ width:"32px", height:"32px", background:"#f5f5f5", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"14px" }}>🚚</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <p style={{ fontWeight:"700", fontSize:"11px" }}>Standard Delivery</p>
                    <p style={{ fontSize:"10px", color:"#666", marginTop:"1px" }}>{customerLocation.district ? `${customerLocation.district}, ${customerLocation.division}` : "Select location"}</p>
                  </div>
                  <p style={{ fontWeight:"800", fontSize:"13px" }}>৳{deliveryCharge || 0}</p>
                </div>
                <div style={{ marginTop:"4px", background:"#e8f5e9", borderRadius:"4px", padding:"3px 6px", display:"inline-block" }}>
                  <p style={{ fontSize:"10px", color:"#0a7e07", fontWeight:"600" }}>✓ Guaranteed by {deliveryDateInfo.full} • {deliveryDateInfo.days} {deliveryDateInfo.days===1 ? "Day" : "Days"}</p>
                </div>
                <p style={{ fontSize:"10px", color:"#666", marginTop:"3px" }}>Cash on Delivery Available</p>
              </div>
            </div>
          </div>

          <div style={{ background:"white", borderRadius:"8px", padding:"14px", border:"1px solid #e5e5e5" }}>
            <h2 style={{ fontWeight:"700", fontSize:"12px" }}>Payment Method</h2>
            <div style={{ display:"grid", gap:"8px", marginTop:"8px" }}>
              <div onClick={()=> setPayment("cod")} style={{ border: payment==="cod"? "1px solid #f85606" : "1px solid #eee", background: payment==="cod"? "#fff8f3" : "white", padding:"10px 12px", borderRadius:"6px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}><div><p style={{ fontWeight:"600", fontSize:"11px" }}>Cash on Delivery</p><p style={{ fontSize:"10px", color:"#666" }}>Pay when you receive</p></div><span style={{ fontSize:"12px" }}>{payment==="cod"? "●" : "○"}</span></div>
              <div onClick={()=> setPayment("bkash")} style={{ border: payment==="bkash"? "1px solid #e2136e" : "1px solid #eee", background: payment==="bkash"? "#fff0f6" : "white", padding:"10px 12px", borderRadius:"6px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}><p style={{ fontWeight:"600", fontSize:"11px" }}>bKash / Nagad</p><span style={{ fontSize:"12px" }}>{payment==="bkash"? "●" : "○"}</span></div>
            </div>
            <textarea value={note} onChange={e=> setNote(e.target.value)} placeholder="Order Note (Optional)" style={{ width:"100%", marginTop:"10px", padding:"8px", border:"1px solid #ddd", borderRadius:"6px", fontSize:"11px" }} rows={2}></textarea>
          </div>
        </div>

        <div style={{ position:"sticky", top:"60px", height:"fit-content" }}>
          <div style={{ background:"white", borderRadius:"8px", padding:"12px", border:"1px solid #e5e5e5" }}>
            <h2 style={{ fontWeight:"700", fontSize:"12px" }}>Order Summary - {cart.length} Items</h2>
            <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"8px", maxHeight:"280px", overflowY:"auto" }}>
              {cart.map((item, idx)=> (
                <div key={idx} style={{ display:"flex", gap:"8px", borderBottom:"1px solid #f5f5f5", paddingBottom:"8px" }}>
                  <img src={item.image || item.image_url || "https://via.placeholder.com/60"} alt="" style={{ width:"40px", height:"40px", borderRadius:"6px", border:"1px solid #eee", objectFit:"contain" }} />
                  <div style={{ flex:1, minWidth:0 }}><p style={{ fontSize:"10px", fontWeight:"600", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name || item.title}</p><p style={{ fontSize:"9px", color:"#666" }}>Qty {item.qty||item.quantity||1} × ৳{getPrice(item.price)}</p></div>
                  <p style={{ fontWeight:"700", fontSize:"10px" }}>৳{(getPrice(item.price)*(Number(item.qty||item.quantity||1))).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"10px", display:"flex", gap:"6px" }}><input value={coupon} onChange={e=> setCoupon(e.target.value)} placeholder="Voucher Code" style={{ flex:1, padding:"8px", border:"1px solid #ddd", borderRadius:"4px", fontSize:"10px" }} /><button onClick={applyCoupon} style={{ background:"#111", color:"white", padding:"8px 12px", borderRadius:"4px", fontSize:"10px", fontWeight:"700", border:"none", cursor:"pointer" }}>Apply</button></div>
            <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"4px", fontSize:"11px" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"#666" }}>Subtotal</span><span>৳{subtotal.toFixed(0)}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"#666" }}>Delivery</span><span>৳{deliveryCharge}</span></div>
              {discount>0 && <div style={{ display:"flex", justifyContent:"space-between", color:"#16a34a", fontWeight:"600" }}><span>Discount</span><span>-৳{discount}</span></div>}
              <div style={{ height:"1px", background:"#eee", margin:"4px 0" }}></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", fontWeight:"800" }}><span>Total</span><span style={{ color:"#f85606" }}>৳{total.toFixed(0)}</span></div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing} style={{ width:"100%", marginTop:"12px", background: placing? "#ccc" : "#f85606", color:"white", padding:"11px", borderRadius:"6px", fontWeight:"700", fontSize:"12px", border:"none", cursor:"pointer" }}>{placing? "Placing..." : `Place Order - ৳${total.toFixed(0)}`}</button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
          <div style={{ width:"100%", maxWidth:"320px", background:"white", borderRadius:"12px", padding:"20px", textAlign:"center", position:"relative" }}>
            <h3 style={{ fontWeight:"800", fontSize:"14px" }}>Please Login</h3>
            <p style={{ fontSize:"11px", marginTop:"6px", color:"#666" }}>You need to login to place order</p>
            <div style={{ marginTop:"12px", display:"grid", gap:"8px" }}>
              <Link href="/login?next=/checkout" style={{ background:"#f85606", color:"white", padding:"10px", borderRadius:"20px", fontWeight:"700", fontSize:"11px", textAlign:"center", textDecoration:"none" }}>Login with Gmail</Link>
              <Link href="/login?next=/checkout" style={{ background:"#111", color:"white", padding:"10px", borderRadius:"20px", fontWeight:"700", fontSize:"11px", textAlign:"center", textDecoration:"none" }}>Login with Number</Link>
            </div>
            <button onClick={()=> setShowLoginModal(false)} style={{ position:"absolute", top:"8px", right:"8px", width:"24px", height:"24px", background:"#f5f5f5", borderRadius:"50%", border:"none", cursor:"pointer", fontSize:"12px" }}>✕</button>
          </div>
        </div>
      )}
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important; padding:0 8px!important; gap:10px!important;} div[style*="position:sticky"]{position:static!important}}`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}