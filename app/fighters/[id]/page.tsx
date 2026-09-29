import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FightersPage() {
  const { data: fighters, error } = await supabase
    .from("fighters")
    .select("id, name, nickname, weight_class, sport, wins, losses, draws, country")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Fighters</h1>
      
      {error && (
        <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
          <p className="font-bold">Error loading fighters:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {!error && (!fighters || fighters.length === 0) && (
        <p className="text-muted-foreground">No fighters found in the database.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fighters?.map((fighter) => (
          <Link 
            key={fighter.id} 
            href={`/fighters/${fighter.id}`}
            className="p-4 border rounded-lg bg-card shadow-sm flex flex-col justify-between hover:border-primary transition-colors block"
          >
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{fighter.name}</h2>
                <span className="text-xs uppercase px-2 py-1 rounded bg-secondary font-semibold">
                  {fighter.sport || "mma"}
                </span>
              </div>
              {fighter.nickname && (
                <p className="text-sm italic text-muted-foreground">"{fighter.nickname}"</p>
              )}
              <p className="text-sm mt-2">
                <span className="font-medium">Weight Class:</span> {fighter.weight_class || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Country:</span> {fighter.country || "Unknown"}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm font-semibold">
              <span>Record: {fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}