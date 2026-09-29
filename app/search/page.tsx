import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Search({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const { data } = q
    ? await supabase.from("fighters").select("id,name,country,weight_class,wins,losses,draws").ilike("name", `%${q}%`).limit(25)
    : { data: [] };

  return (
    <div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search fighters" aria-label="Search fighters"
          className="flex-1 rounded-md border border-mat bg-white px-3 py-3" />
        <button className="rounded-md bg-ink px-4 text-chalk">Search</button>
      </form>
      <div className="mt-4 space-y-2">
        {q && data?.length === 0 && <p>No fighters match &quot;{q}&quot;. Try a shorter spelling.</p>}
        {data?.map((f: any) => (
          <Link key={f.id} href={`/fighters/${f.id}`} className="flex justify-between rounded-md border border-mat bg-white p-3">
            <span className="font-display text-xl font-semibold">{f.name}</span>
            <span className="text-sm text-ink/70">{f.wins}-{f.losses}-{f.draws} · {f.weight_class}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
