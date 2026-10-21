"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { 
  Shield, Verified, Crown, Mail, Phone, 
  UserCheck, CheckCircle, 
  Package, Heart, CreditCard, Gift,
  Award, Calendar, Edit2, Save, X, Settings, Upload
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone: '' });
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, spent: 0, points: 0 });
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const getDisplayName = () => {
    const meta = user?.user_metadata || {};
    return profile?.full_name || meta.full_name || meta.name || user?.email?.split('@')[0] || 'Baharaz User';
  };

  const getAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    const meta = user?.user_metadata || {};
    return profile?.avatar_url || meta.picture || meta.avatar_url || null;
  };

  useEffect(() => {
    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user;
        if (!currentUser) { window.location.href = "/login"; return; }
        
        setUser(currentUser);

        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof);
          setEditData({ 
            full_name: prof.full_name || currentUser?.user_metadata?.full_name || '', 
            phone: prof.phone || ''
          });
        } else {
          setEditData({
            full_name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || '',
            phone: currentUser?.user_metadata?.phone || ''
          });
        }

        try {
          const { data: orderData } = await supabase
            .from('orders')
            .select('id, total_amount, status')
            .eq('user_id', currentUser.id);

          let wishlistCount = 0;
          try {
            const { count } = await supabase
              .from('wishlist')
              .select('id', { count: 'exact' })
              .eq('user_id', currentUser.id);
            wishlistCount = count || 0;
          } catch {
            try {
              const localWish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]');
              wishlistCount = localWish.length;
            } catch { wishlistCount = 0; }
          }

          const totalOrders = orderData?.length || 0;
          const totalSpent = orderData?.reduce((s, o) => s + (Number(o.total_amount) || 0), 0) || 0;
          
          setStats({ 
            orders: totalOrders, 
            wishlist: wishlistCount, 
            spent: totalSpent, 
            points: Math.floor(totalSpent * 0.1) 
          });
        } catch (e) {
          console.log('Stats error:', e);
        }

      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    load();
    
    const onProfileUpdated = () => load();
    window.addEventListener('profileUpdated', onProfileUpdated);
    return () => window.removeEventListener('profileUpdated', onProfileUpdated);
  }, []);

  // ✅ 0 SECOND INSTANT - NO LOADING
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please select JPG, PNG or WEBP image');
      return;
    }

    // ✅ INSTANT PREVIEW - 0 SECOND
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setImgError(false);
    
    // ✅ INSTANT UPDATE EVERYWHERE - Header + Profile
    const tempProfile = { ...(profile || {}), avatar_url: localUrl };
    setProfile(tempProfile);
    window.dispatchEvent(new Event('profileUpdated'));
    window.dispatchEvent(new Event('authChanged'));

    try {
      // Compress in background
      const compressedFile = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height = height * (MAX_SIZE / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = width * (MAX_SIZE / height);
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = () => resolve(file);
        img.src = localUrl;
      });

      const filePath = `${user.id}/avatar_${Date.now()}.jpg`;

      try {
        const { data: oldFiles } = await supabase.storage.from('avatars').list(`${user.id}`);
        if (oldFiles?.length) {
          const toDelete = oldFiles.map(f => `${user.id}/${f.name}`);
          await supabase.storage.from('avatars').remove(toDelete);
        }
      } catch {}

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { 
          upsert: true,
          contentType: 'image/jpeg',
          cacheControl: '3600'
        });

      if (uploadError) {
        if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket')) {
          // Fallback: Save localUrl as base64 if bucket not found
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const base64Url = ev.target.result;
            await supabase.from('profiles').upsert({ 
              id: user.id, 
              avatar_url: base64Url,
              full_name: profile?.full_name || editData.full_name || null,
              phone: profile?.phone || editData.phone || null,
              updated_at: new Date().toISOString() 
            }, { onConflict: 'id' });
            setProfile(prev => ({ ...(prev || {}), avatar_url: base64Url }));
            setPreviewUrl(null);
            window.dispatchEvent(new Event('profileUpdated'));
            window.dispatchEvent(new Event('authChanged'));
          };
          reader.readAsDataURL(file);
          e.target.value = '';
          return;
        } else {
          console.log(uploadError);
          e.target.value = '';
          return;
        }
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl + `?t=${Date.now()}`;

      await supabase.from('profiles').upsert({ 
        id: user.id, 
        avatar_url: publicUrl,
        full_name: profile?.full_name || editData.full_name || null,
        phone: profile?.phone || editData.phone || null,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'id' });

      setProfile(prev => ({ ...(prev || {}), avatar_url: publicUrl }));
      setPreviewUrl(null);
      
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('authChanged'));
      
    } catch (err) {
      console.error('Upload error:', err);
    }
    
    e.target.value = '';
    if (fileRef.current) fileRef.current.value = '';
  }

  async function saveProfile() {
    if (!user) return;
    if (!editData.full_name.trim()) {
      showToast('Full name is required');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: editData.full_name.trim(),
          phone: editData.phone.trim(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error) throw error;

      try {
        await supabase.auth.updateUser({ 
          data: { full_name: editData.full_name, name: editData.full_name } 
        });
      } catch {}

      setProfile(prev => ({ ...(prev || {}), full_name: editData.full_name, phone: editData.phone }));
      setEditMode(false);
      
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('authChanged'));
      showToast('Profile Updated Successfully ✅');
    } catch (err) {
      showToast('Update Failed: ' + err.message);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[16px] p-6 border max-w-[900px] mx-auto h-[200px] animate-pulse">
        <div className="h-6 w-40 bg-gray-100 rounded mb-6"></div>
        <div className="flex gap-4">
          <div className="w-[86px] h-[86px] bg-gray-100 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-32 bg-gray-100 rounded"></div>
            <div className="h-3 w-48 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = getDisplayName();
  const avatarUrl = getAvatarUrl();
  const memberTier = stats.orders > 20 ? "Platinum" : stats.orders > 10 ? "Gold" : stats.orders > 3 ? "Silver" : "Bronze";
  const memberId = user?.id ? `BAH-${user.id.slice(0, 8).toUpperCase()}` : 'BAH-USER';

  return (
    <div className="bg-white rounded-[16px] shadow-sm border max-w-[900px] mx-auto overflow-hidden">
      {toast && (
        <div style={{ zIndex: 2147483647 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold shadow-xl max-w-[90%] text-center">
          {toast}
        </div>
      )}

      {/* Header - Verified Badge Proper Place */}
      <div className="bg-gradient-to-r from-[#fff8f3] to-[#ffefe3] p-6 border-b flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-[20px] font-black flex items-center gap-2"><Shield className="text-[#f85606]" /> Profile Information</h2>
        <div className="flex gap-2">
          <span className="text-[10px] bg-white text-green-700 px-3 py-1.5 rounded-full font-black border flex items-center gap-1 shadow-sm"><Verified size={12} /> Verified Account</span>
          <span className="text-[10px] bg-black text-white px-3 py-1.5 rounded-full font-black flex items-center gap-1"><Crown size={10} /> {memberTier} Member</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gradient-to-r from-[#fafafa] to-white rounded-[20px] border-2 border-gray-50 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#f85606]/5 rounded-full blur-2xl"></div>
          
          {/* ✅ CLEAN AVATAR - No Green Tick, No Camera Button Outside - Only Hover Upload Inside */}
          <div className="relative group">
            <div 
              onClick={() => fileRef.current?.click()}
              className="w-[110px] h-[110px] rounded-full bg-white overflow-hidden border-4 border-white shadow-xl flex items-center justify-center relative cursor-pointer"
            >
              {avatarUrl && !imgError ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  referrerPolicy="no-referrer" 
                  onError={() => setImgError(true)} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="w-full h-full bg-gradient-to-br from-[#f85606] to-[#ff8a00] flex items-center justify-center text-white text-[40px] font-black">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}

              {/* ✅ Hover Inside Upload Icon - Only this stays */}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
                <Upload size={28} className="text-white mb-1" />
                <span className="text-[10px] text-white font-bold">CHANGE</span>
              </div>
            </div>
            
            <input 
              ref={fileRef}
              type="file" 
              accept="image/jpeg,image/png,image/webp,image/jpg" 
              className="hidden" 
              onChange={handleAvatarUpload} 
            />
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-black text-[22px]">{displayName}</p>
              <span className="text-[9px] bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-1 rounded-full font-black border border-green-200">ACTIVE</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-[13px] text-gray-600 flex items-center gap-1.5"><Mail size={13} className="text-gray-400" /> {user?.email}</p>
              <p className="text-[13px] text-gray-600 flex items-center gap-1.5"><Phone size={13} className="text-gray-400" /> {profile?.phone || 'No phone added'} • {memberId}</p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1.5"><Calendar size={11} className="text-gray-400" /> Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'} • {stats.points} Reward Points</p>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[10px] bg-black text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1"><Award size={11} /> {memberTier} Tier</span>
              <span className="text-[10px] bg-[#fff3e6] text-[#f85606] border border-[#ffddc2] px-3 py-1.5 rounded-full font-bold">📦 {stats.orders} Orders</span>
              <span className="text-[10px] bg-[#fef2f2] text-red-600 border border-red-100 px-3 py-1.5 rounded-full font-bold">❤️ {stats.wishlist} Wishlist</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">Click photo to change • Max 5MB • JPG/PNG/WEBP</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#fff8f3] border border-orange-100 rounded-[14px] p-4 text-center hover:shadow-md transition"><Package size={22} className="mx-auto text-[#f85606] mb-2" /><p className="text-[22px] font-black">{stats.orders}</p><p className="text-[10px] font-bold text-gray-500 uppercase">Total Orders</p></div>
          <div className="bg-[#fef2f2] border border-red-100 rounded-[14px] p-4 text-center hover:shadow-md transition"><Heart size={22} className="mx-auto text-red-500 mb-2" /><p className="text-[22px] font-black">{stats.wishlist}</p><p className="text-[10px] font-bold text-gray-500 uppercase">Wishlist</p></div>
          <div className="bg-[#f0fdf4] border border-green-100 rounded-[14px] p-4 text-center hover:shadow-md transition"><CreditCard size={22} className="mx-auto text-green-600 mb-2" /><p className="text-[18px] font-black">৳{stats.spent}</p><p className="text-[10px] font-bold text-gray-500 uppercase">Total Spent</p></div>
          <div className="bg-[#fffbeb] border border-yellow-100 rounded-[14px] p-4 text-center hover:shadow-md transition"><Gift size={22} className="mx-auto text-yellow-600 mb-2" /><p className="text-[22px] font-black">{stats.points}</p><p className="text-[10px] font-bold text-gray-500 uppercase">Reward Points</p></div>
        </div>

        <div className="mt-8 space-y-5 max-w-[520px]">
          <div>
            <label className="text-[10px] font-black tracking-[1px] text-[#888] uppercase flex items-center gap-1"><UserCheck size={12} /> Full Name</label>
            <div className="relative mt-2">
              <input value={editData.full_name} onChange={e => setEditData({ ...editData, full_name: e.target.value })} disabled={!editMode} placeholder="Enter your full name" className="w-full border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[14px] disabled:bg-[#fafafa] focus:border-[#f85606] outline-none font-medium shadow-sm" />
              {editMode && <Edit2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Displayed in header and checkout</p>
          </div>

          <div>
            <label className="text-[10px] font-black tracking-[1px] text-[#888] uppercase flex items-center gap-1"><Phone size={12} /> Phone Number</label>
            <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} disabled={!editMode} placeholder="01XXXXXXXXX" className="w-full mt-2 border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[14px] disabled:bg-[#fafafa] focus:border-[#f85606] outline-none font-medium shadow-sm" />
          </div>

          <div>
            <label className="text-[10px] font-black tracking-[1px] text-[#888] uppercase">Email Address</label>
            <input value={user?.email || ''} disabled className="w-full mt-2 border-2 border-gray-100 rounded-[12px] px-4 py-3 text-[13px] bg-[#fafafa] text-gray-500 font-medium" />
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-[#e8f5e9] text-green-700 px-2.5 py-1 rounded-full font-bold border border-green-200 flex items-center gap-1"><CheckCircle size={10} /> Verified Email</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-bold">ID: {memberId}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="bg-black text-white px-8 py-3 rounded-full font-black text-[13px] hover:bg-[#f85606] transition shadow-lg flex items-center gap-2"><Settings size={14} /> Edit Profile</button>
            ) : (
              <>
                <button onClick={saveProfile} disabled={saving} className="bg-[#f85606] text-white px-8 py-3 rounded-full font-black text-[13px] hover:bg-black transition shadow-lg flex items-center gap-2 disabled:opacity-50">{saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}</button>
                <button onClick={() => setEditMode(false)} className="bg-[#f5f5f5] px-8 py-3 rounded-full font-black text-[13px] border hover:bg-gray-200 transition flex items-center gap-2"><X size={14} /> Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}