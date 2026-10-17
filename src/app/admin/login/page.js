"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = "erajshophelp@gmail.com";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const signedInEmail = data.user.email?.toLowerCase();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError && !profileError.message.includes("relation") && !profileError.message.includes("profiles")) {
      setError(profileError.message);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile?.role !== "admin" && signedInEmail !== ADMIN_EMAIL) {
      setError(`You are signed in as ${data.user.email}. This account is not an admin.`);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-5 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Panel Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-4" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-6" required />
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
            {loading ? "Login à¦¹à¦šà§à¦›à§‡..." : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
