"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Slide } from "@/components/deck/Slide";
import { Luz, Nota, Selo, Termo } from "@/components/ui";
import { BLACK, CENARIOS, CLIENTE, I, META_CAC, P, PLANOS, VAGAS_ATE_TETO, numero, pct, reais } from "@/lib/modelo";
import type { PropsSlide } from "./tipos";

const mola = { type: "spring", stiffness: 140, damping: 22 } as const;

export function ValorAluno(p: PropsSlide) {
  const [black, setBlack] = useState(false);
  const ltv = black ? BLACK.ltv : I.ltv;
  const sobra = black ? BLACK.cacEquilibrio : I.cacEquilibrio;
  const ticket = black ? BLACK.ticketMedio : I.ticketMedio;
  const custo = I.custoAtendimentoPeriodo;
  const escala = 1700;
  const h = (v: number) => `${(v / escala) * 100}%`;

  return (
    <Slide {...p} secao="Quanto vale um aluno" titulo={<>Cada aluno novo deixa cerca de {reais(I.cacEquilibrio)}. Esse é o nosso limite</>}>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <figure data-reveal className="flex flex-col">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink-2">
              Em {P.permanencia} meses, por aluno <Selo tipo="calculo" />
            </span>
            <div role="radiogroup" aria-label="Preço" className="relative flex rounded-full border border-line bg-card p-1 text-xs">
              {[
                { v: false, r: "Preço normal" },
                { v: true, r: "Black Friday −10%" },
              ].map((o) => (
                <button
                  key={o.r}
                  role="radio"
                  aria-checked={black === o.v}
                  onClick={() => setBlack(o.v)}
                  className={`relative z-10 rounded-full px-3 py-1.5 font-mono uppercase tracking-wider transition-colors ${black === o.v ? "text-paper" : "text-ink-2"}`}
                >
                  {black === o.v && <motion.span layoutId="toggle-black" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={mola} />}
                  {o.r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex h-72 items-end gap-3 border-b border-ink/70 sm:gap-5 md:h-80">
            <Coluna rotulo="Rende (LTV)" valor={ltv}>
              <motion.div className="w-full rounded-t-[4px] bg-ink" animate={{ height: h(ltv) }} transition={mola} />
            </Coluna>
            <Coluna rotulo="Custa atender" valor={-custo}>
              <motion.div className="flex w-full flex-col justify-end" animate={{ height: h(ltv) }} transition={mola}>
                <motion.div className="hatch w-full rounded-[4px] border border-ink/50" animate={{ height: `${(custo / ltv) * 100}%` }} transition={mola} />
                <motion.div className="w-full" animate={{ height: `${(1 - custo / ltv) * 100}%` }} transition={mola} />
              </motion.div>
            </Coluna>
            <Coluna rotulo="Sobra" valor={sobra} destaque>
              <motion.div className="w-full rounded-t-[4px] bg-accent" animate={{ height: h(sobra) }} transition={mola} />
            </Coluna>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-2">
            Se pagarmos mais que <strong className="num text-ink">{reais(sobra)}</strong> para conquistar um aluno, ele dá prejuízo. Esse é o{" "}
            <strong className="text-ink">ponto de equilíbrio</strong>.
          </p>
        </figure>

        <div className="flex flex-col gap-6">
          <Termo sigla="LTV">É quanto um aluno rende durante o tempo em que fica. Aqui: valor mensal médio × {P.permanencia} meses.</Termo>
          <div data-reveal className="grid grid-cols-2 gap-6 border-t border-line pt-5">
            <Linha rotulo="Ticket da 1ª compra" valor={reais(ticket)} selo="calculo" />
            <Linha rotulo="Valor mensal médio" valor={reais(black ? BLACK.valorMensalMedio : I.valorMensalMedio)} selo="calculo" />
            <Linha rotulo="Custo de atender / mês" valor={reais(I.custoAtendimentoMes)} selo="calculo" />
            <Linha rotulo="Custo em 6 meses" valor={reais(custo)} selo="calculo" />
          </div>
          <div data-reveal className="border-t border-line pt-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-ink-2">Planos vendidos, jun–set ({PLANOS.reduce((s, x) => s + x.vendas, 0)} alunos)</span>
              <Selo tipo="dado" />
            </div>
            <div className="flex h-9 gap-[2px] overflow-hidden rounded-[4px]">
              {PLANOS.map((pl, i) => (
                <div
                  key={pl.nome}
                  data-bar
                  data-delay={i * 0.1}
                  title={`${pl.nome}: ${pl.vendas} alunos · ${reais(pl.preco)}`}
                  className="flex items-center px-2 text-xs text-paper"
                  style={{ width: `${pl.peso * 100}%`, background: ["var(--ink)", "var(--ink-2)", "var(--muted)"][i] }}
                >
                  {pl.peso > 0.1 && pct(pl.peso)}
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-2">
              {PLANOS.map((pl) => (
                <span key={pl.nome}>
                  {pl.nome} <span className="num text-ink">{reais(black ? pl.preco * (1 - CLIENTE.descontoBlack) : pl.preco)}</span>
                  {pl.peso <= 0.1 && <span className="text-muted"> · {pct(pl.peso)}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

function Coluna({
  rotulo,
  valor,
  destaque = false,
  children,
}: {
  rotulo: string;
  valor: number;
  destaque?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 flex-col justify-end">
      <div className="mb-2 flex flex-col items-start gap-1">
        <span className={`num text-xl sm:text-2xl ${destaque ? "text-accent" : ""}`}>
          {valor < 0 ? "− " : ""}
          {reais(Math.abs(valor))}
        </span>
        <span className="text-xs text-ink-2 sm:text-sm">{rotulo}</span>
      </div>
      {children}
    </div>
  );
}

function Linha({ rotulo, valor, selo }: { rotulo: string; valor: string; selo: "calculo" | "dado" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 text-xs text-ink-2">
        {rotulo} <Selo tipo={selo} />
      </span>
      <span className="num text-2xl">{valor}</span>
    </div>
  );
}

export function QuantoPagar(p: PropsSlide) {
  const max = 1150;
  const x = (v: number) => `${(v / max) * 100}%`;
  const real = CENARIOS[1];
  const cons = CENARIOS[0];
  return (
    <Slide {...p} secao="Quanto podemos pagar" titulo={<>Vamos mirar em {reais(META_CAC)} por aluno: metade do limite</>}>
      <div className="flex flex-col gap-14">
        <div className="grid gap-3 md:grid-cols-2">
          <Termo sigla="CAC">É quanto pagamos em anúncio para conquistar um aluno.</Termo>
          <Termo sigla="CPL">É quanto pagamos para uma pessoa iniciar uma conversa no WhatsApp.</Termo>
        </div>

        <figure data-reveal>
          <div className="relative h-14">
            <div className="absolute inset-y-3 left-0 flex w-full gap-[2px]">
              <div data-bar className="rounded-l-[4px] bg-verde/85" style={{ width: x(META_CAC) }} />
              <div data-bar data-delay="0.15" className="bg-amarelo/85" style={{ width: `calc(${x(I.cacEquilibrio - META_CAC)} - 2px)` }} />
              <div data-bar data-delay="0.3" className="flex-1 rounded-r-[4px] bg-vermelho/80" />
            </div>
          </div>
          <div className="relative mt-1 h-20 text-sm">
            <Marco left={x(META_CAC)} valor={reais(META_CAC)} rotulo="meta" selo="hipotese" />
            <Marco left={x(I.cacEquilibrio)} valor={reais(I.cacEquilibrio)} rotulo="equilíbrio" selo="calculo" fim />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-2">
            <span className="flex items-center gap-2"><Luz cor="verde" tamanho={10} /> lucro com folga</span>
            <span className="flex items-center gap-2"><Luz cor="amarelo" tamanho={10} /> ainda paga, margem curta</span>
            <span className="flex items-center gap-2"><Luz cor="vermelho" tamanho={10} /> prejuízo</span>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            A folga de metade cobre o que não está na conta: impostos, taxas de pagamento e erros de estimativa.
          </p>
        </figure>

        <div data-reveal className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-5 text-sm text-ink-2">A conta que liga o anúncio ao aluno</p>
            <div className="flex flex-wrap items-center gap-3 font-serif text-2xl sm:gap-4 sm:text-3xl">
              <Caixa rotulo="custo por contato" valor={reais(real.cpl)} />
              <span className="text-muted">÷</span>
              <Caixa rotulo="fechamento" valor={pct(real.fechamento)} />
              <span className="text-muted">=</span>
              <Caixa rotulo="custo por aluno" valor={reais(real.cac)} destaque />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Selo tipo="hipotese" /> exemplo do cenário realista
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-ink p-6 text-paper">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60">Alerta inicial</span>
              <Selo tipo="hipotese" />
            </div>
            <p className="num text-4xl">{reais(CLIENTE.alertaCpl)} <span className="text-lg text-paper/60">por contato</span></p>
            <p className="text-sm leading-relaxed text-paper/75">
              Se cada conversa custar mais que isso e fecharmos {pct(cons.fechamento)}, o aluno passa de {reais(CLIENTE.alertaCpl / cons.fechamento)}. Vale até medirmos o fechamento real.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

function Marco({ left, valor, rotulo, selo, fim = false }: { left: string; valor: string; rotulo: string; selo: "hipotese" | "calculo"; fim?: boolean }) {
  return (
    // o último marco ancora pela direita para não vazar da tela no celular
    <div
      className={`absolute top-0 flex flex-col gap-1 ${fim ? "items-end" : "-translate-x-1/2 items-center"}`}
      style={fim ? { right: `calc(100% - ${left})`, marginRight: -0.5 } : { left }}
    >
      <span className="h-3 w-px bg-ink" />
      <span className="num text-lg leading-none">{valor}</span>
      <span className="flex items-center gap-1 text-xs text-ink-2">
        {rotulo} <Selo tipo={selo} />
      </span>
    </div>
  );
}

function Caixa({ rotulo, valor, destaque = false }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex flex-col rounded-xl border px-4 py-3 ${destaque ? "border-accent bg-accent-soft/60" : "border-line bg-card"}`}
    >
      <span className={`num ${destaque ? "text-accent" : ""}`}>{valor}</span>
      <span className="font-sans text-xs text-ink-2">{rotulo}</span>
    </motion.div>
  );
}

export function Teto(p: PropsSlide) {
  return (
    <Slide {...p} secao="A regra do jogo" titulo={<>Há espaço para {VAGAS_ATE_TETO} alunos a mais. Depois disso, o jogo vira manutenção</>}>
      <div className="flex flex-col gap-12">
        <Barra
          titulo="Alunos ativos"
          selo="dado"
          partes={[
            { v: P.alunosAtivos, r: `${P.alunosAtivos} hoje`, cls: "bg-ink text-paper" },
            { v: VAGAS_ATE_TETO, r: `${VAGAS_ATE_TETO} vagas`, cls: "hatch border border-ink/50 text-ink", selo: "calculo" },
          ]}
          total={P.teto}
          rotuloTotal={`teto de ${P.teto}`}
        />
        <Barra
          titulo="Entradas novas por mês"
          selo="dado"
          partes={[
            { v: P.entradasOrganicas, r: `${P.entradasOrganicas} orgânico`, cls: "bg-ink text-paper" },
            { v: I.folgaEntradas, r: `${I.folgaEntradas} de folga para o tráfego`, cls: "bg-accent text-paper", selo: "calculo" },
          ]}
          total={P.capacidadeEntradas}
          rotuloTotal={`equipe atende ${P.capacidadeEntradas}`}
        />

        <div data-reveal className="grid items-stretch gap-3 border-t border-line pt-10 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-line bg-card p-6">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">1 · Subir</span>
            <p className="mt-3 font-serif text-2xl leading-snug">Usar a folga de até {I.folgaEntradas} entradas por mês até lotar os {P.teto}.</p>
          </div>
          <div className="hidden items-center text-3xl text-muted md:flex" aria-hidden>
            →
          </div>
          <div className="rounded-2xl border border-line bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">2 · Manter</span>
              <Selo tipo="calculo" />
            </div>
            <p className="mt-3 font-serif text-2xl leading-snug">
              Com a base cheia, o tráfego só repõe quem sai: cerca de <span className="num">{numero(I.entradasManutencao)}</span> alunos extras por mês.
            </p>
          </div>
        </div>
        <Nota>
          <Selo tipo="dado" /> Ao bater o teto, as vagas fecham por um tempo; o carrinho abre todo mês. Enquanto isso, há grupo de espera no WhatsApp ou o consultor chama no 1x1.
        </Nota>
      </div>
    </Slide>
  );
}

function Barra({
  titulo,
  selo,
  partes,
  total,
  rotuloTotal,
}: {
  titulo: string;
  selo: "dado";
  partes: { v: number; r: string; cls: string; selo?: "calculo" }[];
  total: number;
  rotuloTotal: string;
}) {
  return (
    <figure data-reveal>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm text-ink-2">{titulo}</span>
        <span className="flex items-center gap-2 text-sm">
          <span className="num">{rotuloTotal}</span> <Selo tipo={selo} />
        </span>
      </div>
      <div className="flex h-14 gap-[2px]">
        {partes.map((pt, i) => (
          <div
            key={pt.r}
            data-bar
            data-delay={i * 0.2}
            className={`flex items-center overflow-hidden whitespace-nowrap px-3 text-xs sm:text-sm ${pt.cls} ${i === 0 ? "rounded-l-[4px]" : ""} ${
              i === partes.length - 1 ? "rounded-r-[4px]" : ""
            }`}
            style={{ width: `${(pt.v / total) * 100}%` }}
          >
            {pt.r}
          </div>
        ))}
      </div>
    </figure>
  );
}
