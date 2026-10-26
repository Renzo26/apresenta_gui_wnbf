"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import palco from "@/assets/jayme-palco.jpg";
import medalha from "@/assets/jayme-medalha.jpg";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CTA, PROVAS } from "@/lib/content";
import { INTRO_DURATION } from "./intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: INTRO_DURATION + 0.25 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hero-frame",
          { clipPath: "inset(100% 0 0 0 round 2rem)" },
          { clipPath: "inset(0% 0 0 0 round 2rem)", duration: 1.6, ease: "expo.inOut", delay: INTRO_DURATION - 0.5 },
        );
        gsap.from(".hero-frame-img", { scale: 1.3, duration: 2.2, ease: "expo.out", delay: INTRO_DURATION - 0.3 });

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-frame-inner", { yPercent: 12, ease: "none", scrollTrigger: st });
        gsap.to(".hero-coin", { yPercent: -50, rotate: -10, ease: "none", scrollTrigger: st });
        gsap.to(".hero-copy", { yPercent: 16, autoAlpha: 0.2, ease: "none", scrollTrigger: st });
        gsap.to(".hero-mono", { xPercent: -12, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      <div className="grain relative isolate min-h-[calc(100svh-1.25rem)] overflow-hidden rounded-[2rem] bg-[radial-gradient(110%_80%_at_80%_10%,#2a2fb8_0%,#10154a_45%,#080a24_100%)] text-bone sm:min-h-[calc(100svh-2rem)] sm:rounded-[2.75rem]">
        {/* monograma gigante ao fundo */}
        <span
          aria-hidden
          className="hero-mono pointer-events-none absolute -bottom-[0.12em] left-0 -z-10 select-none whitespace-nowrap font-display text-[clamp(12rem,34vw,34rem)] leading-none text-bone/[0.04]"
        >
          DLM TEAM
        </span>

        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-14">
          <div className="hero-copy lg:col-span-7">
            <motion.p {...fadeUp(0)} className="mb-6 flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-bronze">
              <span className="h-px w-8 bg-current" /> WNBF PRO · Consultoria para naturais
            </motion.p>

            <SplitReveal
              as="h1"
              onScroll={false}
              delay={INTRO_DURATION - 0.35}
              className="font-display text-[length:clamp(3.2rem,min(9vw,13svh),8.2rem)] uppercase leading-[0.9] tracking-[0.005em]"
            >
              Seu melhor físico, <span className="font-serif text-[0.9em] normal-case italic text-indigo-soft">sem atalhos</span>
            </SplitReveal>

            <motion.p {...fadeUp(1)} className="mt-7 max-w-lg text-base leading-relaxed text-bone/75 sm:text-lg">
              Treino e planejamento alimentar individualizados, com acompanhamento do Jayme e da equipe pelo WhatsApp. A primeira consultoria
              pensada para naturais do Brasil.
            </motion.p>

            <motion.div {...fadeUp(2)} className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton href={CTA.consultoria} external>
                Quero a consultoria
              </MagneticButton>
              <MagneticButton href="#caminhos" variant="outline-light" icon={false}>
                Planilhas e livro
              </MagneticButton>
            </motion.div>

            <motion.dl {...fadeUp(3)} className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-bone/15 pt-6 sm:gap-6">
              {PROVAS.map((p) => (
                <div key={p.rotulo}>
                  <dt className="sr-only">{p.rotulo}</dt>
                  <dd className="font-display text-3xl sm:text-4xl">{p.valor}</dd>
                  <dd className="mt-1 text-xs leading-snug text-bone/55">{p.rotulo}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <div className="relative mx-auto w-full max-w-[min(26rem,80vw)] lg:col-span-5 lg:ml-auto lg:mr-6 lg:max-w-[min(26rem,calc((100svh-10rem)*0.66))]">
            <div className="hero-frame relative aspect-[2/3] overflow-hidden rounded-[2rem] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.8)]">
              <div className="hero-frame-inner absolute -inset-y-[8%] inset-x-0">
                <Image
                  src={palco}
                  alt="Jayme De Lamadrid posando no palco de uma competição da WNBF"
                  fill
                  preload
                  placeholder="blur"
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="hero-frame-img object-cover object-[50%_30%]"
                />
              </div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent" />
              <p className="absolute bottom-5 right-5 text-right font-serif text-2xl italic leading-none text-bone">Jayme De Lamadrid</p>
            </div>

            {/* selo giratório */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: INTRO_DURATION + 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-3 top-[10%] grid size-28 place-items-center rounded-full bg-bronze text-night sm:-right-10 sm:size-36"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="selo" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-current text-[7.4px] font-extrabold uppercase tracking-[0.16em]">
                  <textPath href="#selo">natural bodybuilding • wnbf pro •</textPath>
                </text>
              </svg>
              <span className="font-display text-2xl sm:text-3xl">DLM</span>
            </motion.div>

            {/* moeda com a foto da medalha */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: INTRO_DURATION + 0.8, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -left-4 sm:-left-14"
            >
              <div className="hero-coin relative size-32 overflow-hidden rounded-full border-[6px] border-night shadow-xl sm:size-40">
                <Image src={medalha} alt="Jayme com a medalha WNBF PRO" fill placeholder="blur" sizes="160px" className="object-cover object-[55%_30%]" />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#caminhos"
          {...fadeUp(4)}
          className="absolute bottom-6 right-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/60 lg:flex"
        >
          Role para conhecer
          <span className="relative h-10 w-px overflow-hidden bg-bone/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-bone" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
