"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, BookOpen, Check, ClipboardList, Dumbbell, MessageCircle } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import recorte from "@/assets/jayme-palco-recorte.png";
import warleyAntes from "@/assets/warley-antes.jpg";
import warleyDepois from "@/assets/warley-depois.jpg";
import { CTA, MARQUEE, PERFIL } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INCLUSO = ["Avaliação completa", "Plano em 3 a 5 dias úteis", "Suporte diário no WhatsApp", "Reavaliação todo mês"];

const OUTROS = [
  { titulo: "Planilhas de treino 2.0", detalhe: "Treine por conta própria com as planilhas do Jayme", href: CTA.planilhas, icon: ClipboardList },
  { titulo: "Meu livro digital", detalhe: "R$ 49,99 · garanta o seu pelo WhatsApp", href: CTA.livro, icon: BookOpen },
];

// números que contam ao aparecer: { alvo, prefixo, sufixo, rótulo }
const NUMEROS = [
  { alvo: 14, pre: "+", suf: " mil", rotulo: "alunos atendidos" },
  { alvo: 1, pre: "", suf: "º", rotulo: "brasileiro campeão WNBF" },
  { alvo: 100, pre: "", suf: "%", rotulo: "natural, sem atalhos" },
];

const lista: Variants = { oculto: {}, visivel: { transition: { staggerChildren: 0.09, delayChildren: 0.55 } } };
const item: Variants = {
  oculto: { opacity: 0, y: 22 },
  visivel: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 26 } },
};

