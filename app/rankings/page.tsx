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

  // Agrupar por categoría de peso de forma sencilla
  const groupedByWeight: { [key: string]: any[] } = {};
  
  (fighters || []).forEach((fighter) => {
    const wc = fighter.weight_class || "Open Weight / Pro";
    if (!groupedByWeight[wc]) {
      groupedByWeight[wc] = [];
    }
    groupedByWeight[wc].push(fighter);
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 text-zinc-900">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          European Fighter Rankings
        </h1>
        <p className="text-sm text-zinc-500">
          Top-performing professional fighters categorized by weight class based on active records.
        </p>
      </div>

      {Object.keys(groupedByWeight).length === 0 ? (
        <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white text-zinc-500 text-sm shadow-sm">
          No ranking data available yet.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByWeight).map(([weightClass, athletes]) => (
            <div key={weightClass} className="space-y-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 border-b border-zinc-200 pb-2 flex items-center justify-between">
                <span>{weightClass}</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  {athletes.length} ranked
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {athletes.map((fighter, index) => (
                  <Link
                    key={fighter.id}
                    href={`/fighters/${fighter.id}`}
                    className="p-4 border border-zinc-200 rounded-xl bg-white shadow-sm hover:border-zinc-300 transition-all flex items-center gap-4 group"
                  >
                    <span className="font-display font-black text-lg text-zinc-300 group-hover:text-red-600 w-6 text-center">
                      #{index + 1}
                    </span>

                    <div className="w-12 h-12 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200">
                      {fighter.image_url ? (
                        <img src={fighter.image_url} alt={fighter.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">
                          {fighter.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 truncate">
                      <h3 className="font-display font-bold text-base text-zinc-900 group-hover:text-red-600 transition-colors truncate">
                        {fighter.name}
                      </h3>
                      <p className="text-xs font-mono text-zinc-500">
                        Record: <span className="text-zinc-700 font-semibold">{fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}