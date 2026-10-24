"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import { SLIDES } from "@/components/slides";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const formatar = (v: number, casas: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

export function Deck() {
  const raiz = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const [atual, setAtual] = useState(0);
  const [notas, setNotas] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const [parado, setParado] = useState(false);
  const atualRef = useRef(0);
  useEffect(() => {
    atualRef.current = atual;
  }, [atual]);

  useEffect(() => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({ lerp: reduzir ? 1 : 0.09, wheelMultiplier: 0.9 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const secoes = gsap.utils.toArray<HTMLElement>("[data-slide]");

      secoes.forEach((sec, i) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setAtual(i),
        });
      });

      gsap.to("[data-progresso]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        secoes.forEach((sec) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: sec, start: "top 72%", once: true },
            defaults: { ease: "power3.out" },
          });
          const reveal = sec.querySelectorAll("[data-reveal]");
          if (reveal.length) tl.from(reveal, { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0);

          sec.querySelectorAll<HTMLElement>("[data-bar]").forEach((el) => {
            const eixo = el.dataset.bar === "y" ? "scaleY" : "scaleX";
            tl.from(
              el,
              { [eixo]: 0, transformOrigin: eixo === "scaleY" ? "50% 100%" : "0% 50%", duration: 1.1, ease: "expo.out" },
              0.25 + Number(el.dataset.delay ?? 0)
            );
          });

          sec.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len });
            tl.from(p, { strokeDashoffset: len, duration: 1.8, ease: "power2.inOut" }, 0.3 + Number(p.dataset.delay ?? 0));
          });

          sec.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const alvo = Number(el.dataset.count);
            const casas = Number(el.dataset.casas ?? 0);
            const pre = el.dataset.prefix ?? "";
            const suf = el.dataset.suffix ?? "";
            const obj = { v: 0 };
            tl.to(
              obj,
              {
                v: alvo,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => (el.textContent = pre + formatar(obj.v, casas) + suf),
              },
              0.2
            );
          });
        });
      });
    },
    { scope: raiz }
  );

  const irPara = useCallback((i: number) => {
    const secoes = document.querySelectorAll<HTMLElement>("[data-slide]");
    const alvo = secoes[Math.max(0, Math.min(secoes.length - 1, i))];
    if (!alvo) return;
    if (lenis.current) lenis.current.scrollTo(alvo, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else alvo.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(k)) {
        e.preventDefault();
        irPara(atualRef.current + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(k)) {
        e.preventDefault();
        irPara(atualRef.current - 1);
      } else if (k === "Home") irPara(0);
      else if (k === "End") irPara(SLIDES.length - 1);
      else if (k.toLowerCase() === "n") setNotas((v) => !v);
      else if (k === "?" || k.toLowerCase() === "h") setAjuda((v) => !v);
      else if (k.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (k === "Escape") {
        setNotas(false);
        setAjuda(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [irPara]);

  // A barra some com o mouse parado, para não cobrir o slide durante a apresentação.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const acordar = () => {
      setParado(false);
      clearTimeout(t);
      t = setTimeout(() => setParado(true), 2500);
    };
    acordar();
    const eventos = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    eventos.forEach((e) => window.addEventListener(e, acordar, { passive: true }));
    return () => {
      clearTimeout(t);
      eventos.forEach((e) => window.removeEventListener(e, acordar));
    };
  }, []);

  const slide = SLIDES[atual];
  const barraVisivel = !parado || notas || ajuda;

  return (
    <div ref={raiz}>
      <div className="no-print fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
        <div data-progresso className="h-full origin-left scale-x-0 bg-accent" />
      </div>

      <main>
        {SLIDES.map(({ id, Conteudo }, i) => (
          <Conteudo key={id} n={i + 1} total={SLIDES.length} id={id} />
        ))}
      </main>

      {/* índice lateral */}
      <nav aria-label="Slides" className="no-print fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => irPara(i)}
            aria-label={`Ir para o slide ${i + 1}: ${s.curto}`}
            aria-current={i === atual}
            className="group relative flex h-3 w-6 items-center justify-end"
          >
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[11px] text-paper opacity-0 transition-opacity group-hover:opacity-100">
              {String(i + 1).padStart(2, "0")} · {s.curto}
            </span>
            <motion.span
              className="block h-[2px] rounded-full"
              animate={{ width: i === atual ? 22 : 10, backgroundColor: i === atual ? "var(--accent)" : "var(--line)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          </button>
        ))}
      </nav>

      {/* barra de controle */}
      <motion.div
        animate={{ opacity: barraVisivel ? 1 : 0, y: barraVisivel ? 0 : 12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ pointerEvents: barraVisivel ? "auto" : "none" }}
        className="no-print fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-full border border-line bg-card/85 p-1 shadow-[0_8px_30px_-12px_rgba(27,26,23,0.25)] backdrop-blur md:bottom-6 md:left-6">
        <BotaoBarra onClick={() => irPara(atual - 1)} rotulo="Slide anterior">
          ↑
        </BotaoBarra>
        <span className="num w-14 text-center text-xs text-ink-2">
          {String(atual + 1).padStart(2, "0")}/{SLIDES.length}
        </span>
        <BotaoBarra onClick={() => irPara(atual + 1)} rotulo="Próximo slide">
          ↓
        </BotaoBarra>
        <span className="mx-1 h-4 w-px bg-line" />
        <BotaoBarra onClick={() => setNotas((v) => !v)} rotulo="Notas do apresentador (N)" ativo={notas}>
          <span className="px-1.5 font-mono text-[11px] uppercase tracking-wider">Notas</span>
        </BotaoBarra>
        <BotaoBarra onClick={() => setAjuda((v) => !v)} rotulo="Atalhos (?)" ativo={ajuda}>
          ?
        </BotaoBarra>
      </motion.div>

      <AnimatePresence>
        {notas && (
          <motion.aside
            key="notas"
            aria-label="Notas do apresentador"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="no-print fixed inset-x-3 bottom-20 z-50 max-h-[55svh] overflow-y-auto rounded-2xl bg-ink p-6 text-paper shadow-2xl md:inset-x-auto md:bottom-24 md:left-6 md:w-[440px]"
            data-lenis-prevent
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <span>Notas · slide {String(atual + 1).padStart(2, "0")}</span>
              <button onClick={() => setNotas(false)} className="hover:text-paper" aria-label="Fechar notas">
                fechar ✕
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 text-[15px] leading-relaxed text-paper/90"
              >
                {slide.notas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        )}
        {ajuda && (
          <motion.div
            key="ajuda"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-[70] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
            onClick={() => setAjuda(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-card p-6 text-sm text-ink-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 font-serif text-2xl text-ink">Atalhos</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                {[
                  ["↓ → espaço", "próximo slide"],
                  ["↑ ←", "slide anterior"],
                  ["N", "notas do apresentador"],
                  ["F", "tela cheia"],
                  ["Home / End", "início / fim"],
                  ["Esc", "fechar painéis"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="num text-ink">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BotaoBarra({
  children,
  onClick,
  rotulo,
  ativo = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  rotulo: string;
  ativo?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`grid h-9 min-w-9 place-items-center rounded-full px-1 text-sm transition-colors ${
        ativo ? "bg-ink text-paper" : "text-ink hover:bg-paper-2"
      }`}
    >
      {children}
    </motion.button>
  );
}
