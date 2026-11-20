"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import { Dica, Legenda, LinhaDica, useLargura } from "@/components/ui/base";
import { fmt } from "@/lib/metricas";
import { barraTopo, escalaY, marcasX } from "./eixos";
import type { Serie } from "./linhas";

type Ponto = { data: string } & Record<string, number | string>;

/**
 * Colunas por dia, empilhadas por série. 2px de respiro entre os segmentos, só a ponta de cima arredondada.
 * Hover/teclado na coluna inteira: tooltip com cada segmento e o total.
 */
export function GraficoColunas({
  pontos,
  series,
  formato,
  formatoEixo = fmt.curto,
  inteiros = false,
  altura = 220,
  rotulo,
}: {
  pontos: Ponto[];
  series: Serie[];
  formato: (v: number) => string;
  formatoEixo?: (v: number) => string;
  /** Contagens: marcas do eixo só em números inteiros. */
  inteiros?: boolean;
  altura?: number;
  rotulo: string;
}) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [foco, setFoco] = useState<number | null>(null);
  const reduzir = useReducedMotion();
  const m = { t: 10, r: 6, b: 28, l: 58 };
  const w = Math.max(0, largura - m.l - m.r);
  const h = altura - m.t - m.b;
  const n = pontos.length;
  const v = (p: Ponto, k: string) => Number(p[k] ?? 0);
  const total = (p: Ponto) => series.reduce((s, se) => s + v(p, se.chave), 0);
  const { topo, ticks } = escalaY(Math.max(0, ...pontos.map(total)), 4, inteiros);
  const banda = n ? w / n : 0;
  const larguraBarra = Math.max(2, Math.min(26, banda * 0.66));
  const y = (val: number) => h - (val / topo) * h;
  const GAP = 2;

  const teclado = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setFoco((f) => Math.min(n - 1, (f ?? -1) + 1));
    else if (e.key === "ArrowLeft") setFoco((f) => Math.max(0, (f ?? n) - 1));
    else if (e.key === "Escape") setFoco(null);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      {series.length > 1 && <Legenda itens={series} className="mb-3" />}
      <div ref={ref} className="relative" style={{ height: altura }}>
        {largura > 0 && n > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={rotulo} tabIndex={0} onKeyDown={teclado} onBlur={() => setFoco(null)} className="outline-none">
            <g transform={`translate(${m.l},${m.t})`}>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke="var(--t-grade)" strokeDasharray={t === 0 ? undefined : "2 4"} />
                  <text x={-8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-apagado text-[10.5px] tabular">
                    {formatoEixo(t)}
                  </text>
                </g>
              ))}
              {marcasX(n, Math.max(2, Math.floor(w / 64))).map((i) => (
                <text key={i} x={i * banda + banda / 2} y={h + 18} textAnchor="middle" className="fill-apagado text-[10.5px] tabular">
                  {fmt.dia(pontos[i].data)}
                </text>
              ))}
              {pontos.map((p, i) => {
                const x0 = i * banda + (banda - larguraBarra) / 2;
                let base = h;
                const visiveis = series.filter((s) => v(p, s.chave) > 0);
                return (
                  <g key={p.data} onPointerEnter={() => setFoco(i)} onPointerLeave={() => setFoco(null)}>
                    {/* alvo do hover: a faixa inteira do dia (maior que a barra) */}
                    <rect x={i * banda} y={0} width={banda} height={h} fill={foco === i ? "var(--t-grade)" : "transparent"} rx={6} />
                    <motion.g
                      style={{ transformOrigin: `0px ${h}px` }}
                      initial={reduzir ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, delay: reduzir ? 0 : Math.min(0.5, i * 0.012), ease: [0.22, 1, 0.36, 1] }}
                    >
                      {visiveis.map((s, k) => {
                        const altBruta = (v(p, s.chave) / topo) * h;
                        const topoSeg = base - altBruta;
                        const ultimo = k === visiveis.length - 1;
                        const alt = Math.max(1, altBruta - (k > 0 ? GAP : 0));
                        const d = ultimo ? barraTopo(x0, topoSeg, larguraBarra, alt) : `M${x0},${topoSeg}h${larguraBarra}v${alt}h${-larguraBarra}Z`;
                        base = topoSeg;
                        return <path key={s.chave} d={d} fill={s.cor} className="serie-marca" opacity={foco == null || foco === i ? 1 : 0.55} />;
                      })}
                    </motion.g>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
        {foco != null && (
          <Dica x={m.l + foco * banda + banda / 2} y={m.t + 4} largura={largura}>
            <p className="mb-1 font-semibold capitalize text-texto">{fmt.diaLongo(pontos[foco].data)}</p>
            {series.map((s) => (
              <LinhaDica key={s.chave} cor={s.cor} nome={s.nome} valor={formato(v(pontos[foco], s.chave))} />
            ))}
            {series.length > 1 && (
              <div className="mt-1 border-t border-linha pt-1">
                <LinhaDica nome="Total" valor={formato(total(pontos[foco]))} />
              </div>
            )}
          </Dica>
        )}
      </div>
    </div>
  );
}
