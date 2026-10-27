"use client";

import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import podio from "@/assets/jayme-podio.jpg";
import recorte from "@/assets/jayme-recorte.png";
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

/**
 * Hero em camadas: palco da WNBF tingido de azul ao fundo, o Jayme recortado à frente
 * e título + 2 CTAs presos na base. A altura é travada na tela, então os CTAs sempre aparecem.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // parallax pelo mouse: fundo e atleta andam em sentidos opostos
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const fundoX = useTransform(sx, (v) => v * -18);
  const fundoY = useTransform(sy, (v) => v * -12);
  const atletaX = useTransform(sx, (v) => v * 14);
  const atletaY = useTransform(sy, (v) => v * 6);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-fundo-inner", { scale: 1.25, autoAlpha: 0, duration: 2.4, ease: "expo.out", delay: INTRO_DURATION - 0.6 });
        gsap.from(".hero-atleta-inner", { yPercent: 10, autoAlpha: 0, duration: 1.8, ease: "expo.out", delay: INTRO_DURATION - 0.35 });
        gsap.from(".hero-brilho", { scale: 0.5, autoAlpha: 0, duration: 2, ease: "expo.out", delay: INTRO_DURATION - 0.4 });

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-fundo-scroll", { yPercent: 18, ease: "none", scrollTrigger: st });
        gsap.to(".hero-atleta-scroll", { yPercent: 8, scale: 0.96, ease: "none", scrollTrigger: st });
        gsap.to(".hero-title", { yPercent: -30, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      {/* altura travada na tela: texto e CTAs ficam embaixo, as imagens preenchem o resto */}
      <div
        onPointerMove={onMove}
        className="relative isolate flex h-[calc(100svh-1.25rem)] min-h-[34rem] flex-col items-center justify-end overflow-hidden rounded-[2rem] bg-night px-5 pb-6 text-center text-bone sm:h-[calc(100svh-2rem)] sm:rounded-[2.75rem] sm:pb-8"
      >
        {/* 1 · fundo: palco da WNBF, sem cor e tingido no azul da marca */}
        <motion.div aria-hidden style={{ x: fundoX, y: fundoY }} className="absolute -inset-8 -z-30">
          <div className="hero-fundo-scroll absolute inset-0">
            <div className="hero-fundo-inner absolute inset-0">
              <Image src={podio} alt="" fill preload placeholder="blur" sizes="100vw" className="object-cover object-[50%_30%] opacity-40 blur-[3px] grayscale" />
              <div className="absolute inset-0 bg-indigo mix-blend-multiply" />
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_35%,transparent_0%,rgba(8,10,36,0.55)_60%,#080a24_100%)]" />
        </motion.div>

        {/* 2 · brilho atrás do atleta, para destacar a silhueta */}
        <div
          aria-hidden
          className="hero-brilho pointer-events-none absolute left-1/2 top-[4%] -z-20 aspect-square w-[min(64rem,150vw)] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(90,96,255,0.5), rgba(42,47,184,0.22) 55%, transparent)" }}
        />

        {/* 3 · o Jayme recortado, grande e centralizado; a parte de baixo some sob o texto */}
        <motion.div style={{ x: atletaX, y: atletaY }} className="pointer-events-none absolute inset-x-0 bottom-0 top-24 -z-10 sm:top-[clamp(5.5rem,13svh,8rem)]">
          <div className="hero-atleta-scroll absolute inset-0">
            <div className="hero-atleta-inner absolute left-1/2 top-0 aspect-[685/1335] h-[112%] -translate-x-1/2 sm:h-[138%]">
              <Image
                src={recorte}
                alt="Jayme De Lamadrid, atleta WNBF PRO"
                fill
                preload
                sizes="(min-width: 640px) 60vw, 130vw"
                className="object-contain object-top drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </motion.div>

        {/* 4 · escurece a base para o texto ler bem */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%] bg-gradient-to-t from-night from-25% via-night/75 to-transparent" />

        {/* bloco fixo: título, frase e os 2 CTAs */}
        <div className="hero-title relative shrink-0">
          <motion.p {...fadeUp(0)} className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-bronze sm:mb-3 sm:text-sm">
            Jayme De Lamadrid · WNBF PRO
          </motion.p>
          <SplitReveal
            as="h1"
            onScroll={false}
            delay={INTRO_DURATION - 0.3}
            className="font-display text-[length:clamp(2.5rem,min(10.5vw,9svh),8.5rem)] uppercase leading-[0.9] tracking-[0.005em] [text-shadow:0_10px_40px_rgba(8,10,36,0.8)]"
          >
            Seu melhor físico,
            <br />
            <span className="font-serif text-[0.92em] normal-case italic text-indigo-soft">sem atalhos</span>
          </SplitReveal>
        </div>

        <motion.p {...fadeUp(1)} className="relative mt-3 shrink-0 text-base leading-snug text-bone/85 sm:mt-4 sm:text-xl lg:text-2xl">
          Treino e dieta para naturais, com o Jayme do seu lado.
        </motion.p>

        <motion.div
          {...fadeUp(2)}
          className="relative mt-5 flex w-full max-w-md shrink-0 flex-col items-stretch gap-2.5 sm:mt-6 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-3"
        >
          <MagneticButton href={CTA.consultoria} external className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Quero a consultoria
          </MagneticButton>
          <MagneticButton href="#caminhos" variant="outline-light" icon={false} className="px-8 py-4 text-[0.95rem] backdrop-blur-sm sm:px-9 sm:py-5 sm:text-base">
            Planilhas e livro
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
