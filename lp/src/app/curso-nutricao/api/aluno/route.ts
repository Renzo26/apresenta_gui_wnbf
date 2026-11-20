// Área do aluno: estado (já está logado?), entrar (com o e-mail da compra) e sair.
// Fica dentro de /curso-nutricao para receber o cookie (que vale só nesse caminho).
import {
  COOKIE_ADMIN,
  COOKIE_ALUNO,
  SEG_ALUNO,
  adminDoToken,
  buscarAluno,
  cookie,
  criarToken,
  embed,
  emailValido,
  errou,
  ipDe,
  lerAulas,
  lerCookie,
  lerCurso,
  lerToken,
  limitado,
  mesmaOrigem,
  registrarAcesso,
  type Curso,
} from "@/lib/curso";


const publico = (c: Curso) => ({ titulo: c.titulo, subtitulo: c.subtitulo, suporte: c.suporte, compra: c.compra });
const json = (corpo: unknown, status = 200, extra?: Record<string, string>) =>
  Response.json(corpo, { status, headers: { "Cache-Control": "no-store", ...extra } });

async function conteudo(email: string, admin: boolean) {
  const [curso, aulas] = await Promise.all([lerCurso(), lerAulas()]);
  return {
    ok: true,
    email,
    admin,
    curso: { ...publico(curso), boas_vindas: curso.boas_vindas },
    aulas: aulas.map(({ biblioteca, video, ...a }) => ({ ...a, embed: embed({ biblioteca, video }) })),
  };
}

/** Quem está logado: aluno (cookie do aluno, e-mail ainda liberado) ou o painel vendo como aluno. */
async function sessao(req: Request) {
  const email = lerToken(lerCookie(req, COOKIE_ALUNO));
  if (email) {
    const aluno = await buscarAluno(email);
    if (aluno?.ativo) return { email, admin: false };
  }
  if (await adminDoToken(lerCookie(req, COOKIE_ADMIN))) return { email: "painel", admin: true };
  return null;
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
    if (acao === "estado") {
      const s = await sessao(req);
      if (!s) return json({ ok: false, curso: publico(await lerCurso()) });
      if (!s.admin) await registrarAcesso(s.email);
      return json(await conteudo(s.email, s.admin));
    }

    if (acao === "entrar") {
      const curso = publico(await lerCurso());
      const chave = `aluno:${ipDe(req)}`;
      if (limitado(chave, 12)) return json({ ok: false, erro: "limite", curso });
      const email = emailValido(corpo.email);
      if (!email) return json({ ok: false, erro: "invalido", curso });
      const aluno = await buscarAluno(email);
      if (!aluno?.ativo) {
        errou(chave);
        return json({ ok: false, erro: aluno ? "bloqueado" : "nao_encontrado", curso });
      }
      await registrarAcesso(email);
      return json(await conteudo(email, false), 200, { "Set-Cookie": cookie(req, COOKIE_ALUNO, criarToken(email, SEG_ALUNO), SEG_ALUNO) });
    }

    if (acao === "sair") return json({ ok: true }, 200, { "Set-Cookie": cookie(req, COOKIE_ALUNO, "", 0) });
  } catch (e) {
    console.error("[curso/aluno]", e);
    return json({ ok: false, erro: "servidor" }, 500);
  }
  return json({ ok: false, erro: "acao" }, 400);
}
