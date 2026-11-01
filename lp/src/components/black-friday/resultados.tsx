"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import aluno3Antes from "@/assets/aluno3-antes.jpg";
import aluno3Depois from "@/assets/aluno3-depois.jpg";
import alunoAntes from "@/assets/aluno-antes.jpg";
import alunoDepois from "@/assets/aluno-depois.jpg";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitReveal } from "@/components/ui/split-reveal";
import { DEPOIMENTOS_COMPLETOS } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Par = { nome: string; periodo: string; antes: StaticImageData; depois: StaticImageData; pos: [string, string] };

const DESTAQUE: Par = { nome: "Aluno da consultoria", periodo: "Antes → Depois", antes: aluno3Antes, depois: aluno3Depois, pos: ["50% 30%", "50% 45%"] };
const PARES: Par[] = [
  { nome: "Warley", periodo: "Fevereiro → Setembro", antes: warleyAntes, depois: warleyDepois, pos: ["50% 30%", "50% 25%"] },
  // fotos com tarja: o recorte fica acima dela
  { nome: "Aluno da consultoria", periodo: "Antes → Depois", antes: alunoAntes, depois: alunoDepois, pos: ["50% 18%", "50% 18%"] },
];

/**
 * Resultados: a transformação de corpo inteiro em destaque (o "depois" abre como cortina),
 * dois pares menores ao lado e os depoimentos da página da consultoria numa faixa que desliza.
 */
export function BfResultados() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".res-depois").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 80%" } },
          );
        });
        gsap.from(".res-par", { y: 70, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".res-grid", start: "top 80%" } });

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

          <div className="res-grid mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
            {/* destaque: corpo inteiro */}
            <article className="res-par lg:col-span-6 lg:row-span-2">
              <ParFotos par={DESTAQUE} aspecto="aspect-[9/16]" sizes="(min-width: 1024px) 300px, 46vw" />
              <Legenda par={DESTAQUE} />
            </article>
            {PARES.map((p) => (
              <article key={p.nome + p.periodo} className="res-par lg:col-span-6">
                <ParFotos par={p} aspecto="aspect-square lg:aspect-[4/3]" sizes="(min-width: 1024px) 300px, 46vw" />
                <Legenda par={p} />
              </article>
            ))}
          </div>
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

function ParFotos({ par: a, aspecto, sizes }: { par: Par; aspecto: string; sizes: string }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-[1.75rem] bg-carvao/15 p-1.5">
      {[
        { img: a.antes, r: "Antes", p: a.pos[0] },
        { img: a.depois, r: "Depois", p: a.pos[1] },
      ].map((f) => (
        <div key={f.r} className={cn("relative overflow-hidden rounded-[1.35rem]", aspecto, f.r === "Depois" && "res-depois")}>
          <Image src={f.img} alt={`${a.nome}: foto de ${f.r.toLowerCase()}`} fill placeholder="blur" sizes={sizes} className="object-cover" style={{ objectPosition: f.p }} />
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em]",
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

function Legenda({ par: a }: { par: Par }) {
  return (
    <div className="mt-3 flex items-baseline justify-between gap-4 px-1">
      <h3 className="font-display text-2xl uppercase">{a.nome}</h3>
      <span className="whitespace-nowrap text-sm text-carvao/70">{a.periodo}</span>
    </div>
  );
}
