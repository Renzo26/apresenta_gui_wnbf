# LP · Jayme De Lamadrid (De Lamadrid Team)

Landing page da consultoria, com os três CTAs do link da bio: **consultoria individual**, **planilhas de treino 2.0** e **livro digital**.

Um único app serve as duas páginas:

- `/`: a LP completa.
- `/linktree`: a página de links para a bio do Instagram (`seu-dominio.com.br/linktree`).
- `/black-friday` (ou `/black`): oferta de Black Friday da consultoria, com as mesmas seções e animações da LP (`src/components/black-friday/`). Valores, bônus e FAQ em `src/lib/black-friday.ts`.
- `/llms.txt`: resumo do site e da oferta para buscadores com IA.

Os endereços antigos `/links` e `/links-2` redirecionam para a LP.
Next.js 16, React 19, Tailwind CSS 4, GSAP (ScrollTrigger + SplitText), Motion e Lenis.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
```

- Textos, links do WhatsApp, método, depoimentos e FAQ: `src/lib/content.ts`.
- Fotos: `src/assets/` (otimizadas pelo `next/image`).

## Banco de dados (leads da Black Friday)

O formulário da `/black-friday` grava em `paginas.leads` (Postgres do projeto WNBF, o mesmo banco do sistema de check-in, em schema separado).

- Migrações em Python com Alembic: `db/`. A primeira cria o schema `paginas` e a tabela `leads`; a tabela de versões do Alembic também fica em `paginas`.
- No deploy, o serviço `paginas-migracao` roda `alembic upgrade head` e só então a página sobe (rodar de novo não faz nada).
- A gravação é feita pela rota `POST /api/leads` (`src/app/api/leads/route.ts`).

Rodar as migrações na mão (com um túnel até o banco):

```bash
cd db
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
DATABASE_USER=wnbf DATABASE_PASSWORD=... DATABASE_HOST=127.0.0.1 DATABASE_PORT=5433 .venv/bin/alembic upgrade head
.venv/bin/alembic revision -m "descrição"   # nova migração
```

Consultar os leads:

```sql
select criado_em, nome, email, telefone, plano, origem, utm_source, utm_campaign
from paginas.leads order by criado_em desc;
```

## Deploy no Easypanel

1. **+ Service → Compose**, fonte **Git**: `https://github.com/Renzo26/apresenta_gui_wnbf`, branch `lp-linktree`.
2. Caminho do build: `/lp` · arquivo compose: `docker-compose.yml`.
3. **Environment**: `NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br` (lido no build; trocou o domínio, faça deploy de novo).
   E as variáveis do banco: `DATABASE_USER=wnbf` e `DATABASE_PASSWORD` (a mesma do sistema de check-in). As outras têm padrão (`db`, `5432`, `wnbf`, `paginas`, sem SSL).
4. **Deploy** e depois **Domains**: domínio → serviço `lp`, porta `3000`, protocolo HTTP. O HTTPS é automático.
5. Teste `https://seu-dominio.com.br/` (LP) e `https://seu-dominio.com.br/linktree` (links da bio).
