import type { Metadata, Viewport } from "next";
import { PaginaBlack } from "@/components/black-friday/pagina";
import { PERFIL } from "@/lib/content";
import { BONUS_BF, DESCONTO_BF, FAQ_BF, PARCELAS_BF, PLANOS_BF, RESUMO_BF, parcelamento, reais } from "@/lib/black-friday";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const url = `${siteUrl}/black`;
const anual = PLANOS_BF[2];

const titulo = `Black Friday: consultoria do Jayme De Lamadrid com ${DESCONTO_BF}% OFF`;
const descricao = `Consultoria online de treino e dieta com Jayme De Lamadrid, campeão WNBF, com ${DESCONTO_BF}% de desconto: a partir de ${reais(anual.porMes)} por mês no plano anual, em até ${PARCELAS_BF}x sem juros + ${BONUS_BF}.`;

// barra do navegador no celular em preto, como a página
export const viewport: Viewport = { themeColor: "#0b0b0a" };

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
  alternates: { canonical: "/black" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/black",
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
        description: `De ${reais(p.de)} por ${reais(p.por)} à vista ou ${parcelamento(p)}. Equivale a ${reais(p.porMes)} por mês. Inclui ${BONUS_BF}.`,
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

export default function BlackFriday() {
  return <PaginaBlack variante="whatsapp" jsonLd={jsonLd} />;
}
