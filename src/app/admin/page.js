"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  Home, ShoppingBag, Users, DollarSign, Bell, Settings, Package, MessageSquare, Image,
  Video, Brain, Satellite, Box, Sparkles, Shield, Download, Upload, QrCode, Wallet,
  Share2, Database, TrendingUp, Store, Plus, Wand2, Megaphone, Headphones, Star, Target
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const ADMIN_EMAIL = "admin@baharaz.com";

const GRADIENTS = [
  "from-pink-500 via-red-500 to-yellow-500",
  "from-green-400 via-blue-500 to-purple-600",
  "from-orange-400 via-pink-500 to-purple-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-teal-500 to-green-500",
  "from-red-500 via-orange-500 to-yellow-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-teal-400 via-cyan-500 to-blue-500",
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState("light");
  const [gradient, setGradient] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef();
  const [aiLoading, setAiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState("");
  const [aiImage, setAiImage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [brandName, setBrandName] = useState("Baharaz");
  const [googleResult, setGoogleResult] = useState("");
  const [googleImage, setGoogleImage] = useState("");
  const [liveMap, setLiveMap] = useState("");
  const [blockchainHash, setBlockchainHash] = useState("");
  const [newProduct, setNewProduct] = useState({name:"",price:"",stock:"",category:""});
  const [sellers, setSellers] = useState([]);
  const [websiteCode, setWebsiteCode] = useState("");
  const [adCampaign, setAdCampaign] = useState("");
  const [supportQuestion, setSupportQuestion] = useState("");
  const [supportReply, setSupportReply] = useState("");
  const videoRef = useRef();
  const faceApiRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setGradient(prev => (prev + 1) % GRADIENTS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
    loadFaceModels();
    initVoice();
  }, []);

  const fetchData = async () => {
    const { data: ordersData } = await supabase.from('orders').select('*');
    const { data: productsData } = await supabase.from('products').select('*');
    setOrders(ordersData || []);
    setProducts(productsData || []);
    setStats({
      revenue: ordersData?.reduce((a,b)=>a+(b.total || b.total_amount || 0), 0) || 0,
      orders: ordersData?.length || 0,
      users: 1243,
      products: productsData?.length || 0
    });
  }

  // ✅ FIXED - Dynamic Import - Build Error Fix
  const loadFaceModels = async () => {
    try {
      if (typeof window === "undefined") return;
      const faceapi = await import('face-api.js');
      faceApiRef.current = faceapi;
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log("Face models loaded");
    } catch(e) {
      console.log("Face models not found. Put in /public/models", e.message);
    }
  }

  const initVoice = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'bn-BD';
      recognitionRef.current.onresult = (e) => {
        const cmd = e.results[0][0].transcript.toLowerCase();
        if(cmd.includes("product")) setTab("products");
        if(cmd.includes("order")) setTab("orders");
        toast(`Command: ${cmd}`);
      }
    }
  }
  const toggleVoice = () => {
    if (!recognitionRef.current) return toast.error("Voice not supported");
    isListening? recognitionRef.current?.stop() : recognitionRef.current?.start();
    setIsListening(!isListening);
  }

  const formatPrice = (p) => `৳${Number(p).toLocaleString()}`;

  const callFreeAI = async (prompt, type) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/free', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt, type }) });
      const data = await res.json();
      setGeminiResult(data.result);
    } catch(e){ console.log(e); }
    setAiLoading(false);
  }
  const generateFreeImage = async (name) => {
    const res = await fetch('/api/ai/image', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt: name }) });
    const data = await res.json();
    setAiImage(data.image);
  }

  const sendChatMessage = async () => {
    if(!chatInput) return;
    const newMsg = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    const res = await fetch('/api/chatbot', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ message: chatInput, history: chatMessages }) });
    const data = await res.json();
    setChatMessages([...chatMessages, newMsg, { role: "assistant", content: data.reply }]);
    setChatInput("");
  }
  const generateLogo = async () => {
    const res = await fetch('/api/logo', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ brandName }) });
    const data = await res.json();
    setLogoImage(data.logo);
  }
  const generateVideo = async () => {
    const res = await fetch('/api/video', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt: "smartphone ad" }) });
    const data = await res.json();
    setVideoUrl(data.videoUrl);
  }

  const callGoogleAI = async (prompt, type) => {
    setAiLoading(true);
    const res = await fetch('/api/google/ai', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt, type }) });
    const data = await res.json();
    setGoogleResult(data.result);
    setAiLoading(false);
  }
  const generateGoogleImage = async (prompt) => {
    const res = await fetch('/api/google/image', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    setGoogleImage(data.image);
  }
  const predictPrice = async () => callGoogleAI("iPhone 15 Pro", "price");
  const generateReviews = async () => callGoogleAI("Smart Watch", "review");
  const competitorAnalysis = async () => callGoogleAI("Wireless Earbuds", "competitor");

  const startSatelliteTracking = async (order) => {
    if(!order) return toast.error("No order");
    const lat = 23.8103 + Math.random()*0.02;
    const lng = 90.4125 + Math.random()*0.02;
    const res = await fetch('/api/tracking/satellite', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ orderId: order.id, lat, lng }) });
    const data = await res.json();
    setLiveMap(data.mapImage);
    toast.success("Live Tracking Started");
  }

  const saveToBlockchain = async (order) => {
    if(!order) return toast.error("No order");
    const res = await fetch('/api/blockchain/verify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ orderId: order.id, orderData: order }) });
    const data = await res.json();
    setBlockchainHash(data.txHash);
    toast.success("Saved to Blockchain");
  }

  const addProduct = async () => {
    if(!newProduct.name ||!newProduct.price) return toast.error("Fill all fields");
    const { error } = await supabase.from('products').insert([{...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock)}]);
    if(!error) {
      toast.success("Product Added!");
      fetchData();
      setNewProduct({name:"",price:"",stock:"",category:""});
    }
  }

  const buildWebsite = async () => {
    setAiLoading(true);
    const res = await fetch('/api/ai/website', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({brandName:"Baharaz", category:"Electronics"}) });
    const data = await res.json();
    setWebsiteCode(data.code);
    setAiLoading(false);
  }
  const createAd = async () => {
    setAiLoading(true);
    const res = await fetch('/api/ai/adcampaign', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({product:"iPhone", budget:5000}) });
    const data = await res.json();
    setAdCampaign(data.result);
    setAiLoading(false);
  }
  const askSupport = async () => {
    setAiLoading(true);
    const res = await fetch('/api/ai/support', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({question:supportQuestion}) });
    const data = await res.json();
    setSupportReply(data.reply);
    setAiLoading(false);
  }

  const menu = [
    {id:"dashboard", name:"Dashboard", icon:Home},
    {id:"addproduct", name:"Add Product", icon:Plus},
    {id:"orders", name:"Orders", icon:Package},
    {id:"products", name:"Products", icon:ShoppingBag},
    {id:"googleai", name:"Google AI", icon:Wand2},
    {id:"website", name:"AI Website", icon:Wand2},
    {id:"adcampaign", name:"AI Ads", icon:Megaphone},
    {id:"supportbot", name:"Support Bot", icon:Headphones},
    {id:"freeai", name:"Free AI", icon:Sparkles},
    {id:"chatbot", name:"Chatbot", icon:MessageSquare},
    {id:"logoai", name:"Logo AI", icon:Image},
    {id:"videoai", name:"Video AI", icon:Video},
    {id:"tracking", name:"Tracking", icon:Satellite},
    {id:"blockchain", name:"Blockchain", icon:Box},
    {id:"settings", name:"Settings", icon:Settings}
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENTS[gradient]} transition-all duration-1000`}>
      <Toaster position="top-right" />
      <div className="flex">
        <div className="w-64 bg-white/10 backdrop-blur-xl p-4 h-screen sticky top-0 overflow-y-auto">
          <h1 className="text-2xl font-black text-white mb-8">BAHARAZ V41.0</h1>
          {menu.map(m => (
            <button key={m.id} onClick={()=>setTab(m.id)} className={`w-full flex items-center gap-3 p-3 mb-2 rounded-2xl transition ${tab===m.id? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}>
              <m.icon size={20}/> {m.name}
            </button>
          ))}
        </div>

        <div className="flex-1 p-5 md:p-8">

          {tab==="dashboard" && (
            <div className="grid md:grid-cols-4 gap-6">
              {Object.entries(stats).map(([k,v])=>(
                <div key={k} className="bg-white/20 backdrop-blur p-6 rounded-3xl text-white shadow-xl">
                  <p className="text-sm opacity-80">{k.toUpperCase()}</p>
                  <p className="text-3xl font-black">{k==="revenue"? formatPrice(v) : v}</p>
                </div>
              ))}
            </div>
          )}

          {tab==="addproduct" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><Plus/> ADD PRODUCT</h3>
              <input placeholder="Product Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} className="w-full p-3 mb-3 rounded-2xl text-black"/>
              <input placeholder="Price ৳" type="number" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} className="w-full p-3 mb-3 rounded-2xl text-black"/>
              <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})} className="w-full p-3 mb-3 rounded-2xl text-black"/>
              <input placeholder="Category" value={newProduct.category} onChange={e=>setNewProduct({...newProduct,category:e.target.value})} className="w-full p-3 mb-3 rounded-2xl text-black"/>
              <button onClick={addProduct} className="w-full bg-green-500 py-3 rounded-2xl font-bold">Add Product</button>
            </div>
          )}

          {tab==="orders" && (
            <div className="bg-white/20 backdrop-blur p-6 rounded-3xl text-white shadow-xl overflow-x-auto">
              <h3 className="text-2xl font-black mb-4">ORDERS</h3>
              <table className="w-full text-sm">
                <thead><tr className="text-left"><th>ID</th><th>Customer</th><th>Total</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.id} className="border-t border-white/20">
                      <td>#{String(o.id).slice(0,8)}</td><td>{o.customer_name || o.phone || 'Guest'}</td><td>{formatPrice(o.total || o.total_amount || 0)}</td>
                      <td className="flex gap-2 py-2">
                        <button onClick={()=>startSatelliteTracking(o)} className="bg-cyan-500 px-3 py-1 rounded text-xs">Track</button>
                        <button onClick={()=>saveToBlockchain(o)} className="bg-yellow-500 px-3 py-1 rounded text-xs text-black">Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab==="products" && (
            <div className="bg-white/20 backdrop-blur p-6 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">PRODUCTS: {products.length}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {products.map(p=>(
                  <div key={p.id} className="bg-white/10 p-4 rounded-2xl">
                    <p className="font-bold">{p.name}</p>
                    <p>{formatPrice(p.price)}</p>
                    <p>Stock: {p.stock}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="googleai" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-3xl font-black mb-4 flex items-center gap-2"><Wand2/> GOOGLE AI GEMINI 2.0</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <button onClick={()=>callGoogleAI("Laptop", "description")} className="bg-white/20 p-4 rounded-2xl">AI Description</button>
                <button onClick={()=>callGoogleAI("Phone", "caption")} className="bg-white/20 p-4 rounded-2xl">Viral Caption</button>
                <button onClick={()=>callGoogleAI("Shoes", "seo")} className="bg-white/20 p-4 rounded-2xl">SEO Keywords</button>
                <button onClick={()=>callGoogleAI("Bag", "script")} className="bg-white/20 p-4 rounded-2xl">Ad Script</button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <button onClick={predictPrice} className="bg-yellow-500/30 p-4 rounded-2xl flex items-center gap-2"><TrendingUp/> Price Predictor</button>
                <button onClick={generateReviews} className="bg-green-500/30 p-4 rounded-2xl flex items-center gap-2"><Star/> Review Generator</button>
                <button onClick={competitorAnalysis} className="bg-red-500/30 p-4 rounded-2xl flex items-center gap-2"><Target/> Competitor AI</button>
              </div>
              <button onClick={()=>generateGoogleImage("Smartphone")} className="w-full bg-white/20 p-4 rounded-2xl mb-3">AI Image</button>
              {googleImage && <img src={googleImage} className="w-full rounded-2xl mb-3"/>}
              {aiLoading && <p>Google AI Thinking...</p>}
              {googleResult && <div className="p-4 bg-white/10 rounded-2xl whitespace-pre-wrap">{googleResult}</div>}
            </div>
          )}

          {tab==="website" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">AI WEBSITE BUILDER</h3>
              <button onClick={buildWebsite} className="bg-white text-black px-6 py-3 rounded-2xl font-bold mb-3">Generate Full Website</button>
              {aiLoading && <p>Building...</p>}
              {websiteCode && <textarea value={websiteCode} readOnly className="w-full h-96 p-3 rounded-2xl text-black font-mono text-xs"/>}
            </div>
          )}

          {tab==="adcampaign" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">AI AD CAMPAIGN</h3>
              <button onClick={createAd} className="bg-white text-black px-6 py-3 rounded-2xl font-bold mb-3">Generate Campaign</button>
              {aiLoading && <p>Creating...</p>}
              {adCampaign && <div className="p-4 bg-white/10 rounded-2xl whitespace-pre-wrap">{adCampaign}</div>}
            </div>
          )}

          {tab==="supportbot" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">AI CUSTOMER SUPPORT BOT</h3>
              <input placeholder="Customer Question" value={supportQuestion} onChange={e=>setSupportQuestion(e.target.value)} className="w-full p-3 mb-3 rounded-2xl text-black"/>
              <button onClick={askSupport} className="bg-white text-black px-6 py-3 rounded-2xl font-bold mb-3">Get AI Answer</button>
              {aiLoading && <p>Thinking...</p>}
              {supportReply && <div className="p-4 bg-white/10 rounded-2xl">{supportReply}</div>}
            </div>
          )}

          {tab==="freeai" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">FREE AI POWER</h3>
              <button onClick={()=>callFreeAI("iPhone 15", "description")} className="bg-white/20 p-4 rounded-2xl mr-2">Description</button>
              <button onClick={()=>generateFreeImage("Smartphone")} className="bg-white/20 p-4 rounded-2xl">AI Image</button>
              {aiLoading && <p>Loading...</p>}
              {geminiResult && <div className="mt-4 p-4 bg-white/10 rounded-2xl">{geminiResult}</div>}
              {aiImage && <img src={aiImage} className="mt-4 rounded-2xl"/>}
            </div>
          )}

          {tab==="chatbot" && (
            <div className="bg-white/20 backdrop-blur p-6 rounded-3xl text-white h-[600px] flex-col shadow-xl">
              <h3 className="text-2xl font-black mb-4">FREE CHATBOT</h3>
              <div className="flex-1 overflow-y-auto mb-3 space-y-2">
                {chatMessages.map((msg,i)=><div key={i} className={`p-3 rounded-xl ${msg.role==='user'? 'bg-blue-500 ml-10' : 'bg-purple-500 mr-10'}`}>{msg.content}</div>)}
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} className="flex-1 p-3 rounded-2xl text-black"/>
                <button onClick={sendChatMessage} className="bg-white text-black px-6 py-3 rounded-2xl">Send</button>
              </div>
            </div>
          )}

          {tab==="logoai" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">FREE LOGO AI</h3>
              <input value={brandName} onChange={e=>setBrandName(e.target.value)} className="w-full p-3 rounded-2xl text-black mb-3"/>
              <button onClick={generateLogo} className="w-full bg-white text-black py-3 rounded-2xl font-bold">Generate Logo</button>
              {logoImage && <img src={logoImage} className="mt-4 w-full bg-white rounded-2xl p-4"/>}
            </div>
          )}

          {tab==="videoai" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">FREE VIDEO AI</h3>
              <button onClick={generateVideo} className="w-full bg-white text-black py-3 rounded-2xl font-bold">Generate Video</button>
              {videoUrl && <video src={videoUrl} controls className="mt-4 w-full rounded-2xl"/>}
            </div>
          )}

          {tab==="tracking" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">LIVE SATELLITE TRACKING</h3>
              <button onClick={()=>startSatelliteTracking(orders[0])} className="bg-white text-black px-6 py-3 rounded-2xl">Start Tracking</button>
              {liveMap && <img src={liveMap} className="mt-4 w-full rounded-2xl"/>}
            </div>
          )}

          {tab==="blockchain" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">BLOCKCHAIN VERIFY</h3>
              <button onClick={()=>saveToBlockchain(orders[0])} className="bg-white text-black px-6 py-3 rounded-2xl">Save to Blockchain</button>
              {blockchainHash && <p className="mt-3 break-all">TX: {blockchainHash}</p>}
            </div>
          )}

          {tab==="settings" && (
            <div className="bg-white/20 backdrop-blur p-5 md:p-8 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-black mb-4">SETTINGS</h3>
              <button onClick={toggleVoice} className={`px-6 py-3 rounded-2xl ${isListening? 'bg-red-500' : 'bg-purple-500'}`}>
                {isListening? "Listening..." : "Voice Command"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}