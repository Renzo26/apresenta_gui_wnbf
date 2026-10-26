"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CONTACT, CTA, PERFIL } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".footer-name",
          { yPercent: 60 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="p-2.5 pt-0 sm:p-4 sm:pt-0">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-[radial-gradient(90%_70%_at_20%_0%,#2a2fb8_0%,#10154a_50%,#080a24_100%)] px-6 pt-16 text-bone sm:rounded-[2.75rem] sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-6 flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-bronze">
                <span className="h-px w-8 bg-current" /> Vagas abrem todo mês
              </p>
              <SplitReveal className="font-display text-[clamp(3rem,7.5vw,7rem)] uppercase leading-[0.9]">
                Bora começar <span className="font-serif normal-case italic text-indigo-soft">do jeito certo?</span>
              </SplitReveal>
              <p className="mt-6 max-w-lg text-bone/65">
                Para manter o acompanhamento de perto, as vagas da consultoria são limitadas e fecham quando a equipe lota.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <MagneticButton href={CTA.consultoria} external variant="light" className="w-full lg:w-80">
                Consultoria individual
              </MagneticButton>
              <MagneticButton href={CTA.planilhas} external variant="outline-light" className="w-full lg:w-80">
                Planilhas de treino 2.0
              </MagneticButton>
              <MagneticButton href={CTA.livro} external variant="outline-light" className="w-full lg:w-80">
                Meu livro digital
              </MagneticButton>
            </div>
          </div>

          <div className="mt-16 grid gap-5 border-t border-bone/15 py-8 text-sm text-bone/65 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:py-10">
            <a href={CTA.consultoria} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-bone">
              <MessageCircle className="size-4" /> {CONTACT.phoneDisplay}
            </a>
            <p className="sm:text-center">Consultoria online · treino e dieta para naturais</p>
            <p className="sm:text-right">© {PERFIL.marca}</p>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none -mb-[0.18em] select-none overflow-hidden text-center">
          <span className="footer-name block whitespace-nowrap font-display text-[clamp(6rem,24vw,26rem)] leading-[1] text-bone/[0.07]">DLM TEAM</span>
        </div>
      </div>
    </footer>
  );
}
