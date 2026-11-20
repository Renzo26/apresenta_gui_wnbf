"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { Dica, Legenda, LinhaDica, useLargura } from "@/components/ui/base";
import { fmt } from "@/lib/metricas";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Mini-linha dos KPIs: só a forma da tendência, com o último ponto marcado. */
export function Sparkline({ valores, cor, altura = 36 }: { valores: number[]; cor: string; altura?: number }) {
  const [ref, w] = useLargura<HTMLDivElement>();
  const reduzir = useReducedMotion();
  const n = valores.length;
  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const x = (i: number) => (n <= 1 ? w / 2 : 3 + (i / (n - 1)) * (w - 6));
  const y = (v: number) => altura - 4 - ((v - min) / Math.max(1e-9, max - min)) * (altura - 8);
  const d = valores.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  return (
    <div ref={ref} style={{ height: altura }} aria-hidden>
      {w > 0 && n > 1 && (
        <svg width={w} height={altura} className="overflow-visible">
          <motion.path
            key={d.length}
            d={d}
            fill="none"
            stroke={cor}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduzir ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: EASE }}
          />
          <circle cx={x(n - 1)} cy={y(valores[n - 1])} r={3} fill={cor} stroke="var(--t-painel)" strokeWidth={2} />
        </svg>
      )}
    </div>
  );
}

/**
 * Ranking em barras horizontais (nome à esquerda, valor sempre visível à direita).
 * A cor é da entidade (passe `cor` por item) ou uma só para todas.
 */
export function BarrasH({
  itens,
  formato,
  cor = "var(--color-s1)",
  rotulo,
}: {
  itens: { nome: ReactNode; chave: string; valor: number | null; cor?: string; detalhe?: { nome: string; valor: string }[]; nota?: ReactNode }[];
  formato: (v: number | null) => string;
  cor?: string;
  rotulo: string;
}) {
  const reduzir = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [foco, setFoco] = useState<{ i: number; y: number } | null>(null);
  const max = Math.max(0, ...itens.map((i) => i.valor ?? 0));
  return (
    <div ref={ref} className="relative">
      <ul aria-label={rotulo} className="space-y-3">
        {itens.map((it, i) => (
          <li
            key={it.chave}
            className="group"
            onPointerEnter={(e) => it.detalhe && setFoco({ i, y: (e.currentTarget as HTMLElement).offsetTop })}
            onPointerLeave={() => setFoco(null)}
          >
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate font-semibold text-suave group-hover:text-texto">{it.nome}</span>
              <span className="shrink-0 font-bold text-texto tabular">{formato(it.valor)}</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-painel-2">
              <motion.div
                className="serie-marca h-full rounded-full"
                style={{ background: it.cor ?? cor }}
                initial={reduzir ? false : { width: 0 }}
                animate={{ width: `${max ? Math.max(1.5, ((it.valor ?? 0) / max) * 100) : 0}%` }}
                transition={{ duration: 0.9, delay: reduzir ? 0 : i * 0.05, ease: EASE }}
              />
            </div>
            {it.nota && <p className="mt-1 text-[0.68rem] text-apagado">{it.nota}</p>}
          </li>
        ))}
      </ul>
      {foco && itens[foco.i].detalhe && (
        <Dica x={largura * 0.55} y={foco.y + 26} largura={largura}>
          {itens[foco.i].detalhe!.map((d) => (
            <LinhaDica key={d.nome} nome={d.nome} valor={d.valor} />
          ))}
        </Dica>
      )}
    </div>
  );
}

/**
 * Funil por etapas. A barra de cada etapa é a conversão sobre a etapa anterior (0–100%),
 * porque em volume absoluto as últimas etapas sumiriam (impressões são 10.000x as vendas).
 */
