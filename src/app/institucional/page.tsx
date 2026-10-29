import { ArrowRight, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getUnits } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Institucional",
  description:
    "A história da Real Móveis Eletro: fundada em 1978 em Junqueirópolis, hoje com 6 unidades administradas pela 2ª geração da família. Entrega e montagem grátis desde sempre.",
  alternates: { canonical: "/institucional" },
};

const timeline = [
  {
    year: "1978",
    title: "A primeira loja",
    text: "A família abre a primeira loja de móveis em Junqueirópolis, com um princípio simples: preço justo e palavra cumprida.",
  },
  {
    year: "1986",
    title: "Chegam os eletrodomésticos",
    text: "A loja passa a vender também geladeiras, fogões e TVs — nasce a Real Móveis e Eletro que conhecemos hoje.",
  },
  {
    year: "1994",
    title: "Crediário próprio",
    text: "A Real cria seu crediário próprio para atender quem não tinha acesso ao crédito bancário. Até hoje, a aprovação é na hora, na loja.",
  },
  {
    year: "2003",
    title: "A rede cresce",
    text: "Novas unidades são inauguradas em cidades da região: Adamantina, Dracena, Tupi Paulista, Pacaembu e Flórida Paulista.",
  },
  {
    year: "2015",
    title: "2ª geração assume",
    text: "A segunda geração da família assume a administração da rede, modernizando a operação sem abrir mão do atendimento de bairro.",
  },
  {
    year: "2026",
    title: "48 anos depois",
    text: "São 6 unidades, centenas de colaboradores e a mesma promessa de 1978: sua casa montada, com entrega grátis, no seu tempo.",
  },
];

const valores = [
  {
    icon: Truck,
    title: "Entrega e montagem grátis",
    text: "A gente leva, monta e ajusta. Sem taxa escondida, sem “frete calculado na hora”.",
  },
  {
    icon: HeartHandshake,
    title: "Crediário na hora",
    text: "Crédito próprio, aprovado na loja, conversado de pessoa para pessoa.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia local",
    text: "Assistência e garantia resolvidas na sua cidade, com a cara do vendedor que te atendeu.",
  },
];

export default async function InstitucionalPage() {
  const units = await getUnits();
  const flagship = units.find((u) => u.isFlagship) ?? units[0];

  return (
    <>
      <SiteHeader overlay />
      <WhatsAppFloat phone={flagship?.phone ?? "5518999990110"} />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink text-white">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loja-2.jpg"
              alt="Móveis em exposição na Real Móveis Eletro"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
          </div>
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Institucional
              </p>
              <h1 className="display-tight mt-4 text-5xl sm:text-7xl">
                48 anos de
                <br />
                <span className="text-brand">palavra cumprida</span>
              </h1>
              <p className="mt-6 max-w-xl leading-relaxed text-white/70">
                Da primeira loja de móveis em Junqueirópolis a uma rede de {units.length}{" "}
                unidades no interior paulista. Uma história escrita em sala de estar de
                cliente.
              </p>
            </Reveal>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="texture-grid mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <h2 className="display-tight text-4xl text-ink sm:text-5xl">
              Linha do tempo
            </h2>
          </Reveal>
          <div className="relative mt-14">
            <div className="absolute left-[19px] top-0 h-full w-px bg-ink/15 sm:left-1/2" />
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={0.05}>
                  <div
                    className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                      i % 2 === 1 ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`sm:w-1/2 ${i % 2 === 1 ? "sm:pl-14" : "sm:pr-14 sm:text-right"}`}>
                      <span className="display-tight text-4xl text-brand sm:text-5xl">
                        {t.year}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-ink">
                        {t.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/60 sm:inline-block">
                        {t.text}
                      </p>
                    </div>
                    <span className="absolute left-[11px] top-1.5 h-[18px] w-[18px] rounded-full border-4 border-paper bg-brand sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2" />
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="bg-cream py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display-tight max-w-2xl text-4xl text-ink sm:text-5xl">
                O que não muda <span className="text-brand">nem em 48 anos</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {valores.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                      <v.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="texture-dots bg-ink py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="display-tight mx-auto max-w-3xl text-4xl sm:text-5xl">
                Passe na loja. O café é por nossa conta.
              </h2>
              <Link
                href="/unidades"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Encontre a unidade mais próxima
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
