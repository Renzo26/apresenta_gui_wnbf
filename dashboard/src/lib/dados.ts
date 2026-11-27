/**
 * Tipos e regras do dashboard. Os números vêm de GET /api/dados (src/lib/fonte.ts), que junta:
 *  - Meta Ads (insights por anúncio/dia): investimento, impressões, alcance, cliques, LPV, vídeo
 *  - Formulários das páginas (paginas.leads): leads por campanha/anúncio pelas UTMs
 *  - CRM (crm.conversas): conversas iniciadas, grupo, vendas por plano
 * Sem banco configurado (DASH_EXEMPLO=1), usa os dados de exemplo de src/lib/exemplo.ts.
 */
import type { StaticImageData } from "next/image";

export type ISO = string; // AAAA-MM-DD

export type PaginaId = "black" | "site" | "planilhas";
export const PAGINAS: Record<PaginaId, string> = {
  black: "Black Friday",
  site: "Site principal",
  planilhas: "Treinos Essenciais",
};

export type Objetivo = "Leads" | "Conversas" | "Vendas" | "Alcance";
export type Temperatura = "Frio" | "Quente";
export type Formato = "Vídeo" | "Reels" | "Carrossel" | "Imagem";

/** Produtos vendidos: ordem fixa = ordem das cores das séries. */
export const PLANOS = ["Trimestral", "Semestral", "Anual", "Treinos Essenciais"] as const;
export type Plano = (typeof PLANOS)[number];

/** Origem da conversa no CRM (mesmas etiquetas do CRM). */
export const ORIGENS = ["Campanhas", "Instagram · Bio", "Direto"] as const;
export type Origem = (typeof ORIGENS)[number];

export const INICIO_BLACK: ISO = "2026-11-03";

export type Campanha = {
  id: string;
  nome: string;
  objetivo: Objetivo;
  pagina: PaginaId;
  temperatura: Temperatura;
  inicio: ISO;
  fim: ISO | null;
  orcamentoDia: number;
};

export type Conjunto = { id: string; campanhaId: string; nome: string };

export type Criativo = {
  id: string;
  conjuntoId: string;
  campanhaId: string;
  nome: string;
  formato: Formato;
  /** Miniatura do anúncio: URL da Meta (dados reais) ou imagem local (exemplo). Sem imagem: null. */
  imagem: StaticImageData | string | null;
  /** Link para abrir o anúncio (prévia da Meta), quando houver. */
  link?: string;
  /** Texto principal do anúncio (o que aparece em cima do criativo). */
  copy: string;
  qualidade: number;
};

/** Uma linha por anúncio por dia (Meta Ads + página + CRM já cruzados pelo código da campanha). */
export type LinhaAnuncio = {
  data: ISO;
  criativoId: string;
  investimento: number;
  impressoes: number;
  alcance: number;
  cliques: number;
  sessoes: number;
  leads: number;
  /** Leads que a Meta atribui ao anúncio (clique em 7 dias ou visualização em 1 dia), pelo Pixel/API. */
  leadsMeta?: number;
  conversas: number;
  grupo: number;
  vendas: Record<Plano, number>;
  faturamento: number;
  video3s: number;
  thruplay: number;
};

/** Conversas e vendas que não vieram de anúncio (bio do Instagram e WhatsApp direto). */
export type LinhaOrganica = {
  data: ISO;
  origem: Exclude<Origem, "Campanhas">;
  pagina: PaginaId | null;
  sessoes: number;
  leads: number;
  conversas: number;
  grupo: number;
  vendas: Record<Plano, number>;
  faturamento: number;
};

/** Operação do atendimento por dia (CRM). */
export type LinhaAtendimento = {
  data: ISO;
  /** Mediana do tempo até a 1ª resposta da equipe, em minutos. */
  primeiraResposta: number;
  /** Preencheram o formulário e não chamaram no WhatsApp. */
  semContato: number;
  followUps: number;
};

export type Dados = {
  atualizadoEm: string;
  /** De onde vieram os números: banco (CRM + formulários), Meta Ads ou dados de exemplo. */
  fontes: { banco: boolean; meta: boolean; exemplo: boolean };
  /** Avisos para mostrar no topo (ex.: Meta Ads não conectada). */
  avisos: string[];
  /** Endereço do CRM, para o link "Voltar ao CRM". */
  crmUrl?: string;
  dias: ISO[];
  campanhas: Campanha[];
  conjuntos: Conjunto[];
  criativos: Criativo[];
  anuncios: LinhaAnuncio[];
  organico: LinhaOrganica[];
  atendimento: LinhaAtendimento[];
  /** Conversas iniciadas por dia da semana (0 = domingo) e hora. */
  conversasPorHora: number[][];
};

// ---------- preços ----------
const PRECO_CHEIO: Record<Plano, number> = { Trimestral: 899, Semestral: 1349, Anual: 2349, "Treinos Essenciais": 197 };
const PRECO_BLACK: Record<Plano, number> = { Trimestral: 809.1, Semestral: 1214.1, Anual: 2114.1, "Treinos Essenciais": 197 };
export const precoNoDia = (plano: Plano, data: ISO) => (data >= INICIO_BLACK ? PRECO_BLACK : PRECO_CHEIO)[plano];

export function diasEntre(inicio: ISO, fim: ISO): ISO[] {
  const out: ISO[] = [];
  const d = new Date(`${inicio}T12:00:00Z`);
  const f = new Date(`${fim}T12:00:00Z`);
  while (d <= f) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

