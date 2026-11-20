"use client";

import { useMemo, useState } from "react";
import { BarrasH } from "@/components/graficos/simples";
import { usePainel } from "@/components/providers";
import { Cabecalho } from "@/components/shell";
import { Revelar, Segmentado } from "@/components/ui/base";
import { Painel, Tabela, type Coluna } from "@/components/ui/painel";
import { PAGINAS, type Campanha, type Conjunto } from "@/lib/dados";
import { agrupar, derivados, fmt, somar, type Derivados, type Totais } from "@/lib/metricas";
import { cn, SERIES } from "@/lib/utils";

type Linha = { id: string; nome: string; t: Totais; d: Derivados; campanha: Campanha; conjunto?: Conjunto; ativa: boolean };

/** Colunas de desempenho comuns a campanhas e conjuntos. */
function colunasDesempenho(): Coluna<Linha>[] {
  return [
    { chave: "inv", nome: "Investimento", alinhar: "dir", valor: (l) => l.t.investimento, render: (l) => fmt.brl0(l.t.investimento) },
    { chave: "ctr", nome: "CTR", alinhar: "dir", valor: (l) => l.d.ctr, render: (l) => fmt.pct(l.d.ctr, 2), melhor: "maior" },
    { chave: "cpc", nome: "CPC", alinhar: "dir", valor: (l) => l.d.cpc, render: (l) => fmt.brl(l.d.cpc), melhor: "menor" },
    { chave: "leads", nome: "Leads", alinhar: "dir", valor: (l) => l.t.leads, render: (l) => fmt.int(l.t.leads) },
    { chave: "cpl", nome: "CPL", alinhar: "dir", valor: (l) => l.d.cpl, render: (l) => fmt.brl(l.d.cpl), melhor: "menor" },
    { chave: "conv", nome: "Conversas", alinhar: "dir", valor: (l) => l.t.conversas, render: (l) => fmt.int(l.t.conversas) },
    { chave: "cconv", nome: "R$/conversa", alinhar: "dir", valor: (l) => l.d.custoConversa, render: (l) => fmt.brl(l.d.custoConversa), melhor: "menor" },
    { chave: "vendas", nome: "Vendas", alinhar: "dir", valor: (l) => l.t.vendas, render: (l) => fmt.int(l.t.vendas) },
    { chave: "cac", nome: "CAC", alinhar: "dir", valor: (l) => l.d.cac, render: (l) => fmt.brl0(l.d.cac), melhor: "menor" },
    { chave: "fat", nome: "Faturamento", alinhar: "dir", valor: (l) => l.t.faturamento, render: (l) => fmt.brl0(l.t.faturamento) },
    { chave: "roas", nome: "ROAS", alinhar: "dir", valor: (l) => l.d.roas, render: (l) => fmt.x(l.d.roas), melhor: "maior" },
  ];
}

function Status({ ativa }: { ativa: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.12em]", ativa ? "bg-ok/12 text-ok" : "bg-painel-2 text-apagado")}>
      <span className={cn("size-1.5 rounded-full", ativa ? "bg-ok" : "bg-apagado")} />
      {ativa ? "Ativa" : "Pausada"}
    </span>
  );
}

type Ranking = "roas" | "cac" | "cpl" | "custoConversa";
const RANKINGS: { valor: Ranking; nome: string; formato: (v: number | null) => string; melhor: "maior" | "menor" }[] = [
  { valor: "roas", nome: "ROAS", formato: fmt.x, melhor: "maior" },
  { valor: "cac", nome: "CAC", formato: fmt.brl0, melhor: "menor" },
  { valor: "custoConversa", nome: "R$/conversa", formato: fmt.brl, melhor: "menor" },
  { valor: "cpl", nome: "CPL", formato: fmt.brl, melhor: "menor" },
];

