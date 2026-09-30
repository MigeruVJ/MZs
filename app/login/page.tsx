"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Enviar Magic Link o iniciar sesión
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("¡Revisa tu correo electrónico para ver el enlace de acceso!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm text-zinc-900 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Acceso a CombatScore</h1>
        <p className="text-sm text-zinc-500">Inicia sesión para seguir luchadores y guardar tus pronósticos.</p>
      </div>

      {message && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 uppercase">Correo Electrónico</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Enviando enlace..." : "Enviar Enlace de Acceso"}
        </button>
      </form>
    </div>
  );
}