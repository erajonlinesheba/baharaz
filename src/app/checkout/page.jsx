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

const ALL_DISTRICTS = Object.values(BD_DATA).flat();

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
  const [newAddrForm, setNewAddrForm] = useState({ label:"Home", phone:"", full_address:"", division:"Rajshahi", district:"Rajshahi", upazila:"Boalia", postal:"6000" });
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(""), 3500); };

  useEffect(() => {
    const initCheckout = async () => {
      setCheckingAuth(true);
      try {
        // ===== LOGIN CHECK - স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ =====
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (!currentUser) {
          setShowLoginModal(true);
          showToast("স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏");
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

        const savedAddrs = localStorage.getItem("eraj_addresses");
        if (savedAddrs) {
          const addrs = JSON.parse(savedAddrs);
          if (Array.isArray(addrs)) {
            setAddresses(addrs);
            const defRaw = localStorage.getItem("eraj_default_address");
            if (defRaw) {
              const d = JSON.parse(defRaw);
              if (d && d.id) setSelectedAddrId(d.id);
            } else if (addrs.length>0) {
              setSelectedAddrId(addrs[0].id);
            }
          }
        }

        // Auto fill phone from user if available
        if (currentUser) {
          setNewAddrForm(prev => ({
            ...prev,
            phone: currentUser.phone || prev.phone,
            label: currentUser.user_metadata?.full_name || prev.label
          }));
        }

      } catch (e) { console.log(e); }
      setCheckingAuth(false);
    };
    initCheckout();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setShowLoginModal(false);
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setShowLoginModal(true);
        showToast("স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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
    if (dist === "Rajshahi" && div === "Rajshahi") return 55;
    if (div === "Rajshahi") return 70;
    if (div === "Dhaka" && dist === "Dhaka") return 60;
    if (div === "Dhaka") return 80;
    if (div === "Chattogram" || div === "Khulna" || div === "Sylhet") return 100;
    return 120;
  }, [selectedAddrId, addresses, newAddrForm, isBuyNowMode]);

  const finalDelivery = deliveryCharge;
  const total = subtotal + finalDelivery - discount;

  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toLocaleDateString("en-BD", { day: "2-digit", month: "short" });
  }, []);

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c==="E-RAJ10") { setDiscount(Math.round(subtotal*0.10)); showToast("✅ 10% OFF Applied"); }
    else if (c==="FREEDEL") { setDiscount(finalDelivery); showToast("✅ Free Delivery Applied"); }
    else { setDiscount(0); showToast("❌ Invalid Coupon"); }
  };

  const handlePlaceOrder = async () => {
    // ===== MUST LOGIN CHECK - স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ =====
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user || null;
    
    if (!currentUser) {
      setUser(null);
      setShowLoginModal(true);
      showToast("স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏");
      setTimeout(() => {
        router.push("/login?next=/checkout");
      }, 1200);
      return;
    }

    if (cart.length===0) { showToast("❌ Cart Empty"); return; }
    const selectedAddress = addresses.find(a=> a.id===selectedAddrId);
    const finalAddr = selectedAddress || newAddrForm;
    if (!finalAddr?.phone ||!finalAddr?.full_address) { showToast("❌ Select Address"); setShowNewAddr(true); return; }
    if (finalAddr.phone.length<11) { showToast("❌ Valid Phone দিন"); return; }
    setPlacing(true);
    try {
      const orderId = `ERAJ-${Date.now()}`;
      const orderPayload = {
        id: orderId,
        orderId: orderId,
        fullId: orderId,
        user_id: currentUser.id,
        email: currentUser.email,
        total, subtotal,
        delivery_charge: finalDelivery,
        discount,
        payment_method: payment,
        status: "pending",
        shipping_address: finalAddr,
        items: cart,
        note,
        created_at: new Date().toISOString(),
        date: new Date().toISOString(),
        type: isBuyNowMode? "buy_now" : "cart"
      };
      localStorage.setItem("eraj_last_order", JSON.stringify(orderPayload));
      const allOrders = JSON.parse(localStorage.getItem("eraj_all_orders") || "[]");
      allOrders.unshift(orderPayload);
      localStorage.setItem("eraj_all_orders", JSON.stringify(allOrders));
      const baharazOrders = JSON.parse(localStorage.getItem("baharaz_orders") || "[]");
      baharazOrders.unshift({ id: orderId, orderId, fullId: orderId, user_id: currentUser.id, email: currentUser.email, items: cart, total, subtotal, delivery_charge: finalDelivery, deliveryCharge: finalDelivery, status: "Pending", date: new Date().toISOString(), payment, address: finalAddr });
      localStorage.setItem("baharaz_orders", JSON.stringify(baharazOrders));

      try {
        const { error } = await supabase.from("orders").insert([{
          id: orderId,
          user_id: currentUser.id,
          items: cart,
          total: total,
          total_amount: total,
          subtotal: subtotal,
          delivery_charge: finalDelivery,
          coupon_discount: discount,
          payment_method: payment,
          status: "pending",
          shipping_address: finalAddr,
          phone: finalAddr.phone,
          district: finalAddr.district,
          division: finalAddr.division,
          upazila: finalAddr.upazila,
          full_address: finalAddr.full_address,
          note: note
        }]);
        if(error) console.log("Supabase Error:", error.message);
      } catch (err) { console.log("Insert Failed:", err); }

      const clearAllCartsCompletely = () => {
        const allCartKeys = [
          "baharaz_cart",
          "cart",
          "eRajCart",
          "baharaz_cart_items",
          "baharaz_checkout_items",
          "baharaz_checkout_summary",
          "baharaz_checkout_type",
          "baharaz_buy_now_type"
        ];
        allCartKeys.forEach(k => {
          localStorage.removeItem(k);
          localStorage.setItem(k, "[]");
        });
        localStorage.setItem("baharaz_cart", "[]");
        localStorage.setItem("cart", "[]");
        localStorage.setItem("eRajCart", "[]");
        localStorage.setItem("baharaz_cart_items", "[]");
        localStorage.removeItem("baharaz_checkout_items");
        localStorage.removeItem("baharaz_checkout_summary");
        localStorage.removeItem("baharaz_checkout_type");
        localStorage.removeItem("baharaz_buy_now_type");
        
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cart-cleared'));
      };

      if(isBuyNowMode){
        localStorage.removeItem("baharaz_buy_now");
        localStorage.removeItem("baharaz_checkout_type");
        localStorage.removeItem("baharaz_checkout_items");
        localStorage.removeItem("baharaz_checkout_summary");
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        clearAllCartsCompletely();
      }

      showToast("✅ Order Placed! ধন্যবাদ স্যার!");
      setTimeout(()=> router.push(`/order-success?orderId=${orderId}`), 900);
    } catch (e) {
      console.log(e);
      showToast("❌ Failed: "+e.message);
    } finally { setPlacing(false); }
  };

  const currentDistrictList = BD_DATA[newAddrForm.division] || ALL_DISTRICTS;
  const upazilaList = BD_UPAZILAS[newAddrForm.district] || BD_UPAZILAS[newAddrForm.division] || ["Boalia"];

  if (checkingAuth) {
    return (
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"180px 20px 80px", textAlign:"center" }}>
        <div style={{ width:"40px", height:"40px", border:"4px solid #f85606", borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto", animation:"spin 1s linear infinite" }}></div>
        <p style={{ fontWeight:"900", fontSize:"12px", marginTop:"12px" }}>Checking Login... স্যার দয়া করে অপেক্ষা করুন</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (cart.length===0) {
    return (
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"180px 20px 60px", textAlign:"center" }}>
        <div style={{ fontSize:"60px" }}>🛒</div>
        <h1 style={{ fontWeight:"900", fontSize:"22px", marginTop:"12px" }}>Cart Empty</h1>
        <Link href="/" style={{ display:"inline-block", marginTop:"20px", background:"#f85606", color:"white", padding:"12px 24px", borderRadius:"8px", fontWeight:"900", textDecoration:"none" }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ background:"#f5f5f5", minHeight:"100vh", paddingBottom:"40px", paddingTop:"110px" }}>
      {toast? <div style={{ position:"fixed", bottom:"20px", left:"50%", transform:"translateX(-50%)", background:"black", color:"white", padding:"12px 20px", borderRadius:"30px", fontSize:"13px", fontWeight:"700", zIndex:9999, textAlign:"center", maxWidth:"90%" }}>{toast}</div> : null}
      <div style={{ background:"white", borderBottom:"1px solid #eee", padding:"14px 0", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"1250px", margin:"0 auto", padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Link href="/" style={{ fontWeight:"900", fontSize:"18px", color:"#f85606", textDecoration:"none" }}>E-RAJ</Link>
          <div style={{ display:"flex", gap:"8px", fontSize:"12px", fontWeight:"700", alignItems:"center" }}>
            <span style={{ background:isBuyNowMode?"#222":"#f85606", color:"white", padding:"4px 10px", borderRadius:"20px" }}>{isBuyNowMode?"Buy Now":"Cart"}</span>
            <span>→</span>
            <span style={{ background:"black", color:"white", padding:"4px 10px", borderRadius:"20px" }}>Checkout</span>
            {user && <span style={{ background:"#dcfce7", color:"#16a34a", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", border:"1px solid #bbf7d0" }}>✓ {user.email?.slice(0,15)}...</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1250px", margin:"0 auto", padding:"20px 16px", display:"grid", gridTemplateColumns:"1.6fr 0.8fr", gap:"20px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          <div style={{ background:"white", borderRadius:"14px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}><span>Delivery Address {isBuyNowMode && <span style={{background:"#ff1a00", color:"white", fontSize:"10px", padding:"2px 8px", borderRadius:"10px", marginLeft:"8px"}}>BUY NOW</span>}</span><button onClick={()=> setShowNewAddr(!showNewAddr)} style={{ fontSize:"11px", background:"#f5f5f5", border:"1px solid #ddd", padding:"5px 12px", borderRadius:"20px", fontWeight:"800", cursor:"pointer" }}>{showNewAddr? "Close" : "+ New"}</button></h2>
            {addresses.map(addr=> (
              <div key={addr.id} onClick={()=> setSelectedAddrId(addr.id)} style={{ border: selectedAddrId===addr.id? "2px solid #f85606" : "1px solid #eee", borderRadius:"12px", padding:"12px", cursor:"pointer", background: selectedAddrId===addr.id? "#fff8f3" : "white", marginTop:"10px" }}>
                <div style={{ display:"flex", gap:"10px" }}><input type="radio" checked={selectedAddrId===addr.id} readOnly /><div style={{ flex:1 }}><p style={{ fontWeight:"900", fontSize:"13px" }}>{addr.label} - {addr.phone}</p><p style={{ fontSize:"12px", marginTop:"4px" }}>{addr.full_address}, {addr.upazila}, {addr.district}</p></div></div>
              </div>
            ))}
            {(showNewAddr || addresses.length===0) && (
              <div style={{ marginTop:"16px", background:"#fafafa", padding:"16px", borderRadius:"12px", border:"1px dashed #ddd" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  <select value={newAddrForm.label} onChange={e=> setNewAddrForm({...newAddrForm, label:e.target.value})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }}><option>Home</option><option>Office</option></select>
                  <input value={newAddrForm.phone} onChange={e=> setNewAddrForm({...newAddrForm, phone:e.target.value.replace(/\D/g,"").slice(0,11)})} placeholder="Phone 11 Digit" style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }} />
                  <input value={newAddrForm.full_address} onChange={e=> setNewAddrForm({...newAddrForm, full_address:e.target.value})} placeholder="Full Address" style={{ gridColumn:"1 / -1", padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }} />
                  <select value={newAddrForm.division} onChange={e=> { const div=e.target.value; const d=BD_DATA[div]?.[0]||"Rajshahi"; setNewAddrForm({...newAddrForm, division:div, district:d}); }} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }}>{Object.keys(BD_DATA).map(d=> <option key={d} value={d}>{d}</option>)}</select>
                  <select value={newAddrForm.district} onChange={e=> setNewAddrForm({...newAddrForm, district:e.target.value})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }}>{currentDistrictList.map(d=> <option key={d} value={d}>{d}</option>)}</select>
                  <select value={newAddrForm.upazila} onChange={e=> setNewAddrForm({...newAddrForm, upazila:e.target.value})} style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }}>{upazilaList.map(u=> <option key={u} value={u}>{u}</option>)}</select>
                  <input value={newAddrForm.postal} onChange={e=> setNewAddrForm({...newAddrForm, postal:e.target.value})} placeholder="Postal" style={{ padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }} />
                </div>
                <button onClick={()=> { const id=`addr_${Date.now()}`; const newAddr={ id, label:newAddrForm.label, phone:newAddrForm.phone, full_address:newAddrForm.full_address, district:newAddrForm.district, division:newAddrForm.division, upazila:newAddrForm.upazila, postal_code:newAddrForm.postal, is_default: true }; const updated=[newAddr,...addresses]; setAddresses(updated); localStorage.setItem("eraj_addresses", JSON.stringify(updated)); setSelectedAddrId(id); setShowNewAddr(false); }} style={{ marginTop:"10px", background:"#f85606", color:"white", padding:"10px 16px", borderRadius:"8px", fontWeight:"800", fontSize:"12px", border:"none", cursor:"pointer" }}>Save Address</button>
              </div>
            )}
          </div>

          <div style={{ background:"white", borderRadius:"14px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px" }}>Delivery {isBuyNowMode && "- Buy Now Order"}</h2>
            <div style={{ marginTop:"12px", display:"flex", gap:"12px", padding:"12px", border:"1px solid #eee", borderRadius:"10px" }}>
              <div style={{ width:"32px", height:"32px", background:"#f5f5f5", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center" }}>🚚</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}><p style={{ fontWeight:"800", fontSize:"13px" }}>Standard Delivery</p><p style={{ fontWeight:"900", fontSize:"13px" }}>৳{deliveryCharge}</p></div>
                <p style={{ fontSize:"11px", color:"#666", marginTop:"2px" }}>Guaranteed by {deliveryDate} - {isBuyNowMode? "Buy Now" : "Cart"} Order</p>
                <p style={{ fontSize:"11px", color:"#666" }}>Cash on Delivery Available</p>
              </div>
            </div>
          </div>

          <div style={{ background:"white", borderRadius:"14px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px" }}>Payment</h2>
            <div style={{ display:"grid", gap:"10px", marginTop:"12px" }}>
              <div onClick={()=> setPayment("cod")} style={{ border: payment==="cod"? "2px solid #f85606" : "1px solid #eee", background: payment==="cod"? "#fff8f3" : "white", padding:"12px", borderRadius:"10px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}><div><p style={{ fontWeight:"800", fontSize:"13px" }}>Cash on Delivery</p><p style={{ fontSize:"11px", color:"#666" }}>Pay on delivery</p></div><span>{payment==="cod"? "●" : "○"}</span></div>
              <div onClick={()=> setPayment("bkash")} style={{ border: payment==="bkash"? "2px solid #e2136e" : "1px solid #eee", background: payment==="bkash"? "#fff0f6" : "white", padding:"12px", borderRadius:"10px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}><p style={{ fontWeight:"800", fontSize:"13px" }}>bKash</p><span>{payment==="bkash"? "●" : "○"}</span></div>
            </div>
            <textarea value={note} onChange={e=> setNote(e.target.value)} placeholder="Order Note (Optional)" style={{ width:"100%", marginTop:"12px", padding:"10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px", fontFamily:"inherit" }} rows={2}></textarea>
          </div>
        </div>

        <div style={{ position:"sticky", top:"80px", height:"fit-content" }}>
          <div style={{ background:"white", borderRadius:"14px", padding:"18px", border:"1px solid #eee" }}>
            <h2 style={{ fontWeight:"900", fontSize:"14px" }}>Order Summary - {cart.length} Items {isBuyNowMode && <span style={{fontSize:"10px", background:"#000", color:"#fff", padding:"2px 6px", borderRadius:"10px", marginLeft:"6px"}}>BUY NOW</span>}</h2>
            <div style={{ marginTop:"12px", display:"flex", flexDirection:"column", gap:"10px", maxHeight:"320px", overflowY:"auto" }}>
              {cart.map((item, idx)=> (
                <div key={idx} style={{ display:"flex", gap:"10px", borderBottom:"1px solid #f5f5f5", paddingBottom:"10px" }}>
                  <img src={item.image || item.image_url || "https://via.placeholder.com/60"} alt="" style={{ width:"50px", height:"50px", borderRadius:"8px", border:"1px solid #eee", objectFit:"contain" }} />
                  <div style={{ flex:1 }}><p style={{ fontSize:"12px", fontWeight:"700", lineHeight:"14px" }}>{item.name || item.title}</p><p style={{ fontSize:"11px", color:"#666" }}>Qty {item.qty||item.quantity||1} × ৳{item.price} {item.color? `| ${item.color}`:""}</p></div>
                  <p style={{ fontWeight:"900", fontSize:"12px" }}>৳{(Number(item.price||0)*(Number(item.qty||item.quantity||1))).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"14px", display:"flex", gap:"8px" }}><input value={coupon} onChange={e=> setCoupon(e.target.value)} placeholder="Coupon E-RAJ10" style={{ flex:1, padding:"9px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"12px" }} /><button onClick={applyCoupon} style={{ background:"black", color:"white", padding:"9px 14px", borderRadius:"8px", fontSize:"11px", fontWeight:"900", border:"none", cursor:"pointer" }}>Apply</button></div>
            <div style={{ marginTop:"14px", display:"flex", flexDirection:"column", gap:"8px", fontSize:"13px" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"#666" }}>Subtotal ({cart.length})</span><span style={{ fontWeight:"700" }}>৳{subtotal.toFixed(0)}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"#666" }}>Delivery</span><span style={{ fontWeight:"700" }}>৳{finalDelivery}</span></div>
              {discount>0? <div style={{ display:"flex", justifyContent:"space-between", color:"#16a34a" }}><span>Discount</span><span>-৳{discount}</span></div> : null}
              <div style={{ height:"1px", background:"#eee", margin:"6px 0" }}></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"16px", fontWeight:"900" }}><span>Total</span><span style={{ color:"#f85606" }}>৳{total.toFixed(0)}</span></div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing} style={{ width:"100%", marginTop:"16px", background: placing? "#ccc" : "#f85606", color:"white", padding:"14px", borderRadius:"12px", fontWeight:"900", fontSize:"14px", border:"none", cursor:"pointer" }}>{placing? "Placing..." : `Place Order - ৳${total.toFixed(0)} ${isBuyNowMode?"(Buy Now)":""}`}</button>
            <p style={{fontSize:"10px", textAlign:"center", marginTop:"8px", color:"#888"}}>{isBuyNowMode? "Buy Now Order - Cart will remain" : "Cart Order - Cart will clear after order"}</p>
            {!user && <p style={{fontSize:"11px", textAlign:"center", marginTop:"8px", color:"#dc2626", fontWeight:"800"}}>⚠️ স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ</p>}
          </div>
        </div>
      </div>

      {/* ===== LOGIN MODAL - স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ - THIK KORE NICHE NAMANO ===== */}
      {showLoginModal && (
        <div style={{ position:"fixed", left:0, right:0, top:0, bottom:0, zIndex:2147483647, backgroundColor:"rgba(0,0,0,0.65)", backdropFilter:"blur(12px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"16px", paddingTop:"150px" }}>
          <div style={{ width:"100%", maxWidth:"380px", backgroundColor:"white", borderRadius:"20px", padding:"24px", boxShadow:"0 30px 90px rgba(0,0,0,0.5)", textAlign:"center", position:"relative" }}>
            <div style={{ width:"64px", height:"64px", background:"#fff3e6", border:"2px solid #ffddc2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <span style={{ fontSize:"28px" }}>🔒</span>
            </div>
            <h3 style={{ fontSize:"18px", fontWeight:"900" }}>স্যার দয়া করে লগইন করুন</h3>
            <p style={{ fontSize:"14px", color:"#333", marginTop:"12px", lineHeight:"1.6", fontWeight:"700" }}>
              স্যার দয়া করে নাম্বার অথবা Gmail দিয়ে লগইন করুন ধন্যবাদ 🙏
            </p>
            <p style={{ fontSize:"11px", color:"#666", marginTop:"8px" }}>অর্ডার করার জন্য লগইন বাধ্যতামূলক। আপনার অর্ডার সুরক্ষিত থাকবে।</p>
            <div style={{ marginTop:"20px", display:"grid", gap:"10px" }}>
              <Link href="/login?next=/checkout" style={{ width:"100%", background:"#f85606", color:"white", padding:"12px", borderRadius:"999px", fontWeight:"900", fontSize:"13px", textAlign:"center", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                📧 Gmail দিয়ে লগইন করুন
              </Link>
              <Link href="/login?next=/checkout" style={{ width:"100%", background:"black", color:"white", padding:"12px", borderRadius:"999px", fontWeight:"900", fontSize:"13px", textAlign:"center", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                📱 নাম্বার দিয়ে লগইন করুন
              </Link>
              <Link href="/" style={{ width:"100%", background:"#f5f5f5", border:"1px solid #ddd", color:"black", padding:"10px", borderRadius:"999px", fontWeight:"800", fontSize:"11px", textAlign:"center", textDecoration:"none" }}>
                হোমে ফিরে যান
              </Link>
            </div>
            <button onClick={()=> setShowLoginModal(false)} style={{ position:"absolute", top:"12px", right:"12px", width:"32px", height:"32px", background:"#f5f5f5", borderRadius:"50%", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>✕</button>
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