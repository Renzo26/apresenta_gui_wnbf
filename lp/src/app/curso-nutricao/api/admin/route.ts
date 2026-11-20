// Painel do curso: entrar com e-mail + senha (usuários de area_membros.curso_admins), ver/salvar aulas e
// dados do curso, importar aulas em JSON, liberar/bloquear/excluir alunos e cadastrar outros admins.
import { db } from "@/lib/db";
import {
  COOKIE_ADMIN,
  CURSO,
  CURSO_SCHEMA,
  SEG_ADMIN,
  SENHA_MINIMA,
  acharEmails,
  adminDoToken,
  cookie,
  emailValido,
  entrarAdmin,
  errou,
  ipDe,
  lerAulas,
  lerCookie,
  lerCurso,
  limitado,
  linkPlay,
  listarAdmins,
  mesmaOrigem,
  normalizarAulas,
  normalizarCurso,
  removerAdmin,
  salvarAdmin,
  salvarTudo,
  texto,
  type Aluno,
} from "@/lib/curso";

const json = (corpo: unknown, status = 200, extra?: Record<string, string>) =>
  Response.json(corpo, { status, headers: { "Cache-Control": "no-store", ...extra } });

async function contagem() {
  const sql = db();
  const [c] = await sql<{ total: number; ativos: number }[]>`
    select count(*)::int as total, count(*) filter (where ativo)::int as ativos
    from ${sql(CURSO_SCHEMA)}.curso_alunos where curso = ${CURSO}`;
  return c;
}

async function painel(eu: string) {
  const [curso, aulas, n] = await Promise.all([lerCurso(), lerAulas(), contagem()]);
  return { ok: true, eu, curso, aulas: aulas.map((a) => ({ ...a, link: linkPlay(a) })), contagem: n };
}

export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return json({ ok: false, erro: "origem" }, 403);
  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return json({ ok: false, erro: "invalido" }, 400);
  }
  const acao = String(corpo.acao ?? "");

  try {
    if (acao === "entrar") {
      const chave = `admin:${ipDe(req)}`;
      if (limitado(chave, 8)) return json({ ok: false, erro: "limite" });
      const email = emailValido(corpo.email);
      const token = email ? await entrarAdmin(email, String(corpo.senha ?? "")) : null;
      if (!email || !token) {
        errou(chave);
        return json({ ok: false, erro: "senha" });
      }
      return json(await painel(email), 200, { "Set-Cookie": cookie(req, COOKIE_ADMIN, token, SEG_ADMIN) });
    }
    if (acao === "sair") return json({ ok: true }, 200, { "Set-Cookie": cookie(req, COOKIE_ADMIN, "", 0) });

    const eu = await adminDoToken(lerCookie(req, COOKIE_ADMIN));
    if (!eu) return json({ ok: false, precisaLogin: true });
    const sql = db();

    if (acao === "estado") return json(await painel(eu));

    // ---- admins ----
    if (acao === "admins") return json({ ok: true, eu, admins: await listarAdmins() });
    if (acao === "salvar_admin") {
      const email = emailValido(corpo.email);
      const senha = String(corpo.senha ?? "");
      if (!email) return json({ ok: false, erro: "email" });
      if (senha.length < SENHA_MINIMA) return json({ ok: false, erro: "senha_curta" });
      await salvarAdmin(email, senha);
      // trocou a própria senha: renova o cookie para não cair do painel
      const extra = email === eu ? { "Set-Cookie": cookie(req, COOKIE_ADMIN, (await entrarAdmin(email, senha))!, SEG_ADMIN) } : undefined;
      return json({ ok: true, eu, admins: await listarAdmins() }, 200, extra);
    }
    if (acao === "remover_admin") {
      const email = emailValido(corpo.email);
      if (!email || email === eu) return json({ ok: false, erro: "proprio" });
      await removerAdmin(email);
      return json({ ok: true, eu, admins: await listarAdmins() });
    }

    if (acao === "salvar" || acao === "importar") {
      const atual = await lerCurso();
      const curso = normalizarCurso(corpo.curso ?? atual, atual);
      const lista = acao === "importar" ? ((corpo.json as { aulas?: unknown })?.aulas ?? corpo.json) : corpo.aulas;
      if (!Array.isArray(lista)) return json({ ok: false, erro: "tipo" });
      const { aulas, problemas } = normalizarAulas(lista, curso.biblioteca);
      await salvarTudo(curso, aulas);
      return json({ ...(await painel(eu)), problemas });
    }

    if (acao === "alunos") {
      const busca = texto(corpo.busca, 100).toLowerCase();
      const filtro = String(corpo.filtro ?? "todos");
      const pagina = Math.max(0, Number(corpo.pagina) || 0);
      const POR = 50;
      const onde = sql`curso = ${CURSO}
        ${busca ? sql`and email like ${"%" + busca.replace(/[%_\\]/g, "\\$&") + "%"}` : sql``}
        ${filtro === "ativos" ? sql`and ativo` : filtro === "bloqueados" ? sql`and not ativo` : sql``}`;
      const [linhas, [{ total }]] = await Promise.all([
        sql<Aluno[]>`select email, ativo, liberado_em, ultimo_acesso, acessos from ${sql(CURSO_SCHEMA)}.curso_alunos where ${onde}
          order by liberado_em desc, email limit ${POR} offset ${pagina * POR}`,
        sql<{ total: number }[]>`select count(*)::int as total from ${sql(CURSO_SCHEMA)}.curso_alunos where ${onde}`,
      ]);
      return json({ ok: true, alunos: linhas, total, paginas: Math.max(1, Math.ceil(total / POR)), contagem: await contagem() });
    }

    if (acao === "liberar" || acao === "bloquear") {
      const emails = acharEmails(corpo.emails);
      if (!emails.length) return json({ ok: false, erro: "sem_emails" });
      const ativo = acao === "liberar";
      const linhas = emails.map((email) => ({ curso: CURSO, email, ativo }));
      await sql`insert into ${sql(CURSO_SCHEMA)}.curso_alunos ${sql(linhas)}
        on conflict (curso, email) do update set ativo = excluded.ativo,
        liberado_em = case when excluded.ativo and not ${sql(CURSO_SCHEMA)}.curso_alunos.ativo then now() else ${sql(CURSO_SCHEMA)}.curso_alunos.liberado_em end`;
      return json({ ok: true, achados: emails.length, contagem: await contagem() });
    }

    if (acao === "excluir") {
      const emails = acharEmails(corpo.emails);
      if (emails.length) await sql`delete from ${sql(CURSO_SCHEMA)}.curso_alunos where curso = ${CURSO} and email in ${sql(emails)}`;
      return json({ ok: true, contagem: await contagem() });
    }

    if (acao === "csv") {
      const linhas = await sql<Aluno[]>`select email, ativo, liberado_em, ultimo_acesso, acessos from ${sql(CURSO_SCHEMA)}.curso_alunos where curso = ${CURSO} order by email`;
      const data = (d: string | null) => (d ? new Date(d).toISOString() : "");
      const csv = ["email,situacao,liberado_em,ultimo_acesso,acessos", ...linhas.map((a) => `${a.email},${a.ativo ? "liberado" : "bloqueado"},${data(a.liberado_em)},${data(a.ultimo_acesso)},${a.acessos}`)].join("\n");
      return json({ ok: true, csv });
    }
  } catch (e) {
    console.error("[curso/admin]", e);
    return json({ ok: false, erro: "servidor" }, 500);
  }
  return json({ ok: false, erro: "acao" }, 400);
}
