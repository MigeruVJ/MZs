import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 15;

export default async function FighterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch fighter details
  const { data: fighter } = await supabase
    .from("fighters")
    .select("*")
    .eq("id", id)
    .single();

  if (!fighter) notFound();

  // 2. Fetch fights where this fighter is either fighter_a or fighter_b
  const { data: fights } = await supabase
    .from("fights")
    .select(`
      *,
      event:events(id, name, starts_at, city, country),
      a:fighters!fights_fighter_a_fkey(id, name),
      b:fighters!fights_fighter_b_fkey(id, name)
    `)
    .or(`fighter_a.eq.${id},fighter_b.eq.${id}`)
    .order("created_at", { ascending: false });

  const totalFights = (fighter.wins ?? 0) + (fighter.losses ?? 0) + (fighter.draws ?? 0);
  const winRate = totalFights > 0 ? Math.round(((fighter.wins ?? 0) / totalFights) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 text-zinc-900">
      {/* Back Link */}
      <Link 
        href="/fighters" 
        className="inline-flex items-center text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← Back to Fighters Directory
      </Link>

      {/* Fighter Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        {/* Fighter Avatar / Picture */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0 shadow-inner flex items-center justify-center">
          {fighter.image_url ? (
            <img 
              src={fighter.image_url} 
              alt={fighter.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-extrabold text-zinc-300">
              {fighter.name?.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Fighter Meta info */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-red-100 border border-red-200 font-bold text-red-700">
              {fighter.weight_class || "Pro Athlete"}
            </span>
            {fighter.country && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-100 text-zinc-700">
                📍 {fighter.country}
              </span>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
              {fighter.name}
            </h1>
            {fighter.nickname && (
              <p className="text-zinc-500 font-medium italic text-lg">"{fighter.nickname}"</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 border-t border-zinc-100 text-sm">
            <div>
              <span className="text-zinc-400 block text-xs uppercase tracking-wider">Record</span>
              <span className="font-bold text-zinc-900 text-lg">
                {fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-xs uppercase tracking-wider">Win Rate</span>
              <span className="font-bold text-zinc-900 text-lg">{winRate}%</span>
            </div>
            {fighter.gym && (
              <div>
                <span className="text-zinc-400 block text-xs uppercase tracking-wider">Gym/Team</span>
                <span className="font-semibold text-zinc-700">{fighter.gym}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fight History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 tracking-wide">Fight History & Bouts</h2>

        {(!fights || fights.length === 0) && (
          <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white shadow-sm text-zinc-500 text-sm">
            No recorded bouts found for this fighter.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {(fights ?? []).map((f: any) => {
            const isFighterA = f.fighter_a === fighter.id;
            const opponent = isFighterA ? f.b : f.a;
            const won = f.winner_id === fighter.id;
            const lost = f.winner_id && f.winner_id !== fighter.id;

            return (
              <div 
                key={f.id}
                className="p-4 border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      won ? "bg-green-100 text-green-800 border border-green-200" :
                      lost ? "bg-red-100 text-red-800 border border-red-200" :
                      "bg-zinc-100 text-zinc-600"
                    }`}>
                      {won ? "Win" : lost ? "Loss" : "Result TBD"}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      vs. <Link href={`/fighters/${opponent?.id}`} className="font-bold text-zinc-900 hover:text-red-600 underline">{opponent?.name || "Unknown Opponent"}</Link>
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-800">
                    {f.event?.name ? (
                      <Link href={`/events/${f.event.id}`} className="hover:text-red-600 transition-colors">
                        {f.event.name}
                      </Link>
                    ) : "Event Details"}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 text-xs text-zinc-500 gap-1">
                  <span className="font-medium text-zinc-700">{f.method || "Decision"} {f.end_round ? `(R${f.end_round})` : ""}</span>
                  <span>{f.event?.starts_at ? fmtDate(f.event.starts_at) : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}