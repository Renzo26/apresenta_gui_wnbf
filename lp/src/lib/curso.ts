// Área de membros dos cursos (ex.: /curso-nutricao). Só no servidor.
//
// O aluno entra com o e-mail usado na compra (sem senha). Se o e-mail estiver liberado em
// area_membros.curso_alunos, ganha um cookie assinado que vale 30 dias. O painel (/curso-nutricao/admin)
// é dos usuários admin de area_membros.curso_admins (e-mail + senha; a senha fica só como hash scrypt).
//
// Variável (Easypanel → serviço páginas, e listada no docker-compose.yml):
//   CURSO_SEGREDO   chave que assina os cookies (texto longo e aleatório)
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

/** Schema próprio da área de membros (alunos, aulas, admins), separado dos leads das páginas. */
export const CURSO_SCHEMA = process.env.CURSO_SCHEMA ?? "area_membros";

export const CURSO = "nutricao";
export const BASE = "/curso-nutricao";
const DIAS_ALUNO = 30;
const HORAS_ADMIN = 12;

// ---------- tipos ----------
export type Curso = { titulo: string; subtitulo: string; boas_vindas: string; biblioteca: string; suporte: string; compra: string };
export type Aula = {
  id: string;
  modulo: string;
  titulo: string;
  descricao: string;
  duracao: string;
  capa: string;
  material: string;
  biblioteca: string;
  video: string;
};
export type Aluno = { email: string; ativo: boolean; liberado_em: string; ultimo_acesso: string | null; acessos: number };

// ---------- limpeza de texto ----------
export const texto = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
export const textoLongo = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
/** Só aceita link http(s); qualquer outra coisa vira vazio. */
export function link(v: unknown) {
  const s = texto(v, 1000);
  if (!s) return "";
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
export const emailValido = (v: unknown) => {
  const e = texto(v, 200).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
};
/** Acha os e-mails em qualquer texto colado (lista, planilha inteira, CSV...). */
export const acharEmails = (v: unknown) => [...new Set((String(v ?? "").match(EMAIL) ?? []).map((e) => e.toLowerCase()))].slice(0, 5000);

// ---------- vídeo (Bunny Stream) ----------
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
/**
 * Aceita o link de reprodução, o de incorporação, o código <iframe> inteiro ou só o ID do vídeo
 * (usando a biblioteca do curso).
 */
export function lerVideo(entrada: unknown, bibliotecaPadrao: string): { biblioteca: string; video: string } | null {
  const s = String(entrada ?? "").replace(/&amp;/g, "&");
  const m = s.match(new RegExp(`(?:mediadelivery\\.net|bunnycdn\\.com|b-cdn\\.net)/(?:play|embed)/(\\d+)/(${UUID})`, "i"));
  if (m) return { biblioteca: m[1], video: m[2].toLowerCase() };
  const so = s.trim().match(new RegExp(`^${UUID}$`, "i"));
  if (so && bibliotecaPadrao) return { biblioteca: bibliotecaPadrao, video: so[0].toLowerCase() };
  return null;
}
export const embed = (a: Pick<Aula, "biblioteca" | "video">) =>
  a.biblioteca && a.video
    ? `https://iframe.mediadelivery.net/embed/${encodeURIComponent(a.biblioteca)}/${encodeURIComponent(a.video)}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`
    : "";
export const linkPlay = (a: Pick<Aula, "biblioteca" | "video">) =>
  a.biblioteca && a.video ? `https://iframe.mediadelivery.net/play/${a.biblioteca}/${a.video}` : "";

// ---------- banco ----------
export async function lerCurso(): Promise<Curso> {
  const sql = db();
  const [c] = await sql<Curso[]>`select titulo, subtitulo, boas_vindas, biblioteca, suporte, compra from ${sql(CURSO_SCHEMA)}.cursos where slug = ${CURSO}`;
  return c ?? { titulo: "Área de membros", subtitulo: "", boas_vindas: "", biblioteca: "", suporte: "", compra: "" };
}

export async function lerAulas(): Promise<Aula[]> {
  const sql = db();
  return sql<Aula[]>`
    select id, modulo, titulo, descricao, duracao, capa, material, biblioteca, video
    from ${sql(CURSO_SCHEMA)}.curso_aulas where curso = ${CURSO} order by ordem`;
}

export async function buscarAluno(email: string) {
  const sql = db();
  const [a] = await sql<Aluno[]>`select email, ativo, liberado_em, ultimo_acesso, acessos from ${sql(CURSO_SCHEMA)}.curso_alunos where curso = ${CURSO} and email = ${email}`;
  return a ?? null;
}

export async function registrarAcesso(email: string) {
  const sql = db();
  await sql`update ${sql(CURSO_SCHEMA)}.curso_alunos set ultimo_acesso = now(), acessos = acessos + 1 where curso = ${CURSO} and email = ${email}`;
}

/** Salva o curso e substitui as aulas (na ordem recebida), numa transação. */
export async function salvarTudo(curso: Curso, aulas: Aula[]) {
  const sql = db();
  await sql.begin(async (tx) => {
    await tx`update ${sql(CURSO_SCHEMA)}.cursos set ${sql(curso)}, atualizado_em = now() where slug = ${CURSO}`;
    await tx`delete from ${sql(CURSO_SCHEMA)}.curso_aulas where curso = ${CURSO}`;
    if (aulas.length) await tx`insert into ${sql(CURSO_SCHEMA)}.curso_aulas ${sql(aulas.map((a, ordem) => ({ ...a, curso: CURSO, ordem })))}`;
  });
}

/** Normaliza as aulas que vêm do painel ou de um JSON importado. Devolve também os títulos com vídeo inválido. */
export function normalizarAulas(lista: unknown, bibliotecaPadrao: string) {
  const problemas: string[] = [];
  const ids = new Set<string>();
  const aulas: Aula[] = [];
  for (const bruto of Array.isArray(lista) ? lista.slice(0, 500) : []) {
    const a = (bruto ?? {}) as Record<string, unknown>;
    const titulo = texto(a.titulo, 200);
    if (!titulo) continue;
    const entradaVideo = a.link ?? a.embed ?? (a.biblioteca && a.video ? `mediadelivery.net/play/${a.biblioteca}/${a.video}` : a.video);
    const v = lerVideo(entradaVideo, bibliotecaPadrao);
    if (!v && texto(entradaVideo, 1000)) problemas.push(titulo);
    let id = texto(a.id, 24).toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!id || ids.has(id)) id = v && !ids.has(v.video.replace(/-/g, "").slice(0, 10)) ? v.video.replace(/-/g, "").slice(0, 10) : randomBytes(5).toString("hex");
    ids.add(id);
    aulas.push({
      id,
      modulo: texto(a.modulo, 160),
      titulo,
      descricao: textoLongo(a.descricao, 5000),
      duracao: texto(a.duracao, 40),
      capa: link(a.capa),
      material: link(a.material),
      biblioteca: v?.biblioteca ?? "",
      video: v?.video ?? "",
    });
  }
  return { aulas, problemas };
}

