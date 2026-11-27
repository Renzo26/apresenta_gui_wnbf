"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Dados } from "@/lib/dados";
import { CHAVE_TEMA } from "@/lib/tema";
import { derivados, periodoAnterior, periodoDo, recorte, somar, type Filtros } from "@/lib/metricas";

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

// ---------- dados reais (GET /api/dados) ----------
type EstadoDados = { dados: Dados | null; erro: string | null; atualizando: boolean; atualizar: () => void };
const DadosCtx = createContext<EstadoDados | null>(null);

function useCarregarDados(ativo: boolean): EstadoDados {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const buscar = useCallback(async (forcar: boolean) => {
    setAtualizando(true);
    try {
      const r = await fetch(`/api/dados${forcar ? "?atualizar=1" : ""}`, { cache: "no-store" });
      if (r.status === 401) {
        window.location.href = "/acesso";
        return;
      }
      const j = await r.json();
      if (!r.ok) throw new Error(j.erro ?? "Falha ao carregar");
      setDados(j);
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao carregar");
    } finally {
      setAtualizando(false);
    }
  }, []);
  useEffect(() => {
    if (!ativo) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carregar ao abrir é o objetivo do efeito
    void buscar(false);
    // a cada 5 minutos, enquanto a aba estiver aberta
    const t = setInterval(() => document.visibilityState === "visible" && void buscar(false), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [ativo, buscar]);
  return { dados, erro, atualizando, atualizar: () => void buscar(true) };
}

export function useDados() {
  const c = useContext(DadosCtx);
  if (!c) throw new Error("useDados fora do Providers");
  return c;
}

// ---------- filtros + dados do período ----------
type Ctx = { filtros: Filtros; setFiltros: (f: Filtros) => void };
const FiltrosCtx = createContext<Ctx | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<Filtros>({ preset: "black", pagina: null, comparar: true });
  const estado = useCarregarDados(usePathname() !== "/acesso");

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
  return (
    <DadosCtx.Provider value={estado}>
      <FiltrosCtx.Provider value={valor}>{children}</FiltrosCtx.Provider>
    </DadosCtx.Provider>
  );
}

export function useFiltros() {
  const c = useContext(FiltrosCtx);
  if (!c) throw new Error("useFiltros fora do Providers");
  return c;
}

/** Tudo que as telas precisam do período escolhido: recorte atual, anterior e totais de anúncio.
 *  Só é usado depois que os dados chegaram (o Shell espera antes de mostrar as telas). */
export function usePainel() {
  const { filtros } = useFiltros();
  const { dados: carregados } = useDados();
  return useMemo(() => {
    const dados = carregados!;
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
  }, [filtros, carregados]);
}
