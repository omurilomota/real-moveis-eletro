import "dotenv/config";
import { db } from "./index";
import { events, offers, units, type Spec } from "./schema";

function sp(month: number, day: number, hour = 12) {
  // fixed offset -03:00 (America/Sao_Paulo has no DST since 2019)
  return new Date(`2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:00:00-03:00`);
}

const UNIT_SEED = [
  {
    slug: "junqueiropolis",
    name: "Real Móveis Eletro – Junqueirópolis (Matriz)",
    city: "Junqueirópolis",
    address: "Rua das Acácias, 100 — Centro",
    phone: "5518999990110",
    phoneDisplay: "(18) 99999-0110",
    lat: "-21.5100",
    lng: "-51.4300",
    isFlagship: true,
    sortOrder: 1,
  },
  {
    slug: "adamantina",
    name: "Real Móveis Eletro – Adamantina",
    city: "Adamantina",
    address: "Rua das Palmeiras, 200 — Centro",
    phone: "5518999990111",
    phoneDisplay: "(18) 99999-0111",
    lat: "-21.6800",
    lng: "-51.0700",
    isFlagship: false,
    sortOrder: 2,
  },
  {
    slug: "dracena",
    name: "Real Móveis Eletro – Dracena",
    city: "Dracena",
    address: "Rua dos Ipês, 300 — Centro",
    phone: "5518999990112",
    phoneDisplay: "(18) 99999-0112",
    lat: "-21.4800",
    lng: "-51.5300",
    isFlagship: false,
    sortOrder: 3,
  },
  {
    slug: "florida-paulista",
    name: "Real Móveis Eletro – Flórida Paulista",
    city: "Flórida Paulista",
    address: "Rua das Flores, 400 — Centro",
    phone: "5518999990113",
    phoneDisplay: "(18) 99999-0113",
    lat: "-21.6100",
    lng: "-51.1800",
    isFlagship: false,
    sortOrder: 4,
  },
  {
    slug: "pacaembu",
    name: "Real Móveis Eletro – Pacaembu",
    city: "Pacaembu",
    address: "Rua dos Girassóis, 500 — Centro",
    phone: "5518999990114",
    phoneDisplay: "(18) 99999-0114",
    lat: "-21.6900",
    lng: "-50.8600",
    isFlagship: false,
    sortOrder: 5,
  },
  {
    slug: "tupi-paulista",
    name: "Real Móveis Eletro – Tupi Paulista",
    city: "Tupi Paulista",
    address: "Rua das Hortênsias, 600 — Centro",
    phone: "5518999990115",
    phoneDisplay: "(18) 99999-0115",
    lat: "-21.5300",
    lng: "-51.5600",
    isFlagship: false,
    sortOrder: 6,
  },
].map((u) => ({
  ...u,
  state: "SP",
  hours: "Seg a Sáb, 8h às 18h",
  hoursSchema: "Mo-Sa 08:00-18:00",
}));

type OfferSeed = {
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  oldPriceCents: number | null;
  installments: string;
  image: string;
  specs: Spec[];
  startsAt: Date;
  endsAt: Date;
  featured: boolean;
  sortOrder: number;
};

const NOW_START = sp(10, 1);
const NOW_END = sp(11, 30);

