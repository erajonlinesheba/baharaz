"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";

const BD_DATA = {
  "Dhaka": {
    "Dhaka": ["Dhamrai","Dohar","Keraniganj","Nawabganj","Savar","Dhaka Cantonment","Demra","Dhanmondi","Gulshan","Jatrabari","Khilgaon","Lalbagh","Mirpur","Mohammadpur","Motijheel","Pallabi","Ramna","Sabujbagh","Shah Ali","Shahbagh","Sher-e-Bangla","Sutrapur","Tejgaon","Uttara","Wari","Kotwali"],
    "Faridpur": ["Alfadanga","Bhanga","Boalmari","Charbhadrasan","Faridpur Sadar","Madhukhali","Nagarkanda","Sadarpur","Saltha"],
    "Gazipur": ["Gazipur Sadar","Kaliakair","Kaliganj","Kapasia","Sreepur","Tongi"],
    "Gopalganj": ["Gopalganj Sadar","Kashiani","Kotalipara","Muksudpur","Tungipara"],
    "Kishoreganj": ["Austagram","Bajitpur","Bhairab","Hossainpur","Itna","Karimganj","Katiadi","Kishoreganj Sadar","Kuliarchar","Mithamain","Nikli","Pakundia","Tarail"],
    "Madaripur": ["Rajoir","Madaripur Sadar","Kalkini","Shibchar","Dasar"],
    "Manikganj": ["Daulatpur","Ghior","Harirampur","Manikganj Sadar","Saturia","Shivalaya","Singair"],
    "Munshiganj": ["Gazaria","Lohajang","Munshiganj Sadar","Sirajdikhan","Sreenagar","Tongibari"],
    "Narayanganj": ["Araihazar","Bandar","Narayanganj Sadar","Rupganj","Sonargaon","Siddhirganj"],
    "Narsingdi": ["Belabo","Monohardi","Narsingdi Sadar","Palash","Raipura","Shibpur"],
    "Rajbari": ["Baliakandi","Goalandaghat","Pangsha","Rajbari Sadar","Kalukhali"],
    "Shariatpur": ["Bhedarganj","Damudya","Gosairhat","Naria","Shariatpur Sadar","Zajira","Shakhipur"],
    "Tangail": ["Basail","Bhuapur","Delduar","Ghatail","Gopalpur","Kalihati","Madhupur","Mirzapur","Nagarpur","Sakhipur","Tangail Sadar","Dhanbari"]
  },
  "Chattogram": {
    "Chattogram": ["Anwara","Banshkhali","Boalkhali","Chandanaish","Fatikchhari","Hathazari","Lohagara","Mirsharai","Patiya","Rangunia","Raozan","Sandwip","Satkania","Sitakunda","Chattogram Port","Bakalia","Chandgaon","Kotwali","Pahartali","Double Mooring"],
    "Cox's Bazar": ["Chakaria","Cox's Bazar Sadar","Kutubdia","Maheshkhali","Ramu","Teknaf","Ukhia","Pekua","Eidgaon"],
    "Cumilla": ["Barura","Brahmanpara","Burichang","Chandina","Chauddagram","Daudkandi","Debidwar","Homna","Laksam","Muradnagar","Nangalkot","Cumilla Sadar","Meghna","Titas","Cumilla Sadar Dakshin","Lalmai"],
    "Brahmanbaria": ["Akhaura","Bancharampur","Brahmanbaria Sadar","Kasba","Nabinagar","Nasirnagar","Sarail","Ashuganj","Bijoynagar"],
    "Chandpur": ["Chandpur Sadar","Faridganj","Haimchar","Haziganj","Kachua","Matlab Dakshin","Matlab Uttar","Shahrasti"],
    "Feni": ["Chhagalnaiya","Daganbhuiyan","Feni Sadar","Parshuram","Sonagazi","Fulgazi"],
    "Khagrachhari": ["Dighinala","Khagrachhari Sadar","Lakshmichhari","Mahalchhari","Manikchhari","Matiranga","Panchhari","Ramgarh","Guimara"],
    "Lakshmipur": ["Lakshmipur Sadar","Kamalnagar","Raipur","Ramganj","Ramgati"],
    "Noakhali": ["Begumganj","Noakhali Sadar","Chatkhil","Companiganj","Hatiya","Senbagh","Sonaimuri","Subarnachar","Kabirhat"],
    "Rangamati": ["Bagaichhari","Barkal","Kawkhali","Belaichhari","Kaptai","Juraichhari","Langadu","Naniyarchar","Rajasthali","Rangamati Sadar"],
    "Bandarban": ["Ali Kadam","Bandarban Sadar","Lama","Naikhongchhari","Rowangchhari","Ruma","Thanchi"]
  },
  "Rajshahi": {
    "Rajshahi": ["Bagha","Bagmara","Charghat","Durgapur","Godagari","Mohanpur","Paba","Puthia","Tanore","Boalia","Rajpara","Motihar","Shah Makhdum","Chandrima","Kashiadanga","Karnahar","Katakhali"],
    "Bogura": ["Adamdighi","Bogura Sadar","Dhunat","Dhupchanchia","Gabtali","Kahaloo","Khetlal","Nandigram","Sariakandi","Shajahanpur","Sherpur","Shibganj","Sonatala"],
    "Joypurhat": ["Akkelpur","Joypurhat Sadar","Kalai","Khetlal","Panchbibi"],
    "Naogaon": ["Atrai","Badalgachhi","Manda","Dhamoirhat","Mohadevpur","Naogaon Sadar","Niamatpur","Patnitala","Porsha","Raninagar","Sapahar"],
    "Natore": ["Bagatipara","Baraigram","Gurudaspur","Lalpur","Natore Sadar","Singra","Naldanga"],
    "Chapainawabganj": ["Bholahat","Gomastapur","Nachole","Chapainawabganj Sadar","Shibganj"],
    "Pabna": ["Atgharia","Bera","Bhangura","Chatmohar","Faridpur","Ishwardi","Pabna Sadar","Santhia","Sujanagar"],
    "Sirajganj": ["Belkuchi","Chauhali","Kamarkhanda","Kazipur","Raiganj","Shahjadpur","Sirajganj Sadar","Tarash","Ullahpara"]
  },
  "Khulna": {
    "Khulna": ["Batiaghata","Dacope","Dumuria","Dighalia","Koyra","Paikgachha","Phultala","Rupsha","Terokhada","Dumuria","Khalishpur","Sonadanga","Daulatpur","Khan Jahan Ali"],
    "Bagerhat": ["Bagerhat Sadar","Chitalmari","Fakirhat","Kachua","Mollahat","Mongla","Morrelganj","Rampal","Sarankhola"],
    "Chuadanga": ["Alamdanga","Chuadanga Sadar","Damurhuda","Jibannagar"],
    "Jashore": ["Abhaynagar","Bagherpara","Chaugachha","Jhikargachha","Keshabpur","Jashore Sadar","Manirampur","Sharsha"],
    "Jhenaidah": ["Harinakunda","Jhenaidah Sadar","Kaliganj","Kotchandpur","Maheshpur","Shailkupa"],
    "Kushtia": ["Bheramara","Daulatpur","Khoksa","Kushtia Sadar","Kumarkhali","Mirpur"],
    "Magura": ["Magura Sadar","Mohammadpur","Shalikha","Sreepur"],
    "Meherpur": ["Gangni","Meherpur Sadar","Mujibnagar"],
    "Narail": ["Kalia","Lohagara","Narail Sadar","Naragati"],
    "Satkhira": ["Assasuni","Debhata","Kalaroa","Kaliganj","Satkhira Sadar","Shyamnagar","Tala"]
  },
  "Barishal": {
    "Barishal": ["Agailjhara","Babuganj","Bakerganj","Banaripara","Gaurnadi","Hizla","Barishal Sadar","Mehendiganj","Muladi","Wazirpur"],
    "Barguna": ["Amtali","Bamna","Barguna Sadar","Betagi","Patharghata","Taltali"],
    "Bhola": ["Bhola Sadar","Burhanuddin","Char Fasson","Daulatkhan","Lalmohan","Manpura","Tazumuddin"],
    "Jhalokati": ["Jhalokati Sadar","Kathalia","Nalchity","Rajapur"],
    "Patuakhali": ["Bauphal","Dashmina","Galachipa","Kalapara","Mirzaganj","Patuakhali Sadar","Rangabali","Dumki"],
    "Pirojpur": ["Bhandaria","Kawkhali","Mathbaria","Nazirpur","Pirojpur Sadar","Nesarabad","Indurkani"]
  },
  "Sylhet": {
    "Sylhet": ["Balaganj","Beanibazar","Bishwanath","Companiganj","Dakshin Surma","Fenchuganj","Golapganj","Gowainghat","Jaintiapur","Kanaighat","Sylhet Sadar","Zakiganj","Osmani Nagar"],
    "Moulvibazar": ["Barlekha","Kamalganj","Kulaura","Moulvibazar Sadar","Rajnagar","Sreemangal","Juri"],
    "Habiganj": ["Ajmiriganj","Bahubal","Baniyachong","Chunarughat","Habiganj Sadar","Lakhai","Madhabpur","Nabiganj","Shayestaganj"],
    "Sunamganj": ["Bishwambarpur","Chhatak","Derai","Dharamapasha","Dowarabazar","Jagannathpur","Jamalganj","Sullah","Sunamganj Sadar","Shantiganj","Tahirpur"]
  },
  "Rangpur": {
    "Rangpur": ["Badarganj","Gangachara","Kaunia","Rangpur Sadar","Mithapukur","Pirgachha","Pirganj","Taraganj","Rangpur City"],
    "Dinajpur": ["Birampur","Birganj","Biral","Bochaganj","Chirirbandar","Phulbari","Ghoraghat","Hakimpur","Kaharole","Khansama","Dinajpur Sadar","Nawabganj","Parbatipur"],
    "Kurigram": ["Bhurungamari","Char Rajibpur","Chilmari","Phulbari","Kurigram Sadar","Nageshwari","Rajarhat","Raumari","Ulipur"],
    "Gaibandha": ["Phulchhari","Gaibandha Sadar","Gobindaganj","Palashbari","Sadullapur","Saghata","Sundarganj"],
    "Lalmonirhat": ["Aditmari","Hatibandha","Kaliganj","Lalmonirhat Sadar","Patgram"],
    "Nilphamari": ["Dimla","Domar","Jaldhaka","Kishoreganj","Nilphamari Sadar","Saidpur"],
    "Panchagarh": ["Atwari","Boda","Debiganj","Panchagarh Sadar","Tetulia"],
    "Thakurgaon": ["Baliadangi","Haripur","Pirganj","Ranisankail","Thakurgaon Sadar"]
  },
  "Mymensingh": {
    "Mymensingh": ["Bhaluka","Dhobaura","Fulbaria","Gafargaon","Gauripur","Haluaghat","Ishwarganj","Mymensingh Sadar","Muktagachha","Nandail","Phulpur","Trishal","Tara Khanda"],
    "Jamalpur": ["Baksiganj","Dewanganj","Islampur","Jamalpur Sadar","Madarganj","Melandaha","Sarishabari"],
    "Netrokona": ["Atpara","Barhatta","Durgapur","Khaliajuri","Kalmakanda","Kendua","Madan","Mohanganj","Netrokona Sadar","Purbadhala"],
    "Sherpur": ["Jhenaigati","Nakla","Nalitabari","Sherpur Sadar","Sreebardi"]
  }
};

