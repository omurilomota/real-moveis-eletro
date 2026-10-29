import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { offers } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { offerInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const offerId = Number(id);
    if (!Number.isInteger(offerId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }
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
    const slug = slugify(d.slug || d.name) || `oferta-${Date.now()}`;
    await db
      .update(offers)
      .set({
        slug,
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
        updatedAt: new Date(),
      })
      .where(eq(offers.id, offerId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/offers PUT]", err);
    return NextResponse.json({ ok: false, error: "Erro ao salvar" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const offerId = Number(id);
    if (!Number.isInteger(offerId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }
    await db.delete(offers).where(eq(offers.id, offerId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/offers DELETE]", err);
    return NextResponse.json({ ok: false, error: "Erro ao excluir" }, { status: 500 });
  }
}
