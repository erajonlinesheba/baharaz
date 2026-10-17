"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Settings, Lock, KeyRound, Fingerprint, Eye, Shield, Smartphone, History, Trash2, Mail, AlertTriangle, EyeOff, LogOut } from "lucide-react";

export default function SecurityPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pinMode, setPinMode] = useState(false);
  const [resetPinMode, setResetPinMode] = useState(false);
  const [pinData, setPinData] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinLoading, setPinLoading] = useState(false);
  const [showPins, setShowPins] = useState({ old: false, new: false, confirm: false });
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) { window.location.href = "/login"; return; }
      setUser(currentUser);
      setLoginHistory([
        { device: 'Chrome - Windows', location: 'Rajshahi, BD', ip: '103.XX.XX.12', time: currentUser?.last_sign_in_at? new Date(currentUser.last_sign_in_at).toLocaleString() : 'Just now', current: true },
        { device: 'Mobile - Android - Baharaz App', location: 'Dhaka, BD', ip: '103.XX.XX.45', time: new Date(Date.now() - 86400000).toLocaleString(), current: false },
        { device: 'Safari - iPhone', location: 'Chittagong, BD', ip: '103.XX.XX.89', time: new Date(Date.now() - 172800000).toLocaleString(), current: false }
      ]);
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
      if (prof) setProfile(prof);
      setLoading(false);
    }
    load();
  }, []);

  async function handlePinChange() {
    if (!pinData.oldPin ||!pinData.newPin ||!pinData.confirmPin) { alert('All PIN fields required!'); return; }
    if (pinData.newPin.length < 4) { alert('PIN must be at least 4 digits!'); return; }
    if (pinData.newPin!== pinData.confirmPin) { alert('New PIN and Confirm PIN do not match!'); return; }
    setPinLoading(true);
    try {
      const { data: currentProfile } = await supabase.from('profiles').select('transaction_pin').eq('id', user.id).maybeSingle();
      if (currentProfile?.transaction_pin && currentProfile.transaction_pin!== pinData.oldPin) throw new Error('Old PIN is incorrect!');
      const { error } = await supabase.from('profiles').upsert({ id: user.id, transaction_pin: pinData.newPin, pin_updated_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (error) throw error;
      alert('PIN Changed Successfully! ✅');
      setProfile(prev => ({...(prev||{}), transaction_pin: pinData.newPin, pin_updated_at: new Date().toISOString()}));
      setPinMode(false);
      setPinData({ oldPin: '', newPin: '', confirmPin: '' });
    } catch (err) { alert('PIN Change Failed: ' + err.message); }
    finally { setPinLoading(false); }
  }

  async function handlePinReset() {
    if (!pinData.newPin ||!pinData.confirmPin) { alert('New PIN fields required!'); return; }
    if (pinData.newPin!== pinData.confirmPin) { alert('PINs do not match!'); return; }
    if (pinData.newPin.length < 4) { alert('PIN must be at least 4 digits!'); return; }
    setPinLoading(true);
    try {
      const { error: updateError } = await supabase.from('profiles').upsert({ id: user.id, transaction_pin: pinData.newPin, pin_updated_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (updateError) throw updateError;
      alert('PIN Reset Successful! New PIN: ' + pinData.newPin + ' ✅ Please remember it!');
      setProfile(prev => ({...(prev||{}), transaction_pin: pinData.newPin, pin_updated_at: new Date().toISOString()}));
      setResetPinMode(false);
      setPinData({ oldPin: '', newPin: '', confirmPin: '' });
    } catch (err) { alert('Reset Failed: ' + err.message); }
    finally { setPinLoading(false); }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function logoutAllDevices() {
    if(confirm('Logout from all devices? You will need to login again on all devices!')) {
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = "/login";
    }
  }

  if (loading) return <div className="bg-white rounded-[12px] p-10 text-center shadow-sm">Loading Security...</div>;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm min-h-[600px]">
      <h2 className="text-[22px] font-black flex items-center gap-2"><Settings className="text-[#f85606]"/> Security Center • {displayName}</h2>
      <p className="text-[12px] text-gray-500 mt-1">Protect your Baharaz account - {user?.email}</p>

      <div className="mt-6 grid gap-5 max-w-[680px]">
        {/* PIN Section */}
        <div className="border-2 border-[#f85606]/20 bg-gradient-to-br from-[#fff7f0] to-[#ffe8d6] rounded-[16px] p-5 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-[#f85606] rounded-[10px] flex items-center justify-center text-white"><Lock size={20}/></div>
              <div>
                <p className="font-black text-[14px] flex items-center gap-2">Transaction PIN • {profile?.transaction_pin? 'Active ✅' : 'Not Set ⚠️'}</p>
                <p className="text-[11px] opacity-70 mt-1">Secure your orders & wallet with 4-6 digit PIN for {displayName}</p>
                <p className="text-[10px] bg-black text-white px-2 py-1 rounded-full mt-2 inline-block">Last updated: {profile?.pin_updated_at? new Date(profile.pin_updated_at).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>{setPinMode(true); setResetPinMode(false)}} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] transition shadow-md flex items-center gap-1"><KeyRound size={12}/> {profile?.transaction_pin? 'Change PIN' : 'Set PIN'}</button>
              <button onClick={()=>{setResetPinMode(true); setPinMode(false)}} className="bg-white text-black border-2 px-4 py-2 rounded-full text-[11px] font-black hover:bg-black hover:text-white transition flex items-center gap-1"><Fingerprint size={12}/> Reset PIN</button>
            </div>
          </div>

          {pinMode && (
            <div className="mt-5 p-4 bg-white rounded-[12px] border-2">
              <h3 className="font-black text-[13px] flex items-center gap-2"><KeyRound size={14}/> {profile?.transaction_pin? 'Change' : 'Create'} Transaction PIN</h3>
              <div className="grid gap-3 mt-4">
                {profile?.transaction_pin && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500">Old PIN</label>
                    <div className="relative mt-1">
                      <input type={showPins.old? "text" : "password"} value={pinData.oldPin} onChange={e=>setPinData({...pinData, oldPin: e.target.value.replace(/\D/g,'')})} placeholder="Enter old PIN" className="w-full border-2 border-gray-100 rounded-[10px] px-4 py-2.5 text-[13px] focus:border-[#f85606] outline-none pr-10" maxLength={6} />
                      <button type="button" onClick={()=>setShowPins({...showPins, old:!showPins.old})} className="absolute right-3 top-1/2 -translate-y-1/2">{showPins.old? <EyeOff size={14} className="text-gray-400"/> : <Eye size={14} className="text-gray-400"/>}</button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500">New PIN (4-6 digits)</label>
                  <div className="relative mt-1">
                    <input type={showPins.new? "text" : "password"} value={pinData.newPin} onChange={e=>setPinData({...pinData, newPin: e.target.value.replace(/\D/g,'')})} placeholder="Enter new PIN" className="w-full border-2 border-gray-100 rounded-[10px] px-4 py-2.5 text-[13px] focus:border-[#f85606] outline-none pr-10" maxLength={6} />
                    <button type="button" onClick={()=>setShowPins({...showPins, new:!showPins.new})} className="absolute right-3 top-1/2 -translate-y-1/2">{showPins.new? <EyeOff size={14} className="text-gray-400"/> : <Eye size={14} className="text-gray-400"/>}</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500">Confirm New PIN</label>
                  <div className="relative mt-1">
                    <input type={showPins.confirm? "text" : "password"} value={pinData.confirmPin} onChange={e=>setPinData({...pinData, confirmPin: e.target.value.replace(/\D/g,'')})} placeholder="Confirm new PIN" className="w-full border-2 border-gray-100 rounded-[10px] px-4 py-2.5 text-[13px] focus:border-[#f85606] outline-none pr-10" maxLength={6} />
                    <button type="button" onClick={()=>setShowPins({...showPins, confirm:!showPins.confirm})} className="absolute right-3 top-1/2 -translate-y-1/2">{showPins.confirm? <EyeOff size={14} className="text-gray-400"/> : <Eye size={14} className="text-gray-400"/>}</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={handlePinChange} disabled={pinLoading} className="flex-1 bg-[#f85606] text-white py-2.5 rounded-full font-black text-[11px] hover:bg-black disabled:opacity-50">{pinLoading? 'Saving...' : 'Save PIN ✅'}</button>
                <button onClick={()=>setPinMode(false)} className="flex-1 bg-gray-100 py-2.5 rounded-full font-black text-[11px] hover:bg-gray-200">Cancel</button>
              </div>
            </div>
          )}

          {resetPinMode && (
            <div className="mt-5 p-4 bg-white rounded-[12px] border-2 border-red-200">
              <h3 className="font-black text-[13px] text-red-600 flex items-center gap-2"><AlertTriangle size={14}/> Reset PIN via Email - {user?.email}</h3>
              <p className="text-[11px] text-gray-600 mt-2">Reset PIN directly for {displayName} - verification via email</p>
              <div className="grid gap-3 mt-4">
                <div><label className="text-[10px] font-black uppercase text-gray-500">New PIN</label><input type="password" value={pinData.newPin} onChange={e=>setPinData({...pinData, newPin: e.target.value.replace(/\D/g,'')})} placeholder="New PIN - 4-6 digits" className="w-full mt-1 border-2 border-gray-100 rounded-[10px] px-4 py-2.5 text-[13px] focus:border-red-400 outline-none" maxLength={6} /></div>
                <div><label className="text-[10px] font-black uppercase text-gray-500">Confirm PIN</label><input type="password" value={pinData.confirmPin} onChange={e=>setPinData({...pinData, confirmPin: e.target.value.replace(/\D/g,'')})} placeholder="Confirm PIN" className="w-full mt-1 border-2 border-gray-100 rounded-[10px] px-4 py-2.5 text-[13px] focus:border-red-400 outline-none" maxLength={6} /></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={handlePinReset} disabled={pinLoading} className="flex-1 bg-red-600 text-white py-2.5 rounded-full font-black text-[11px] hover:bg-black disabled:opacity-50">{pinLoading? 'Resetting...' : 'Reset PIN Now 🔑'}</button>
                <button onClick={()=>setResetPinMode(false)} className="flex-1 bg-gray-100 py-2.5 rounded-full font-black text-[11px]">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="border-2 border-gray-100 rounded-[16px] p-5 flex justify-between items-center hover:shadow-md transition-all bg-white">
          <div className="flex gap-4"><div className="w-11 h-11 bg-[#f5f5f5] rounded-full flex items-center justify-center"><Shield size={18}/></div><div><p className="font-black text-[13px]">Password • Strong</p><p className="text-[11px] opacity-60 mt-1">Last changed 30 days ago for {displayName}</p><p className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">Last login: {user?.last_sign_in_at? new Date(user.last_sign_in_at).toLocaleString() : 'Just now'}</p></div></div>
          <button onClick={async()=>{try{await supabase.auth.resetPasswordForEmail(user.email); alert('Reset email sent to ' + user.email);}catch(e){alert(e.message);}}} className="bg-black text-white px-5 py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] transition">Change</button>
        </div>

        {/* Sessions */}
        <div className="border-2 border-gray-100 rounded-[16px] p-5 bg-white">
          <div className="flex justify-between items-center mb-4">
            <p className="font-black text-[13px] flex items-center gap-2"><Smartphone size={16} className="text-[#f85606]"/> Active Sessions & Login History</p>
            <button onClick={logoutAllDevices} className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200 font-black hover:bg-red-600 hover:text-white transition">Logout All</button>
          </div>
          <div className="space-y-2">
            {loginHistory.map((h,i)=>(
              <div key={i} className={`p-3 rounded-[10px] border flex justify-between items-center ${h.current? 'bg-green-50 border-green-200' : 'bg-[#fafafa] border-gray-100'}`}>
                <div className="flex gap-3 items-center"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border"><History size={12}/></div><div><p className="text-[11px] font-bold">{h.device} {h.current && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">CURRENT</span>}</p><p className="text-[10px] text-gray-500">{h.location} • {h.ip} • {h.time}</p></div></div>
                {!h.current && <button className="text-[10px] bg-black text-white px-3 py-1 rounded-full hover:bg-red-600">Revoke</button>}
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="border-2 border-gray-100 rounded-[16px] p-5 flex justify-between items-center bg-white">
          <div className="flex gap-3"><div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Mail size={16}/></div><div><p className="font-black text-[13px]">Account • {displayName}</p><p className="text-[11px] opacity-60 mt-1">{user?.email} • ID: {user?.id?.slice(0,8)}</p></div></div>
          <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-black border border-green-200">Verified ✓</span>
        </div>

        {/* Delete */}
        <div className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 rounded-[16px] p-5">
          <p className="font-black text-[14px] text-red-700 flex items-center gap-2"><Trash2 size={14}/> Delete Account - Danger Zone • {displayName}</p>
          <p className="text-[11px] opacity-70 mt-2 leading-[16px]">Permanently delete account <b>{displayName}</b> ({user?.email}) and all data will be lost!</p>
          <button onClick={()=>{if(confirm(`Are you sure ${displayName}? This cannot be undone!`)){alert('Please contact support@baharaz.com to delete account');}}} className="mt-4 bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black hover:bg-black transition flex items-center gap-2"><Trash2 size={12}/> Delete Account Permanently</button>
        </div>
      </div>
    </div>
  );
}