// Oferta de Black Friday da consultoria. Valores passados pelo cliente (10% sobre o preço cheio).
// Mudou um valor ou texto? Mude só aqui: página, dados estruturados e /llms.txt leem deste arquivo.
import { PERFIL, whatsappUrl } from "@/lib/content";

export type PlanoBF = {
  id: "trimestral" | "semestral" | "anual";
  nome: string;
  meses: number;
  de: number;
  por: number;
  porMes: number;
  parcela: number;
  /** Parcelamento com juros no cartão (além dos 3x sem juros), quando o plano permite. */
  comJuros?: number;
  destaque?: string;
  extra?: string;
  /** Item que só este plano tem (aparece em destaque no "Incluso"). */
  exclusivo?: string;
};

export const DESCONTO_BF = 10;
export const PARCELAS_BF = 3;

export const PLANOS_BF: PlanoBF[] = [
  { id: "trimestral", nome: "Trimestral", meses: 3, de: 899, por: 809.1, porMes: 269.7, parcela: 269.7 },
  { id: "semestral", nome: "Semestral", meses: 6, de: 1349, por: 1214.1, porMes: 202.35, parcela: 404.7, comJuros: 6 },
  {
    id: "anual",
    nome: "Anual",
    meses: 12,
    de: 2349,
    por: 2114.1,
    porMes: 176.18,
    parcela: 704.7,
    comJuros: 10,
    destaque: "Melhor custo-benefício",
    extra: "Cerca de 35% menos por mês do que no trimestral",
    exclusivo: "Ligação de alinhamento ao vivo",
  },
];

export const BONUS_BF = "os três bônus da Black";
/** Os três bônus da Black, iguais em todos os planos. */
export const BONUS_LISTA_BF = ["Curso de Nutrição Prática", "E-book A Musculação para Naturais", `${DESCONTO_BF}% de desconto + ${PARCELAS_BF}x sem juros`];
const bonusTexto = `${BONUS_LISTA_BF[0]}, ${BONUS_LISTA_BF[1]} e ${BONUS_LISTA_BF[2]}`;

/** O que vem na consultoria: os mesmos itens da página da consultoria. */
export const INCLUSO_BF = [
  { titulo: "Avaliação completa", texto: "Você conta sua rotina, alimentação, objetivos e dificuldades. Se quiser, envia fotos para a avaliação física." },
  { titulo: "Treino e dieta individualizados", texto: "Protocolo de treino e planejamento alimentar montados a partir do seu perfil, entregues em 3 a 5 dias úteis." },
  { titulo: "Suporte diário no WhatsApp", texto: "Acesso direto ao Jayme e à equipe para tirar dúvidas e manter a constância." },
  { titulo: "Reavaliação todo mês", texto: "Questionários mensais e ajustes no plano conforme a resposta do seu corpo." },
];

/** "Por que você não pode perder essa condição?": a seção entre os resultados e o Jayme. */
export const MOTIVOS_BF = [
  {
    titulo: "A primeira Black da consultoria",
    texto: "É a primeira e provavelmente a última vez que a consultoria individual entra na Black Friday.",
  },
  {
    titulo: "Fuja do reajuste de 2027",
    texto: "Os valores dos planos não mudam desde 2024 e serão reajustados em janeiro de 2027.",
  },
  {
    titulo: "Esse valor é seu para sempre",
    texto: "Você renova sempre por esse valor, enquanto decidir continuar no time.",
  },
];

/** "ou até 10x com juros" (vazio quando o plano só tem os 3x sem juros). */
export const comJuros = (p: PlanoBF) => (p.comJuros ? `ou até ${p.comJuros}x com juros` : "");
/** "3x de R$ 704,70 sem juros ou até 10x com juros". */
export const parcelamento = (p: PlanoBF) => [`${PARCELAS_BF}x de ${reais(p.parcela)} sem juros`, comJuros(p)].filter(Boolean).join(" ");

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
/** "R$ 1.214,10" com espaço inquebrável trocado por espaço comum (evita diferença servidor/cliente). */
export const reais = (v: number) => brl.format(v).replace(/ /g, " ");
/** Só o número: "1.214,10". */
export const valor = (v: number) => reais(v).replace("R$ ", "");

export const ctaPlano = (p: PlanoBF) =>
  whatsappUrl(`Olá! Tenho interesse no plano ${p.nome} da Black Friday.`);

export const CTA_BF = whatsappUrl("Olá! Quero saber mais sobre a Black Friday da consultoria.");

const anual = PLANOS_BF[2];
const tri = PLANOS_BF[0];

export const FAQ_BF = [
  {
    p: "Quanto custa a consultoria do Jayme De Lamadrid na Black Friday?",
    r: `Todos os planos estão com ${DESCONTO_BF}% de desconto: ${PLANOS_BF.map((p) => `${p.nome.toLowerCase()} de ${reais(p.de)} por ${reais(p.por)}`).join(", ")}, à vista ou em ${PARCELAS_BF}x sem juros no cartão. O semestral também sai em até 6x e o anual em até 10x, com juros.`,
  },
  {
    p: "Posso parcelar?",
    r: `Sim, no cartão. ${PLANOS_BF.map((p) => `${p.nome}: ${parcelamento(p)}`).join(". ")}.`,
  },
  {
    p: "Qual plano compensa mais?",
    r: `O anual. Sai por ${reais(anual.porMes)} por mês de acompanhamento, contra ${reais(tri.porMes)} no trimestral: cerca de 35% menos por mês. E você ainda ganha uma ligação particular para alinhamento do objetivo.`,
  },
  {
    p: "O que está incluso na consultoria?",
    r: "Avaliação completa, treino e planejamento alimentar individualizados entregues em 3 a 5 dias úteis, suporte diário pelo WhatsApp com o Jayme e a equipe, e reavaliação todo mês com ajustes no plano.",
  },
  {
    p: "Tem alguma diferença no que vem em cada plano?",
    r: `Todos os planos têm o mesmo acompanhamento: avaliação completa, treino e dieta individualizados, suporte diário no WhatsApp e reavaliação todo mês, além de ${BONUS_BF}. O anual tem ainda uma ligação de alinhamento ao vivo, exclusiva desse plano.`,
  },
  {
    p: "Quais são os três bônus da Black?",
    r: `${bonusTexto}. Valem para todos os planos.`,
  },
  {
    p: "Os bônus da Black valem para todos os planos?",
    r: `Sim. Trimestral, semestral e anual levam ${BONUS_BF}: ${bonusTexto}. A equipe passa os detalhes de cada um no WhatsApp.`,
  },
  {
    p: "O valor da Black vale para as renovações?",
    r: "Sim. Os valores normais não são reajustados desde 2024 e serão reajustados em janeiro de 2027. Entrando agora, você foge do reajuste e renova sempre pelo valor da Black, enquanto decidir continuar no time.",
  },
  {
    p: "Como faço para garantir a condição?",
    r: "Escolha o plano e toque em “Quero essa condição”. O WhatsApp abre com o plano escolhido e você fala direto com a equipe.",
  },
  {
    p: "A dieta é restritiva? Vou precisar de suplementos?",
    r: "Não. O plano é adaptado à sua rotina e ao que você gosta de comer, e suplemento só é indicado quando existe uma necessidade real.",
  },
];

export const RESUMO_BF = `Black Friday da consultoria online de treino e dieta de ${PERFIL.nome} (${PERFIL.marca}), primeiro brasileiro campeão da WNBF, a federação internacional de fisiculturismo natural. ${DESCONTO_BF}% de desconto em todos os planos, com ${BONUS_BF}.`;
