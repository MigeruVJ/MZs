import Link from "next/link";
import { supabase, fmtDate } from "@/lib/supabase";

export const revalidate = 30;

export default async function Home() {
  // 1. Obtener eventos (en vivo y próximos)
  const { data: events } = await supabase
    .from("events")
    .select("id, name, starts_at, city, country, status, organizations(name, sport)")
    .neq("status", "finished")
    .order("starts_at");

  const live = (events ?? []).filter((e: any) => e.status === "live");
  const upcoming = (events ?? []).filter((e: any) => e.status !== "live");

  // 2. Obtener líderes de divisiones (Rankings) para retener al usuario
  const { data: topFighters } = await supabase
    .from("fighters")
    .select("id, name, nickname, weight_class, wins, losses, draws, image_url")
    .order("wins", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-10 pb-12">
      {/* --- HERO BANNER (Retención y Estética de Alta Adrenalina) --- */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 text-chalk p-8 md:p-10 border border-zinc-800 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-corner-red/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-xl">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-corner-red/20 text-corner-red border border-corner-red/30 inline-block">
            European Combat Hub
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
            The Pulse of European Fighting
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Real-time fight cards, division rankings, and elite athletes across MMA and boxing. Never miss a strike.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="px-5 py-2.5 rounded-xl bg-corner-red hover:bg-red-700 text-white font-display font-bold text-sm tracking-wide transition-colors shadow-sm"
            >
              Search Fighters & Events
            </Link>
            <Link
              href="/rankings"
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-display font-bold text-sm tracking-wide transition-colors border border-zinc-700"
            >
              Explore Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* --- LIVE NOW SECTION --- */}
      {live.length > 0 && (
        <section aria-label="Live now" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-corner-red rounded-full animate-pulse"></span>
            <h2 className="font-display text-2xl font-bold text-corner-red tracking-tight">Live Right Now</h2>
          </div>
          {live.map((e: any) => (
            <EventRow key={e.id} e={e} />
          ))}
        </section>
      )}

      {/* --- UPCOMING EVENTS SECTION --- */}
      <section aria-label="Upcoming events" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">Upcoming Events</h2>
          <Link href="/events" className="text-xs font-mono font-bold uppercase tracking-wider text-corner-red hover:underline">
            View all →
          </Link>
        </div>
        {upcoming.length === 0 && (
          <p className="mt-3 text-ink/70 p-6 border border-zinc-200 rounded-xl bg-white text-sm">
            No events scheduled right now. Add rows to the events table in Supabase.
          </p>
        )}
        {upcoming.map((e: any) => (
          <EventRow key={e.id} e={e} />
        ))}
      </section>

      {/* --- DIVISION LEADERS (Engagement: Fomenta la exploración de perfiles) --- */}
      <section aria-label="Division Leaders" className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">Division Leaders</h2>
          <Link href="/rankings" className="text-xs font-mono font-bold uppercase tracking-wider text-corner-red hover:underline">
            Full rankings →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topFighters && topFighters.length > 0 ? (
            topFighters.map((fighter, index) => (
              <Link
                key={fighter.id}
                href={`/fighters/${fighter.id}`}
                className="p-4 border border-zinc-200 rounded-2xl bg-white shadow-sm hover:border-zinc-400 hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 border border-zinc-200">
                  {fighter.image_url ? (
                    <img src={fighter.image_url} alt={fighter.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">
                      {fighter.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-sm text-corner-red">#{index + 1}</span>
                    <h3 className="font-display font-bold text-base text-zinc-900 group-hover:text-corner-red transition-colors truncate">
                      {fighter.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{fighter.weight_class || "Pro Division"}</p>
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">
                    Record: <span className="text-zinc-800 font-semibold">{fighter.wins ?? 0}-{fighter.losses ?? 0}-{fighter.draws ?? 0}</span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 p-6 text-center border border-zinc-200 rounded-2xl bg-white text-zinc-500 text-sm">
              No fighter data available.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EventRow({ e }: { e: any }) {
  return (
    <Link 
      href={`/events/${e.id}`} 
      className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all group"
    >
      <div className="font-display text-xl font-semibold text-zinc-900 group-hover:text-corner-red transition-colors">
        {e.name}
      </div>
      <div className="text-sm text-zinc-500 mt-1 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 font-sans font-medium">
          {e.organizations?.name || e.organizations?.sport || "Combat"}
        </span>
        <span>·</span>
        <span>{fmtDate(e.starts_at)}</span>
        <span>·</span>
        <span>{e.city}, {e.country}</span>
      </div>
    </Link>
  );
}