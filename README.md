# Apresentação · Tráfego pago De Lamadrid Team

- `projecao_trafego_consultoria (1).xlsx` — planilha de projeção (fonte de todos os números).
- `web/` — a apresentação (Next.js). Instruções em [web/README.md](web/README.md).

```bash
cd web
npm install
npm run dev
```

## Deploy (Easypanel · Docker Compose)

1. No projeto do Easypanel: **+ Service → Compose**.
2. Em **Source**, escolha **Git**: repositório `https://github.com/Renzo26/apresenta_gui_wnbf`, branch `main`, caminho do compose `/docker-compose.yml`.
3. **Deploy**. O build roda na VPS (multi-stage, Node 24 Alpine, saída `standalone` do Next).
4. Em **Domains**, adicione o domínio apontando para o serviço `apresentacao`, porta `3000`. O Easypanel cuida do HTTPS.

Para atualizar: faça push no `main` e clique em **Deploy** de novo (ou ative o auto deploy pelo webhook do Easypanel).
Se a planilha mudar, rode `npm run planilha` em `web/` e faça commit do `data/planilha.json` antes do deploy.

Teste local com Docker: `docker compose up --build` e acesse pelo IP do container na porta 3000
(ou acrescente `ports: ["3000:3000"]` ao compose só para o teste).
