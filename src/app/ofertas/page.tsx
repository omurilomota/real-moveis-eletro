import type { Metadata } from "next";
import { OfferExplorer } from "@/components/offer-explorer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getUnits, getValidOffers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ofertas do mês",
  description:
    "Ofertas vigentes de móveis, eletrodomésticos, colchões e eletrônicos na Real Móveis Eletro. Preço bom sai do ar quando o estoque acaba.",
  alternates: { canonical: "/ofertas" },
};

export default async function OfertasPage() {
  const [offers, units] = await Promise.all([getValidOffers(), getUnits()]);
  const flagship = units.find((u) => u.isFlagship) ?? units[0];

  return (
    <>
      <SiteHeader />
      <WhatsAppFloat phone={flagship?.phone ?? "5518999990110"} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-brand">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" />
          Vigência real — entram e saem do ar sozinhas
        </p>
        <h1 className="display-tight mt-4 text-5xl text-ink sm:text-6xl">
          Ofertas <span className="text-brand">do mês</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/60">
          Cada oferta tem página própria com foto, preço, especificações e botão de
          WhatsApp direto para a unidade escolhida. Sem carrossel de imagem sem link —
          o que você vê aqui é texto real, indexável e compartilhável.
        </p>

        <div className="mt-12">
          <OfferExplorer offers={offers} units={units} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
