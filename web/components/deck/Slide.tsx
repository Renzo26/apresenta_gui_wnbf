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
      className={`relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-28 pt-16 sm:px-8 md:px-14 md:pt-20 lg:px-20 ${className}`}
    >
      {/* número do slide vazado ao fundo, como numeração de atleta */}
      <span aria-hidden className="vazado num pointer-events-none absolute -right-4 -top-10 select-none text-[13rem] leading-none md:text-[20rem] lg:right-10">
        {String(n).padStart(2, "0")}
      </span>

      <header data-reveal className="relative mb-7 flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-muted md:mb-9">
        <span className="num whitespace-nowrap text-sm tracking-normal text-ink">
          {String(n).padStart(2, "0")}
          <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="h-[2px] w-8 -skew-x-[20deg] bg-accent" />
        <span>{secao}</span>
      </header>
      <h2
        data-reveal
        className="relative max-w-[22ch] font-display text-[2.3rem] leading-[1.1] text-ink sm:text-[3.4rem] lg:max-w-[24ch] lg:text-[3.9rem]"
      >
        {titulo}
      </h2>
      <div className="relative mt-10 flex flex-1 flex-col md:mt-12">{children}</div>

      <p aria-hidden className="pointer-events-none absolute bottom-8 right-6 hidden font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted md:block lg:right-20">
        De Lamadrid Team <span className="text-accent">·</span> Natural Bodybuilding
      </p>
    </section>
  );
}
