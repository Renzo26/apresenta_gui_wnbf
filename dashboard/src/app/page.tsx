import type { Metadata } from "next";
import { VisaoGeral } from "@/components/telas/visao-geral";

export const metadata: Metadata = { title: { absolute: "Visão geral · Tráfego DLM" } };

export default function Page() {
  return <VisaoGeral />;
}
