"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CTA, METODO } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Os 5 passos: título fixo à esquerda e uma linha que se preenche com o scroll. */
export function Metodo() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".metodo-linha", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".metodo-lista", start: "top 65%", end: "bottom 65%", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".passo").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0.25, x: 30 },
            { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" } },
          );
          gsap.fromTo(
            el.querySelector(".passo-num"),
            { backgroundColor: "rgba(242,239,232,0.06)", color: "rgba(242,239,232,0.6)" },
            { backgroundColor: "#c9a25b", color: "#080a24", duration: 0.5, scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reverse" } },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="metodo" ref={ref} className="p-2.5 sm:p-4">
      <div className="grain relative rounded-[2rem] bg-night px-6 py-20 text-bone sm:rounded-[2.75rem] sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Eyebrow index="03" className="text-bone/60">
                Como funciona
              </Eyebrow>
              <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,5.5vw,5.2rem)] uppercase leading-[0.92]">
                Um método, <span className="font-serif normal-case italic text-indigo-soft">cinco passos</span>
              </SplitReveal>
              <p className="mt-6 max-w-sm leading-relaxed text-bone/65">
                Nada de planilha genérica. Cada etapa existe para o seu plano ficar do seu tamanho e continuar evoluindo com você.
              </p>
              <MagneticButton href={CTA.consultoria} external variant="bronze" className="mt-10">
                Começar minha avaliação
              </MagneticButton>
            </div>
          </div>

          <ol className="metodo-lista relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-bone/10" />
            <span aria-hidden className="metodo-linha absolute bottom-6 left-[1.6rem] top-6 w-px origin-top scale-y-0 bg-bronze" />
            {METODO.map((m, i) => (
              <li key={m.titulo} className="passo relative flex gap-6 py-7">
                <span className="passo-num relative z-10 grid size-[3.25rem] shrink-0 place-items-center rounded-full bg-bone/5 font-display text-xl ring-1 ring-bone/15">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">{m.titulo}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-bone/65">{m.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
