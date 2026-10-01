"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Send Magic Link via Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email inbox for the magic access link!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 md:p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm text-zinc-900 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Login to Combat<span className="text-corner-red">Score</span>
        </h1>
        <p className="text-sm text-zinc-500">
          Enter your email address to receive a instant magic sign-in link.
        </p>
      </div>

      {message && (
        <div className={`p-3 text-xs rounded-xl text-center font-semibold border ${
          message.includes("Check your email") 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Email Address
          </label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Send Magic Link"}
        </button>
      </form>
    </div>
  );
}