export function Funil({ etapas }: { etapas: { nome: string; valor: number; custo?: string }[] }) {
  const reduzir = useReducedMotion();
  return (
    <ol className="space-y-1">
      {etapas.map((e, i) => {
        const anterior = etapas[i - 1];
        const taxa = anterior && anterior.valor > 0 ? (e.valor / anterior.valor) * 100 : null;
        return (
          <li key={e.nome} className="relative grid grid-cols-[1fr_auto] items-end gap-x-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-painel-2/60">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-apagado">
                <span className="mr-1.5 text-bronze tabular">{String(i + 1).padStart(2, "0")}</span>
                {e.nome}
              </p>
              <p className="mt-0.5 font-display text-[1.65rem] leading-none text-texto tabular">{fmt.int(e.valor)}</p>
            </div>
            <div className="text-right text-[0.7rem] leading-tight">
              {taxa != null && <p className="font-bold text-texto tabular">{fmt.pct(taxa, taxa < 1 ? 2 : 1)}</p>}
              {taxa != null && <p className="text-apagado">da etapa anterior</p>}
              {e.custo && <p className="mt-1 text-suave tabular">{e.custo}</p>}
            </div>
            {taxa != null && (
              <div className="col-span-2 mt-2 h-1.5 rounded-full bg-painel-2" aria-hidden>
                <motion.div
                  className="h-full rounded-full bg-s1"
                  initial={reduzir ? false : { width: 0 }}
                  animate={{ width: `${Math.max(1, Math.min(100, taxa))}%` }}
                  transition={{ duration: 1, delay: reduzir ? 0 : 0.1 + i * 0.07, ease: EASE }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Barra 100% (partes de um todo) com 2px de respiro entre as partes + legenda com valores. */
export function Proporcao({
  partes,
  formato,
  titulo,
}: {
  partes: { nome: string; valor: number; cor: string }[];
  formato: (v: number) => string;
  titulo: string;
}) {
  const reduzir = useReducedMotion();
  const total = partes.reduce((s, p) => s + p.valor, 0);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-bold uppercase tracking-[0.16em] text-apagado">{titulo}</span>
        <span className="font-semibold text-texto tabular">{formato(total)}</span>
      </div>
      <div className="mt-2 flex h-3 gap-[2px] overflow-hidden rounded-full" role="img" aria-label={`${titulo}: ${partes.map((p) => `${p.nome} ${fmt.pct(total ? (p.valor / total) * 100 : 0)}`).join(", ")}`}>
        {partes.map((p, i) => (
          <motion.span
            key={p.nome}
            className="serie-marca h-full first:rounded-l-full last:rounded-r-full"
            style={{ background: p.cor }}
            title={`${p.nome}: ${formato(p.valor)}`}
            initial={reduzir ? false : { flexGrow: 0 }}
            animate={{ flexGrow: total ? p.valor / total : 0 }}
            transition={{ duration: 0.9, delay: reduzir ? 0 : i * 0.06, ease: EASE }}
          />
        ))}
      </div>
      <ul className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
        {partes.map((p) => (
          <li key={p.nome} className="min-w-0">
            <span className="flex items-center gap-1.5 text-apagado">
              <span className="serie-marca size-2 shrink-0 rounded-[2px]" style={{ background: p.cor }} />
              <span className="truncate">{p.nome}</span>
            </span>
            <span className="mt-0.5 block font-semibold text-texto tabular">
              {fmt.pct(total ? (p.valor / total) * 100 : 0, 0)} <span className="font-normal text-apagado">· {formato(p.valor)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
/** 5 degraus de uma cor só (sequencial): do fundo ao índigo cheio. */
const DEGRAUS = [10, 28, 48, 70, 100];

/** Mapa de calor dia da semana × hora (magnitude = uma cor, do claro ao escuro). */
export function MapaCalor({ matriz, rotulo }: { matriz: number[][]; rotulo: string }) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [foco, setFoco] = useState<{ d: number; h: number; x: number; y: number } | null>(null);
  const max = Math.max(1, ...matriz.flat());
  const degrau = (v: number) => DEGRAUS[Math.min(4, Math.floor((v / max) * 5))];
  const ordem = [1, 2, 3, 4, 5, 6, 0]; // segunda primeiro
  return (
    <div>
      <div ref={ref} className="relative overflow-x-auto rolagem" data-lenis-prevent>
        <div role="img" aria-label={rotulo} className="grid min-w-[560px] grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[2px]">
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="pb-1 text-center text-[0.6rem] text-apagado tabular">
              {h % 3 === 0 ? `${h}h` : ""}
            </span>
          ))}
          {ordem.map((d) => (
            <div key={d} className="contents">
              <span className="self-center text-[0.68rem] font-semibold text-apagado">{DIAS_SEMANA[d]}</span>
              {matriz[d].map((v, h) => (
                <span
                  key={h}
                  onPointerEnter={(e) => {
                    const el = e.currentTarget;
                    setFoco({ d, h, x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight });
                  }}
                  onPointerLeave={() => setFoco(null)}
                  className={cn("aspect-square rounded-[4px] transition-transform hover:scale-110", foco?.d === d && foco.h === h && "ring-2 ring-texto")}
                  style={{ background: `color-mix(in oklch, var(--color-s1) ${degrau(v)}%, var(--t-painel-2))` }}
                />
              ))}
            </div>
          ))}
        </div>
        {foco && (
          <Dica x={foco.x} y={foco.y + 4} largura={largura}>
            <p className="mb-1 font-semibold text-texto">
              {DIAS_SEMANA[foco.d]}, {foco.h}h–{foco.h + 1}h
            </p>
            <LinhaDica nome="Conversas iniciadas" valor={fmt.int(matriz[foco.d][foco.h])} />
          </Dica>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[0.68rem] text-apagado">
        Menos
        {DEGRAUS.map((p) => (
          <span key={p} className="size-3 rounded-[3px]" style={{ background: `color-mix(in oklch, var(--color-s1) ${p}%, var(--t-painel-2))` }} />
        ))}
        Mais
      </div>
    </div>
  );
}

export { Legenda };
