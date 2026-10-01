import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidar cada minuto

export default async function RankingsPage() {
  // Consultar luchadores ordenados por número de victorias
  const { data: fighters } = await supabase
    .from("fighters")
    .select("id, name, nickname, weight_class, wins, losses, draws, image_url")
    .order("wins", { ascending: false })
    .limit(50);

  // Agrupar por categoría de peso
  const groupedByWeight: { [key: string]: any[] } = {};
  
  (fighters || []).forEach((fighter) => {
    const wc = fighter.weight_class || "Open Weight / Pro";
    if (!groupedByWeight[wc]) {
      groupedByWeight[wc] = [];
    }
    groupedByWeight[wc].push(fighter);
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-10 text-zinc-900">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-200 pb-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          European Fighter Rankings
        </h1>
        <p className="text-sm text-zinc-500">
          Top-performing professional athletes categorized by weight class based on active performance and records.
        </p>
      </div>

      {Object.keys(groupedByWeight).length === 0 ? (
        <div className="p-12 text-center border border-zinc-200 rounded-2xl bg-white text-zinc-500 text-sm shadow-sm">
          No ranking data available yet.
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedByWeight).map(([weightClass, athletes]) => (
            <div key={weightClass} className="space-y-4">
              {/* Weight Class Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-600 rounded-full inline-block"></span>
                  {weightClass}
                </h2>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-md">
                  {athletes.length} {athletes.length === 1 ? "fighter" : "fighters"}
                </span>
              </div>

              {/* Fighters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {athletes.map((fighter, index) => {
                  const isLeader = index === 0;
                  return (
                    <Link
                      key={fighter.id}
                      href={`/fighters/${fighter.id}`}
                      className={`p-4 rounded-2xl bg-white transition-all flex items-center gap-4 group shadow-sm hover:shadow-md ${
                        isLeader 
                          ? "border-2 border-red-500/80 bg-gradient-to-r from-red-50/30 to-white" 
                          : "border border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {/* Position Badge */}
                      <span className={`font-display font-black text-xl w-8 text-center ${
                        isLeader ? "text-red-600" : "text-zinc-300 group-hover:text-zinc-900"
                      }`}>
                        #{index + 1}
                      </span>

                      {/* Fighter Avatar */}
                      <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 ${
                        isLeader ? "ring-2 ring-red-600 ring-offset-2" : "border border-zinc-200"
                      }`}>
                        {fighter.image_url ? (
                          <img src={fighter.image_url} alt={fighter.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-sm bg-zinc-200">
                            {fighter.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Fighter Info */}
                      <div className="flex-1 truncate">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-zinc-900 group-hover:text-red-600 transition-colors truncate">
                            {fighter.name}
                          </h3>
                          {isLeader && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
                              Leader
                            </span>
                          )}
                        </div>
                        {fighter.nickname && (
                          <p className="text-xs text-zinc-400 italic truncate -mt-0.5">
                            &ldquo;{fighter.nickname}&rdquo;
                          </p>
                        )}
                        <div className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-1.5">
                          <span>Record:</span>
                          <span className="text-zinc-900 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">
                            {fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}