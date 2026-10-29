import {
  CalendarClock,
  Eye,
  Megaphone,
  MessageCircle,
  MousePointerClick,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { OffersTable } from "@/components/admin/offers-table";
import { isAdmin } from "@/lib/auth";
import {
  getAdminStats,
  getAllOffersAdmin,
  getClicksByOffer,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS — Dashboard",
  robots: { index: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [stats, offers, clicksMap] = await Promise.all([
    getAdminStats(),
    getAllOffersAdmin(),
    getClicksByOffer(),
  ]);
  const clicks = Object.fromEntries(clicksMap.entries());

  const cards = [
    {
      icon: Megaphone,
      label: "Ofertas ativas agora",
      value: stats.activeOffers,
      hint: `${stats.totalOffers} cadastradas no total`,
      color: "bg-brand/10 text-brand",
    },
    {
      icon: MousePointerClick,
      label: "Cliques no WhatsApp · 7 dias",
      value: stats.clicks7,
      hint: `${stats.clicks30} nos últimos 30 dias`,
      color: "bg-leaf/10 text-leaf",
    },
    {
      icon: MessageCircle,
      label: "Cliques no WhatsApp · total",
      value: stats.totalClicks,
      hint: "desde o lançamento do site",
      color: "bg-gold/15 text-[#8a5a00]",
    },
    {
      icon: CalendarClock,
      label: "Vigência automática",
      value: "ON",
      hint: "ofertas entram e saem sozinhas",
      color: "bg-ink/8 text-ink",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="display-tight text-3xl text-ink sm:text-4xl">
          Painel da loja
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Publique as ofertas do mês com data de vigência e acompanhe quantos clientes
          saíram do site direto para o WhatsApp. Ninguém precisa de programador para
          trocar promoção.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">
                {c.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink/50">
                {c.label}
              </p>
              <p className="mt-0.5 text-xs text-ink/40">{c.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
            Todas as ofertas
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-ink/40">
            <Eye className="h-3.5 w-3.5" />
            Dica: ordene o cardápio pelo campo “ordem de exibição”
          </p>
        </div>

        <div className="mt-4">
          <OffersTable offers={offers} clicks={clicks} />
        </div>
      </main>
    </div>
  );
}
