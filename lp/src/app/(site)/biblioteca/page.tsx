import type { Metadata } from "next";
import { Biblioteca } from "@/components/biblioteca";

export const metadata: Metadata = {
  title: "Biblioteca de exercícios",
  description: "Vídeos de execução gravados pelo Jayme De Lamadrid: técnica, amplitude e cadência de cada exercício.",
  alternates: { canonical: "/biblioteca" },
  // área de alunos: fica fora do Google
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Biblioteca />;
}
