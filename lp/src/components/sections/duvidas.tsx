"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CTA, FAQ } from "@/lib/content";

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="duvidas" className="px-6 pb-24 pt-8 sm:px-10 sm:pb-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow index="06">Dúvidas</Eyebrow>
          <SplitReveal className="mt-6 font-display text-[clamp(2.8rem,5vw,4.6rem)] uppercase leading-[0.92] text-night">
            Antes de <span className="font-serif normal-case italic text-indigo">começar</span>
          </SplitReveal>
          <p className="mt-6 max-w-xs leading-relaxed text-ink/65">
            Ficou alguma pergunta?{" "}
            <a href={CTA.consultoria} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo underline decoration-indigo/30 underline-offset-4 hover:decoration-indigo">
              Chame a equipe no WhatsApp
            </a>
            .
          </p>
        </div>

        <ul className="lg:col-span-7 lg:col-start-6">
          {FAQ.map((f, i) => {
            const open = aberta === i;
            return (
              <li key={f.p} className="border-b border-night/12 first:border-t">
                <button
                  type="button"
                  onClick={() => setAberta(open ? null : i)}
                  aria-expanded={open}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl uppercase tracking-wide text-night sm:text-2xl">{f.p}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "#2a2fb8" : "rgba(8,10,36,0)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-night/20 ${open ? "text-bone" : "text-night"}`}
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 leading-relaxed text-ink/70">{f.r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
