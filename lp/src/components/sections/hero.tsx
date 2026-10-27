"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Dumbbell, Leaf } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import recorte from "@/assets/jayme-palco-recorte.png";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CTA } from "@/lib/content";
import { INTRO_DURATION } from "./intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: INTRO_DURATION + 0.35 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

const SELOS = [
  { icon: Dumbbell, texto: ["Método", "comprovado"] },
  { icon: Leaf, texto: ["100%", "natural"] },
  { icon: BarChart3, texto: ["Resultados", "reais"] },
];

/**
 * Hero: o Jayme "sai" do círculo (a cabeça passa da borda), título por cima da base
 * do círculo, 2 CTAs e três selos. A altura é travada na tela, então os CTAs sempre aparecem.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-anel", { scale: 0.6, autoAlpha: 0, duration: 1.6, ease: "expo.out", delay: INTRO_DURATION - 0.5 });
        gsap.from(".hero-atleta", { yPercent: 18, autoAlpha: 0, duration: 1.8, ease: "expo.out", delay: INTRO_DURATION - 0.3 });
        gsap.from(".hero-brilho", { scale: 0.4, autoAlpha: 0, duration: 2, ease: "expo.out", delay: INTRO_DURATION - 0.5 });
        gsap.from(".hero-linha", { scaleX: 0, duration: 1.2, ease: "expo.out", delay: INTRO_DURATION + 0.4 });

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-palco", { yPercent: 8, scale: 0.94, ease: "none", scrollTrigger: st });
        gsap.to(".hero-texto", { yPercent: -20, ease: "none", scrollTrigger: st });
        gsap.to(".hero-mono", { scale: 1.15, autoAlpha: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      <div className="grain relative isolate flex h-[calc(100svh-1.25rem)] min-h-[36rem] flex-col items-center overflow-hidden rounded-[2rem] bg-night px-5 pb-5 pt-20 text-center text-bone sm:h-[calc(100svh-2rem)] sm:rounded-[2.75rem] sm:pb-6 sm:pt-24">
        {/* fundo: luz azul de palco + névoa na base */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30"
          style={{
            background:
              "radial-gradient(45% 45% at 50% 38%, rgba(42,47,184,0.8) 0%, rgba(16,21,74,0.6) 45%, transparent 75%)",
          }}
        />
        <span
          aria-hidden
          className="hero-mono pointer-events-none absolute left-1/2 top-[40%] -z-20 hidden -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(16rem,46vw,44rem)] leading-none text-bone/[0.035] sm:block"
        >
          DLM
        </span>

        {/* palco: círculo dourado + atleta saindo pela borda de cima */}
        <div className="flex min-h-0 w-full flex-1 items-end justify-center">
          <div className="hero-palco relative aspect-square h-[min(100%,92vw)] max-h-full origin-bottom">
            {/* brilho atrás */}
            <div
              aria-hidden
              className="hero-brilho absolute -inset-[18%] -z-10 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(42,47,184,0.6), rgba(16,21,74,0.25) 60%, transparent)" }}
            />

            {/* círculo com interior índigo e contorno discreto */}
            <div className="hero-anel absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#2a2fb8_0%,#10154a_60%,#080a24_100%)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-indigo-soft/30" />

            {/* atleta: recorte com a metade de cima livre (a cabeça passa do anel) e a de baixo presa no círculo */}
            <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
              <div className="hero-atleta absolute left-1/2 top-[-11%] aspect-[811/1984] w-[86%] -translate-x-1/2">
                <Image
                  src={recorte}
                  alt="Jayme De Lamadrid, atleta WNBF PRO, posando no palco"
                  fill
                  preload
                  sizes="(min-width: 640px) 560px, 80vw"
                  className="object-contain object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>

            {/* base escurecida: o título fica legível sobre o corpo */}
            <div aria-hidden className="absolute -inset-x-[12%] bottom-[-2%] h-[58%] bg-gradient-to-t from-night from-20% via-night/80 to-transparent" />

            {/* selo giratório */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: INTRO_DURATION + 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[-4%] top-[10%] grid aspect-square w-[24%] min-w-20 max-w-36 place-items-center rounded-full bg-bronze text-night"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="selo" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-current text-[7.4px] font-extrabold uppercase tracking-[0.16em]">
                  <textPath href="#selo">natural bodybuilding • wnbf pro •</textPath>
                </text>
              </svg>
              <span className="font-display text-xl sm:text-3xl">DLM</span>
            </motion.div>
          </div>
        </div>

        {/* texto por cima da base do círculo */}
        <div className="hero-texto relative z-10 -mt-[clamp(6rem,24svh,15rem)] flex shrink-0 flex-col items-center">
          <motion.p
            {...fadeUp(0)}
            className="mb-2 flex items-center gap-2.5 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-bronze sm:mb-3 sm:gap-5 sm:text-xs sm:tracking-[0.35em]"
          >
            <span className="hero-linha h-px w-5 origin-right bg-bronze sm:w-14" />
            Jayme De Lamadrid · WNBF PRO
            <span className="hero-linha h-px w-5 origin-left bg-bronze sm:w-14" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO_DURATION, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[length:clamp(2.5rem,min(10.5vw,8.5svh),8rem)] uppercase leading-[0.9] tracking-[0.005em] [text-shadow:0_10px_40px_rgba(8,10,36,0.7)]"
          >
            Seu melhor físico,
            <br />
            <span className="font-serif text-[0.92em] normal-case italic text-indigo-soft">de forma natural.</span>
          </motion.h1>
        </div>

        <motion.p {...fadeUp(1)} className="relative z-10 mt-3 max-w-xl shrink-0 text-[0.95rem] leading-snug text-bone/85 sm:mt-4 sm:text-lg lg:text-xl">
          Treino, dieta e acompanhamento personalizados para você alcançar o seu máximo potencial, sem atalhos e com saúde.
        </motion.p>

        <motion.div
          {...fadeUp(2)}
          className="relative z-10 mt-4 flex w-full max-w-md shrink-0 flex-col items-stretch gap-2.5 sm:mt-5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
        >
          <MagneticButton href={CTA.consultoria} external className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Quero a consultoria
          </MagneticButton>
          <MagneticButton href="#caminhos" variant="outline-light" icon={false} className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Planilhas e livro
          </MagneticButton>
        </motion.div>

        <motion.ul
          {...fadeUp(3)}
          className="relative z-10 mt-5 hidden shrink-0 items-center divide-x divide-bone/15 sm:tall:flex"
          aria-label="Diferenciais"
        >
          {SELOS.map((s) => (
            <li key={s.texto.join(" ")} className="flex items-center gap-3 px-4 text-left sm:px-7">
              <s.icon className="size-6 text-indigo-soft sm:size-7" strokeWidth={1.4} />
              <span className="text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.2em] text-bone/75 sm:text-[0.7rem]">
                {s.texto[0]}
                <br />
                {s.texto[1]}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
