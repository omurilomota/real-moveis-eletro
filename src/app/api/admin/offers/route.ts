import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { offers } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { offerInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

async function uniqueSlug(base: string, excludeId?: number) {
  const root = slugify(base) || `oferta-${Date.now()}`;
  let candidate = root;
  let n = 2;
  for (;;) {
    const existing = await db
      .select({ id: offers.id })
      .from(offers)
      .where(eq(offers.slug, candidate))
      .limit(1);
    if (!existing[0] || existing[0].id === excludeId) return candidate;
    candidate = `${root}-${n++}`;
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = offerInputSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: `${first.path.join(".")}: ${first.message}` },
        { status: 422 },
      );
    }
    const d = parsed.data;
    const inserted = await db
      .insert(offers)
      .values({
        slug: await uniqueSlug(d.slug || d.name),
        name: d.name,
        category: d.category,
        description: d.description,
        priceCents: Math.round(d.price * 100),
        oldPriceCents: d.oldPrice ? Math.round(d.oldPrice * 100) : null,
        installments: d.installments,
        image: d.image,
        specs: d.specs,
        startsAt: new Date(d.startsAt),
        endsAt: new Date(d.endsAt),
        active: d.active,
        featured: d.featured,
        sortOrder: d.sortOrder,
      })
      .returning({ id: offers.id });
    return NextResponse.json({ ok: true, id: inserted[0]?.id });
  } catch (err) {
    console.error("[admin/offers POST]", err);
    return NextResponse.json({ ok: false, error: "Erro ao salvar" }, { status: 500 });
  }
}
