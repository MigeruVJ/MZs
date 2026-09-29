import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 15;

export default async function EventPage({ params }: { params: { id: string } }) {
  const { data: event } = await supabase
    .from("events").select("*, organizations(name)").eq("id", params.id).single();
  if (!event) notFound();

  const { data: fights } = await supabase
    .from("fights")
    .select("*, a:fighters!fights_fighter_a_fkey(id,name,wins,losses,draws), b:fighters!fights_fighter_b_fkey(id,name,wins,losses,draws)")
    .eq("event_id", params.id)
    .order("bout_order", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold">{event.name}</h1>
      <p className="text-ink/70">{event.organizations?.name} · {fmtDate(event.starts_at)} · {event.city}, {event.country}</p>
      <div className="mt-6 space-y-3">
        {(fights ?? []).map((f: any) => (
          <div key={f.id} className="rounded-md border border-mat bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <Corner fighter={f.a} color="red" won={f.winner_id === f.a?.id} />
              <div className="text-center text-xs text-ink/70">
                {f.status === "live" ? <b className="text-corner-red">LIVE · R{f.current_round}</b> : f.weight_class}
                <div>{f.rounds} rounds</div>
              </div>
              <Corner fighter={f.b} color="blue" won={f.winner_id === f.b?.id} right />
            </div>
            {f.status === "finished" && <p className="mt-2 text-sm">{f.method}, round {f.end_round}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Corner({ fighter, color, won, right }: any) {
  const bar = color === "red" ? "border-corner-red" : "border-corner-blue";
  return (
    <Link href={`/fighters/${fighter.id}`} className={`flex-1 border-t-4 ${bar} pt-2 ${right ? "text-right" : ""}`}>
      <div className={`font-display text-2xl font-bold ${won ? "underline decoration-2" : ""}`}>{fighter.name}</div>
      <div className="text-sm text-ink/70">{fighter.wins}-{fighter.losses}-{fighter.draws}</div>
    </Link>
  );
}
