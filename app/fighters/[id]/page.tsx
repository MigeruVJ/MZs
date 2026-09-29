import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 60;

export default async function FighterPage({ params }: { params: { id: string } }) {
  const { data: f } = await supabase.from("fighters").select("*").eq("id", params.id).single();
  if (!f) notFound();

  const { data: fights } = await supabase
    .from("fights")
    .select("id,status,method,end_round,winner_id,events(id,name,starts_at), a:fighters!fights_fighter_a_fkey(id,name), b:fighters!fights_fighter_b_fkey(id,name)")
    .or(`fighter_a.eq.${f.id},fighter_b.eq.${f.id}`);

  const sorted = (fights ?? []).sort((x: any, y: any) => +new Date(y.events.starts_at) - +new Date(x.events.starts_at));
  const wins = Math.max(f.wins, 1);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold">{f.name}</h1>
      <p className="text-ink/70">{[f.nickname && `"${f.nickname}"`, f.weight_class, f.country].filter(Boolean).join(" · ")}</p>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Wins" value={f.wins} /><Stat label="Losses" value={f.losses} /><Stat label="Draws" value={f.draws} />
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold">How the wins came</h2>
      <div className="mt-2 flex h-4 overflow-hidden rounded bg-mat" role="img" aria-label="Win method split">
        <div style={{ width: `${(f.ko_wins / wins) * 100}%` }} className="bg-corner-red" />
        <div style={{ width: `${(f.sub_wins / wins) * 100}%` }} className="bg-corner-blue" />
        <div style={{ width: `${(f.dec_wins / wins) * 100}%` }} className="bg-ink" />
      </div>
      <p className="mt-1 text-sm text-ink/70">KO/TKO {f.ko_wins} · Submission {f.sub_wins} · Decision {f.dec_wins}</p>

      <h2 className="mt-8 font-display text-2xl font-bold">Fights</h2>
      {sorted.map((x: any) => {
        const opp = x.a.id === f.id ? x.b : x.a;
        const result = x.status !== "finished" ? "Upcoming" : x.winner_id === f.id ? "Win" : x.winner_id ? "Loss" : "Draw";
        return (
          <Link key={x.id} href={`/events/${x.events.id}`} className="mt-2 flex justify-between rounded-md border border-mat bg-white p-3">
            <span><b>{result}</b> vs {opp.name}</span>
            <span className="text-sm text-ink/70">{x.method ?? fmtDate(x.events.starts_at)}</span>
          </Link>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-mat bg-white py-3">
      <div className="font-display text-4xl font-extrabold">{value}</div>
      <div className="text-sm text-ink/70">{label}</div>
    </div>
  );
}
