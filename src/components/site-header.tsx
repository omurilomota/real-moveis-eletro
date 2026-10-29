"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/ofertas", label: "Ofertas" },
  { href: "/unidades", label: "Unidades" },
  { href: "/institucional", label: "Institucional" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group relative flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-[0_6px_16px_-6px_rgba(226,55,31,0.7)] transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M4 21V10.6L12 4l8 6.6V21h-5.6v-5.4a2.4 2.4 0 0 0-4.8 0V21H4Z" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold uppercase leading-none tracking-tight transition-colors duration-300",
          light
            ? "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]"
            : "text-ink",
        )}
      >
        Real
        <span className={light ? "text-[#ff6a4f]" : "text-brand"}> Móveis</span>
        <span
          className={cn(
            "block text-[0.6rem] font-semibold tracking-[0.28em] transition-colors duration-300",
            light ? "text-white/70" : "text-ink/50",
          )}
        >
          ELETRO
        </span>
      </span>
    </Link>
  );
}

/**
 * `overlay` = the header sits on top of a dark hero image, so it starts with
 * light text and flips to the solid light bar once the user scrolls.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;
  const onDark = overlay && !solid;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-ink/8 bg-paper/90 shadow-[0_8px_30px_-18px_rgba(23,19,15,0.4)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      {/* readability scrim while floating over a photo */}
      {onDark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-ink/75 via-ink/35 to-transparent"
        />
      )}

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo light={onDark} />

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-sweep text-sm font-semibold tracking-wide transition-colors",
                  onDark
                    ? active
                      ? "text-[#ff6a4f]"
                      : "text-white/85 hover:text-white"
                    : active
                      ? "text-brand"
                      : "text-ink/70 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin"
            aria-label="CMS"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition-colors",
              onDark
                ? "text-white/60 hover:bg-white/15 hover:text-white"
                : "text-ink/40 hover:bg-ink/5 hover:text-ink/70",
            )}
          >
            <Lock className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/5518999990110?text=Ol%C3%A1!%20Vi%20o%20site%20da%20Real%20M%C3%B3veis%20Eletro%20e%20quero%20falar%20com%20a%20loja."
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(31,122,61,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(31,122,61,0.8)]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <button
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg transition-colors md:hidden",
            onDark ? "text-white" : "text-ink",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/8 bg-paper md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-3 font-display text-xl font-bold uppercase tracking-tight text-ink hover:bg-cream"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3">
                <a
                  href="https://wa.me/5518999990110"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf px-4 py-3 text-sm font-bold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <Link
                  href="/admin"
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink/50"
                  aria-label="CMS"
                >
                  <Lock className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
