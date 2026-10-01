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
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-zinc-900">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Search Fighters</h1>
        <p className="text-sm text-zinc-500">
          Find professional MMA and boxing fighters across Europe instantly.
        </p>
      </div>
      
      <form className="flex gap-2">
        <input 
          name="q" 
          defaultValue={q} 
          placeholder="Search fighters by name..." 
          aria-label="Search fighters"
          className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm" 
        />
        <button className="rounded-xl bg-zinc-900 px-6 py-3 font-bold text-white hover:bg-zinc-800 transition-colors shadow-sm text-sm">
          Search
        </button>
      </form>
      
      <div className="mt-4 space-y-3">
        {q && data?.length === 0 && (
          <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white text-zinc-500 text-sm shadow-sm">
            No fighters match &ldquo;{q}&rdquo;. Try a shorter spelling.
          </div>
        )}
        
        {data?.map((f: any) => (
          <Link 
            key={f.id} 
            href={`/fighters/${f.id}`} 
            className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 transition-all shadow-sm text-zinc-900"
          >
            <span className="font-display text-lg font-bold">{f.name}</span>
            <span className="text-xs font-mono text-zinc-500">
              {f.wins ?? 0}-{f.losses ?? 0}-{f.draws ?? 0} {f.weight_class ? `· ${f.weight_class}` : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}