import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="texture-grid grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
        <div>
          <p className="display-tight text-8xl text-brand">404</p>
          <h1 className="display-tight mt-4 text-3xl text-ink">
            Página não encontrada
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
            Talvez esta oferta tenha encerrado a vigência (elas saem do ar sozinhas,
            como prometido). Veja as ofertas que estão valendo agora.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ofertas"
              className="rounded-full bg-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              Ver ofertas ativas
            </Link>
            <Link
              href="/"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-ink/40"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
