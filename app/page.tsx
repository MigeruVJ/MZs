import Link from "next/link";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 30;

export default async function Home() {
  const { data: events } = await supabase
    .from("events")
    .select("id,name,starts_at,city,country,status,organizations(name,sport)")
    .neq("status", "finished")
    .order("starts_at");

  const live = (events ?? []).filter((e: any) => e.status === "live");
  const upcoming = (events ?? []).filter((e: any) => e.status !== "live");

  return (
    <div className="space-y-8">
      {live.length > 0 && (
        <section aria-label="Live now">
          <h2 className="font-display text-3xl font-bold text-corner-red">Live now</h2>
          {live.map((e: any) => <EventRow key={e.id} e={e} />)}
        </section>
      )}
      <section aria-label="Upcoming events">
        <h2 className="font-display text-3xl font-bold">Upcoming events</h2>
        {upcoming.length === 0 && <p className="mt-3 text-ink/70">No events yet. Add rows to the events table in Supabase.</p>}
        {upcoming.map((e: any) => <EventRow key={e.id} e={e} />)}
      </section>
    </div>
  );
}

function EventRow({ e }: { e: any }) {
  return (
    <Link href={`/events/${e.id}`} className="mt-3 block rounded-md border border-mat bg-white p-4 hover:border-ink">
      <div className="font-display text-xl font-semibold">{e.name}</div>
      <div className="text-sm text-ink/70">
        {e.organizations?.name} · {fmtDate(e.starts_at)} · {e.city}, {e.country}
      </div>
    </Link>
  );
}
