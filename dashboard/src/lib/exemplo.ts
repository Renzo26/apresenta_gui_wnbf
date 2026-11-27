/** Dados de EXEMPLO (determinísticos), usados com DASH_EXEMPLO=1 ou sem banco configurado. */
import alunaDepois from "@/assets/criativos/aluna-depois.jpg";
import alunoDepois from "@/assets/criativos/aluno-depois.jpg";
import antesDepois10 from "@/assets/criativos/antes-depois-10-meses.jpg";
import antesDepois16 from "@/assets/criativos/antes-depois-16-meses.jpg";
import jaymeMedalha from "@/assets/criativos/jayme-medalha.jpg";
import jaymePalco from "@/assets/criativos/jayme-palco.jpg";
import jaymePodio from "@/assets/criativos/jayme-podio.jpg";
import jaymeTreino from "@/assets/criativos/jayme-treino.jpg";
import treinosBonus from "@/assets/criativos/treinos-bonus.webp";
import treinosEssenciais from "@/assets/criativos/treinos-essenciais.webp";

import {
  INICIO_BLACK,
  PLANOS,
  diasEntre,
  precoNoDia,
  type Campanha,
  type Conjunto,
  type Criativo,
  type Dados,
  type ISO,
  type LinhaAnuncio,
  type LinhaAtendimento,
  type LinhaOrganica,
  type PaginaId,
  type Plano,
} from "@/lib/dados";

// ---------- cadastro ----------
const CAMPANHAS: Campanha[] = [
  { id: "c1", nome: "Consultoria · Sempre ativo", objetivo: "Leads", pagina: "site", temperatura: "Frio", inicio: "2026-09-18", fim: "2026-11-02", orcamentoDia: 120 },
  { id: "c2", nome: "Treinos Essenciais · Vendas", objetivo: "Vendas", pagina: "planilhas", temperatura: "Frio", inicio: "2026-09-18", fim: null, orcamentoDia: 80 },
  { id: "c3", nome: "Reconhecimento · Vídeos do Jayme", objetivo: "Alcance", pagina: "site", temperatura: "Frio", inicio: "2026-09-18", fim: null, orcamentoDia: 35 },
  { id: "c4", nome: "Esquenta Black · Lista VIP", objetivo: "Leads", pagina: "black", temperatura: "Frio", inicio: "2026-10-27", fim: "2026-11-02", orcamentoDia: 90 },
  { id: "c5", nome: "BF · Leads · ABO", objetivo: "Leads", pagina: "black", temperatura: "Frio", inicio: INICIO_BLACK, fim: null, orcamentoDia: 260 },
  { id: "c6", nome: "BF · Conversas no WhatsApp", objetivo: "Conversas", pagina: "black", temperatura: "Frio", inicio: INICIO_BLACK, fim: null, orcamentoDia: 130 },
  { id: "c7", nome: "BF · Remarketing 30d", objetivo: "Conversas", pagina: "black", temperatura: "Quente", inicio: INICIO_BLACK, fim: null, orcamentoDia: 90 },
];

const CONJUNTOS: Conjunto[] = [
  { id: "a1", campanhaId: "c1", nome: "Interesses · Musculação natural" },
  { id: "a2", campanhaId: "c1", nome: "Semelhantes 1% · Clientes" },
  { id: "a3", campanhaId: "c2", nome: "Aberto · Advantage+" },
  { id: "a4", campanhaId: "c3", nome: "Brasil · 20 a 45 anos" },
  { id: "a5", campanhaId: "c4", nome: "Engajou no Instagram · 90d" },
  { id: "a6", campanhaId: "c5", nome: "Interesses · Musculação natural" },
  { id: "a7", campanhaId: "c5", nome: "Semelhantes 1% · Clientes" },
  { id: "a8", campanhaId: "c6", nome: "Aberto · Advantage+" },
  { id: "a9", campanhaId: "c7", nome: "Visitou /black · 30d" },
  { id: "a10", campanhaId: "c7", nome: "Conversou no WhatsApp · 60d" },
];

