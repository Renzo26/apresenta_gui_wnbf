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

/** Código curto que vai na mensagem do WhatsApp para o atendente saber a campanha. */
export function refCampanha(o = origem()) {
  const ref = o.utm_campaign || o.utm_source || (o.fbclid ? "meta" : o.gclid ? "google" : "");
  return ref.replace(/\s+/g, "-").slice(0, 60);
}

/** Acrescenta "(ref: campanha)" no fim do texto, sem repetir. */
export function comRef(texto: string, ref = refCampanha()) {
  if (!ref || texto.includes("(ref:")) return texto;
  return `${texto} (ref: ${ref})`;
}

/** Link wa.me com o "(ref: ...)" no fim da mensagem. */
export function linkComRef(href: string, ref = refCampanha()) {
  const url = new URL(href);
  const texto = comRef(url.searchParams.get("text") ?? "", ref);
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

export function pageView() {
  fbq()?.("track", "PageView");
}
