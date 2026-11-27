"use client";

import { useMemo } from "react";
import { GraficoColunas } from "@/components/graficos/barras";
import { GraficoLinhas } from "@/components/graficos/linhas";
import { BarrasH, Funil, MapaCalor, Proporcao } from "@/components/graficos/simples";
import { usePainel } from "@/components/providers";
import { Cabecalho } from "@/components/shell";
import { Revelar } from "@/components/ui/base";
import { Kpi } from "@/components/ui/kpi";
import { Painel } from "@/components/ui/painel";
import { ORIGENS, PLANOS, precoNoDia, type Plano } from "@/lib/dados";
import { fmt, somar, variacao } from "@/lib/metricas";
import { SERIES } from "@/lib/utils";

const mediana = (v: number[]) => {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function Vendas() {
  const { dados, atual, antes, comparar } = usePainel();
  const v = (a: number | null, b: number | null) => (comparar ? variacao(a, b) : undefined);

  const r = useMemo(() => {
    const porOrigem = {
      Campanhas: somar(atual.anuncios),
      "Instagram · Bio": somar(atual.organico.filter((l) => l.origem === "Instagram · Bio")),
      Direto: somar(atual.organico.filter((l) => l.origem === "Direto")),
    };
    const tudo = somar([...atual.anuncios, ...atual.organico]);
    const tudoAntes = somar([...antes.anuncios, ...antes.organico]);
    const resposta = mediana(atual.atendimento.map((a) => a.primeiraResposta));
    const respostaAntes = mediana(antes.atendimento.map((a) => a.primeiraResposta));
    const semContato = atual.atendimento.reduce((s, a) => s + a.semContato, 0);
    const followUps = atual.atendimento.reduce((s, a) => s + a.followUps, 0);
    const dia = atual.dias.map((data) => {
      const t = somar([...atual.anuncios, ...atual.organico].filter((l) => l.data === data));
      const porPlano = Object.fromEntries(PLANOS.map((p) => [p, t.vendasPlano[p] * precoNoDia(p, data)])) as Record<Plano, number>;
      return { data, ...porPlano, total: t.faturamento };
    });
    const atendimento = atual.atendimento.map((a) => ({ data: a.data, resposta: a.primeiraResposta }));
    return { porOrigem, tudo, tudoAntes, resposta, respostaAntes, semContato, followUps, dia, atendimento };
  }, [atual, antes]);

  const { porOrigem, tudo, tudoAntes } = r;
  const corOrigem = { Campanhas: SERIES[0], "Instagram · Bio": SERIES[1], Direto: SERIES[2] } as const;
  const ticket = tudo.vendas ? tudo.faturamento / tudo.vendas : null;
  const ticketAntes = tudoAntes.vendas ? tudoAntes.faturamento / tudoAntes.vendas : null;

  return (
    <Revelar>
      <Cabecalho
        indice="05"
        titulo="Vendas e"
        acento="atendimento"
        descricao="Tudo que fechou no WhatsApp, venha de anúncio, da bio ou de quem chamou direto. É aqui que se vê se o lead bom está virando cliente."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 sm:gap-4">
        <Kpi rotulo="Faturamento" valor={tudo.faturamento} formato={fmt.brlCurto} delta={v(tudo.faturamento, tudoAntes.faturamento)} nota="Anúncio + orgânico" />
        <Kpi rotulo="Vendas" valor={tudo.vendas} formato={fmt.int} delta={v(tudo.vendas, tudoAntes.vendas)} nota={`${fmt.int(porOrigem.Campanhas.vendas)} de campanhas`} />
        <Kpi rotulo="Ticket médio" valor={ticket} formato={fmt.brl0} delta={v(ticket, ticketAntes)} />
        <Kpi rotulo="Conversas" valor={tudo.conversas} formato={fmt.int} delta={v(tudo.conversas, tudoAntes.conversas)} nota={`${fmt.int(tudo.grupo)} entraram no grupo`} />
        <Kpi rotulo="1ª resposta" valor={r.resposta} formato={(x) => (x == null ? "—" : `${Math.round(x)} min`)} delta={v(r.resposta, r.respostaAntes)} inverso nota="Mediana do período" />
        <Kpi rotulo="Sem contato" valor={r.semContato} formato={fmt.int} nota={`${fmt.int(r.followUps)} com follow-up feito`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel className="lg:col-span-4" titulo="Funil comercial" subtitulo="Da página à venda, todas as origens (inclui quem chamou direto).">
          <Funil
            etapas={[
              { nome: "Sessões nas páginas", valor: tudo.sessoes, custo: `${fmt.int(tudo.leads)} leads no formulário` },
              { nome: "Conversas no WhatsApp", valor: tudo.conversas, custo: `${fmt.int(tudo.grupo)} entraram no grupo` },
              { nome: "Vendas", valor: tudo.vendas, custo: `Ticket ${fmt.brl0(ticket)}` },
            ]}
          />
        </Painel>

        <div className="grid gap-4 lg:col-span-8">
          <Painel titulo="De onde vem a venda" subtitulo="Campanhas = anúncio com código; Bio = link do Instagram; Direto = chamou sem passar por página.">
            <div className="space-y-6">
              {(
                [
                  ["Conversas", (o: (typeof porOrigem)["Campanhas"]) => o.conversas, fmt.int],
                  ["Vendas", (o: (typeof porOrigem)["Campanhas"]) => o.vendas, fmt.int],
                  ["Faturamento", (o: (typeof porOrigem)["Campanhas"]) => o.faturamento, fmt.brlCurto],
                ] as const
              ).map(([titulo, pega, f]) => (
                <Proporcao key={titulo} titulo={titulo} formato={f} partes={ORIGENS.map((o) => ({ nome: o, valor: pega(porOrigem[o]), cor: corOrigem[o] }))} />
              ))}
            </div>
          </Painel>

          <Painel titulo="Vendas por produto" subtitulo="Quantidade e faturamento de cada plano no período.">
            <BarrasH
              rotulo="Faturamento por produto"
              formato={fmt.brl0}
              itens={PLANOS.map((p, i) => ({
                chave: p,
                nome: p,
                valor: r.dia.reduce((s, d) => s + Number(d[p] ?? 0), 0),
                cor: SERIES[i],
                nota: `${fmt.int(tudo.vendasPlano[p])} vendas · ${fmt.pct(tudo.vendas ? (tudo.vendasPlano[p] / tudo.vendas) * 100 : 0, 0)} das vendas`,
              }))}
            />
          </Painel>
        </div>
      </div>

      <Painel
        className="mt-4"
        titulo="Faturamento por dia"
        subtitulo="Por produto, todas as origens."
        tabela={{
          chave: (l) => l.data,
          colunas: [
            { chave: "data", nome: "Dia", valor: (l) => l.data, render: (l) => fmt.dia(l.data) },
            ...PLANOS.map((p) => ({ chave: p, nome: p, alinhar: "dir" as const, valor: (l: (typeof r.dia)[number]) => Number(l[p] ?? 0), render: (l: (typeof r.dia)[number]) => fmt.brl0(Number(l[p] ?? 0)) })),
            { chave: "total", nome: "Total", alinhar: "dir", valor: (l) => l.total, render: (l) => fmt.brl0(l.total) },
          ],
          linhas: r.dia,
        }}
      >
        <GraficoColunas rotulo="Faturamento por dia e produto" pontos={r.dia} formato={fmt.brl0} formatoEixo={fmt.brlCurto} series={PLANOS.map((p, i) => ({ chave: p, nome: p, cor: SERIES[i] }))} altura={240} />
      </Painel>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel className="lg:col-span-7" titulo="Quando as conversas chegam" subtitulo="Conversas iniciadas por dia da semana e hora (últimos 90 dias). Use para escalar o atendimento e programar os anúncios.">
          <MapaCalor matriz={dados.conversasPorHora} rotulo="Mapa de calor das conversas por dia da semana e hora" />
        </Painel>
        <Painel
          className="lg:col-span-5"
          titulo="Tempo até a 1ª resposta"
          subtitulo="Mediana por dia, em minutos. Quanto mais rápido, mais o lead fecha."
          tabela={{
            chave: (l) => l.data,
            colunas: [
              { chave: "data", nome: "Dia", valor: (l) => l.data, render: (l) => fmt.dia(l.data) },
              { chave: "resp", nome: "Minutos", alinhar: "dir", valor: (l) => l.resposta },
            ],
            linhas: r.atendimento,
          }}
        >
          <GraficoLinhas rotulo="Tempo até a primeira resposta por dia" pontos={r.atendimento} formato={(x) => `${Math.round(x)} min`} formatoEixo={(x) => `${x}`} inteiros altura={230} series={[{ chave: "resposta", nome: "Minutos", cor: SERIES[0], area: true }]} />
        </Painel>
      </div>
    </Revelar>
  );
}
