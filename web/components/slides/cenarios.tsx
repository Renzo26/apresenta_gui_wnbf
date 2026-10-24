"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Slide } from "@/components/deck/Slide";
import { Luz, Nota, Selo } from "@/components/ui";
import { CENARIOS, ESPERA, EVOLUCAO, I, META_CAC, P, PROJECAO, VERBAS, corCac, mil, numero, pct, reais } from "@/lib/modelo";
import type { PropsSlide } from "./tipos";

const ROTULO_COR = { verde: "dentro da meta", amarelo: "acima da meta", vermelho: "prejuízo" } as const;

export function Cenarios(p: PropsSlide) {
  const max = 1150;
  return (
    <Slide {...p} secao="Três cenários" titulo="Três pontos de partida, não três promessas">
      <div className="grid gap-4 md:grid-cols-3">
        {CENARIOS.map((c, i) => {
          const cor = corCac(c.cac);
          return (
            <motion.article
              key={c.nome}
              data-reveal
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={`flex flex-col gap-6 rounded-2xl border p-6 ${i === 1 ? "border-ink bg-card" : "border-line bg-card/60"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl">{c.nome}</h3>
                <Selo tipo="hipotese" />
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-ink-2">Custo por contato</dt>
                  <dd className="num text-3xl">{reais(c.cpl)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-2">Fechamento</dt>
                  <dd className="num text-3xl">{pct(c.fechamento, c.fechamento < 0.15 ? 0 : 1)}</dd>
                </div>
              </dl>
              <div className="mt-auto border-t border-line pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-ink-2">Custo por aluno</span>
                  <span className="flex items-center gap-2 text-xs text-ink-2">
                    <Luz cor={cor} tamanho={9} /> {ROTULO_COR[cor]}
                  </span>
                </div>
                <p className="num mt-1 text-5xl text-accent">{reais(c.cac)}</p>
                <div className="relative mt-4 h-1.5 rounded-full bg-paper-2">
                  <div data-bar data-delay={i * 0.1} className="h-full rounded-full bg-ink" style={{ width: `${(c.cac / max) * 100}%` }} />
                  <span className="absolute -top-1 h-3.5 w-px bg-verde" style={{ left: `${(META_CAC / max) * 100}%` }} />
                  <span className="absolute -top-1 h-3.5 w-px bg-vermelho" style={{ left: `${(I.cacEquilibrio / max) * 100}%` }} />
                </div>
                <div className="mt-1 flex justify-end gap-4 font-mono text-[10px] text-muted">
                  <span>meta {META_CAC}</span>
                  <span>limite {numero(I.cacEquilibrio)}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Nota tom="alerta">
          O tráfego tende a fechar <strong>menos</strong> que o orgânico (1 em 6), porque o contato chega mais frio. Por isso só o cenário otimista
          supõe o mesmo fechamento.
        </Nota>
        <Nota>São pontos de partida, não médias de mercado verificadas. As duas primeiras semanas de campanha substituem esses números pelos reais.</Nota>
      </div>
    </Slide>
  );
}

export function PorVerba(p: PropsSlide) {
  const folga = I.folgaEntradas;
  return (
    <Slide {...p} secao="Projeção por faixa de verba" titulo="Quando a equipe lota, mais verba não vira mais aluno">
      <div data-reveal className="overflow-x-auto" data-lenis-prevent-touch>
        <table className="w-full min-w-[640px] border-separate border-spacing-[3px] text-left">
          <thead>
            <tr>
              <th className="w-32 pb-3 align-bottom">
                <span className="flex flex-col items-start gap-1.5 text-xs font-normal text-ink-2">
                  Verba / mês <Selo tipo="hipotese" />
                </span>
              </th>
              {CENARIOS.map((c) => (
                <th key={c.nome} className="pb-3 font-serif text-2xl font-normal">
                  {c.nome}
                  <span className="num block font-sans text-xs text-muted">custo por aluno {reais(c.cac)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VERBAS.map((v) => (
              <tr key={v}>
                <th className="num pr-4 text-2xl font-normal">{mil(v, 0)}</th>
                {CENARIOS.map((c) => {
                  const cel = PROJECAO.find((x) => x.cenario === c.nome && x.verba === v)!;
                  const noTeto = cel.alunosPotencial > folga + 1e-6;
                  return (
                    <td key={c.nome} className={`rounded-xl p-4 align-top ${noTeto ? "hatch bg-paper-2" : "bg-card"}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="num text-3xl">{numero(cel.alunos, cel.alunos % 1 ? 1 : 0)}</span>
                        <span className="text-xs text-ink-2">alunos / mês</span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-paper-2">
                        <div data-bar className={`h-full rounded-full ${noTeto ? "bg-accent" : "bg-ink"}`} style={{ width: `${(cel.alunos / folga) * 100}%` }} />
                      </div>
                      <p className="mt-3 text-sm text-ink-2">
                        <span className="num text-ink">+{mil(cel.resultado)}</span> em 6 meses
                      </p>
                      {noTeto && (
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-accent">
                          no teto · daria {numero(cel.alunosPotencial, 0)}
                        </p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Nota tom="alerta">
          O teto é de {folga} entradas extras por mês. Acima disso, a verba compra contatos que a equipe não consegue atender: vira desperdício.
        </Nota>
        <Nota>
          <Selo tipo="calculo" /> “Em 6 meses” = o que os alunos do mês deixam na permanência, já descontados o custo de atender e a verba. Vale enquanto
          há vaga.
        </Nota>
      </div>
    </Slide>
  );
}

const ESTILO_LINHA = [
  { cor: "var(--muted)", traco: "6 5" },
  { cor: "var(--accent)", traco: "" },
  { cor: "var(--ink)", traco: "1 5" },
];

export function Evolucao(p: PropsSlide) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 320;
  const m = { l: 44, r: 16, t: 16, b: 32 };
  const yMin = 180;
  const yMax = 236;
  const x = (mes: number) => m.l + (mes / 12) * (W - m.l - m.r);
  const y = (v: number) => m.t + (1 - (v - yMin) / (yMax - yMin)) * (H - m.t - m.b);
  const maxVerba = Math.max(...EVOLUCAO.map((e) => e.verbaTotal));

  return (
    <Slide {...p} secao="Evolução em 12 meses" titulo="Com o teto, todo cenário chega lá; muda quanto custa chegar">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
        <figure data-reveal>
          <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink-2">Alunos ativos, com verba de até {mil(ESPERA.verbaNormalMax, 0)} por mês</span>
            <span className="flex items-center gap-2">
              <Selo tipo="hipotese" /> <Selo tipo="calculo" />
            </span>
          </figcaption>
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full touch-pan-y"
              role="img"
              aria-label="Linha da base ativa por cenário ao longo de 12 meses"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = ((e.clientX - r.left) / r.width) * W;
                setHover(Math.max(0, Math.min(12, Math.round(((px - m.l) / (W - m.l - m.r)) * 12))));
              }}
              onPointerLeave={() => setHover(null)}
            >
              {[190, 200, 210, 220, 230].map((v) => (
                <g key={v}>
                  <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke={v === P.teto ? "var(--muted)" : "var(--line)"} strokeWidth="0.75" />
                  <text x={m.l - 8} y={y(v) + 4} textAnchor="end" className="num" fontSize="11" fill="var(--muted)">
                    {v}
                  </text>
                </g>
              ))}
              <text x={W - m.r} y={y(P.teto) - 8} textAnchor="end" fontSize="11" fill="var(--ink)" className="num">
                teto {P.teto}
              </text>
              {[0, 3, 6, 9, 12].map((mes) => (
                <text key={mes} x={x(mes)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--muted)" className="num">
                  {mes === 0 ? "hoje" : `mês ${mes}`}
                </text>
              ))}
              {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={H - m.b} stroke="var(--ink)" strokeWidth="0.75" />}
              <defs>
                <clipPath id="revelar-evolucao">
                  <rect data-bar x={m.l - 6} y="0" width={W - m.l - m.r + 12} height={H} />
                </clipPath>
              </defs>
              <g clipPath="url(#revelar-evolucao)">
                {/* realista por último: é a linha de referência */}
                {[2, 0, 1].map((i) => (
                  <path
                    key={EVOLUCAO[i].nome}
                    d={EVOLUCAO[i].linha.map((l, k) => `${k ? "L" : "M"}${x(l.mes).toFixed(1)} ${y(l.base).toFixed(1)}`).join(" ")}
                    fill="none"
                    stroke={ESTILO_LINHA[i].cor}
                    strokeWidth={i === 1 ? 2.5 : 2}
                    strokeDasharray={ESTILO_LINHA[i].traco}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
              {EVOLUCAO.map((e, i) =>
                e.lotaNoMes ? (
                  <circle key={e.nome + "-c"} cx={x(e.lotaNoMes)} cy={y(P.teto)} r="5" fill={ESTILO_LINHA[i].cor} stroke="var(--paper)" strokeWidth="2" />
                ) : null
              )}
              {hover !== null &&
                EVOLUCAO.map((e, i) => (
                  <circle key={e.nome + "-h"} cx={x(hover)} cy={y(e.linha[hover].base)} r="4.5" fill={ESTILO_LINHA[i].cor} stroke="var(--paper)" strokeWidth="2" />
                ))}
            </svg>
            <AnimatePresence>
              {hover !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute top-2 rounded-lg bg-ink px-3 py-2 text-xs text-paper shadow-lg"
                  style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > 7 ? "-110%" : "10%"})` }}
                >
                  <p className="mb-1 font-mono uppercase tracking-wider text-paper/60">{hover === 0 ? "hoje" : `mês ${hover}`}</p>
                  {EVOLUCAO.map((e) => (
                    <p key={e.nome} className="flex justify-between gap-4">
                      <span>{e.nome}</span>
                      <span className="num">{numero(e.linha[hover].base)}</span>
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-2">
            {EVOLUCAO.map((e, i) => (
              <span key={e.nome} className="flex items-center gap-2">
                <svg width="22" height="6" aria-hidden>
                  <line x1="1" x2="21" y1="3" y2="3" stroke={ESTILO_LINHA[i].cor} strokeWidth="2" strokeDasharray={ESTILO_LINHA[i].traco} strokeLinecap="round" />
                </svg>
                {e.nome} · lota no {e.lotaNoMes}º mês
              </span>
            ))}
          </div>
        </figure>

        <div className="flex flex-col gap-6">
          <div data-reveal className="rounded-2xl bg-ink p-6 text-paper">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60">Alunos novos em 12 meses</p>
            <p className="num mt-2 text-6xl">≈ {numero(EVOLUCAO[1].alunosTotal)}</p>
            <p className="mt-2 text-sm text-paper/75">nos três cenários. O teto iguala o volume.</p>
          </div>
          <div data-reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-sm text-ink-2">
              Verba em 12 meses <Selo tipo="calculo" />
            </span>
            {EVOLUCAO.map((e, i) => (
              <div key={e.nome}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{e.nome}</span>
                  <span className="num text-xl">≈ {mil(e.verbaTotal, 0)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-paper-2">
                  <div data-bar data-delay={i * 0.1} className="h-full rounded-full" style={{ width: `${(e.verbaTotal / maxVerba) * 100}%`, background: i === 1 ? "var(--accent)" : "var(--ink)" }} />
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted">manutenção ≈ {mil(e.verbaManutencao)} / mês com a base cheia</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Nota>
          A simulação supõe que os alunos saem todos juntos após {P.permanencia} meses. Na prática as saídas se espalham e a base oscila menos.
        </Nota>
        <Nota tom="alerta">
          Com a base travada em {P.teto}, crescer receita depende mais de vender planos semestral e anual e de renovar mais alunos do que de volume.
        </Nota>
      </div>
    </Slide>
  );
}

export function ListaEspera(p: PropsSlide) {
  const max = 650;
  const cplEspera = CENARIOS[1].cpl * ESPERA.cplRelativo;
  const convEspera = CENARIOS[1].fechamento * ESPERA.conversaoRelativa;
  return (
    <Slide {...p} secao="Lista de espera" titulo="A lista de espera só compensa se converter tão bem quanto o anúncio">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-hipotese px-3 py-1 font-mono text-xs uppercase tracking-wider text-hipotese">Teste, não decisão</span>
            <Selo tipo="hipotese" />
          </div>
          <dl data-reveal className="grid grid-cols-3 gap-4 border-t border-line pt-5">
            <div>
              <dt className="text-xs text-ink-2">Verba</dt>
              <dd className="num text-2xl">{mil(ESPERA.verba, 0)}</dd>
              <dd className="text-xs text-muted">por mês, só com vagas fechadas</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">Custo por contato</dt>
              <dd className="num text-2xl">{reais(cplEspera)}</dd>
              <dd className="text-xs text-muted">igual ao anúncio</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">Conversão</dt>
              <dd className="num text-2xl">{pct(convEspera)}</dd>
              <dd className="text-xs text-muted">metade do normal, na reabertura</dd>
            </div>
          </dl>
          <figure data-reveal className="flex flex-col gap-4">
            <figcaption className="flex items-center gap-2 text-sm text-ink-2">
              Custo por aluno, cenário realista <Selo tipo="calculo" />
            </figcaption>
            {[
              { r: "Vindo do anúncio", v: ESPERA.cacAnuncio, cls: "bg-ink" },
              { r: "Vindo da espera", v: ESPERA.cacEspera, cls: "bg-accent" },
            ].map((b, i) => (
              <div key={b.r}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{b.r}</span>
                  <span className="num text-2xl">{reais(b.v)}</span>
                </div>
                <div className="h-8 rounded-[4px] bg-paper-2">
                  <div data-bar data-delay={i * 0.2} className={`h-full rounded-[4px] ${b.cls}`} style={{ width: `${(b.v / max) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="text-sm text-ink-2">
              Somando os dois, o custo médio por aluno no ano sobe de <span className="num text-ink">{reais(ESPERA.cacAnuncio)}</span> para{" "}
              <span className="num text-ink">{reais(ESPERA.cacMedio)}</span>.
            </p>
          </figure>
        </div>

        <div data-reveal className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Por que custa mais</p>
            <p className="mt-3 font-serif text-2xl leading-snug">
              As vagas são limitadas. Quem vem da espera ocupa a vaga de quem viria do anúncio, e chega mais caro.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">O que precisa ser verdade para valer</p>
            <ul className="mt-3 space-y-3 text-ink-2">
              <li className="flex gap-3">
                <span className="num text-accent">1</span> Converter tão bem quanto o anúncio (cerca de {pct(CENARIOS[1].fechamento)} no realista), ou
              </li>
              <li className="flex gap-3">
                <span className="num text-accent">2</span> ter custo por contato bem menor que o da campanha normal.
              </li>
            </ul>
          </div>
          <Nota>Ela também pode valer por encher as vagas mais rápido na reabertura. Isso a simulação não mede, e o teste vai mostrar.</Nota>
        </div>
      </div>
    </Slide>
  );
}
