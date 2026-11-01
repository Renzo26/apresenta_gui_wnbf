import type { Metadata } from "next";
import { LinkTree } from "@/components/linktree";

export const metadata: Metadata = {
  title: "Links",
  description: "Consultoria individual, planilhas de treino 2.0 e livro digital do Jayme De Lamadrid.",
  alternates: { canonical: "/linktree" },
};

export default function Page() {
  return <LinkTree />;
}
