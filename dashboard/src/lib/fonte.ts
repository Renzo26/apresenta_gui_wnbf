/**
 * Dados REAIS do dashboard (só no servidor). Junta três fontes no formato de src/lib/dados.ts:
 *
 *  1. Formulários das páginas (paginas.leads): cada pessoa conta UMA vez, no dia do 1º envio, na campanha
 *     daquele envio (mesma regra do Lead na Meta). A campanha/conjunto/anúncio vêm das UTMs
 *     (utm_campaign={{campaign.name}}, utm_term={{adset.name}}, utm_content={{ad.name}}).
 *  2. CRM (crm.conversas): conversa iniciada (dia da 1ª mensagem), grupo (etapa GRUPO ou CLIENTE) e
 *     venda (etapa CLIENTE, no dia em que virou cliente, pelo plano da etiqueta de produto).
 *     1ª resposta: a 1ª mensagem da equipe 30 s ou mais depois da do lead (a resposta automática do
 *     n8n sai em segundos e não conta como atendimento).
 *     Faturamento = preço do plano no dia (o CRM ainda não guarda o valor pago).
 *  3. Meta Ads (opcional, META_ADS_TOKEN + META_AD_ACCOUNT_ID): investimento, impressões, alcance,
 *     cliques no link, visualizações da página (LPV = "sessões" dos anúncios), vídeo 3s e ThruPlay.
 *
 * Sem Meta, as campanhas/anúncios saem das UTMs e os números de mídia ficam zerados.
 * O cruzamento anúncio ↔ lead/conversa é pelo nome padronizado (slug), igual ao CRM.
 */
import "server-only";
import postgres from "postgres";
import {
  diasEntre,
  precoNoDia,
  type Campanha,
  type Conjunto,
  type Criativo,
  type Dados,
  type Formato,
  type ISO,
  type LinhaAnuncio,
  type LinhaAtendimento,
  type LinhaOrganica,
  type Objetivo,
  type PaginaId,
  type Plano,
} from "@/lib/dados";

const CRM = process.env.CRM_SCHEMA ?? "crm";
const LEADS = process.env.DATABASE_SCHEMA ?? "paginas";
const FUSO = "America/Sao_Paulo";
const DIAS = 90; // janela que o dashboard carrega

let cliente: postgres.Sql | undefined;
function db() {
  cliente ??= postgres({
    host: process.env.DATABASE_HOST ?? "db",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    database: process.env.DATABASE_NAME ?? "postgres",
    username: process.env.DATABASE_USER ?? "postgres",
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === "true" ? "require" : false,
    max: 4,
    idle_timeout: 30,
    connect_timeout: 10,
  });
  return cliente;
}

// ---------- regras de origem (as mesmas do CRM: backend/app/services/origem.py) ----------

