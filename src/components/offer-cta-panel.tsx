"use client";

import { motion } from "framer-motion";
import { Check, Clock, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { PublicOffer, UnitLite } from "@/lib/data";
import { buildWaLink, cn, formatBRL, offerWaMessage, trackEvent } from "@/lib/utils";

export function OfferCtaPanel({
  offer,
  units,
}: {
  offer: PublicOffer;
  units: UnitLite[];
}) {
  const [selected, setSelected] = useState(
    units.find((u) => u.isFlagship)?.slug ?? units[0]?.slug ?? "",
  );
  const [clicked, setClicked] = useState(false);
  const unit = units.find((u) => u.slug === selected) ?? units[0];

  if (!unit) return null;

  const wa = buildWaLink(
    unit.phone,
    offerWaMessage(offer.name, formatBRL(offer.priceCents), unit.city),
  );

  const onWhatsApp = () => {
    trackEvent("whatsapp_click", {
      offerId: offer.id,
      unitSlug: unit.slug,
      offerName: offer.name,
    });
    setClicked(true);
    window.open(wa, "_blank", "noopener");
    setTimeout(() => setClicked(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
        Compre pela loja mais próxima
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {units.map((u) => (
          <button
            key={u.slug}
            onClick={() => setSelected(u.slug)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-xs font-bold transition-all",
              selected === u.slug
                ? "border-brand bg-brand text-white shadow-[0_8px_20px_-8px_rgba(226,55,31,0.7)]"
                : "border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink",
            )}
          >
            {u.city}
            {u.isFlagship && <span className="ml-1 opacity-70">•</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 rounded-xl bg-cream p-4 text-sm text-ink/70">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          {unit.address} — {unit.city}/{unit.state}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-brand" />
          {unit.hours}
        </p>
      </div>

      <motion.button
        onClick={onWhatsApp}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 font-display text-lg font-bold uppercase tracking-wide text-white transition-all",
          clicked ? "bg-leaf" : "bg-leaf hover:brightness-110",
          "shadow-[0_16px_32px_-12px_rgba(31,122,61,0.65)]",
        )}
      >
        {clicked ? <Check className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        {clicked ? "Abrindo WhatsApp..." : `Quero na unidade ${unit.city}`}
      </motion.button>

      <p className="mt-3 text-center text-xs leading-relaxed text-ink/50">
        Mensagem pré-preenchida com o nome e o preço da oferta. Estoque e condições
        confirmados direto com a loja.
      </p>
    </div>
  );
}
