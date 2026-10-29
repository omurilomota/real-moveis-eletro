import { ArrowLeft, CalendarOff, CheckCircle2, Share2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { OfferCard } from "@/components/offer-card";
import { OfferCtaPanel } from "@/components/offer-cta-panel";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getOfferBySlug, getRelatedOffers, getUnits } from "@/lib/data";
import { site } from "@/lib/site";
import { discountPercent, formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: "Oferta não encontrada" };
  return {
    title: `${offer.name} — ${formatBRL(offer.priceCents)}`,
    description: `${offer.name} por ${formatBRL(offer.priceCents)}${
      offer.installments ? ` em ${offer.installments}` : ""
    }. Oferta da Real Móveis Eletro com entrega e montagem grátis.`,
    alternates: { canonical: `/ofertas/${offer.slug}` },
  };
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const [units, related] = await Promise.all([
    getUnits(),
    getRelatedOffers(offer.category, offer.slug),
  ]);
  const off = discountPercent(offer.priceCents, offer.oldPriceCents);
  const expired = new Date(offer.endsAt) < new Date();
  const scheduled = new Date(offer.startsAt) > new Date();

  return (
    <>
      <SiteHeader />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: offer.name,
          image: [`${site.url}${offer.image}`],
          description: offer.description,
          category: offer.category,
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: (offer.priceCents / 100).toFixed(2),
            availability: expired
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
            url: `${site.url}/ofertas/${offer.slug}`,
            seller: { "@type": "Organization", name: site.name },
          },
        }}
      />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/40">
          <Link href="/" className="hover:text-brand">
            Início
          </Link>
          <span>/</span>
          <Link href="/ofertas" className="hover:text-brand">
            Ofertas
          </Link>
          <span>/</span>
          <span className="text-ink/70">{offer.category}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* IMAGE */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-cream shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={offer.image}
                alt={offer.name}
                className="aspect-[4/3] w-full object-cover"
              />
              {off > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3.5 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-white shadow-pop">
                  -{off}% OFF
                </span>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                Especificações
              </h2>
              <dl className="mt-4 divide-y divide-ink/8">
                {offer.specs.map((s) => (
                  <div key={s.label} className="flex items-start justify-between gap-6 py-2.5 text-sm">
                    <dt className="font-semibold text-ink/50">{s.label}</dt>
                    <dd className="text-right font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-ink/70">
              <Share2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p>
                <strong className="text-ink">Dica:</strong> compartilhe este link no
                grupo da família. Ele gera um card com foto e preço no WhatsApp — nada
                de print de oferta sem valor.
              </p>
            </div>
          </Reveal>

          {/* INFO */}
          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              {offer.category}
            </p>
            <h1 className="display-tight mt-3 text-4xl text-ink sm:text-5xl">
              {offer.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              {offer.oldPriceCents && (
                <span className="text-lg text-ink/40 line-through">
                  {formatBRL(offer.oldPriceCents)}
                </span>
              )}
              <span className="price-tag text-5xl text-brand">
                {formatBRL(offer.priceCents)}
              </span>
            </div>
            {offer.installments && (
              <p className="mt-1 text-sm font-bold text-leaf">
                ou {offer.installments} no cartão ou crediário
              </p>
            )}
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/40">
              Entrega e montagem grátis na região
            </p>

            <div className="mt-5">
              {expired ? (
                <p className="flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2 text-sm font-semibold text-ink/60">
                  <CalendarOff className="h-4 w-4" />
                  Oferta encerrada em{" "}
                  {new Date(offer.endsAt).toLocaleDateString("pt-BR")} — fale com a
                  loja por condições parecidas
                </p>
              ) : scheduled ? (
                <p className="flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-semibold text-ink/70">
                  <CalendarOff className="h-4 w-4" />
                  Válida a partir de{" "}
                  {new Date(offer.startsAt).toLocaleDateString("pt-BR")}
                </p>
              ) : (
                <p className="flex items-center gap-2 rounded-full bg-leaf/10 px-4 py-2 text-sm font-semibold text-leaf">
                  <CheckCircle2 className="h-4 w-4" />
                  Oferta ativa até{" "}
                  <strong>
                    {new Date(offer.endsAt).toLocaleDateString("pt-BR")}
                  </strong>{" "}
                  ou enquanto durar o estoque
                </p>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-ink/70">{offer.description}</p>

            <div className="mt-8">
              <OfferCtaPanel offer={offer} units={units} />
            </div>

            <Link
              href="/ofertas"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink/50 hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para todas as ofertas
            </Link>
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="display-tight text-3xl text-ink sm:text-4xl">
              Quem viu esta oferta também viu
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o, i) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  unit={units.find((u) => u.isFlagship) ?? units[0]}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <WhatsAppFloat phone={units.find((u) => u.isFlagship)?.phone ?? "5518999990110"} />
      <SiteFooter />
    </>
  );
}