/** Link da bio: foto, os 3 caminhos logo de cara e, abaixo, números, prova e o método completo. */
export function LinkTree() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".lt-circulo", { scale: 0.6, autoAlpha: 0, duration: 1.3 })
          .from(".lt-atleta", { yPercent: 22, autoAlpha: 0, duration: 1.4 }, 0.1)
          .from(".lt-nome > span", { yPercent: 110, duration: 1, stagger: 0.08 }, 0.3);

        // atleta "respira": sobe e desce devagar
        gsap.to(".lt-atleta", { y: -6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });

        // brilho atravessando o botão principal
        gsap.fromTo(".lt-brilho", { xPercent: -120 }, { xPercent: 260, duration: 1.6, ease: "power2.inOut", repeat: -1, repeatDelay: 2.4, delay: 1.6 });

        gsap.to(".lt-faixa", { xPercent: -50, ease: "none", duration: 28, repeat: -1 });

        gsap.utils.toArray<HTMLElement>("[data-conta]").forEach((el) => {
          const alvo = Number(el.dataset.conta);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: alvo,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => (el.textContent = `${el.dataset.pre}${Math.round(obj.v)}${el.dataset.suf}`),
          });
        });

        gsap.from(".lt-revela", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".lt-revela", start: "top 88%" },
        });
        gsap.fromTo(
          ".lt-depois",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".lt-depois", start: "top 85%" } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-night px-4 pb-10 pt-6 text-center text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 aspect-square w-[min(52rem,180vw)] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(42,47,184,0.8), rgba(16,21,74,0.45) 55%, transparent)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 -translate-x-1/2 select-none font-display text-[clamp(11rem,60vw,22rem)] leading-none text-bone/[0.04]"
      >
        DLM
      </span>

      <div className="flex w-full max-w-md flex-col">
        {/* topo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <span className="font-display text-2xl leading-none">DLM</span>
          <span className="flex items-center gap-2 rounded-full bg-bone/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-bone/80 ring-1 ring-bone/10">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            Atendimento pelo WhatsApp
          </span>
        </motion.div>

        {/* foto: o Jayme saindo do círculo */}
        <div className="relative mx-auto mt-8 aspect-square w-[min(15rem,58vw,25svh)]">
          <div className="lt-circulo absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#2a2fb8_0%,#10154a_60%,#080a24_100%)] shadow-[0_0_80px_-20px_rgba(90,96,255,0.8)] ring-1 ring-indigo-soft/30" />
          <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
            <div className="lt-atleta absolute left-1/2 top-[-14%] aspect-[811/1984] w-[86%] -translate-x-1/2">
              <Image
                src={recorte}
                alt={`${PERFIL.nome}, atleta WNBF PRO`}
                fill
                preload
                sizes="250px"
                className="object-contain object-top drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
          {/* selo giratório */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-6 top-[18%] grid size-[4.6rem] place-items-center rounded-full bg-bronze text-night"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_16s_linear_infinite]" aria-hidden>
              <defs>
                <path id="selo-lt" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-current text-[8px] font-extrabold uppercase tracking-[0.14em]">
                <textPath href="#selo-lt">natural bodybuilding • wnbf pro •</textPath>
              </text>
            </svg>
            <span className="font-display text-lg">DLM</span>
          </motion.div>
        </div>

        <h1 className="lt-nome relative z-10 mt-4 font-display text-[2.5rem] uppercase leading-[0.95]">
          <span className="block overflow-hidden">
            <span className="block">{PERFIL.nome}</span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-bronze"
        >
          WNBF PRO · Natural Bodybuilding
        </motion.p>

        {/* os 3 caminhos */}
        <motion.ul variants={lista} initial="oculto" animate="visivel" className="mt-6 flex flex-col gap-3 text-left">
          <motion.li variants={item}>
            <div className="relative overflow-hidden rounded-[1.4rem] bg-indigo p-1.5 shadow-[0_22px_50px_-20px_rgba(120,120,255,0.9)]">
              <div className="flex items-center justify-between px-3 pb-1.5 pt-1.5">
                <span className="rounded-full bg-bronze px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-night">
                  Mais completo
                </span>
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-bone/70">Consultoria online</span>
              </div>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 pb-3 text-[0.78rem] text-bone/90">
                {INCLUSO.map((i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="size-3.5 shrink-0 text-bronze" strokeWidth={3} />
                    {i}
                  </li>
                ))}
              </ul>
              <Botao
                href={CTA.consultoria}
                titulo="Consultoria individual"
                detalhe="Treino e dieta com o Jayme"
                icon={Dumbbell}
                className="relative overflow-hidden bg-bone text-night hover:bg-white"
                iconeCls="bg-indigo text-bone"
                detalheCls="text-night/60"
              >
                <span aria-hidden className="lt-brilho pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-indigo-soft/35 to-transparent" />
              </Botao>
            </div>
          </motion.li>
          {OUTROS.map((o) => (
            <motion.li key={o.titulo} variants={item}>
              <Botao
                href={o.href}
                titulo={o.titulo}
                detalhe={o.detalhe}
                icon={o.icon}
                className="border border-bone/15 bg-bone/[0.05] backdrop-blur-sm hover:bg-bone/[0.1]"
                iconeCls="bg-bone/10"
                detalheCls="text-bone/60"
              />
            </motion.li>
          ))}
        </motion.ul>

        {/* números */}
        <p className="lt-revela mt-12 font-display text-3xl uppercase leading-none">
          Seu melhor físico, <em className="block font-serif text-[1.15em] normal-case text-indigo-soft">de forma natural.</em>
        </p>
        <dl className="lt-revela mt-6 grid grid-cols-3 divide-x divide-bone/10 rounded-[1.4rem] border border-bone/10 bg-bone/[0.03] py-5">
          {NUMEROS.map((n) => (
            <div key={n.rotulo} className="px-2">
              <dt className="sr-only">{n.rotulo}</dt>
              <dd className="font-display text-3xl leading-none" data-conta={n.alvo} data-pre={n.pre} data-suf={n.suf}>
                {n.pre}
                {n.alvo}
                {n.suf}
              </dd>
              <dd className="mt-1.5 text-[0.7rem] leading-tight text-bone/55">{n.rotulo}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* faixa animada, de ponta a ponta */}
      <div aria-hidden className="lt-revela -mx-4 mt-10 w-[calc(100%+2rem)] -rotate-2 overflow-hidden bg-indigo py-3">
        <div className="lt-faixa flex w-max">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className="flex items-center font-display text-2xl uppercase">
              <span className="px-5">{w}</span>
              <span className="text-lg text-bronze">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col">
        {/* prova: antes e depois */}
        <figure className="lt-revela mt-12">
          <figcaption className="mb-4 flex items-baseline justify-between text-left">
            <span className="font-display text-2xl uppercase">Resultado real</span>
            <span className="text-xs text-bone/55">Warley · fev → set</span>
          </figcaption>
          <div className="grid grid-cols-2 gap-1.5 rounded-[1.4rem] bg-bone/[0.05] p-1.5 ring-1 ring-bone/10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
              <Image src={warleyAntes} alt="Warley antes da consultoria" fill placeholder="blur" sizes="210px" className="object-cover object-[50%_30%]" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-night/70 px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] backdrop-blur">
                Antes
              </span>
            </div>
            <div className="lt-depois relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
              <Image src={warleyDepois} alt="Warley depois da consultoria" fill placeholder="blur" sizes="210px" className="object-cover object-[50%_25%]" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-bronze px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-night">
                Depois
              </span>
            </div>
          </div>
          <p className="mt-2 text-left text-[0.7rem] text-bone/40">Resultados individuais: variam de pessoa para pessoa.</p>
        </figure>

        {/* fechamento */}
        <div className="lt-revela mt-10 flex flex-col gap-3">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-[1.4rem] border border-bone/15 px-5 py-4 text-left transition-colors hover:bg-bone/[0.06]"
          >
            <span>
              <span className="block font-display text-xl uppercase">Conheça o método completo</span>
              <span className="text-[0.8rem] text-bone/55">Como funciona, resultados e dúvidas</span>
            </span>
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <a
            href={CTA.consultoria}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 text-sm text-bone/60 hover:text-bone"
          >
            <MessageCircle className="size-4" /> Ficou com dúvida? Chame a equipe
          </a>
          <p className="text-xs text-bone/35">© {PERFIL.marca}</p>
        </div>
      </div>
    </main>
  );
}

function Botao({
  href,
  titulo,
  detalhe,
  icon: Icon,
  className,
  iconeCls,
  detalheCls,
  children,
}: {
  href: string;
  titulo: string;
  detalhe: string;
  icon: typeof Dumbbell;
  className: string;
  iconeCls: string;
  detalheCls: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "group flex min-h-[4.5rem] items-center gap-4 rounded-2xl px-4 py-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-bone",
        className,
      )}
    >
      {children}
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", iconeCls)}>
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="font-display text-xl uppercase leading-tight tracking-wide">{titulo}</span>
        <span className={cn("text-[13px] leading-snug", detalheCls)}>{detalhe}</span>
      </span>
      <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </motion.a>
  );
}
