import planilha from "@/data/planilha.json";

// Tudo o que é número na apresentação sai daqui. A fonte é a planilha (data/planilha.json).

export const P = planilha.premissas;
export const I = planilha.indicadores;
export const PLANOS = planilha.planos;
export const CENARIOS = planilha.cenarios;
export const VERBAS = planilha.verbas;
export const PROJECAO = planilha.projecao;
export const ESPERA = planilha.listaEspera;
export const LIMITE_BOM = planilha.limiteBomCac;
export const SENS = planilha.sensibilidade;

/** Informados pelo cliente, fora da planilha numérica. */
export const CLIENTE = {
  alunosFaixa: [185, 190],
  entradasMeses: [
    { mes: "jun", v: 18 },
    { mes: "jul", v: 4 },
    { mes: "ago", v: 18 },
    { mes: "set", v: 23 },
  ],
  renovacoesMes: 16,
  taxaRenovacao: 0.5,
  contatosMeses: [200, 60, 80, 40],
  contatosMediaInformada: 95,
  contatosQuentesIdeal: 50,
  descontoBlack: 0.1,
  alertaCpl: 40,
};

export const META_CAC = 500;

// Black Friday: 10% sobre o preço; o custo de atender não muda.
export const BLACK = {
  ticketMedio: I.ticketMedio * (1 - CLIENTE.descontoBlack),
  valorMensalMedio: I.valorMensalMedio * (1 - CLIENTE.descontoBlack),
  ltv: I.ltv * (1 - CLIENTE.descontoBlack),
  cacEquilibrio: I.ltv * (1 - CLIENTE.descontoBlack) - I.custoAtendimentoPeriodo,
};

/** Entradas + renovações por mês para manter a base com a permanência média. */
export const ENTRADAS_PARA_MANTER = P.alunosAtivos / P.permanencia;
export const VAGAS_ATE_TETO = P.teto - P.alunosAtivos;

export type NomeCenario = "Conservador" | "Realista" | "Otimista";

export type MesSimulado = { mes: number; base: number; admitidos: number; verba: number };

/**
 * Mesma lógica da aba "Evolução" da planilha, sem a campanha de lista de espera:
 * cada aluno pago fica exatamente `permanencia` meses; o orgânico repõe a base de hoje;
 * a verba compra alunos até a folga de entradas e até as vagas livres no teto.
 */
export function simular(cac: number, verbaMax = ESPERA.verbaNormalMax, meses = 12) {
  const coortes: number[] = [];
  let base = P.alunosAtivos;
  const linha: MesSimulado[] = [{ mes: 0, base, admitidos: 0, verba: 0 }];
  for (let m = 1; m <= meses; m++) {
    const saidas = m > P.permanencia ? coortes[m - P.permanencia - 1] : 0;
    const vagas = P.teto - base + saidas;
    const admitidos = Math.max(0, Math.min(verbaMax / cac, I.folgaEntradas, vagas));
    coortes.push(admitidos);
    base = base - saidas + admitidos;
    linha.push({ mes: m, base, admitidos, verba: admitidos * cac });
  }
  const lotaNoMes = linha.find((l) => l.mes > 0 && l.base >= P.teto - 1e-6)?.mes ?? null;
  const verbaTotal = linha.reduce((s, l) => s + l.verba, 0);
  const alunosTotal = linha.reduce((s, l) => s + l.admitidos, 0);
  return { linha, lotaNoMes, verbaTotal, alunosTotal, verbaManutencao: I.entradasManutencao * cac };
}

export const EVOLUCAO = CENARIOS.map((c) => ({ ...c, ...simular(c.cac) }));

/* ---------- formatação pt-BR ---------- */

const fmt = (n: number, casas = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

export const numero = (n: number, casas = 0) => fmt(n, casas);
export const reais = (n: number, casas = 0) => `R$ ${fmt(n, casas)}`;
export const mil = (n: number, casas = 1) => `R$ ${fmt(n / 1000, casas)} mil`;
export const pct = (n: number, casas = 0) => `${fmt(n * 100, casas)}%`;

export function corCac(cac: number): "verde" | "amarelo" | "vermelho" {
  if (cac <= META_CAC) return "verde";
  if (cac <= I.cacEquilibrio) return "amarelo";
  return "vermelho";
}
