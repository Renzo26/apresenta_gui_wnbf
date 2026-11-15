"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CONSULTORIA, CTA } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Consultoria online de treino e dieta para naturais": o que é, para quem é e o que vem.
 * É o texto que responde direto ao que as pessoas pesquisam no Google e perguntam ao ChatGPT.
 */
export function Consultoria() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".consultoria-item", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".consultoria-grid", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="consultoria" ref={ref} className="relative scroll-mt-24 px-6 pb-24 sm:px-10 sm:pb-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="03">A consultoria</Eyebrow>
            <SplitReveal className="mt-6 font-display text-[clamp(2.6rem,5.4vw,5rem)] uppercase leading-[0.92] text-night">
              Consultoria online de treino e dieta <span className="font-serif normal-case italic text-indigo">para naturais</span>
            </SplitReveal>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end">{CONSULTORIA.intro}</p>
        </div>

        <div className="consultoria-grid mt-14 grid gap-4 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
            {CONSULTORIA.blocos.map((b) => (
              <article key={b.titulo} className="consultoria-item rounded-[1.5rem] border border-night/10 bg-bone p-6">
                <h3 className="font-display text-xl uppercase tracking-wide text-night">{b.titulo}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{b.texto}</p>
              </article>
            ))}
          </div>

          <article className="consultoria-item flex flex-col rounded-[2rem] bg-night p-6 text-bone sm:p-9 lg:col-span-5">
            <h3 className="font-display text-2xl uppercase tracking-wide">O que você recebe</h3>
            <ul className="mt-6 space-y-4">
              {CONSULTORIA.inclui.map((t) => (
                <li key={t} className="flex gap-3 leading-snug text-bone/85">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-indigo-soft text-night">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex-1" />
            <MagneticButton href={CTA.consultoria} external variant="light" className="mt-8 w-full sm:w-auto sm:self-start">
              Quero a consultoria
            </MagneticButton>
          </article>
        </div>
      </div>
    </section>
  );
}
