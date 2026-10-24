"use client";

import { motion } from "motion/react";
import { Slide } from "@/components/deck/Slide";
import { Luz, Nota, Selo, SELOS, type TipoSelo } from "@/components/ui";
import { CENARIOS, CLIENTE, I, META_CAC, P, VERBAS, mil, numero, reais } from "@/lib/modelo";
import type { PropsSlide } from "./tipos";

const SABER: Record<TipoSelo, { titulo: string; itens: string[] }> = {
  dado: {
    titulo: "O que sabemos",
    itens: [
      `${P.alunosAtivos} alunos ativos, custo de ${mil(P.custoOperacao, 0)} por mês`,
      `${P.entradasOrganicas} entradas e ${CLIENTE.renovacoesMes} renovações por mês`,
      `Permanência de ${P.permanencia} meses, fechamento de 1 em 6`,
      `Equipe atende ${P.capacidadeEntradas} entradas; teto de ${P.teto} alunos`,
      "Preços e mix de planos de jun–set",
    ],
  },
  calculo: {
    titulo: "O que a conta mostra",
    itens: [
      "A base está estável: o orgânico sustenta, não cresce",
      `Cada aluno deixa ≈ ${reais(I.cacEquilibrio)} (limite do custo por aluno)`,
      `Folga de ${I.folgaEntradas} entradas por mês para o tráfego`,
      `${P.teto - P.alunosAtivos} vagas até o teto; ≈ ${numero(I.entradasManutencao)} por mês para manter`,
    ],
  },
  hipotese: {
    titulo: "O que ainda não sabemos",
    itens: [
      "Quanto vai custar cada conversa vinda do anúncio",
      "Quantas dessas conversas viram aluno",
      "Que planos o aluno do tráfego compra",
      "Se a lista de espera converte bem",
    ],
  },
};

