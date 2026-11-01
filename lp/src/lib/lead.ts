// Captura de lead antes do WhatsApp (página da Black Friday).
// Os dados ainda NÃO são salvos em lugar nenhum: `registrarLead` é o único ponto a ligar no banco.

export type Lead = {
  nome: string;
  email: string;
  telefone: string;
  /** texto do botão clicado, ex.: "Quero essa condição" */
  origem: string;
  /** plano escolhido, quando o botão é de um plano */
  plano?: string;
  pagina: string;
  /** utm_source, utm_campaign etc. da URL, para o gestor de tráfego */
  utms: Record<string, string>;
  criadoEm: string;
};

export type Campos = Pick<Lead, "nome" | "email" | "telefone">;

const soDigitos = (v: string) => v.replace(/\D/g, "");

/** (55) 98458-5501 — aceita fixo (10 dígitos) e celular (11). */
export function mascaraTelefone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validar(c: Campos) {
  const erros: Partial<Record<keyof Campos, string>> = {};
  if (c.nome.trim().split(/\s+/).filter(Boolean).length < 2) erros.nome = "Digite nome e sobrenome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) erros.email = "Digite um e-mail válido.";
  const d = soDigitos(c.telefone);
  if (d.length < 10 || d.length > 11) erros.telefone = "Digite o telefone com DDD.";
  return erros;
}

/** Plano citado na mensagem pronta do botão ("...do plano Anual da consultoria..."). */
export function planoDoLink(href: string) {
  const texto = new URL(href).searchParams.get("text") ?? "";
  return texto.match(/plano (\w+)/i)?.[1];
}

/** Mesmo link do botão, com o nome da pessoa no fim da mensagem. */
export function linkComNome(href: string, nome: string) {
  const url = new URL(href);
  const texto = `${url.searchParams.get("text") ?? ""} Meu nome é ${nome.trim()}.`.trim();
  // encodeURIComponent (%20), como nos links originais: o "+" do URLSearchParams aparece literal em alguns WhatsApp
  return `${url.origin}${url.pathname}?text=${encodeURIComponent(texto)}`;
}

export function utmsDaPagina() {
  const utms: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") utms[k] = v;
  });
  return utms;
}

/**
 * Registra o lead. Hoje só avisa as ferramentas de tráfego que estiverem na página (GTM/GA e Meta Pixel).
 * Para salvar no banco: enviar `lead` para uma rota do servidor (ex.: POST /api/leads) com
 * `navigator.sendBeacon` ou `fetch(..., { keepalive: true })`, para o envio não ser cortado
 * quando o WhatsApp abrir.
 */
export function registrarLead(lead: Lead) {
  const w = window as Window & { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void };
  w.dataLayer?.push({ event: "generate_lead", plano: lead.plano, origem: lead.origem });
  w.fbq?.("track", "Lead", { content_name: lead.plano ?? "Black Friday" });
}
