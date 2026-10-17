"use client";
import { useStore } from "../layout";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function BrandingPage() {
  const { storeData, setStoreData, handleImageUpload: storeImageUpload, user: storeUser } = useStore() || {};
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");
  const [showNameIdeas, setShowNameIdeas] = useState(false);
  const [showMottoIdeas, setShowMottoIdeas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function getUid(){
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || storeUser?.id || storeData?.user_id || null;
      setCurrentUserId(uid);
    }
    getUid();
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => setCurrentUserId(s?.user?.id || null));
    return () => listener?.subscription?.unsubscribe();
  }, [storeUser, storeData]);

  useEffect(() => {
    if(storeData?.shop_slug && storeData.shop_slug.length > 2){
      setSlugLocked(true);
      setSlugEdited(true);
    }
  }, [storeData?.shop_slug]);

  const generateSlug = (text) => (text || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45);

  const divisions = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
  const districts = [
    "Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Kishoreganj", "Manikganj", "Munshiganj", "Faridpur", "Gopalganj", "Shariatpur", "Rajbari", "Madaripur",
    "Chattogram", "Cox's Bazar", "Cumilla", "Chandpur", "Brahmanbaria", "Noakhali", "Feni", "Lakshmipur", "Rangamati", "Bandarban", "Khagrachari",
    "Rajshahi", "Chapainawabganj", "Naogaon", "Natore", "Pabna", "Bogura", "Joypurhat", "Sirajganj",
    "Khulna", "Bagerhat", "Satkhira", "Jashore", "Jhenaidah", "Magura", "Narail", "Kushtia", "Chuadanga", "Meherpur",
    "Barishal", "Bhola", "Patuakhali", "Pirojpur", "Barguna", "Jhalokathi",
    "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj",
    "Rangpur", "Gaibandha", "Nilphamari", "Kurigram", "Lalmonirhat", "Dinajpur", "Thakurgaon", "Panchagarh",
    "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
  ];

  const thanasByDistrict = {
    Dhaka: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur", "Motijheel", "Wari", "Tejgaon", "Savar", "Dhamrai", "Keraniganj", "Nawabganj", "Dohar", "Ramna", "Lalbagh", "Kotwali", "Sutrapur", "Paltan", "Shahbagh", "New Market", "Khilgaon", "Sabujbagh", "Demra", "Shyampur", "Badda", "Cantonment", "Khilkhet", "Uttar Khan", "Dakshin Khan", "Turag", "Pallabi", "Shah Ali", "Darus Salam", "Adabar", "Kamrangirchar", "Chak Bazar", "Hazaribagh", "Kalabagan", "Sher-e-Bangla Nagar", "Shahjahanpur", "Vatara", "Tejgaon Industrial", "Biman Bandar", "Khilket"],
    Gazipur: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Tongi"],
    Narayanganj: ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar", "Siddhirganj"],
    Tangail: ["Tangail Sadar", "Mirzapur", "Madhupur", "Ghatail", "Kalihati", "Delduar", "Sakhipur", "Basail", "Nagarpur", "Gopalpur", "Bhuapur", "Dhanbari"],
    Narsingdi: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
    Kishoreganj: ["Kishoreganj Sadar", "Bajitpur", "Bhairab", "Kuliarchar", "Pakundia", "Hossainpur", "Karimganj", "Katiadi", "Tarail", "Itna", "Nikli", "Mithamain", "Austagram"],
    Manikganj: ["Manikganj Sadar", "Singair", "Shibalaya", "Saturia", "Harirampur", "Ghior", "Daulatpur"],
    Munshiganj: ["Munshiganj Sadar", "Sirajdikhan", "Louhajang", "Sreenagar", "Gazaria", "Tongibari"],
    Faridpur: ["Faridpur Sadar", "Bhanga", "Boalmari", "Alfadanga", "Nagarkanda", "Madhukhali", "Sadarpur", "Charbhadrasan", "Saltha"],
    Gopalganj: ["Gopalganj Sadar", "Kotalipara", "Kashiani", "Muksudpur", "Tungipara"],
    Shariatpur: ["Shariatpur Sadar", "Naria", "Zajira", "Gosairhat", "Bhedarganj", "Damudya"],
    Rajbari: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
    Madaripur: ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir", "Dasar"],
    Chattogram: ["Kotwali", "Pahartali", "Panchlaish", "Double Mooring", "Chandgaon", "Sitakunda", "Patiya", "Anwara", "Boalkhali", "Rangunia", "Raozan", "Fatikchhari", "Hathazari", "Mirsharai", "Sandwip", "Banshkhali", "Satkania", "Lohagara", "Chandanaish", "Karnaphuli", "Bayazid", "Bakalia", "Bandar", "Chawkbazar", "Halishahar", "Khulshi", "EPZ"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ukhia", "Ramu", "Pekua", "Kutubdia", "Maheshkhali"],
    Cumilla: ["Cumilla Sadar", "Cumilla Sadar Dakshin", "Chandina", "Daudkandi", "Laksam", "Barura", "Brahmanpara", "Burichang", "Chauddagram", "Debidwar", "Homna", "Muradnagar", "Nangalkot", "Titas", "Meghna", "Monoharganj", "Cumilla Adarsha Sadar"],
    Chandpur: ["Chandpur Sadar", "Hajiganj", "Shahrasti", "Haimchar", "Kachua", "Faridganj", "Matlab North", "Matlab South"],
    Brahmanbaria: ["Brahmanbaria Sadar", "Ashuganj", "Nasirnagar", "Nabinagar", "Sarail", "Kasba", "Akhaura", "Bancharampur", "Bijoynagar"],
    Noakhali: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companyganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"],
    Feni: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fulgazi", "Sonagazi"],
    Lakshmipur: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
    Rangamati: ["Rangamati Sadar", "Kaptai", "Kawkhali", "Baghaichhari", "Barkal", "Langadu", "Rajasthali", "Belaichhari", "Juraichhari", "Naniarchar"],
    Bandarban: ["Bandarban Sadar", "Alikadam", "Naikhongchhari", "Rowangchhari", "Lama", "Ruma", "Thanchi"],
    Khagrachari: ["Khagrachari Sadar", "Dighinala", "Panchhari", "Laxmichhari", "Mahalchhari", "Manikchhari", "Ramgarh", "Matiranga", "Guimara"],
    Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Charghat", "Bagha", "Bagmara", "Durgapur", "Mohanpur", "Tanore", "Godagari", "Puthia", "Charghat"],
    Chapainawabganj: ["Chapainawabganj Sadar", "Gomastapur", "Nachole", "Bholahat", "Shibganj"],
    Naogaon: ["Naogaon Sadar", "Manda", "Niamatpur", "Atrai", "Raninagar", "Patnitala", "Dhamoirhat", "Mohadevpur", "Badalgachhi", "Porsha", "Sapahar"],
    Natore: ["Natore Sadar", "Singra", "Baraigram", "Bagatipara", "Lalpur", "Gurudaspur", "Naldanga"],
    Pabna: ["Pabna Sadar", "Ishwardi", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Atgharia", "Santhia", "Sujanagar"],
    Bogura: ["Bogura Sadar", "Shajahanpur", "Shibganj", "Adamdighi", "Dhupchanchia", "Sherpur", "Nandigram", "Sariakandi", "Sonatala", "Gabtali", "Kahaloo", "Dhunat"],
    Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
    Sirajganj: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"],
    Khulna: ["Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Dumuria", "Batiaghata", "Dacope", "Phultala", "Dighalia", "Terokhada", "Paikgachha", "Koyra", "Rupsa"],
    Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
    Satkhira: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
    Jashore: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
    Jhenaidah: ["Jhenaidah Sadar", "Shailkupa", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur"],
    Magura: ["Magura Sadar", "Sreepur", "Mohammadpur", "Shalikha"],
    Narail: ["Narail Sadar", "Lohagara", "Kalia"],
    Kushtia: ["Kushtia Sadar", "Kumarkhali", "Khoksa", "Mirpur", "Daulatpur", "Bheramara"],
    Chuadanga: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    Meherpur: ["Meherpur Sadar", "Mujibnagar", "Gangni"],
    Barishal: ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"],
    Bhola: ["Bhola Sadar", "Borhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
    Patuakhali: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali", "Dumki"],
    Pirojpur: ["Pirojpur Sadar", "Nazirpur", "Kawkhali", "Zianagar", "Bhandaria", "Mathbaria", "Nesarabad"],
    Barguna: ["Barguna Sadar", "Amtali", "Patharghata", "Bamna", "Betagi", "Taltali"],
    Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
    Sylhet: ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Companiganj", "Balaganj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Zakiganj", "Osmani Nagar"],
    Moulvibazar: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
    Habiganj: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
    Sunamganj: ["Sunamganj Sadar", "South Sunamganj", "Bishwambarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur"],
    Rangpur: ["Rangpur Sadar", "Badarganj", "Mithapukur", "Gangachara", "Kaunia", "Pirgachha", "Pirganj", "Taraganj"],
    Gaibandha: ["Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj", "Phulchhari"],
    Nilphamari: ["Nilphamari Sadar", "Domar", "Dimla", "Jaldhaka", "Kishoreganj", "Saidpur"],
    Kurigram: ["Kurigram Sadar", "Nageshwari", "Bhurungamari", "Phulbari", "Rajarhat", "Ulipur", "Chilmari", "Rowmari", "Char Rajibpur"],
    Lalmonirhat: ["Lalmonirhat Sadar", "Aditmari", "Kaliganj", "Hatibandha", "Patgram"],
    Dinajpur: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
    Thakurgaon: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
    Panchagarh: ["Panchagarh Sadar", "Debiganj", "Boda", "Atwari", "Tetulia"],
    Mymensingh: ["Mymensingh Sadar", "Trishal", "Bhaluka", "Muktagachha", "Fulbaria", "Gafargaon", "Gouripur", "Ishwarganj", "Nandail", "Phulpur", "Tarakanda", "Haluaghat", "Dhobaura"],
    Jamalpur: ["Jamalpur Sadar", "Melandah", "Islampur", "Dewanganj", "Bakshiganj", "Madarganj", "Sarishabari"],
    Netrokona: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"],
    Sherpur: ["Sherpur Sadar", "Nalitabari", "Sreebardi", "Nakla", "Jhenaigati"],
    Other: ["Sadar"]
  };

  const nameIdeas = ["TAMID NEW FASHION - Rajshahi Original","Rajshahi Fashion House - Authentic & Trusted","Style Bazar Rajshahi - Premium Clothing","Urban Fashion Rajshahi - Since 2020","Classic Panjabi Store Rajshahi","Premium Clothing Rajshahi - 100% Authentic","Rajshahi's Best Clothing - TAMID","Authentic Fashion Rajshahi - Direct From Factory","TAMID Fashion - Rajshahi's Most Trusted","Royal Fashion Rajshahi - Premium Quality"];
  const mottoIdeas = ["Trusted by 10k+ Customers - 100% Authentic - Fast Delivery","Authentic Products - Fast Delivery - Easy Return - 4.9 Rated","Rajshahi's Most Trusted Fashion Store Since 2020","100% Authentic Guarantee - Direct From Factory","Premium Quality - Best Price - Fast Delivery","Customer Satisfaction is Our Priority","Original Products - Cash on Delivery - 7 Days Return","Quality First - Authentic Always - Since 2020"];
  const themePresets = [
    {name:"Midnight",primary:"#0f172a",secondary:"#3b82f6",accent:"#38bdf8"},
    {name:"Royal Black",primary:"#000000",secondary:"#111827",accent:"#f59e0b"},
    {name:"Ocean Blue",primary:"#0c4a6e",secondary:"#0284c7",accent:"#06b6d4"},
    {name:"Forest Green",primary:"#14532d",secondary:"#16a34a",accent:"#22c55e"},
    {name:"Wine Red",primary:"#7f1d1d",secondary:"#dc2626",accent:"#f87171"},
    {name:"Sunset Orange",primary:"#7c2d12",secondary:"#ea580c",accent:"#fb923c"}
  ];

  const brandingScore = useMemo(() => {
    let s = 0; const d = storeData || {};
    if(d.shop_name?.length >= 5) s += 15;
    if(d.shop_slug?.length >= 3) s += 15;
    if(d.shop_description?.length >= 80) s += 15;
    if(d.shop_logo) s += 15;
    if(d.shop_banner) s += 10;
    if(d.hero_image) s += 5;
    if(d.division && d.district && d.thana) s += 10;
    if(d.theme_color) s += 5;
    if(d.store_motto) s += 5;
    if(d.seo_title && d.seo_description) s += 5;
    return { score: Math.min(s, 100), level: s >= 80? "Excellent" : s >= 50? "Average" : "Needs Work" };
  }, [storeData]);

  const handleSave = async () => {
    setSaving(true); setSaveMsg("");
    try {
      let userId = currentUserId;
      if(!userId){
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id || null;
      }
      if(!userId){
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      }
      if(!userId && storeData?.user_id) userId = storeData.user_id;
      if(!userId) throw new Error("Session expired. Please login again");

      let payload = {
        user_id: userId,
        name: storeData.shop_name,
        shop_name: storeData.shop_name,
        slug: storeData.shop_slug,
        shop_slug: storeData.shop_slug,
        shop_description: storeData.shop_description,
        description: storeData.shop_description,
        shop_logo: storeData.shop_logo,
        shop_banner: storeData.shop_banner,
        shop_logo_url: storeData.shop_logo,
        shop_banner_url: storeData.shop_banner,
        banner_url: storeData.shop_banner || storeData.banner_url,
        banner_image: storeData.shop_banner || storeData.hero_image,
        banner_image_url: storeData.shop_banner,
        banner_mobile: storeData.banner_mobile || storeData.hero_mobile_image,
        logo_url: storeData.shop_logo,
        logo: storeData.shop_logo,
        hero_image: storeData.hero_image,
        hero_mobile_image: storeData.hero_mobile_image,
        hero_title: storeData.hero_title || storeData.shop_name,
        hero_subtitle: storeData.hero_subtitle || storeData.store_motto,
        hero_badge1: storeData.hero_badge1,
        hero_badge2: storeData.hero_badge2,
        hero_badge3: storeData.hero_badge3,
        hero_cta_text: storeData.hero_cta_text,
        hero_cta_link: storeData.hero_cta_link,
        second_banner: storeData.second_banner,
        second_banner_link: storeData.second_banner_link,
        banner_template: storeData.banner_template,
        banner_style: storeData.banner_style,
        banner_text_position: storeData.banner_text_position,
        banner_overlay: storeData.banner_overlay,
        banner_height: storeData.banner_height,
        banner_show_button: storeData.banner_show_button,
        banner_show_badges: storeData.banner_show_badges,
        store_motto: storeData.store_motto,
        brand_story: storeData.brand_story || storeData.shop_description,
        mission_statement: storeData.mission_statement,
        vision_statement: storeData.vision_statement,
        founded_year: storeData.founded_year,
        total_customers: storeData.total_customers,
        total_products: storeData.total_products,
        joined_date: storeData.joined_date || new Date().toISOString(),
        theme_color: storeData.theme_color,
        secondary_color: storeData.secondary_color,
        accent_color: storeData.accent_color,
        theme_name: storeData.theme_name,
        font_family: storeData.font_family,
        font_size: storeData.font_size,
        button_style: storeData.button_style,
        card_style: storeData.card_style,
        shop_category: storeData.shop_category,
        division: storeData.division,
        district: storeData.district,
        thana: storeData.thana,
        address: storeData.address,
        full_address: storeData.address,
        area: storeData.area,
        postal_code: storeData.postal_code,
        google_maps_url: storeData.google_maps_url,
        store_hours: storeData.store_hours,
        business_hours: storeData.business_hours || storeData.store_hours,
        response_time: storeData.response_time,
        seo_title: storeData.seo_title || storeData.shop_name,
        seo_description: storeData.seo_description || storeData.shop_description?.slice(0,160),
        seo_keywords: storeData.seo_keywords,
        og_image: storeData.og_image || storeData.shop_banner || storeData.hero_image,
        og_title: storeData.og_title || storeData.shop_name,
        og_description: storeData.og_description || storeData.shop_description,
        favicon: storeData.favicon || storeData.shop_logo,
        apple_touch_icon: storeData.apple_touch_icon || storeData.shop_logo,
        announcement_text: storeData.announcement_text,
        announcement_style: storeData.announcement_style,
        announcement_all_pages: storeData.announcement_all_pages,
        announcement_closable: storeData.announcement_closable,
        announcement_sticky: storeData.announcement_sticky,
        announcement_icon: storeData.announcement_icon,
        announcement_link: storeData.announcement_link,
        show_coupon: storeData.show_coupon,
        show_live_visitors: storeData.show_live_visitors,
        rating: storeData.rating || 4.9,
        total_reviews: storeData.total_reviews || 127,
        branding_score: brandingScore.score,
        updated_at: new Date().toISOString(),
      };

      Object.keys(payload).forEach(k => {
        if(payload[k] === undefined) delete payload[k];
        if(payload[k] === "" &&!["shop_name","name","shop_slug","slug"].includes(k)) delete payload[k];
      });

      let finalError = null;
      let savedData = null;
      for(let attempt = 0; attempt < 60; attempt++){
        const { data: exists } = await supabase.from("sellers").select("id").eq("user_id", userId).maybeSingle();
        let result;
        if(exists){
          result = await supabase.from("sellers").update(payload).eq("user_id", userId).select().single();
        } else {
          result = await supabase.from("sellers").insert({...payload, created_at: new Date().toISOString()}).select().single();
        }
        if(!result.error){ finalError = null; savedData = result.data; setStoreData(prev => ({...prev,...result.data})); break; }
        const msg = result.error.message || "";
        const match = msg.match(/'([^']+)' column/) || msg.match(/column "([^"]+)" does not exist/) || msg.match(/Could not find the '([^']+)' column/);
        if(match && (msg.includes("Could not find") || msg.includes("does not exist"))){
          const col = match[1];
          if(payload[col]!== undefined){ delete payload[col]; continue; }
        }
        finalError = result.error; if(!msg.includes("column")) break;
      }
      if(finalError) throw finalError;
      setSlugLocked(true);
      setSaveMsg(`Saved Successfully - Score ${brandingScore.score}/100 - Updated: ${savedData?.name || payload.name}`);
    } catch(e){ setSaveMsg("Error: " + (e.message || "Failed to save")); }
    finally{ setSaving(false); setTimeout(() => setSaveMsg(""), 6000); }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0]; if(!file) return;
    if(storeImageUpload) return storeImageUpload(e, field);
    if(file.size > 5*1024*1024){ setSaveMsg("Image too large - Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setStoreData(prev => ({
  ...prev, [field]: base64,
  ...(field === "shop_logo"? {logo_url: base64, favicon: prev.favicon || base64, shop_logo_url: base64, logo: base64} : {}),
  ...(field === "shop_banner"? {banner_url: base64, shop_banner_url: base64, og_image: prev.og_image || base64, banner_image: base64} : {}),
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-[1020px] pb-32">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight">Branding & Store Identity</h1>
          <p className="text-[12px] text-slate-500 mt-1 max-w-[700px] leading-relaxed">Manage your store branding, colors, and appearance across storefront, invoices and browser tab.</p>
        </div>
        <div className={`text-[11px] px-4 py-2 rounded-full font-black border h-fit ${brandingScore.score >= 80? "bg-green-50 text-green-700 border-green-200" : brandingScore.score >= 50? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {brandingScore.score}/100 - {brandingScore.level}
        </div>
      </div>

      <div className="p-4 rounded-[16px] border-2 bg-white shadow-sm">
        <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500"><span>Profile Completion</span><span>{brandingScore.score}%</span></div>
        <div className="mt-3 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full transition-all ${brandingScore.score >= 80? "bg-green-500" : brandingScore.score >= 50? "bg-amber-500" : "bg-red-500"}`} style={{width:`${brandingScore.score}%`}}></div></div>
        <div className="mt-4 grid grid-cols-5 md:grid-cols-10 gap-2">
          {[{label:"Name",done:!!storeData?.shop_name},{label:"URL",done:!!storeData?.shop_slug},{label:"About",done:(storeData?.shop_description?.length||0)>=80},{label:"Logo",done:!!storeData?.shop_logo},{label:"Banner",done:!!storeData?.shop_banner},{label:"Division",done:!!storeData?.division},{label:"District",done:!!storeData?.district},{label:"Thana",done:!!storeData?.thana},{label:"Motto",done:!!storeData?.store_motto},{label:"SEO",done:!!storeData?.seo_title}].map((s,i)=>(
            <div key={`brand-${s.label}-${i}`} className={`p-2 rounded-xl border-2 text-center ${s.done?"bg-green-50 border-green-200":"bg-slate-50"}`}><p className="text-[11px]">{s.done?"✓":"○"}</p><p className="text-[8px] font-black mt-1 uppercase">{s.label}</p></div>
          ))}
        </div>
      </div>

      <div className="p-1.5 rounded-[14px] bg-slate-100 border-2 flex gap-1 sticky top-2 z-20 overflow-x-auto">
        {[{id:"identity",label:"Identity"},{id:"visual",label:"Logo & Banner"},{id:"story",label:"Story"},{id:"colors",label:"Colors"},{id:"seo",label:"SEO"},{id:"advanced",label:"Advanced"}].map(t=>(
          <button key={`tab-${t.id}`} onClick={()=>setActiveTab(t.id)} className={`px-4 py-2.5 rounded-[10px] text-[12px] font-black whitespace-nowrap border-2 transition-all ${activeTab===t.id?"bg-white border-slate-900 shadow-sm":"border-transparent text-slate-500 hover:text-slate-900"}`}>{t.label}</button>
        ))}
      </div>

      {activeTab==="identity" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <div className="flex justify-between items-center"><h3 className="font-black text-[14px]">Store Identity</h3><button onClick={()=>setShowNameIdeas(!showNameIdeas)} className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold">{showNameIdeas?"Hide Ideas":"Name Ideas"}</button></div>
          {showNameIdeas && <div className="grid md:grid-cols-2 gap-2 p-3 rounded-[14px] bg-slate-900">{nameIdeas.map((n,i)=><button key={`name-${i}-${n.slice(0,5)}`} onClick={()=>{ if(!slugLocked){ setStoreData({...storeData, shop_name:n, name:n, shop_slug:generateSlug(n), slug:generateSlug(n)}); } else { setStoreData({...storeData, shop_name:n, name:n}); } }} className="text-left p-2.5 rounded-[10px] bg-white/10 text-white text-[11px] border border-white/10 hover:bg-white/20">{n}</button>)}</div>}
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest">Shop Name *</label>
            <input value={storeData?.shop_name||""} onChange={e=>{
              const newName = e.target.value;
              if(!slugLocked){
                setStoreData({...storeData, shop_name:newName, name:newName, shop_slug:generateSlug(newName), slug:generateSlug(newName)});
              } else {
                setStoreData({...storeData, shop_name:newName, name:newName});
              }
            }} className="mt-2 w-full px-4 py-3.5 rounded-[14px] border-2 bg-slate-50 text-sm font-bold outline-none focus:border-slate-900 focus:bg-white" placeholder="Your Store Name" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest">Store URL {slugLocked && "(Locked)"}</label>
            <div className={`mt-2 flex items-center px-4 py-3.5 rounded-[14px] border-2 ${slugLocked?"bg-slate-100 border-slate-300":"bg-slate-50 focus-within:bg-white focus-within:border-slate-900"}`}>
              <span className="text-slate-400 text-sm font-mono">/store/</span>
              <input value={storeData?.shop_slug||""} disabled={slugLocked} onChange={e=>{setSlugEdited(true); const s=generateSlug(e.target.value); setStoreData({...storeData, shop_slug:s, slug:s})}} className="ml-2 flex-1 bg-transparent outline-none font-bold font-mono text-sm disabled:text-slate-500" placeholder="your-store-name" />
              {slugLocked && <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-full border">LOCKED</span>}
            </div>
            {slugLocked? (
              <div className="mt-2 p-2.5 rounded-[10px] bg-green-50 border border-green-200 flex justify-between items-center">
                <p className="text-[11px] text-green-700 font-bold">URL is locked for SEO safety.</p>
                <button onClick={()=>{ if(confirm("Unlock URL? This may affect SEO.")) setSlugLocked(false); }} className="text-[10px] px-2 py-1 rounded-full bg-white border font-black">Unlock</button>
              </div>
            ) : (
              <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border mt-2">URL will be locked after first save to protect SEO ranking.</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-[11px] font-bold uppercase">Division *</label><select value={storeData?.division||"Rajshahi"} onChange={e=>setStoreData({...storeData, division:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm font-bold"><option value="">Select Division</option>{divisions.map((div, idx)=><option key={`div-opt-${div}-${idx}`} value={div}>{div}</option>)}</select></div>
            <div><label className="text-[11px] font-bold uppercase">District *</label><select value={storeData?.district||"Rajshahi"} onChange={e=>setStoreData({...storeData, district:e.target.value, thana:""})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm font-bold"><option value="">Select District</option>{districts.map((d, idx)=><option key={`dist-opt-${d}-${idx}`} value={d}>{d}</option>)}</select></div>
            <div><label className="text-[11px] font-bold uppercase">Thana *</label><select value={storeData?.thana||""} onChange={e=>setStoreData({...storeData, thana:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm font-bold"><option value="">Select Thana</option>{(thanasByDistrict[storeData?.district] || thanasByDistrict.Other).map((t, idx)=><option key={`thana-opt-${t}-${idx}`} value={t}>{t}</option>)}</select></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-bold uppercase">Full Address *</label><input value={storeData?.address||""} onChange={e=>setStoreData({...storeData, address:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm focus:bg-white focus:border-slate-900 outline-none" placeholder="Street, Area, City" /></div>
            <div><label className="text-[11px] font-bold uppercase">Postal Code / Area</label><div className="grid grid-cols-2 gap-2"><input value={storeData?.postal_code||""} onChange={e=>setStoreData({...storeData, postal_code:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm" placeholder="6000" /><input value={storeData?.area||""} onChange={e=>setStoreData({...storeData, area:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm" placeholder="Area Name" /></div></div>
          </div>
        </div>
      )}

      {activeTab==="visual" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">Logo & Banner</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-4 rounded-[14px] border-2 bg-slate-50 space-y-3"><label className="text-[11px] font-black uppercase">Logo 200x200 PNG</label><div className="flex gap-3 items-center"><div className="w-20 h-20 rounded-[14px] bg-white border-2 flex items-center justify-center overflow-hidden">{storeData?.shop_logo? <img src={storeData.shop_logo} className="w-full h-full object-cover" alt="logo"/> : <span className="font-black text-slate-300">{storeData?.shop_name?.[0]||"L"}</span>}</div><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,"shop_logo")} className="flex-1 text-[11px] file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-slate-900 file:text-white border-2 border-dashed rounded-xl p-2 bg-white" /></div></div>
            <div className="p-4 rounded-[14px] border-2 bg-slate-50 space-y-3"><label className="text-[11px] font-black uppercase">Banner 1200x400</label><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,"shop_banner")} className="w-full text-[11px] file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-slate-900 file:text-white border-2 border-dashed rounded-xl p-2 bg-white" /><div className="h-[130px] rounded-[14px] bg-white border-2 overflow-hidden flex items-center justify-center">{storeData?.shop_banner? <img src={storeData.shop_banner} className="w-full h-full object-cover" alt="banner"/> : <span className="text-xs text-slate-400">1200x400 recommended</span>}</div></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4"><div className="p-4 border-2 rounded-[14px]"><label className="text-[11px] font-black uppercase">Hero Image 1200x600</label><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,"hero_image")} className="mt-2 w-full text-[11px] file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-slate-900 file:text-white border-2 border-dashed rounded-xl p-2 bg-slate-50" /></div><div className="p-4 border-2 rounded-[14px]"><label className="text-[11px] font-black uppercase">OG Image 1200x630</label><input type="file" accept="image/*" onChange={e=>handleImageUpload(e,"og_image")} className="mt-2 w-full text-[11px] file:px-3 file:py-2 file:rounded-full file:border-0 file:bg-slate-900 file:text-white border-2 border-dashed rounded-xl p-2 bg-slate-50" /></div></div>
        </div>
      )}

      {activeTab==="story" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Brand Story & Motto</h3>
          <div><label className="text-[11px] font-black uppercase">About Store</label><textarea value={storeData?.shop_description||""} onChange={e=>setStoreData({...storeData, shop_description:e.target.value, description:e.target.value})} rows={5} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm outline-none focus:bg-white focus:border-slate-900" placeholder="Describe your store story..." /></div>
          <div className="grid md:grid-cols-2 gap-4"><div><div className="flex justify-between"><label className="text-[11px] font-bold uppercase">Motto</label><button onClick={()=>setShowMottoIdeas(!showMottoIdeas)} className="text-[10px] px-2 py-1 rounded-full bg-slate-100 border font-bold">Ideas</button></div><input value={storeData?.store_motto||""} onChange={e=>setStoreData({...storeData, store_motto:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm font-bold" placeholder="Trusted by 10k+ Customers" />{showMottoIdeas && <div className="mt-2 grid gap-1">{mottoIdeas.map((m,i)=><button key={`motto-${i}-${m.slice(0,5)}`} onClick={()=>setStoreData({...storeData, store_motto:m})} className="text-left text-[11px] p-2 rounded-[10px] bg-slate-50 border-2 hover:bg-slate-900 hover:text-white">{m}</button>)}</div>}</div><div><label className="text-[11px] font-bold uppercase">Founded Year</label><input value={storeData?.founded_year||""} onChange={e=>setStoreData({...storeData, founded_year:e.target.value})} className="mt-2 w-full px-4 py-3 rounded-[14px] border-2 bg-slate-50 text-sm" placeholder="2020" /></div></div>
        </div>
      )}

      {activeTab==="colors" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Colors & Theme</h3>
          <div className="grid md:grid-cols-3 gap-4">{[{label:"Primary",field:"theme_color",val:storeData?.theme_color||"#0f172a"},{label:"Secondary",field:"secondary_color",val:storeData?.secondary_color||"#3b82f6"},{label:"Accent",field:"accent_color",val:storeData?.accent_color||"#38bdf8"}].map(c=><div key={`color-${c.field}`} className="p-4 rounded-[14px] border-2 bg-slate-50"><label className="text-[10px] font-black uppercase">{c.label}</label><div className="mt-2 flex gap-2 items-center p-2 bg-white border-2 rounded-[12px]"><input type="color" value={c.val} onChange={e=>setStoreData({...storeData,[c.field]:e.target.value})} className="w-10 h-10 rounded-lg" /><input value={c.val} onChange={e=>setStoreData({...storeData,[c.field]:e.target.value})} className="flex-1 text-xs font-mono font-bold bg-transparent outline-none" /></div></div>)}</div>
          <div><p className="text-[11px] font-black uppercase mb-2">Presets</p><div className="grid grid-cols-2 md:grid-cols-3 gap-2">{themePresets.map(t=><button key={`preset-${t.name}`} onClick={()=>setStoreData({...storeData, theme_color:t.primary, secondary_color:t.secondary, accent_color:t.accent})} className="p-3 rounded-[14px] border-2 bg-white text-left hover:border-slate-900"><p className="text-[11px] font-bold">{t.name}</p><div className="mt-1 flex gap-1"><div className="w-5 h-5 rounded-full border-2" style={{background:t.primary}}></div><div className="w-5 h-5 rounded-full border-2" style={{background:t.secondary}}></div><div className="w-5 h-5 rounded-full border-2" style={{background:t.accent}}></div></div></button>)}</div></div>
          <div className="p-5 rounded-[14px] text-white text-center font-black shadow-md" style={{background:`linear-gradient(135deg, ${storeData?.theme_color||"#0f172a"}, ${storeData?.secondary_color||"#3b82f6"})`}}>{storeData?.shop_name||"Your Shop"} - Live Preview</div>
        </div>
      )}

      {activeTab==="seo" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-6">
          <h3 className="font-black text-[14px]">SEO Settings</h3>
          <div className="p-5 rounded-[14px] bg-white border-2 space-y-4">
            <div><label className="text-[10px] font-black uppercase">SEO Title - 60 chars</label><input value={storeData?.seo_title||""} onChange={e=>setStoreData({...storeData, seo_title:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-[12px] border-2 bg-slate-50 text-sm font-bold" placeholder="Best Store - Rajshahi" /></div>
            <div><label className="text-[10px] font-black uppercase">SEO Description - 160 chars</label><textarea value={storeData?.seo_description||""} onChange={e=>setStoreData({...storeData, seo_description:e.target.value})} rows={3} className="mt-1 w-full px-4 py-3 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="Authentic products, fast delivery..." /></div>
            <div><label className="text-[10px] font-black uppercase">Keywords</label><input value={storeData?.seo_keywords||""} onChange={e=>setStoreData({...storeData, seo_keywords:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="fashion store, clothing shop" /></div>
          </div>
        </div>
      )}

      {activeTab==="advanced" && (
        <div className="p-6 rounded-[16px] border-2 bg-white shadow-sm space-y-5">
          <h3 className="font-black text-[14px]">Advanced Settings</h3>
          <div className="p-4 rounded-[14px] border-2 bg-slate-50 space-y-3">
            <h4 className="font-black text-xs">Announcement Bar</h4>
            <input value={storeData?.announcement_text||""} onChange={e=>setStoreData({...storeData, announcement_text:e.target.value})} className="w-full px-3 py-2.5 rounded-[12px] border-2 bg-white text-sm" placeholder="Free Delivery - Order Now!" />
            <div className="grid grid-cols-2 gap-3"><input value={storeData?.announcement_icon||""} onChange={e=>setStoreData({...storeData, announcement_icon:e.target.value})} className="px-3 py-2.5 rounded-[12px] border-2 bg-white text-sm" placeholder="Icon" /><input value={storeData?.announcement_link||""} onChange={e=>setStoreData({...storeData, announcement_link:e.target.value})} className="px-3 py-2.5 rounded-[12px] border-2 bg-white text-sm" placeholder="Link" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-3"><div><label className="text-[10px] font-black uppercase">Store Hours</label><input value={storeData?.store_hours||""} onChange={e=>setStoreData({...storeData, store_hours:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="9AM-10PM" /></div><div><label className="text-[10px] font-black uppercase">Response Time</label><input value={storeData?.response_time||""} onChange={e=>setStoreData({...storeData, response_time:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="30min" /></div></div>
          <div><label className="text-[10px] font-black uppercase">Google Maps URL</label><input value={storeData?.google_maps_url||""} onChange={e=>setStoreData({...storeData, google_maps_url:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-[12px] border-2 bg-slate-50 text-sm" placeholder="https://maps.google.com/..." /></div>
        </div>
      )}

      <div className="sticky bottom-4 z-20 space-y-2">
        <button onClick={handleSave} disabled={saving ||!currentUserId} className="w-full py-4 rounded-[14px] text-white font-black bg-slate-900 hover:bg-black disabled:opacity-40 shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all">
          {saving? "Saving..." : currentUserId? `Save Branding - ${brandingScore.score}/100` : "Please login to save"}
        </button>
        {saveMsg && <div className={`p-3 rounded-[12px] text-xs font-bold text-center border-2 ${saveMsg.startsWith("Saved")? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>{saveMsg}</div>}
      </div>
    </div>
  )
}