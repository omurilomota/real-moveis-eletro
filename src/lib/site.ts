export const site = {
  name: "Real Móveis Eletro",
  shortName: "Real",
  domain: "real-moveis.vercel.app",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  tagline: "Há 48 anos equipando as casas da região",
  description:
    "Móveis, eletrodomésticos e colchões com entrega e montagem grátis. 6 unidades na região de Junqueirópolis, Adamantina, Dracena e região. Ofertas válidas por tempo limitado.",
  foundedYear: 1978,
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};

export const categories = [
  "Móveis",
  "Eletrodomésticos",
  "Colchões",
  "Eletrônicos",
  "Utilidades",
] as const;

export function getGaId() {
  return process.env.NEXT_PUBLIC_GA_ID ?? "";
}
