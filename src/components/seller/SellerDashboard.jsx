"use client";
import { useState } from 'react';
import {
  Mail, MapPin, CreditCard, Package, Plus, X, Megaphone, Ticket, Truck,
  Coins, BookOpen, Bell, CheckCircle, Circle, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const onboardingSteps = [
  { id: 1, title: "Verify Email", desc: "Confirm your seller email", icon: Mail, status: "completed" },
  { id: 2, title: "Add Address", desc: "Add your pick-up address", icon: MapPin, status: "active" },
  { id: 3, title: "ID & Bank", desc: "Submit NID and bank details", icon: CreditCard, status: "pending" },
  { id: 4, title: "List Product", desc: "Add your first product", icon: Package, status: "pending" },
];

const toolkitItems = [
  { id: 1, title: "Marketing Solutions", desc: "Ads & Campaigns", icon: Megaphone, color: "bg-blue-100 text-blue-600" },
  { id: 2, title: "Regular Voucher", desc: "Create discounts", icon: Ticket, color: "bg-purple-100 text-purple-600" },
  { id: 3, title: "Free Shipping", desc: "Shipping programs", icon: Truck, color: "bg-green-100 text-green-600" },
  { id: 4, title: "Coins Discount", desc: "Reward customers", icon: Coins, color: "bg-yellow-100 text-yellow-600" },
  { id: 5, title: "Education/Guides", desc: "Seller University", icon: BookOpen, color: "bg-orange-100 text-orange-600" },
];

const notifications = [
  { id: 1, title: "Policy Update", message: "New return policy will be active from 15 Sep 2026", time: "2 hours ago" },
  { id: 2, title: "Low Stock Alert", message: "3 products are running low on stock", time: "1 day ago" },
];

export default function DashboardHome() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [steps, setSteps] = useState(onboardingSteps);

  const handleAddAddress = () => {
    setSteps(steps.map(s => s.id === 2? {...s, status: "completed"} : s.id === 3? {...s, status: "active"} : s));
    toast.success("Pick-up address added!");
    setShowAddressModal(false);
  }

  return (
    <div className="space-y-6">
      {/* ===== 1. TO-DO / ONBOARDING STEPPER ===== */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg md:text-xl font-bold mb-4">Seller Onboarding Checklist</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {step.status === "completed" && <CheckCircle className="text-green-500" size={24}/>}
                {step.status === "active" && <Circle className="text-orange-500" size={24} fill="#f97316"/>}
                {step.status === "pending" && <Circle className="text-gray-300" size={24}/>}
              </div>
              <div>
                <p className={`font-semibold text-sm ${step.status === "active"? "text-orange-600" : "text-gray-800"}`}>{step.title}</p>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight size={16} className="hidden md:block text-gray-300 mt-1"/>}
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2. TASK ACTION CARD ===== */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl flex items-center justify-center">
            <MapPin size={32} className="text-gray-400"/>
          </div>
          <div>
            <h4 className="font-bold text-base md:text-lg">Add a pick-up address</h4>
            <p className="text-sm text-gray-500">This helps us collect orders from your location</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddressModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          <Plus size={18}/> Add
        </button>
      </div>

      {/* ===== 3. IMPORTANT NOTIFICATIONS BAR ===== */}
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={18} className="text-orange-600"/>
          <h3 className="font-bold text-orange-800">Important Notifications</h3>
        </div>
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="bg-white p-3 rounded-lg">
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-xs text-gray-600">{n.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 4. POPULAR TOOLKIT GRID ===== */}
      <div>
        <h3 className="text-lg md:text-xl font-bold mb-4">Popular Toolkit</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {toolkitItems.map(item => (
            <div
              key={item.id}
              onClick={() => toast(`${item.title} Clicked`)}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:shadow-md hover:border-orange-300 transition cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                <item.icon size={24}/>
              </div>
              <p className="font-bold text-sm group-hover:text-orange-600">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ADD ADDRESS MODAL ===== */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Pick-up Address</h3>
              <button onClick={() => setShowAddressModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={(e)=>{e.preventDefault(); handleAddAddress();}} className="space-y-4">
              <input placeholder="Contact Person Name" className="w-full border p-3 rounded-lg" required/>
              <input placeholder="Phone Number" className="w-full border p-3 rounded-lg" required/>
              <textarea placeholder="Full Address" className="w-full border p-3 rounded-lg h-20" required></textarea>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600">Save Address</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}