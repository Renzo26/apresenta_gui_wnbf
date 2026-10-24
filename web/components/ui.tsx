"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type TipoSelo = "dado" | "calculo" | "hipotese";

export const SELOS: Record<TipoSelo, { rotulo: string; texto: string; cor: string; fundo: string }> = {
  dado: { rotulo: "Dado", texto: "Informado pelo cliente.", cor: "var(--dado)", fundo: "var(--dado-soft)" },
  calculo: { rotulo: "Cálculo", texto: "Derivado dos dados.", cor: "var(--calculo)", fundo: "var(--calculo-soft)" },
  hipotese: {
    rotulo: "Hipótese",
    texto: "Precisa ser confirmada com campanha real.",
    cor: "var(--hipotese)",
    fundo: "var(--hipotese-soft)",
  },
};

const formas: Record<TipoSelo, ReactNode> = {
  // forma + cor: o selo continua legível sem enxergar a cor
  dado: <circle cx="5" cy="5" r="4" fill="currentColor" />,
  calculo: <rect x="1" y="1" width="8" height="8" rx="1.5" fill="currentColor" />,
  hipotese: <path d="M5 0.8 9.2 5 5 9.2 0.8 5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />,
};

export function Selo({ tipo, grande = false }: { tipo: TipoSelo; grande?: boolean }) {
  const s = SELOS[tipo];
  return (
    <span
      title={`${s.rotulo}: ${s.texto}`}
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-mono font-medium uppercase tracking-[0.12em] ${
        grande ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]"
      }`}
      style={{ color: s.cor, background: s.fundo }}
    >
      <svg width={grande ? 10 : 8} height={grande ? 10 : 8} viewBox="0 0 10 10" aria-hidden>
        {formas[tipo]}
      </svg>
      {s.rotulo}
    </span>
  );
}

/** Rótulo pequeno + valor grande + selo. */
export function Numero({
  rotulo,
  valor,
  selo,
  detalhe,
  destaque = false,
}: {
  rotulo: string;
  valor: ReactNode;
  selo: TipoSelo;
  detalhe?: ReactNode;
  destaque?: boolean;
}) {
  return (
    <div data-reveal className="flex flex-col gap-2 border-t border-line pt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-ink-2">{rotulo}</span>
        <Selo tipo={selo} />
      </div>
      <span className={`num text-4xl leading-none md:text-5xl ${destaque ? "text-accent" : "text-ink"}`}>{valor}</span>
      {detalhe && <span className="text-sm leading-snug text-muted">{detalhe}</span>}
    </div>
  );
}

/** Explica um termo de marketing na primeira vez que ele aparece. */
export function Termo({ sigla, children }: { sigla: string; children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-baseline gap-3 rounded-xl border border-dashed border-line bg-card/70 px-4 py-3"
    >
      <span className="num text-sm font-semibold text-accent">{sigla}</span>
      <span className="text-sm leading-snug text-ink-2">{children}</span>
    </motion.div>
  );
}

export function Nota({ children, tom = "neutro" }: { children: ReactNode; tom?: "neutro" | "alerta" }) {
  return (
    <p
      data-reveal
      className={`max-w-prose border-l-2 pl-4 text-sm leading-relaxed ${
        tom === "alerta" ? "border-accent text-ink-2" : "border-line text-muted"
      }`}
    >
      {children}
    </p>
  );
}

export function Luz({ cor, tamanho = 14 }: { cor: "verde" | "amarelo" | "vermelho"; tamanho?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{
        width: tamanho,
        height: tamanho,
        background: `var(--${cor})`,
        boxShadow: `0 0 0 3px color-mix(in srgb, var(--${cor}) 18%, transparent)`,
      }}
    />
  );
}
