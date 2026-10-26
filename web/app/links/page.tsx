import type { Metadata, Viewport } from "next";
import { Anton } from "next/font/google";
import { LinkTree } from "@/components/links/LinkTree";
import { PERFIL } from "@/lib/links";

const display = Anton({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: `${PERFIL.nome} | ${PERFIL.selo}`,
  description: `Consultoria individual de treino e dieta, planilhas de treino e livro digital de ${PERFIL.nome}, ${PERFIL.marca}.`,
  // diferente da apresentação, esta página é pública
  robots: { index: true, follow: true },
  openGraph: {
    title: `${PERFIL.nome} | ${PERFIL.selo}`,
    description: `${PERFIL.marca} · ${PERFIL.linha}`,
    type: "profile",
    locale: "pt_BR",
    images: [{ url: "/img/dlm-atleta.png", width: 792, height: 1080, alt: PERFIL.nome }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d2e",
};

export default function Page() {
  return (
    <div className={display.variable}>
      <LinkTree />
    </div>
  );
}