export function Campanhas() {
  const { dados, atual, periodo } = usePainel();
  const [ranking, setRanking] = useState<Ranking>("roas");

  const { campanhas, conjuntos, temperaturas } = useMemo(() => {
    const doCriativo = new Map(dados.criativos.map((c) => [c.id, c]));
    const porCampanha = agrupar(atual.anuncios, (l) => doCriativo.get(l.criativoId)!.campanhaId);
    const porConjunto = agrupar(atual.anuncios, (l) => doCriativo.get(l.criativoId)!.conjuntoId);
    const ativa = (c: Campanha) => !c.fim || c.fim >= periodo.fim;
    const campanhas: Linha[] = dados.campanhas
      .filter((c) => porCampanha.has(c.id))
      .map((c) => {
        const t = somar(porCampanha.get(c.id)!);
        return { id: c.id, nome: c.nome, t, d: derivados(t), campanha: c, ativa: ativa(c) };
      });
    const conjuntos: Linha[] = dados.conjuntos
      .filter((a) => porConjunto.has(a.id))
      .map((a) => {
        const c = dados.campanhas.find((x) => x.id === a.campanhaId)!;
        const t = somar(porConjunto.get(a.id)!);
        return { id: a.id, nome: a.nome, t, d: derivados(t), campanha: c, conjunto: a, ativa: ativa(c) };
      });
    const temperaturas = (["Frio", "Quente"] as const).map((temp) => {
      const t = somar(campanhas.filter((c) => c.campanha.temperatura === temp).flatMap((c) => porCampanha.get(c.id)!));
      return { temp, t, d: derivados(t) };
    });
    return { campanhas, conjuntos, temperaturas };
  }, [dados, atual, periodo]);

  const r = RANKINGS.find((x) => x.valor === ranking)!;
  const ordenadas = [...campanhas]
    .filter((c) => c.d[ranking] != null)
    .sort((a, b) => (r.melhor === "maior" ? (b.d[ranking] ?? 0) - (a.d[ranking] ?? 0) : (a.d[ranking] ?? 0) - (b.d[ranking] ?? 0)));
  const investimentoTotal = campanhas.reduce((s, c) => s + c.t.investimento, 0);

  const colCampanha: Coluna<Linha> = {
    chave: "nome",
    nome: "Campanha",
    valor: (l) => l.nome,
    render: (l) => (
      <span className="flex flex-col gap-1">
        <span className="max-w-64 truncate">{l.nome}</span>
        <span className="flex items-center gap-1.5 text-[0.66rem] font-medium text-apagado">
          <Status ativa={l.ativa} /> {l.campanha.objetivo} · {PAGINAS[l.campanha.pagina]} · {l.campanha.temperatura}
        </span>
      </span>
    ),
  };

  return (
    <Revelar>
      <Cabecalho
        indice="02"
        titulo="Campanhas e"
        acento="conjuntos"
        descricao="Cada campanha da Meta com o resultado que importa: conversas no WhatsApp, vendas fechadas e retorno. A coroa marca a melhor de cada coluna."
      />

      <Painel titulo="Campanhas" subtitulo="Clique no cabeçalho para ordenar. ROAS e CAC usam as vendas do CRM.">
        <Tabela chave={(l) => l.id} colunas={[colCampanha, ...colunasDesempenho()]} linhas={campanhas} ordemInicial={{ chave: "inv", dir: "desc" }} />
      </Painel>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel
          className="lg:col-span-7"
          titulo="Ranking"
          subtitulo={r.melhor === "maior" ? "Maior é melhor." : "Menor é melhor."}
          acoes={<Segmentado rotulo="Métrica do ranking" tamanho="sm" valor={ranking} aoMudar={setRanking} opcoes={RANKINGS.map((x) => ({ valor: x.valor, nome: x.nome }))} />}
        >
          <BarrasH
            key={ranking}
            rotulo={`Campanhas por ${r.nome}`}
            formato={r.formato}
            itens={ordenadas.map((c) => ({
              chave: c.id,
              nome: c.nome,
              valor: c.d[ranking],
              detalhe: [
                { nome: "Investimento", valor: fmt.brl0(c.t.investimento) },
                { nome: "Vendas", valor: fmt.int(c.t.vendas) },
                { nome: "Faturamento", valor: fmt.brl0(c.t.faturamento) },
              ],
            }))}
          />
        </Painel>

        <Painel className="lg:col-span-5" titulo="Para onde vai a verba" subtitulo="Parte do investimento do período em cada campanha.">
          <BarrasH
            rotulo="Investimento por campanha"
            formato={(v) => fmt.pct(v, 0)}
            cor={SERIES[1]}
            itens={[...campanhas]
              .sort((a, b) => b.t.investimento - a.t.investimento)
              .map((c) => ({
                chave: c.id,
                nome: c.nome,
                valor: investimentoTotal ? (c.t.investimento / investimentoTotal) * 100 : 0,
                nota: fmt.brl0(c.t.investimento),
              }))}
          />
        </Painel>
      </div>

      <Painel className="mt-4" titulo="Público frio × quente" subtitulo="Frio = quem ainda não conhece. Quente = remarketing (visitou a página ou já conversou).">
        <div className="grid gap-4 md:grid-cols-2">
          {temperaturas.map(({ temp, t, d }, i) => (
            <div key={temp} className="rounded-2xl border border-linha/70 bg-painel-2/40 p-5">
              <div className="flex items-center gap-2">
                <span className="serie-marca size-2.5 rounded-[3px]" style={{ background: SERIES[i === 0 ? 0 : 3] }} />
                <h3 className="font-display text-2xl uppercase leading-none">{temp}</h3>
                <span className="ml-auto text-xs text-apagado tabular">{fmt.pct(investimentoTotal ? (t.investimento / investimentoTotal) * 100 : 0, 0)} da verba</span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
                {[
                  ["CPM", fmt.brl(d.cpm)],
                  ["CTR", fmt.pct(d.ctr, 2)],
                  ["R$/conversa", fmt.brl(d.custoConversa)],
                  ["Fechamento", fmt.pct(d.taxaFechamento)],
                  ["CAC", fmt.brl0(d.cac)],
                  ["ROAS", fmt.x(d.roas)],
                ].map(([k, val]) => (
                  <div key={k}>
                    <dt className="text-apagado">{k}</dt>
                    <dd className="mt-0.5 font-display text-xl leading-none text-texto tabular">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Painel>

      <Painel className="mt-4" titulo="Conjuntos de anúncios" subtitulo="Os públicos de cada campanha.">
        <Tabela
          chave={(l) => l.id}
          linhas={conjuntos}
          ordemInicial={{ chave: "inv", dir: "desc" }}
          colunas={[
            {
              chave: "nome",
              nome: "Conjunto",
              valor: (l) => l.nome,
              render: (l) => (
                <span className="flex flex-col gap-0.5">
                  <span>{l.nome}</span>
                  <span className="text-[0.66rem] font-medium text-apagado">{l.campanha.nome}</span>
                </span>
              ),
            },
            { chave: "freq", nome: "Freq.", alinhar: "dir", valor: (l) => l.d.frequencia, render: (l) => fmt.num(l.d.frequencia) },
            ...colunasDesempenho(),
          ]}
        />
      </Painel>
    </Revelar>
  );
}
