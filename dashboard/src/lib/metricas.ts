import { carregarDados, diasEntre, INICIO_BLACK, PLANOS, type Dados, type ISO, type LinhaAnuncio, type LinhaOrganica, type PaginaId, type Plano } from "@/lib/dados";

// ---------- filtros ----------
export type Periodo = { inicio: ISO; fim: ISO };
export type PresetId = "7d" | "14d" | "30d" | "black" | "tudo";
export type Filtros = { preset: PresetId; pagina: PaginaId | null; comparar: boolean };

export const PRESETS: { id: PresetId; nome: string }[] = [
  { id: "7d", nome: "7 dias" },
  { id: "14d", nome: "14 dias" },
  { id: "30d", nome: "30 dias" },
  { id: "black", nome: "Black Friday" },
  { id: "tudo", nome: "60 dias" },
];

const somarDias = (iso: ISO, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function periodoDo(preset: PresetId, dados: Dados): Periodo {
  const fim = dados.dias[dados.dias.length - 1];
  if (preset === "black") return { inicio: INICIO_BLACK, fim };
  if (preset === "tudo") return { inicio: dados.dias[0], fim };
  const n = { "7d": 7, "14d": 14, "30d": 30 }[preset];
  return { inicio: somarDias(fim, -(n - 1)), fim };
}

/** Mesmo número de dias, logo antes do período (para as variações). */
export function periodoAnterior(p: Periodo): Periodo {
  const n = diasEntre(p.inicio, p.fim).length;
  return { inicio: somarDias(p.inicio, -n), fim: somarDias(p.inicio, -1) };
}

// ---------- totais ----------
export type Totais = {
  investimento: number;
  impressoes: number;
  alcance: number;
  cliques: number;
  sessoes: number;
  leads: number;
  conversas: number;
  grupo: number;
  vendas: number;
  vendasPlano: Record<Plano, number>;
  faturamento: number;
  video3s: number;
  thruplay: number;
};

const zerado = (): Totais => ({
  investimento: 0,
  impressoes: 0,
  alcance: 0,
  cliques: 0,
  sessoes: 0,
  leads: 0,
  conversas: 0,
  grupo: 0,
  vendas: 0,
  vendasPlano: { Trimestral: 0, Semestral: 0, Anual: 0, "Treinos Essenciais": 0 },
  faturamento: 0,
  video3s: 0,
  thruplay: 0,
});

type LinhaQualquer = Partial<LinhaAnuncio> & Pick<LinhaOrganica, "sessoes" | "leads" | "conversas" | "grupo" | "vendas" | "faturamento">;

export function somar(linhas: LinhaQualquer[]): Totais {
  const t = zerado();
  for (const l of linhas) {
    t.investimento += l.investimento ?? 0;
    t.impressoes += l.impressoes ?? 0;
    t.alcance += l.alcance ?? 0;
    t.cliques += l.cliques ?? 0;
    t.video3s += l.video3s ?? 0;
    t.thruplay += l.thruplay ?? 0;
    t.sessoes += l.sessoes;
    t.leads += l.leads;
    t.conversas += l.conversas;
    t.grupo += l.grupo;
    t.faturamento += l.faturamento;
    for (const p of PLANOS) {
      t.vendasPlano[p] += l.vendas[p];
      t.vendas += l.vendas[p];
    }
  }
  return t;
}

const div = (a: number, b: number) => (b > 0 ? a / b : null);

export function derivados(t: Totais) {
  return {
    cpm: div(t.investimento * 1000, t.impressoes),
    ctr: div(t.cliques * 100, t.impressoes),
    cpc: div(t.investimento, t.cliques),
    frequencia: div(t.impressoes, t.alcance),
    connectRate: div(t.sessoes * 100, t.cliques),
    custoSessao: div(t.investimento, t.sessoes),
    taxaLead: div(t.leads * 100, t.sessoes),
    cpl: div(t.investimento, t.leads),
    custoConversa: div(t.investimento, t.conversas),
    taxaFechamento: div(t.vendas * 100, t.conversas),
    cac: div(t.investimento, t.vendas),
    roas: div(t.faturamento, t.investimento),
    ticket: div(t.faturamento, t.vendas),
    hookRate: div(t.video3s * 100, t.impressoes),
    thruplayRate: div(t.thruplay * 100, t.impressoes),
  };
}
export type Derivados = ReturnType<typeof derivados>;

/** Variação percentual entre dois valores (null quando não dá para comparar). */
export const variacao = (atual: number | null, anterior: number | null) =>
  atual == null || anterior == null || anterior === 0 ? null : ((atual - anterior) / Math.abs(anterior)) * 100;

// ---------- recortes ----------
export function recorte(dados: Dados, periodo: Periodo, pagina: PaginaId | null) {
  const paginaDaCampanha = new Map(dados.campanhas.map((c) => [c.id, c.pagina]));
  const campanhaDoCriativo = new Map(dados.criativos.map((c) => [c.id, c.campanhaId]));
  const noPeriodo = (d: ISO) => d >= periodo.inicio && d <= periodo.fim;
  const anuncios = dados.anuncios.filter(
    (l) => noPeriodo(l.data) && (!pagina || paginaDaCampanha.get(campanhaDoCriativo.get(l.criativoId)!) === pagina),
  );
  const organico = dados.organico.filter((l) => noPeriodo(l.data) && (!pagina || l.pagina === pagina));
  const atendimento = dados.atendimento.filter((l) => noPeriodo(l.data));
  return { anuncios, organico, atendimento, dias: diasEntre(periodo.inicio, periodo.fim) };
}
export type Recorte = ReturnType<typeof recorte>;

/** Totais por dia, na ordem do período (dias sem dados entram zerados). */
export function porDia(linhas: (LinhaQualquer & { data: ISO })[], dias: ISO[]) {
  const grupos = agrupar(linhas, (l) => l.data);
  return dias.map((data) => ({ data, ...somar(grupos.get(data) ?? []) }));
}

export function agrupar<T>(linhas: T[], chave: (l: T) => string) {
  const m = new Map<string, T[]>();
  for (const l of linhas) {
    const k = chave(l);
    m.set(k, [...(m.get(k) ?? []), l]);
  }
  return m;
}

export { carregarDados };

// ---------- formatação ----------
const nf = (o: Intl.NumberFormatOptions) => new Intl.NumberFormat("pt-BR", o);
const BRL = nf({ style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const BRL0 = nf({ style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const INT = nf({ maximumFractionDigits: 0 });
const UM = nf({ maximumFractionDigits: 1 });

export const fmt = {
  brl: (v: number | null | undefined) => (v == null || !isFinite(v) ? "—" : BRL.format(v)),
  brl0: (v: number | null | undefined) => (v == null || !isFinite(v) ? "—" : BRL0.format(v)),
  /** R$ 12,4 mil · R$ 1,2 mi */
  brlCurto: (v: number | null | undefined) => {
    if (v == null || !isFinite(v)) return "—";
    if (Math.abs(v) >= 1e6) return `R$ ${UM.format(v / 1e6)} mi`;
    if (Math.abs(v) >= 1e4) return `R$ ${UM.format(v / 1e3)} mil`;
    return BRL0.format(v);
  },
  int: (v: number | null | undefined) => (v == null || !isFinite(v) ? "—" : INT.format(v)),
  curto: (v: number | null | undefined) => {
    if (v == null || !isFinite(v)) return "—";
    if (Math.abs(v) >= 1e6) return `${UM.format(v / 1e6)} mi`;
    if (Math.abs(v) >= 1e4) return `${UM.format(v / 1e3)} mil`;
    return INT.format(v);
  },
  pct: (v: number | null | undefined, casas = 1) => (v == null || !isFinite(v) ? "—" : `${v.toFixed(casas).replace(".", ",")}%`),
  num: (v: number | null | undefined, casas = 2) => (v == null || !isFinite(v) ? "—" : v.toFixed(casas).replace(".", ",")),
  x: (v: number | null | undefined) => (v == null || !isFinite(v) ? "—" : `${v.toFixed(2).replace(".", ",")}x`),
  dia: (iso: ISO) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`,
  diaLongo: (iso: ISO) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" }).replace(".", ""),
};
