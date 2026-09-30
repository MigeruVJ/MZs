"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function FollowButton({ fighterId }: { fighterId: string }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUserAndFollow() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("fighter_id", fighterId)
        .single();

      if (data) setFollowing(true);
      setLoading(false);
    }

    checkUserAndFollow();
  }, [fighterId]);

  const toggleFollow = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    if (following) {
      await supabase
        .from("follows")
        .delete()
        .eq("user_id", user.id)
        .eq("fighter_id", fighterId);
      setFollowing(false);
    } else {
      await supabase
        .from("follows")
        .insert([{ user_id: user.id, fighter_id: fighterId }]);
      setFollowing(true);
    }
    setLoading(false);
  };

  if (loading) return null;

  return (
    <button 
      onClick={toggleFollow}
      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
        following 
          ? "bg-zinc-200 text-zinc-900 border-zinc-300 hover:bg-zinc-300" 
          : "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800"
      }`}
    >
      {following ? "✓ Following" : "+ Follow Fighter"}
    </button>
  );
}