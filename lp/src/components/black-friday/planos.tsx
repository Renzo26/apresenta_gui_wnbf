"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { BONUS_BF, DESCONTO_BF, PARCELAS_BF, PLANOS_BF, ctaPlano, reais, valor, type PlanoBF } from "@/lib/black-friday";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Os três planos com 10% OFF, no mesmo formato dos "caminhos" da LP. No celular o anual vem primeiro. */
export function BfPlanos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".plano", {
          y: 90,
          rotate: (i) => (i === 0 ? -2 : i === 2 ? 2 : 0),
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".planos-grid", start: "top 80%" },
        });
        gsap.from(".plano-preco", {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          delay: 0.35,
          scrollTrigger: { trigger: ".planos-grid", start: "top 80%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="planos" ref={ref} className="relative scroll-mt-24 px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="01">Escolha seu plano</Eyebrow>
            <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] uppercase leading-[0.92] text-carvao">
              Três planos. <span className="font-serif normal-case italic text-ouro-deep">{DESCONTO_BF}% off em todos.</span>
            </SplitReveal>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end">
            À vista ou em {PARCELAS_BF}x sem juros no cartão, e todos levam {BONUS_BF}. O botão abre o WhatsApp com o plano escolhido.
          </p>
        </div>

        <ul className="planos-grid mt-14 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {PLANOS_BF.map((p) => (
            <li key={p.id} className={cn("flex", p.destaque && "order-first lg:order-none")}>
              <CardPlano plano={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardPlano({ plano: p }: { plano: PlanoBF }) {
  const claro = Boolean(p.destaque);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "plano relative flex w-full flex-col rounded-[2rem] p-6 sm:p-8",
        claro ? "bg-ouro text-carvao shadow-[0_40px_80px_-35px_rgba(138,106,18,0.8)] lg:-my-4 lg:py-12" : "bg-carvao text-bone",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[clamp(2.4rem,4vw,3.2rem)] uppercase leading-none">{p.nome}</h3>
        <span className={cn("font-serif text-4xl italic", claro ? "text-carvao/40" : "text-bone/40")}>{p.meses}m</span>
      </div>
      {p.destaque && (
        <span className="mt-3 self-start rounded-full bg-carvao px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-ouro">
          {p.destaque}
        </span>
      )}

      <p className={cn("mt-6 text-sm", claro ? "text-carvao/70" : "text-bone/55")}>
        De <s>{reais(p.de)}</s> por
      </p>
      <div className="overflow-hidden">
        <p className="plano-preco mt-1 flex items-start font-display leading-none">
          <span className="mr-1 mt-1.5 text-xl">R$</span>
          <span className="text-[clamp(3.4rem,13vw,4.6rem)] lg:text-[clamp(3rem,4.6vw,4.6rem)]">{valor(p.por)}</span>
        </p>
      </div>
      <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em]">à vista</p>

      <ul className={cn("mt-6 space-y-2.5 text-[0.95rem] leading-snug", claro ? "text-carvao/85" : "text-bone/80")}>
        {[
          `Equivale a ${reais(p.porMes)} por mês de acompanhamento`,
          `Ou ${PARCELAS_BF}x de ${reais(p.parcela)} sem juros no cartão`,
          ...(p.extra ? [p.extra] : []),
        ].map((t) => (
          <li key={t} className="flex gap-2.5">
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", claro ? "bg-carvao text-ouro" : "bg-ouro text-carvao")}>
              <Check className="size-3" strokeWidth={3} />
            </span>
            {t}
          </li>
        ))}
      </ul>

      <p className={cn("mt-6 border-t pt-5 font-display text-xl uppercase tracking-wide", claro ? "border-carvao/15" : "border-bone/10")}>
        + {BONUS_BF}
      </p>

      <div className="flex-1" />
      <MagneticButton href={ctaPlano(p)} external variant={claro ? "carvao" : "ouro"} className="mt-8 w-full">
        Quero essa condição
      </MagneticButton>
    </motion.article>
  );
}
