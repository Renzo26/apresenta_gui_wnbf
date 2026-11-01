"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
// os mesmos alunos e a mesma ordem da página da consultoria (delamadridteam.com/consultoria)
import aluno1Antes from "@/assets/resultados/aluno1-antes.jpg";
import aluno1Depois from "@/assets/resultados/aluno1-depois.jpg";
import aluno2Antes from "@/assets/resultados/aluno2-antes.jpg";
import aluno2Depois from "@/assets/resultados/aluno2-depois.jpg";
import aluno5Antes from "@/assets/resultados/aluno5-antes.jpg";
import aluno5Depois from "@/assets/resultados/aluno5-depois.jpg";
import aluno6Antes from "@/assets/resultados/aluno6-antes.jpg";
import aluno6Depois from "@/assets/resultados/aluno6-depois.jpg";
// cópias sem as faixas pretas de cima e de baixo das fotos originais
import aluno3Antes from "@/assets/aluno-antes-bf.jpg";
import aluno3Depois from "@/assets/aluno-depois-bf.jpg";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitReveal } from "@/components/ui/split-reveal";
import { DEPOIMENTOS_COMPLETOS } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FOTOS: [StaticImageData, StaticImageData][] = [
  [aluno1Antes, aluno1Depois],
  [aluno2Antes, aluno2Depois],
  [aluno3Antes, aluno3Depois],
  [warleyAntes, warleyDepois],
  [aluno5Antes, aluno5Depois],
  [aluno6Antes, aluno6Depois],
];

const RESULTADOS = DEPOIMENTOS_COMPLETOS.map((d, i) => ({ ...d, antes: FOTOS[i][0], depois: FOTOS[i][1] }));

/** Resultados como na página da consultoria: um card por aluno com antes/depois (foto inteira), resultado e depoimento. */
export function BfResultados() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".res-card").forEach((el, i) => {
          gsap.from(el, { y: 60, autoAlpha: 0, duration: 1, ease: "expo.out", delay: (i % 3) * 0.1, scrollTrigger: { trigger: el, start: "top 88%" } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <div className="p-2.5 sm:p-4">
      <section id="resultados" ref={ref} className="grain relative rounded-[2rem] bg-ouro px-6 py-16 text-carvao sm:rounded-[2.75rem] sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="04" className="text-carvao/70">
                Evolução real
              </Eyebrow>
              <SplitReveal className="mt-6 font-display text-[clamp(2.6rem,5.2vw,4.8rem)] uppercase leading-[0.92]">
                Resultados dos <span className="font-serif normal-case italic">nossos alunos</span>
              </SplitReveal>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-carvao/80">
                Veja a transformação de pessoas comuns que tiveram o nosso acompanhamento e mudaram seus corpos.
              </p>
              <p className="mt-3 text-xs text-carvao/80">Resultados individuais: variam de pessoa para pessoa.</p>
            </div>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {RESULTADOS.map((r, i) => (
              <li key={i} className="res-card flex flex-col overflow-hidden rounded-[1.75rem] bg-carvao text-bone">
                {/* fotos inteiras: cada uma no mesmo quadro, sem recorte */}
                <div className="grid grid-cols-2 gap-1.5 p-1.5">
                  {[
                    { img: r.antes, rotulo: "Antes" },
                    { img: r.depois, rotulo: "Depois" },
                  ].map((f) => (
                    <div key={f.rotulo} className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-grafite">
                      <Image
                        src={f.img}
                        alt={`${r.nome ?? "Aluno da consultoria"}: foto de ${f.rotulo.toLowerCase()}`}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 45vw"
                        className="object-contain"
                      />
                      <span
                        className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] ${
                          f.rotulo === "Depois" ? "bg-ouro text-carvao" : "bg-carvao/70 text-bone backdrop-blur"
                        }`}
                      >
                        {f.rotulo}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-5">
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-4xl leading-none text-ouro">{r.resultado}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-bone/70">{r.rotulo}</span>
                  </p>
                  <p className="mt-4 flex gap-3 text-[0.95rem] leading-relaxed text-bone/80">
                    <Quote className="mt-1 size-4 shrink-0 text-ouro" strokeWidth={1.6} />
                    <span>“{r.texto}”</span>
                  </p>
                  {r.nome && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone/50">{r.nome}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
