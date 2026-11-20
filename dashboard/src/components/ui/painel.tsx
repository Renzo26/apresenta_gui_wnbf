"use client";

import { ArrowDown, ArrowUp, ChartNoAxesColumn, Crown, Table2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Coluna<T> = {
  chave: string;
  nome: string;
  valor?: (l: T) => number | string | null;
  render?: (l: T) => ReactNode;
  alinhar?: "esq" | "dir";
  /** Destaca a melhor linha desta coluna. */
  melhor?: "maior" | "menor";
  largura?: string;
};

/**
 * Card dos gráficos. Quando recebe `tabela`, ganha o botão Gráfico/Tabela:
 * todo gráfico tem a mesma informação também em tabela (acessibilidade e conferência).
 */
export function Painel<T>({
  titulo,
  subtitulo,
  acoes,
  children,
  tabela,
  className,
  corpoClassName,
}: {
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acoes?: ReactNode;
  children: ReactNode;
  tabela?: { colunas: Coluna<T>[]; linhas: T[]; chave: (l: T) => string };
  className?: string;
  corpoClassName?: string;
}) {
  const [verTabela, setVerTabela] = useState(false);
  return (
    <section data-revelar className={cn("grain flex min-w-0 flex-col rounded-[1.75rem] border border-linha bg-painel p-5 sm:p-6", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl uppercase leading-none tracking-wide text-texto sm:text-[1.4rem]">{titulo}</h2>
          {subtitulo && <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-apagado">{subtitulo}</p>}
        </div>
        <div className="flex items-center gap-2">
          {acoes}
          {tabela && (
            <button
              type="button"
              onClick={() => setVerTabela(!verTabela)}
              aria-pressed={verTabela}
              title={verTabela ? "Ver gráfico" : "Ver em tabela"}
              aria-label={verTabela ? "Ver gráfico" : "Ver em tabela"}
              className="grid size-8 place-items-center rounded-full border border-linha text-apagado transition-colors hover:border-indigo-claro hover:text-texto"
            >
              {verTabela ? <ChartNoAxesColumn className="size-3.5" /> : <Table2 className="size-3.5" />}
            </button>
          )}
        </div>
      </header>
      <div className={cn("mt-5 min-w-0 flex-1", corpoClassName)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={verTabela ? "t" : "g"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {verTabela && tabela ? <Tabela {...tabela} compacta /> : children}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Tabela ordenável: clique no cabeçalho ordena; a melhor linha da coluna marcada ganha a coroa. */
export function Tabela<T>({
  colunas,
  linhas,
  chave,
  ordemInicial,
  aoClicar,
  compacta = false,
  vazio = "Sem dados no período.",
}: {
  colunas: Coluna<T>[];
  linhas: T[];
  chave: (l: T) => string;
  ordemInicial?: { chave: string; dir: "asc" | "desc" };
  aoClicar?: (l: T) => void;
  compacta?: boolean;
  vazio?: string;
}) {
  const [ordem, setOrdem] = useState(ordemInicial ?? null);

  const ordenadas = useMemo(() => {
    if (!ordem) return linhas;
    const col = colunas.find((c) => c.chave === ordem.chave);
    if (!col?.valor) return linhas;
    return [...linhas].sort((a, b) => {
      const va = col.valor!(a);
      const vb = col.valor!(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "pt-BR");
      return ordem.dir === "asc" ? r : -r;
    });
  }, [linhas, colunas, ordem]);

  const melhores = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of colunas) {
      if (!c.melhor || !c.valor) continue;
      let alvo: T | null = null;
      let melhor: number | null = null;
      for (const l of linhas) {
        const v = c.valor(l);
        if (typeof v !== "number" || !isFinite(v)) continue;
        if (melhor == null || (c.melhor === "maior" ? v > melhor : v < melhor)) {
          melhor = v;
          alvo = l;
        }
      }
      if (alvo && linhas.length > 1) m.set(c.chave, chave(alvo));
    }
    return m;
  }, [colunas, linhas, chave]);

  if (linhas.length === 0) return <p className="py-10 text-center text-sm text-apagado">{vazio}</p>;

  return (
    <div className="-mx-1 overflow-x-auto px-1 rolagem" data-lenis-prevent>
      <table className={cn("w-full border-separate border-spacing-0 text-left", compacta ? "text-xs" : "text-[0.8rem]")}>
        <thead>
          <tr>
            {colunas.map((c, i) => {
              const ativa = ordem?.chave === c.chave;
              return (
                <th
                  key={c.chave}
                  scope="col"
                  aria-sort={ativa ? (ordem!.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn(
                    "whitespace-nowrap border-b border-linha pb-2.5 font-semibold text-apagado",
                    c.alinhar === "dir" ? "text-right" : "text-left",
                    i === 0 && "sticky left-0 z-10 bg-painel pr-4",
                    i > 0 && "px-3",
                    c.largura,
                  )}
                >
                  {c.valor ? (
                    <button
                      type="button"
                      onClick={() => setOrdem({ chave: c.chave, dir: ativa && ordem!.dir === "desc" ? "asc" : "desc" })}
                      className={cn("inline-flex items-center gap-1 hover:text-texto", ativa && "text-texto")}
                    >
                      {c.nome}
                      {ativa && (ordem!.dir === "desc" ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />)}
                    </button>
                  ) : (
                    c.nome
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ordenadas.map((l) => {
            const k = chave(l);
            return (
              <tr
                key={k}
                onClick={aoClicar ? () => aoClicar(l) : undefined}
                className={cn("group", aoClicar && "cursor-pointer")}
              >
                {colunas.map((c, i) => {
                  const destaque = melhores.get(c.chave) === k;
                  const v = c.valor?.(l);
                  return (
                    <td
                      key={c.chave}
                      className={cn(
                        "whitespace-nowrap border-b border-linha/60 transition-colors group-hover:bg-painel-2/70",
                        compacta ? "py-2" : "py-3",
                        c.alinhar === "dir" ? "text-right tabular" : "text-left",
                        i === 0 && "sticky left-0 z-10 bg-painel pr-4 font-semibold text-texto",
                        i > 0 && "px-3 text-suave",
                        destaque && "text-texto",
                      )}
                    >
                      <span className={cn("inline-flex items-center gap-1.5", destaque && "font-bold")}>
                        {destaque && <Crown className="size-3 text-bronze" aria-label="melhor da coluna" />}
                        {c.render ? c.render(l) : (v ?? "—")}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
