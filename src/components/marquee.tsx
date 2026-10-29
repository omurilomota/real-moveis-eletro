import { Sparkle } from "lucide-react";

const items = [
  "Entrega e montagem grátis",
  "48 anos de história",
  "6 unidades na região",
  "Crediário próprio na hora",
  "Ofertas atualizadas toda semana",
  "Loja física de verdade, perto de você",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-brand py-3 text-white">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-sm font-bold uppercase tracking-[0.18em]"
          >
            {item}
            <Sparkle className="h-4 w-4 text-gold" fill="currentColor" />
          </span>
        ))}
      </div>
    </div>
  );
}
