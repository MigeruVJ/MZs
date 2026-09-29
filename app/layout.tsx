importimport "./globals.css";
import Link from "next/link";
import { Barlow_Condensed, Barlow } from "next/font/google";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export const metadata = { title: "CombatScore", description: "Live results, events and fighters for MMA and boxing." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="bg-ink text-chalk sticky top-0 z-10">
          <nav className="mx-auto max-w-3xl flex items-center gap-5 px-4 h-14">
            <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
              Combat<span className="text-corner-red">Score</span>
            </Link>
            <Link href="/" className="text-sm">Events</Link>
            <Link href="/fighters" className="hover:text-primary transition-colors font-medium">Fighters</Link>
            <Link href="/search" className="text-sm ml-auto">Search</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
