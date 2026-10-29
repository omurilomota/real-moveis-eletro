import { describe, expect, it } from "vitest";
import {
  buildWaLink,
  discountPercent,
  formatBRL,
  offerStatus,
  offerWaMessage,
  slugify,
} from "./utils";
import { offerInputSchema } from "./validation";

describe("formatBRL", () => {
  it("converte centavos para reais", () => {
    const plain = (value: string) => value.replace(/\u00a0/g, " ");
    expect(plain(formatBRL(129900))).toBe("R$ 1.299,00");
    expect(plain(formatBRL(0))).toBe("R$ 0,00");
  });
});

describe("discountPercent", () => {
  it("calcula a porcentagem de desconto arredondada", () => {
    expect(discountPercent(80000, 100000)).toBe(20);
    expect(discountPercent(74900, 100000)).toBe(25);
  });

  it("retorna 0 sem preço antigo ou quando não há desconto", () => {
    expect(discountPercent(80000)).toBe(0);
    expect(discountPercent(80000, null)).toBe(0);
    expect(discountPercent(80000, 80000)).toBe(0);
    expect(discountPercent(80000, 70000)).toBe(0);
  });
});

describe("slugify", () => {
  it("remove acentos, espaços e pontuação", () => {
    expect(slugify("Sofá Retrátil 3 Lugares — Cinza")).toBe(
      "sofa-retratil-3-lugares-cinza",
    );
    expect(slugify("  Mesa & Cadeiras  ")).toBe("mesa-cadeiras");
  });
});

describe("offerStatus", () => {
  const now = new Date("2026-06-15T12:00:00Z");

  it("identifica oferta ativa dentro da janela", () => {
    expect(offerStatus("2026-06-01", "2026-06-30", true, now)).toBe("ativa");
  });

  it("identifica agendada, encerrada e inativa", () => {
    expect(offerStatus("2026-07-01", "2026-07-31", true, now)).toBe("agendada");
    expect(offerStatus("2026-05-01", "2026-05-31", true, now)).toBe("encerrada");
    expect(offerStatus("2026-06-01", "2026-06-30", false, now)).toBe("inativa");
  });
});

describe("links de WhatsApp", () => {
  it("codifica a mensagem e usa o telefone da unidade", () => {
    expect(buildWaLink("5518999999999", "Olá!")).toBe(
      "https://wa.me/5518999999999?text=Ol%C3%A1!",
    );
  });

  it("monta a mensagem com nome, preço e cidade", () => {
    expect(offerWaMessage("Sofá Aurora", "R$ 1.299,00", "Junqueirópolis")).toBe(
      'Olá! Vi "Sofá Aurora" por R$ 1.299,00 no site da Real Móveis de Junqueirópolis. Ainda tem disponível?',
    );
  });
});

describe("offerInputSchema", () => {
  const base = {
    name: "Sofá Aurora",
    category: "Sofás",
    price: 129900,
    image: "https://example.com/sofa.jpg",
    startsAt: "2026-06-01",
    endsAt: "2026-06-30",
  };

  it("aceita uma oferta válida e aplica defaults", () => {
    const parsed = offerInputSchema.parse(base);
    expect(parsed).toMatchObject({
      name: "Sofá Aurora",
      active: true,
      featured: false,
      sortOrder: 0,
      specs: [],
      description: "",
    });
  });

  it("rejeita nome curto, preço não positivo e imagem vazia", () => {
    expect(offerInputSchema.safeParse({ ...base, name: "Ab" }).success).toBe(false);
    expect(offerInputSchema.safeParse({ ...base, price: 0 }).success).toBe(false);
    expect(offerInputSchema.safeParse({ ...base, image: "" }).success).toBe(false);
  });

  it("rejeita data inválida", () => {
    expect(
      offerInputSchema.safeParse({ ...base, startsAt: "não-é-data" }).success,
    ).toBe(false);
  });
});
