"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FightPickCard({ 
  fight, 
  eventId, 
  userId, 
  initialPick 
}: { 
  fight: any; 
  eventId: string; 
  userId?: string; 
  initialPick?: string; 
}) {
  const [selectedFighter, setSelectedFighter] = useState<string | null>(initialPick || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePick = async (fighterId: string) => {
    if (!userId) {
      alert("You must be logged in to make a pick!");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Upsert (insertar o actualizar el pronóstico para esta pelea)
    const { error } = await supabase
      .from("user_picks")
      .upsert({
        user_id: userId,
        event_id: eventId,
        fight_id: fight.id,
        predicted_fighter_id: fighterId,
      }, { onConflict: "user_id,fight_id" });

    setLoading(false);

    if (error) {
      setMessage("Error saving pick");
    } else {
      setSelectedFighter(fighterId);
      setMessage("Pick saved! 🔥");
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="p-4 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-3">
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 text-center">
        {fight.weight_class || "Main Card"}
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Luchador 1 */}
        <button
          onClick={() => handlePick(fight.fighter_1_id)}
          disabled={loading}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
            selectedFighter === fight.fighter_1_id
              ? "border-corner-red bg-red-50 text-corner-red shadow-sm"
              : "border-zinc-200 hover:border-zinc-400 bg-zinc-50/50"
          }`}
        >
          <span className="font-display font-bold text-sm md:text-base line-clamp-1">
            {fight.fighter_1?.name || "Fighter 1"}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-zinc-200">
            Pick Red Corner
          </span>
        </button>

        {/* Luchador 2 */}
        <button
          onClick={() => handlePick(fight.fighter_2_id)}
          disabled={loading}
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
            selectedFighter === fight.fighter_2_id
              ? "border-corner-red bg-red-50 text-corner-red shadow-sm"
              : "border-zinc-200 hover:border-zinc-400 bg-zinc-50/50"
          }`}
        >
          <span className="font-display font-bold text-sm md:text-base line-clamp-1">
            {fight.fighter_2?.name || "Fighter 2"}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-zinc-200">
            Pick Blue Corner
          </span>
        </button>
      </div>

      {message && (
        <p className="text-xs font-mono text-center text-corner-red font-semibold animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}