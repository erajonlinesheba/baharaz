"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const BD_DATA = {
  "Dhaka": ["Dhaka","Gazipur","Kishoreganj","Manikganj","Munshiganj","Narayanganj","Narsingdi","Tangail","Faridpur","Gopalganj","Madaripur","Rajbari","Shariatpur"],
  "Chattogram": ["Chattogram","Cox's Bazar","Cumilla","Brahmanbaria","Chandpur","Feni","Khagrachhari","Lakshmipur","Noakhali","Rangamati","Bandarban"],
  "Rajshahi": ["Rajshahi","Bogura","Joypurhat","Naogaon","Natore","Chapainawabganj","Pabna","Sirajganj"],
  "Khulna": ["Khulna","Bagerhat","Chuadanga","Jashore","Jhenaidah","Kushtia","Magura","Meherpur","Narail","Satkhira"],
  "Barishal": ["Barishal","Barguna","Bhola","Jhalokati","Patuakhali","Pirojpur"],
  "Sylhet": ["Sylhet","Moulvibazar","Habiganj","Sunamganj"],
  "Rangpur": ["Rangpur","Dinajpur","Kurigram","Gaibandha","Lalmonirhat","Nilphamari","Panchagarh","Thakurgaon"],
  "Mymensingh": ["Mymensingh","Jamalpur","Netrokona","Sherpur"]
};

