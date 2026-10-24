"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Slide } from "@/components/deck/Slide";
import { Selo, type TipoSelo } from "@/components/ui";
import { CLIENTE, P } from "@/lib/modelo";
import type { PropsSlide } from "./tipos";

const RISCOS: { t: string; d: string; selo: TipoSelo }[] = [
  {
    t: "Os cenários são hipóteses, não previsão",
    d: "A maior incerteza é quanto o tráfego fecha comparado ao orgânico.",
    selo: "hipotese",
  },
  {
    t: "Custos que ficaram de fora",
    d: "Impostos, taxas de pagamento e o tempo extra de bônus, como a ligação de alinhamento da Black Friday.",
    selo: "calculo",
  },
  {
    t: "Custo de atender cresce com a base",
    d: "A conta supõe que o custo da operação sobe junto com o número de alunos. É uma simplificação conservadora: parte dele é fixa.",
    selo: "calculo",
  },
  {
    t: "O atendimento pode virar gargalo",
    d: "Mais contatos por mês exigem resposta rápida. Por isso o tempo de resposta está no painel semanal.",
    selo: "hipotese",
  },
];

export function Riscos(p: PropsSlide) {
  return (
    <Slide {...p} secao="Riscos e limites" titulo="O que esta projeção não garante, e onde ela pode errar">
      <div className="grid gap-4 md:grid-cols-2">
        {RISCOS.map((r, i) => (
          <div key={r.t} data-reveal className="flex gap-5 rounded-2xl border border-line bg-card p-6">
            <span className="num pt-1 text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-2xl leading-tight">{r.t}</h3>
                <Selo tipo={r.selo} />
              </div>
              <p className="mt-2 leading-relaxed text-ink-2">{r.d}</p>
            </div>
          </div>
        ))}
      </div>
      <p data-reveal className="mt-10 max-w-3xl font-serif text-2xl leading-snug">
        Por isso mostramos faixas, e não um número. O plano de campo existe para estreitar essas faixas com dado real.
      </p>
    </Slide>
  );
}

const PEDIDOS = [
  "Definir a verba inicial.",
  `Confirmar o teto de ${P.teto} alunos e a capacidade de ${P.capacidadeEntradas} entradas por mês.`,
  "Liberar acesso ao site e ao gerenciador de negócios da Meta.",
  "Combinar que o atendente registre a origem e o resultado de cada contato.",
  `Informar em que meses ocorreram os ${CLIENTE.contatosMeses.join(", ").replace(/, (\d+)$/, " e $1")} contatos e quantas vendas cada um gerou.`,
];

export function Checklist(p: PropsSlide) {
  const [feitos, setFeitos] = useState<boolean[]>(() => PEDIDOS.map(() => false));
  const total = feitos.filter(Boolean).length;
  return (
    <Slide {...p} secao="Próximos passos" titulo="Para começar, precisamos de cinco coisas suas">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ul className="flex flex-col">
          {PEDIDOS.map((t, i) => (
            <li key={t} data-reveal className="border-t border-line last:border-b">
              <button
                onClick={() => setFeitos((f) => f.map((v, k) => (k === i ? !v : v)))}
                aria-pressed={feitos[i]}
                className="group flex w-full items-center gap-5 py-5 text-left"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
                    feitos[i] ? "border-accent bg-accent" : "border-ink/40 group-hover:border-ink"
                  }`}
                >
                  <AnimatePresence>
                    {feitos[i] && (
                      <motion.svg width="16" height="16" viewBox="0 0 16 16" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                        <motion.path
                          d="M3 8.5 6.5 12 13 4.5"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </span>
                <span className={`text-lg leading-snug transition-colors md:text-xl ${feitos[i] ? "text-muted line-through decoration-accent/60" : "text-ink"}`}>{t}</span>
              </button>
            </li>
          ))}
        </ul>

        <div data-reveal className="flex flex-col justify-between gap-8 rounded-2xl bg-ink p-8 text-paper">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60">Combinado</p>
            <p className="num mt-3 text-7xl">
              {total}
              <span className="text-paper/40">/{PEDIDOS.length}</span>
            </p>
          </div>
          <p className="font-serif text-2xl leading-snug">
            Com isso, a fase 0 começa. Em quatro semanas voltamos com os números reais e a planilha atualizada.
          </p>
        </div>
      </div>
    </Slide>
  );
}
