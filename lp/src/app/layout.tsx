import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Manrope } from "next/font/google";
import { Rastreio } from "@/components/rastreio";
import { CONTACT, PERFIL, RESUMO } from "@/lib/content";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Consultoria online de treino e dieta para naturais | Jayme De Lamadrid",
    template: "%s | De Lamadrid Team",
  },
  description:
    "Consultoria online de treino e dieta para naturais com Jayme De Lamadrid, primeiro brasileiro campeão da WNBF. Hipertrofia, emagrecimento e recomposição corporal sem anabolizantes, com acompanhamento diário pelo WhatsApp.",
  keywords: [
    "consultoria online de treino e dieta",
    "consultoria para natural",
    "consultoria fitness online",
    "consultoria de hipertrofia online",
    "treino e dieta para natural",
    "fisiculturismo natural",
    "WNBF",
    "Jayme De Lamadrid",
    "De Lamadrid Team",
    "planilha de treino",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: PERFIL.marca,
    title: "Consultoria online de treino e dieta para naturais | Jayme De Lamadrid",
    description: RESUMO,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  // verificação do domínio no Gerenciador de Negócios da Meta (vale para todas as páginas)
  verification: { other: { "facebook-domain-verification": "bjsass3914bur4hv84ymxwhfp263e2" } },
};

export const viewport: Viewport = {
  themeColor: "#080a24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// quem é o Jayme, o que a De Lamadrid Team vende e onde mais eles estão (sameAs): Google e IAs ligam tudo à mesma pessoa
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#jayme`,
      name: PERFIL.nome,
      jobTitle: "Atleta de fisiculturismo natural e treinador",
      description:
        "Primeiro brasileiro campeão da WNBF, federação internacional de fisiculturismo natural. Formado na Europa, autor do livro A Musculação para Naturais e fundador da De Lamadrid Team.",
      award: "Primeiro brasileiro campeão da WNBF (World Natural Bodybuilding Federation)",
      knowsAbout: ["fisiculturismo natural", "musculação", "hipertrofia", "nutrição esportiva", "emagrecimento"],
      image: `${siteUrl}/opengraph-image.jpg`,
      url: siteUrl,
      sameAs: [PERFIL.instagram],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#consultoria`,
      name: PERFIL.marca,
      alternateName: `${PERFIL.marca} — Consultoria online de treino e dieta para naturais`,
      description: RESUMO,
      telephone: `+${CONTACT.phoneE164}`,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image.jpg`,
      areaServed: { "@type": "Country", name: "Brasil" },
      founder: { "@id": `${siteUrl}/#jayme` },
      sameAs: [PERFIL.instagram],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Consultoria online de treino e dieta para naturais",
        itemListElement: ["Trimestral", "Semestral", "Anual"].map((plano) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `Consultoria online · plano ${plano.toLowerCase()}`, serviceType: "Consultoria de treino e dieta" },
        })),
      },
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#site`, name: PERFIL.marca, url: siteUrl, inLanguage: "pt-BR", publisher: { "@id": `${siteUrl}/#consultoria` } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${instrument.variable} ${manrope.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Rastreio />
      </body>
    </html>
  );
}
