import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { OfferForm } from "@/components/admin/offer-form";
import { isAdmin } from "@/lib/auth";
import { getAllOffersAdmin } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS — Editar oferta",
  robots: { index: false },
};

export default async function EditarOfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const offers = await getAllOffersAdmin();
  const offer = offers.find((o) => o.id === Number(id));
  if (!offer) redirect("/admin");

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="display-tight text-3xl text-ink sm:text-4xl">
          Editar oferta
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {offer.name} — /ofertas/{offer.slug}
        </p>
        <div className="mt-8">
          <OfferForm offer={offer} />
        </div>
      </main>
    </div>
  );
}
