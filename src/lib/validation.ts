import { z } from "zod";

const isoDate = z
  .string()
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "Data inválida");

export const offerInputSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Slug inválido")
    .optional()
    .or(z.literal("")),
  name: z.string().trim().min(3, "Nome muito curto").max(120),
  category: z.string().trim().min(2).max(40),
  description: z.string().trim().max(2000).default(""),
  price: z.number().positive("Preço deve ser maior que zero"),
  oldPrice: z.number().positive().nullable().optional(),
  installments: z.string().trim().max(80).default(""),
  image: z.string().trim().min(1, "Informe a imagem").max(300),
  specs: z
    .array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(120) }))
    .max(12)
    .default([]),
  startsAt: isoDate,
  endsAt: isoDate,
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export type OfferInput = z.infer<typeof offerInputSchema>;
