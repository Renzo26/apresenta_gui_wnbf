"use client";

import { Crown, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { GraficoLinhas } from "@/components/graficos/linhas";
import { BarrasH } from "@/components/graficos/simples";
import { usePainel } from "@/components/providers";
import { ImagemCriativo } from "@/components/ui/imagem-criativo";
import { Cabecalho } from "@/components/shell";
import { Revelar, Segmentado } from "@/components/ui/base";
import { Painel, Tabela } from "@/components/ui/painel";
import type { Criativo, Formato } from "@/lib/dados";
import { agrupar, derivados, fmt, porDia, somar, type Derivados, type Totais } from "@/lib/metricas";
import { cn, SERIES } from "@/lib/utils";

type Item = { c: Criativo; campanha: string; t: Totais; d: Derivados };
type Ordem = "roas" | "custoConversa" | "ctr" | "hookRate" | "investimento";
const ORDENS: { valor: Ordem; nome: string; melhor: "maior" | "menor"; formato: (v: number | null) => string }[] = [
  { valor: "roas", nome: "ROAS", melhor: "maior", formato: fmt.x },
  { valor: "custoConversa", nome: "R$/conversa", melhor: "menor", formato: fmt.brl },
  { valor: "ctr", nome: "CTR", melhor: "maior", formato: (v) => fmt.pct(v, 2) },
  { valor: "hookRate", nome: "Hook rate", melhor: "maior", formato: (v) => fmt.pct(v) },
  { valor: "investimento", nome: "Investimento", melhor: "maior", formato: fmt.brl0 },
];

const valorDe = (i: Item, o: Ordem) => (o === "investimento" ? i.t.investimento : i.d[o]);

export function Criativos() {
  const { dados, atual } = usePainel();
  const [ordem, setOrdem] = useState<Ordem>("roas");
  const [aberto, setAberto] = useState<Item | null>(null);

  const itens = useMemo(() => {
    const por = agrupar(atual.anuncios, (l) => l.criativoId);
    return dados.criativos
      .filter((c) => por.has(c.id))
      .map((c) => {
        const t = somar(por.get(c.id)!);
        return { c, campanha: dados.campanhas.find((x) => x.id === c.campanhaId)!.nome, t, d: derivados(t) };
      });
  }, [dados, atual]);

  const o = ORDENS.find((x) => x.valor === ordem)!;
  const ordenados = [...itens].sort((a, b) => {
    const va = valorDe(a, ordem);
    const vb = valorDe(b, ordem);
    if (va == null) return 1;
    if (vb == null) return -1;
    return o.melhor === "maior" ? vb - va : va - vb;
  });

  const formatos = useMemo(() => {
    const g = agrupar(itens, (i) => i.c.formato);
    return (["Reels", "Vídeo", "Carrossel", "Imagem"] as Formato[])
      .filter((f) => g.has(f))
      .map((f) => {
        const t = somar(atual.anuncios.filter((l) => g.get(f)!.some((i) => i.c.id === l.criativoId)));
        return { f, t, d: derivados(t) };
      });
  }, [itens, atual]);

  return (
    <Revelar>
      <Cabecalho
        indice="03"
        titulo="Criativos que"
        acento="vendem"
        descricao="Os anúncios lado a lado, com o que cada um gerou de conversa e venda. Clique num criativo para ver o texto, as métricas e a evolução por dia."
      />

      <div data-revelar className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Segmentado rotulo="Ordenar criativos por" valor={ordem} aoMudar={setOrdem} opcoes={ORDENS.map((x) => ({ valor: x.valor, nome: x.nome }))} />
        <p className="text-xs text-apagado">
          {itens.length} criativos com veiculação no período · {o.melhor === "maior" ? "maior" : "menor"} {o.nome} primeiro
        </p>
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {ordenados.map((it, pos) => (
            <motion.li
              key={it.c.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <button
                type="button"
                onClick={() => setAberto(it)}
                className="group grain flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] border border-linha bg-painel text-left transition-colors hover:border-indigo-claro focus-visible:border-indigo-claro focus-visible:outline-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-painel-2">
                  <ImagemCriativo
                    imagem={it.c.imagem}
                    alt=""
                    sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/85 via-[#0b0b0c]/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#0b0b0c]/70 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#f2efe8] backdrop-blur">
                    {it.c.formato}
                  </span>
                  {(it.c.formato === "Vídeo" || it.c.formato === "Reels") && (
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#f2efe8]/90 text-[#0b0b0c]">
                      <Play className="size-3.5 fill-current" />
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 font-display text-3xl leading-none text-[#f2efe8]">
                    {pos === 0 && <Crown className="size-5 text-ouro" aria-label="melhor" />}#{pos + 1}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-ouro px-2.5 py-1 text-xs font-extrabold text-[#12131c] tabular">
                    {o.formato(valorDe(it, ordem))}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="truncate text-sm font-bold text-texto">{it.c.nome}</p>
                  <p className="mt-0.5 truncate text-[0.7rem] text-apagado">{it.campanha}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-[0.7rem]">
                    {[
                      ["Invest.", fmt.brlCurto(it.t.investimento)],
                      ["Conversas", fmt.int(it.t.conversas)],
                      ["Vendas", fmt.int(it.t.vendas)],
                      ["CTR", fmt.pct(it.d.ctr, 2)],
                      ["R$/conv.", fmt.brl0(it.d.custoConversa)],
                      ["ROAS", fmt.x(it.d.roas)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-apagado">{k}</dt>
                        <dd className="font-semibold text-texto tabular">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel className="lg:col-span-5" titulo="Formatos" subtitulo="CTR médio de cada formato no período.">
          <BarrasH
            rotulo="CTR por formato"
            formato={(v) => fmt.pct(v, 2)}
            itens={formatos.map(({ f, t, d }) => ({
              chave: f,
              nome: f,
              valor: d.ctr,
              nota: `${fmt.brlCurto(t.investimento)} investidos · ${fmt.int(t.vendas)} vendas`,
            }))}
          />
        </Painel>
        <Painel className="lg:col-span-7" titulo="Vídeos: retenção" subtitulo="Hook rate = viram 3 segundos. ThruPlay = viram até o fim (ou 15s).">
          <Tabela
            compacta
            chave={(i) => i.c.id}
            linhas={itens.filter((i) => i.t.video3s > 0)}
            ordemInicial={{ chave: "hook", dir: "desc" }}
            colunas={[
              { chave: "nome", nome: "Vídeo", valor: (i) => i.c.nome },
              { chave: "hook", nome: "Hook rate", alinhar: "dir", valor: (i) => i.d.hookRate, render: (i) => fmt.pct(i.d.hookRate), melhor: "maior" },
              { chave: "thru", nome: "ThruPlay", alinhar: "dir", valor: (i) => i.d.thruplayRate, render: (i) => fmt.pct(i.d.thruplayRate), melhor: "maior" },
              { chave: "ctr", nome: "CTR", alinhar: "dir", valor: (i) => i.d.ctr, render: (i) => fmt.pct(i.d.ctr, 2) },
              { chave: "conv", nome: "Conversas", alinhar: "dir", valor: (i) => i.t.conversas },
            ]}
          />
        </Painel>
      </div>

      <Detalhe item={aberto} aoFechar={() => setAberto(null)} />
    </Revelar>
  );
}

/** Gaveta lateral com o criativo, o texto do anúncio e a evolução diária. */
function Detalhe({ item, aoFechar }: { item: Item | null; aoFechar: () => void }) {
  const { atual } = usePainel();
  useEffect(() => {
    if (!item) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [item, aoFechar]);

  const dia = useMemo(
    () => (item ? porDia(atual.anuncios.filter((l) => l.criativoId === item.c.id), atual.dias).filter((x) => x.investimento > 0) : []),
    [item, atual],
  );

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-[#0b0b0c]/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={item.c.nome}
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-linha bg-fundo rolagem"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            <div className="relative aspect-[4/3] bg-painel-2">
              <ImagemCriativo imagem={item.c.imagem} alt={`Criativo: ${item.c.nome}`} sizes="576px" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-transparent to-transparent" />
              <button
                type="button"
                onClick={aoFechar}
                autoFocus
                aria-label="Fechar"
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-[#0b0b0c]/70 text-[#f2efe8] backdrop-blur hover:bg-[#0b0b0c]"
              >
                <X className="size-4" />
              </button>
              <div className="absolute inset-x-5 bottom-5 text-[#f2efe8]">
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#f2efe8]/70">
                  {item.c.formato} · {item.campanha}
                </p>
                <h2 className="mt-1 font-display text-3xl uppercase leading-none">{item.c.nome}</h2>
              </div>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              {item.c.copy && (
                <blockquote className="rounded-2xl border border-linha bg-painel p-4 font-serif text-xl italic leading-snug text-texto">“{item.c.copy}”</blockquote>
              )}
              <dl className="grid grid-cols-3 gap-3">
                {[
                  ["Investimento", fmt.brl0(item.t.investimento)],
                  ["Impressões", fmt.curto(item.t.impressoes)],
                  ["CTR", fmt.pct(item.d.ctr, 2)],
                  ["Conversas", fmt.int(item.t.conversas)],
                  ["Vendas", fmt.int(item.t.vendas)],
                  ["ROAS", fmt.x(item.d.roas)],
                  ["CPC", fmt.brl(item.d.cpc)],
                  ["R$/conversa", fmt.brl(item.d.custoConversa)],
                  ["CAC", fmt.brl0(item.d.cac)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-linha/70 bg-painel p-3">
                    <dt className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-apagado">{k}</dt>
                    <dd className="mt-1.5 font-display text-xl leading-none text-texto tabular">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-[1.5rem] border border-linha bg-painel p-4">
                <h3 className="font-display text-lg uppercase">Por dia</h3>
                <p className="text-xs text-apagado">Conversas e vendas nos dias em que o anúncio rodou.</p>
                <div className="mt-3">
                  <GraficoLinhas
                    rotulo={`Conversas e vendas por dia: ${item.c.nome}`}
                    pontos={dia.map((x) => ({ data: x.data, conversas: x.conversas, vendas: x.vendas }))}
                    formato={fmt.int}
                    formatoEixo={fmt.curto}
                    inteiros
                    altura={190}
                    series={[
                      { chave: "conversas", nome: "Conversas", cor: SERIES[0], area: true },
                      { chave: "vendas", nome: "Vendas", cor: SERIES[1] },
                    ]}
                  />
                </div>
              </div>
              {item.c.link ? (
                <a href={item.c.link} target="_blank" rel="noopener noreferrer" className={cn("inline-block text-xs font-semibold text-indigo-claro hover:underline")}>
                  Ver a prévia do anúncio na Meta ↗
                </a>
              ) : (
                <p className="text-[0.7rem] text-apagado">Anúncio identificado pelas UTMs (utm_content). Com a Meta Ads conectada, aparecem a imagem e o link da prévia.</p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