export function normalizarCurso(c: unknown, atual: Curso): Curso {
  const d = (c ?? {}) as Record<string, unknown>;
  return {
    titulo: texto(d.titulo, 160) || atual.titulo,
    subtitulo: texto(d.subtitulo, 300),
    boas_vindas: textoLongo(d.boas_vindas, 2000),
    biblioteca: String(d.biblioteca ?? "").replace(/\D/g, "").slice(0, 12),
    suporte: link(d.suporte),
    compra: link(d.compra),
  };
}

// ---------- cookies assinados ----------
export const COOKIE_ALUNO = "dlm_curso";
export const COOKIE_ADMIN = "dlm_curso_admin";

function segredo() {
  // sem CURSO_SEGREDO, usa uma chave derivada da senha do banco (estável entre reinícios)
  return process.env.CURSO_SEGREDO || createHash("sha256").update(`curso:${process.env.DATABASE_PASSWORD ?? "dev"}`).digest("hex");
}
const assinar = (dados: string) => createHmac("sha256", segredo()).update(dados).digest("base64url");

export function criarToken(valor: string, segundos: number) {
  const corpo = `${Buffer.from(valor).toString("base64url")}.${Math.floor(Date.now() / 1000) + segundos}`;
  return `${corpo}.${assinar(corpo)}`;
}

export function lerToken(token: string | undefined): string | null {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const corpo = `${partes[0]}.${partes[1]}`;
  const a = Buffer.from(assinar(corpo));
  const b = Buffer.from(partes[2]);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(partes[1]) < Date.now() / 1000) return null;
  return Buffer.from(partes[0], "base64url").toString();
}

export const SEG_ALUNO = DIAS_ALUNO * 24 * 3600;
export const SEG_ADMIN = HORAS_ADMIN * 3600;

// ---------- admins do painel ----------
export type Admin = { email: string; criado_em: string; ultimo_acesso: string | null };
export const SENHA_MINIMA = 8;

