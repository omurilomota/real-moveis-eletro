"use client";

import { CalendarRange, Eye, Loader2, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicOffer } from "@/lib/data";
import { cn, formatBRL, offerStatus } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  ativa: "bg-leaf/15 text-leaf",
  agendada: "bg-gold/20 text-[#8a5a00]",
  encerrada: "bg-ink/8 text-ink/50",
  inativa: "bg-ink/8 text-ink/40",
};

export function OffersTable({
  offers,
  clicks,
}: {
  offers: PublicOffer[];
  clicks: Record<number, number>;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function onDelete(id: number) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmId(null);
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  }

  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-12 text-center text-sm text-ink/50">
        Nenhuma oferta cadastrada ainda. Clique em “Nova oferta” para começar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/8 text-[0.65rem] uppercase tracking-wider text-ink/40">
            <th className="px-5 py-3.5 font-bold">Oferta</th>
            <th className="px-3 py-3.5 font-bold">Preço</th>
            <th className="px-3 py-3.5 font-bold">Vigência</th>
            <th className="px-3 py-3.5 font-bold">Status</th>
            <th className="px-3 py-3.5 font-bold">
              <span className="inline-flex items-center gap-1">
                Cliques WA <Eye className="h-3 w-3" /> 30d
              </span>
            </th>
            <th className="px-3 py-3.5 font-bold text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => {
            const status = offerStatus(o.startsAt, o.endsAt, o.active);
            return (
              <tr key={o.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={o.image}
                      alt=""
                      className="h-11 w-16 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 font-bold text-ink">
                        {o.name}
                        {o.featured && <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" />}
                      </p>
                      <p className="text-xs text-ink/45">
                        {o.category} · /ofertas/{o.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <p className="font-bold text-ink">{formatBRL(o.priceCents)}</p>
                  {o.oldPriceCents && (
                    <p className="text-xs text-ink/40 line-through">
                      {formatBRL(o.oldPriceCents)}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3.5 text-xs text-ink/60">
                  <span className="flex items-center gap-1.5">
                    <CalendarRange className="h-3.5 w-3.5 text-brand" />
                    {new Date(o.startsAt).toLocaleDateString("pt-BR")} →{" "}
                    {new Date(o.endsAt).toLocaleDateString("pt-BR")}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
                      statusStyle[status],
                    )}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-bold text-leaf">
                    {clicks[o.id] ?? 0}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/ofertas/${o.slug}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 hover:bg-cream hover:text-ink"
                      aria-label="Ver no site"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/ofertas/${o.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 hover:bg-cream hover:text-ink"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {confirmId === o.id ? (
                      <button
                        onClick={() => onDelete(o.id)}
                        disabled={deleting === o.id}
                        className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-bold text-white"
                      >
                        {deleting === o.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Confirmar
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmId(o.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 hover:bg-brand/10 hover:text-brand"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
