import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q ?? "").trim();
  
  const { data } = q
    ? await supabase.from("fighters").select("id,name,country,weight_class,wins,losses,draws").ilike("name", `%${q}%`).limit(25)
    : { data: [] };

  return (
    <div className="space-y-6 p-4 text-chalk">
      <h1 className="text-3xl font-extrabold tracking-tight">Search Fighters</h1>
      
      <form className="flex gap-2">
        <input 
          name="q" 
          defaultValue={q} 
          placeholder="Search fighters..." 
          aria-label="Search fighters"
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500" 
        />
        <button className="rounded-md bg-red-600 px-5 font-semibold text-white hover:bg-red-700 transition-colors">
          Search
        </button>
      </form>
      
      <div className="mt-4 space-y-2">
        {q && data?.length === 0 && (
          <p className="text-gray-400">No fighters match &quot;{q}&quot;. Try a shorter spelling.</p>
        )}
        
        {data?.map((f: any) => (
          <Link 
            key={f.id} 
            href={`/fighters/${f.id}`} 
            className="flex justify-between items-center rounded-md border border-zinc-800 bg-zinc-900 p-4 hover:border-red-500 transition-colors text-white"
          >
            <span className="font-display text-lg font-semibold">{f.name}</span>
            <span className="text-sm text-gray-400">
              {f.wins ?? 0}-{f.losses ?? 0}-{f.draws ?? 0} {f.weight_class ? `· ${f.weight_class}` : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
