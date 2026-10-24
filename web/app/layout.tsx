import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projeção e plano de validação do tráfego pago",
  description:
    "Como projetamos os resultados do tráfego pago da consultoria: o que é dado, o que é cálculo, o que ainda é hipótese e como vamos confirmar com a campanha rodando.",
  // Apresentação com números internos do cliente: não indexar.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Projeção e plano de validação do tráfego pago",
    description: "Dados, cálculos e hipóteses do tráfego pago — e o plano para confirmar cada um.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="grain">{children}</body>
    </html>
  );
}
