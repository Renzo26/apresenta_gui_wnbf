"use client";

import Image from "next/image";
import { Slide } from "@/components/deck/Slide";
import { Numero, Selo, SELOS, type TipoSelo } from "@/components/ui";
import { CENARIOS, CLIENTE, ENTRADAS_PARA_MANTER, P, numero, reais } from "@/lib/modelo";
import { CAPA } from "@/lib/capa";
import type { PropsSlide } from "./tipos";
import logo from "@/public/img/dlm-logo.png";
import atleta from "@/public/img/dlm-atleta.png";

export function Capa({ id }: PropsSlide) {
  return (
    <section
      id={id}
      data-slide
      aria-label="Capa"
      className="relative grid min-h-[100svh] gap-10 overflow-hidden px-4 pb-24 pt-8 sm:px-8 md:px-14 md:pb-28 md:pt-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 lg:px-20"
    >
      {/* traçado de fundo: o "mapa" que a campanha vai confirmar */}
      <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-[38%] h-[38vh] w-full">
        <path data-draw d="M0 330 C 180 330, 260 300, 380 250 S 600 120, 760 110 S 1000 105, 1200 104" fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <path data-draw data-delay="0.2" d="M0 345 C 200 345, 300 330, 450 290 S 700 180, 860 150 S 1060 140, 1200 138" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <path data-draw data-delay="0.4" d="M0 360 C 220 360, 360 352, 520 330 S 800 260, 960 220 S 1120 200, 1200 196" fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="4 6" />
      </svg>

      <div className="relative flex flex-col justify-between gap-10">
        <div data-reveal className="flex items-center justify-between gap-4">
          {/* o arquivo do logo é quadrado com muita margem branca: o cartão recorta só a marca */}
          <div className="relative aspect-[415/245] w-44 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_-18px_rgba(27,26,23,0.45)] ring-1 ring-line md:w-56">
            <Image src={logo} alt={CAPA.cliente} fill priority sizes="224px" className="object-cover object-[50%_45%]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted lg:hidden">{CAPA.data}</span>
        </div>

        <div>
          <p data-reveal className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Tráfego pago · primeira campanha
          </p>
          <h1 data-reveal className="max-w-[16ch] font-serif text-[2.9rem] leading-[0.98] tracking-[-0.03em] [font-variation-settings:'SOFT'_60] sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem]">
            Projeção e plano de validação do tráfego pago
          </h1>
        </div>

        <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed text-ink-2">
            O que já sabemos, o que é conta, o que ainda é aposta — e como vamos confirmar cada número com a campanha rodando.
          </p>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex gap-2">
              <Selo tipo="dado" />
              <Selo tipo="calculo" />
              <Selo tipo="hipotese" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{CAPA.autor}</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 lg:justify-center">
        <span className="hidden text-right font-mono text-xs uppercase tracking-[0.18em] text-muted lg:block">{CAPA.data}</span>
        <figure
          data-reveal
          className="relative mx-auto aspect-[792/1080] w-full max-w-[420px] overflow-hidden rounded-[28px] bg-ink shadow-[0_40px_80px_-30px_rgba(27,26,23,0.55)] lg:max-w-none"
        >
          {/* a imagem original já tem cantos arredondados; o leve zoom esconde a borda clara */}
          <Image
            src={atleta}
            alt={`Atleta do ${CAPA.cliente} com medalha da WNBF`}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 420px, 92vw"
            className="scale-[1.045] object-cover"
          />
        </figure>
      </div>
    </section>
  );
}

const EXEMPLOS: Record<TipoSelo, { valor: string; legenda: string }> = {
  dado: { valor: `${P.alunosAtivos} alunos`, legenda: "ativos hoje, segundo o cliente" },
  calculo: { valor: `${numero(ENTRADAS_PARA_MANTER)} por mês`, legenda: "entradas para manter a base, pela conta" },
  hipotese: { valor: reais(CENARIOS[1].cpl), legenda: "por contato no cenário realista, a medir" },
};

export function ComoLer(p: PropsSlide) {
  return (
    <Slide {...p} secao="Como ler" titulo="Cada número aqui diz de onde veio">
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(SELOS) as TipoSelo[]).map((t) => (
          <div key={t} data-reveal className="flex flex-col gap-6 rounded-2xl border border-line bg-card p-6" style={{ borderTop: `4px solid ${SELOS[t].cor}` }}>
            <Selo tipo={t} grande />
            <p className="font-serif text-2xl leading-tight">{SELOS[t].texto}</p>
            <div className="mt-auto border-t border-line pt-4">
              <p className="num text-3xl" style={{ color: SELOS[t].cor }}>
                {EXEMPLOS[t].valor}
              </p>
              <p className="text-sm text-muted">{EXEMPLOS[t].legenda}</p>
            </div>
          </div>
        ))}
      </div>
      <p data-reveal className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-2 md:text-xl">
        Objetivo: mostrar como projetamos os resultados do tráfego, separar <strong className="text-ink">fato</strong> de{" "}
        <strong className="text-ink">suposição</strong> e combinar como vamos trocar cada hipótese por um número real.
      </p>
    </Slide>
  );
}

