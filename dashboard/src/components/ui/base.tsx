"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Largura de um elemento (os gráficos desenham em pixels reais, sem esticar o SVG). */
export function useLargura<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/** Entrada dos blocos com o scroll (GSAP + ScrollTrigger), em lotes, como no site. */
export function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const itens = gsap.utils.toArray<HTMLElement>("[data-revelar]");
        gsap.set(itens, { y: 28, autoAlpha: 0 });
        ScrollTrigger.batch(itens, {
          start: "top 92%",
          once: true,
          onEnter: (lote) => gsap.to(lote, { y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.06, overwrite: true }),
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Número que corre até o valor novo quando o filtro muda (Motion). */
export function Numero({ valor, formato, className }: { valor: number | null; formato: (v: number | null) => string; className?: string }) {
  const reduzir = useReducedMotion();
  const mv = useMotionValue(valor ?? 0);
  const [texto, setTexto] = useState(formato(valor));
  useMotionValueEvent(mv, "change", (v) => setTexto(formato(v)));
  useEffect(() => {
    if (valor == null) return;
    if (reduzir) {
      mv.set(valor); // o evento "change" atualiza o texto
      return;
    }
    const a = animate(mv, valor, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [valor, formato, mv, reduzir]);
  return <span className={cn("tabular", className)}>{valor == null ? formato(null) : texto}</span>;
}

/**
 * Variação contra o período anterior. Cor de status + seta + sinal (nunca só a cor).
 * `inverso`: quando subir é ruim (custos).
 */
export function Delta({ valor, inverso = false, className }: { valor: number | null; inverso?: boolean; className?: string }) {
  if (valor == null || !isFinite(valor)) return null;
  const neutro = Math.abs(valor) < 0.5;
  const bom = neutro ? null : inverso ? valor < 0 : valor > 0;
  const Icone = neutro ? Minus : valor > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      title="Comparado ao período anterior de mesmo tamanho"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold tabular",
        bom == null ? "bg-painel-2 text-suave" : bom ? "bg-ok/12 text-ok" : "bg-erro/12 text-erro",
        className,
      )}
    >
      <Icone className="size-3" strokeWidth={2.6} aria-hidden />
      {valor > 0 ? "+" : valor < 0 ? "−" : ""}
      {Math.abs(valor).toFixed(1).replace(".", ",")}%
    </span>
  );
}

/** Controle segmentado com a pílula deslizando entre as opções (Motion layoutId). */
export function Segmentado<T extends string>({
  opcoes,
  valor,
  aoMudar,
  rotulo,
  tamanho = "md",
}: {
  opcoes: { valor: T; nome: ReactNode }[];
  valor: T;
  aoMudar: (v: T) => void;
  rotulo: string;
  tamanho?: "sm" | "md";
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={rotulo} className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-linha bg-painel p-1 rolagem">
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => aoMudar(o.valor)}
            className={cn(
              "relative shrink-0 whitespace-nowrap rounded-full font-semibold transition-colors",
              tamanho === "sm" ? "px-2.5 py-1 text-[0.7rem]" : "px-3.5 py-1.5 text-xs",
              ativo ? "text-texto" : "text-apagado hover:text-suave",
            )}
          >
            {ativo && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-painel-2 shadow-[inset_0_0_0_1px_var(--t-linha)]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{o.nome}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Rótulo pequeno em caixa alta com numeração, como os "eyebrows" do site. */
export function Rotulo({ indice, children, className }: { indice?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-apagado", className)}>
      {indice && <span className="text-bronze">{indice}</span>}
      {indice && <span className="h-px w-5 bg-linha" />}
      {children}
    </p>
  );
}

/** Legenda das séries: marca colorida + nome em cor de texto. */
export function Legenda({ itens, className }: { itens: { nome: string; cor: string; tracejado?: boolean }[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-suave", className)}>
      {itens.map((i) => (
        <li key={i.nome} className="flex items-center gap-1.5">
          <span
            className="serie-marca inline-block h-2.5 w-2.5 rounded-[3px]"
            style={{ background: i.tracejado ? "transparent" : i.cor, boxShadow: i.tracejado ? `inset 0 0 0 1.5px ${i.cor}` : undefined }}
          />
          {i.nome}
        </li>
      ))}
    </ul>
  );
}

/** Caixa do tooltip dos gráficos (posicionada pelo gráfico). */
export function Dica({ x, y, largura, children }: { x: number; y: number; largura: number; children: ReactNode }) {
  const esquerda = x > largura / 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14 }}
      className="pointer-events-none absolute z-20 min-w-36 rounded-xl border border-linha bg-painel/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur"
      style={{ top: y, ...(esquerda ? { right: largura - x + 12 } : { left: x + 12 }) }}
    >
      {children}
    </motion.div>
  );
}

export function LinhaDica({ cor, nome, valor }: { cor?: string; nome: string; valor: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      {cor && <span className="serie-marca size-2 shrink-0 rounded-[2px]" style={{ background: cor }} />}
      <span className="flex-1 text-suave">{nome}</span>
      <span className="font-semibold text-texto tabular">{valor}</span>
    </div>
  );
}
