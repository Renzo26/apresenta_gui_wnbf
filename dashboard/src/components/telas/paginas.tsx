"use client";

import { useMemo } from "react";
import { GraficoLinhas } from "@/components/graficos/linhas";
import { BarrasH } from "@/components/graficos/simples";
import { usePainel } from "@/components/providers";
import { Cabecalho } from "@/components/shell";
import { Numero, Revelar } from "@/components/ui/base";
import { Painel } from "@/components/ui/painel";
import { PAGINAS, type PaginaId } from "@/lib/dados";
import { agrupar, derivados, fmt, porDia, somar } from "@/lib/metricas";
import { SERIES } from "@/lib/utils";

const CAMINHO: Record<PaginaId, string> = { black: "/black", site: "/", planilhas: "/planilhas" };
const COR: Record<PaginaId, string> = { black: SERIES[0], site: SERIES[1], planilhas: SERIES[2] };

export function Paginas() {
  const { dados, atual, filtros } = usePainel();

  const paginas = useMemo(() => {
    const doCriativo = new Map(dados.criativos.map((c) => [c.id, c.campanhaId]));
    const daCampanha = new Map(dados.campanhas.map((c) => [c.id, c.pagina]));
    const pagDe = (criativoId: string) => daCampanha.get(doCriativo.get(criativoId)!)!;
    const ads = agrupar(atual.anuncios, (l) => pagDe(l.criativoId));
    const org = agrupar(
      atual.organico.filter((l) => l.pagina),
      (l) => l.pagina!,
    );
    return (Object.keys(PAGINAS) as PaginaId[])
      .filter((p) => !filtros.pagina || filtros.pagina === p)
      .map((p) => {
        const a = somar(ads.get(p) ?? []);
        const o = somar(org.get(p) ?? []);
        const t = somar([...(ads.get(p) ?? []), ...(org.get(p) ?? [])]);
        const serie = porDia([...(ads.get(p) ?? []), ...(org.get(p) ?? [])], atual.dias);
        return {
          p,
          ads: a,
          org: o,
          t,
          d: derivados(a),
          serie,
          // página → WhatsApp: quem chegou na página e abriu conversa
          paraWhats: t.sessoes ? (t.conversas / t.sessoes) * 100 : null,
          taxaLead: t.sessoes ? (t.leads / t.sessoes) * 100 : null,
          taxaVenda: t.sessoes ? (t.vendas / t.sessoes) * 100 : null,
        };
      });
  }, [dados, atual, filtros.pagina]);

  const pontos = atual.dias.map((data, i) => ({ data, ...Object.fromEntries(paginas.map((x) => [x.p, x.serie[i].sessoes])) }));

  return (
    <Revelar>
      <Cabecalho
        indice="04"
        titulo="Páginas de"
        acento="destino"
        descricao="O que acontece depois do clique: quantos carregaram a página, preencheram o formulário e chamaram no WhatsApp. Soma anúncio e bio do Instagram."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {paginas.map((x) => (
          <article key={x.p} data-revelar className="grain overflow-hidden rounded-[1.75rem] border border-linha bg-painel">
            {/* moldura de navegador com o endereço da página */}
            <div className="flex items-center gap-2 border-b border-linha bg-painel-2/60 px-4 py-2.5">
              <span className="flex gap-1" aria-hidden>
                <span className="size-2 rounded-full bg-linha" />
                <span className="size-2 rounded-full bg-linha" />
                <span className="size-2 rounded-full bg-linha" />
              </span>
              <span className="ml-2 truncate rounded-full bg-fundo px-3 py-1 text-[0.68rem] text-suave">delamadridteam.com{CAMINHO[x.p]}</span>
              <span className="serie-marca ml-auto size-2.5 shrink-0 rounded-[3px]" style={{ background: COR[x.p] }} />
            </div>
            <div className="p-5">
              <h2 className="font-display text-2xl uppercase leading-none">{PAGINAS[x.p]}</h2>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-apagado">Sessões</p>
                  <Numero valor={x.t.sessoes} formato={fmt.int} className="font-display text-4xl leading-none" />
                </div>
                <div className="text-right">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-apagado">Faturamento</p>
                  <Numero valor={x.t.faturamento} formato={fmt.brlCurto} className="font-display text-2xl leading-none text-bronze" />
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-linha pt-4 text-xs">
                {[
                  ["Connect rate", fmt.pct(x.d.connectRate)],
                  ["Viraram lead", fmt.pct(x.taxaLead)],
                  ["Foram ao WhatsApp", fmt.pct(x.paraWhats)],
                  ["Leads", fmt.int(x.t.leads)],
                  ["Conversas", fmt.int(x.t.conversas)],
                  ["Vendas", fmt.int(x.t.vendas)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-apagado">{k}</dt>
                    <dd className="mt-0.5 font-semibold text-texto tabular">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[0.7rem] text-apagado">
                {fmt.pct(x.t.sessoes ? (x.org.sessoes / x.t.sessoes) * 100 : 0, 0)} das sessões vieram da bio do Instagram.
              </p>
            </div>
          </article>
        ))}
      </div>

      <Painel
        className="mt-4"
        titulo="Sessões por dia"
        subtitulo="Visitas que carregaram a página (anúncio + bio)."
        tabela={{
          chave: (l) => l.data,
          colunas: [
            { chave: "data", nome: "Dia", valor: (l) => l.data as string, render: (l) => fmt.dia(l.data as string) },
            ...paginas.map((x) => ({ chave: x.p, nome: PAGINAS[x.p], alinhar: "dir" as const, valor: (l: (typeof pontos)[number]) => Number((l as Record<string, unknown>)[x.p] ?? 0) })),
          ],
          linhas: pontos,
        }}
      >
        <GraficoLinhas
          rotulo="Sessões por dia e página"
          pontos={pontos}
          formato={fmt.int}
          formatoEixo={fmt.curto}
          inteiros
          series={paginas.map((x) => ({ chave: x.p, nome: PAGINAS[x.p], cor: COR[x.p] }))}
        />
      </Painel>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Painel titulo="Connect rate" subtitulo="Cliques no anúncio que carregaram a página. Abaixo de 70%: página lenta ou link com problema.">
          <BarrasH rotulo="Connect rate por página" formato={(v) => fmt.pct(v)} itens={paginas.map((x) => ({ chave: x.p, nome: PAGINAS[x.p], valor: x.d.connectRate, cor: COR[x.p] }))} />
        </Painel>
        <Painel titulo="Página → WhatsApp" subtitulo="Sessões que terminaram numa conversa no WhatsApp.">
          <BarrasH rotulo="Taxa de ida ao WhatsApp por página" formato={(v) => fmt.pct(v)} itens={paginas.map((x) => ({ chave: x.p, nome: PAGINAS[x.p], valor: x.paraWhats, cor: COR[x.p] }))} />
        </Painel>
        <Painel titulo="Página → venda" subtitulo="Sessões que viraram venda (checkout ou WhatsApp).">
          <BarrasH rotulo="Taxa de venda por página" formato={(v) => fmt.pct(v, 2)} itens={paginas.map((x) => ({ chave: x.p, nome: PAGINAS[x.p], valor: x.taxaVenda, cor: COR[x.p] }))} />
        </Painel>
      </div>
    </Revelar>
  );
}
