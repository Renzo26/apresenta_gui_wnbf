# LP · Jayme De Lamadrid (De Lamadrid Team)

Landing page da consultoria, com os três CTAs do link da bio: **consultoria individual**, **planilhas de treino 2.0** e **livro digital**.
Next.js 16, React 19, Tailwind CSS 4, GSAP (ScrollTrigger + SplitText), Motion e Lenis.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
```

- Textos, links do WhatsApp, método, depoimentos e FAQ: `src/lib/content.ts`.
- Fotos: `src/assets/` (otimizadas pelo `next/image`).

## Deploy no Easypanel

1. **+ Service → Compose**, fonte **Git**: este repositório, branch `main`.
2. Caminho do build: `/lp` · arquivo compose: `docker-compose.yml`.
3. **Environment**: `NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br` (lido no build; trocou o domínio, faça deploy de novo).
4. **Deploy** e depois **Domains**: domínio → serviço `lp`, porta `3000`, protocolo HTTP. O HTTPS é automático.
