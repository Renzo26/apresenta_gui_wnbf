import { ImageOff } from "lucide-react";
import Image from "next/image";
import type { Criativo } from "@/lib/dados";
import { cn } from "@/lib/utils";

/** Miniatura do anúncio: imagem local (exemplo), URL da Meta (dados reais) ou um vazio discreto. */
export function ImagemCriativo({ imagem, alt, sizes, className }: { imagem: Criativo["imagem"]; alt: string; sizes: string; className?: string }) {
  if (!imagem) {
    return (
      <div className={cn("absolute inset-0 grid place-items-center text-apagado", className)}>
        <span className="flex flex-col items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em]">
          <ImageOff className="size-6" aria-hidden />
          Sem prévia
        </span>
      </div>
    );
  }
  if (typeof imagem === "string") {
    // miniaturas da Meta: links temporários do CDN deles, sem passar pelo otimizador
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imagem} alt={alt} loading="lazy" referrerPolicy="no-referrer" className={cn("absolute inset-0 size-full object-cover", className)} />;
  }
  return <Image src={imagem} alt={alt} fill placeholder="blur" sizes={sizes} className={cn("object-cover", className)} />;
}