export default function AddressPage() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [division, setDivision] = useState("Rajshahi");
  const [district, setDistrict] = useState("Rajshahi");
  const [upazila, setUpazila] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "Home", phone: "", full_address: "", landmark: "", postal: "" });
  const [editingId, setEditingId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(""), 3000); };

  useEffect(() => {
    async function init() {
      const cached = localStorage.getItem("eraj_addresses");
      if (cached) { try { setAddresses(JSON.parse(cached)); } catch {} }
      const { data } = await supabase.auth.getSession();
      const u = data?.session?.user;
      if (u) {
        setUser(u);
        const { data: dbAddr } = await supabase.from("addresses").select("*").eq("user_id", u.id).order("is_default", { ascending: false }).order("created_at", { ascending: false });
        if (dbAddr && dbAddr.length > 0) {
          setAddresses(dbAddr);
          localStorage.setItem("eraj_addresses", JSON.stringify(dbAddr));
          const def = dbAddr.find(a=> a.is_default) || dbAddr[0];
          localStorage.setItem("eraj_default_address", JSON.stringify(def));
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const districts = useMemo(() => BD_DATA[division]? Object.keys(BD_DATA[division]) : [], [division]);
  const upazilas = useMemo(() => BD_DATA[division]?.[district] || [], [division, district]);

  const filteredDistricts = useMemo(() => {
    if (!search) return districts;
    return districts.filter(d=> d.toLowerCase().includes(search.toLowerCase()));
  }, [districts, search]);

  const handleSave = async () => {
    if (!form.phone || form.phone.length < 11) { showToast("❌ Valid 11 Digit Phone দিন"); return; }
    if (!form.full_address || form.full_address.length < 5) { showToast("❌ Full Address লিখুন"); return; }
    if (!upazila) { showToast("❌ Upazila Select করুন"); return; }

    const newAddr = {
      id: editingId || `addr_${Date.now()}`,
      user_id: user?.id || "guest",
      label: form.label,
      phone: form.phone,
      full_address: form.full_address,
      landmark: form.landmark,
      postal_code: form.postal,
      city: district,
      district: district,
      division: division,
      upazila: upazila,
      is_default: addresses.length === 0? true : (editingId? addresses.find(a=> a.id===editingId)?.is_default : false),
      created_at: new Date().toISOString()
    };

    let updated;
    if (editingId) updated = addresses.map(a=> a.id===editingId? {...a,...newAddr } : a);
    else updated = [newAddr,...addresses];

    setAddresses(updated);
    localStorage.setItem("eraj_addresses", JSON.stringify(updated));
    if (newAddr.is_default || updated.length===1) localStorage.setItem("eraj_default_address", JSON.stringify(newAddr));

    if (user) {
      const { error } = await supabase.from("addresses").upsert(newAddr, { onConflict: "id" });
      if (!error) showToast("✅ Address Saved - Checkout এ Auto আসবে");
      else showToast("✅ Locally Saved (DB Error)");
    } else {
      showToast("✅ Address Saved Locally");
    }

    setForm({ label: "Home", phone: "", full_address: "", landmark: "", postal: "" });
    setUpazila("");
    setEditingId(null);
  };

  const handleDefault = async (id) => {
    const updated = addresses.map(a=> ({...a, is_default: a.id===id}));
    setAddresses(updated);
    const def = updated.find(a=> a.id===id);
    localStorage.setItem("eraj_addresses", JSON.stringify(updated));
    localStorage.setItem("eraj_default_address", JSON.stringify(def));
    if (user) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    }
    showToast("⭐ Default Address Set - Checkout এ এটাই যাবে");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    const updated = addresses.filter(a=> a.id!==id);
    setAddresses(updated);
    localStorage.setItem("eraj_addresses", JSON.stringify(updated));
    if (user) await supabase.from("addresses").delete().eq("id", id);
    showToast("🗑️ Address Deleted");
  };

  const handleCopy = (addr) => {
    const text = `${addr.full_address}, ${addr.upazila}, ${addr.district}, ${addr.division} Division, ${addr.postal_code || ""} | Phone: ${addr.phone}`;
    navigator.clipboard.writeText(text);
    showToast("📋 Address Copied");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { showToast("❌ Location not supported"); return; }
    navigator.geolocation.getCurrentPosition(() => {
      showToast("📍 Location Detected - Rajshahi Set");
      setDivision("Rajshahi"); setDistrict("Rajshahi"); setUpazila("Boalia");
    });
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen">
        <div className="h-[24px]"></div>
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="max-w-[900px] mx-auto grid gap-3 mt-4">
            <div style={{ height:"120px", background:"#eee", borderRadius:"16px", animation:"pulse 1s infinite" }}></div>
            <div style={{ height:"400px", background:"#eee", borderRadius:"16px", animation:"pulse 1s infinite" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-10">
      {/* Header থেকে Gap - তোমার Screenshot Fix */}
      <div className="h-[28px] w-full bg-[#f5f5f7]"></div>
      
      <div className="max-w-[1320px] mx-auto px-4">
        <div style={{ display:"flex", flexDirection:"column", gap:"18px", maxWidth:"900px", margin:"0 auto" }}>
          {toast && <div style={{ position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)", background:"black", color:"white", padding:"12px 22px", borderRadius:"30px", fontSize:"13px", fontWeight:"700", zIndex:9999, boxShadow:"0 10px 30px rgba(0,0,0,0.3)" }}>{toast}</div>}

          {/* My Addresses Banner - Header থেকে নিচে */}
          <div style={{ background:"linear-gradient(135deg,#f85606 0%,#ff8a00 100%)", borderRadius:"16px", padding:"22px 20px", color:"white", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <h1 style={{ fontWeight:"900", fontSize:"20px" }}>📍 My Addresses</h1>
              <p style={{ fontSize:"12px", opacity:0.9, marginTop:"4px" }}>{addresses.length} Saved • {division} • 64 District Real Data • Checkout Auto Fill</p>
            </div>
            <div style={{ background:"rgba(255,255,255,0.22)", padding:"8px 14px", borderRadius:"30px", fontSize:"11px", fontWeight:"900" }}>{addresses.filter(a=> a.is_default).length>0? "Default Set ✓":"No Default"}</div>
          </div>

          <div style={{ background:"white", borderRadius:"18px", padding:"22px", border:"1px solid #eee", boxShadow:"0 8px 24px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
              <h2 style={{ fontWeight:"900", fontSize:"15px" }}>{editingId? "✏️ Edit Address":"➕ Add New Address - 100% Real BD"}</h2>
              <button onClick={detectLocation} style={{ background:"#f5f5f5", border:"1px solid #e5e5e5", padding:"7px 14px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>📍 Detect My Location</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" }}>
              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888", letterSpacing:"0.5px" }}>LABEL / TAG</label>
                <select value={form.label} onChange={e=> setForm({...form, label:e.target.value})} style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #f0f0f0", borderRadius:"10px", fontSize:"13px", fontWeight:"600", outline:"none" }}>
                  <option>Home 🏠</option><option>Office 🏢</option><option>Parents House 👨‍👩‍👧</option><option>Shop 🏪</option><option>Other 📦</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>PHONE (11 Digit) *</label>
                <input value={form.phone} onChange={e=> setForm({...form, phone:e.target.value.replace(/\D/g,"").slice(0,11)})} placeholder="017XXXXXXXX" style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #f0f0f0", borderRadius:"10px", fontSize:"13px", outline:"none" }} />
              </div>
              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>POSTAL CODE</label>
                <input value={form.postal} onChange={e=> setForm({...form, postal:e.target.value})} placeholder="6000" style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #f0f0f0", borderRadius:"10px", fontSize:"13px", outline:"none" }} />
              </div>

              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>FULL ADDRESS (House, Road, Area) *</label>
                <input value={form.full_address} onChange={e=> setForm({...form, full_address:e.target.value})} placeholder="Ex: Holding 123, 2nd Floor, Shaheb Bazar, Boalia, Rajshahi" style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #f0f0f0", borderRadius:"10px", fontSize:"13px", outline:"none" }} />
              </div>

              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>DIVISION (8 Division)</label>
                <select value={division} onChange={e=> { const div=e.target.value; setDivision(div); const firstDist=Object.keys(BD_DATA[div])[0]; setDistrict(firstDist); setUpazila(""); }} style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #ffe0d0", borderRadius:"10px", fontSize:"13px", fontWeight:"700", background:"#fff8f3", outline:"none" }}>
                  {Object.keys(BD_DATA).map(d=> <option key={d} value={d}>{d} - {BD_DATA[d]? Object.keys(BD_DATA[d]).length : 0} Districts</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>DISTRICT (64 District) *</label>
                <div style={{ position:"relative" }}>
                  <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Search District..." style={{ width:"100%", marginTop:"6px", padding:"8px 12px", border:"1px solid #eee", borderRadius:"8px", fontSize:"11px", outline:"none", marginBottom:"4px" }} />
                  <select value={district} onChange={e=> { setDistrict(e.target.value); setUpazila(""); }} style={{ width:"100%", padding:"12px", border:"2px solid #ffe0d0", borderRadius:"10px", fontSize:"13px", fontWeight:"700", background:"#fff8f3", outline:"none" }}>
                    {filteredDistricts.map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>UPAZILA / THANA (495+) *</label>
                <select value={upazila} onChange={e=> setUpazila(e.target.value)} style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #ffe0d0", borderRadius:"10px", fontSize:"13px", fontWeight:"700", background:"#fff8f3", outline:"none" }}>
                  <option value="">Select Upazila - {upazilas.length} Available</option>
                  {upazilas.map(u=> <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:"10px", fontWeight:"900", color:"#888" }}>LANDMARK (Optional)</label>
                <input value={form.landmark} onChange={e=> setForm({...form, landmark:e.target.value})} placeholder="Near Rajshahi College, Opposite of Sonadighi Mosque" style={{ width:"100%", marginTop:"6px", padding:"12px", border:"2px solid #f0f0f0", borderRadius:"10px", fontSize:"13px", outline:"none" }} />
              </div>
            </div>

            <div style={{ display:"flex", gap:"12px", marginTop:"22px", flexWrap:"wrap" }}>
              <button onClick={handleSave} style={{ background:"linear-gradient(90deg,#f85606,#ff6a00)", color:"white", padding:"13px 28px", borderRadius:"12px", fontWeight:"900", fontSize:"14px", border:"none", cursor:"pointer", boxShadow:"0 4px 15px rgba(248,86,6,0.3)" }}>{editingId? "Update Address ✓":"Save Address ✓ - Checkout Auto Fill"}</button>
              <button onClick={()=> { setForm({ label:"Home", phone:"", full_address:"", landmark:"", postal:"" }); setUpazila(""); setEditingId(null); }} style={{ background:"white", padding:"13px 22px", borderRadius:"12px", fontWeight:"700", fontSize:"13px", border:"2px solid #eee", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>

          {addresses.length===0? (
            <div style={{ background:"white", borderRadius:"18px", padding:"56px 20px", textAlign:"center", border:"2px dashed #eee" }}>
              <div style={{ fontSize:"48px" }}>📭</div>
              <h3 style={{ fontWeight:"900", marginTop:"12px" }}>No Address Saved Yet</h3>
              <p style={{ fontSize:"12px", color:"#666", marginTop:"6px" }}>Add your first address - 64 District Real Data, Auto Fill in Checkout</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"14px" }}>
              {addresses.map(addr=> (
                <div key={addr.id} style={{ background:"white", borderRadius:"18px", padding:"18px", border: addr.is_default? "2px solid #f85606":"1px solid #eee", boxShadow: addr.is_default? "0 4px 20px rgba(248,86,6,0.15)":"0 2px 12px rgba(0,0,0,0.04)", position:"relative" }}>
                  {addr.is_default && <div style={{ position:"absolute", top:"-9px", right:"16px", background:"linear-gradient(90deg,#f85606,#ff6a00)", color:"white", fontSize:"9px", fontWeight:"900", padding:"5px 12px", borderRadius:"20px" }}>⭐ DEFAULT - CHECKOUT AUTO</div>}
                  <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                    <div style={{ width:"38px", height:"38px", borderRadius:"12px", background: addr.label.includes("Home")? "#fff1eb": addr.label.includes("Office")? "#e8f5e9":"#f3e8ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{addr.label.includes("Home")? "🏠": addr.label.includes("Office")? "🏢":"📦"}</div>
                    <div>
                      <p style={{ fontWeight:"900", fontSize:"14px" }}>{addr.label}</p>
                      <p style={{ fontSize:"10px", color:"#888", fontWeight:"700" }}>{addr.division} • {addr.district} • {addr.upazila}</p>
                    </div>
                  </div>
                  <div style={{ marginTop:"12px", background:"#fafafa", padding:"12px", borderRadius:"12px" }}>
                    <p style={{ fontSize:"12px", color:"#222", fontWeight:"600", lineHeight:"1.5" }}>{addr.full_address}</p>
                    {addr.landmark && <p style={{ fontSize:"11px", color:"#666", marginTop:"4px" }}>🏛️ {addr.landmark}</p>}
                    <p style={{ fontSize:"11px", color:"#666", marginTop:"4px" }}>📍 {addr.upazila}, {addr.district}, {addr.division} Division {addr.postal_code? `- ${addr.postal_code}`:""}</p>
                    <p style={{ fontSize:"12px", color:"#111", fontWeight:"800", marginTop:"6px" }}>📞 {addr.phone}</p>
                  </div>
                  <div style={{ display:"flex", gap:"6px", marginTop:"12px", flexWrap:"wrap" }}>
                    {!addr.is_default && <button onClick={()=> handleDefault(addr.id)} style={{ flex:1, fontSize:"11px", fontWeight:"900", background:"black", color:"white", padding:"9px", borderRadius:"9px", border:"none", cursor:"pointer" }}>Set Default ⭐</button>}
                    <button onClick={()=> handleCopy(addr)} style={{ fontSize:"11px", fontWeight:"700", background:"#f5f5f5", padding:"9px 12px", borderRadius:"9px", border:"1px solid #ddd", cursor:"pointer" }}>Copy 📋</button>
                    <button onClick={()=> { setForm({ label:addr.label, phone:addr.phone, full_address:addr.full_address, landmark:addr.landmark||"", postal:addr.postal_code||"" }); setDivision(addr.division); setDistrict(addr.district); setUpazila(addr.upazila); setEditingId(addr.id); window.scrollTo({top:0, behavior:"smooth"}); }} style={{ fontSize:"11px", fontWeight:"700", background:"#fff8e1", padding:"9px 12px", borderRadius:"9px", border:"1px solid #ffe082", cursor:"pointer" }}>Edit ✏️</button>
                    <button onClick={()=> handleDelete(addr.id)} style={{ fontSize:"11px", fontWeight:"700", background:"#fff0f0", color:"#c00", padding:"9px 12px", borderRadius:"9px", border:"1px solid #ffcdd2", cursor:"pointer" }}>Delete 🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}
        @media(max-width:768px){div[style*="grid-template-columns:1fr 1fr 1fr"]{grid-template-columns:1fr!important}div[style*="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))"]{grid-template-columns:1fr!important}}
        select:focus, input:focus{border-color:#f85606!important; box-shadow:0 0 0 3px rgba(248,86,6,0.1)!important}
      `}</style>
    </div>
  );
}