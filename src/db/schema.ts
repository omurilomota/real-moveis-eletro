import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type Spec = { label: string; value: string };

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default("SP"),
  address: text("address").notNull(),
  phone: text("phone").notNull(), // digits only, with country code: 5518999990110
  phoneDisplay: text("phone_display").notNull(), // (18) 99999-0110
  hours: text("hours").notNull(),
  hoursSchema: text("hours_schema").notNull().default("Mo-Sa 08:00-18:00"),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  isFlagship: boolean("is_flagship").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  oldPriceCents: integer("old_price_cents"),
  installments: text("installments").notNull().default(""),
  image: text("image").notNull(),
  specs: jsonb("specs")
    .$type<Spec[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'whatsapp_click' | 'offer_view'
  offerId: integer("offer_id").references(() => offers.id, {
    onDelete: "set null",
  }),
  unitSlug: text("unit_slug"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Unit = typeof units.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
