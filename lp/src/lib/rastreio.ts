// Origem do visitante (campanha) e Meta Pixel — só no navegador.
//
// O gestor de tráfego coloca nos anúncios:
//   utm_source=meta&utm_medium=pago&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
// A origem fica guardada no navegador por 30 dias: se a pessoa chega pelo anúncio, navega pelo site
// e só depois clica no WhatsApp, a campanha não se perde. Um anúncio novo substitui a origem anterior;
// uma volta sem campanha (só fbclid, bio, story) não apaga a campanha guardada.

const CHAVE = "dlm-origem";
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;
const RASTREADOS = (k: string) => k.startsWith("utm_") || k === "fbclid" || k === "gclid";

type Fbq = (...args: unknown[]) => void;
const fbq = (): Fbq | undefined => (window as Window & { fbq?: Fbq }).fbq;

function daUrl() {
  const p: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (RASTREADOS(k) && v) p[k] = v.slice(0, 300);
  });
  return p;
}

type Salvo = { p: Record<string, string>; em: number };

function lerSalvo(): Salvo | null {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Salvo | null;
    return s && Date.now() - s.em < VALIDADE_MS ? s : null;
  } catch {
    return null;
  }
}

/**
 * Junta a visita atual com a origem guardada. Um anúncio novo (com utm_campaign) substitui a anterior.
 * Uma volta SEM campanha (link do Instagram que só traz fbclid, bio, story, direct) não apaga uma campanha
 * dos últimos 30 dias: a pessoa conheceu pelo anúncio e voltou por outro caminho, como a Meta também conta.
 * Devolve a origem e se ela mudou (para não renovar o prazo de 30 dias numa volta orgânica).
 */
function combinar(atual: Record<string, string>): { p: Record<string, string>; manteve: Salvo | null } {
  if (atual.utm_campaign) return { p: atual, manteve: null };
  const salvo = lerSalvo();
  if (!salvo?.p.utm_campaign) return { p: atual, manteve: null };
  const p = { ...salvo.p };
  if (atual.fbclid) p.fbclid = atual.fbclid;
  if (atual.gclid) p.gclid = atual.gclid;
  return { p, manteve: salvo };
}

/** Chamado ao abrir qualquer página: guarda a origem se a URL trouxer UTMs ou fbclid/gclid. */
export function guardarOrigem() {
  const atual = daUrl();
  if (!Object.keys(atual).length) return;
  const { p, manteve } = combinar(atual);
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ p, em: manteve ? manteve.em : Date.now() }));
  } catch {}
}

/** UTMs da visita: as da URL atual (sem apagar uma campanha recente) ou, se não houver, as guardadas (até 30 dias). */
export function origem(): Record<string, string> {
  const atual = daUrl();
  if (Object.keys(atual).length) return combinar(atual).p;
  return lerSalvo()?.p ?? {};
}

/** Campanha da visita em forma de código: minúsculas, sem espaço nem acento ("direto" sem campanha). */
export function codigoCampanha(o = origem()) {
  // o Instagram põe sozinho utm_source=ig&utm_content=link_in_bio no link da bio: isso é a bio, não campanha
  const bio = o.utm_content === "link_in_bio" || (!o.utm_campaign && /^(ig|instagram)$/i.test(o.utm_source ?? ""));
  const ref = o.utm_campaign || (bio ? "bio" : o.utm_source) || (o.fbclid ? "meta" : o.gclid ? "google" : "");
  const slug = ref
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "direto";
}

/**
 * Código que vai no fim da mensagem do WhatsApp: #PLANO-campanha.
 * Ex.: #ANUAL-bf-remarketing-30d, #CONTATO-direto. O n8n lê esse código para responder.
 */
export function codigoLead(plano?: string, o = origem()) {
  return `#${(plano || "contato").toUpperCase()}-${codigoCampanha(o)}`;
}

/** Acrescenta o código no fim do texto, sem repetir. */
export function comCodigo(texto: string, codigo: string) {
  if (!codigo || /\s#[A-Z]+-/.test(` ${texto}`)) return texto;
  return `${texto} ${codigo}`.trim();
}

/** Link wa.me com o código no fim da mensagem (fora da Black, só quando a visita veio de campanha). */
export function linkComCodigo(href: string, codigo: string) {
  const url = new URL(href);
  const texto = comCodigo(url.searchParams.get("text") ?? "", codigo);
  // encodeURIComponent (%20), como nos links originais: o "+" do URLSearchParams aparece literal em alguns WhatsApp
  return `${url.origin}${url.pathname}?text=${encodeURIComponent(texto)}`;
}

function cookie(nome: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${nome}=([^;]*)`))?.[1];
}

/** Identificadores do navegador que a Meta usa para casar o evento do servidor com o anúncio. */
export function idsMeta() {
  const fbclid = origem().fbclid;
  return {
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
  };
}

export function novoEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Evento do Pixel (no-op se o Pixel não estiver na página). */
export function evento(nome: string, dados?: Record<string, unknown>, eventId?: string) {
  fbq()?.("track", nome, dados ?? {}, eventId ? { eventID: eventId } : undefined);
}

/** Evento personalizado do Pixel (nome criado por nós, ex.: AbrirFormulario). */
export function eventoPersonalizado(nome: string, dados?: Record<string, unknown>, eventId?: string) {
  fbq()?.("trackCustom", nome, dados ?? {}, eventId ? { eventID: eventId } : undefined);
}

export function pageView() {
  fbq()?.("track", "PageView");
}
