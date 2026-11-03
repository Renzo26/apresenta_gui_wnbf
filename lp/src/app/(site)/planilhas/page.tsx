import type { Metadata } from "next";
import { Planilhas } from "@/components/planilhas";

export const metadata: Metadata = {
  title: { absolute: "Treinos Essenciais 2.0 | Planilhas de treino do Jayme De Lamadrid" },
  description:
    "Treinos prontos criados pelo Jayme De Lamadrid para naturais: periodização de 1 ano em cada treino, aulas, PDFs e vídeos de execução. Garantia de 7 dias.",
  alternates: { canonical: "/planilhas" },
};

export default function Page() {
  return <Planilhas />;
}
