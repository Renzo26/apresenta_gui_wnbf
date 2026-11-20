import type { Metadata, Viewport } from "next";
import { AreaAluno } from "@/components/curso/area-aluno";

export const metadata: Metadata = {
  title: "Curso de nutrição · Área de membros",
  description: "Área de membros do curso de nutrição do De Lamadrid Team: entre com o e-mail da compra para assistir às aulas.",
  // área de alunos: fica fora do Google
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#080a24" };

export default function Page() {
  return <AreaAluno />;
}
