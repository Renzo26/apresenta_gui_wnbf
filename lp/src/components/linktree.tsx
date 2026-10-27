"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef } from "react";
import medalha from "@/assets/jayme-medalha.jpg";
import podio from "@/assets/jayme-podio.jpg";
import recorte from "@/assets/jayme-palco-recorte.png";
import treino from "@/assets/jayme-treino.jpg";
import { CTA, MARQUEE, PERFIL } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Card = {
  selo: string;
  titulo: [string, string];
  texto: string;
  itens: string[];
  botao: string;
  href: string;
  foto: StaticImageData;
  alt: string;
  posicao: string;
  tema: "indigo" | "bronze" | "bone";
  lado: "esquerda" | "direita";
};

const CARDS: Card[] = [
  {
    selo: "Mais completo",
    titulo: ["Consultoria", "individual"],
    texto: "Treino e dieta montados para você, com o Jayme acompanhando de perto.",
    itens: ["Avaliação completa", "Plano em 3 a 5 dias úteis", "Suporte diário no WhatsApp", "Reavaliação todo mês"],
    botao: "Quero a consultoria",
    href: CTA.consultoria,
    foto: podio,
    alt: "Jayme De Lamadrid no palco ao lado de um aluno campeão",
    posicao: "object-[50%_30%]",
    tema: "indigo",
    lado: "esquerda",
  },
  {
    selo: "Treine por conta própria",
    titulo: ["Planilhas de", "treino 2.0"],
    texto: "As planilhas de treino do Jayme, na versão 2.0. Chame no WhatsApp para saber como funcionam.",
    itens: ["Versão 2.0", "Dúvidas pelo WhatsApp"],
    botao: "Quero as planilhas",
    href: CTA.planilhas,
    foto: treino,
    alt: "Jayme De Lamadrid em área de treino ao ar livre",
    posicao: "object-[50%_25%]",
    tema: "bronze",
    lado: "direita",
  },
  {
    selo: "R$ 49,99",
    titulo: ["Meu livro", "digital"],
    texto: "O livro digital do Jayme. Garanta o seu direto pelo WhatsApp.",
    itens: ["Formato digital", "Compra pelo WhatsApp"],
    botao: "Garantir o meu",
    href: CTA.livro,
    foto: medalha,
    alt: "Jayme De Lamadrid com a medalha WNBF PRO",
    posicao: "object-[50%_22%]",
    tema: "bone",
    lado: "esquerda",
  },
];

const TEMAS = {
  indigo: {
    card: "bg-[linear-gradient(110deg,#10154a_0%,#1c2190_55%,#2a2fb8_100%)] text-bone ring-indigo-soft/30",
    selo: "bg-bronze text-night",
    titulo2: "text-indigo-soft",
    check: "text-bronze",
    texto: "text-bone/75",
    botao: "bg-bone text-night hover:bg-white",
    brilho: "via-indigo-soft/40",
  },
  bronze: {
    card: "bg-[linear-gradient(250deg,#3a2c12_0%,#1a150d_55%,#080a24_100%)] text-bone ring-bronze/30",
    selo: "bg-bone/10 text-bronze ring-1 ring-bronze/40",
    titulo2: "text-bronze",
    check: "text-bronze",
    texto: "text-bone/70",
    botao: "bg-bronze text-night hover:bg-[#d8b46c]",
    brilho: "via-white/50",
  },
  bone: {
    card: "bg-[linear-gradient(110deg,#f2efe8_0%,#e7e2d6_100%)] text-night ring-night/10",
    selo: "bg-night text-bone",
    titulo2: "text-indigo",
    check: "text-indigo",
    texto: "text-night/65",
    botao: "bg-indigo text-bone hover:bg-night",
    brilho: "via-white/40",
  },
} as const;

const NUMEROS = [
  { alvo: 14, pre: "+", suf: " mil", rotulo: "alunos atendidos" },
  { alvo: 1, pre: "", suf: "º", rotulo: "brasileiro campeão WNBF" },
  { alvo: 100, pre: "", suf: "%", rotulo: "natural, sem atalhos" },
];

