"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SellerLogin() { // <-- à¦à¦‡ à¦²à¦¾à¦‡à¦¨à¦Ÿà¦¾ à¦œà¦°à§à¦°à¦¿
  const [loginType, setLoginType] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    alert(`OTP sent to +880${phone}`);
  }

  const handleEmailLogin = (e) => {
    e.preventDefault();
    alert(`Logging in with: ${email}`);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Banner */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#FF8A00] to-[#E94560] text-white p-6 md:p-12 flex-col justify-center">
        <Image src="/logo.png" width={60} height={60} alt="BAHARAZ"/>
        <h1 className="text-3xl md:text-5xl font-bold mt-4">WELCOME BACK</h1>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FFF7F2] p-5 md:p-8">
        <div className="w-full max-w-md bg-white p-5 md:p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Log in to BaharaZ Seller</h2>
          <p className="text-gray-500 mb-6">Don't have an account? 
            <Link href="/seller-signup" className="text-[#FF8A00] font-semibold"> Sign Up</Link>
          </p>

          <div className="flex border rounded-lg mb-4 p-1">
            <button type="button" onClick={() => setLoginType("phone")} className={`flex-1 py-2 rounded-md font-semibold ${loginType === "phone"? "bg-[#FF8A00] text-white" : "text-gray-600"}`}>Phone</button>
            <button type="button" onClick={() => setLoginType("email")} className={`flex-1 py-2 rounded-md font-semibold ${loginType === "email"? "bg-[#FF8A00] text-white" : "text-gray-600"}`}>Email</button>
          </div>

          {loginType === "phone" && (
            <form onSubmit={handlePhoneLogin}>
              <div className="flex gap-2 mb-4">
                <input value="+880" disabled className="w-20 p-3 border rounded-md bg-gray-100"/>
                <input placeholder="17XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 p-3 border rounded-md" required/>
              </div>
              <button type="submit" className="w-full bg-[#FF8A00] text-white py-3 rounded-md font-bold">Login with OTP</button>
            </form>
          )}

          {loginType === "email" && (
            <form onSubmit={handleEmailLogin}>
              <input type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md mb-4" required/>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-md mb-4" required/>
              <button type="submit" className="w-full bg-[#FF8A00] text-white py-3 rounded-md font-bold">Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
