"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, BookOpen, GraduationCap, Leaf, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import medalha from "@/assets/jayme-medalha.jpg";
import podio from "@/assets/jayme-podio.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitReveal } from "@/components/ui/split-reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FATOS = [
  { icon: Award, titulo: "Primeiro brasileiro campeão da WNBF", texto: "A federação internacional de fisiculturismo natural." },
  {
    icon: GraduationCap,
    titulo: "Formado na Europa",
    texto: "Anos de experiência tanto em sala de musculação como em consultoria online.",
  },
  { icon: Users, titulo: "+14 mil alunos", texto: "Entre eles, atletas naturais como Bruno Macedo e Alison Fit." },
  { icon: BookOpen, titulo: "Autor de A Musculação para Naturais", texto: "O livro do Jayme sobre musculação para quem é natural." },
  { icon: Leaf, titulo: "Pioneiro do esporte natural", texto: "Treinador e comunicador em musculação, sem atalhos." },
];

export function Sobre() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".sobre-retrato",
          { clipPath: "inset(18% 12% 18% 12% round 2rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 2rem)", ease: "none", scrollTrigger: { trigger: ".sobre-retrato", start: "top 90%", end: "top 30%", scrub: true } },
        );
        gsap.fromTo(
          ".sobre-retrato img",
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: ".sobre-retrato", start: "top 90%", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          ".sobre-podio",
          { yPercent: 30, rotate: 8 },
          { yPercent: -10, rotate: 3, ease: "none", scrollTrigger: { trigger: ".sobre-retrato", start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(".fato", {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".fatos", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="sobre" ref={ref} className="relative px-6 py-20 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
        <div className="relative mx-auto w-full max-w-[min(28rem,86vw)] lg:col-span-5">
          <div className="sobre-retrato relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-navy">
            <Image
              src={medalha}
              alt="Jayme De Lamadrid sorrindo com a medalha WNBF PRO"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 460px, 86vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div className="sobre-podio absolute -bottom-10 -right-4 w-[42%] overflow-hidden rounded-[1.4rem] border-[6px] border-bone shadow-2xl sm:-right-10">
            <div className="relative aspect-[4/5]">
              <Image src={podio} alt="Atleta premiado no palco da WNBF Brazil" fill placeholder="blur" sizes="200px" className="object-cover object-[60%_30%]" />
            </div>
          </div>
          <span className="absolute -left-2 -top-6 -rotate-6 font-serif text-5xl italic text-indigo sm:-left-8 sm:text-6xl">Jayme</span>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow index="05">Quem vai te acompanhar</Eyebrow>
          <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,5.5vw,5rem)] uppercase leading-[0.92] text-night">
            Atleta natural, <span className="font-serif normal-case italic text-indigo">treinador de naturais</span>
          </SplitReveal>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink/70">
            Jayme De Lamadrid compete e vence no fisiculturismo natural. Na consultoria, ele e a equipe aplicam com você o mesmo cuidado
            que levaram ao palco: método, constância e nenhum atalho.
          </p>

          <ul className="fatos mt-10 grid gap-3 sm:grid-cols-2">
            {FATOS.map((f, i) => (
              <motion.li
                key={f.titulo}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`fato group rounded-[1.5rem] p-5 ${i === 0 ? "bg-night text-bone sm:col-span-2" : "border border-night/10 bg-bone"}`}
              >
                <f.icon className={`size-6 transition-transform duration-500 group-hover:-rotate-12 ${i === 0 ? "text-bronze" : "text-indigo"}`} strokeWidth={1.4} />
                <h3 className="mt-5 font-display text-xl uppercase leading-tight tracking-wide">{f.titulo}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${i === 0 ? "text-bone/65" : "text-ink/65"}`}>{f.texto}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
