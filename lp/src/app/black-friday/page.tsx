import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// só a metade de cima do recorte: é o que aparece no círculo, e o arquivo fica menor (LCP)
import recorte from "@/assets/jayme-bf-busto.png";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { PERFIL } from "@/lib/content";
import {
  BONUS_BF,
  CTA_BF,
  DESCONTO_BF,
  FAQ_BF,
  INCLUSO_BF,
  PARCELAS_BF,
  PLANOS_BF,
  RESUMO_BF,
  ctaPlano,
  reais,
  valor,
  type PlanoBF,
} from "@/lib/black-friday";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const url = `${siteUrl}/black-friday`;
const anual = PLANOS_BF[2];

const titulo = `Black Friday: consultoria do Jayme De Lamadrid com ${DESCONTO_BF}% OFF`;
const descricao = `Consultoria online de treino e dieta com Jayme De Lamadrid, campeão WNBF, com ${DESCONTO_BF}% de desconto: a partir de ${reais(anual.porMes)} por mês no plano anual, em até ${PARCELAS_BF}x sem juros + ${BONUS_BF}.`;

export const metadata: Metadata = {
  title: { absolute: titulo },
  description: descricao,
  keywords: [
    "black friday consultoria fitness",
    "consultoria online treino e dieta",
    "consultoria fisiculturismo natural",
    "Jayme De Lamadrid",
    "De Lamadrid Team",
    "WNBF",
    "natural bodybuilding",
  ],
  alternates: { canonical: "/black-friday" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/black-friday",
    siteName: PERFIL.marca,
    title: `Black Friday: ${DESCONTO_BF}% OFF na consultoria do Jayme`,
    description: descricao,
  },
  twitter: { card: "summary_large_image", title: `Black Friday: ${DESCONTO_BF}% OFF na consultoria do Jayme`, description: descricao },
};

// Dados estruturados: o serviço com as 3 ofertas, o FAQ e a navegação. Ajudam Google e buscadores com IA a citar preços certos.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${url}#consultoria`,
      name: "Consultoria online de treino e dieta",
      serviceType: "Consultoria fitness online",
      description: RESUMO_BF,
      areaServed: { "@type": "Country", name: "Brasil" },
      provider: {
        "@type": "Person",
        name: PERFIL.nome,
        jobTitle: "Atleta WNBF PRO e treinador",
        worksFor: { "@type": "Organization", name: PERFIL.marca },
        knowsAbout: ["Fisiculturismo natural", "Musculação", "Nutrição esportiva"],
      },
      offers: PLANOS_BF.map((p) => ({
        "@type": "Offer",
        name: `Plano ${p.nome} (${p.meses} meses) — Black Friday`,
        price: p.por.toFixed(2),
        priceCurrency: "BRL",
        url: `${url}#planos`,
        availability: "https://schema.org/InStock",
        description: `De ${reais(p.de)} por ${reais(p.por)} à vista ou ${PARCELAS_BF}x de ${reais(p.parcela)} sem juros. Equivale a ${reais(p.porMes)} por mês. Inclui ${BONUS_BF}.`,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_BF.map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: PERFIL.marca, item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Black Friday", item: url },
      ],
    },
  ],
};

const FAIXA = [`Black Friday DLM`, `${DESCONTO_BF}% OFF na consultoria`, `${PARCELAS_BF}x sem juros`, `+ ${BONUS_BF}`];

