"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import palco from "@/assets/jayme-palco.jpg";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CTA } from "@/lib/content";
import { INTRO_DURATION } from "./intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: INTRO_DURATION + 0.35 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

/** Hero centrado: a foto é o palco, o título entra na frente dela e os dois CTAs ficam logo abaixo. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hero-arch",
          { clipPath: "inset(100% 0 0 0 round 999px 999px 2rem 2rem)" },
          { clipPath: "inset(0% 0 0 0 round 999px 999px 2rem 2rem)", duration: 1.6, ease: "expo.inOut", delay: INTRO_DURATION - 0.5 },
        );
        gsap.from(".hero-arch-img", { scale: 1.3, duration: 2.2, ease: "expo.out", delay: INTRO_DURATION - 0.3 });
        gsap.from(".hero-spot", { autoAlpha: 0, scale: 0.6, duration: 2, ease: "expo.out", delay: INTRO_DURATION - 0.4 });

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-arch-inner", { yPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to(".hero-arch", { scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(".hero-title", { yPercent: -25, ease: "none", scrollTrigger: st });
        gsap.to(".hero-mono", { scale: 1.15, autoAlpha: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      {/* altura travada na tela: texto e CTAs ficam embaixo e a foto ocupa todo o espaço que sobra */}
      <div className="grain relative isolate flex h-[calc(100svh-1.25rem)] min-h-[34rem] flex-col items-center overflow-hidden rounded-[2rem] bg-night px-5 pb-6 pt-20 text-center text-bone sm:h-[calc(100svh-2rem)] sm:rounded-[2.75rem] sm:pb-8 sm:pt-24">
        {/* holofote de palco atrás da foto */}
        <div
          aria-hidden
          className="hero-spot pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[120%] w-[min(80rem,160vw)] -translate-x-1/2"
          style={{ background: "radial-gradient(45% 45% at 50% 38%, rgba(42,47,184,0.8) 0%, rgba(16,21,74,0.6) 45%, transparent 75%)" }}
        />
        <span
          aria-hidden
          className="hero-mono pointer-events-none absolute left-1/2 top-[40%] -z-10 hidden -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(16rem,48vw,46rem)] leading-none text-bone/[0.035] sm:block"
        >
          DLM
        </span>

        {/* foto central: cresce até preencher a altura livre */}
        <div className="flex min-h-0 w-full flex-1 justify-center">
          <div className="relative aspect-[3/4] h-full max-w-full sm:aspect-[4/5]">
            <div className="hero-arch absolute inset-0 overflow-hidden rounded-b-[2rem] rounded-t-full shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]">
              <div className="hero-arch-inner absolute -inset-y-[8%] inset-x-0">
                <Image
                  src={palco}
                  alt="Jayme De Lamadrid posando no palco de uma competição da WNBF"
                  fill
                  preload
                  placeholder="blur"
                  sizes="(min-width: 640px) 560px, 90vw"
                  className="hero-arch-img object-cover object-[50%_18%]"
                />
              </div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-night from-15% via-night/70 to-transparent" />
            </div>

            {/* selo giratório */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: INTRO_DURATION + 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-3 top-[14%] grid size-20 place-items-center rounded-full bg-bronze text-night sm:-right-14 sm:size-32"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="selo" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-current text-[7.4px] font-extrabold uppercase tracking-[0.16em]">
                  <textPath href="#selo">natural bodybuilding • wnbf pro •</textPath>
                </text>
              </svg>
              <span className="font-display text-lg sm:text-3xl">DLM</span>
            </motion.div>
          </div>
        </div>

        {/* bloco fixo: título por cima da base da foto, frase e os 2 CTAs */}
        <div className="hero-title relative z-10 -mt-[clamp(5rem,17svh,10rem)] shrink-0">
          <motion.p {...fadeUp(0)} className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-bronze sm:mb-3 sm:text-sm">
            Jayme De Lamadrid · WNBF PRO
          </motion.p>
          <SplitReveal
            as="h1"
            onScroll={false}
            delay={INTRO_DURATION - 0.3}
            className="font-display text-[length:clamp(2.5rem,min(10.5vw,8.5svh),8rem)] uppercase leading-[0.9] tracking-[0.005em] [text-shadow:0_10px_40px_rgba(8,10,36,0.7)]"
          >
            Seu melhor físico,
            <br />
            <span className="font-serif text-[0.92em] normal-case italic text-indigo-soft">sem atalhos</span>
          </SplitReveal>
        </div>

        <motion.p {...fadeUp(1)} className="relative z-10 mt-3 shrink-0 text-base leading-snug text-bone/85 sm:mt-4 sm:text-xl lg:text-2xl">
          Treino e dieta para naturais, com o Jayme do seu lado.
        </motion.p>

        <motion.div
          {...fadeUp(2)}
          className="relative z-10 mt-5 flex w-full max-w-md shrink-0 flex-col items-stretch gap-2.5 sm:mt-6 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-3"
        >
          <MagneticButton href={CTA.consultoria} external className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Quero a consultoria
          </MagneticButton>
          <MagneticButton href="#caminhos" variant="outline-light" icon={false} className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Planilhas e livro
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
