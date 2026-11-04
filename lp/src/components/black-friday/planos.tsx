"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Gift } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import medalha from "@/assets/jayme-medalha.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { BONUS_BF, BONUS_LISTA_BF, DESCONTO_BF, INCLUSO_BF, PARCELAS_BF, PLANOS_BF, ctaPlano, reais, valor, type PlanoBF } from "@/lib/black-friday";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const [trimestral, semestral, anual] = PLANOS_BF;

/** Planos: o anual em destaque, grande e com foto; trimestral e semestral empilhados ao lado (grade 7/5, como os caminhos da LP). */
export function BfPlanos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".planos-grid", start: "top 80%" };
        gsap.from(".plano", { y: 90, rotate: (i) => (i === 0 ? -2 : 2), autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: st });
        gsap.from(".plano-preco", { yPercent: 70, duration: 1, ease: "expo.out", stagger: 0.12, delay: 0.35, scrollTrigger: st });
        gsap.fromTo(
          ".plano-foto",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".planos-grid", start: "top bottom", end: "bottom top", scrub: true } },
        );
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

        <div className="planos-grid mt-14 grid gap-4 lg:grid-cols-12">
          {/* anual: o destaque */}
          <motion.article
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="plano relative isolate grid overflow-hidden rounded-[2rem] bg-ouro text-carvao sm:grid-cols-[1.25fr_1fr] lg:col-span-7 lg:row-span-2"
          >
            <div className="flex flex-col p-6 sm:p-9">
              <span className="self-start rounded-full bg-carvao px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-ouro">{anual.destaque}</span>
              <h3 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.2rem)] uppercase leading-none">
                {anual.nome} <span className="font-serif text-[0.6em] normal-case italic text-carvao/50">12 meses</span>
              </h3>
              <Preco plano={anual} className="mt-5" />
              <ul className="mt-5 space-y-2 text-[0.95rem] leading-snug text-carvao/85">
                {[`Ou ${PARCELAS_BF}x de ${reais(anual.parcela)} sem juros no cartão`, ...(anual.extra ? [anual.extra] : [])].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Bolinha /> {t}
                  </li>
                ))}
              </ul>
              <Incluso plano={anual} className="mt-6" />
              <div className="flex-1" />
              <MagneticButton href={ctaPlano(anual)} external variant="carvao" className="mt-8 w-full sm:w-auto sm:self-start">
                Quero o anual
              </MagneticButton>
            </div>

            {/* foto: some no fundo amarelo pela esquerda */}
            <div className="relative hidden min-h-[22rem] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_40%)] sm:block">
              <div className="plano-foto absolute -inset-y-[10%] inset-x-0">
                <Image src={medalha} alt="Jayme De Lamadrid com a medalha WNBF PRO" fill placeholder="blur" sizes="(min-width: 1024px) 360px, 40vw" className="object-cover object-[50%_22%]" />
              </div>
            </div>
          </motion.article>

          {[semestral, trimestral].map((p) => (
            <CardMenor key={p.id} plano={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardMenor({ plano: p }: { plano: PlanoBF }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="plano relative flex flex-col justify-between gap-6 rounded-[2rem] bg-carvao p-6 text-bone sm:p-8 lg:col-span-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[clamp(2.2rem,3.4vw,2.9rem)] uppercase leading-none">{p.nome}</h3>
        <span className="font-serif text-3xl italic text-bone/40">{p.meses} meses</span>
      </div>
      <div>
        <Preco plano={p} escuro />
        <p className="mt-3 text-sm text-bone/65">
          {reais(p.porMes)}/mês · ou {PARCELAS_BF}x de {reais(p.parcela)} sem juros
        </p>
      </div>
      <Incluso plano={p} escuro />
      <MagneticButton href={ctaPlano(p)} external variant="ouro" className="w-full sm:w-auto sm:self-start">
        Quero esse
      </MagneticButton>
    </motion.article>
  );
}

/** O que vem no plano: os itens de todos os planos, o exclusivo (só no anual) e os bônus da Black. */
function Incluso({ plano: p, escuro = false, className = "" }: { plano: PlanoBF; escuro?: boolean; className?: string }) {
  return (
    <div className={`border-t pt-5 ${escuro ? "border-bone/15" : "border-carvao/15"} ${className}`}>
      <p className={`text-[0.65rem] font-extrabold uppercase tracking-[0.2em] ${escuro ? "text-bone/50" : "text-carvao/60"}`}>Incluso</p>
      <ul className={`mt-2 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2 ${escuro ? "text-bone/85" : ""}`}>
        {INCLUSO_BF.map((i) => (
          <li key={i.titulo}>{i.titulo}</li>
        ))}
      </ul>
      <p className={`mt-3 text-sm font-bold ${escuro ? "text-ouro" : ""}`}>+ {BONUS_BF}:</p>
      <ul className={`mt-1.5 space-y-1 text-sm ${escuro ? "text-bone/85" : ""}`}>
        {BONUS_LISTA_BF.map((b) => (
          <li key={b} className="flex gap-2">
            <Gift className={`mt-0.5 size-4 shrink-0 ${escuro ? "text-ouro" : "text-carvao/70"}`} aria-hidden />
            {b}
          </li>
        ))}
      </ul>
      {p.exclusivo && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="rounded-full bg-carvao px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-ouro">Só no anual</span>
          + {p.exclusivo}
        </p>
      )}
    </div>
  );
}

function Preco({ plano: p, escuro = false, className = "" }: { plano: PlanoBF; escuro?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className={`text-sm ${escuro ? "text-bone/55" : "text-carvao/70"}`}>
        De <s>{reais(p.de)}</s> por
      </p>
      <div className="overflow-hidden">
        <p className="plano-preco mt-1 flex items-start font-display leading-none">
          <span className="mr-1 mt-1.5 text-xl">R$</span>
          <span className={escuro ? "text-[clamp(3rem,11vw,3.8rem)]" : "text-[clamp(3.6rem,14vw,5.4rem)]"}>{valor(p.por)}</span>
          <span className="ml-2 self-end pb-1.5 text-xs font-bold uppercase tracking-[0.14em]">à vista</span>
        </p>
      </div>
    </div>
  );
}

function Bolinha() {
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-carvao text-ouro">
      <Check className="size-3" strokeWidth={3} />
    </span>
  );
}
