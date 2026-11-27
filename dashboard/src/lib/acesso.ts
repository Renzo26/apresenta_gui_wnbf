/**
 * Acesso ao dashboard pelo CRM (sem outro login):
 *  1. no CRM, o botão "Dashboard do gestor" pede ao backend um token curto (60 s) assinado com o
 *     JWT_SECRET do CRM (tipo "painel", só ADMIN e GESTOR) e abre /entrar?t=<token> aqui;
 *  2. /entrar confere a assinatura (CRM_JWT_SECRET = o mesmo JWT_SECRET do CRM) e se o usuário segue
 *     ativo no banco, e grava o cookie da sessão (12 h);
 *  3. o proxy e a API conferem o cookie a cada acesso.
 * Usa Web Crypto (funciona no proxy e nas rotas). Sem segredo configurado, ninguém entra.
 */
const enc = new TextEncoder();
export const COOKIE = "dlm_gestor";
export const DURACAO_S = 12 * 60 * 60;

const segredo = () => process.env.CRM_JWT_SECRET ?? "";
/** Dados de exemplo e acesso livre: só no computador (DASH_EXEMPLO=1). */
export const modoExemplo = () => process.env.DASH_EXEMPLO === "1";

const b64url = (b: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(b instanceof Uint8Array ? b : new Uint8Array(b))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const deB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

async function chave() {
  return crypto.subtle.importKey("raw", enc.encode(segredo()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
async function assinar(texto: string) {
  return b64url(await crypto.subtle.sign("HMAC", await chave(), enc.encode(texto)));
}
async function confere(texto: string, assinatura: string) {
  try {
    return await crypto.subtle.verify("HMAC", await chave(), deB64url(assinatura), enc.encode(texto));
  } catch {
    return false;
  }
}

export type TokenPainel = { sub: string; papel: string; nome?: string };

/** JWT HS256 emitido pelo CRM (tipo "painel"). Devolve os dados ou null. */
export async function lerTokenDoCrm(token: string): Promise<TokenPainel | null> {
  if (!segredo()) return null;
  const [cab, corpo, ass] = token.split(".");
  if (!cab || !corpo || !ass) return null;
  try {
    const h = JSON.parse(new TextDecoder().decode(deB64url(cab)));
    if (h.alg !== "HS256") return null;
    if (!(await confere(`${cab}.${corpo}`, ass))) return null;
    const d = JSON.parse(new TextDecoder().decode(deB64url(corpo)));
    if (d.tipo !== "painel" || typeof d.sub !== "string" || typeof d.exp !== "number") return null;
    if (d.exp * 1000 < Date.now()) return null;
    if (!["ADMIN", "GESTOR"].includes(d.papel)) return null;
    return { sub: d.sub, papel: d.papel, nome: typeof d.nome === "string" ? d.nome : undefined };
  } catch {
    return null;
  }
}

/** Cookie da sessão: <usuário>.<expira>.<assinatura>. */
export async function criarSessao(usuarioId: string) {
  const exp = Math.floor(Date.now() / 1000) + DURACAO_S;
  const base = `${usuarioId}.${exp}`;
  return `${base}.${await assinar(`sessao:${base}`)}`;
}

export async function lerSessao(valor: string | undefined): Promise<string | null> {
  if (!valor || !segredo()) return null;
  const partes = valor.split(".");
  if (partes.length !== 3) return null;
  const [uid, exp, ass] = partes;
  if (Number(exp) * 1000 < Date.now()) return null;
  return (await confere(`sessao:${uid}.${exp}`, ass)) ? uid : null;
}
