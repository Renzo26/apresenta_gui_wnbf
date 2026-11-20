import type { Metadata } from "next";
import { Vendas } from "@/components/telas/vendas";

export const metadata: Metadata = { title: "Vendas e CRM" };

export default function Page() {
  return <Vendas />;
}
