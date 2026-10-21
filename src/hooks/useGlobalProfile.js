"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useGlobalProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setLoading(false); return; }
    setUser(session.user);
    
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();

    // ✅ REALTIME - DB তে Change হলে সাথে সাথে সব জায়গায় Change
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log('Profile changed:', payload);
        if (payload.new) setProfile(payload.new);
      })
      .subscribe();

    // ✅ EVENT - Profile Page থেকে Change করলে Header/Dashboard Update
    const handleUpdate = () => loadProfile();
    window.addEventListener('profileUpdated', handleUpdate);
    window.addEventListener('authChanged', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('profileUpdated', handleUpdate);
      window.removeEventListener('authChanged', handleUpdate);
    };
  }, []);

  const getAvatarUrl = () => {
    // Priority: Custom Upload > Gmail Picture > Initial
    if (profile?.avatar_url) return profile.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return null;
  };

  const getDisplayName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  return { profile, user, loading, getAvatarUrl, getDisplayName, reload: loadProfile };
}