// Origem do visitante (campanha) e Meta Pixel — só no navegador.
//
// O gestor de tráfego coloca nos anúncios:
//   utm_source=meta&utm_medium=pago&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
// A origem fica guardada no navegador por 30 dias: se a pessoa chega pelo anúncio, navega pelo site
// e só depois clica no WhatsApp, a campanha não se perde. Um anúncio novo substitui a origem anterior.

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

/** Chamado ao abrir qualquer página: guarda a origem se a URL trouxer UTMs ou fbclid/gclid. */
export function guardarOrigem() {
  const p = daUrl();
  if (!Object.keys(p).length) return;
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ p, em: Date.now() }));
  } catch {}
}

/** UTMs da visita: as da URL atual ou, se não houver, as guardadas (até 30 dias). */
export function origem(): Record<string, string> {
  const p = daUrl();
  if (Object.keys(p).length) return p;
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as { p: Record<string, string>; em: number } | null;
    if (salvo && Date.now() - salvo.em < VALIDADE_MS) return salvo.p;
  } catch {}
  return {};
}

/** Campanha da visita em forma de código: minúsculas, sem espaço nem acento ("direto" sem campanha). */
export function codigoCampanha(o = origem()) {
  const ref = o.utm_campaign || o.utm_source || (o.fbclid ? "meta" : o.gclid ? "google" : "");
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
