"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import aluno3Antes from "@/assets/aluno3-antes.jpg";
import aluno3Depois from "@/assets/aluno3-depois.jpg";
// cópias sem a faixa preta que havia embaixo das fotos originais
import alunoAntes from "@/assets/aluno-antes-bf.jpg";
import alunoDepois from "@/assets/aluno-depois-bf.jpg";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitReveal } from "@/components/ui/split-reveal";
import { DEPOIMENTOS_COMPLETOS } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Par = { nome: string; periodo: string; antes: StaticImageData; depois: StaticImageData };

const PARES: Par[] = [
  { nome: "Aluno da consultoria", periodo: "Antes → Depois", antes: aluno3Antes, depois: aluno3Depois },
  { nome: "Warley", periodo: "Fevereiro → Setembro", antes: warleyAntes, depois: warleyDepois },
  { nome: "Aluno da consultoria", periodo: "Antes → Depois", antes: alunoAntes, depois: alunoDepois },
];

/**
 * Resultados: antes e depois com as fotos inteiras (mesma altura, largura no formato original, sem recorte)
 * e os depoimentos da página da consultoria numa faixa que desliza.
 */
export function BfResultados() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".res-par", { y: 70, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".res-lista", start: "top 85%" } });

        // depoimentos: faixa infinita que pausa com o mouse em cima
        const loop = gsap.to(".res-faixa", { xPercent: -50, ease: "none", duration: 60, repeat: -1 });
        const faixa = ref.current?.querySelector<HTMLElement>(".res-depo");
        const pausa = () => gsap.to(loop, { timeScale: 0, duration: 0.5 });
        const segue = () => gsap.to(loop, { timeScale: 1, duration: 0.5 });
        faixa?.addEventListener("pointerenter", pausa);
        faixa?.addEventListener("pointerleave", segue);
        return () => {
          faixa?.removeEventListener("pointerenter", pausa);
          faixa?.removeEventListener("pointerleave", segue);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div className="p-2.5 sm:p-4">
      <section id="resultados" ref={ref} className="grain relative overflow-hidden rounded-[2rem] bg-ouro py-16 text-carvao sm:rounded-[2.75rem] sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="04" className="text-carvao/70">
                Resultados dos nossos alunos
              </Eyebrow>
              <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,5.5vw,5rem)] uppercase leading-[0.92]">
                Evolução <span className="font-serif normal-case italic">real</span>
              </SplitReveal>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-carvao/80">
                Veja a transformação de pessoas comuns que tiveram o nosso acompanhamento e mudaram seus corpos.
              </p>
              <p className="mt-3 text-xs text-carvao/80">Resultados individuais: variam de pessoa para pessoa.</p>
            </div>
          </div>

        </div>

        {/* fileira: centralizada quando cabe, desliza para o lado quando não cabe */}
        <div className="mt-12 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-lenis-prevent-touch>
          <ul className="res-lista mx-auto flex w-max snap-x snap-mandatory gap-4 px-6 sm:gap-6 sm:px-10">
            {PARES.map((p) => (
              <li key={p.nome + p.periodo} className="res-par flex shrink-0 snap-center flex-col">
                <ParFotos par={p} />
                {/* w-0 min-w-full: a legenda acompanha a largura das fotos em vez de esticar o card */}
                <div className="mt-3 flex w-0 min-w-full flex-wrap items-baseline justify-between gap-x-4 px-1">
                  <h3 className="font-display text-xl uppercase sm:text-2xl">{p.nome}</h3>
                  <span className="whitespace-nowrap text-sm text-carvao/70">{p.periodo}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* depoimentos */}
        <div className="res-depo mt-14 overflow-hidden sm:mt-20" data-lenis-prevent-touch>
          <ul className="res-faixa flex w-max gap-4 px-2 sm:gap-5">
            {[...DEPOIMENTOS_COMPLETOS, ...DEPOIMENTOS_COMPLETOS].map((d, i) => (
              <li
                key={i}
                aria-hidden={i >= DEPOIMENTOS_COMPLETOS.length || undefined}
                className={cn(
                  "flex w-[min(80vw,23rem)] shrink-0 flex-col justify-between gap-8 rounded-[1.75rem] p-6 sm:p-7",
                  i % 2 ? "bg-bone text-carvao" : "bg-carvao text-bone",
                )}
              >
                <div>
                  <Quote className={cn("size-7", i % 2 ? "text-ouro-deep" : "text-ouro")} strokeWidth={1.4} />
                  <p className="mt-4 text-[0.95rem] leading-relaxed">“{d.texto}”</p>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", i % 2 ? "text-carvao/55" : "text-bone/50")}>{d.nome}</p>
                  <p className="text-right">
                    <span className="block font-display text-4xl leading-none">{d.resultado}</span>
                    <span className={cn("text-[0.65rem] font-bold uppercase tracking-[0.14em]", i % 2 ? "text-ouro-deep" : "text-ouro")}>{d.rotulo}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ParFotos({ par: a }: { par: Par }) {
  return (
    <div className="flex h-[19rem] gap-1.5 rounded-[1.5rem] bg-carvao/15 p-1.5 sm:h-[22rem] xl:h-[24rem]">
      {[
        { img: a.antes, r: "Antes" },
        { img: a.depois, r: "Depois" },
      ].map((f) => (
        <div key={f.r} className="relative h-full overflow-hidden rounded-[1.1rem]">
          <Image src={f.img} alt={`${a.nome}: foto de ${f.r.toLowerCase()}`} placeholder="blur" sizes="(min-width: 1024px) 320px, 45vw" className="h-full w-auto" />
          <span
            className={cn(
              "absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em]",
              f.r === "Depois" ? "bg-carvao text-ouro" : "bg-carvao/60 text-bone backdrop-blur",
            )}
          >
            {f.r}
          </span>
        </div>
      ))}
    </div>
  );
}
