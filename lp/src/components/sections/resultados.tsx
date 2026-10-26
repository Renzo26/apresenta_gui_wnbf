"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import alunoAntes from "@/assets/aluno-antes.jpg";
import alunoDepois from "@/assets/aluno-depois.jpg";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DEPOIMENTOS } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ANTES_DEPOIS: { nome: string; periodo: string; antes: StaticImageData; depois: StaticImageData; pos: [string, string] }[] = [
  { nome: "Warley", periodo: "Fevereiro → Setembro", antes: warleyAntes, depois: warleyDepois, pos: ["50% 30%", "50% 25%"] },
  // fotos com tarja: o recorte fica acima dela
  { nome: "Aluno da consultoria", periodo: "Antes → Depois", antes: alunoAntes, depois: alunoDepois, pos: ["50% 18%", "50% 18%"] },
];

export function Resultados() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        gsap.to(".resultados-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div className="p-2.5 sm:p-4">
      <section
        id="resultados"
        ref={ref}
        className="relative overflow-hidden rounded-[2rem] bg-indigo py-16 text-bone sm:rounded-[2.75rem] sm:py-20 lg:flex lg:h-svh lg:items-center lg:py-0"
      >
        {/* no mobile: título em cima e carrossel embaixo; no desktop: uma única linha que desliza */}
        <div ref={trackRef} className="lg:flex lg:w-max lg:items-center lg:gap-5 lg:px-10">
          <div className="px-6 sm:px-10 lg:w-[25rem] lg:shrink-0 lg:px-0 lg:pr-8">
            <Eyebrow index="04" className="text-bone/70">
              Resultados
            </Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,5vw,4.8rem)] uppercase leading-[0.92]">
              Evolução <span className="font-serif normal-case italic text-bronze">de verdade</span>
            </h2>
            <p className="mt-5 max-w-sm text-bone/70">Alunos da consultoria, com treino e dieta bem orientados. Sem fórmula mágica.</p>
            <p className="mt-3 text-xs text-bone/45">Resultados individuais: variam de pessoa para pessoa.</p>
            <p className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-bone/50 lg:mt-10">
              <span className="lg:hidden">Arraste para o lado</span>
              <span className="hidden lg:inline">Continue rolando</span>
              <span className="h-px w-10 bg-current" />
            </p>
          </div>

          <div
            className="mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:scroll-px-10 sm:gap-5 sm:px-10 lg:mt-0 lg:snap-none lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden"
            data-lenis-prevent-touch
          >
            {ANTES_DEPOIS.map((a) => (
              <article key={a.nome} className="w-[min(86vw,34rem,calc((100svh-12rem)*1.6))] shrink-0 snap-start">
                <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-[1.75rem] bg-night/30 p-1.5">
                  {[
                    { img: a.antes, r: "Antes", p: a.pos[0] },
                    { img: a.depois, r: "Depois", p: a.pos[1] },
                  ].map((f) => (
                    <div key={f.r} className="relative aspect-square overflow-hidden rounded-[1.35rem]">
                      <Image
                        src={f.img}
                        alt={`${a.nome}: foto de ${f.r.toLowerCase()}`}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 280px, 43vw"
                        className="object-cover"
                        style={{ objectPosition: f.p }}
                      />
                      <span
                        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] ${
                          f.r === "Depois" ? "bg-bronze text-night" : "bg-night/70 text-bone backdrop-blur"
                        }`}
                      >
                        {f.r}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl uppercase">{a.nome}</h3>
                  <span className="text-sm text-bone/60">{a.periodo}</span>
                </div>
              </article>
            ))}

            {DEPOIMENTOS.map((d, i) => (
              <article
                key={i}
                className={`flex w-[min(72vw,19rem)] shrink-0 snap-start flex-col justify-between gap-10 rounded-[1.75rem] p-6 lg:h-[min(26rem,calc(100svh-14rem))] ${
                  i % 2 ? "bg-bone text-night" : "bg-night text-bone"
                }`}
              >
                <span className={`font-serif text-5xl italic ${i % 2 ? "text-indigo/50" : "text-bone/40"}`}>0{i + 1}</span>
                <div>
                  <p className="font-display text-6xl leading-none">{d.resultado}</p>
                  <p className={`mt-1 text-sm font-bold uppercase tracking-[0.14em] ${i % 2 ? "text-indigo" : "text-bronze"}`}>{d.rotulo}</p>
                  <p className={`mt-4 text-sm leading-relaxed ${i % 2 ? "text-ink/70" : "text-bone/70"}`}>{d.texto}</p>
                  <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.18em] ${i % 2 ? "text-ink/50" : "text-bone/45"}`}>{d.nome}</p>
                </div>
              </article>
            ))}
            <div className="w-2 shrink-0 lg:hidden" />
          </div>
        </div>

        <div className="absolute inset-x-10 bottom-8 hidden h-px bg-bone/20 lg:block">
          <div className="resultados-progress h-full origin-left scale-x-0 bg-bronze" />
        </div>
      </section>
    </div>
  );
}
