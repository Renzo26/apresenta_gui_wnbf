"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Dica, Legenda, LinhaDica, useLargura } from "@/components/ui/base";
import { fmt } from "@/lib/metricas";
import { escalaY, marcasX, separar } from "./eixos";

export type Serie = { chave: string; nome: string; cor: string; area?: boolean; tracejado?: boolean };
type Ponto = { data: string } & Record<string, number | string>;

/**
 * Linhas no tempo, todas na MESMA unidade (um eixo só; medidas diferentes vão em gráficos separados).
 * Hover/teclado: linha-guia + tooltip com todas as séries do dia. Até 4 séries ganham rótulo direto no fim.
 */
export function GraficoLinhas({
  pontos,
  series,
  formato,
  formatoEixo = formato,
  altura = 240,
  inteiros = false,
  rotulo,
}: {
  pontos: Ponto[];
  series: Serie[];
  formato: (v: number) => string;
  formatoEixo?: (v: number) => string;
  altura?: number;
  /** Contagens: marcas do eixo só em números inteiros. */
  inteiros?: boolean;
  rotulo: string;
}) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [foco, setFoco] = useState<number | null>(null);
  const reduzir = useReducedMotion();
  const id = useId().replace(/:/g, "");

  const rotulosDiretos = series.length <= 4;
  const m = { t: 14, r: rotulosDiretos ? 96 : 14, b: 28, l: 56 };
  const w = Math.max(0, largura - m.l - m.r);
  const h = altura - m.t - m.b;
  const n = pontos.length;
  const valor = (p: Ponto, k: string) => Number(p[k] ?? 0);
  const max = Math.max(0, ...pontos.flatMap((p) => series.map((s) => valor(p, s.chave))));
  const { topo, ticks } = escalaY(max, 4, inteiros);
  const x = (i: number) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => h - (v / topo) * h;

  const caminho = (k: string) => pontos.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(valor(p, k)).toFixed(1)}`).join("");
  const ultimo = n - 1;
  const ysFim = separar(
    series.map((s) => (n ? y(valor(pontos[ultimo], s.chave)) : 0)),
    15,
    0,
    h,
  );

  const mover = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / Math.max(1, r.width);
    setFoco(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };
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
          <svg
            width={largura}
            height={altura}
            role="img"
            aria-label={rotulo}
            tabIndex={0}
            onKeyDown={teclado}
            onBlur={() => setFoco(null)}
            className="overflow-visible outline-none focus-visible:[&_.foco-anel]:opacity-100"
          >
            <defs>
              {series
                .filter((s) => s.area)
                .map((s) => (
                  <linearGradient key={s.chave} id={`${id}-${s.chave}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.cor} stopOpacity={0.26} />
                    <stop offset="100%" stopColor={s.cor} stopOpacity={0} />
                  </linearGradient>
                ))}
            </defs>
            <rect className="foco-anel opacity-0" x={1} y={1} width={largura - 2} height={altura - 2} rx={12} fill="none" stroke="var(--t-indigo-claro)" strokeWidth={1.5} />
            <g transform={`translate(${m.l},${m.t})`}>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke="var(--t-grade)" strokeDasharray={t === 0 ? undefined : "2 4"} />
                  <text x={-10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-apagado text-[10.5px] tabular">
                    {formatoEixo(t)}
                  </text>
                </g>
              ))}
              {marcasX(n, Math.max(2, Math.floor(w / 72))).map((i) => (
                <text key={i} x={x(i)} y={h + 18} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-apagado text-[10.5px] tabular">
                  {fmt.dia(pontos[i].data)}
                </text>
              ))}

              {series.map((s) =>
                s.area ? (
                  <motion.path
                    key={`a-${s.chave}`}
                    d={`${caminho(s.chave)}L${x(ultimo)},${h}L${x(0)},${h}Z`}
                    fill={`url(#${id}-${s.chave})`}
                    initial={reduzir ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                ) : null,
              )}
              {series.map((s) => (
                <motion.path
                  key={`${s.chave}-${n}-${topo}`}
                  d={caminho(s.chave)}
                  fill="none"
                  stroke={s.cor}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={s.tracejado ? "5 5" : undefined}
                  className="serie-marca"
                  initial={reduzir || s.tracejado ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}

              {rotulosDiretos &&
                series.map((s, k) => (
                  <g key={`r-${s.chave}`} transform={`translate(${w + 10},${ysFim[k]})`}>
                    <rect x={0} y={-4} width={8} height={8} rx={2} fill={s.cor} className="serie-marca" />
                    <text x={13} dy="0.34em" className="fill-suave text-[11px] font-semibold">
                      {s.nome.length > 12 ? `${s.nome.slice(0, 11)}…` : s.nome}
                    </text>
                  </g>
                ))}

              {foco != null && (
                <g pointerEvents="none">
                  <line x1={x(foco)} x2={x(foco)} y1={0} y2={h} stroke="var(--t-suave)" strokeOpacity={0.5} />
                  {series.map((s) => (
                    <circle key={s.chave} cx={x(foco)} cy={y(valor(pontos[foco], s.chave))} r={4.5} fill={s.cor} stroke="var(--t-painel)" strokeWidth={2} />
                  ))}
                </g>
              )}
              <rect width={w} height={h} fill="transparent" onPointerMove={mover} onPointerLeave={() => setFoco(null)} style={{ touchAction: "pan-y" }} />
            </g>
          </svg>
        )}
        {foco != null && (
          <Dica x={m.l + x(foco)} y={m.t + 4} largura={largura}>
            <p className="mb-1 font-semibold capitalize text-texto">{fmt.diaLongo(pontos[foco].data)}</p>
            {series.map((s) => (
              <LinhaDica key={s.chave} cor={s.cor} nome={s.nome} valor={formato(valor(pontos[foco], s.chave))} />
            ))}
          </Dica>
        )}
      </div>
    </div>
  );
}