const OFFER_SEED: OfferSeed[] = [
  {
    slug: "guarda-roupa-dubai-6-portas",
    name: "Guarda-Roupa Dubai 6 Portas com Espelho",
    category: "Móveis",
    description:
      "Guarda-roupa espaçoso com 6 portas, 2 gavetas e espelho na porta central. MDF de alta resistência, corredores internos amplos e cabideiro de alumínio. Aquele móvel que resolve o quarto de vez.",
    priceCents: 129900,
    oldPriceCents: 179900,
    installments: "10x de R$ 129,90 sem juros",
    image: "/images/guarda-roupa.jpg",
    specs: [
      { label: "Portas", value: "6" },
      { label: "Gavetas", value: "2" },
      { label: "Cor", value: "Amêndoa" },
      { label: "Material", value: "MDF" },
      { label: "Espelho", value: "Sim" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "quarto-casal-atlanta-completo",
    name: "Quarto de Casal Completo Atlanta",
    category: "Móveis",
    description:
      "Combo fechado: cama de casal, guarda-roupa 6 portas e cómoda com espelho. Tudo combinando, entregue e montado no mesmo dia — sem quebra-cabeça de loja diferente.",
    priceCents: 249900,
    oldPriceCents: 319900,
    installments: "12x de R$ 208,25 sem juros",
    image: "/images/quarto-casal.jpg",
    specs: [
      { label: "Cama", value: "Casal" },
      { label: "Guarda-roupa", value: "6 portas" },
      { label: "Cómoda", value: "Com espelho" },
      { label: "Colchão", value: "Incluso" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 2,
  },
  {
    slug: "sofa-veneza-retratil-reclinavel",
    name: "Sofá Veneza Retrátil e Reclinável 3 Lugares",
    category: "Móveis",
    description:
      "Sofá 3 lugares com mecanismo retrátil e reclinável: vira poltrona, vira espreguiçadeira. Suede macio e estrutura de madeira reflorestada.",
    priceCents: 189900,
    oldPriceCents: 229900,
    installments: "12x de R$ 158,25 sem juros",
    image: "/images/sofa.jpg",
    specs: [
      { label: "Lugares", value: "3" },
      { label: "Mecanismo", value: "Retrátil e reclinável" },
      { label: "Tecido", value: "Suede" },
      { label: "Pés", value: "Madeira" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 3,
  },
  {
    slug: "cozinha-compacta-nova-geracao",
    name: "Cozinha Compacta Nova Geração 6 Peças",
    category: "Móveis",
    description:
      "Balcões, aéreos e espaço para fogão e geladeira em um projeto que cabe em qualquer cozinha. Corrediças telescópicas e puxadores embutidos.",
    priceCents: 99900,
    oldPriceCents: 139900,
    installments: "10x de R$ 99,90 sem juros",
    image: "/images/cozinha-2.jpg",
    specs: [
      { label: "Peças", value: "6" },
      { label: "Balcões", value: "2" },
      { label: "Aéreos", value: "2" },
      { label: "Cor", value: "Branco / Nogal" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 4,
  },
  {
    slug: "mesa-jantar-ampla-6-lugares",
    name: "Mesa de Jantar Ampla com 6 Cadeiras",
    category: "Móveis",
    description:
      "Mesa de tampo em madeira maciça com acabamento em verniz PU e 6 cadeiras estofadas. Almoço de domingo com espaço de sobra.",
    priceCents: 119900,
    oldPriceCents: 149900,
    installments: "10x de R$ 119,90 sem juros",
    image: "/images/mesa-jantar.jpg",
    specs: [
      { label: "Lugares", value: "6" },
      { label: "Tampo", value: "Madeira maciça" },
      { label: "Acabamento", value: "Verniz PU" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 5,
  },
  {
    slug: "estante-liberty-3-repisas",
    name: "Estante Liberty 3 Repisas",
    category: "Móveis",
    description:
      "Estante aberta com 3 repisas para livros, plantas e decoração. Estrutura reforçada que não empena.",
    priceCents: 69900,
    oldPriceCents: 89900,
    installments: "8x de R$ 87,38 sem juros",
    image: "/images/estante.jpg",
    specs: [
      { label: "Repisas", value: "3" },
      { label: "Altura", value: "1,80 m" },
      { label: "Cor", value: "Castanho" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 6,
  },
  {
    slug: "rack-painel-tv-65",
    name: 'Rack com Painel para TV até 65"',
    category: "Móveis",
    description:
      "Rack suspensão com painel decorativo e suporte de TV fixo incluso. A sala ganha cara de sala nova em uma tarde.",
    priceCents: 79900,
    oldPriceCents: 99900,
    installments: "8x de R$ 99,88 sem juros",
    image: "/images/rack.jpg",
    specs: [
      { label: "TV", value: 'Até 65"' },
      { label: "Gavetas", value: "2" },
      { label: "Suporte de TV", value: "Incluso" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 7,
  },
  {
    slug: "geladeira-brastemp-frost-free-375l",
    name: "Geladeira Brastemp Frost Free Duplex 375L",
    category: "Eletrodomésticos",
    description:
      "Duplex frost free 375 litros com acabamento inox, gaveta de frutas e porta-garrafas integrado. Entregamos em pé, instalamos e levamos a caixa embora.",
    priceCents: 329900,
    oldPriceCents: 389900,
    installments: "12x de R$ 274,92 sem juros",
    image: "/images/geladeira.jpg",
    specs: [
      { label: "Capacidade", value: "375 L" },
      { label: "Frost Free", value: "Sim" },
      { label: "Cor", value: "Inox" },
      { label: "Voltagem", value: "110V / 220V" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: true,
    sortOrder: 8,
  },
  {
    slug: "fogao-consul-5-bocas-inox",
    name: "Fogão Consul 5 Bocas Inox com Grill",
    category: "Eletrodomésticos",
    description:
      "5 bocas com acendimento superautomático, forno com grill e timer. O fogão que resolve o feijão e o bolo no mesmo forno.",
    priceCents: 129900,
    oldPriceCents: 159900,
    installments: "10x de R$ 129,90 sem juros",
    image: "/images/fogao.jpg",
    specs: [
      { label: "Bocas", value: "5" },
      { label: "Forno", value: "Com grill" },
      { label: "Acendimento", value: "Superautomático" },
      { label: "Cor", value: "Inox" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 9,
  },
  {
    slug: "cooktop-fischer-5-bocas",
    name: "Cooktop Fischer 5 Bocas em Vidro Temperado",
    category: "Eletrodomésticos",
    description:
      "Cooktop de vidro temperado com 5 bocas e acendimento superautomático. Moderniza a bancada sem obra.",
    priceCents: 49900,
    oldPriceCents: 64900,
    installments: "8x de R$ 62,38 sem juros",
    image: "/images/fogao-2.jpg",
    specs: [
      { label: "Bocas", value: "5" },
      { label: "Material", value: "Vidro temperado" },
      { label: "Acendimento", value: "Superautomático" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 10,
  },
  {
    slug: "micro-ondas-philco-32l-inox",
    name: "Micro-ondas Philco 32L Inox",
    category: "Eletrodomésticos",
    description:
      "32 litros, 12 funções e painel digital. Aquele micro-ondas que descongela sem cozinhar a borda.",
    priceCents: 59900,
    oldPriceCents: 74900,
    installments: "8x de R$ 74,88 sem juros",
    image: "/images/micro-ondas.jpg",
    specs: [
      { label: "Capacidade", value: "32 L" },
      { label: "Potência", value: "1400 W" },
      { label: "Funções", value: "12" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 11,
  },
  {
    slug: "lava-e-seca-lg-11kg",
    name: "Lava e Seca LG 11kg com Steam",
    category: "Eletrodomésticos",
    description:
      "Lava e seca 11 kg com ciclo de vapor, 14 programas e eficiência energética A. Roupas prontas em um ciclo.",
    priceCents: 389900,
    oldPriceCents: 459900,
    installments: "12x de R$ 324,92 sem juros",
    image: "/images/lavadora.jpg",
    specs: [
      { label: "Capacidade", value: "11 kg" },
      { label: "Ciclos", value: "14" },
      { label: "Vapor", value: "Sim" },
      { label: "Eficiência", value: "A" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 12,
  },
  {
    slug: "lavadora-colormaq-8kg",
    name: "Lavadora Colormaq 8kg",
    category: "Eletrodomésticos",
    description:
      "Lavadora simples e durável, 10 ciclos, ideal para lavar roupa de cama e edredom sem sofrimento.",
    priceCents: 139900,
    oldPriceCents: 169900,
    installments: "10x de R$ 139,90 sem juros",
    image: "/images/lavadora-2.jpg",
    specs: [
      { label: "Capacidade", value: "8 kg" },
      { label: "Ciclos", value: "10" },
      { label: "Cor", value: "Branca" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 13,
  },
  {
    slug: "tv-samsung-50-cristal-4k",
    name: 'Smart TV Samsung 50" Crystal UHD 4K',
    category: "Eletrônicos",
    description:
      'Smart TV 50" Crystal UHD 4K com HDR, Wi-Fi e processador Crystal. Futebol de domingo em outra categoria.',
    priceCents: 279900,
    oldPriceCents: 339900,
    installments: "12x de R$ 233,25 sem juros",
    image: "/images/tv.jpg",
    specs: [
      { label: "Polegadas", value: '50"' },
      { label: "Resolução", value: "4K UHD" },
      { label: "HDR", value: "Sim" },
      { label: "Wi-Fi", value: "Sim" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: true,
    sortOrder: 14,
  },
  {
    slug: "tv-lg-55-4k",
    name: 'Smart TV LG 55" UHD 4K',
    category: "Eletrônicos",
    description:
      '55" UHD 4K com ThinQ AI e comandos por voz. O tamanho perfeito para a sala padrão da região.',
    priceCents: 349900,
    oldPriceCents: 419900,
    installments: "12x de R$ 291,58 sem juros",
    image: "/images/tv-2.jpg",
    specs: [
      { label: "Polegadas", value: '55"' },
      { label: "Resolução", value: "4K UHD" },
      { label: "Assistente", value: "ThinQ AI" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 15,
  },
  {
    slug: "colchao-castor-sleep-max",
    name: "Colchão Castor Sleep Max Molas Ensacadas Casal",
    category: "Colchões",
    description:
      "Molas ensacadas com pilow top: cada lado do colchão responde ao seu dormidor. Testado por quem trabalha o dia inteiro.",
    priceCents: 89900,
    oldPriceCents: 119900,
    installments: "10x de R$ 89,90 sem juros",
    image: "/images/colchao.jpg",
    specs: [
      { label: "Tipo", value: "Molas ensacadas" },
      { label: "Tamanho", value: "Casal" },
      { label: "Pilow top", value: "Sim" },
      { label: "Garantia", value: "5 anos" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: true,
    sortOrder: 16,
  },
  {
    slug: "cama-box-bau-casal",
    name: "Cama Box Baú Casal com Colchão",
    category: "Colchões",
    description:
      "Box baú casal com colchão incluso: guarda edredom, travesseiros e sobra espaço. Fechamento amortecido.",
    priceCents: 149900,
    oldPriceCents: 189900,
    installments: "12x de R$ 124,92 sem juros",
    image: "/images/cama-box.jpg",
    specs: [
      { label: "Tamanho", value: "Casal" },
      { label: "Baú", value: "Sim" },
      { label: "Colchão", value: "Incluso" },
    ],
    startsAt: NOW_START,
    endsAt: NOW_END,
    featured: false,
    sortOrder: 17,
  },
  {
    slug: "guarda-roupa-baby-conceito",
    name: "Guarda-Roupa Baby Conceito",
    category: "Móveis",
    description:
      "Oferta especial para quartinho do bebê: guarda-roupa baby com cantoneiras arredondadas e gaveta trocador.",
    priceCents: 69900,
    oldPriceCents: 89900,
    installments: "8x de R$ 87,38 sem juros",
    image: "/images/guarda-roupa-2.jpg",
    specs: [
      { label: "Portas", value: "4" },
      { label: "Gaveta trocador", value: "Sim" },
      { label: "Cor", value: "Branco" },
    ],
    startsAt: sp(9, 5),
    endsAt: sp(10, 20),
    featured: false,
    sortOrder: 90,
  },
  {
    slug: "combo-black-friday-antecipada",
    name: "Combo Black Friday: Geladeira + Fogão",
    category: "Eletrodomésticos",
    description:
      "A pré-venda da Black Friday da Real: geladeira duplex 375L + fogão 5 bocas inox, entregues e instalados juntos.",
    priceCents: 429900,
    oldPriceCents: 559800,
    installments: "12x de R$ 358,25 sem juros",
    image: "/images/cozinha.jpg",
    specs: [
      { label: "Geladeira", value: "Brastemp 375 L" },
      { label: "Fogão", value: "Consul 5 bocas" },
      { label: "Instalação", value: "Inclusa" },
    ],
    startsAt: sp(11, 5),
    endsAt: sp(11, 30),
    featured: false,
    sortOrder: 91,
  },
];

async function main() {
  console.log("Seeding Real Móveis Eletro demo database...");

  await db.delete(events);
  await db.delete(offers);
  await db.delete(units);

  const insertedUnits = await db.insert(units).values(UNIT_SEED).returning();
  console.log(`Units inserted: ${insertedUnits.length}`);

  const insertedOffers = await db
    .insert(offers)
    .values(OFFER_SEED)
    .returning({ id: offers.id });
  console.log(`Offers inserted: ${insertedOffers.length}`);

  // seed WhatsApp click events for the active offers (last 30 days)
  const activeOffers = insertedOffers.slice(0, 17);
  const unitSlugs = UNIT_SEED.map((u) => u.slug);
  const rows: { type: string; offerId: number; unitSlug: string; createdAt: Date }[] =
    [];
  const now = Date.now();
  for (const offer of activeOffers) {
    const clicks = 2 + Math.floor(Math.random() * 28);
    for (let i = 0; i < clicks; i++) {
      rows.push({
        type: "whatsapp_click",
        offerId: offer.id,
        unitSlug: unitSlugs[Math.floor(Math.random() * unitSlugs.length)],
        createdAt: new Date(now - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)),
      });
    }
  }
  await db.insert(events).values(rows);
  console.log(`Events inserted: ${rows.length}`);
  console.log("Seed done. Admin password: ADMIN_PASSWORD env (default 'real2026').");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
