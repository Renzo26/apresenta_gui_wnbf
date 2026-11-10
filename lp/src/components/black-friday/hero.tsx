"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CreditCard, Gift, Percent } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
// só a metade de cima do recorte: é o que aparece no arco, e o arquivo fica menor (LCP)
import busto from "@/assets/jayme-bf-busto.png";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CTA_BF, DESCONTO_BF, PARCELAS_BF } from "@/lib/black-friday";
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


/**
 * Hero em pôster: "BLACK FRIDAY" vazado ao fundo, texto à esquerda e o Jayme saindo de um arco amarelo,
 * com um ticket de preço por cima. No celular o arco vem em cima e o texto embaixo; a altura é travada
 * na tela, então os CTAs sempre aparecem.
 */
export function BfHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const d = BF_INTRO_DURATION;
        gsap.from(".hero-arco", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.4, ease: "expo.out", delay: d - 0.5 });
        gsap.from(".hero-atleta", { yPercent: 22, duration: 1.8, ease: "expo.out", delay: d - 0.3 });
        gsap.from(".hero-poster span", { yPercent: 100, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: d - 0.6 });
        gsap.from(".hero-linha", { scaleX: 0, duration: 1.2, ease: "expo.out", delay: d + 0.4 });
        // ticket balança de leve

        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-palco", { yPercent: 10, ease: "none", scrollTrigger: st });
        gsap.to(".hero-texto", { yPercent: -12, ease: "none", scrollTrigger: st });
        gsap.to(".hero-poster", { xPercent: -8, autoAlpha: 0.3, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="p-2.5 sm:p-4">
      <div className="grain relative isolate h-[calc(100svh-1.25rem)] min-h-[36rem] overflow-hidden rounded-[2rem] bg-carvao text-bone sm:h-[calc(100svh-2rem)] sm:rounded-[2.75rem]">
        {/* luz amarela vinda da direita */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30"
          style={{ background: "radial-gradient(55% 60% at 50% 30%, rgba(240,197,65,0.22) 0%, transparent 70%)" }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 hidden lg:block" style={{ background: "radial-gradient(40% 70% at 78% 55%, rgba(240,197,65,0.28) 0%, transparent 75%)" }} />

        {/* BLACK FRIDAY vazado, atrás de tudo */}
        <p
          aria-hidden
          className="hero-poster pointer-events-none absolute inset-x-0 top-[12%] -z-20 flex select-none flex-col overflow-hidden px-4 font-display uppercase leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgba(240,197,65,0.22)] sm:px-10 lg:top-[8%]"
        >
          <span className="block text-[clamp(6rem,30vw,22rem)]">Black</span>
          <span className="block text-right text-[clamp(6rem,30vw,22rem)]">Friday</span>
        </p>

        <div className="mx-auto flex h-full max-w-7xl flex-col px-5 pb-5 pt-20 sm:px-10 sm:pb-8 sm:pt-24 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-10">
          {/* palco: arco + atleta + ticket (vem antes do texto no celular) */}
          <div className="hero-palco relative order-first flex min-h-0 flex-1 items-end justify-center lg:order-last lg:col-span-5 lg:h-full lg:flex-none lg:items-end">
            <div className="relative aspect-[4/5] h-[min(100%,78vw)] max-h-full lg:h-[86%]">
              <div className="hero-arco absolute inset-0 rounded-t-full bg-[linear-gradient(180deg,#f6d773_0%,#f0c541_45%,#8a6a12_100%)] shadow-[0_40px_100px_-30px_rgba(240,197,65,0.45)]" />
              {/* atleta: a cabeça passa do topo do arco, a base fica presa nele */}
              <div className="absolute inset-0" style={{ clipPath: "inset(-30% -12% 0 -12% round 0 0 0 0)" }}>
                <div className="hero-atleta absolute left-1/2 top-[-12%] aspect-[811/1300] w-[98%] -translate-x-1/2">
                  <Image
                    src={busto}
                    alt="Jayme De Lamadrid, atleta WNBF PRO"
                    fill
                    preload
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 440px, 70vw"
                    className="object-contain object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-carvao/70 to-transparent" />

              {/* selo giratório */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: BF_INTRO_DURATION + 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-[8%] top-[6%] grid aspect-square w-[30%] min-w-20 max-w-32 place-items-center rounded-full bg-carvao text-ouro ring-2 ring-ouro"
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

          {/* texto */}
          <div className="hero-texto relative z-10 mt-5 flex shrink-0 flex-col items-center text-center lg:col-span-7 lg:mt-0 lg:items-start lg:text-left">
            <motion.p
              {...fadeUp(0)}
              className="flex items-center gap-3 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-ouro sm:text-xs sm:tracking-[0.32em]"
            >
              <span className="hero-linha h-px w-6 origin-left bg-ouro sm:w-12" />
              Black Friday · Jayme De Lamadrid
            </motion.p>

            <motion.h1
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ delay: BF_INTRO_DURATION, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 font-display text-[length:clamp(2.4rem,min(10.5vw,7.5svh),7.2rem)] uppercase leading-[0.88]"
            >
              Consultoria
              <br />
              com <span className="text-ouro">{DESCONTO_BF}% off</span>
              <span className="mt-1 block font-serif text-[0.5em] normal-case italic leading-none text-bone/90">só nesta Black.</span>
            </motion.h1>

            <motion.p {...fadeUp(1)} className="mt-3 max-w-xl text-[0.95rem] leading-snug text-bone/80 sm:mt-5 sm:text-lg">
              Treino e dieta individualizados com o primeiro brasileiro campeão da WNBF, em até {PARCELAS_BF}x sem juros + os três bônus da Black.
            </motion.p>

            <motion.div
              {...fadeUp(2)}
              className="mt-4 flex w-full max-w-md flex-col items-stretch gap-2.5 sm:mt-7 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
            >
              <MagneticButton href="#planos" variant="ouro" icon={false} className="whitespace-nowrap px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base lg:px-7 xl:px-9">
                Ver os planos
              </MagneticButton>
              <MagneticButton href={CTA_BF} external variant="outline-light" className="whitespace-nowrap px-8 py-4 text-[0.95rem] sm:px-9 sm:py-5 sm:text-base lg:px-7 xl:px-9">
                Entrar em contato
              </MagneticButton>
            </motion.div>

            <motion.ul {...fadeUp(3)} className="mt-7 hidden items-center divide-x divide-bone/15 lg:tall:flex" aria-label="Condições da Black">
              {SELOS.map((s, i) => (
                <li key={s.texto.join(" ")} className={`flex items-center gap-3 text-left ${i === 0 ? "pr-6" : "px-6"}`}>
                  <s.icon className="size-7 text-ouro" strokeWidth={1.4} />
                  <span className="text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.2em] text-bone/75">
                    {s.texto[0]}
                    <br />
                    {s.texto[1]}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
