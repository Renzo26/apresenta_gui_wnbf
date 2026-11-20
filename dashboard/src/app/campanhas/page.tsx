import type { Metadata } from "next";
import { Campanhas } from "@/components/telas/campanhas";

export const metadata: Metadata = { title: "Campanhas" };

export default function Page() {
  return <Campanhas />;
}
