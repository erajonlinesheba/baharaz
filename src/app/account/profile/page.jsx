"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Shield, Verified, Crown, Mail, Phone, Settings, UserCheck, Sparkles, Upload, Lock, LogOut, Trash2, Bell, Globe, Camera, CheckCircle, AlertTriangle, Package, Heart, MapPin, Edit2, Save } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone: '' });
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, spent: 0 });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState(true);
  const [langPref, setLangPref] = useState('en');

  const getDisplayName = () => {
    const meta = user?.user_metadata || {};
    return (
      profile?.full_name ||
      meta.full_name ||
      meta.name ||
      meta.display_name ||
      meta.user_name ||
      (meta.given_name? `${meta.given_name} ${meta.family_name || ''}`.trim() : null) ||
      meta.preferred_username ||
      user?.email?.split('@')[0] ||
      'Baharaz User'
    );
  };

  const getAvatarUrl = () => {
    const meta = user?.user_metadata || {};
    return (
      profile?.avatar_url ||
      meta.picture ||
      meta.avatar_url ||
      meta.picture_url ||
      meta.avatar ||
      null
    );
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      if (!currentUser) { window.location.href = "/login"; return; }
      setUser(currentUser);
      setEditData({
        full_name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || '',
        phone: currentUser?.user_metadata?.phone || ''
      });
      const savedLang = localStorage.getItem('baharaz-lang');
      if(savedLang) setLangPref(savedLang);
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
      if (prof) {
        setProfile(prof);
        setEditData({ full_name: prof.full_name || currentUser?.user_metadata?.full_name || '', phone: prof.phone || '' });
      }
      try{
        const { data: orderData } = await supabase.from('orders').select('id, total_amount').eq('user_id', currentUser.id);
        const localWish = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]');
        const localOrders = JSON.parse(localStorage.getItem('baharaz_orders')||'[]');
        const totalOrders = (orderData?.length || 0) + localOrders.length;
        const totalSpent = orderData?.reduce((s,o)=>s+(Number(o.total_amount)||0),0) || 0;
        setStats({ orders: totalOrders, wishlist: localWish.length, spent: totalSpent });
      }catch{}
      setLoading(false);
    }
    load();
    const onProfileUpdated = ()=> load();
    window.addEventListener('profileUpdated', onProfileUpdated);
    return ()=> window.removeEventListener('profileUpdated', onProfileUpdated);
  }, []);

  async function handleAvatarUpload(e){
    const file = e.target.files?.[0];
    if(!file || !user) return;
    setUploading(true);
    try{
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if(uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;
      const { error } = await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if(error) throw error;
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl, picture: publicUrl } });
      setProfile(prev=>({...(prev||{}), avatar_url: publicUrl }));
      setImgError(false);
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('authChanged'));
      alert('Avatar Updated! ✅');
    }catch(err){
      alert('Upload Failed: '+err.message);
    }
    setUploading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: editData.full_name,
        phone: editData.phone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      await supabase.auth.updateUser({ data: { full_name: editData.full_name, name: editData.full_name, phone: editData.phone } });
      setProfile(prev => ({...(prev || {}), full_name: editData.full_name, phone: editData.phone }));
      setEditMode(false);
      // ===== MAIN FIX: TopBar + Header Mobile সাথে সাথে Update হবে =====
      localStorage.setItem('eraj_user_cache', JSON.stringify({...user, user_metadata: {...user.user_metadata, full_name: editData.full_name, name: editData.full_name}}));
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('authChanged'));
      window.dispatchEvent(new Event('langChanged'));
      alert('Profile Updated Successfully! ✅ TopBar + Header Updated!');
    } catch (err) {
      alert('Update Failed: ' + err.message);
    }
    setSaving(false);
  }

  async function handlePasswordChange(){
    if(passwordData.newPassword !== passwordData.confirmPassword){
      alert('Passwords do not match!');
      return;
    }
    if(passwordData.newPassword.length < 6){
      alert('Password must be at least 6 characters!');
      return;
    }
    try{
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if(error) throw error;
      alert('Password Updated! ✅');
      setShowPasswordChange(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }catch(err){
      alert('Failed: '+err.message);
    }
  }

  async function handleLogoutAll(){
    try{
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new Event('authChanged'));
      window.location.href = '/';
    }catch{}
  }

  async function handleDeleteAccount(){
    if(!confirm('Are you sure? This will delete your account permanently! This cannot be undone!')) return;
    if(!confirm('Really Delete? Type OK? Last Warning!')) return;
    try{
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      localStorage.clear();
      alert('Account Deleted');
      window.location.href = '/';
    }catch(err){
      alert('Delete Failed: '+err.message);
    }
  }

  if (loading) return <div className="bg-white rounded-[12px] p-10 text-center shadow-sm">Loading Profile...</div>;

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  const memberTier = stats.orders > 10 ? "Platinum" : stats.orders > 3 ? "Gold" : "Silver";

  return (
    <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-sm min-h-[600px] max-w-[900px] mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-[22px] font-black flex items-center gap-2"><Shield className="text-[#f85606]"/> Profile Information</h2>
        <span className="text-[11px] bg-[#e8f5e9] text-[#2e7d32] px-4 py-2 rounded-full font-black border-2 border-green-200 flex items-center gap-1"><Verified size={14}/> Verified • {memberTier} Member</span>
      </div>

      <div className="mt-8 max-w-[520px]">
        <div className="flex items-center gap-5 mb-8 p-6 bg-gradient-to-r from-[#fff8f3] to-[#ffefe3] rounded-[20px] border-2 border-orange-100 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#f85606]/10 rounded-full blur-2xl"></div>
          <div className="relative group">
            <div className="w-[90px] h-[90px] rounded-full bg-white overflow-hidden border-4 border-[#f85606]/20 shadow-xl flex items-center justify-center text-3xl font-black text-[#f85606]">
              {avatarUrl &&!imgError? (
                <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" onError={() => setImgError(true)} className="w-full h-full object-cover" />
              ) : (
                <span className="bg-gradient-to-br from-[#f85606] to-[#ff8a00] bg-clip-text text-transparent">{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-[#f85606] text-white w-7 h-7 rounded-full border-3 border-white flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-black transition shadow-lg">
              {uploading? '...' : <Camera size={12}/>}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
            <div className="absolute -bottom-1 -left-1 bg-green-500 text-white w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black">✓</div>
          </div>
          <div className="relative z-10 flex-1">
            <p className="font-black text-[18px] flex items-center gap-2">{displayName} <Sparkles size={14} className="text-[#f85606]" /></p>
            <p className="text-[12px] text-gray-600 flex items-center gap-1 mt-1"><Mail size={12}/>{user?.email}</p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1"><Phone size={12}/>{profile?.phone || user?.user_metadata?.phone || 'No phone added'}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[9px] bg-black text-white px-2.5 py-1 rounded-full font-black flex items-center gap-1"><Crown size={10}/>{memberTier}</span>
              <span className="text-[9px] bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-bold flex items-center gap-1"><CheckCircle size={10}/>Active</span>
              <span className="text-[9px] bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200 font-bold">📦 {stats.orders} Orders</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black tracking-[1.5px] text-[#888] uppercase flex items-center gap-1"><UserCheck size={12}/>Full Name (Auto Sync to TopBar + Header)</label>
            <div className="relative">
              <input value={editData.full_name} onChange={e=>setEditData({...editData, full_name: e.target.value})} disabled={!editMode} placeholder="Enter full name" className="w-full mt-2 border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[14px] disabled:bg-[#fafafa] focus:border-[#f85606] outline-none transition font-medium shadow-sm" />
              {editMode && <Edit2 size={14} className="absolute right-3 top-[50%] -translate-y-[-4px] text-gray-400"/>}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">This name will show in TopBar as {editData.full_name?.toUpperCase()} + Mobile Header Avatar</p>
          </div>
          <div>
            <label className="text-[10px] font-black tracking-[1.5px] text-[#888] uppercase flex items-center gap-1"><Phone size={12}/>Phone Number</label>
            <input value={editData.phone} onChange={e=>setEditData({...editData, phone: e.target.value})} disabled={!editMode} placeholder="01XXXXXXXXX" className="w-full mt-2 border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[14px] disabled:bg-[#fafafa] focus:border-[#f85606] outline-none transition font-medium shadow-sm" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-[1.5px] text-[#888] uppercase">Email Address - Verified</label>
            <input value={user?.email || ''} disabled className="w-full mt-2 border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[13px] bg-[#fafafa] text-gray-500 font-medium" />
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-2 flex-wrap"><span>User ID: {user?.id?.slice(0,8)}</span> • <span>Joined: {user?.created_at? new Date(user.created_at).getFullYear() : new Date().getFullYear()}</span> • <span>Gmail Photo: {avatarUrl? 'Yes ✓' : 'Letter'}</span></p>
          </div>
        </div>

        <div className="flex gap-3 mt-8 flex-wrap">
          {!editMode? (
            <button onClick={()=>setEditMode(true)} className="bg-black text-white px-8 py-3 rounded-full font-black text-[13px] hover:bg-[#f85606] transition shadow-lg flex items-center gap-2"><Settings size={14}/> Edit Profile</button>
          ) : (
            <>
              <button onClick={saveProfile} disabled={saving} className="bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] hover:bg-black transition shadow-lg flex items-center gap-2 disabled:opacity-50"><Save size={14}/>{saving? 'Saving...' : 'Save Changes ✓'}</button>
              <button onClick={()=>setEditMode(false)} className="bg-[#f5f5f5] px-8 py-3 rounded-full font-black text-[13px] hover:bg-[#e0e0e0] transition border-2">Cancel</button>
            </>
          )}
        </div>

        {/* NEW FUTURE: Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-[#fff8f3] border border-orange-100 rounded-[12px] p-3 text-center">
            <Package size={18} className="mx-auto text-[#f85606] mb-1"/>
            <p className="text-[18px] font-black">{stats.orders}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Orders</p>
          </div>
          <div className="bg-[#fef2f2] border border-red-100 rounded-[12px] p-3 text-center">
            <Heart size={18} className="mx-auto text-red-500 mb-1"/>
            <p className="text-[18px] font-black">{stats.wishlist}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Wishlist</p>
          </div>
          <div className="bg-[#f0fdf4] border border-green-100 rounded-[12px] p-3 text-center">
            <Crown size={18} className="mx-auto text-green-600 mb-1"/>
            <p className="text-[14px] font-black">৳{stats.spent}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Spent</p>
          </div>
        </div>

        {/* NEW FUTURE: Preferences */}
        <div className="mt-8 p-4 bg-[#fafafa] rounded-[12px] border">
          <h3 className="font-black text-[13px] flex items-center gap-2"><Settings size={14}/> Preferences & Settings</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium flex items-center gap-2"><Bell size={12}/> Email Notifications</span>
              <button onClick={()=>setNotifications(!notifications)} className={`w-[40px] h-[22px] rounded-full transition flex items-center px-1 ${notifications? 'bg-[#f85606] justify-end' : 'bg-gray-300 justify-start'}`}><span className="w-[18px] h-[18px] bg-white rounded-full shadow"></span></button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium flex items-center gap-2"><Globe size={12}/> Language: {langPref.toUpperCase()}</span>
              <span className="text-[10px] bg-white border px-2 py-1 rounded-full font-bold">{langPref==='en'? 'English' : 'বাংলা'}</span>
            </div>
          </div>
        </div>

        {/* NEW FUTURE: Security */}
        <div className="mt-6 p-4 bg-white rounded-[12px] border-2 border-gray-100">
          <h3 className="font-black text-[13px] flex items-center gap-2"><Lock size={14}/> Security & Privacy</h3>
          <div className="mt-4 space-y-2">
            <button onClick={()=>setShowPasswordChange(!showPasswordChange)} className="w-full text-left px-4 py-3 bg-[#f9f9f9] hover:bg-black hover:text-white rounded-[10px] text-[12px] font-bold transition flex justify-between items-center"><span className="flex items-center gap-2"><Lock size={12}/> Change Password</span><span>→</span></button>
            {showPasswordChange && (
              <div className="p-4 bg-[#fff8f3] rounded-[10px] border border-orange-100 space-y-3 animate-in">
                <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e=>setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full border-2 rounded-[8px] px-3 py-2 text-[12px] outline-none focus:border-[#f85606]" />
                <input type="password" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={e=>setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full border-2 rounded-[8px] px-3 py-2 text-[12px] outline-none focus:border-[#f85606]" />
                <div className="flex gap-2">
                  <button onClick={handlePasswordChange} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-black">Update Password</button>
                  <button onClick={()=>setShowPasswordChange(false)} className="bg-gray-200 px-4 py-2 rounded-full text-[11px] font-black">Cancel</button>
                </div>
              </div>
            )}
            <button onClick={handleLogoutAll} className="w-full text-left px-4 py-3 bg-[#fef2f2] hover:bg-red-50 rounded-[10px] text-[12px] font-bold transition flex justify-between items-center text-red-600"><span className="flex items-center gap-2"><LogOut size={12}/> Logout All Devices</span><span>→</span></button>
          </div>
        </div>

        {/* NEW FUTURE: Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href="/account/orders" className="p-3 bg-white border rounded-[10px] flex items-center gap-2 text-[12px] font-bold hover:bg-[#fff8f3] transition"><MapPin size={14} className="text-[#f85606]"/> My Orders</a>
          <a href="/account/wishlist" className="p-3 bg-white border rounded-[10px] flex items-center gap-2 text-[12px] font-bold hover:bg-[#fff8f3] transition"><Heart size={14} className="text-red-500"/> Wishlist</a>
        </div>

        {/* NEW FUTURE: Danger Zone */}
        <div className="mt-8 p-4 bg-[#fff5f5] rounded-[12px] border-2 border-red-100">
          <h3 className="font-black text-[13px] flex items-center gap-2 text-red-600"><AlertTriangle size={14}/> Danger Zone</h3>
          <p className="text-[11px] text-gray-500 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount} className="mt-3 bg-white border-2 border-red-200 text-red-600 px-4 py-2 rounded-full text-[11px] font-black hover:bg-red-600 hover:text-white transition flex items-center gap-2"><Trash2 size={12}/> Delete My Account Permanently</button>
        </div>

        <div className="mt-10 p-4 bg-[#f9f9f9] rounded-[12px] border border-dashed">
          <p className="text-[12px] font-bold flex items-center gap-2"><UserCheck size={14} className="text-[#f85606]" /> Why Verified?</p>
          <p className="text-[11px] text-gray-500 mt-1 leading-[16px]">Your Gmail is verified with Baharaz. Your profile photo is auto-synced from Gmail. You are a {displayName} - {memberTier} member with priority support. Avatar upload, name change will instantly update TopBar + Header Mobile + Dashboard.</p>
        </div>
      </div>
    </div>
  );
}