export function Hoje(p: PropsSlide) {
  const max = 25;
  return (
    <Slide {...p} secao="Onde estamos" titulo="Hoje a operação vive só do orgânico, e ele oscila muito">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          <Numero rotulo="Alunos ativos" valor={P.alunosAtivos} selo="dado" detalhe={`entre ${CLIENTE.alunosFaixa[0]} e ${CLIENTE.alunosFaixa[1]}`} />
          <Numero rotulo="Custo mensal" valor={`R$ ${numero(P.custoOperacao / 1000)} mil`} selo="dado" detalhe="sem verba de anúncio" />
          <Numero rotulo="Permanência média" valor={`${P.permanencia} meses`} selo="dado" />
          <Numero rotulo="Fechamento" valor="1 em 6" selo="dado" detalhe="contatos que viram aluno" />
        </div>

        <figure data-reveal className="flex flex-col">
          <figcaption className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-ink-2">Entradas novas por mês</span>
            <Selo tipo="dado" />
          </figcaption>
          <div className="relative flex h-64 items-end gap-3 border-b border-ink/70 sm:gap-6 md:h-72">
            <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-accent" style={{ bottom: `${(P.entradasOrganicas / max) * 100}%` }}>
              <span className="absolute -top-7 left-0 rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-paper">média {P.entradasOrganicas}</span>
            </div>
            {CLIENTE.entradasMeses.map((m, i) => (
              <div key={m.mes} className="group relative flex h-full flex-1 flex-col justify-end">
                <span className="num mb-2 text-center text-lg">{m.v}</span>
                <div data-bar="y" data-delay={i * 0.08} className="rounded-t-[4px] bg-ink transition-colors group-hover:bg-ink-2" style={{ height: `${(m.v / max) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 sm:gap-6">
            {CLIENTE.entradasMeses.map((m) => (
              <span key={m.mes} className="flex-1 text-center font-mono text-xs uppercase text-muted">
                {m.mes}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-2">
            <Selo tipo="dado" />
            <span>Contatos por mês, nos últimos meses:</span>
            <span className="num text-ink">{CLIENTE.contatosMeses.join(" · ")}</span>
            <span className="text-muted">(ideal: pelo menos {CLIENTE.contatosQuentesIdeal} contatos quentes)</span>
          </div>
        </figure>
      </div>
    </Slide>
  );
}

export function Diagnostico(p: PropsSlide) {
  const max = 36;
  const largura = (v: number) => `${(v / max) * 100}%`;
  return (
    <Slide {...p} secao="O que os números dizem" titulo="Hoje a base se sustenta, mas não cresce">
      <div className="flex max-w-5xl flex-col gap-10">
        <div data-reveal>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-ink-2">
              Para manter {P.alunosAtivos} alunos que ficam {P.permanencia} meses, precisamos de
            </span>
            <Selo tipo="calculo" />
          </div>
          <div className="flex items-center gap-4">
            <div data-bar className="hatch h-12 rounded-[4px] border border-ink/50" style={{ width: largura(ENTRADAS_PARA_MANTER) }} />
            <span className="num text-3xl">≈ {numero(ENTRADAS_PARA_MANTER)}</span>
          </div>
          <p className="mt-2 font-mono text-xs text-muted">
            {P.alunosAtivos} ÷ {P.permanencia} meses = entradas + renovações por mês
          </p>
        </div>

        <div data-reveal>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-ink-2">O que entra hoje, por mês</span>
            <Selo tipo="dado" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 gap-[2px]" style={{ width: largura(P.entradasOrganicas + CLIENTE.renovacoesMes) }}>
              <div data-bar className="flex flex-1 items-center rounded-l-[4px] bg-ink px-3 text-sm text-paper">{P.entradasOrganicas} novas</div>
              <div data-bar data-delay="0.15" className="flex flex-1 items-center rounded-r-[4px] bg-ink-2 px-3 text-sm text-paper">
                {CLIENTE.renovacoesMes} renovações
              </div>
            </div>
            <span className="num text-3xl">{P.entradasOrganicas + CLIENTE.renovacoesMes}</span>
          </div>
          <p className="mt-2 font-mono text-xs text-muted">taxa de renovação de {CLIENTE.taxaRenovacao * 100}%</p>
        </div>

        <div data-reveal className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
          <p className="font-serif text-2xl leading-snug">
            Entra praticamente o mesmo que sai. O orgânico <span className="text-accent">segura</span> a base, mas não a leva para cima.
          </p>
          <div className="flex flex-col gap-2 text-sm text-ink-2">
            <Selo tipo="calculo" />
            <p>
              Para fazer {P.entradasOrganicas} entradas fechando 1 em 6, o orgânico gera cerca de{" "}
              <strong className="num text-ink">{P.leadsOrganicos}</strong> contatos por mês — bate com a média de{" "}
              {CLIENTE.contatosMediaInformada} informada pelo cliente.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}
