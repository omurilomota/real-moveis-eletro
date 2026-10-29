import { Clock, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getUnits } from "@/lib/data";
import { site } from "@/lib/site";

export async function SiteFooter() {
  const units = await getUnits();
  const flagship = units.find((u) => u.isFlagship) ?? units[0];

  return (
    <footer className="texture-dots bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M4 21V10.6L12 4l8 6.6V21h-5.6v-5.4a2.4 2.4 0 0 0-4.8 0V21H4Z" />
                </svg>
              </span>
              <span className="font-display text-lg font-extrabold uppercase leading-none tracking-tight">
                Real<span className="text-brand"> Móveis</span>
                <span className="block text-[0.6rem] font-semibold tracking-[0.28em] text-white/50">
                  ELETRO
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {site.tagline}. Móveis, eletrodomésticos e colchões com entrega e
              montagem grátis em {units.length} unidades do interior paulista.
            </p>
            {flagship && (
              <a
                href={`https://wa.me/${flagship.phone}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com {flagship.city}
              </a>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
              Nossas unidades
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {units.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/unidades/${u.slug}`}
                    className="group block text-sm font-bold text-white hover:text-gold"
                  >
                    {u.city}
                    {u.isFlagship && (
                      <span className="ml-2 rounded bg-brand px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                        Matriz
                      </span>
                    )}
                  </Link>
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-white/50">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    {u.address}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/50">
                    <MessageCircle className="h-3 w-3 shrink-0" />
                    {u.phoneDisplay}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/50">
                    <Clock className="h-3 w-3 shrink-0" />
                    {u.hours}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} — Desde {site.foundedYear}. Todos
            os direitos reservados.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/institucional" className="hover:text-white">
              Nossa história
            </Link>
            <Link href="/admin" className="hover:text-white">
              CMS
            </Link>
            <span className="rounded-full border border-white/15 px-2.5 py-1">
              Site monitorado 24/7
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