type CriativoBase = Omit<Criativo, "campanhaId">;
const CRIATIVOS_BASE: CriativoBase[] = [
  { id: "v1", conjuntoId: "a1", nome: "Natural de verdade", formato: "Reels", imagem: jaymePalco, copy: "Campeão WNBF PRO, 100% natural. Treino e dieta feitos para quem não usa atalhos.", qualidade: 1.15 },
  { id: "v2", conjuntoId: "a1", nome: "Antes e depois · 10 meses", formato: "Carrossel", imagem: antesDepois10, copy: "Mesma aluna, mesmos ângulos. Fevereiro a dezembro.", qualidade: 1.3 },
  { id: "v3", conjuntoId: "a2", nome: "Rotina de treino", formato: "Vídeo", imagem: jaymeTreino, copy: "Treino de 4x por semana, com progressão de verdade.", qualidade: 0.9 },
  { id: "v4", conjuntoId: "a3", nome: "Treinos Essenciais 2.0", formato: "Imagem", imagem: treinosEssenciais, copy: "O método para naturais por R$ 197. Acesso de 1 ano.", qualidade: 1.05 },
  { id: "v5", conjuntoId: "a3", nome: "Bônus do Treinos Essenciais", formato: "Carrossel", imagem: treinosBonus, copy: "4 bônus inclusos. 7 dias de garantia.", qualidade: 0.85 },
  { id: "v6", conjuntoId: "a4", nome: "Bastidores do palco", formato: "Vídeo", imagem: jaymePodio, copy: "Como foi chegar ao pódio do WNBF sendo natural.", qualidade: 1.0 },
  { id: "v7", conjuntoId: "a5", nome: "Lista VIP da Black", formato: "Reels", imagem: jaymeMedalha, copy: "A primeira Black da consultoria. Entre na lista e saiba antes.", qualidade: 1.1 },
  { id: "v8", conjuntoId: "a6", nome: "Black · -10% + 3x sem juros", formato: "Imagem", imagem: jaymeMedalha, copy: "Consultoria com 10% off e 3x sem juros. Só até 30/11.", qualidade: 1.0 },
  { id: "v9", conjuntoId: "a6", nome: "Black · Antes e depois 16 meses", formato: "Carrossel", imagem: antesDepois16, copy: "16 meses de acompanhamento. Agora com a condição da Black.", qualidade: 1.35 },
  { id: "v10", conjuntoId: "a7", nome: "Black · Depoimento aluna", formato: "Reels", imagem: alunaDepois, copy: "“Praticamente o mesmo peso e um corpo bem diferente.”", qualidade: 1.2 },
  { id: "v11", conjuntoId: "a7", nome: "Black · Anual pelo preço de 3x", formato: "Imagem", imagem: jaymePalco, copy: "Anual em 3x de R$ 704,70. Cerca de 35% menos por mês.", qualidade: 0.95 },
  { id: "v12", conjuntoId: "a8", nome: "Black · Fale comigo no WhatsApp", formato: "Vídeo", imagem: jaymeTreino, copy: "Me chama no WhatsApp e eu te mostro o plano certo para você.", qualidade: 1.1 },
  { id: "v13", conjuntoId: "a8", nome: "Black · Resultado aluno", formato: "Imagem", imagem: alunoDepois, copy: "Treino e dieta ajustados todo mês. Resultado de verdade.", qualidade: 0.88 },
  { id: "v14", conjuntoId: "a9", nome: "Remarketing · Últimas vagas", formato: "Imagem", imagem: jaymeMedalha, copy: "Você viu a Black. As vagas com o desconto estão acabando.", qualidade: 1.25 },
  { id: "v15", conjuntoId: "a10", nome: "Remarketing · Dúvidas comuns", formato: "Carrossel", imagem: antesDepois10, copy: "Funciona para quem treina em casa? E se eu viajar? Respondemos.", qualidade: 1.05 },
];

const CRIATIVOS: Criativo[] = CRIATIVOS_BASE.map((c) => ({ ...c, campanhaId: CONJUNTOS.find((a) => a.id === c.conjuntoId)!.campanhaId }));

