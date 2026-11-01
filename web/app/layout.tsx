import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

// Anton: o mesmo peso condensado do "DLM TEAM" no pôster do atleta.
const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
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
  themeColor: "#060920",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="grain">{children}</body>
    </html>
  );
}
