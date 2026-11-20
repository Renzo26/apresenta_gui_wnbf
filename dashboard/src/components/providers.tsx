"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { CHAVE_TEMA } from "@/lib/tema";
import { carregarDados, derivados, periodoAnterior, periodoDo, recorte, somar, type Filtros } from "@/lib/metricas";

gsap.registerPlugin(ScrollTrigger);

// ---------- tema (claro/escuro), igual ao CRM ----------
const EVENTO = "dash-tema";
export type Tema = "dark" | "light";

export function useTema(): [Tema, (t: Tema) => void] {
  const tema = useSyncExternalStore<Tema>(
    (aviso) => {
      window.addEventListener(EVENTO, aviso);
      return () => window.removeEventListener(EVENTO, aviso);
    },
    () => (document.documentElement.dataset.tema === "light" ? "light" : "dark"),
    () => "dark",
  );
  const mudar = (t: Tema) => {
    document.documentElement.dataset.tema = t;
    try {
      localStorage.setItem(CHAVE_TEMA, t);
    } catch {}
    window.dispatchEvent(new Event(EVENTO));
  };
  return [tema, mudar];
}

// ---------- filtros + dados do período ----------
type Ctx = { filtros: Filtros; setFiltros: (f: Filtros) => void };
const FiltrosCtx = createContext<Ctx | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>({ preset: "black", pagina: null, comparar: true });

  // Lenis: rolagem suave da página, sincronizada com o ScrollTrigger do GSAP
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const valor = useMemo(() => ({ filtros, setFiltros }), [filtros]);
  return <FiltrosCtx.Provider value={valor}>{children}</FiltrosCtx.Provider>;
}

export function useFiltros() {
  const c = useContext(FiltrosCtx);
  if (!c) throw new Error("useFiltros fora do Providers");
  return c;
}

/** Tudo que as telas precisam do período escolhido: recorte atual, anterior e totais de anúncio. */
export function usePainel() {
  const { filtros } = useFiltros();
  return useMemo(() => {
    const dados = carregarDados();
    const periodo = periodoDo(filtros.preset, dados);
    const anterior = periodoAnterior(periodo);
    const atual = recorte(dados, periodo, filtros.pagina);
    const antes = recorte(dados, anterior, filtros.pagina);
    const ads = somar(atual.anuncios);
    const adsAntes = somar(antes.anuncios);
    return {
      dados,
      filtros,
      periodo,
      anterior,
      atual,
      antes,
      ads,
      adsAntes,
      d: derivados(ads),
      dAntes: derivados(adsAntes),
      comparar: filtros.comparar && antes.anuncios.length > 0,
    };
  }, [filtros]);
}