const BD_UPAZILAS = {
  "Rajshahi": ["Boalia","Rajpara","Motihar","Shah Makhdum","Paba","Godagari","Mohanpur","Bagmara","Charghat","Durgapur","Bagha","Tanore"],
  "Bogura": ["Bogura Sadar","Shajahanpur","Sherpur","Shibganj","Gabtali","Sonatala","Sariakandi","Dhunat","Dhupchanchia","Kahaloo","Nandigram","Adamdighi"],
  "Dhaka": ["Savar","Dhamrai","Keraniganj","Gulshan","Mirpur","Uttara","Dhanmondi","Motijheel","Tejgaon","Mohammadpur","Badda","Khilkhet"],
  "Chattogram": ["Anwara","Patiya","Hathazari","Raozan","Sitakunda","Boalkhali","Fatikchhari","Mirsharai","Satkania","Lohagara"],
  "Cumilla": ["Cumilla Sadar","Chauddagram","Laksam","Barura","Chandina","Debidwar","Burichang","Brahmanpara"],
  "Khulna": ["Khulna Sadar","Sonadanga","Dumuria","Batiaghata","Rupsha","Dighalia","Fultala"],
  "Sylhet": ["Sylhet Sadar","Beanibazar","Golapganj","Balaganj","Bishwanath","Companiganj","Jaintiapur"],
  "Rangpur": ["Rangpur Sadar","Mithapukur","Pirgachha","Pirganj","Badarganj","Kaunia","Gangachara"],
  "Mymensingh": ["Mymensingh Sadar","Trishal","Bhaluka","Muktagachha","Gafargaon","Fulbaria"]
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get('buy_now');

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState("");
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({ name:"", phone:"", full_address:"", division:"", district:"", upazila:"", postal:"", country:"Bangladesh" });
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(""), 3500); };

  useEffect(() => {
    const initCheckout = async () => {
      setCheckingAuth(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (!currentUser) {
          setShowLoginModal(true);
        } else {
          setShowLoginModal(false);
        }

        const checkoutType = localStorage.getItem("baharaz_checkout_type");
        const hasBuyNowParam = isBuyNowParam === "1";
        const hasBuyNowType = checkoutType === "buy_now";

        if (hasBuyNowParam || hasBuyNowType) {
          const checkoutItems = JSON.parse(localStorage.getItem("baharaz_checkout_items")||"[]");
          const buyNowSingle = JSON.parse(localStorage.getItem("baharaz_buy_now")||"null");
          if (checkoutItems && checkoutItems.length > 0) {
            setCart(checkoutItems);
            setIsBuyNowMode(true);
          } else if (buyNowSingle) {
            const arr = Array.isArray(buyNowSingle)? buyNowSingle : [buyNowSingle];
            setCart(arr);
            setIsBuyNowMode(true);
          }
        } else {
          const keys = ["baharaz_checkout_items", "baharaz_cart","cart","eRajCart","baharaz_cart_items"];
          for (let k of keys) {
            const v = localStorage.getItem(k);
            if (v) {
              const p = JSON.parse(v);
              if (Array.isArray(p) && p.length>0) {
                if(k==="baharaz_checkout_items"){
                  const summary = JSON.parse(localStorage.getItem("baharaz_checkout_summary")||"{}");
                  if(summary.type==="buy_now") continue;
                }
                setCart(p);
                break;
              }
            }
          }
          setIsBuyNowMode(false);
        }

        const savedAddrs = localStorage.getItem("baharaz_addresses") || localStorage.getItem("eraj_addresses");
        if (savedAddrs) {
          const addrs = JSON.parse(savedAddrs);
          if (Array.isArray(addrs) && addrs.length > 0) {
            setAddresses(addrs);
            const defRaw = localStorage.getItem("baharaz_default_address") || localStorage.getItem("eraj_default_address");
            if (defRaw) {
              const d = JSON.parse(defRaw);
              if (d && d.id) setSelectedAddrId(d.id);
            } else {
              setSelectedAddrId(addrs[0].id);
            }
          }
        }

      } catch (e) { console.log(e); }
      setCheckingAuth(false);
    };
    initCheckout();
  }, [isBuyNowParam]);

  const subtotal = useMemo(() => {
    return cart.reduce((s, i)=> {
      const price = Number(i?.price || 0);
      const qty = Number(i?.qty || i?.quantity || 1);
      return s + price * qty;
    }, 0);
  }, [cart]);

  const deliveryCharge = useMemo(() => {
    if(isBuyNowMode){
      try{
        const summary = JSON.parse(localStorage.getItem("baharaz_checkout_summary")||"{}");
        if(summary.deliveryFee) return summary.deliveryFee;
        if(summary.deliveryCharge) return summary.deliveryCharge;
      }catch{}
    }
    const sel = addresses.find(a=> a.id===selectedAddrId);
    const div = sel?.division || newAddrForm.division;
    const dist = sel?.district || newAddrForm.district;
    if(!div) return 0;
    if (dist === "Rajshahi" && div === "Rajshahi") return 55;
    if (div === "Rajshahi") return 70;
    if (div === "Dhaka" && dist === "Dhaka") return 60;
    if (div === "Dhaka") return 80;
    if (div === "Chattogram" || div === "Khulna" || div === "Sylhet") return 100;
    return 120;
  }, [selectedAddrId, addresses, newAddrForm, isBuyNowMode]);

  const total = subtotal + deliveryCharge - discount;

  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toLocaleDateString("en-BD", { day: "2-digit", month: "short" });
  }, []);

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c==="BAHARAZ10" || c==="ERAJ10" || c==="E-RAJ10") { setDiscount(Math.round(subtotal*0.10)); showToast("10% OFF Applied"); }
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
    if (finalAddr.phone.length<11) { showToast("Valid 11 digit phone required"); return; }
    
    setPlacing(true);
    try {
      const orderId = `BZ-${Date.now()}`;
      const orderPayload = {
        id: orderId,
        user_id: currentUser.id,
        email: currentUser.email,
        total, subtotal,
        delivery_charge: deliveryCharge,
        discount,
        payment_method: payment,
        status: "pending",
        shipping_address: finalAddr,
        items: cart,
        note,
        created_at: new Date().toISOString(),
        type: isBuyNowMode? "buy_now" : "cart"
      };
      const allOrders = JSON.parse(localStorage.getItem("baharaz_orders") || "[]");
      allOrders.unshift(orderPayload);
      localStorage.setItem("baharaz_orders", JSON.stringify(allOrders));
      localStorage.setItem("baharaz_last_order", JSON.stringify(orderPayload));

      try {
        await supabase.from("orders").insert([{
          id: orderId,
          user_id: currentUser.id,
          items: cart,
          total, subtotal,
          delivery_charge: deliveryCharge,
          coupon_discount: discount,
          payment_method: payment,
          status: "pending",
          shipping_address: finalAddr,
          phone: finalAddr.phone,
          district: finalAddr.district,
          division: finalAddr.division,
          upazila: finalAddr.upazila,
          full_address: finalAddr.full_address,
          postal_code: finalAddr.postal,
          country: finalAddr.country,
          customer_name: finalAddr.name,
          note
        }]);
      } catch {}

      if(!isBuyNowMode){
        localStorage.setItem("baharaz_cart", "[]");
        localStorage.removeItem("baharaz_checkout_items");
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        localStorage.removeItem("baharaz_buy_now");
      }

      showToast("Order Placed Successfully!");
      setTimeout(()=> router.push(`/order-success?orderId=${orderId}`), 900);
    } catch (e) {
      showToast("Failed: "+e.message);
    } finally { setPlacing(false); }
  };

  const currentDistrictList = newAddrForm.division ? (BD_DATA[newAddrForm.division] || []) : [];
  const currentUpazilaList = newAddrForm.district ? (BD_UPAZILAS[newAddrForm.district] || []) : (newAddrForm.division ? (BD_UPAZILAS[newAddrForm.division] || []) : []);

  if (checkingAuth) {
    return (
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"120px 20px 80px", textAlign:"center" }}>
        <div style={{ width:"40px", height:"40px", border:"4px solid #f85606", borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto", animation:"spin 1s linear infinite" }}></div>
        <p style={{ fontWeight:"900", fontSize:"12px", marginTop:"12px" }}>Loading...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (cart.length===0) {
    return (
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"120px 20px 60px", textAlign:"center" }}>
        <div style={{ fontSize:"60px" }}>🛒</div>
        <h1 style={{ fontWeight:"900", fontSize:"22px", marginTop:"12px" }}>Cart Empty</h1>
        <Link href="/" style={{ display:"inline-block", marginTop:"20px", background:"#f85606", color:"white", padding:"12px 24px", borderRadius:"8px", fontWeight:"900", textDecoration:"none" }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ background:"#f5f5f7", minHeight:"100vh", paddingBottom:"40px" }}>
      {toast? <div style={{ position:"fixed", bottom:"20px", left:"50%", transform:"translateX(-50%)", background:"black", color:"white", padding:"12px 20px", borderRadius:"30px", fontSize:"13px", fontWeight:"700", zIndex:9999 }}>{toast}</div> : null}
      
      <div style={{ background:"white", borderBottom:"1px solid #eee", padding:"14px 0", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"1250px", margin:"0 auto", padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Link href="/" style={{ fontWeight:"900", fontSize:"20px", color:"#f85606", textDecoration:"none" }}>Baharaz</Link>
          <div style={{ display:"flex", gap:"8px", fontSize:"12px", fontWeight:"700", alignItems:"center" }}>
            <span style={{ background:isBuyNowMode?"#222":"#f85606", color:"white", padding:"5px 12px", borderRadius:"20px" }}>{isBuyNowMode?"Buy Now":"Cart"}</span>
            <span>→</span>
            <span style={{ background:"black", color:"white", padding:"5px 12px", borderRadius:"20px" }}>Checkout</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1250px", margin:"20px auto 0", padding:"0 16px", display:"grid", gridTemplateColumns:"1.6fr 0.8fr", gap:"20px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          
          <div style={{ background:"white", borderRadius:"12px", padding:"20px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>Delivery Address</span>
              <button onClick={()=> setShowNewAddr(!showNewAddr)} style={{ fontSize:"12px", background:"#f5f5f5", border:"1px solid #ddd", padding:"6px 14px", borderRadius:"20px", fontWeight:"800", cursor:"pointer" }}>{showNewAddr? "Close" : "+ New Address"}</button>
            </h2>

            {addresses.length > 0 && (
              <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
                {addresses.map(addr=> (
                  <div key={addr.id} onClick={()=> setSelectedAddrId(addr.id)} style={{ border: selectedAddrId===addr.id? "2px solid #f85606" : "1px solid #eee", borderRadius:"10px", padding:"12px", cursor:"pointer", background: selectedAddrId===addr.id? "#fff8f3" : "white" }}>
                    <div style={{ display:"flex", gap:"10px" }}><input type="radio" checked={selectedAddrId===addr.id} readOnly /><div><p style={{ fontWeight:"800", fontSize:"13px" }}>{addr.name} - {addr.phone}</p><p style={{ fontSize:"12px", color:"#555" }}>{addr.full_address}, {addr.upazila}, {addr.district}, {addr.division} - {addr.postal} [{addr.country}]</p></div></div>
                  </div>
                ))}
              </div>
            )}

            {(showNewAddr || addresses.length===0) && (
              <div style={{ marginTop:"18px", background:"#fafafa", padding:"18px", borderRadius:"12px", border:"1px solid #e5e5e5" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <input value={newAddrForm.name} onChange={e=> setNewAddrForm({...newAddrForm, name:e.target.value})} placeholder="Full Name *" style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" }} />
                  <input value={newAddrForm.phone} onChange={e=> setNewAddrForm({...newAddrForm, phone:e.target.value.replace(/\D/g,"").slice(0,11)})} placeholder="Phone Number *" style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" }} />
                  <input value={newAddrForm.full_address} onChange={e=> setNewAddrForm({...newAddrForm, full_address:e.target.value})} placeholder="Full Address - House, Road, Area *" style={{ gridColumn:"1 / -1", padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" }} />
                  <select value={newAddrForm.division} onChange={e=> setNewAddrForm({...newAddrForm, division:e.target.value, district:"", upazila:""})} style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px", background:"white" }}>
                    <option value="">Select Division *</option>
                    {Object.keys(BD_DATA).map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={newAddrForm.district} onChange={e=> setNewAddrForm({...newAddrForm, district:e.target.value, upazila:""})} style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px", background:"white" }}>
                    <option value="">Select District *</option>
                    {currentDistrictList.map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={newAddrForm.upazila} onChange={e=> setNewAddrForm({...newAddrForm, upazila:e.target.value})} style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px", background:"white" }}>
                    <option value="">Select Upazila *</option>
                    {currentUpazilaList.map(u=> <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input value={newAddrForm.postal} onChange={e=> setNewAddrForm({...newAddrForm, postal:e.target.value})} placeholder="Postal Code *" style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" }} />
                  <select value={newAddrForm.country} onChange={e=> setNewAddrForm({...newAddrForm, country:e.target.value})} style={{ padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px", background:"white", gridColumn:"1 / -1" }}>
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
                }} style={{ marginTop:"14px", background:"#f85606", color:"white", padding:"12px", borderRadius:"8px", fontWeight:"800", fontSize:"14px", border:"none", cursor:"pointer", width:"100%" }}>Save Address</button>
              </div>
            )}
          </div>

          <div style={{ background:"white", borderRadius:"12px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px" }}>Delivery</h2>
            <div style={{ marginTop:"12px", display:"flex", gap:"12px", padding:"12px", border:"1px solid #eee", borderRadius:"10px" }}>
              <div style={{ width:"32px", height:"32px", background:"#f5f5f5", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center" }}>🚚</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}><p style={{ fontWeight:"800", fontSize:"13px" }}>Standard Delivery</p><p style={{ fontWeight:"900", fontSize:"13px" }}>৳{deliveryCharge || 0}</p></div>
                <p style={{ fontSize:"11px", color:"#666", marginTop:"2px" }}>Guaranteed by {deliveryDate}</p>
                <p style={{ fontSize:"11px", color:"#666" }}>Cash on Delivery Available</p>
              </div>
            </div>
          </div>

          <div style={{ background:"white", borderRadius:"12px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px" }}>Payment Method</h2>
            <div style={{ display:"grid", gap:"10px", marginTop:"12px" }}>
              <div onClick={()=> setPayment("cod")} style={{ border: payment==="cod"? "2px solid #f85606" : "1px solid #eee", background: payment==="cod"? "#fff8f3" : "white", padding:"14px", borderRadius:"10px", cursor:"pointer", display:"flex", justifyContent:"space-between" }}><div><p style={{ fontWeight:"800" }}>Cash on Delivery</p><p style={{ fontSize:"11px", color:"#666" }}>Pay when you receive the product</p></div><span>{payment==="cod"? "●" : "○"}</span></div>
              <div onClick={()=> setPayment("bkash")} style={{ border: payment==="bkash"? "2px solid #e2136e" : "1px solid #eee", background: payment==="bkash"? "#fff0f6" : "white", padding:"14px", borderRadius:"10px", cursor:"pointer", display:"flex", justifyContent:"space-between" }}><p style={{ fontWeight:"800" }}>bKash / Nagad</p><span>{payment==="bkash"? "●" : "○"}</span></div>
            </div>
            <textarea value={note} onChange={e=> setNote(e.target.value)} placeholder="Order Note (Optional)" style={{ width:"100%", marginTop:"14px", padding:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" }} rows={2}></textarea>
          </div>
        </div>

        <div style={{ position:"sticky", top:"80px", height:"fit-content" }}>
          <div style={{ background:"white", borderRadius:"12px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"15px" }}>Order Summary - {cart.length} Items</h2>
            <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"10px", maxHeight:"320px", overflowY:"auto" }}>
              {cart.map((item, idx)=> (
                <div key={idx} style={{ display:"flex", gap:"10px", borderBottom:"1px solid #f5f5f5", paddingBottom:"10px" }}>
                  <img src={item.image || item.image_url || "https://via.placeholder.com/60"} alt="" style={{ width:"50px", height:"50px", borderRadius:"8px", border:"1px solid #eee", objectFit:"contain" }} />
                  <div style={{ flex:1 }}><p style={{ fontSize:"12px", fontWeight:"700" }}>{item.name || item.title}</p><p style={{ fontSize:"11px", color:"#666" }}>Qty {item.qty||item.quantity||1} × ৳{item.price}</p></div>
                  <p style={{ fontWeight:"900", fontSize:"12px" }}>৳{(Number(item.price||0)*(Number(item.qty||item.quantity||1))).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"14px", display:"flex", gap:"8px" }}><input value={coupon} onChange={e=> setCoupon(e.target.value)} placeholder="Coupon BAHARAZ10" style={{ flex:1, padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }} /><button onClick={applyCoupon} style={{ background:"black", color:"white", padding:"10px 16px", borderRadius:"8px", fontSize:"11px", fontWeight:"900", border:"none", cursor:"pointer" }}>Apply</button></div>
            <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"8px", fontSize:"13px" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span>Subtotal</span><span>৳{subtotal.toFixed(0)}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span>Delivery</span><span>৳{deliveryCharge}</span></div>
              {discount>0 && <div style={{ display:"flex", justifyContent:"space-between", color:"#16a34a" }}><span>Discount</span><span>-৳{discount}</span></div>}
              <div style={{ height:"1px", background:"#eee" }}></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"17px", fontWeight:"900" }}><span>Total</span><span style={{ color:"#f85606" }}>৳{total.toFixed(0)}</span></div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing} style={{ width:"100%", marginTop:"16px", background: placing? "#ccc" : "#f85606", color:"white", padding:"14px", borderRadius:"10px", fontWeight:"900", fontSize:"15px", border:"none", cursor:"pointer" }}>{placing? "Placing..." : `Place Order - ৳${total.toFixed(0)}`}</button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div style={{ position:"fixed", inset:0, zIndex:999999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
          <div style={{ width:"100%", maxWidth:"360px", background:"white", borderRadius:"16px", padding:"24px", textAlign:"center", position:"relative" }}>
            <h3 style={{ fontWeight:"900", fontSize:"18px" }}>Please Login</h3>
            <p style={{ fontSize:"13px", marginTop:"8px" }}>You need to login to place order</p>
            <div style={{ marginTop:"16px", display:"grid", gap:"10px" }}>
              <Link href="/login?next=/checkout" style={{ background:"#f85606", color:"white", padding:"12px", borderRadius:"999px", fontWeight:"900", textAlign:"center", textDecoration:"none" }}>Login with Gmail</Link>
              <Link href="/login?next=/checkout" style={{ background:"black", color:"white", padding:"12px", borderRadius:"999px", fontWeight:"900", textAlign:"center", textDecoration:"none" }}>Login with Number</Link>
            </div>
            <button onClick={()=> setShowLoginModal(false)} style={{ position:"absolute", top:"10px", right:"10px", width:"28px", height:"28px", background:"#f5f5f5", borderRadius:"50%", border:"none", cursor:"pointer" }}>✕</button>
          </div>
        </div>
      )}

      <style>{`@media(max-width:900px){div[style*="grid-template-columns:1.6fr 0.8fr"]{grid-template-columns:1fr!important} div[style*="position:sticky"]{position:static!important}}`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900" }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}