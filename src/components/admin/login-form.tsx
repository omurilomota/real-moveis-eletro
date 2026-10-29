"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Senha incorreta. Tente novamente.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white">
        <LockKeyhole className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-center font-display text-2xl font-bold uppercase tracking-tight text-white">
        CMS Real Móveis
      </h1>
      <p className="mt-2 text-center text-sm text-white/50">
        Acesso exclusivo da equipe de marketing.
      </p>

      <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-white/60">
        Senha
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoFocus
        className="mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-white placeholder-white/25 outline-none transition-colors focus:border-brand"
      />
      {error && <p className="mt-3 text-sm font-semibold text-brand">{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-dark disabled:opacity-40"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Entrar no painel
      </button>
      <p className="mt-4 text-center text-xs text-white/30">
        Sessão válida por 7 dias · cookies httpOnly · 2FA no roadmap
      </p>
    </form>
  );
}
