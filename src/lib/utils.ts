export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(cents: number) {
  return brl.format(cents / 100);
}

export function formatDateBR(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function discountPercent(priceCents: number, oldPriceCents?: number | null) {
  if (!oldPriceCents || oldPriceCents <= priceCents) return 0;
  return Math.round((1 - priceCents / oldPriceCents) * 100);
}

/** Builds a wa.me deep link with a pre-filled message for the given unit. */
export function buildWaLink(
  phone: string,
  text: string,
) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function offerWaMessage(offerName: string, priceBRL: string, city: string) {
  return `Olá! Vi "${offerName}" por ${priceBRL} no site da Real Móveis de ${city}. Ainda tem disponível?`;
}

export function offerStatus(
  startsAt: Date | string,
  endsAt: Date | string,
  active: boolean,
  now = new Date(),
): "ativa" | "agendada" | "encerrada" | "inativa" {
  const s = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  const e = typeof endsAt === "string" ? new Date(endsAt) : endsAt;
  if (!active) return "inativa";
  if (now < s) return "agendada";
  if (now > e) return "encerrada";
  return "ativa";
}

/** Fire-and-forget event tracking (internal analytics + GA4 if present). */
export function trackEvent(
  type: "whatsapp_click" | "offer_view",
  payload: { offerId?: number; unitSlug?: string; offerName?: string },
) {
  try {
    const body = JSON.stringify({ type, ...payload });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // analytics must never break the UX
  }
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", type, {
      offer_id: payload.offerId,
      offer_name: payload.offerName,
      unit: payload.unitSlug,
    });
  } catch {
    // noop
  }
}
