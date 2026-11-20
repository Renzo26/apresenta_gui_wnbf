"use client";

import type { ReactNode } from "react";
import { Sparkline } from "@/components/graficos/simples";
import { Delta, Numero } from "@/components/ui/base";
import { cn } from "@/lib/utils";

export function Kpi({
  rotulo,
  valor,
  formato,
  delta,
  inverso,
  serie,
  nota,
  className,
}: {
  rotulo: string;
  valor: number | null;
  formato: (v: number | null) => string;
  delta?: number | null;
  inverso?: boolean;
  serie?: number[];
  nota?: ReactNode;
  className?: string;
}) {
  return (
    <article data-revelar className={cn("grain flex min-w-0 flex-col rounded-[1.5rem] border border-linha bg-painel p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5">
        <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-apagado">{rotulo}</h3>
        {delta !== undefined && <Delta valor={delta} inverso={inverso} />}
      </div>
      <Numero valor={valor} formato={formato} className="mt-3 block whitespace-nowrap font-display text-[clamp(1.45rem,1.9vw,2.15rem)] leading-none text-texto" />
      {nota && <p className="mt-1.5 truncate text-[0.72rem] text-apagado">{nota}</p>}
      {serie && serie.length > 1 && (
        <div className="mt-auto pt-3">
          <Sparkline valores={serie} cor="var(--color-s1)" />
        </div>
      )}
    </article>
  );
}

/** Indicador pequeno (custos e taxas), sem gráfico. */
export function Indicador({
  rotulo,
  descricao,
  valor,
  formato,
  delta,
  inverso,
}: {
  rotulo: string;
  descricao: string;
  valor: number | null;
  formato: (v: number | null) => string;
  delta?: number | null;
  inverso?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-linha/70 bg-painel-2/40 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-texto">{rotulo}</p>
        {delta !== undefined && <Delta valor={delta} inverso={inverso} />}
      </div>
      <p className="mt-0.5 truncate text-[0.66rem] text-apagado" title={descricao}>
        {descricao}
      </p>
      <Numero valor={valor} formato={formato} className="mt-2 block font-display text-2xl leading-none text-texto" />
    </div>
  );
}
