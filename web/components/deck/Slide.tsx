import type { ReactNode } from "react";

export function Slide({
  n,
  total,
  secao,
  titulo,
  children,
  id,
  className = "",
}: {
  n: number;
  total: number;
  secao: string;
  titulo: ReactNode;
  children?: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-slide
      aria-label={`Slide ${n}`}
      className={`relative flex min-h-[100svh] flex-col px-4 pb-28 pt-16 sm:px-8 md:px-14 md:pt-20 lg:px-20 ${className}`}
    >
      <header data-reveal className="mb-8 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-muted md:mb-12">
        <span className="whitespace-nowrap text-ink">
          {String(n).padStart(2, "0")}
          <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="h-px w-10 bg-line" />
        <span>{secao}</span>
      </header>
      <h2
        data-reveal
        className="max-w-[24ch] font-serif text-[2.1rem] leading-[1.04] tracking-[-0.02em] text-ink [font-variation-settings:'SOFT'_50] sm:text-5xl lg:max-w-[28ch] lg:text-[3.6rem]"
      >
        {titulo}
      </h2>
      <div className="mt-10 flex flex-1 flex-col md:mt-12">{children}</div>
    </section>
  );
}
