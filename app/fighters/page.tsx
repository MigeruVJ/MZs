import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FightersPage() {
  const { data: fighters, error } = await supabase
    .from("fighters")
    .select("id, name, nickname, weight_class, sport, wins, losses, draws, country");

  // Ordenamiento alfabético seguro en JavaScript (insensible a mayúsculas y acentos)
  const sortedFighters = fighters 
    ? [...fighters].sort((a, b) => (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }))
    : [];

  return (
    <div className="space-y-6 p-4 text-chalk">
      <h1 className="text-3xl font-extrabold tracking-tight">Fighters Directory</h1>
      
      {error && (
        <div className="p-4 border border-red-500 rounded bg-red-950 text-red-200">
          <p className="font-bold">Database Error:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedFighters.map((fighter) => (
          <Link 
            key={fighter.id} 
            href={`/fighters/${fighter.id}`}
            className="p-5 border border-zinc-800 rounded-lg bg-zinc-900 shadow-md flex flex-col justify-between hover:border-red-500 transition-colors text-white"
          >
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{fighter.name}</h2>
                <span className="text-xs uppercase px-2 py-1 rounded bg-zinc-800 font-semibold text-zinc-300">
                  {fighter.sport || "mma"}
                </span>
              </div>
              {fighter.nickname && (
                <p className="text-sm italic text-gray-400 mt-1">&quot;{fighter.nickname}&quot;</p>
              )}
              <p className="text-sm mt-3 text-gray-300">
                <span className="font-medium text-white">Weight Class:</span> {fighter.weight_class || "N/A"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Country:</span> {fighter.country || "Unknown"}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-sm font-semibold text-gray-200">
              <span>Record: {fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}