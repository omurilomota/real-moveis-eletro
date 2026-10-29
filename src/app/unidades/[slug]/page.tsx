import { ArrowUpRight, Clock, MapPin, MessageCircle, Navigation } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { OfferExplorer } from "@/components/offer-explorer";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getUnitBySlug, getUnits, getValidOffers } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);
  if (!unit) return { title: "Unidade não encontrada" };
  return {
    title: `${site.name} – ${unit.city}`,
    description: `Loja de móveis e eletrodomésticos em ${unit.city}/${unit.state}. ${unit.address}. WhatsApp ${unit.phoneDisplay}. ${unit.hours}. Entrega e montagem grátis.`,
    alternates: { canonical: `/unidades/${unit.slug}` },
  };
}

export default async function UnitPage({ params }: Props) {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);
  if (!unit) notFound();

  const [units, offers] = await Promise.all([getUnits(), getValidOffers()]);
  const lat = parseFloat(unit.lat);
  const lng = parseFloat(unit.lng);
  const bbox = `${lng - 0.012}%2C${lat - 0.008}%2C${lng + 0.012}%2C${lat + 0.008}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <>
      <SiteHeader />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: `${site.name} – ${unit.city}`,
          telephone: `+55-${unit.phone.slice(2, 4)}-${unit.phone.slice(4)}`,
          url: `${site.url}/unidades/${unit.slug}`,
          image: `${site.url}/images/hero.jpg`,
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: unit.address,
            addressLocality: unit.city,
            addressRegion: unit.state,
            addressCountry: "BR",
          },
          geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
          openingHours: unit.hours,
          parentOrganization: { "@type": "Organization", name: site.name },
        }}
      />

      <main className="pb-24 pt-24 sm:pt-28">
        {/* header strip */}
        <section className="texture-dots bg-ink py-14 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Unidade {unit.isFlagship ? "matriz · " : ""}{unit.city}/{unit.state}
              </p>
              <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
                Real Móveis <span className="text-brand">{unit.city}</span>
              </h1>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                Visite a loja
              </h2>
              <div className="mt-5 space-y-4 text-sm text-ink/70">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <strong className="block text-ink">Endereço</strong>
                    {unit.address} — {unit.city}/{unit.state}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <strong className="block text-ink">WhatsApp</strong>
                    <a
                      href={`https://wa.me/${unit.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-leaf hover:underline"
                    >
                      {unit.phoneDisplay}
                    </a>
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <strong className="block text-ink">Horário de atendimento</strong>
                    {unit.hours}
                  </span>
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${unit.phone}?text=${encodeURIComponent(
                    `Olá! Quero falar com a Real Móveis de ${unit.city}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chamar no WhatsApp
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-ink/40"
                >
                  <Navigation className="h-4 w-4 text-brand" />
                  Como chegar
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-ink/8 shadow-card">
              <iframe
                title={`Mapa da unidade ${unit.city}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
                className="h-full min-h-[320px] w-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </section>

        {/* offers */}
        <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display-tight text-3xl text-ink sm:text-4xl">
              Ofertas disponíveis em <span className="text-brand">{unit.city}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink/60">
              O catálogo de ofertas vale para toda a rede. Toque no WhatsApp de cada
              oferta e a mensagem já chega identificada com esta unidade.
            </p>
          </Reveal>
          <div className="mt-10">
            <OfferExplorer offers={offers} units={units} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
