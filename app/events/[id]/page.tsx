import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsIndexPage() {
  let events: any[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, name, starts_at, city, country, status, organizations(name)")
      .order("starts_at", { ascending: true });

    if (error) {
      errorMessage = error.message;
    } else {
      events = data || [];
    }
  } catch (err: any) {
    errorMessage = err.message || "Failed to fetch events.";
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-zinc-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Events Directory</h1>
      </div>

      {errorMessage && (
        <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm space-y-1">
          <p className="font-bold">Could not load events from Supabase:</p>
          <p className="font-mono text-xs">{errorMessage}</p>
          <p className="text-xs text-red-500 pt-1">
            Tip: Check if your Vercel project has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set correctly in Environment Variables.
          </p>
        </div>
      )}

      {!errorMessage && events.length === 0 && (
        <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white shadow-sm text-zinc-500 text-sm">
          No events registered yet.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <Link 
            key={event.id} 
            href={`/events/${event.id}`}
            className="p-5 border border-zinc-200 rounded-xl bg-white shadow-sm hover:border-zinc-400 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-red-100 font-bold text-red-700 border border-red-200">
                  {event.organizations?.name || "Organization"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900">{event.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">
                📅 {event.starts_at ? new Date(event.starts_at).toLocaleDateString() : "TBD"} • 📍 {event.city}, {event.country}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
              event.status === "live" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-100 text-zinc-700"
            }`}>
              {event.status === "live" ? "🔴 LIVE" : event.status || "upcoming"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsIndexPage() {
  let events: any[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, name, starts_at, city, country, status, organizations(name)")
      .order("starts_at", { ascending: true });

    if (error) {
      errorMessage = error.message;
    } else {
      events = data || [];
    }
  } catch (err: any) {
    errorMessage = err.message || "Failed to fetch events.";
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-zinc-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Events Directory</h1>
      </div>

      {errorMessage && (
        <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm space-y-1">
          <p className="font-bold">Could not load events from Supabase:</p>
          <p className="font-mono text-xs">{errorMessage}</p>
          <p className="text-xs text-red-500 pt-1">
            Tip: Check if your Vercel project has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set correctly in Environment Variables.
          </p>
        </div>
      )}

      {!errorMessage && events.length === 0 && (
        <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white shadow-sm text-zinc-500 text-sm">
          No events registered yet.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <Link 
            key={event.id} 
            href={`/events/${event.id}`}
            className="p-5 border border-zinc-200 rounded-xl bg-white shadow-sm hover:border-zinc-400 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-red-100 font-bold text-red-700 border border-red-200">
                  {event.organizations?.name || "Organization"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900">{event.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">
                📅 {event.starts_at ? new Date(event.starts_at).toLocaleDateString() : "TBD"} • 📍 {event.city}, {event.country}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
              event.status === "live" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-100 text-zinc-700"
            }`}>
              {event.status === "live" ? "🔴 LIVE" : event.status || "upcoming"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}