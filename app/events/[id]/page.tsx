import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase, fmtDate } from "@/lib/supabase";
import FightPickCard from "@/components/FightPickCard";

export const revalidate = 15;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: event } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("id", id)
    .single();

  if (!event) {
    return { title: "Event Not Found | CombatScore" };
  }

  const title = `${event.name} | CombatScore Live Results`;
  const description = `Live fight card, results, and schedules for ${event.name} in ${event.city}, ${event.country}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15+ compatibility
  const { id } = await params;

  // 1. Obtener la sesión del usuario actual para el Pick 'Em
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const { data: event } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("id", id)
    .single();

  if (!event) notFound();

  const { data: fights } = await supabase
    .from("fights")
    .select("*, a:fighters!fights_fighter_a_fkey(id,name,wins,losses,draws), b:fighters!fights_fighter_b_fkey(id,name,wins,losses,draws)")
    .eq("event_id", id)
    .order("bout_order", { ascending: false });

  // 2. Obtener los pronósticos previos que este usuario haya hecho para este evento
  let userPicksMap: Record<string, string> = {};
  if (userId && fights) {
    const { data: picks } = await supabase
      .from("user_picks")
      .select("fight_id, predicted_fighter_id")
      .eq("user_id", userId)
      .eq("event_id", event.id);

    if (picks) {
      picks.forEach((p: any) => {
        userPicksMap[p.fight_id] = p.predicted_fighter_id;
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 text-zinc-900">
      {/* Back Link */}
      <Link 
        href="/events" 
        className="inline-flex items-center text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← Back to Events
      </Link>

      {/* Event Header */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-red-100 border border-red-200 font-bold text-red-700">
              {event.organizations?.name || "Organization"}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
              event.status === "live" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-100 text-zinc-700"
            }`}>
              {event.status === "live" ? "🔴 LIVE" : event.status || "upcoming"}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 pt-2 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">📅 {fmtDate ? fmtDate(event.starts_at) : event.starts_at}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">📍 {event.city}, {event.country}</span>
          </div>
        </div>
      </div>

      {/* Fight Card & Pick 'Em Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-wide">Fight Card & Picks</h2>
            <p className="text-xs text-zinc-500">Make your predictions for each matchup below</p>
          </div>
          <span className="text-xs font-mono text-zinc-500">{(fights ?? []).length} bouts scheduled</span>
        </div>

        {(!fights || fights.length === 0) && (
          <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white text-zinc-500 text-sm shadow-sm">
            No fights registered for this event yet.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {(fights ?? []).map((f: any) => (
            <div 
              key={f.id} 
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-all space-y-4"
            >
              {/* Fight Metadata */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-100 pb-3">
                <span className="font-semibold text-zinc-600 uppercase tracking-wider">
                  {f.weight_class || "Catchweight"}
                </span>
                <div className="text-center font-medium">
                  {f.status === "live" ? (
                    <span className="text-red-600 font-bold animate-pulse">
                      LIVE · Round {f.current_round}
                    </span>
                  ) : (
                    <span className="text-zinc-500">{f.rounds} Rounds</span>
                  )}
                </div>
                <span className="text-zinc-400 font-mono">
                  {f.is_main_event ? "★ Main Event" : `Bout #${f.bout_order || ""}`}
                </span>
              </div>

              {/* Corners Matchup / Resultados o Votación */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
                <Corner fighter={f.a} color="red" won={f.winner_id === f.a?.id} />
                
                <div className="flex justify-center my-1 md:my-0">
                  <span className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-display font-black text-xs text-zinc-500 shadow-inner">
                    VS
                  </span>
                </div>

                <Corner fighter={f.b} color="blue" won={f.winner_id === f.b?.id} right />
              </div>

              {/* Componente de Pronósticos (Pick 'Em) */}
              <div className="pt-2 border-t border-zinc-100">
                <FightPickCard 
                  fight={{
                    id: f.id,
                    weight_class: f.weight_class,
                    fighter_1_id: f.a?.id,
                    fighter_2_id: f.b?.id,
                    fighter_1: f.a,
                    fighter_2: f.b
                  }}
                  eventId={event.id}
                  userId={userId}
                  initialPick={userPicksMap[f.id]}
                />
              </div>

              {/* Finished Result Banner */}
              {f.status === "finished" && (
                <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-2 text-xs text-center text-zinc-700 bg-zinc-50 p-2.5 rounded-lg">
                  <span className="font-semibold text-red-600 uppercase">Result:</span>
                  <span className="font-medium text-zinc-900">{f.method || "Decision"}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-600">Round {f.end_round || f.rounds}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Corner({ fighter, color, won, right }: any) {
  if (!fighter) return <div className="flex-1 text-zinc-400 text-sm italic">TBD</div>;

  const borderColor = color === "red" ? "border-l-4 border-l-red-600 pl-4" : "border-r-4 border-r-blue-600 pr-4";

  return (
    <Link 
      href={`/fighters/${fighter.id}`} 
      className={`group flex flex-col justify-center ${right ? borderColor.replace('border-r-4', 'border-l-4 md:border-l-0 md:border-r-4 md:pr-4 pl-4 md:pl-0') : borderColor} py-1 transition-colors`}
    >
      <div className={`font-display text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors flex items-center gap-2 ${right ? "md:justify-end" : ""}`}>
        {won && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 font-sans">WIN</span>}
        <span className={won ? "underline decoration-red-600 decoration-2 underline-offset-4" : ""}>
          {fighter.name}
        </span>
      </div>
      <div className="text-xs text-zinc-500 font-mono mt-0.5">
        Record: <span className="text-zinc-700">{fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
      </div>
    </Link>
  );
}