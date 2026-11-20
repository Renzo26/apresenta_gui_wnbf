"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CURSO_BONUS_BF } from "@/lib/black-friday";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// capas de três aulas do curso (Bunny Stream, as mesmas da área de membros)
const CDN = "https://vz-4dc93ed2-28d.b-cdn.net";
const CAPAS = [
  { video: "a4c072ac-1467-4ae8-8fec-0c77ff13292b", titulo: "Introdução ao curso" },
  { video: "3fed74fd-7110-4c1d-b01b-72b97ee27a30", titulo: "O seu BF (%GC) determina boa parte da estratégia" },
  { video: "9189f2f5-d4a0-4152-9f6c-803a619a3d34", titulo: "Como ter recomposição corporal?" },
];

const MODULOS = ["O que um natural deve esperar", "O ponto de partida ideal", "Reset calórico: a lógica por trás", "Equalização calórica e macros"];

/** Bônus da Black: o curso de nutrição básica que vem em todos os planos. Curto, logo depois do "Por que agora". */
export function BfBonusCurso() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".bonus-capa", {
          y: 50,
          autoAlpha: 0,
          rotate: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".bonus-capas", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="px-3 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-carvao text-bone sm:rounded-[2.25rem]">
        <div className="grid items-center gap-12 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow className="text-ouro">Bônus em todos os planos</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] uppercase leading-[0.95]">
              Nutrição básica <span className="font-serif normal-case italic text-ouro">para naturais</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-bone/70">
              O curso em vídeo do time para você entender o que está comendo: calorias, macros, bulking, cutting e recomposição, sem achismo. Fica liberado
              na área de membros assim que a matrícula é confirmada.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2 text-sm font-bold">
              {[`${CURSO_BONUS_BF.aulas} aulas`, `${CURSO_BONUS_BF.modulos} módulos`, CURSO_BONUS_BF.duracao].map((t) => (
                <li key={t} className="rounded-full bg-bone/[0.06] px-4 py-2 ring-1 ring-bone/10">
                  {t}
                </li>
              ))}
            </ul>

            <MagneticButton href="#planos" variant="ouro" className="mt-9 w-full sm:w-auto">
              Quero com o bônus
            </MagneticButton>
          </div>

          <div className="lg:col-span-6">
            <div className="bonus-capas relative mx-auto aspect-[4/3] w-full max-w-md">
              {CAPAS.map((c, i) => (
                <figure
                  key={c.video}
                  className={[
                    "bonus-capa absolute w-[72%] overflow-hidden rounded-2xl bg-bone/5 shadow-2xl shadow-black/50 ring-1 ring-bone/10",
                    i === 0 && "left-0 top-0 -rotate-6",
                    i === 1 && "right-0 top-[18%] rotate-3",
                    i === 2 && "bottom-0 left-[12%] z-10 -rotate-1",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="relative aspect-video">
                    {/* capa do Bunny (domínio externo) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${CDN}/${c.video}/thumbnail.jpg`} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-carvao/20">
                      <span className="grid size-11 place-items-center rounded-full bg-ouro text-carvao">
                        <Play className="size-4 translate-x-px fill-current" aria-hidden />
                      </span>
                    </span>
                  </div>
                  <figcaption className="truncate px-4 py-2.5 text-xs font-bold text-bone/80">{c.titulo}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <ol className="grid border-t border-bone/10 sm:grid-cols-2 lg:grid-cols-4">
          {MODULOS.map((m, i) => (
            <li key={m} className="flex gap-3 border-bone/10 px-6 py-5 max-sm:border-b max-sm:last:border-b-0 sm:px-8 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(-n+2)]:border-b lg:border-r lg:[&:nth-child(-n+2)]:border-b-0 lg:last:border-r-0">
              <span className="font-serif text-xl italic leading-none text-ouro">0{i + 1}</span>
              <span className="text-sm leading-snug text-bone/75">{m}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
