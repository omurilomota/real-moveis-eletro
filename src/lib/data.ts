import { and, asc, count, desc, eq, gte, lte, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, offers, units, type Spec, type Unit } from "@/db/schema";

export type PublicOffer = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  oldPriceCents: number | null;
  installments: string;
  image: string;
  specs: Spec[];
  startsAt: string;
  endsAt: string;
  featured: boolean;
  active: boolean;
};

export type UnitLite = {
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  hours: string;
  lat: string;
  lng: string;
  isFlagship: boolean;
};

export function toPublicOffer(o: typeof offers.$inferSelect): PublicOffer {
  return {
    id: o.id,
    slug: o.slug,
    name: o.name,
    category: o.category,
    description: o.description,
    priceCents: o.priceCents,
    oldPriceCents: o.oldPriceCents,
    installments: o.installments,
    image: o.image,
    specs: o.specs ?? [],
    startsAt: o.startsAt.toISOString(),
    endsAt: o.endsAt.toISOString(),
    featured: o.featured,
    active: o.active,
  };
}

export function toUnitLite(u: Unit): UnitLite {
  return {
    slug: u.slug,
    name: u.name,
    city: u.city,
    state: u.state,
    address: u.address,
    phone: u.phone,
    phoneDisplay: u.phoneDisplay,
    hours: u.hours,
    lat: u.lat,
    lng: u.lng,
    isFlagship: u.isFlagship,
  };
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data] query failed:", err);
    return fallback;
  }
}

/** Offers currently valid (started, not expired, active flag on). */
export async function getValidOffers() {
  return safe(async () => {
    const now = new Date();
    const rows = await db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.active, true),
          lte(offers.startsAt, now),
          gte(offers.endsAt, now),
        ),
      )
      .orderBy(desc(offers.featured), asc(offers.sortOrder), desc(offers.id));
    return rows.map(toPublicOffer);
  }, [] as PublicOffer[]);
}

export async function getOfferBySlug(slug: string) {
  return safe(async () => {
    const rows = await db
      .select()
      .from(offers)
      .where(eq(offers.slug, slug))
      .limit(1);
    return rows[0] ? toPublicOffer(rows[0]) : null;
  }, null as PublicOffer | null);
}

export async function getRelatedOffers(category: string, excludeSlug: string) {
  return safe(async () => {
    const now = new Date();
    const rows = await db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.active, true),
          lte(offers.startsAt, now),
          gte(offers.endsAt, now),
          eq(offers.category, category),
          ne(offers.slug, excludeSlug),
        ),
      )
      .orderBy(desc(offers.featured), desc(offers.id))
      .limit(3);
    return rows.map(toPublicOffer);
  }, [] as PublicOffer[]);
}

export async function getUnits() {
  return safe(async () => {
    const rows = await db
      .select()
      .from(units)
      .orderBy(asc(units.sortOrder), asc(units.id));
    return rows.map(toUnitLite);
  }, [] as UnitLite[]);
}

export async function getUnitBySlug(slug: string) {
  return safe(async () => {
    const rows = await db.select().from(units).where(eq(units.slug, slug)).limit(1);
    return rows[0] ? toUnitLite(rows[0]) : null;
  }, null as UnitLite | null);
}

export async function getAllOffersAdmin() {
  return safe(async () => {
    const rows = await db
      .select()
      .from(offers)
      .orderBy(desc(offers.startsAt), desc(offers.id));
    return rows.map(toPublicOffer);
  }, [] as PublicOffer[]);
}

export async function getAdminStats() {
  return safe(
    async () => {
      const now = new Date();
      const in7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      const in30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

      const [activeOffers] = await db
        .select({ n: count() })
        .from(offers)
        .where(
          and(
            eq(offers.active, true),
            lte(offers.startsAt, now),
            gte(offers.endsAt, now),
          ),
        );
      const [totalOffers] = await db.select({ n: count() }).from(offers);
      const [clicks7] = await db
        .select({ n: count() })
        .from(events)
        .where(and(eq(events.type, "whatsapp_click"), gte(events.createdAt, in7)));
      const [clicks30] = await db
        .select({ n: count() })
        .from(events)
        .where(and(eq(events.type, "whatsapp_click"), gte(events.createdAt, in30)));
      const [totalClicks] = await db
        .select({ n: count() })
        .from(events)
        .where(eq(events.type, "whatsapp_click"));

      return {
        activeOffers: activeOffers?.n ?? 0,
        totalOffers: totalOffers?.n ?? 0,
        clicks7: clicks7?.n ?? 0,
        clicks30: clicks30?.n ?? 0,
        totalClicks: totalClicks?.n ?? 0,
      };
    },
    { activeOffers: 0, totalOffers: 0, clicks7: 0, clicks30: 0, totalClicks: 0 },
  );
}

/** WhatsApp clicks in the last 30 days grouped by offer (for the CMS table). */
export async function getClicksByOffer() {
  return safe(async () => {
    const in30 = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const rows = await db
      .select({ offerId: events.offerId, n: count() })
      .from(events)
      .where(
        and(eq(events.type, "whatsapp_click"), gte(events.createdAt, in30)),
      )
      .groupBy(events.offerId);
    const map = new Map<number, number>();
    for (const r of rows) if (r.offerId != null) map.set(r.offerId, r.n);
    return map;
  }, new Map<number, number>());
}

export async function logEvent(input: {
  type: string;
  offerId?: number | null;
  unitSlug?: string | null;
}) {
  try {
    await db.insert(events).values({
      type: input.type,
      offerId: input.offerId ?? null,
      unitSlug: input.unitSlug ?? null,
    });
  } catch (err) {
    console.error("[data] logEvent failed:", err);
  }
}

export async function getTopOffersForSitemap() {
  return safe(async () => {
    const rows = await db
      .select({ slug: offers.slug, updatedAt: offers.updatedAt })
      .from(offers)
      .where(eq(offers.active, true))
      .orderBy(desc(offers.updatedAt))
      .limit(500);
    return rows;
  }, [] as { slug: string; updatedAt: Date }[]);
}

export async function getUnitSlugsForSitemap() {
  return safe(async () => {
    return db.select({ slug: units.slug }).from(units);
  }, [] as { slug: string }[]);
}

// keep drizzle's sql import referenced for potential raw queries
void sql;
