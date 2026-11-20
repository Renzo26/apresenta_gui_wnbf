"use client";

import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { GraficoColunas } from "@/components/graficos/barras";
import { GraficoLinhas } from "@/components/graficos/linhas";
import { Funil } from "@/components/graficos/simples";
import { usePainel } from "@/components/providers";
import { Cabecalho } from "@/components/shell";
import { Delta, Numero, Revelar } from "@/components/ui/base";
import { Indicador, Kpi } from "@/components/ui/kpi";
import { Painel } from "@/components/ui/painel";
import { PLANOS } from "@/lib/dados";
import { fmt, porDia, somar, variacao } from "@/lib/metricas";
import { SERIES } from "@/lib/utils";

export function VisaoGeral() {
  const { atual, antes, ads, adsAntes, d, dAntes, comparar } = usePainel();
  const dia = useMemo(() => porDia(atual.anuncios, atual.dias), [atual]);
  const v = (a: number | null, b: number | null) => (comparar ? variacao(a, b) : undefined);

  // receita total do período (anúncio + orgânico) para mostrar quanto as campanhas representam
  const tudo = useMemo(() => somar([...atual.anuncios, ...atual.organico]), [atual]);
  const tudoAntes = useMemo(() => somar([...antes.anuncios, ...antes.organico]), [antes]);
  const lucro = ads.faturamento - ads.investimento;
  const lucroAntes = adsAntes.faturamento - adsAntes.investimento;

  const pontosDia = dia.map((x) => ({
    data: x.data,
    investimento: x.investimento,
    faturamento: x.faturamento,
    leads: x.leads,
    conversas: x.conversas,
    ...Object.fromEntries(PLANOS.map((p) => [p, x.vendasPlano[p]])),
  }));

  return (
    <Revelar>
      <Cabecalho
        indice="01"
        titulo="Onde o dinheiro"
        acento="vira venda"
        descricao="Do anúncio à venda fechada no WhatsApp: as vendas e o faturamento vêm do CRM, ligados à campanha pelo código da mensagem, e não do que a Meta estima."
      />

      {/* Destaque: investimento → faturamento */}
      <section
        data-revelar
        className="grain relative overflow-hidden rounded-[2rem] border border-linha bg-destaque p-6 text-[#f2efe8] sm:p-9"
        // o destaque é sempre escuro: as cores de status ficam as do tema escuro nos dois temas
        style={{ "--color-ok": "#4ade80", "--color-erro": "#fca5a5", "--color-painel-2": "#1e1e21", "--color-suave": "#a9abc4" } as React.CSSProperties}
      >
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#8f94ff]/25 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#f2efe8]/70">Retorno real das campanhas</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
              <div>
                <p className="text-xs text-[#f2efe8]/70">Investido</p>
                <Numero valor={ads.investimento} formato={fmt.brl0} className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-none" />
              </div>
              <ArrowRight className="mb-2 size-7 text-[#f2efe8]/60" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-xs text-[#f2efe8]/70">Faturado no CRM</p>
                <Numero valor={ads.faturamento} formato={fmt.brl0} className="font-display text-[clamp(2.6rem,5.5vw,4.6rem)] leading-none text-ouro" />
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#f2efe8]/75">
              {fmt.int(ads.vendas)} vendas vieram das campanhas, de {fmt.int(tudo.vendas)} no total do período. As campanhas trouxeram{" "}
              <strong className="font-semibold text-[#f2efe8]">{fmt.pct(tudo.faturamento ? (ads.faturamento / tudo.faturamento) * 100 : null, 0)}</strong> do faturamento.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 lg:col-span-5">
            {[
              { nome: "ROAS", valor: d.roas, f: fmt.x, delta: v(d.roas, dAntes.roas) },
              { nome: "Resultado", valor: lucro, f: fmt.brlCurto, delta: v(lucro, lucroAntes) },
              { nome: "Faturamento total", valor: tudo.faturamento, f: fmt.brlCurto, delta: v(tudo.faturamento, tudoAntes.faturamento) },
            ].map((k) => (
              <div key={k.nome} className="min-w-0 rounded-2xl bg-[#0b0b0c]/35 p-3 sm:p-3.5 ring-1 ring-[#f2efe8]/10 backdrop-blur">
                <dt className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#f2efe8]/65 sm:text-[0.66rem] sm:tracking-[0.14em]">{k.nome}</dt>
                <dd className="mt-2">
                  <Numero valor={k.valor} formato={k.f} className="block whitespace-nowrap font-display text-lg leading-none sm:text-2xl lg:text-xl 2xl:text-[1.7rem]" />
                  {k.delta !== undefined && <Delta valor={k.delta} className="mt-2 bg-[#0b0b0c]/50" />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 sm:gap-4">
        <Kpi rotulo="Investimento" valor={ads.investimento} formato={fmt.brl0} delta={v(ads.investimento, adsAntes.investimento)} serie={dia.map((x) => x.investimento)} nota={`${fmt.brl(d.cpm)} de CPM`} />
        <Kpi rotulo="Leads" valor={ads.leads} formato={fmt.int} delta={v(ads.leads, adsAntes.leads)} serie={dia.map((x) => x.leads)} nota={`CPL ${fmt.brl(d.cpl)}`} />
        <Kpi rotulo="Conversas" valor={ads.conversas} formato={fmt.int} delta={v(ads.conversas, adsAntes.conversas)} serie={dia.map((x) => x.conversas)} nota={`${fmt.brl(d.custoConversa)} por conversa`} />
        <Kpi rotulo="Vendas" valor={ads.vendas} formato={fmt.int} delta={v(ads.vendas, adsAntes.vendas)} serie={dia.map((x) => x.vendas)} nota={`CAC ${fmt.brl(d.cac)}`} />
        <Kpi rotulo="Ticket médio" valor={d.ticket} formato={fmt.brl0} delta={v(d.ticket, dAntes.ticket)} nota="Por venda das campanhas" />
        <Kpi rotulo="Fechamento" valor={d.taxaFechamento} formato={(x) => fmt.pct(x)} delta={v(d.taxaFechamento, dAntes.taxaFechamento)} nota="Conversas que viraram venda" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel
          className="lg:col-span-4"
          titulo="Funil das campanhas"
          subtitulo="Cada barra é a passagem da etapa anterior para esta. Leads do formulário ficam fora: muita gente chama direto no WhatsApp."
          tabela={{
            chave: (l) => l.etapa,
            colunas: [
              { chave: "etapa", nome: "Etapa", valor: (l) => l.etapa },
              { chave: "valor", nome: "Volume", alinhar: "dir", valor: (l) => l.valor, render: (l) => fmt.int(l.valor) },
              { chave: "custo", nome: "Custo por", alinhar: "dir", valor: (l) => l.custo, render: (l) => fmt.brl(l.custo) },
            ],
            linhas: [
              { etapa: "Impressões", valor: ads.impressoes, custo: d.cpm != null ? d.cpm / 1000 : null },
              { etapa: "Cliques no link", valor: ads.cliques, custo: d.cpc },
              { etapa: "Sessões na página", valor: ads.sessoes, custo: d.custoSessao },
              { etapa: "Conversas no WhatsApp", valor: ads.conversas, custo: d.custoConversa },
              { etapa: "Vendas", valor: ads.vendas, custo: d.cac },
            ],
          }}
        >
          <Funil
            etapas={[
              { nome: "Impressões", valor: ads.impressoes, custo: `CPM ${fmt.brl(d.cpm)}` },
              { nome: "Cliques no link", valor: ads.cliques, custo: `CPC ${fmt.brl(d.cpc)}` },
              { nome: "Sessões na página", valor: ads.sessoes, custo: `${fmt.brl(d.custoSessao)} cada` },
              { nome: "Conversas no WhatsApp", valor: ads.conversas, custo: `${fmt.brl(d.custoConversa)} cada` },
              { nome: "Vendas", valor: ads.vendas, custo: `CAC ${fmt.brl(d.cac)}` },
            ]}
          />
        </Painel>

        <div className="grid gap-4 lg:col-span-8">
          <Painel
            titulo="Investimento e faturamento"
            subtitulo="Por dia, em reais. Faturamento = vendas do CRM que vieram das campanhas."
            tabela={{
              chave: (l) => l.data,
              colunas: [
                { chave: "data", nome: "Dia", valor: (l) => l.data, render: (l) => fmt.dia(l.data) },
                { chave: "inv", nome: "Investimento", alinhar: "dir", valor: (l) => l.investimento, render: (l) => fmt.brl(l.investimento) },
                { chave: "fat", nome: "Faturamento", alinhar: "dir", valor: (l) => l.faturamento, render: (l) => fmt.brl(l.faturamento) },
                { chave: "roas", nome: "ROAS", alinhar: "dir", valor: (l) => (l.investimento ? l.faturamento / l.investimento : null), render: (l) => fmt.x(l.investimento ? l.faturamento / l.investimento : null) },
              ],
              linhas: dia,
            }}
          >
            <GraficoLinhas
              rotulo="Investimento e faturamento por dia"
              pontos={pontosDia}
              formato={fmt.brl0}
              formatoEixo={fmt.brlCurto}
              series={[
                { chave: "faturamento", nome: "Faturamento", cor: SERIES[1], area: true },
                { chave: "investimento", nome: "Investimento", cor: SERIES[0] },
              ]}
            />
          </Painel>

          <Painel
            titulo="Vendas por dia e produto"
            subtitulo="Vendas fechadas no CRM vindas das campanhas."
            tabela={{
              chave: (l) => l.data,
              colunas: [
                { chave: "data", nome: "Dia", valor: (l) => l.data, render: (l) => fmt.dia(l.data) },
                ...PLANOS.map((p) => ({ chave: p, nome: p, alinhar: "dir" as const, valor: (l: (typeof dia)[number]) => l.vendasPlano[p] })),
                { chave: "total", nome: "Total", alinhar: "dir", valor: (l) => l.vendas },
              ],
              linhas: dia,
            }}
          >
            <GraficoColunas
              rotulo="Vendas por dia e produto"
              pontos={pontosDia}
              formato={fmt.int}
              inteiros
              altura={200}
              series={PLANOS.map((p, i) => ({ chave: p, nome: p, cor: SERIES[i] }))}
            />
          </Painel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Painel className="lg:col-span-7" titulo="Custo por etapa" subtitulo="Quanto custa cada passo do funil. Seta verde = ficou mais barato.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Indicador rotulo="CPM" descricao="Custo por mil impressões" valor={d.cpm} formato={fmt.brl} delta={v(d.cpm, dAntes.cpm)} inverso />
            <Indicador rotulo="CPC" descricao="Custo por clique no link" valor={d.cpc} formato={fmt.brl} delta={v(d.cpc, dAntes.cpc)} inverso />
            <Indicador rotulo="Custo por sessão" descricao="Investimento ÷ sessões na página" valor={d.custoSessao} formato={fmt.brl} delta={v(d.custoSessao, dAntes.custoSessao)} inverso />
            <Indicador rotulo="CPL" descricao="Custo por lead do formulário" valor={d.cpl} formato={fmt.brl} delta={v(d.cpl, dAntes.cpl)} inverso />
            <Indicador rotulo="Custo por conversa" descricao="Investimento ÷ conversas no WhatsApp" valor={d.custoConversa} formato={fmt.brl} delta={v(d.custoConversa, dAntes.custoConversa)} inverso />
            <Indicador rotulo="CAC" descricao="Custo por venda (cliente novo)" valor={d.cac} formato={fmt.brl} delta={v(d.cac, dAntes.cac)} inverso />
          </div>
        </Painel>
        <Painel className="lg:col-span-5" titulo="Taxas" subtitulo="Eficiência de cada passagem.">
          <div className="grid grid-cols-2 gap-3">
            <Indicador rotulo="CTR" descricao="Cliques a cada 100 impressões" valor={d.ctr} formato={(x) => fmt.pct(x, 2)} delta={v(d.ctr, dAntes.ctr)} />
            <Indicador rotulo="Connect rate" descricao="Cliques que carregaram a página" valor={d.connectRate} formato={(x) => fmt.pct(x)} delta={v(d.connectRate, dAntes.connectRate)} />
            <Indicador rotulo="Taxa de lead" descricao="Sessões que viraram lead" valor={d.taxaLead} formato={(x) => fmt.pct(x)} delta={v(d.taxaLead, dAntes.taxaLead)} />
            <Indicador rotulo="Frequência" descricao="Vezes que cada pessoa viu" valor={d.frequencia} formato={(x) => fmt.num(x)} delta={v(d.frequencia, dAntes.frequencia)} inverso />
          </div>
        </Painel>
      </div>

      <Painel
        className="mt-4"
        titulo="Leads e conversas por dia"
        subtitulo="Quem preencheu o formulário e quem de fato chamou no WhatsApp."
        tabela={{
          chave: (l) => l.data,
          colunas: [
            { chave: "data", nome: "Dia", valor: (l) => l.data, render: (l) => fmt.dia(l.data) },
            { chave: "leads", nome: "Leads", alinhar: "dir", valor: (l) => l.leads },
            { chave: "conv", nome: "Conversas", alinhar: "dir", valor: (l) => l.conversas },
          ],
          linhas: dia,
        }}
      >
        <GraficoLinhas
          rotulo="Leads e conversas por dia"
          pontos={pontosDia}
          formato={fmt.int}
          formatoEixo={fmt.curto}
          inteiros
          altura={220}
          series={[
            { chave: "leads", nome: "Leads", cor: SERIES[0] },
            { chave: "conversas", nome: "Conversas", cor: SERIES[2] },
          ]}
        />
      </Painel>
    </Revelar>
  );
}
