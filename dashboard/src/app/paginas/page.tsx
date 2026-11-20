import type { Metadata } from "next";
import { Paginas } from "@/components/telas/paginas";

export const metadata: Metadata = { title: "Páginas" };

export default function Page() {
  return <Paginas />;
}
