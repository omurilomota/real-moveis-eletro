import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rm_session";
const MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "real-moveis-demo-secret-2026";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "real2026";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_S * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      exp: number;
    };
    return Date.now() < data.exp;
  } catch {
    return false;
  }
}

export const sessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  },
};

/** Server-side guard: returns true when the current request has a valid admin session. */
export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}
