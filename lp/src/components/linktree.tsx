"use client";

import { ArrowUpRight, BookOpen, ClipboardList, Dumbbell } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import recorte from "@/assets/jayme-palco-recorte.png";
import { CTA, PERFIL } from "@/lib/content";
import { cn } from "@/lib/utils";

const LINKS = [
  { titulo: "Consultoria individual", detalhe: "Treino e dieta com o Jayme", href: CTA.consultoria, icon: Dumbbell, destaque: true },
  { titulo: "Planilhas de treino 2.0", detalhe: "Chame no WhatsApp", href: CTA.planilhas, icon: ClipboardList },
  { titulo: "Meu livro digital", detalhe: "R$ 49,99 · pelo WhatsApp", href: CTA.livro, icon: BookOpen },
];

const lista: Variants = { oculto: {}, visivel: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } };
const item: Variants = {
  oculto: { opacity: 0, y: 18 },
  visivel: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

/** Versão direta do link da bio: foto, nome e os 3 caminhos. Cabe numa tela de celular. */
export function LinkTree() {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-night px-4 pb-8 pt-10 text-center text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12%] -z-10 aspect-square w-[min(48rem,170vw)] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(42,47,184,0.75), rgba(16,21,74,0.45) 55%, transparent)" }}
      />

      <div className="flex w-full max-w-md flex-1 flex-col">
        {/* foto: o Jayme saindo do círculo, como no hero da LP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-4 aspect-square w-[min(15rem,62vw,32svh)]"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_35%,#2a2fb8_0%,#10154a_60%,#080a24_100%)] ring-1 ring-indigo-soft/30" />
          <div className="absolute inset-0" style={{ clipPath: "inset(-45% -10% 0 -10% round 0 0 50% 50% / 0 0 34.5% 34.5%)" }}>
            <div className="absolute left-1/2 top-[-14%] aspect-[811/1984] w-[86%] -translate-x-1/2">
              <Image
                src={recorte}
                alt={`${PERFIL.nome}, atleta WNBF PRO`}
                fill
                preload
                sizes="240px"
                className="object-contain object-top drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-5"
        >
          <h1 className="font-display text-[2.6rem] uppercase leading-[0.95]">{PERFIL.nome}</h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-bronze">WNBF PRO · Natural Bodybuilding</p>
        </motion.div>

        <motion.ul variants={lista} initial="oculto" animate="visivel" className="mt-8 flex flex-col gap-3">
          {LINKS.map((l) => (
            <motion.li key={l.titulo} variants={item}>
              <motion.a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className={cn(
                  "group flex min-h-[4.5rem] items-center gap-4 rounded-2xl px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-bone",
                  l.destaque
                    ? "bg-indigo text-bone shadow-[0_18px_40px_-18px_rgba(120,120,255,0.8)]"
                    : "border border-bone/15 bg-bone/[0.05] backdrop-blur-sm hover:bg-bone/[0.09]",
                )}
              >
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", l.destaque ? "bg-bone text-indigo" : "bg-bone/10")}>
                  <l.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-display text-xl uppercase leading-tight tracking-wide">{l.titulo}</span>
                  <span className="text-[13px] text-bone/65">{l.detalhe}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-auto pt-10 text-sm text-bone/55 underline decoration-bone/20 underline-offset-4 hover:text-bone"
        >
          Conheça o método completo
        </motion.a>
      </div>
    </main>
  );
}
