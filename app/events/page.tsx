import { supabase, fmtDate } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
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
    errorMessage = err.message || "Error al conectar con la base de datos.";
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-zinc-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight">European Events</h1>
        <span className="text-xs text-zinc-500 font-medium">MMA & Boxing</span>
      </div>

      {errorMessage && (
        <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm space-y-1">
          <p className="font-bold">Aviso de la Base de Datos:</p>
          <p className="font-mono text-xs">{errorMessage}</p>
        </div>
      )}

      {!errorMessage && events.length === 0 && (
        <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white shadow-sm text-zinc-500 text-sm">
          No hay eventos registrados todavía. Añade el primero desde tu panel o Supabase.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => {
          const org = Array.isArray(event.organizations) ? event.organizations[0] : event.organizations;

          return (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="p-5 border border-zinc-200 rounded-xl bg-white shadow-sm hover:border-zinc-400 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-red-100 font-bold text-red-700 border border-red-200">
                    {org?.name || "Organización"}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900">{event.name}</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  📅 {event.starts_at ? fmtDate(event.starts_at) : "Por definir"} • 📍 {event.city || "Ciudad"}, {event.country || "País"}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                event.status === "live" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-100 text-zinc-700"
              }`}>
                {event.status === "live" ? "🔴 EN VIVO" : event.status || "próximamente"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}