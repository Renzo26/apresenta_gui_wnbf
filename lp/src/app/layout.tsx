import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CONTACT, PERFIL } from "@/lib/content";
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
    default: "Jayme De Lamadrid | Consultoria online para naturais · WNBF PRO",
    template: "%s | De Lamadrid Team",
  },
  description:
    "Consultoria online de treino e dieta para naturais com Jayme De Lamadrid, primeiro brasileiro campeão da WNBF. Planilhas de treino e livro digital.",
  keywords: [
    "consultoria online",
    "consultoria fitness",
    "fisiculturismo natural",
    "natural bodybuilding",
    "WNBF",
    "treino e dieta",
    "Jayme De Lamadrid",
    "planilha de treino",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: PERFIL.marca,
    title: "Jayme De Lamadrid | Consultoria para naturais",
    description: "Treino e planejamento alimentar individualizados, com acompanhamento do Jayme e da equipe.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#080a24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${PERFIL.marca} — Consultoria online`,
  description: "Consultoria online de treino e dieta para naturais.",
  telephone: `+${CONTACT.phoneE164}`,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image.jpg`,
  areaServed: "BR",
  founder: { "@type": "Person", name: PERFIL.nome, jobTitle: "Atleta WNBF PRO e treinador" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${instrument.variable} ${manrope.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
