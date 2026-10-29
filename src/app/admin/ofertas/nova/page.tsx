import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { OfferForm } from "@/components/admin/offer-form";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS — Nova oferta",
  robots: { index: false },
};

export default async function NovaOfertaPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="display-tight text-3xl text-ink sm:text-4xl">
          Nova oferta
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Preencha os dados, defina a vigência e publique. A oferta entra no ar na data
          de início e sai sozinha na data de fim.
        </p>
        <div className="mt-8">
          <OfferForm />
        </div>
      </main>
    </div>
  );
}
