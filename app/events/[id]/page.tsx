import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 15;

export default async function EventPage({ params }: { params: { id: string } }) {
  const { data: event } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("id", params.id)
    .single();

  if (!event) notFound();

  const { data: fights } = await supabase
    .from("fights")
    .select("*, a:fighters!fights_fighter_a_fkey(id,name,wins,losses,draws), b:fighters!fights_fighter_b_fkey(id,name,wins,losses,draws)")
    .eq("event_id", params.id)
    .order("bout_order", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 text-chalk">
      {/* Cabecera del Evento */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl font-black uppercase tracking-widest pointer-events-none">
          {event.status || "upcoming"}
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30 font-bold text-red-400">
              {event.organizations?.name || "Organización"}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
              event.status === "live" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-800 text-gray-300"
            }`}>
              {event.status === "live" ? "🔴 EN VIVO" : event.status || "próximamente"}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pt-2 border-t border-zinc-800/80">
            <span className="flex items-center gap-1.5">📅 {fmtDate(event.starts_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">📍 {event.city}, {event.country}</span>
          </div>
        </div>
      </div>

      {/* Cartelera de Combates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">Cartelera de Combates</h2>
          <span className="text-xs text-zinc-400">{(fights ?? []).length} peleas programadas</span>
        </div>

        {(!fights || fights.length === 0) && (
          <div className="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/50 text-gray-400 text-sm">
            No hay combates registrados para este evento todavía.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {(fights ?? []).map((f: any) => (
            <div 
              key={f.id} 
              className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-md hover:border-zinc-700 transition-all space-y-4"
            >
              {/* Información central superior del combate (Peso / Estado / Rounds) */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-3">
                <span className="font-semibold text-zinc-400 uppercase tracking-wider">
                  {f.weight_class || "Peso Libre"}
                </span>
                <div className="text-center font-medium">
                  {f.status === "live" ? (
                    <span className="text-red-500 font-bold animate-pulse">
                      EN VIVO · Asalto {f.current_round}
                    </span>
                  ) : (
                    <span className="text-zinc-400">{f.rounds} Rounds</span>
                  )}
                </div>
                <span className="text-zinc-500 font-mono">
                  {f.is_main_event ? "★ Main Event" : `Pelea #${f.bout_order || ""}`}
                </span>
              </div>

              {/* Enfrentamiento de Esquinas */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
                <Corner fighter={f.a} color="red" won={f.winner_id === f.a?.id} />
                
                <div className="flex justify-center my-1 md:my-0">
                  <span className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center font-display font-black text-xs text-zinc-500 shadow-inner">
                    VS
                  </span>
                </div>

                <Corner fighter={f.b} color="blue" won={f.winner_id === f.b?.id} right />
              </div>

              {/* Resultado detallado si el combate ya finalizó */}
              {f.status === "finished" && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-center gap-2 text-xs text-center text-zinc-300 bg-zinc-950/40 p-2.5 rounded-lg">
                  <span className="font-semibold text-red-400 uppercase">Resultado:</span>
                  <span className="font-medium text-white">{f.method || "Decisión"}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">Asalto {f.end_round || f.rounds}</span>
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
  if (!fighter) return <div className="flex-1 text-zinc-500 text-sm italic">Por definir</div>;

  const borderColor = color === "red" ? "border-l-4 border-l-red-600 pl-4" : "border-r-4 border-r-blue-600 pr-4";
  const alignment = right ? "md:text-right md:flex-row-reverse" : "md:text-left";

  return (
    <Link 
      href={`/fighters/${fighter.id}`} 
      className={`group flex flex-col justify-center ${right ? borderColor.replace('border-r-4', 'border-l-4 md:border-l-0 md:border-r-4 md:pr-4 pl-4 md:pl-0') : borderColor} py-1 transition-colors`}
    >
      <div className={`font-display text-xl font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-2 ${right ? "md:justify-end" : ""}`}>
        {won && <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 font-sans">VICTORIA</span>}
        <span className={won ? "underline decoration-red-500 decoration-2 underline-offset-4" : ""}>
          {fighter.name}
        </span>
      </div>
      <div className="text-xs text-zinc-400 font-mono mt-0.5">
        Récord: <span className="text-zinc-200">{fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
      </div>
    </Link>
  );
}
