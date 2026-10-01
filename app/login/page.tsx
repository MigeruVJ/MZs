"import client directive if using client component"
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Check your email! We sent you a magic login link.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to send login link. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 space-y-6">
      <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900">
            Login to <span className="text-red-600">CombatScore</span>
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your email address to receive an instant magic sign-in link.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-medium ${
            message.type === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              required
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white shadow-sm text-zinc-900"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Sending Link..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>
  );
}