export function SabemosNaoSabemos(p: PropsSlide) {
  return (
    <Slide {...p} secao="Resumo" titulo="Sabemos como a operação funciona. Ainda não sabemos como o anúncio fecha">
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(SABER) as TipoSelo[]).map((t) => (
          <div key={t} data-reveal className="flex flex-col gap-5 rounded-2xl p-6" style={{ background: SELOS[t].fundo }}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl" style={{ color: SELOS[t].cor }}>
                {SABER[t].titulo}
              </h3>
              <Selo tipo={t} />
            </div>
            <ul className="space-y-3 text-[15px] leading-snug text-ink">
              {SABER[t].itens.map((it) => (
                <li key={it} className="flex gap-3 border-t pt-3" style={{ borderColor: `color-mix(in srgb, ${SELOS[t].cor} 25%, transparent)` }}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p data-reveal className="mt-10 max-w-3xl font-serif text-2xl leading-snug">
        A maior incerteza é uma só: <span className="text-hipotese">o fechamento do tráfego</span> comparado ao do orgânico. É a primeira coisa que vamos medir.
      </p>
    </Slide>
  );
}

const FLUXO = [
  { t: "Anúncio", d: "Meta Ads com código de origem (UTM) no link", mede: "custo" },
  { t: "Página de captura", d: "Pixel da Meta + API de conversões", mede: "" },
  { t: "Botão do WhatsApp", d: "Evento de clique; o código de origem vai na mensagem", mede: "CPL" },
  { t: "Conversa", d: "Atendente identifica a origem pelo código", mede: "" },
  { t: "Venda", d: "Registro: data, origem, plano e motivo de não fechar", mede: "fechamento · CAC" },
];

export function Rastreamento(p: PropsSlide) {
  return (
    <Slide {...p} secao="Como vamos confirmar · fase 0" titulo="Antes do primeiro anúncio, toda venda precisa ter origem">
      <ol className="relative grid gap-3 md:grid-cols-5 md:gap-0">
        {FLUXO.map((f, i) => (
          <li key={f.t} data-reveal className="relative flex md:flex-col">
            <div className="flex flex-col items-center md:flex-row md:items-center">
              <motion.span
                whileHover={{ scale: 1.08 }}
                className={`num z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border text-sm ${
                  i === FLUXO.length - 1 ? "border-accent bg-accent text-paper" : "border-ink bg-paper"
                }`}
              >
                {i + 1}
              </motion.span>
              {i < FLUXO.length - 1 && (
                <>
                  <span data-bar="y" className="w-px flex-1 bg-ink md:hidden" />
                  <span data-bar data-delay={i * 0.15} className="hidden h-px flex-1 bg-ink md:block" />
                </>
              )}
            </div>
            <div className="ml-4 pb-6 md:ml-0 md:mt-5 md:pr-5">
              <h3 className="font-serif text-2xl leading-tight">{f.t}</h3>
              <p className="mt-2 text-sm leading-snug text-ink-2">{f.d}</p>
              {f.mede && (
                <p className="mt-3 inline-block rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">mede: {f.mede}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div data-reveal className="mt-8 grid gap-4 border-t border-line pt-8 lg:grid-cols-[auto_1fr_1fr] lg:items-stretch">
        <div className="flex flex-col justify-center">
          <span className="w-fit rounded-full border border-accent px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent">Decisão pendente</span>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="font-serif text-xl">Ferramenta pronta de rastreamento</p>
          <p className="mt-1 text-sm text-ink-2">Como o Tintim. Falta confirmar se funciona com o WhatsApp Business comum, que é o usado hoje.</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="font-serif text-xl">Solução própria</p>
          <p className="mt-1 text-sm text-ink-2">Com a API oficial do WhatsApp. Mais controle, mais trabalho de implantação.</p>
        </div>
      </div>
    </Slide>
  );
}

const FASES = [
  { f: "Fase 0", q: "Antes do 1º anúncio", t: "Preparação", d: "Pixel, API de conversões, evento de clique, código de origem e registro de cada contato." },
  { f: "Fase 1", q: "Semanas 1 e 2", t: "Teste", d: `Verba pequena (a faixa de ${mil(VERBAS[0], 0)} é a de menor risco), poucos criativos e ofertas. Medir o custo por contato.` },
  { f: "Fase 2", q: "Semanas 3 e 4", t: "Leitura", d: "Medir o fechamento e o custo por aluno reais, comparar com os três cenários e atualizar a planilha." },
  { f: "Fase 3", q: "Até lotar", t: "Escala", d: `Aumentar a verba até chegar a ${P.teto} alunos; depois reduzir para a verba de manutenção.` },
  { f: "Fase 4", q: "Vagas fechadas", t: "Lista de espera", d: "Testar a campanha de espera e medir a conversão dela separadamente." },
];

export function Fases(p: PropsSlide) {
  return (
    <Slide {...p} secao="Como vamos confirmar" titulo="Os cenários são o mapa. As primeiras semanas mostram em qual deles estamos">
      <div className="relative">
        <div className="absolute left-[21px] top-0 h-full w-px bg-line md:left-0 md:top-[21px] md:h-px md:w-full" aria-hidden />
        <ol className="relative grid gap-8 md:grid-cols-5 md:gap-5">
          {FASES.map((f, i) => (
            <li key={f.f} data-reveal className="flex gap-5 md:flex-col">
              <span
                className={`num z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm ${
                  i === 1 || i === 2 ? "bg-accent text-paper" : "border border-ink bg-paper"
                }`}
              >
                {i}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{f.q}</p>
                <h3 className="mt-1 font-serif text-2xl">{f.t}</h3>
                <p className="mt-2 text-sm leading-snug text-ink-2">{f.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div data-reveal className="mt-12 grid gap-6 rounded-2xl bg-ink p-6 text-paper md:grid-cols-[auto_1fr] md:items-center md:p-8">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60">Em 4 semanas</span>
        <p className="font-serif text-2xl leading-snug md:text-3xl">
          trocamos as hipóteses de custo por contato e fechamento por números reais, e sabemos se estamos perto do conservador, do realista ou do otimista.
        </p>
      </div>
    </Slide>
  );
}

const PAINEL = [
  { t: "Custo por contato", s: "CPL", d: "quanto custa cada conversa iniciada" },
  { t: "Fechamento do tráfego", s: "%", d: "conversas que viram aluno" },
  { t: "Custo por aluno", s: "CAC", d: "verba ÷ alunos do anúncio" },
  { t: "Mix de planos", s: "3·6·12", d: "trimestral, semestral, anual" },
  { t: "Tempo de resposta", s: "min", d: "do clique à primeira resposta" },
];

const SEMAFORO = [
  { cor: "verde" as const, faixa: `até ${reais(META_CAC)}`, acao: "Manter e escalar", d: `até a folga de ${I.folgaEntradas} entradas por mês.` },
  {
    cor: "amarelo" as const,
    faixa: `${reais(META_CAC)} a ${reais(I.cacEquilibrio)}`,
    acao: "Não escalar",
    d: "ajustar criativo, página ou atendimento.",
  },
  { cor: "vermelho" as const, faixa: `acima de ${reais(I.cacEquilibrio)}`, acao: "Pausar e revisar", d: "a estratégia, com dados suficientes." },
];

export function Decidir(p: PropsSlide) {
  return (
    <Slide {...p} secao="Como vamos decidir" titulo="Toda semana, cinco números e uma regra para cada cor">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p data-reveal className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Painel semanal
          </p>
          <ul className="flex flex-col">
            {PAINEL.map((x, i) => (
              <motion.li
                key={x.t}
                data-reveal
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-4 border-t border-line py-4 last:border-b"
              >
                <span className="num w-6 text-sm text-muted">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-lg">{x.t}</p>
                  <p className="text-sm text-muted">{x.d}</p>
                </div>
                <span className="num rounded-md bg-paper-2 px-2 py-1 text-xs text-ink-2">{x.s}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p data-reveal className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Regra pelo custo por aluno <Selo tipo="hipotese" />
          </p>
          {SEMAFORO.map((s) => (
            <motion.div
              key={s.cor}
              data-reveal
              whileHover={{ scale: 1.015 }}
              className="flex items-center gap-5 rounded-2xl border border-line bg-card p-5"
              style={{ borderLeft: `6px solid var(--${s.cor})` }}
            >
              <Luz cor={s.cor} tamanho={22} />
              <div className="flex-1">
                <p className="num text-sm text-ink-2">{s.faixa}</p>
                <p className="font-serif text-2xl leading-tight">{s.acao}</p>
                <p className="text-sm text-ink-2">{s.d}</p>
              </div>
            </motion.div>
          ))}
          <Nota tom="alerta">
            Não concluir nada com poucos dados. Antes de julgar, vamos combinar juntos o número mínimo de conversas que cada leitura precisa ter.
          </Nota>
          <p data-reveal className="text-xs text-muted">
            Referência dos cenários: {CENARIOS.map((c) => `${c.nome.toLowerCase()} ${reais(c.cac)}`).join(" · ")}.
          </p>
        </div>
      </div>
    </Slide>
  );
}