export default function BlackFriday() {
  return (
    <div className="min-h-svh bg-carvao pb-24 text-bone lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* faixa no topo */}
      <div aria-hidden className="overflow-hidden bg-ouro py-2 text-carvao">
        <div className="bf-faixa flex w-max">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {[...FAIXA, ...FAIXA].map((t, i) => (
                <span key={i} className="flex items-center whitespace-nowrap font-display text-sm uppercase tracking-wide sm:text-base">
                  <span className="px-4">{t}</span>
                  <span>★</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" prefetch={false} className="font-display text-2xl leading-none">
          DLM<span className="sr-only"> · {PERFIL.marca}</span>
        </Link>
        <a
          href={CTA_BF}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ouro/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ouro transition-colors hover:bg-ouro hover:text-carvao"
        >
          WhatsApp
        </a>
      </header>

      <main>
        {/* abertura */}
        <section className="relative">
          <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pb-16 lg:pt-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-grafite px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ouro ring-1 ring-ouro/30">
                Black Friday · {PERFIL.marca}
              </p>
              <h1 className="mt-4 font-display text-[clamp(3rem,13vw,6.5rem)] uppercase leading-[0.88]">
                Consultoria com <span className="text-ouro">{DESCONTO_BF}% OFF</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
                Treino e dieta individualizados com <strong className="font-semibold text-bone">{PERFIL.nome}</strong>, primeiro brasileiro
                campeão da WNBF. A partir de <strong className="font-semibold text-ouro">{reais(anual.porMes)} por mês</strong> no plano anual,
                em até {PARCELAS_BF}x sem juros e com {BONUS_BF}.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#planos"
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-ouro px-7 py-4 font-display text-xl uppercase tracking-wide text-carvao transition-transform hover:-translate-y-0.5"
                >
                  <span aria-hidden className="bf-brilho absolute inset-y-0 left-0 w-1/4 bg-white/45" />
                  Ver os planos
                </a>
                <a
                  href={CTA_BF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-bone/25 px-7 py-4 font-display text-xl uppercase tracking-wide transition-colors hover:border-ouro hover:text-ouro"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            {/* atleta no círculo amarelo */}
            <div className="relative mx-auto aspect-square w-[min(19rem,78vw)] lg:w-full lg:max-w-[26rem]">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#f6d773_0%,#f0c541_55%,#b8901f_100%)] shadow-[0_0_120px_10px_rgba(240,197,65,0.28)]" />
              <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
                <div className="absolute left-1/2 top-[-12%] aspect-[811/1100] w-[86%] -translate-x-1/2">
                  <Image
                    src={recorte}
                    alt={`${PERFIL.nome}, atleta WNBF PRO`}
                    fill
                    preload
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 360px, 270px"
                    className="object-contain object-top drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
              <div className="bf-selo absolute -right-2 top-[8%] grid size-24 place-items-center rounded-full bg-carvao text-center ring-2 ring-ouro sm:size-28">
                <span className="font-display text-3xl leading-none text-ouro sm:text-4xl">
                  -{DESCONTO_BF}%
                  <span className="block font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-bone">todos os planos</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* planos */}
        <section id="planos" aria-labelledby="planos-titulo" className="scroll-mt-4 px-4 py-12 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="planos-titulo" className="font-display text-[clamp(2.2rem,7vw,4rem)] uppercase leading-[0.95]">
              Escolha seu <span className="text-ouro">plano</span>
            </h2>
            <p className="mt-3 max-w-2xl text-bone/70">
              {DESCONTO_BF}% de desconto em todos os planos, à vista ou em {PARCELAS_BF}x sem juros no cartão. Todos levam {BONUS_BF}.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
              {PLANOS_BF.map((p) => (
                <li key={p.id} className={cn("flex", p.destaque && "order-first md:order-none")}>
                  <CardPlano plano={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* incluso */}
        <section id="incluso" aria-labelledby="incluso-titulo" className="bg-bone px-4 py-14 text-carvao sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="incluso-titulo" className="bf-revela font-display text-[clamp(2.2rem,7vw,4rem)] uppercase leading-[0.95]">
              O que vem na consultoria
            </h2>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {INCLUSO_BF.map((it, i) => (
                <li key={it.titulo} className="bf-revela rounded-2xl border border-carvao/10 bg-white/60 p-5">
                  <span className="font-display text-4xl leading-none text-ouro [-webkit-text-stroke:1px_#0b0b0a]">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl uppercase leading-tight">{it.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-carvao/70">{it.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* prova */}
        <section aria-labelledby="prova-titulo" className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="bf-revela">
              <h2 id="prova-titulo" className="font-display text-[clamp(2.2rem,7vw,4rem)] uppercase leading-[0.95]">
                Quem vai te <span className="text-ouro">acompanhar</span>
              </h2>
              <p className="mt-4 text-bone/75">
                {PERFIL.nome} é atleta natural e o primeiro brasileiro campeão da WNBF, a federação internacional de fisiculturismo natural.
                Formado na Europa, tem anos de experiência tanto em sala de musculação como em consultoria online.
              </p>
              <dl className="mt-6 grid grid-cols-3 divide-x divide-bone/10 rounded-2xl bg-grafite py-5 text-center">
                {[
                  ["+14 mil", "alunos atendidos"],
                  ["1º", "brasileiro campeão WNBF"],
                  ["100%", "natural"],
                ].map(([v, r]) => (
                  <div key={r} className="px-2">
                    <dt className="sr-only">{r}</dt>
                    <dd className="font-display text-3xl leading-none text-ouro sm:text-4xl">{v}</dd>
                    <dd className="mt-1.5 text-[0.7rem] leading-tight text-bone/60 sm:text-xs">{r}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="bf-revela">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-grafite p-2">
                {[
                  { src: warleyAntes, rotulo: "Antes", alt: "Warley antes da consultoria", pos: "object-[50%_30%]" },
                  { src: warleyDepois, rotulo: "Depois", alt: "Warley depois da consultoria", pos: "object-[50%_25%]" },
                ].map((f) => (
                  <div key={f.rotulo} className="relative aspect-[4/5] overflow-hidden rounded-xl">
                    <Image src={f.src} alt={f.alt} fill placeholder="blur" sizes="(min-width: 1024px) 280px, 45vw" className={cn("object-cover", f.pos)} />
                    <span
                      className={cn(
                        "absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em]",
                        f.rotulo === "Depois" ? "bg-ouro text-carvao" : "bg-carvao/75 text-bone",
                      )}
                    >
                      {f.rotulo}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="mt-2 text-xs text-bone/50">Warley, de fevereiro a setembro. Resultados individuais variam de pessoa para pessoa.</figcaption>
            </figure>
          </div>
        </section>

        {/* dúvidas: <details> nativo, sem JS */}
        <section id="duvidas" aria-labelledby="faq-titulo" className="border-t border-bone/10 px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-titulo" className="font-display text-[clamp(2.2rem,7vw,4rem)] uppercase leading-[0.95]">
              Dúvidas sobre a <span className="text-ouro">Black</span>
            </h2>
            <div className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
              {FAQ_BF.map((f) => (
                <details key={f.p} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base sm:text-lg">{f.p}</h3>
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-grafite text-xl text-ouro transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-10 leading-relaxed text-bone/70">{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* chamada final */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="bf-revela mx-auto max-w-6xl rounded-3xl bg-ouro px-6 py-10 text-center text-carvao sm:px-10 sm:py-14">
            <h2 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] uppercase leading-[0.92]">Seu melhor físico começa nesta Black</h2>
            <p className="mx-auto mt-3 max-w-xl text-carvao/75">
              {DESCONTO_BF}% OFF em todos os planos da consultoria + {BONUS_BF}. Fale com a equipe e garanta a sua condição.
            </p>
            <a
              href={CTA_BF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-carvao px-8 py-4 font-display text-xl uppercase tracking-wide text-ouro transition-transform hover:-translate-y-0.5"
            >
              Quero a Black no WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-bone/10 px-4 py-8 text-center text-xs text-bone/65 sm:px-6">
        <p>
          © {PERFIL.marca} · <Link href="/" prefetch={false} className="underline-offset-4 hover:underline">Conheça a consultoria</Link>
        </p>
      </footer>

      {/* barra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ouro/20 bg-carvao/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <a
          href={CTA_BF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-xl bg-ouro px-5 py-3.5 text-carvao"
        >
          <span className="whitespace-nowrap font-display text-lg uppercase leading-none">Garantir {DESCONTO_BF}% OFF</span>
          <span className="whitespace-nowrap text-xs font-bold max-[359px]:hidden">a partir de {reais(anual.porMes)}/mês</span>
        </a>
      </div>
    </div>
  );
}

function CardPlano({ plano: p }: { plano: PlanoBF }) {
  const claro = Boolean(p.destaque);
  return (
    <article
      className={cn(
        "flex w-full flex-col rounded-2xl p-6 sm:p-7",
        claro ? "bg-ouro text-carvao shadow-[0_30px_70px_-30px_rgba(240,197,65,0.6)]" : "border border-bone/10 bg-grafite",
      )}
    >
      {p.destaque && (
        <p className="mb-3 self-start rounded-md bg-carvao px-3 py-1.5 text-sm font-bold text-ouro">{p.destaque}</p>
      )}
      <h3 className="font-display text-4xl uppercase leading-none">{p.nome}</h3>
      <p className={cn("mt-4 text-sm", claro ? "text-carvao/70" : "text-bone/60")}>
        De <s>{reais(p.de)}</s> por
      </p>
      <p className="mt-1 flex items-start font-display leading-none">
        <span className="mr-1 mt-1 text-xl">R$</span>
        <span className="text-[clamp(3.2rem,12vw,4.2rem)] md:text-[clamp(2.8rem,4.6vw,4.4rem)]">{valor(p.por)}</span>
      </p>
      <p className="mt-1 text-sm font-bold">à vista</p>
      <ul className={cn("mt-4 space-y-1.5 text-[0.95rem] leading-snug", claro ? "text-carvao/85" : "text-bone/80")}>
        <li>Equivale a {reais(p.porMes)} por mês de acompanhamento</li>
        <li>
          Ou {PARCELAS_BF}x de {reais(p.parcela)} sem juros no cartão
        </li>
        {p.extra && <li className="font-semibold">{p.extra}</li>}
      </ul>
      <p className={cn("mt-5 border-t pt-5 font-bold", claro ? "border-carvao/15" : "border-bone/10")}>+ {BONUS_BF}</p>
      {/* no desktop o botão desce até a base, alinhando os 3 cards */}
      <div className="flex-1" />
      <a
        href={ctaPlano(p)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Quero essa condição: plano ${p.nome} por ${reais(p.por)} à vista`}
        className={cn(
          "mt-6 inline-flex items-center justify-center rounded-xl px-5 py-4 font-display text-xl uppercase tracking-wide transition-transform hover:-translate-y-0.5",
          claro ? "bg-carvao text-ouro" : "border-2 border-ouro text-ouro hover:bg-ouro hover:text-carvao",
        )}
      >
        Quero essa condição
      </a>
    </article>
  );
}