/** Nome padrão da campanha: minúsculas, sem acento, hífen, até 40 (igual ao código das páginas e ao CRM). */
export function slug(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const FONTES_BIO = new Set(["bio", "ig", "instagram"]);
const FONTES = new Set([...FONTES_BIO, "fb", "facebook", "meta", "google", "youtube", "yt", "tiktok", "email"]);

/** Campanha de anúncio (slug) ou fonte orgânica, a partir das UTMs do formulário. */
function classificar(campanha: string | null, fonte: string | null, conteudo: string | null) {
  if (conteudo === "link_in_bio") return { campanha: null, bio: true };
  const valor = (campanha || fonte || "").trim();
  const chave = valor.toLowerCase();
  if (!valor || chave === "direto") return { campanha: null, bio: false };
  if (FONTES.has(chave)) return { campanha: null, bio: FONTES_BIO.has(chave) };
  return { campanha: slug(valor) || null, bio: false };
}

function paginaDe(caminho: string | null): PaginaId | null {
  if (!caminho) return null;
  if (caminho.startsWith("/black") || caminho.startsWith("/direta")) return "black";
  if (caminho.startsWith("/planilhas")) return "planilhas";
  if (caminho.startsWith("/linktree")) return null;
  return "site";
}
const paginaDoCrm = (p: string): PaginaId | null => (p === "black" || p === "site" || p === "planilhas" ? p : null);

const PLANO_DO_CODIGO: Record<string, Plano> = {
  ANUAL: "Anual",
  SEMESTRAL: "Semestral",
  TRIMESTRAL: "Trimestral",
  PLANILHAS: "Treinos Essenciais",
};

const vazio = (): Record<Plano, number> => ({ Trimestral: 0, Semestral: 0, Anual: 0, "Treinos Essenciais": 0 });
const hojeSP = () => new Date().toLocaleDateString("en-CA", { timeZone: FUSO });
const somarDias = (iso: ISO, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// ---------- Meta Ads ----------

type AnuncioMeta = {
  id: string;
  nome: string;
  conjuntoId: string;
  conjunto: string;
  campanhaId: string;
  campanha: string;
  objetivo: string;
  orcamentoDia: number;
  inicio: ISO | null;
  fim: ISO | null;
  imagem: string | null;
  copy: string;
  formato: Formato;
  link?: string;
};
type InsightMeta = {
  ad_id: string;
  date_start: ISO;
  spend?: string;
  impressions?: string;
  reach?: string;
  inline_link_clicks?: string;
  actions?: { action_type: string; value: string }[];
  video_thruplay_watched_actions?: { action_type: string; value: string }[];
};

const tokenMeta = () => process.env.META_ADS_TOKEN?.trim().split(/[\s\\]/)[0];
const contaMeta = () => {
  const c = process.env.META_AD_ACCOUNT_ID?.trim();
  return c ? (c.startsWith("act_") ? c : `act_${c}`) : undefined;
};
const VERSAO = process.env.META_GRAPH_VERSION ?? "v24.0";

async function graph<T>(caminho: string, params: Record<string, string>): Promise<T[]> {
  const token = tokenMeta()!;
  let url: string | null = `https://graph.facebook.com/${VERSAO}/${caminho}?${new URLSearchParams({ ...params, limit: "500", access_token: token })}`;
  const tudo: T[] = [];
  for (let i = 0; url && i < 40; i++) {
    const r = await fetch(url, { cache: "no-store" });
    const j = (await r.json()) as { data?: T[]; paging?: { next?: string }; error?: { message: string } };
    // nunca devolve a mensagem crua (a Meta repete o token no erro)
    if (j.error) throw new Error(`Meta Ads: ${j.error.message.replace(/EAA[A-Za-z0-9]+/g, "[token]")}`);
    tudo.push(...(j.data ?? []));
    url = j.paging?.next ?? null;
  }
  return tudo;
}

const OBJETIVOS: Record<string, Objetivo> = {
  OUTCOME_LEADS: "Leads",
  LEAD_GENERATION: "Leads",
  OUTCOME_ENGAGEMENT: "Conversas",
  MESSAGES: "Conversas",
  OUTCOME_SALES: "Vendas",
  CONVERSIONS: "Vendas",
  OUTCOME_AWARENESS: "Alcance",
  REACH: "Alcance",
  OUTCOME_TRAFFIC: "Leads",
};

async function lerMeta(inicio: ISO, fim: ISO) {
  const conta = contaMeta()!;
  type Ad = {
    id: string;
    name: string;
    adset?: { id: string; name: string; daily_budget?: string };
    campaign?: { id: string; name: string; objective?: string; daily_budget?: string; start_time?: string; stop_time?: string };
    creative?: { thumbnail_url?: string; image_url?: string; body?: string; object_type?: string; video_id?: string };
    preview_shareable_link?: string;
  };
  const [ads, insights] = await Promise.all([
    graph<Ad>(`${conta}/ads`, {
      // miniatura em 720 px (o padrão da Meta é 64 px e fica borrado): só funciona como modificador do campo
      fields:
        "id,name,preview_shareable_link,adset{id,name,daily_budget},campaign{id,name,objective,daily_budget,start_time,stop_time},creative.thumbnail_width(720).thumbnail_height(720){thumbnail_url,image_url,body,object_type,video_id}",
    }),
    graph<InsightMeta>(`${conta}/insights`, {
      level: "ad",
      time_increment: "1",
      time_range: JSON.stringify({ since: inicio, until: fim }),
      fields: "ad_id,spend,impressions,reach,inline_link_clicks,actions,video_thruplay_watched_actions",
    }),
  ]);
  const anuncios: AnuncioMeta[] = ads.map((a) => {
    const c = a.creative ?? {};
    const orc = Number(a.campaign?.daily_budget ?? a.adset?.daily_budget ?? 0) / 100;
    return {
      id: a.id,
      nome: a.name,
      conjuntoId: a.adset?.id ?? `sem-${a.id}`,
      conjunto: a.adset?.name ?? "Sem conjunto",
      campanhaId: a.campaign?.id ?? `sem-${a.id}`,
      campanha: a.campaign?.name ?? "Sem campanha",
      objetivo: a.campaign?.objective ?? "",
      orcamentoDia: orc,
      inicio: a.campaign?.start_time?.slice(0, 10) ?? null,
      fim: a.campaign?.stop_time?.slice(0, 10) ?? null,
      imagem: c.image_url || c.thumbnail_url || null,
      copy: c.body ?? "",
      formato: c.video_id || c.object_type === "VIDEO" ? "Vídeo" : c.object_type === "SHARE" ? "Imagem" : "Imagem",
      link: a.preview_shareable_link,
    };
  });
  return { anuncios, insights };
}

const acao = (lista: InsightMeta["actions"], tipo: string) => Number(lista?.find((a) => a.action_type === tipo)?.value ?? 0);

// ---------- leitura do banco ----------

type LeadRow = {
  dia: ISO;
  pagina: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};
type ConversaRow = {
  dia: ISO;
  dia_etapa: ISO | null;
  dow: number;
  hora: number;
  pagina: string;
  campanha: string | null;
  etapa: string;
  produto: string | null;
  origem: string | null;
  utm_content: string | null;
  utm_term: string | null;
  primeira_resposta_min: number | null;
};

async function lerBanco(inicio: ISO) {
  const sql = db();
  const desde = `${inicio}T00:00:00-03:00`;
  const [leads, conversas, semContato, followUps] = await Promise.all([
    // 1º envio de cada pessoa (telefone, 8 últimos dígitos), dentro da janela
    sql<LeadRow[]>`
      with primeiro as (
        select distinct on (right(telefone, 8)) * from ${sql(LEADS)}.leads order by right(telefone, 8), criado_em
      )
      select to_char(criado_em at time zone ${FUSO}, 'YYYY-MM-DD') as dia, pagina, utm_source, utm_campaign, utm_content, utm_term
      from primeiro where criado_em >= ${desde}`,
    sql<ConversaRow[]>`
      select to_char(c.criado_em at time zone ${FUSO}, 'YYYY-MM-DD') as dia,
             to_char(c.etapa_em at time zone ${FUSO}, 'YYYY-MM-DD') as dia_etapa,
             extract(dow from c.criado_em at time zone ${FUSO})::int as dow,
             extract(hour from c.criado_em at time zone ${FUSO})::int as hora,
             c.pagina, c.campanha, c.etapa::text as etapa, p.codigo as produto, o.nome as origem,
             l.utm_content, l.utm_term,
             (select extract(epoch from (r.criado_em - m.criado_em)) / 60
                from (select criado_em from ${sql(CRM)}.mensagens where conversa_id = c.id and do_lead order by criado_em limit 1) m
                cross join lateral (select criado_em from ${sql(CRM)}.mensagens
                                     where conversa_id = c.id and not do_lead and criado_em > m.criado_em + interval '30 seconds'
                                     order by criado_em limit 1) r
             )::float as primeira_resposta_min
      from ${sql(CRM)}.conversas c
      left join ${sql(CRM)}.etiquetas p on p.id = c.produto_id
      left join ${sql(CRM)}.etiquetas o on o.id = c.origem_id
      left join ${sql(LEADS)}.leads l on l.id = c.lead_id
      where c.criado_em >= ${desde} or c.etapa_em >= ${desde}`,
    // preencheram o formulário e não têm conversa (mesma regra da aba "Sem contato" do CRM)
    sql<{ dia: ISO; n: number }[]>`
      with f as (
        select distinct on (right(telefone, 8)) id, telefone, criado_em from ${sql(LEADS)}.leads
        order by right(telefone, 8), criado_em desc
      )
      select to_char(f.criado_em at time zone ${FUSO}, 'YYYY-MM-DD') as dia, count(*)::int as n from f
      where f.criado_em >= ${desde}
        and not exists (select 1 from ${sql(CRM)}.conversas c where c.lead_id = f.id or right(c.telefone, 8) = right(f.telefone, 8))
        and not exists (select 1 from ${sql(CRM)}.leads_dispensados d where d.lead_id = f.id)
      group by 1`,
    sql<{ dia: ISO; n: number }[]>`
      select to_char(criado_em at time zone ${FUSO}, 'YYYY-MM-DD') as dia, count(*)::int as n
      from ${sql(CRM)}.leads_follow_up where criado_em >= ${desde} group by 1`,
  ]);
  return { leads, conversas, semContato, followUps };
}

// ---------- montagem ----------

const mediana = (v: number[]) => {
  if (!v.length) return 0;
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return Math.round(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2);
};

export async function montarDados(): Promise<Dados> {
  const fim = hojeSP();
  const inicio = somarDias(fim, -(DIAS - 1));
  const dias = diasEntre(inicio, fim);
  const avisos: string[] = [];

  const temMeta = Boolean(tokenMeta() && contaMeta());
  const [banco, meta] = await Promise.all([
    lerBanco(inicio),
    temMeta
      ? lerMeta(inicio, fim).catch((e: Error) => {
          avisos.push(`Não foi possível ler a Meta Ads agora (${e.message.slice(0, 160)}). Investimento e mídia zerados.`);
          return null;
        })
      : Promise.resolve(null),
  ]);
  if (!temMeta) avisos.push("Meta Ads ainda não conectada: investimento, impressões e cliques aparecem zerados. Leads, conversas e vendas já são reais.");

  // ---- cadastro de campanhas / conjuntos / anúncios ----
  const campanhas = new Map<string, Campanha>();
  const conjuntos = new Map<string, Conjunto>();
  const criativos = new Map<string, Criativo>();
  // chaves de cruzamento: slug da campanha -> id; slug campanha + slug anúncio -> id do anúncio
  const campanhaPorSlug = new Map<string, string>();
  const anuncioPorChave = new Map<string, string>();

  const objetivoDe = (o: string): Objetivo => OBJETIVOS[o] ?? "Leads";
  const paginaPorCampanha = new Map<string, Map<PaginaId, number>>();
  const votarPagina = (campanhaId: string, p: PaginaId | null) => {
    if (!p) return;
    const m = paginaPorCampanha.get(campanhaId) ?? new Map();
    m.set(p, (m.get(p) ?? 0) + 1);
    paginaPorCampanha.set(campanhaId, m);
  };

  if (meta) {
    for (const a of meta.anuncios) {
      if (!campanhas.has(a.campanhaId)) {
        campanhas.set(a.campanhaId, {
          id: a.campanhaId,
          nome: a.campanha,
          objetivo: objetivoDe(a.objetivo),
          pagina: "black",
          temperatura: /remarketing|rmkt|quente|retarget/i.test(a.campanha) ? "Quente" : "Frio",
          inicio: a.inicio ?? inicio,
          fim: a.fim,
          orcamentoDia: a.orcamentoDia,
        });
        campanhaPorSlug.set(slug(a.campanha), a.campanhaId);
      }
      if (!conjuntos.has(a.conjuntoId)) conjuntos.set(a.conjuntoId, { id: a.conjuntoId, campanhaId: a.campanhaId, nome: a.conjunto });
      criativos.set(a.id, {
        id: a.id,
        conjuntoId: a.conjuntoId,
        campanhaId: a.campanhaId,
        nome: a.nome,
        formato: a.formato,
        imagem: a.imagem,
        copy: a.copy,
        qualidade: 1,
        link: a.link,
      });
      // o mesmo nome de anúncio pode existir em conjuntos diferentes: a chave com o conjunto vem primeiro
      anuncioPorChave.set(`${slug(a.campanha)}|${slug(a.conjunto)}|${slug(a.nome)}`, a.id);
      if (!anuncioPorChave.has(`${slug(a.campanha)}|${slug(a.nome)}`)) anuncioPorChave.set(`${slug(a.campanha)}|${slug(a.nome)}`, a.id);
    }
  }

  /** Acha (ou cria a partir das UTMs) o anúncio de um lead/conversa de campanha. */
  const anuncioDe = (campanhaSlug: string, nomeOriginal: string | null, conjunto: string | null, anuncio: string | null, dia: ISO) => {
    const doAnuncio = anuncio
      ? ((conjunto && anuncioPorChave.get(`${campanhaSlug}|${slug(conjunto)}|${slug(anuncio)}`)) ||
        anuncioPorChave.get(`${campanhaSlug}|${slug(anuncio)}`))
      : undefined;
    if (doAnuncio) return doAnuncio;
    let campanhaId = campanhaPorSlug.get(campanhaSlug);
    if (!campanhaId) {
      campanhaId = `utm:${campanhaSlug}`;
      campanhaPorSlug.set(campanhaSlug, campanhaId);
      campanhas.set(campanhaId, {
        id: campanhaId,
        nome: nomeOriginal ?? campanhaSlug,
        objetivo: "Leads",
        pagina: "black",
        temperatura: /remarketing|rmkt|quente|retarget/i.test(campanhaSlug) ? "Quente" : "Frio",
        inicio: dia,
        fim: null,
        orcamentoDia: 0,
      });
    }
    const c = campanhas.get(campanhaId)!;
    if (dia < c.inicio && campanhaId.startsWith("utm:")) c.inicio = dia;
    if (nomeOriginal && c.nome === campanhaSlug && campanhaId.startsWith("utm:")) c.nome = nomeOriginal;
    // sem Meta (ou anúncio que a Meta não listou): cria pelo nome das UTMs
    const nomeConj = conjunto?.trim() || "Sem conjunto identificado";
    const nomeAd = anuncio?.trim() || "Sem anúncio identificado";
    const conjId = `${campanhaId}|${slug(nomeConj)}`;
    if (!conjuntos.has(conjId)) conjuntos.set(conjId, { id: conjId, campanhaId, nome: nomeConj });
    const adId = `${conjId}|${slug(nomeAd)}`;
    if (!criativos.has(adId)) {
      criativos.set(adId, { id: adId, conjuntoId: conjId, campanhaId, nome: nomeAd, formato: "Imagem", imagem: null, copy: "", qualidade: 1 });
    }
    if (anuncio) anuncioPorChave.set(`${campanhaSlug}|${slug(anuncio)}`, adId);
    return adId;
  };

  // ---- linhas por anúncio/dia e orgânicas ----
  const linhasAd = new Map<string, LinhaAnuncio>();
  const linhaAd = (data: ISO, criativoId: string) => {
    const k = `${data}|${criativoId}`;
    let l = linhasAd.get(k);
    if (!l) {
      l = { data, criativoId, investimento: 0, impressoes: 0, alcance: 0, cliques: 0, sessoes: 0, leads: 0, conversas: 0, grupo: 0, vendas: vazio(), faturamento: 0, video3s: 0, thruplay: 0 };
      linhasAd.set(k, l);
    }
    return l;
  };
  const linhasOrg = new Map<string, LinhaOrganica>();
  const linhaOrg = (data: ISO, origem: LinhaOrganica["origem"], pagina: PaginaId | null) => {
    const k = `${data}|${origem}|${pagina}`;
    let l = linhasOrg.get(k);
    if (!l) {
      l = { data, origem, pagina, sessoes: 0, leads: 0, conversas: 0, grupo: 0, vendas: vazio(), faturamento: 0 };
      linhasOrg.set(k, l);
    }
    return l;
  };
  const naJanela = (d: ISO | null): d is ISO => Boolean(d && d >= inicio && d <= fim);

  if (meta) {
    for (const i of meta.insights) {
      if (!criativos.has(i.ad_id) || !naJanela(i.date_start)) continue;
      const l = linhaAd(i.date_start, i.ad_id);
      l.investimento += Number(i.spend ?? 0);
      l.impressoes += Number(i.impressions ?? 0);
      l.alcance += Number(i.reach ?? 0);
      l.cliques += Number(i.inline_link_clicks ?? 0);
      l.sessoes += acao(i.actions, "landing_page_view");
      l.video3s += acao(i.actions, "video_view");
      l.thruplay += acao(i.video_thruplay_watched_actions, "video_view");
      // leads que a própria Meta atribui ao anúncio (janela de clique 7 d / visualização 1 d)
      l.leadsMeta = (l.leadsMeta ?? 0) + (acao(i.actions, "offsite_conversion.fb_pixel_lead") || acao(i.actions, "lead"));
    }
  }

  for (const r of banco.leads) {
    if (!naJanela(r.dia)) continue;
    const o = classificar(r.utm_campaign, r.utm_source, r.utm_content);
    const pagina = paginaDe(r.pagina);
    if (o.campanha) {
      const ad = anuncioDe(o.campanha, r.utm_campaign, r.utm_term, r.utm_content, r.dia);
      linhaAd(r.dia, ad).leads++;
      votarPagina(criativos.get(ad)!.campanhaId, pagina);
    } else {
      linhaOrg(r.dia, o.bio ? "Instagram · Bio" : "Direto", pagina).leads++;
    }
  }

  const atendimentoResp = new Map<ISO, number[]>();
  const porHora = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const c of banco.conversas) {
    const pagina = paginaDoCrm(c.pagina);
    const plano = c.produto ? PLANO_DO_CODIGO[c.produto] : undefined;
    const ehGrupo = c.etapa === "GRUPO" || c.etapa === "CLIENTE";
    const ehVenda = c.etapa === "CLIENTE" && plano && naJanela(c.dia_etapa);
    // a linha da conversa (dia em que começou) e a da venda (dia em que virou cliente)
    const linha = (data: ISO) => {
      if (c.campanha) {
        const ad = anuncioDe(c.campanha, null, c.utm_term, c.utm_content, data);
        votarPagina(criativos.get(ad)!.campanhaId, pagina);
        return linhaAd(data, ad);
      }
      return linhaOrg(data, /bio/i.test(c.origem ?? "") ? "Instagram · Bio" : "Direto", pagina);
    };
    if (naJanela(c.dia)) {
      const l = linha(c.dia);
      l.conversas++;
      if (ehGrupo) l.grupo++;
      porHora[c.dow][c.hora]++;
      if (c.primeira_resposta_min != null && c.primeira_resposta_min >= 0) {
        atendimentoResp.set(c.dia, [...(atendimentoResp.get(c.dia) ?? []), c.primeira_resposta_min]);
      }
    }
    if (ehVenda && plano) {
      const l = linha(c.dia_etapa!);
      l.vendas[plano]++;
      l.faturamento += precoNoDia(plano, c.dia_etapa!);
    }
  }

  // página de cada campanha: a mais comum entre os leads/conversas dela
  for (const [id, votos] of paginaPorCampanha) {
    const c = campanhas.get(id);
    if (c) c.pagina = [...votos].sort((a, b) => b[1] - a[1])[0][0];
  }

  const semContato = new Map(banco.semContato.map((r) => [r.dia, r.n]));
  const followUps = new Map(banco.followUps.map((r) => [r.dia, r.n]));
  const atendimento: LinhaAtendimento[] = dias.map((d) => ({
    data: d,
    primeiraResposta: mediana(atendimentoResp.get(d) ?? []),
    semContato: semContato.get(d) ?? 0,
    followUps: followUps.get(d) ?? 0,
  }));

  return {
    atualizadoEm: new Date().toISOString(),
    fontes: { banco: true, meta: Boolean(meta), exemplo: false },
    avisos,
    crmUrl: process.env.CRM_URL,
    dias,
    campanhas: [...campanhas.values()],
    conjuntos: [...conjuntos.values()],
    criativos: [...criativos.values()],
    anuncios: [...linhasAd.values()].sort((a, b) => a.data.localeCompare(b.data)),
    organico: [...linhasOrg.values()].sort((a, b) => a.data.localeCompare(b.data)),
    atendimento,
    conversasPorHora: porHora,
  };
}

/** Usuário do CRM ainda ativo e com acesso ao dashboard (ADMIN ou GESTOR). */
export async function usuarioComAcesso(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const sql = db();
  const [u] = await sql<{ ok: boolean }[]>`
    select (ativo and papel::text in ('ADMIN', 'GESTOR')) as ok from ${sql(CRM)}.usuarios where id = ${id}`;
  return Boolean(u?.ok);
}