// ---------- gerador ----------
function semente(s: number) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const entre = (r: () => number, a: number, b: number) => a + (b - a) * r();
/** Contagem inteira com o valor esperado certo (sem arredondar tudo para baixo). */
const contar = (r: () => number, esperado: number) => Math.max(0, Math.floor(esperado + r()));

const diaDaSemana = (iso: ISO) => new Date(`${iso}T12:00:00Z`).getUTCDay();
const vazio = (): Record<Plano, number> => ({ Trimestral: 0, Semestral: 0, Anual: 0, "Treinos Essenciais": 0 });

/** Mistura de planos vendidos na consultoria (a Black puxa para o anual). */
function sortearPlano(r: () => number, data: ISO): Plano {
  const x = r();
  if (data >= INICIO_BLACK) return x < 0.27 ? "Trimestral" : x < 0.55 ? "Semestral" : "Anual";
  return x < 0.45 ? "Trimestral" : x < 0.78 ? "Semestral" : "Anual";
}

const PRIMEIRO_DIA: ISO = "2026-09-18";
const HOJE: ISO = "2026-11-16";

function gerar(): Dados {
  const r = semente(20261116);
  const dias = diasEntre(PRIMEIRO_DIA, HOJE);
  const anuncios: LinhaAnuncio[] = [];
  const organico: LinhaOrganica[] = [];
  const atendimento: LinhaAtendimento[] = [];

  const connect: Record<PaginaId, number> = { black: 0.82, site: 0.74, planilhas: 0.79 };

  for (const data of dias) {
    const fds = [0, 6].includes(diaDaSemana(data));
    const black = data >= INICIO_BLACK;
    // reta final da Black: o leilão encarece e a intenção sobe
    const pressao = black ? 1 + (diasEntre(INICIO_BLACK, data).length - 1) * 0.025 : 1;

    for (const camp of CAMPANHAS) {
      if (data < camp.inicio || (camp.fim && data > camp.fim)) continue;
      const doConjunto = CRIATIVOS.filter((c) => c.campanhaId === camp.id);
      const pesoTotal = doConjunto.reduce((s, c) => s + c.qualidade ** 2, 0);
      const orcamento = camp.orcamentoDia * (fds ? 0.88 : 1) * entre(r, 0.9, 1.08);

      for (const cri of doConjunto) {
        const investimento = (orcamento * cri.qualidade ** 2) / pesoTotal;
        const cpm =
          (camp.objetivo === "Alcance" ? entre(r, 7, 11) : camp.temperatura === "Quente" ? entre(r, 34, 52) : entre(r, 17, 27)) *
          (black ? 1.18 * pressao : 1);
        const impressoes = Math.round((investimento / cpm) * 1000);
        const freq = camp.temperatura === "Quente" ? entre(r, 2.4, 3.6) : entre(r, 1.15, 1.55);
        const alcance = Math.round(impressoes / freq);
        const ctrBase = camp.objetivo === "Alcance" ? 0.0035 : { "Vídeo": 0.011, Reels: 0.013, Carrossel: 0.015, Imagem: 0.012 }[cri.formato];
        const ctr = ctrBase * cri.qualidade * (camp.temperatura === "Quente" ? 1.6 : 1) * entre(r, 0.85, 1.15);
        const cliques = contar(r, impressoes * ctr);
        const sessoes = contar(r, cliques * connect[camp.pagina] * entre(r, 0.93, 1.05));

        let leads = 0;
        let conversas = 0;
        const vendas = vazio();
        if (camp.objetivo === "Leads") {
          leads = contar(r, sessoes * (camp.pagina === "black" ? 0.12 : 0.065) * cri.qualidade * pressao);
          conversas = contar(r, leads * entre(r, 0.62, 0.78));
        } else if (camp.objetivo === "Conversas") {
          leads = contar(r, sessoes * 0.05);
          conversas = contar(r, sessoes * (camp.temperatura === "Quente" ? 0.3 : 0.2) * cri.qualidade);
        } else if (camp.objetivo === "Vendas") {
          vendas["Treinos Essenciais"] = contar(r, sessoes * 0.022 * cri.qualidade);
        } else {
          leads = contar(r, sessoes * 0.01);
          conversas = contar(r, leads * 0.5);
        }
        const fechamento = (camp.temperatura === "Quente" ? 0.16 : black ? 0.1 : 0.07) * pressao;
        for (let i = 0; i < contar(r, conversas * fechamento); i++) vendas[sortearPlano(r, data)]++;
        const faturamento = PLANOS.reduce((s, p) => s + vendas[p] * precoNoDia(p, data), 0);
        const video = cri.formato === "Vídeo" || cri.formato === "Reels";

        anuncios.push({
          data,
          criativoId: cri.id,
          investimento: Math.round(investimento * 100) / 100,
          impressoes,
          alcance,
          cliques,
          sessoes,
          leads,
          conversas,
          grupo: contar(r, conversas * 0.42),
          vendas,
          faturamento,
          video3s: video ? Math.round(impressoes * entre(r, 0.24, 0.38) * cri.qualidade) : 0,
          thruplay: video ? Math.round(impressoes * entre(r, 0.06, 0.11) * cri.qualidade) : 0,
        });
      }
    }

    // orgânico: bio do Instagram (passa por uma página) e WhatsApp direto (sem página)
    for (const origem of ["Instagram · Bio", "Direto"] as const) {
      const pagina: PaginaId | null = origem === "Direto" ? null : black ? "black" : r() < 0.7 ? "site" : "planilhas";
      const sessoes = origem === "Direto" ? 0 : contar(r, (black ? 70 : 38) * entre(r, 0.8, 1.2));
      const leads = origem === "Direto" ? 0 : contar(r, sessoes * 0.06);
      const conversas = contar(r, origem === "Direto" ? entre(r, 2, 6) * (black ? 1.5 : 1) : leads * 0.8 + sessoes * 0.04);
      const vendas = vazio();
      for (let i = 0; i < contar(r, conversas * (origem === "Direto" ? 0.14 : 0.09)); i++) vendas[sortearPlano(r, data)]++;
      if (pagina === "planilhas") vendas["Treinos Essenciais"] += contar(r, sessoes * 0.015);
      organico.push({
        data,
        origem,
        pagina,
        sessoes,
        leads,
        conversas,
        grupo: contar(r, conversas * 0.38),
        vendas,
        faturamento: PLANOS.reduce((s, p) => s + vendas[p] * precoNoDia(p, data), 0),
      });
    }

    const leadsDia = anuncios.filter((a) => a.data === data).reduce((s, a) => s + a.leads, 0);
    atendimento.push({
      data,
      primeiraResposta: Math.round(entre(r, 6, 22) * (fds ? 1.8 : 1) * (black ? 1.25 : 1)),
      semContato: contar(r, leadsDia * entre(r, 0.18, 0.3)),
      followUps: contar(r, leadsDia * entre(r, 0.1, 0.22)),
    });
  }

  // horários das conversas: picos no almoço e à noite, mais fraco no fim de semana
  const conversasTotal = [...anuncios, ...organico].reduce((s, a) => s + a.conversas, 0);
  const perfilHora = Array.from({ length: 24 }, (_, h) =>
    h < 7 ? 0.08 : h < 11 ? 0.55 : h < 14 ? 1 : h < 18 ? 0.7 : h < 23 ? 1.15 : 0.35,
  );
  const perfilDia = [0.62, 1.05, 1.1, 1, 1.02, 0.92, 0.7];
  const soma = perfilDia.reduce((s, d) => s + perfilHora.reduce((t, h) => t + d * h, 0), 0);
  const conversasPorHora = perfilDia.map((d) => perfilHora.map((h) => Math.round(((d * h) / soma) * conversasTotal * entre(r, 0.82, 1.18))));

  return {
    atualizadoEm: `${HOJE}T18:40:00-03:00`,
    fontes: { banco: false, meta: false, exemplo: true },
    avisos: ["Dados de exemplo: o banco não está configurado (DASH_EXEMPLO=1)."],
    dias,
    campanhas: CAMPANHAS,
    conjuntos: CONJUNTOS,
    criativos: CRIATIVOS,
    anuncios,
    organico,
    atendimento,
    conversasPorHora,
  };
}

let cache: Dados | null = null;
export function dadosDeExemplo(): Dados {
  cache ??= gerar();
  return cache;
}
