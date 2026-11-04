"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { DESCONTO_BF, MOTIVOS_BF, PARCELAS_BF } from "@/lib/black-friday";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Por que essa é a melhor condição da história da consultoria: entre os resultados e o Jayme. */
export function BfMotivos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".motivo", {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".motivos-lista", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  const ganhos = ["Foge do reajuste", `${DESCONTO_BF}% de desconto`, `${PARCELAS_BF}x sem juros`, "Renova sempre por esse valor"];

  return (
    <section ref={ref} className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
      <div className="grain relative rounded-[2rem] bg-carvao px-6 py-20 text-bone sm:rounded-[2.75rem] sm:px-10 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <Eyebrow index="05" className="text-bone/60">
            A melhor condição da história
          </Eyebrow>
          <SplitReveal className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,5.6vw,5.2rem)] uppercase leading-[0.92]">
            Por que você <span className="font-serif normal-case italic text-ouro">não pode perder</span> essa condição?
          </SplitReveal>

          <ol className="motivos-lista mt-14 grid gap-4 md:grid-cols-3">
            {MOTIVOS_BF.map((m, i) => (
              <li key={m.titulo} className="motivo flex flex-col gap-4 rounded-[1.75rem] bg-bone/[0.04] p-6 ring-1 ring-bone/10 sm:p-8">
                <span className="font-serif text-4xl italic text-ouro">0{i + 1}</span>
                <h3 className="font-display text-2xl uppercase leading-tight tracking-wide sm:text-3xl">{m.titulo}</h3>
                <p className="leading-relaxed text-bone/70">{m.texto}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-8 border-t border-bone/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-bone/50">Ou seja, entrando agora você</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ganhos.map((g) => (
                  <li key={g} className="rounded-full bg-ouro px-4 py-2 text-sm font-bold text-carvao">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <MagneticButton href="#planos" variant="ouro" className="w-full shrink-0 sm:w-auto">
              Garantir minha vaga
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
