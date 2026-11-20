import type { Metadata } from "next";
import { Criativos } from "@/components/telas/criativos";

export const metadata: Metadata = { title: "Criativos" };

export default function Page() {
  return <Criativos />;
}