/** /linktree: banner de abertura e um card por caminho. No celular empilha; do lg para cima, texto e atleta lado a lado. */
export function LinkTree() {
  const ref = useRef<HTMLElement>(null);

  // o atleta acompanha o mouse de leve
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const atletaX = useTransform(sx, (v) => v * 18);
  const atletaY = useTransform(sy, (v) => v * 10);
  const siglaX = useTransform(sx, (v) => v * -30);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".lt-sigla span", { yPercent: 100, autoAlpha: 0, duration: 1.4, stagger: 0.1 })
          .from(".lt-atleta", { yPercent: 14, autoAlpha: 0, duration: 1.6 }, 0.2)
          .from(".lt-texto > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.4)
          .from(".lt-linha", { scaleX: 0, duration: 1.4 }, 0.6);

        gsap.to(".lt-seta", { x: 4, y: 4, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".lt-faixa", { xPercent: -50, ease: "none", duration: 34, repeat: -1 });

        gsap.utils.toArray<HTMLElement>(".lt-card").forEach((card) => {
          const st = { trigger: card, start: "top 98%" };
          gsap.from(card, { y: 70, autoAlpha: 0, duration: 1.1, ease: "power3.out", scrollTrigger: st });
          gsap.from(card.querySelectorAll(".lt-in"), { y: 24, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay: 0.2, scrollTrigger: st });
          gsap.fromTo(card.querySelector(".lt-foto"), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo(
          ".lt-brilho",
          { xPercent: -150 },
          { xPercent: 350, duration: 1.5, ease: "power2.inOut", repeat: -1, repeatDelay: 3, stagger: 0.5 },
        );

        gsap.utils.toArray<HTMLElement>("[data-conta]").forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.conta),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => (el.textContent = `${el.dataset.pre}${Math.round(obj.v)}${el.dataset.suf}`),
          });
        });
        gsap.from(".lt-revela", { y: 40, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".lt-revela", start: "top 90%" } });
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="relative isolate overflow-x-clip bg-night text-bone">
      {/* banner de abertura */}
      <section
        className="relative overflow-hidden border-b border-indigo-soft/40 lg:h-[min(76svh,46rem)] lg:min-h-[32rem]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {/* luz azul atrás do atleta: em cima no celular, à direita no desktop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(80%_30%_at_50%_24%,rgba(42,47,184,0.85)_0%,rgba(16,21,74,0.55)_50%,transparent_80%)] lg:bg-[radial-gradient(40%_70%_at_72%_45%,rgba(42,47,184,0.85)_0%,rgba(16,21,74,0.55)_50%,transparent_80%),linear-gradient(90deg,#080a24_0%,#080a24_35%,transparent_70%)]"
        />
        <div aria-hidden className="grain absolute inset-0 -z-10" />
        {/* base escurece para o corpo "entrar" na borda */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-1/4 bg-gradient-to-t from-night/90 to-transparent lg:block" />

        {/* topo no celular */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-5 lg:hidden">
          <span className="font-display text-2xl leading-none">DLM</span>
          <Whats />
        </div>

        <div className="mx-auto flex h-full max-w-7xl flex-col items-center lg:grid lg:grid-cols-[1fr_1.1fr] lg:px-10 xl:px-14">
          {/* texto */}
          <div className="lt-texto relative z-10 -mt-16 flex max-w-lg flex-col items-center px-5 pb-6 text-center lg:mt-0 lg:items-start lg:px-0 lg:pb-0 lg:text-left">
            <Whats className="mb-6 hidden lg:inline-flex" />
            <h1 className="font-display text-[clamp(2.6rem,12vw,4rem)] uppercase leading-[0.9] lg:text-[clamp(3.5rem,5.6vw,5.5rem)]">
              {PERFIL.nome.split(" ").slice(0, 1)}
              <br />
              <span className="text-indigo-soft">{PERFIL.nome.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="mt-3 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.26em] text-bronze lg:mt-4 lg:text-xs lg:tracking-[0.3em]">
              <span className="lt-linha h-px w-6 origin-left bg-bronze lg:w-10" />
              WNBF PRO · Natural Bodybuilding
            </p>
            <p className="mt-3 text-[0.9rem] leading-snug text-bone/75 lg:mt-6 lg:text-lg lg:leading-relaxed">
              Treino, dieta e acompanhamento personalizados para você alcançar o seu máximo potencial,{" "}
              <em className="font-serif text-[1.15em] text-bone">sem atalhos e com saúde.</em>
            </p>
            <a href="#caminhos" className="group mt-9 hidden lg:inline-flex items-center gap-4 text-sm font-semibold text-bone/85 hover:text-bone">
              <span className="grid size-11 place-items-center rounded-xl bg-indigo shadow-[0_10px_30px_-8px_rgba(120,120,255,0.9)] transition-transform group-hover:scale-105">
                <ArrowDownRight className="lt-seta size-5" />
              </span>
              Escolha seu caminho logo abaixo
            </a>
          </div>

          {/* DLM gigante + atleta */}
          <div className="relative order-first h-[min(26rem,40svh,105vw)] w-full lg:order-none lg:h-full">
            <motion.div
              aria-hidden
              style={{ x: siglaX }}
              className="lt-sigla absolute inset-x-0 top-[10%] flex select-none justify-center overflow-hidden font-display text-[clamp(8.5rem,40vw,13rem)] leading-[0.85] lg:top-[14%] lg:text-[clamp(14rem,24vw,24rem)]"
            >
              <span className="text-indigo-soft/90">D</span>
              <span className="text-transparent [-webkit-text-stroke:2px_rgba(143,148,255,0.75)]">L</span>
              <span className="text-indigo-soft/90">M</span>
            </motion.div>
            <motion.div style={{ x: atletaX, y: atletaY }} className="lt-atleta absolute bottom-0 left-1/2 h-[96%] -translate-x-1/2">
              <div className="relative h-full aspect-[811/1984]">
                <Image
                  src={recorte}
                  alt={`${PERFIL.nome}, atleta WNBF PRO`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 420px, 220px"
                  className="object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
                />
              </div>
            </motion.div>
            {/* no celular a base do atleta some no fundo (mesmo tom do fundo com o grão), embaixo do nome */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0f112a] via-[#0f112a]/70 to-transparent lg:hidden" />

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[5%] top-[16%] grid size-20 place-items-center lg:right-[6%] lg:top-[22%] lg:size-28 rounded-full bg-bronze text-night shadow-2xl"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_16s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="selo-ltd" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-current text-[8px] font-extrabold uppercase tracking-[0.14em]">
                  <textPath href="#selo-ltd">natural bodybuilding • wnbf pro •</textPath>
                </text>
              </svg>
              <span className="font-display text-lg lg:text-2xl">DLM</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* os 3 caminhos */}
      <section id="caminhos" className="relative scroll-mt-6 px-4 pb-16 pt-6 lg:scroll-mt-10 lg:px-10 lg:pb-24 lg:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 -z-10 aspect-square w-[70rem] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(42,47,184,0.35), transparent)" }}
        />
        <ul className="mx-auto flex max-w-5xl flex-col gap-4 lg:gap-8">
          {CARDS.map((c) => (
            <li key={c.botao}>
              <CardLink card={c} />
            </li>
          ))}
        </ul>
      </section>

      {/* faixa */}
      <div aria-hidden className="-mx-2 -rotate-2 overflow-hidden bg-indigo py-3 lg:-rotate-1 lg:py-4">
        <div className="lt-faixa flex w-max">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className="flex items-center font-display text-2xl uppercase lg:text-3xl">
              <span className="px-5 lg:px-8">{w}</span>
              <span className="text-xl text-bronze">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* números + fechamento */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 lg:px-10 lg:pb-14 lg:pt-24">
        <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <p className="lt-revela text-center font-display text-4xl uppercase leading-[0.92] lg:text-left lg:text-6xl">
            Seu melhor físico,
            <em className="block font-serif text-[1.1em] normal-case text-indigo-soft">de forma natural.</em>
          </p>
          <dl className="lt-revela grid grid-cols-3 divide-x divide-bone/10 rounded-[1.4rem] border border-bone/10 bg-bone/[0.03] py-5 text-center lg:rounded-[1.6rem] lg:py-7">
            {NUMEROS.map((n) => (
              <div key={n.rotulo} className="px-2 lg:px-3">
                <dt className="sr-only">{n.rotulo}</dt>
                <dd className="font-display text-3xl leading-none lg:text-4xl" data-conta={n.alvo} data-pre={n.pre} data-suf={n.suf}>
                  {n.pre}
                  {n.alvo}
                  {n.suf}
                </dd>
                <dd className="mt-2 text-[0.7rem] leading-tight text-bone/55 lg:text-xs">{n.rotulo}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lt-revela mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:gap-4">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-[1.6rem] border border-bone/15 px-7 py-6 transition-colors hover:bg-bone/[0.06]"
          >
            <span>
              <span className="block font-display text-2xl uppercase">Conheça o método completo</span>
              <span className="text-sm text-bone/55">Como funciona, resultados e dúvidas</span>
            </span>
            <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
          <a
            href={CTA.consultoria}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-[1.6rem] border border-bone/15 px-7 py-6 transition-colors hover:bg-bone/[0.06]"
          >
            <span>
              <span className="block font-display text-2xl uppercase">Ficou com dúvida?</span>
              <span className="text-sm text-bone/55">Chame a equipe no WhatsApp</span>
            </span>
            <MessageCircle className="size-6 transition-transform duration-300 group-hover:scale-110" />
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-bone/35 lg:mt-14">© {PERFIL.marca}</p>
      </section>
    </main>
  );
}

function CardLink({ card: c }: { card: Card }) {
  const t = TEMAS[c.tema];
  const fotoDireita = c.lado === "direita";

  return (
    <motion.a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "lt-card group relative grid min-h-[14rem] grid-cols-[1fr_40%] overflow-hidden rounded-[1.5rem] sm:grid-cols-2 lg:aspect-[2.3/1] lg:min-h-0 lg:rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] outline-none ring-1 focus-visible:ring-2 focus-visible:ring-bone",
        t.card,
      )}
    >
      {/* foto */}
      <div
        className={cn(
          "relative overflow-hidden",
          // no celular a foto fica sempre à direita; no desktop alterna de lado
          "order-2 [mask-image:linear-gradient(to_right,transparent,black_45%)]",
          !fotoDireita && "lg:order-none lg:[mask-image:linear-gradient(to_left,transparent,black_45%)]",
        )}
      >
        <div className="lt-foto absolute inset-0">
          <Image
            src={c.foto}
            alt={c.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 520px, 45vw"
            className={cn("object-cover transition-transform duration-700 ease-out group-hover:scale-105", c.posicao)}
          />
        </div>
      </div>

      {/* texto */}
      <div className="relative z-10 flex flex-col justify-center py-5 pl-5 pr-1 lg:px-10 lg:py-8 xl:px-12">
        <span className={cn("lt-in self-start rounded-full px-2.5 py-1 text-[0.58rem] lg:px-3 lg:text-[0.65rem] font-extrabold uppercase tracking-[0.18em]", t.selo)}>
          {c.selo}
        </span>
        <h2 className="lt-in mt-3 font-display text-[clamp(1.9rem,8.5vw,2.8rem)] uppercase leading-[0.9] lg:mt-4 lg:text-[clamp(2.6rem,4.2vw,3.8rem)]">
          {c.titulo[0]} <span className={t.titulo2}>{c.titulo[1]}</span>
        </h2>
        <p className={cn("lt-in mt-2 max-w-sm text-[0.8rem] leading-snug lg:mt-3 lg:text-[0.95rem]", t.texto)}>{c.texto}</p>
        <ul className="lt-in mt-4 hidden grid-cols-2 gap-x-4 lg:grid gap-y-1.5 text-[0.8rem]">
          {c.itens.map((i) => (
            <li key={i} className="flex items-center gap-1.5">
              <Check className={cn("size-3.5 shrink-0", t.check)} strokeWidth={3} />
              {i}
            </li>
          ))}
        </ul>
        <span
          className={cn(
            "lt-in relative mt-4 inline-flex items-center gap-2 self-start overflow-hidden whitespace-nowrap rounded-full px-4 py-3 text-[0.82rem] font-bold lg:mt-6 lg:gap-3 lg:px-7 lg:py-3.5 lg:text-[0.95rem] transition-colors",
            t.botao,
          )}
        >
          <span aria-hidden className={cn("lt-brilho pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent to-transparent", t.brilho)} />
          {c.botao}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.a>
  );
}

function Whats({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-bone/[0.07] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-bone/80 ring-1 ring-bone/10 lg:px-3.5 lg:text-[0.7rem] lg:tracking-[0.16em]",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative size-2 rounded-full bg-emerald-400" />
      </span>
      Atendimento pelo WhatsApp
    </span>
  );
}
