# Dashboard de tráfego · DLM Team

Painel do gestor de tráfego: Meta Ads + formulários das páginas + CRM, cruzados pelo nome da campanha.

Telas: Visão geral · Campanhas · Criativos · Páginas · Vendas e CRM.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Dados (reais)

`GET /api/dados` (`src/lib/fonte.ts`) junta, nos últimos 90 dias:

- **Formulários** (`paginas.leads`): cada pessoa conta uma vez, no 1º envio, na campanha das UTMs
  (`utm_campaign={{campaign.name}}`, `utm_term={{adset.name}}`, `utm_content={{ad.name}}`).
- **CRM** (`crm.conversas`): conversas, grupo, vendas (etapa Cliente + plano) e 1ª resposta da equipe
  (ignora a resposta automática, que sai em segundos). Faturamento = preço do plano no dia.
- **Meta Ads** (opcional, `META_ADS_TOKEN` + `META_AD_ACCOUNT_ID`): investimento, impressões, alcance,
  cliques no link, LPV, vídeo. Sem ela, os números de mídia ficam zerados e os custos aparecem "—".

Guarda 5 minutos em memória (botão de atualizar força). Sem banco: `DASH_EXEMPLO=1` usa `src/lib/exemplo.ts`.

## Acesso

Só pelo botão **Dashboard do gestor** no CRM (ADMIN e GESTOR): o CRM gera um passe de 60 s assinado com
o `JWT_SECRET` dele; `/entrar` confere com `CRM_JWT_SECRET` e abre uma sessão de 12 h.
No CRM, defina `PAINEL_GESTOR_URL` com o endereço deste dashboard.

## Deploy (Easypanel)

Serviço Docker Compose apontando para a pasta `dashboard/` (veja `docker-compose.yml` e `.env.example`).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · GSAP + ScrollTrigger (entrada dos blocos) ·
Motion (números, pílulas, gaveta, gráficos) · Lenis (rolagem) · next/image.
Gráficos em SVG feitos à mão (sem biblioteca), com tooltip, teclado e versão em tabela.
Cores das séries validadas para daltonismo nos temas claro e escuro.
