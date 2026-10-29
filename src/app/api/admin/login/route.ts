import { NextResponse } from "next/server";
import { z } from "zod";
import { adminPassword, createSessionToken, sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success || parsed.data.password !== adminPassword()) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookie.name, createSessionToken(), sessionCookie.options);
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
