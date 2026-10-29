import { ArrowLeft, LayoutDashboard, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/site-header";

export function AdminNav() {
  return (
    <header className="border-b border-ink/10 bg-ink text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo light />
          <span className="hidden rounded-full border border-white/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white/60 sm:block">
            CMS · painel da loja
          </span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/admin/ofertas/nova"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova oferta</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Ver site</span>
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              aria-label="Sair"
              className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
