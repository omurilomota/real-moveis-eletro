import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  res.cookies.set(sessionCookie.name, "", { ...sessionCookie.options, maxAge: 0 });
  return res;
}
