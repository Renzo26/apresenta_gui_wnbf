import type { Metadata, Viewport } from "next";
import { PaginaDireta } from "@/components/direta/pagina";
import { BONUS_BF, DESCONTO_BF, PARCELAS_BF, PLANOS_BF, reais } from "@/lib/black-friday";

// Página curta de venda direta (anúncios): planos no topo, formulário e checkout. Benefícios em blocos rápidos abaixo.
// Fora do Google: a /black continua sendo a página oficial da oferta (canonical).

const anual = PLANOS_BF[2];
const descricao = `Consultoria online de treino e dieta com Jayme De Lamadrid, campeão WNBF, com ${DESCONTO_BF}% de desconto: a partir de ${reais(anual.porMes)} por mês no plano anual, em até ${PARCELAS_BF}x sem juros + ${BONUS_BF}.`;

export const viewport: Viewport = { themeColor: "#0b0b0a" };

export const metadata: Metadata = {
  title: { absolute: `Black Friday: consultoria do Jayme De Lamadrid com ${DESCONTO_BF}% OFF` },
  description: descricao,
  alternates: { canonical: "/black" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/direta",
    title: `Black Friday: ${DESCONTO_BF}% OFF na consultoria do Jayme`,
    description: descricao,
  },
  twitter: { card: "summary_large_image", title: `Black Friday: ${DESCONTO_BF}% OFF na consultoria do Jayme`, description: descricao },
};

export default function BlackDireta() {
  return <PaginaDireta />;
}
