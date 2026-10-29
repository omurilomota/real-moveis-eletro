import { ArrowRight, Clock, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getUnits } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unidades",
  description:
    "Conheça as 6 unidades da Real Móveis Eletro: Junqueirópolis, Adamantina, Dracena, Flórida Paulista, Pacaembu e Tupi Paulista. Endereço, horários e WhatsApp de cada loja.",
  alternates: { canonical: "/unidades" },
};

export default async function UnidadesPage() {
  const units = await getUnits();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <h1 className="display-tight text-5xl text-ink sm:text-6xl">
          Nossas <span className="text-brand">unidades</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/60">
          Cada unidade tem página própria com endereço, horários, mapa e WhatsApp —
          tudo indexado para quem pesquisa “móveis perto de mim”.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((u, i) => (
            <Reveal key={u.slug} delay={i * 0.05}>
              <Link
                href={`/unidades/${u.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-pop"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink group-hover:text-brand">
                    {u.city}
                  </h2>
                  {u.isFlagship && (
                    <span className="rounded bg-brand px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                      Matriz
                    </span>
                  )}
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm text-ink/60">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {u.address}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand" />
                  {u.phoneDisplay}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
                  <Clock className="h-4 w-4 shrink-0 text-brand" />
                  {u.hours}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-xs font-bold uppercase tracking-wider text-brand">
                  Ver página da unidade
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
