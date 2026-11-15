"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import recorte from "@/assets/jayme-palco-recorte.png";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CTA, PROVAS } from "@/lib/content";
import { INTRO_DURATION } from "./intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: INTRO_DURATION + 0.25 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * Hero: texto à esquerda com a busca no título ("consultoria online de treino e dieta para naturais")
 * e as provas logo abaixo dos botões; o Jayme no círculo à direita. No celular, o Jayme vem em cima e o texto embaixo.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".h2-anel", { scale: 0.6, autoAlpha: 0, duration: 1.6, ease: "expo.out", delay: INTRO_DURATION - 0.5 });
        gsap.from(".h2-atleta", { yPercent: 16, autoAlpha: 0, duration: 1.8, ease: "expo.out", delay: INTRO_DURATION - 0.3 });
        gsap.from(".h2-linha", { scaleX: 0, duration: 1.2, ease: "expo.out", delay: INTRO_DURATION + 0.3 });

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".h2-palco", { yPercent: 10, scale: 0.95, ease: "none", scrollTrigger: st });
        gsap.to(".h2-texto", { yPercent: -12, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 pb-8 pt-24 text-bone sm:rounded-[2.75rem] sm:px-10 sm:pb-10 lg:flex lg:h-[calc(100svh-2rem)] lg:min-h-[40rem] lg:items-center lg:pb-6 lg:pt-24">
        {/* luz de palco atrás do Jayme (à direita no computador) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(55%_45%_at_50%_28%,rgba(42,47,184,0.75)_0%,rgba(16,21,74,0.5)_45%,transparent_75%)] lg:bg-[radial-gradient(40%_55%_at_74%_50%,rgba(42,47,184,0.75)_0%,rgba(16,21,74,0.5)_45%,transparent_75%)]"
        />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* palco: no celular vem primeiro */}
          <div className="h2-palco relative mx-auto aspect-square w-[min(80vw,24rem)] origin-bottom lg:order-2 lg:col-span-5 lg:col-start-8 lg:w-full lg:max-w-[34rem]">
            <div className="h2-anel absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#2a2fb8_0%,#10154a_60%,#080a24_100%)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-indigo-soft/30" />
            <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
              <div className="h2-atleta absolute left-1/2 top-[-11%] aspect-[811/1984] w-[86%] -translate-x-1/2">
                <Image
                  src={recorte}
                  alt="Jayme De Lamadrid, primeiro brasileiro campeão da WNBF, posando no palco"
                  fill
                  preload
                  sizes="(min-width: 1024px) 480px, 80vw"
                  className="object-contain object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
            <div aria-hidden className="absolute -inset-x-[10%] bottom-[-2%] h-[30%] bg-gradient-to-t from-night from-10% to-transparent" />

            {/* selo: WNBF PRO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ delay: INTRO_DURATION + 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[12%] left-[-6%] rounded-2xl bg-bronze px-4 py-3 text-night shadow-[0_25px_50px_-15px_rgba(0,0,0,0.8)] sm:left-[-10%]"
            >
              <p className="font-display text-3xl leading-none sm:text-4xl">WNBF PRO</p>
              <p className="mt-1 text-[0.6rem] font-extrabold uppercase leading-tight tracking-[0.16em] sm:text-[0.65rem]">
                natural
                <br />
                bodybuilding
              </p>
            </motion.div>
          </div>

          {/* texto */}
          <div className="h2-texto relative z-10 text-center lg:order-1 lg:col-span-7 lg:text-left">
            <motion.p
              {...fadeUp(0)}
              className="flex items-center justify-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-bronze sm:text-xs sm:tracking-[0.32em] lg:justify-start"
            >
              <span className="h2-linha h-px w-6 origin-left bg-bronze sm:w-12" />
              Jayme De Lamadrid · De Lamadrid Team
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: INTRO_DURATION, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-display text-[clamp(2.5rem,7.4vw,6.4rem)] lg:text-[clamp(3rem,min(6.2vw,10.5svh),6.4rem)] uppercase leading-[0.9] tracking-[0.005em]"
            >
              Consultoria online de treino e dieta{" "}
              <span className="font-serif text-[0.95em] normal-case italic text-indigo-soft">para naturais.</span>
            </motion.h1>

            <motion.p {...fadeUp(1)} className="mx-auto mt-5 max-w-xl lg:mt-[min(1.25rem,2.2svh)] text-[1rem] leading-relaxed text-bone/80 sm:text-lg lg:mx-0">
              Ganhe massa, emagreça ou defina sem anabolizantes, com treino e dieta feitos para você e o Jayme e a equipe acompanhando
              de perto no WhatsApp.
            </motion.p>

            <motion.div {...fadeUp(2)} className="mt-7 lg:mt-[min(1.75rem,3svh)] flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
              <MagneticButton href={CTA.consultoria} external className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
                Quero a consultoria
              </MagneticButton>
              <MagneticButton href="#consultoria" variant="outline-light" icon={false} className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
                Como funciona
              </MagneticButton>
            </motion.div>

            {/* provas */}
            <motion.ul {...fadeUp(3)} className="mt-9 lg:mt-[min(2.25rem,4svh)] grid grid-cols-3 divide-x divide-bone/15 border-t border-bone/15 pt-6 lg:max-w-xl" aria-label="Por que a De Lamadrid Team">
              {PROVAS.map((p) => (
                <li key={p.rotulo} className="px-2 first:pl-0 sm:px-5 lg:first:pl-0">
                  <p className="font-display text-3xl leading-none text-bone sm:text-4xl">{p.valor}</p>
                  <p className="mt-1.5 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.16em] text-bone/60 sm:text-[0.68rem]">{p.rotulo}</p>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
