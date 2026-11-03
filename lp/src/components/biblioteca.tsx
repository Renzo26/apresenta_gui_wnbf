"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowLeft, Play, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BIBLIOTECA } from "@/lib/biblioteca";

gsap.registerPlugin(useGSAP);

const semAcento = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ancora = (g: string) => semAcento(g).replace(/[^a-z]+/g, "-");

/** Biblioteca de vídeos de execução (área de alunos): grupos, busca e cada exercício abrindo o vídeo. */
export function Biblioteca() {
  const ref = useRef<HTMLElement>(null);
  const [busca, setBusca] = useState("");
  const total = BIBLIOTECA.reduce((n, g) => n + g.exercicios.length, 0);

  const grupos = useMemo(() => {
    const q = semAcento(busca.trim());
    if (!q) return BIBLIOTECA;
    return BIBLIOTECA.map((g) => ({ ...g, exercicios: g.exercicios.filter((e) => semAcento(e.nome).includes(q)) })).filter((g) => g.exercicios.length);
  }, [busca]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".bib-topo > *", { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 });
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="min-h-svh bg-night text-bone">
      <header className="grain relative overflow-hidden px-6 pb-12 pt-8 sm:px-10 sm:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          style={{ background: "radial-gradient(60% 80% at 80% 0%, rgba(42,47,184,0.55), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-bone/60 transition-colors hover:text-bone">
            <ArrowLeft className="size-4" /> De Lamadrid Team
          </Link>
          <div className="bib-topo mt-10">
            <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-bronze">
              <span className="h-px w-8 bg-current" /> {total} vídeos de execução
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6rem)] uppercase leading-[0.9]">
              Biblioteca <span className="font-serif normal-case italic text-indigo-soft">do Jayme</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bone/75">
              Técnica, amplitude e cadência. Toque em qualquer exercício para assistir à demonstração gravada pelo Jayme; o vídeo abre em tela cheia.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/50">
              Assista com atenção antes de aplicar no seu treino e use como referência sempre que tiver dúvida sobre a execução de algum movimento.
            </p>
          </div>
        </div>
      </header>

      {/* busca + atalhos dos grupos */}
      <div className="sticky top-0 z-20 border-y border-bone/10 bg-night/90 px-6 py-3 backdrop-blur-xl sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex items-center gap-2 rounded-full bg-bone/[0.06] px-4 py-2.5 ring-1 ring-bone/10 focus-within:ring-indigo-soft lg:w-72">
            <Search className="size-4 shrink-0 text-bone/50" />
            <span className="sr-only">Buscar exercício</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar exercício"
              className="w-full bg-transparent text-base outline-none placeholder:text-bone/40"
            />
          </label>
          <nav aria-label="Grupos" className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {grupos.map((g) => (
              <a
                key={g.grupo}
                href={`#${ancora(g.grupo)}`}
                className="shrink-0 whitespace-nowrap rounded-full border border-bone/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-bone/75 transition-colors hover:border-bronze hover:text-bone"
              >
                {g.grupo}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-10">
        {grupos.length === 0 && <p className="py-16 text-center text-bone/60">Nenhum exercício encontrado para “{busca}”.</p>}
        {grupos.map((g) => (
          <section key={g.grupo} id={ancora(g.grupo)} className="scroll-mt-40 pt-8 first:pt-0 lg:scroll-mt-24">
            <h2 className="flex items-baseline justify-between gap-4 border-b border-bone/10 pb-3 font-display text-3xl uppercase sm:text-4xl">
              {g.grupo}
              <span className="font-sans text-xs font-semibold tracking-[0.14em] text-bone/45">{g.exercicios.length} vídeos</span>
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {g.exercicios.map((e) => (
                <li key={e.video}>
                  <a
                    href={e.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl bg-bone/[0.04] p-3 pr-4 ring-1 ring-bone/10 transition-colors hover:bg-indigo/40 hover:ring-indigo-soft/50"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo text-bone transition-transform duration-300 group-hover:scale-105">
                      <Play className="size-4 fill-current" />
                    </span>
                    <span className="flex-1 text-[0.95rem] font-medium leading-snug">{e.nome}</span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-bronze">assistir</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="border-t border-bone/10 px-6 py-8 text-center text-xs text-bone/45">O único time especializado em naturais · DLM Team</footer>
    </main>
  );
}
