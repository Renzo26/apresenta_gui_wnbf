"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CreditCard, Gift, Percent } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
// só a metade de cima do recorte: é o que aparece no círculo, e o arquivo fica menor (LCP)
import busto from "@/assets/jayme-bf-busto.png";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CTA_BF, DESCONTO_BF, PARCELAS_BF, PLANOS_BF, reais } from "@/lib/black-friday";
import { BF_INTRO_DURATION } from "./intro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// o título e a foto só se movem (sem opacidade 0): pintam já por baixo da intro e o LCP não espera a animação
const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: BF_INTRO_DURATION + 0.3 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
});

const SELOS = [
  { icon: Percent, texto: [`${DESCONTO_BF}% OFF`, "todos os planos"] },
  { icon: CreditCard, texto: [`${PARCELAS_BF}x sem juros`, "no cartão"] },
  { icon: Gift, texto: ["3 bônus", "da Black"] },
];

const anual = PLANOS_BF[2];

/** Hero da Black: mesmo palco da LP (o Jayme sai do círculo), em preto e amarelo. Altura travada na tela: CTAs sempre visíveis. */
export function BfHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-anel", { scale: 0.6, duration: 1.6, ease: "expo.out", delay: BF_INTRO_DURATION - 0.5 });
        gsap.from(".hero-atleta", { yPercent: 18, duration: 1.8, ease: "expo.out", delay: BF_INTRO_DURATION - 0.3 });
        gsap.from(".hero-brilho", { scale: 0.4, autoAlpha: 0, duration: 2, ease: "expo.out", delay: BF_INTRO_DURATION - 0.5 });
        gsap.from(".hero-linha", { scaleX: 0, duration: 1.2, ease: "expo.out", delay: BF_INTRO_DURATION + 0.4 });

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
      <div className="grain relative isolate flex h-[calc(100svh-1.25rem)] min-h-[36rem] flex-col items-center overflow-hidden rounded-[2rem] bg-carvao px-5 pb-5 pt-20 text-center text-bone sm:h-[calc(100svh-2rem)] sm:rounded-[2.75rem] sm:pb-6 sm:pt-24">
        {/* fundo: luz amarela de palco */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30"
          style={{ background: "radial-gradient(45% 45% at 50% 38%, rgba(240,197,65,0.32) 0%, rgba(138,106,18,0.18) 45%, transparent 75%)" }}
        />
        <span
          aria-hidden
          className="hero-mono pointer-events-none absolute left-1/2 top-[40%] -z-20 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(14rem,36vw,36rem)] leading-none text-bone/[0.04] sm:block"
        >
          BLACK
        </span>

        {/* palco: círculo amarelo + atleta saindo pela borda de cima */}
        <div className="flex min-h-0 w-full flex-1 items-end justify-center">
          <div className="hero-palco relative aspect-square h-[min(100%,92vw)] max-h-full origin-bottom">
            <div
              aria-hidden
              className="hero-brilho absolute -inset-[18%] -z-10 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(240,197,65,0.45), rgba(138,106,18,0.18) 60%, transparent)" }}
            />
            <div className="hero-anel absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#f6d773_0%,#f0c541_55%,#8a6a12_100%)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-ouro/40" />

            <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
              <div className="hero-atleta absolute left-1/2 top-[-11%] aspect-[811/1100] w-[86%] -translate-x-1/2">
                <Image
                  src={busto}
                  alt="Jayme De Lamadrid, atleta WNBF PRO"
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 640px) 560px, 80vw"
                  className="object-contain object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>

            {/* base escurecida: o título fica legível sobre o corpo */}
            <div aria-hidden className="absolute -inset-x-[12%] bottom-[-2%] h-[58%] bg-gradient-to-t from-carvao from-20% via-carvao/80 to-transparent" />

            {/* selo giratório */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: BF_INTRO_DURATION + 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[-4%] top-[10%] grid aspect-square w-[24%] min-w-20 max-w-36 place-items-center rounded-full bg-carvao text-ouro ring-2 ring-ouro"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="selo-bf" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-current text-[7.4px] font-extrabold uppercase tracking-[0.16em]">
                  <textPath href="#selo-bf">black friday • consultoria dlm •</textPath>
                </text>
              </svg>
              <span className="font-display text-xl sm:text-3xl">-{DESCONTO_BF}%</span>
            </motion.div>
          </div>
        </div>

        {/* texto por cima da base do círculo */}
        <div className="hero-texto relative z-10 -mt-[clamp(6rem,24svh,15rem)] flex shrink-0 flex-col items-center">
          <motion.p
            {...fadeUp(0)}
            className="mb-2 flex items-center gap-2.5 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ouro sm:mb-3 sm:gap-5 sm:text-xs sm:tracking-[0.35em]"
          >
            <span className="hero-linha h-px w-5 origin-right bg-ouro sm:w-14" />
            Black Friday · Jayme De Lamadrid
            <span className="hero-linha h-px w-5 origin-left bg-ouro sm:w-14" />
          </motion.p>

          <motion.h1
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ delay: BF_INTRO_DURATION, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[length:clamp(2.5rem,min(11vw,8.5svh),8rem)] uppercase leading-[0.9] tracking-[0.005em] [text-shadow:0_10px_40px_rgba(11,11,10,0.7)]"
          >
            Consultoria com {DESCONTO_BF}% off,
            <br />
            <span className="font-serif text-[0.8em] normal-case italic text-ouro">só nesta Black.</span>
          </motion.h1>
        </div>

        <motion.p {...fadeUp(1)} className="relative z-10 mt-3 max-w-xl shrink-0 text-[0.95rem] leading-snug text-bone/85 sm:mt-4 sm:text-lg lg:text-xl">
          Treino e dieta com o Jayme a partir de <strong className="font-semibold text-ouro">{reais(anual.porMes)} por mês</strong>, em até {PARCELAS_BF}x
          sem juros + os três bônus da Black.
        </motion.p>

        <motion.div
          {...fadeUp(2)}
          className="relative z-10 mt-4 flex w-full max-w-md shrink-0 flex-col items-stretch gap-2.5 sm:mt-5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
        >
          <MagneticButton href="#planos" variant="ouro" icon={false} className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Ver os planos
          </MagneticButton>
          <MagneticButton href={CTA_BF} external variant="outline-light" className="px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base">
            Falar no WhatsApp
          </MagneticButton>
        </motion.div>

        <motion.ul {...fadeUp(3)} className="relative z-10 mt-5 hidden shrink-0 items-center divide-x divide-bone/15 sm:tall:flex" aria-label="Condições da Black">
          {SELOS.map((s) => (
            <li key={s.texto.join(" ")} className="flex items-center gap-3 px-4 text-left sm:px-7">
              <s.icon className="size-6 text-ouro sm:size-7" strokeWidth={1.4} />
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
