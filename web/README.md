# Projeção e plano de validação do tráfego pago

Apresentação web (Next.js + React + TypeScript + Tailwind, GSAP/ScrollTrigger, Motion e Lenis).

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # versão de produção
```

## Antes de apresentar

- Preencha cliente, autor e data em `lib/capa.ts`.
- Atalhos: `↓ →  espaço` próximo · `↑ ←` anterior · `N` notas do apresentador · `F` tela cheia · `?` ajuda.
- A barra de controle some com o mouse parado; mexa o mouse para ela voltar.

## De onde vêm os números

Todos os números saem da planilha `../projecao_trafego_consultoria (1).xlsx`.
`npm run planilha` lê a planilha e regera `data/planilha.json`; `lib/modelo.ts` faz o resto
(formatação, valores da Black Friday e a simulação de 12 meses por cenário, que repete a lógica
da aba "Evolução" sem a lista de espera). Se mudar a planilha, rode `npm run planilha` e depois o build.

O conteúdo dos slides está em `components/slides/`, e as notas do apresentador em `components/slides/index.tsx`.
