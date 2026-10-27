"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Check, ClipboardList } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import palco from "@/assets/jayme-palco.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CTA } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INCLUSO = ["Avaliação completa do seu perfil", "Plano pronto em 3 a 5 dias úteis", "Suporte diário no WhatsApp", "Reavaliação todo mês"];

/** Os três CTAs da página, lado a lado e sem ambiguidade. */
export function Caminhos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".caminho", {
          y: 90,
          rotate: (i) => (i === 0 ? -2 : 2),
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".caminhos-grid", start: "top 80%" },
        });
        gsap.fromTo(
          ".caminho-img",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".caminhos-grid", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="caminhos" ref={ref} className="relative px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="01">Comece aqui</Eyebrow>
            <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] uppercase leading-[0.92] text-night">
              Três caminhos. <span className="font-serif normal-case italic text-indigo">Um só objetivo.</span>
            </SplitReveal>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end">
            Escolha o formato que cabe no seu momento. Todos levam direto ao WhatsApp do time, para você tirar dúvidas antes de decidir.
          </p>
        </div>

        <div className="caminhos-grid mt-14 grid gap-4 lg:grid-cols-12">
          {/* 01 — consultoria: o caminho principal */}
          <article className="caminho group relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-night p-6 text-bone sm:p-9 lg:col-span-7 lg:row-span-2">
            <div className="caminho-img absolute -inset-y-[10%] inset-x-0 -z-10">
              <Image
                src={palco}
                alt="Jayme De Lamadrid no palco de uma competição da WNBF"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover object-[50%_20%] transition-transform duration-[1.6s] ease-(--ease-soft) group-hover:scale-[1.04]"
              />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/75 to-night/5" />

            <span className="absolute left-6 top-6 rounded-full bg-bronze px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-night sm:left-9 sm:top-9">
              Mais completo
            </span>
            <span className="absolute right-6 top-5 font-serif text-5xl italic text-bone/70 sm:right-9 sm:top-7">01</span>

            <h3 className="font-display text-[clamp(2.6rem,5vw,4.2rem)] uppercase leading-[0.92]">Consultoria individual</h3>
            <p className="mt-3 max-w-md text-bone/75">Treino e dieta feitos para você, com o Jayme e a equipe acompanhando de perto.</p>
            <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
              {INCLUSO.map((i) => (
                <li key={i} className="flex items-center gap-2.5 text-bone/90">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-indigo">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
            <MagneticButton href={CTA.consultoria} external variant="light" className="mt-8 w-full sm:w-auto sm:self-start">
              Quero a consultoria
            </MagneticButton>
          </article>

          {/* 02 — planilhas */}
          <Cartao
            numero="02"
            tag="Treine por conta própria"
            titulo="Planilhas de treino 2.0"
            texto="As planilhas de treino do Jayme, na versão 2.0. Chame no WhatsApp para saber como funcionam."
            href={CTA.planilhas}
            botao="Quero as planilhas"
            icone={<ClipboardList className="size-6" strokeWidth={1.4} />}
            className="bg-indigo text-bone lg:col-span-5"
          />

          {/* 03 — livro */}
          <Cartao
            numero="03"
            tag="R$ 49,99"
            titulo="Meu livro digital"
            texto="O livro digital do Jayme. Garanta o seu direto pelo WhatsApp."
            href={CTA.livro}
            botao="Quero o livro"
            icone={<BookOpen className="size-6" strokeWidth={1.4} />}
            className="border border-night/10 bg-sand text-night lg:col-span-5"
            claro
          />
        </div>
      </div>
    </section>
  );
}

function Cartao({
  numero,
  tag,
  titulo,
  texto,
  href,
  botao,
  icone,
  className,
  claro = false,
}: {
  numero: string;
  tag: string;
  titulo: string;
  texto: string;
  href: string;
  botao: string;
  icone: React.ReactNode;
  className: string;
  claro?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`caminho relative flex min-h-[16.5rem] flex-col justify-between gap-8 rounded-[2rem] p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-12 place-items-center rounded-2xl ${claro ? "bg-night text-bone" : "bg-bone/15"}`}>{icone}</span>
        <span className={`font-serif text-5xl italic ${claro ? "text-night/40" : "text-bone/60"}`}>{numero}</span>
      </div>
      <div>
        <span className={`text-[0.65rem] font-extrabold uppercase tracking-[0.2em] ${claro ? "text-bronze-deep" : "text-bronze"}`}>{tag}</span>
        <h3 className="mt-2 font-display text-[clamp(2rem,3.4vw,2.9rem)] uppercase leading-[0.95]">{titulo}</h3>
        <p className={`mt-2 max-w-sm text-sm leading-relaxed ${claro ? "text-ink/65" : "text-bone/75"}`}>{texto}</p>
        <MagneticButton href={href} external variant={claro ? "indigo" : "light"} className="mt-6 w-full sm:w-auto">
          {botao}
        </MagneticButton>
      </div>
    </motion.article>
  );
}
