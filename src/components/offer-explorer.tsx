"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublicOffer, UnitLite } from "@/lib/data";
import { cn } from "@/lib/utils";
import { OfferCard } from "@/components/offer-card";

export function OfferExplorer({
  offers,
  units,
  compact = false,
}: {
  offers: PublicOffer[];
  units: UnitLite[];
  compact?: boolean;
}) {
  const unit = units.find((u) => u.isFlagship) ?? units[0];
  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(offers.map((o) => o.category)))],
    [offers],
  );
  const [active, setActive] = useState("Todas");

  const filtered = useMemo(
    () => (active === "Todas" ? offers : offers.filter((o) => o.category === active)),
    [offers, active],
  );

  if (!unit) return null;

  if (offers.length === 0) {
    return (
      <div className="texture-grid grid place-items-center rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
        <PackageSearch className="h-10 w-10 text-ink/30" />
        <p className="mt-4 font-display text-xl font-bold uppercase text-ink">
          Nenhuma oferta ativa agora
        </p>
        <p className="mt-2 max-w-md text-sm text-ink/60">
          A equipe de marketing publica novas ofertas pelo CMS com data de vigência —
          elas entram e saem do ar sozinhas. Enquanto isso, fale com a loja.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              active === c
                ? "border-ink bg-ink text-white shadow-card"
                : "border-ink/15 bg-white text-ink/60 hover:border-ink/40 hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto text-xs font-semibold text-ink/40">
          {filtered.length} {filtered.length === 1 ? "oferta" : "ofertas"}
        </span>
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.slice(0, compact ? 6 : undefined).map((o, i) => (
            <motion.div
              key={o.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <OfferCard offer={o} unit={unit} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
