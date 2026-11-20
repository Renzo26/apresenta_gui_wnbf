# Dashboard de tráfego · DLM Team

Painel do gestor de tráfego: Meta Ads + páginas + CRM, cruzados pelo código da campanha na mensagem do WhatsApp.

Telas: Visão geral · Campanhas · Criativos · Páginas · Vendas e CRM.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Dados

Hoje os números são **de exemplo** (`src/lib/dados.ts`, gerados de forma determinística).
Para ligar nas fontes reais, troque `carregarDados()` por uma chamada à API mantendo os tipos
(`LinhaAnuncio`, `LinhaOrganica`, `LinhaAtendimento`). Os cálculos ficam em `src/lib/metricas.ts`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · GSAP + ScrollTrigger (entrada dos blocos) ·
Motion (números, pílulas, gaveta, gráficos) · Lenis (rolagem) · next/image.
Gráficos em SVG feitos à mão (sem biblioteca), com tooltip, teclado e versão em tabela.
Cores das séries validadas para daltonismo nos temas claro e escuro.
