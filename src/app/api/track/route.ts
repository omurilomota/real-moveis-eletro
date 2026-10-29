import { z } from "zod";
import { logEvent } from "@/lib/data";

export const dynamic = "force-dynamic";

const schema = z.object({
  type: z.enum(["whatsapp_click", "offer_view"]),
  offerId: z.number().int().positive().nullable().optional(),
  unitSlug: z.string().max(60).nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false }, { status: 400 });
    }
    await logEvent({
      type: parsed.data.type,
      offerId: parsed.data.offerId ?? null,
      unitSlug: parsed.data.unitSlug ?? null,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
