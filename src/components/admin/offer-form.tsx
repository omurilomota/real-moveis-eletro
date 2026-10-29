"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicOffer } from "@/lib/data";

const CATEGORIES = ["Móveis", "Eletrodomésticos", "Colchões", "Eletrônicos", "Utilidades"];

const IMAGES = [
  "/images/guarda-roupa.jpg",
  "/images/guarda-roupa-2.jpg",
  "/images/quarto-casal.jpg",
  "/images/cama-box.jpg",
  "/images/sofa.jpg",
  "/images/cozinha.jpg",
  "/images/cozinha-2.jpg",
  "/images/geladeira.jpg",
  "/images/fogao.jpg",
  "/images/fogao-2.jpg",
  "/images/micro-ondas.jpg",
  "/images/lavadora.jpg",
  "/images/lavadora-2.jpg",
  "/images/tv.jpg",
  "/images/tv-2.jpg",
  "/images/mesa-jantar.jpg",
  "/images/estante.jpg",
  "/images/rack.jpg",
];

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand";
const labelCls = "text-xs font-bold uppercase tracking-wider text-ink/50";

export function OfferForm({ offer }: { offer?: PublicOffer }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(offer?.name ?? "");
  const [slug, setSlug] = useState(offer?.slug ?? "");
  const [category, setCategory] = useState(offer?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(offer ? String(offer.priceCents / 100) : "");
  const [oldPrice, setOldPrice] = useState(
    offer?.oldPriceCents ? String(offer.oldPriceCents / 100) : "",
  );
  const [installments, setInstallments] = useState(offer?.installments ?? "");
  const [image, setImage] = useState(offer?.image ?? IMAGES[0]);
  const [description, setDescription] = useState(offer?.description ?? "");
  const [specs, setSpecs] = useState(
    offer?.specs.map((s) => `${s.label}: ${s.value}`).join("\n") ?? "",
  );
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 12);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12);
  const [startsAt, setStartsAt] = useState(
    offer ? toDatetimeLocal(offer.startsAt) : toDatetimeLocal(monthStart.toISOString()),
  );
  const [endsAt, setEndsAt] = useState(
    offer ? toDatetimeLocal(offer.endsAt) : toDatetimeLocal(monthEnd.toISOString()),
  );
  const [active, setActive] = useState(offer?.active ?? true);
  const [featured, setFeatured] = useState(offer?.featured ?? false);
  const [sortOrder, setSortOrder] = useState("0");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const specList = specs
        .split("\n")
        .map((line) => line.split(":"))
        .filter((parts) => parts.length >= 2 && parts[0].trim() && parts.slice(1).join(":").trim())
        .map((parts) => ({
          label: parts[0].trim(),
          value: parts.slice(1).join(":").trim(),
        }));

      const payload = {
        slug,
        name,
        category,
        description,
        price: Number(price.replace(",", ".")),
        oldPrice: oldPrice ? Number(oldPrice.replace(",", ".")) : null,
        installments,
        image,
        specs: specList,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        active,
        featured,
        sortOrder: Number(sortOrder) || 0,
      };

      const res = await fetch(
        offer ? `/api/admin/offers/${offer.id}` : "/api/admin/offers",
        {
          method: offer ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Erro ao salvar. Verifique os campos.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Produto
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nome da oferta *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Guarda-Roupa Dubai 6 Portas com Espelho"
                required
                minLength={3}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Slug (URL) — deixe vazio para gerar</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="guarda-roupa-dubai-6-portas"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Texto curto de venda que aparece na página da oferta..."
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Especificações — uma por linha, formato “rótulo: valor”
              </label>
              <textarea
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                rows={4}
                placeholder={"Largura: 1,80 m\nPortas: 6\nCor: Amêndoa"}
                className={`${inputCls} font-mono text-xs`}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Vigência agendada
          </h2>
          <p className="mt-1 text-xs text-ink/50">
            A oferta entra no ar sozinha na data de início e sai do ar na data de fim —
            sem depender de ninguém para trocar o site.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Entra em *</label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Sai em *</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Preço
          </h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelCls}>Preço promocional (R$) *</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="1299.90"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Preço antigo (R$) — opcional</label>
              <input
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                inputMode="decimal"
                placeholder="1799.90"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Parcelamento — ex.: “10x de R$ 129,99 sem juros”</label>
              <input
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Imagem
          </h2>
          <div className="mt-4">
            <select
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputCls}
            >
              {IMAGES.map((img) => (
                <option key={img}>{img}</option>
              ))}
            </select>
            {image && (
              <div className="mt-3 overflow-hidden rounded-xl border border-ink/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Prévia" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
            <p className="mt-2 text-xs text-ink/40">
              Quer usar outra foto? Cole o caminho em /images/ no campo abaixo.
            </p>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Publicação
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 accent-[#e2371f]"
              />
              Oferta ativa (respeita a vigência)
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-[#e2371f]"
              />
              Destaque na home
            </label>
            <div>
              <label className={labelCls}>Ordem de exibição</label>
              <input
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                inputMode="numeric"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-display text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {offer ? "Salvar alterações" : "Publicar oferta"}
        </button>
      </div>
    </form>
  );
}
