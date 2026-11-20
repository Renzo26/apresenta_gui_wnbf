import type { Metadata } from "next";
import { PainelCurso } from "@/components/curso/painel";

export const metadata: Metadata = {
  title: "Painel do curso de nutrição",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PainelCurso />;
}
