"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { BONUS_BF, DESCONTO_BF, PLANOS_BF, ctaPlano, reais } from "@/lib/black-friday";
import { CONTACT, PERFIL } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// do maior para o menor: o anual (melhor custo-benefício) em destaque
const ORDEM = [...PLANOS_BF].reverse();

/** Fechamento: mesmo rodapé da LP, com um botão por plano e "BLACK DLM" subindo ao fundo. */
export function BfFooter() {
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
      <div className="grain relative overflow-hidden rounded-[2rem] bg-[radial-gradient(90%_70%_at_20%_0%,#5c470c_0%,#1b1b1a_50%,#0b0b0a_100%)] px-6 pt-16 text-bone sm:rounded-[2.75rem] sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-6 flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-ouro">
                <span className="h-px w-8 bg-current" /> Condição de Black Friday
              </p>
              <SplitReveal className="font-display text-[clamp(3rem,7.5vw,7rem)] uppercase leading-[0.9]">
                Seu melhor físico <span className="font-serif normal-case italic text-ouro">começa nesta Black.</span>
              </SplitReveal>
              <p className="mt-6 max-w-lg text-bone/65">
                {DESCONTO_BF}% OFF em todos os planos da consultoria + {BONUS_BF}. Para manter o acompanhamento de perto, as vagas são limitadas e fecham
                quando a equipe lota.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              {ORDEM.map((p, i) => (
                <MagneticButton key={p.id} href={ctaPlano(p)} external variant={i === 0 ? "ouro" : "outline-light"} className="w-full lg:w-80">
                  {p.nome} · {reais(p.por)}
                </MagneticButton>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-5 border-t border-bone/15 py-8 text-sm text-bone/65 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:py-10">
            <a href={ctaPlano(PLANOS_BF[2])} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-bone">
              <MessageCircle className="size-4" /> {CONTACT.phoneDisplay}
            </a>
            <p className="sm:text-center">Consultoria online · treino e dieta para naturais</p>
            <p className="sm:text-right">© {PERFIL.marca}</p>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none -mb-[0.18em] select-none overflow-hidden text-center">
          <span className="footer-name block whitespace-nowrap font-display text-[clamp(5rem,20vw,22rem)] leading-[1] text-ouro/[0.1]">BLACK DLM</span>
        </div>
      </div>
    </footer>
  );
}