const scryptAsync = (senha: string, sal: Buffer) =>
  new Promise<Buffer>((ok, erro) => scrypt(senha.normalize("NFKC"), sal, 64, { N: 16384, r: 8, p: 1 }, (e, k) => (e ? erro(e) : ok(k))));

/** "scrypt$<sal>$<hash>" em base64url: é isso que vai para o banco, nunca a senha. */
export async function hashSenha(senha: string) {
  const sal = randomBytes(16);
  return `scrypt$${sal.toString("base64url")}$${(await scryptAsync(senha, sal)).toString("base64url")}`;
}

async function senhaBate(senha: string, guardado: string) {
  const [tipo, sal, hash] = guardado.split("$");
  if (tipo !== "scrypt" || !sal || !hash) return false;
  const esperado = Buffer.from(hash, "base64url");
  const calculado = await scryptAsync(senha, Buffer.from(sal, "base64url"));
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}

// hash de mentira: com e-mail inexistente a resposta demora o mesmo (não revela quem é admin)
const HASH_FALSO = `scrypt$${"A".repeat(22)}$${"A".repeat(86)}`;

/** Confere e-mail + senha. Devolve o token do painel (ou null). */
export async function entrarAdmin(email: string, senha: string) {
  const sql = db();
  const [a] = await sql<{ email: string; senha_hash: string }[]>`select email, senha_hash from ${sql(CURSO_SCHEMA)}.curso_admins where email = ${email}`;
  const ok = await senhaBate(senha, a?.senha_hash ?? HASH_FALSO);
  if (!a || !ok) return null;
  await sql`update ${sql(CURSO_SCHEMA)}.curso_admins set ultimo_acesso = now() where email = ${email}`;
  return criarToken(`${a.email}|${a.senha_hash.slice(-12)}`, SEG_ADMIN);
}

/** Admin logado pelo cookie. Trocar a senha ou remover o admin derruba a sessão na hora. */
export async function adminDoToken(token: string | undefined) {
  const valor = lerToken(token);
  if (!valor) return null;
  const [email, marca] = valor.split("|");
  const sql = db();
  const [a] = await sql<{ email: string; senha_hash: string }[]>`select email, senha_hash from ${sql(CURSO_SCHEMA)}.curso_admins where email = ${email}`;
  return a && a.senha_hash.slice(-12) === marca ? a.email : null;
}

export async function listarAdmins() {
  const sql = db();
  return sql<Admin[]>`select email, criado_em, ultimo_acesso from ${sql(CURSO_SCHEMA)}.curso_admins order by criado_em`;
}

/** Cria o admin ou troca a senha dele. */
export async function salvarAdmin(email: string, senha: string) {
  const sql = db();
  const senha_hash = await hashSenha(senha);
  await sql`insert into ${sql(CURSO_SCHEMA)}.curso_admins (email, senha_hash) values (${email}, ${senha_hash})
    on conflict (email) do update set senha_hash = excluded.senha_hash`;
}

export async function removerAdmin(email: string) {
  const sql = db();
  await sql`delete from ${sql(CURSO_SCHEMA)}.curso_admins where email = ${email}`;
}

// ---------- requisição ----------
export function lerCookie(req: Request, nome: string) {
  return req.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${nome}=`))
    ?.slice(nome.length + 1);
}

/** Só aceita POST vindo do próprio site (proteção contra formulários de outros sites). */
export function mesmaOrigem(req: Request) {
  const origem = req.headers.get("origin");
  if (!origem) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origem).host === host;
  } catch {
    return false;
  }
}

export const ipDe = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";

export function cookie(req: Request, nome: string, valor: string, segundos: number) {
  const https = (req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "")).split(",")[0].trim() === "https";
  return `${nome}=${valor}; Path=${BASE}; Max-Age=${segundos}; HttpOnly; SameSite=Lax${https ? "; Secure" : ""}`;
}

// ---------- limite de tentativas (memória do processo) ----------
const tentativas = new Map<string, { n: number; ate: number }>();
/** true = passou do limite (`max` tentativas erradas em 15 minutos). */
export function limitado(chave: string, max: number) {
  const t = tentativas.get(chave);
  return Boolean(t && t.ate > Date.now() && t.n >= max);
}
export function errou(chave: string) {
  const t = tentativas.get(chave);
  const ate = Date.now() + 15 * 60 * 1000;
  tentativas.set(chave, t && t.ate > Date.now() ? { n: t.n + 1, ate } : { n: 1, ate });
  if (tentativas.size > 5000) for (const [k, v] of tentativas) if (v.ate < Date.now()) tentativas.delete(k);
}
