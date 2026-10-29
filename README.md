# Real Móveis Eletro

Vitrine de móveis e eletrodomésticos com seis unidades.

> **Demonstração pública.** Telefones, WhatsApp, e-mail, endereço, CNPJ, redes sociais e dados de clientes são fictícios. Nenhum pedido, mensagem ou formulário é enviado a um canal real.

[**Ver demonstração**](https://real-moveis-eletro.vercel.app) · Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL + Drizzle ORM · Tailwind CSS 4

## O que tem

- Vitrine de ofertas com categorias
- Páginas de unidade com endereço e horário
- Página institucional
- Painel administrativo de ofertas
- Rastreamento de cliques e SEO local

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL + Drizzle ORM
- Tailwind CSS 4

## Rodando localmente

```bash
npm ci
cp .env.example .env.local
# edite .env.local com a sua connection string
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Connection string PostgreSQL/Neon |
| `ADMIN_PASSWORD` | Sim | Senha do painel |
| `ADMIN_SESSION_SECRET` | Sim | Segredo de assinatura da sessão |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública usada em metadados |

## Banco de dados

PostgreSQL no Neon (banco `realmoveis`). O schema fica em `src/db/schema.ts` e é aplicado com `npx drizzle-kit push`. Em produção, use uma connection string Neon com `sslmode=require`.

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Home com ofertas |
| `/ofertas` | Lista de ofertas |
| `/ofertas/[slug]` | Detalhe da oferta |
| `/unidades` | Lista de unidades |
| `/unidades/[slug]` | Detalhe da unidade |
| `/institucional` | Sobre a empresa |
| `/admin/login` | Login do painel |
| `/admin` | Painel de ofertas |

## Testes e qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploy

O deploy é feito na Vercel. Configure as variáveis acima no painel do projeto, conecte o repositório e use `npm run build`.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/app/` | Rotas e API |
| `src/components/` | Header, footer, cards e UI |
| `src/db/` | Schema Drizzle e seed |
| `src/lib/` | Site, dados e utilitários |

## Licença

MIT — veja [LICENSE](LICENSE).
