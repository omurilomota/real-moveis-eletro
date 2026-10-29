import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Clock,
  HandCoins,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Marquee } from "@/components/marquee";
import { OfferExplorer } from "@/components/offer-explorer";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getUnits, getValidOffers } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const diferenciais = [
  {
    icon: Truck,
    title: "Entrega e montagem grátis",
    desc: "Levamos, montamos e ajustamos na sua casa. Você só escolhe onde fica.",
  },
  {
    icon: HandCoins,
    title: "Crediário próprio na hora",
    desc: "Aprocação direto na loja, sem burocracia. Parcelamos do seu jeito.",
  },
  {
    icon: CalendarClock,
    title: "Ofertas sempre no ar",
    desc: "Publicamos as promoções do mês com data de início e fim — sem carrossel desatualizado.",
  },
  {
    icon: ShieldCheck,
    title: "Loja física de verdade",
    desc: "6 unidades na região, com atendente de carne e osso e garantia local.",
  },
];

export default async function HomePage() {
  const [offers, units] = await Promise.all([getValidOffers(), getUnits()]);
  const flagship = units.find((u) => u.isFlagship) ?? units[0];

  return (
    <>
      <SiteHeader overlay />
      <WhatsAppFloat phone={flagship?.phone ?? "5518999990110"} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          foundingDate: String(site.foundedYear),
          description: site.description,
          department: units.map((u) => ({
            "@type": "Store",
            name: `${site.name} – ${u.city}`,
            telephone: `+55-${u.phone.slice(2, 4)}-${u.phone.slice(4)}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: u.address,
              addressLocality: u.city,
              addressRegion: u.state,
              addressCountry: "BR",
            },
          })),
        }}
      />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.jpg"
              alt="Showroom da Real Móveis Eletro com sofás e mesas"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
                <BadgeCheck className="h-4 w-4 text-gold" />
                Desde {site.foundedYear} · Junqueirópolis e região
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="display-tight mt-6 text-[13vw] sm:text-7xl lg:text-8xl">
                Sua casa nova
                <br />
                começa na <span className="text-brand">Real</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Móveis, eletrodomésticos e colchões com{" "}
                <strong className="text-white">entrega e montagem grátis</strong> em{" "}
                {units.length} unidades do interior paulista. Ofertas do mês no ar,
                atualizadas pelo próprio time da loja.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/ofertas"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[0_18px_40px_-12px_rgba(226,55,31,0.8)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Ver ofertas do mês
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              {flagship && (
                <a
                  href={`https://wa.me/${flagship.phone}?text=${encodeURIComponent(
                    `Olá! Quero falar com a Real Móveis de ${flagship.city}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  <MessageCircle className="h-5 w-5 text-leaf" />
                  Falar com {flagship.city}
                </a>
              )}
            </Reveal>

            <Reveal delay={0.45}>
              <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
                {[
                  [`${new Date().getFullYear() - site.foundedYear}`, "anos de história"],
                  [String(units.length), "unidades na região"],
                  ["Grátis", "entrega e montagem"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="display-tight text-3xl text-gold sm:text-4xl">
                      {value}
                    </dd>
                    <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        <Marquee />

        {/* OFERTAS */}
        <section id="ofertas" className="texture-grid mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-brand">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" />
                Ofertas de outubro/2026
              </p>
              <h2 className="display-tight mt-3 text-4xl text-ink sm:text-5xl">
                Preços que <span className="text-brand">saem do ar</span> quando acaba
                o estoque
              </h2>
            </div>
            <Link
              href="/ofertas"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-ink/60 hover:text-brand"
            >
              Ver todas as ofertas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-10">
            <OfferExplorer offers={offers} units={units} compact />
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="bg-cream py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display-tight max-w-2xl text-4xl text-ink sm:text-5xl">
                Por que comprar na <span className="text-brand">Real</span>?
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {diferenciais.map((d, i) => (
                <Reveal key={d.title} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-pop">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <d.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-ink">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{d.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* UNIDADES */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-tight text-4xl text-ink sm:text-5xl">
              Perto de você, <span className="text-brand">sempre</span>
            </h2>
            <Link
              href="/unidades"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-ink/60 hover:text-brand"
            >
              Todas as unidades
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u, i) => (
              <Reveal key={u.slug} delay={i * 0.05}>
                <Link
                  href={`/unidades/${u.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-5 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-pop"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink group-hover:text-brand">
                      {u.city}
                    </h3>
                    {u.isFlagship && (
                      <span className="rounded bg-brand px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                        Matriz
                      </span>
                    )}
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm text-ink/60">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {u.address}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-ink/60">
                    <Phone className="h-4 w-4 shrink-0 text-brand" />
                    {u.phoneDisplay}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-ink/60">
                    <Clock className="h-4 w-4 shrink-0 text-brand" />
                    {u.hours}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand">
                    Ver unidade
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* STORY TEASER */}
        <section className="texture-dots bg-ink py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Nossa história
              </p>
              <h2 className="display-tight mt-4 text-4xl sm:text-5xl">
                Uma história de família, <span className="text-brand">desde 1978</span>
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-white/70">
                O que começou como uma pequena loja de móveis em Junqueirópolis hoje é
                uma rede de {units.length} unidades administrada pela 2ª geração da
                família — com o mesmo cuidado de sempre: tratar cada cliente como
                vizinho.
              </p>
              <Link
                href="/institucional"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-display text-base font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:bg-gold"
              >
                Conheça a Real
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-pop">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/loja.jpg"
                    alt="Interior da loja Real Móveis Eletro"
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-brand px-6 py-4 shadow-pop sm:block">
                  <p className="display-tight text-3xl text-white">2ª geração</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    à frente da rede
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
