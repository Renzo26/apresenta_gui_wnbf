"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

const TEXTO =
  "Dez por cento a menos no preço. Nenhum atalho no método. Treino bem feito, comida de verdade e o Jayme acompanhando você de perto.";

// palavras que ganham destaque quando acendem
const DESTAQUES = new Set(["preço.", "método.", "perto."]);

/** Manifesto que acende palavra por palavra conforme o scroll (mesmo da LP). */
export function BfStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const palavras = TEXTO.split(" ");

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="02">Por que agora</Eyebrow>
        <p ref={ref} className="mt-8 flex flex-wrap font-display text-[clamp(2.3rem,5.6vw,5.4rem)] uppercase leading-[1.12] text-carvao">
          {palavras.map((p, i) => (
            <Palavra key={i} progresso={scrollYProgress} inicio={i / palavras.length} fim={(i + 1) / palavras.length} destaque={DESTAQUES.has(p)}>
              {p}
            </Palavra>
          ))}
        </p>
      </div>
    </section>
  );
}

function Palavra({
  children,
  progresso,
  inicio,
  fim,
  destaque,
}: {
  children: string;
  progresso: MotionValue<number>;
  inicio: number;
  fim: number;
  destaque: boolean;
}) {
  const opacity = useTransform(progresso, [inicio, fim], [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] ${destaque ? "font-serif normal-case italic text-ouro-deep" : ""}`}>
      {children}
    </motion.span>
  );
}
