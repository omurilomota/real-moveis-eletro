import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getOfferBySlug } from "@/lib/data";
import { formatBRL } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

async function imageToDataUri(imagePath: string): Promise<string | null> {
  try {
    const file = path.join(process.cwd(), "public", imagePath);
    const buf = await readFile(file);
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#17130f",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Real Móveis Eletro
        </div>
      ),
      size,
    );
  }

  const photo = await imageToDataUri(offer.image);
  const price = formatBRL(offer.priceCents);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#17130f",
        }}
      >
        {/* left: text */}
        <div
          style={{
            width: "56%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#e2371f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
                <path d="M4 21V10.6L12 4l8 6.6V21h-5.6v-5.4a2.4 2.4 0 0 0-4.8 0V21H4Z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>
                REAL MÓVEIS ELETRO
              </span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 600, letterSpacing: "0.24em" }}>
                DESDE 1978
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "#e2371f",
                color: "#fff",
                borderRadius: 999,
                padding: "8px 22px",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              OFERTA DO MÊS
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: offer.name.length > 34 ? 54 : 64,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                maxWidth: 560,
              }}
            >
              {offer.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ color: "#f0a12b", fontSize: 76, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {price}
              </span>
              {offer.oldPriceCents && offer.oldPriceCents > offer.priceCents ? (
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 30,
                    textDecoration: "line-through",
                  }}
                >
                  {formatBRL(offer.oldPriceCents)}
                </span>
              ) : null}
            </div>
          </div>

          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 22, fontWeight: 600 }}>
            Entrega e montagem grátis · real-moveis.vercel.app
          </div>
        </div>

        {/* right: photo */}
        <div
          style={{
            position: "relative",
            width: "44%",
            height: "100%",
            display: "flex",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={offer.name}
              width={528}
              height={630}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#221b14" }} />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, #17130f 0%, rgba(23,19,15,0) 24%)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
