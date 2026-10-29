"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Timer } from "lucide-react";
import Link from "next/link";
import type { PublicOffer, UnitLite } from "@/lib/data";
import {
  buildWaLink,
  cn,
  discountPercent,
  formatBRL,
  offerStatus,
  offerWaMessage,
  trackEvent,
} from "@/lib/utils";

export function OfferCard({
  offer,
  unit,
  index = 0,
}: {
  offer: PublicOffer;
  unit: UnitLite;
  index?: number;
}) {
  const off = discountPercent(offer.priceCents, offer.oldPriceCents);
  const wa = buildWaLink(
    unit.phone,
    offerWaMessage(offer.name, formatBRL(offer.priceCents), unit.city),
  );

  const onWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackEvent("whatsapp_click", {
      offerId: offer.id,
      unitSlug: unit.slug,
      offerName: offer.name,
    });
    window.open(wa, "_blank", "noopener");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-pop"
    >
      <Link
        href={`/ofertas/${offer.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-cream"
        aria-label={`Ver oferta: ${offer.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={offer.image}
          alt={offer.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink backdrop-blur">
            {offer.category}
          </span>
          {off > 0 && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
              -{off}%
            </span>
          )}
        </div>
        {offer.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
            Destaque
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur">
          <Timer className="h-3 w-3" />
          até {new Date(offer.endsAt).toLocaleDateString("pt-BR")}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/ofertas/${offer.slug}`}>
          <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink transition-colors group-hover:text-brand">
            {offer.name}
          </h3>
        </Link>

        <div className="mt-2 flex-1">
          {offer.oldPriceCents && (
            <span className="text-sm text-ink/40 line-through">
              {formatBRL(offer.oldPriceCents)}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="price-tag text-2xl text-ink">
              {formatBRL(offer.priceCents)}
            </span>
          </div>
          {offer.installments && (
            <p className="mt-0.5 text-xs font-semibold text-leaf">{offer.installments}</p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/ofertas/${offer.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand"
          >
            Ver oferta
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            onClick={onWhatsApp}
            aria-label={`Perguntar sobre ${offer.name} no WhatsApp`}
            className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-white transition-transform hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        <p className={cn("mt-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-ink/40")}>
          Retirada ou entrega via {unit.city}
        </p>
      </div>
    </motion.article>
  );
}
