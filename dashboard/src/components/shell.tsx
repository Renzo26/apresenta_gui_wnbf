"use client";

import { ArrowLeft, BadgeDollarSign, Images, LayoutDashboard, Megaphone, Moon, PanelLeftClose, PanelLeftOpen, PanelsTopLeft, RefreshCw, Sun, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { useDados, useFiltros, usePainel, useTema } from "@/components/providers";
import { Segmentado } from "@/components/ui/base";
import { PAGINAS, type PaginaId } from "@/lib/dados";
import { fmt, PRESETS } from "@/lib/metricas";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", nome: "Visão geral", icone: LayoutDashboard },
  { href: "/campanhas", nome: "Campanhas", icone: Megaphone },
  { href: "/criativos", nome: "Criativos", icone: Images },
  { href: "/paginas", nome: "Páginas", icone: PanelsTopLeft },
  { href: "/vendas", nome: "Vendas e CRM", icone: BadgeDollarSign },
];

const CHAVE_MENU = "dash-menu-recolhido";
function useMenuRecolhido(): [boolean, (v: boolean) => void] {
  const v = useSyncExternalStore(
    (aviso) => {
      window.addEventListener(CHAVE_MENU, aviso);
      return () => window.removeEventListener(CHAVE_MENU, aviso);
    },
    () => {
      try {
        return localStorage.getItem(CHAVE_MENU) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );
  return [
    v,
    (n) => {
      try {
        localStorage.setItem(CHAVE_MENU, n ? "1" : "0");
      } catch {}
      window.dispatchEvent(new Event(CHAVE_MENU));
    },
  ];
}

export function Shell({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const [recolhido, setRecolhido] = useMenuRecolhido();
  const [tema, setTema] = useTema();
  const { dados, erro, atualizar, atualizando } = useDados();

  // tela de acesso: sem menu e sem dados
  if (caminho === "/acesso") return <>{children}</>;
  if (!dados) return <Carregando erro={erro} aoTentar={atualizar} carregando={atualizando} />;

  return (
    <div className="flex min-h-svh">
      {/* menu lateral (computador) */}
      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-linha bg-painel/50 transition-[width] duration-300 ease-soft lg:flex",
          recolhido ? "w-[4.5rem]" : "w-60",
        )}
      >
        <div className={cn("flex items-start pt-7", recolhido ? "flex-col items-center gap-4 px-2" : "justify-between pl-6 pr-3")}>
          <Link href="/" className="leading-none" aria-label="Início">
            <span className={cn("font-display uppercase tracking-wide", recolhido ? "text-2xl" : "text-4xl")}>
              {recolhido ? "D" : "DLM"}
              <span className="text-bronze">.</span>
            </span>
            {!recolhido && <span className="mt-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.28em] text-suave">Tráfego</span>}
          </Link>
          <button
            type="button"
            onClick={() => setRecolhido(!recolhido)}
            aria-label={recolhido ? "Abrir menu lateral" : "Recolher menu lateral"}
            title={recolhido ? "Abrir menu" : "Recolher menu"}
            className="rounded-lg p-2 text-suave hover:bg-painel-2 hover:text-texto"
          >
            {recolhido ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>
        <nav aria-label="Principal" className={cn("mt-8 flex flex-col gap-1", recolhido ? "px-2" : "px-3")}>
          {NAV.map(({ href, nome, icone: Icone }) => {
            const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={recolhido ? nome : undefined}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-colors",
                  recolhido ? "justify-center px-0" : "px-3",
                  ativo ? "text-texto" : "text-apagado hover:text-suave",
                )}
              >
                {ativo && (
                  <motion.span layoutId="nav-ativo" className="absolute inset-0 rounded-xl bg-painel-2 shadow-[inset_0_0_0_1px_var(--t-linha)]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <Icone className="relative size-4 shrink-0" />
                {!recolhido && <span className="relative">{nome}</span>}
              </Link>
            );
          })}
        </nav>
        <div className={cn("mt-auto space-y-3 border-t border-linha py-5", recolhido ? "px-2" : "px-5")}>
          <button
            type="button"
            onClick={() => setTema(tema === "dark" ? "light" : "dark")}
            className={cn("flex items-center gap-2 text-xs font-semibold text-suave hover:text-texto", recolhido && "mx-auto")}
            aria-label={tema === "dark" ? "Usar tema claro" : "Usar tema escuro"}
          >
            {tema === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {!recolhido && (tema === "dark" ? "Tema claro" : "Tema escuro")}
          </button>
          {!recolhido && <Fontes />}
          {!recolhido && dados.crmUrl && (
            <a href={dados.crmUrl} className="flex items-center gap-2 text-xs font-semibold text-suave hover:text-texto">
              <ArrowLeft className="size-4" /> Voltar ao CRM
            </a>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <BarraFiltros />
        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
          {dados.avisos.length > 0 && (
            <ul className="mb-6 space-y-2">
              {dados.avisos.map((a) => (
                <li key={a} className="flex items-start gap-2.5 rounded-2xl border border-bronze/40 bg-bronze/[0.07] px-4 py-3 text-xs leading-relaxed text-suave">
                  <TriangleAlert className="mt-px size-4 shrink-0 text-bronze" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          )}
          {children}
        </main>
      </div>

      {/* menu inferior (celular/tablet) */}
      <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-linha bg-painel/95 px-1 py-1.5 backdrop-blur lg:hidden">
        {NAV.map(({ href, nome, icone: Icone }) => {
          const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativo ? "page" : undefined}
              className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[0.62rem] font-semibold", ativo ? "bg-painel-2 text-texto" : "text-apagado")}
            >
              <Icone className="size-4" />
              <span className="max-w-full truncate px-1">{nome.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/** Filtros num lugar só, acima de tudo: período, página e comparação. Valem para todas as telas. */
function BarraFiltros() {
  const { filtros, setFiltros } = useFiltros();
  const { periodo, dados } = usePainel();
  const { atualizar, atualizando } = useDados();
  const [tema, setTema] = useTema();
  const atualizado = new Date(dados.atualizadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="sticky top-0 z-30 border-b border-linha bg-fundo/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-8">
        <Link href="/" className="mr-1 font-display text-2xl uppercase leading-none lg:hidden">
          DLM<span className="text-bronze">.</span>
        </Link>
        <Segmentado
          rotulo="Período"
          valor={filtros.preset}
          aoMudar={(preset) => setFiltros({ ...filtros, preset })}
          opcoes={PRESETS.map((p) => ({ valor: p.id, nome: p.nome }))}
        />
        <label className="relative">
          <span className="sr-only">Página</span>
          <select
            value={filtros.pagina ?? ""}
            onChange={(e) => setFiltros({ ...filtros, pagina: (e.target.value || null) as PaginaId | null })}
            className="appearance-none rounded-full border border-linha bg-painel py-2 pl-3.5 pr-8 text-xs font-semibold text-texto outline-none hover:border-indigo-claro focus:border-indigo-claro"
          >
            <option value="">Todas as páginas</option>
            {(Object.keys(PAGINAS) as PaginaId[]).map((p) => (
              <option key={p} value={p}>
                {PAGINAS[p]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.6rem] text-apagado">▼</span>
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={filtros.comparar}
          onClick={() => setFiltros({ ...filtros, comparar: !filtros.comparar })}
          className="flex items-center gap-2 rounded-full px-1 text-xs font-semibold text-suave hover:text-texto"
        >
          <span className={cn("relative h-5 w-9 rounded-full border transition-colors", filtros.comparar ? "border-indigo-claro bg-indigo" : "border-linha bg-painel-2")}>
            <motion.span
              className="absolute top-0.5 size-3.5 rounded-full bg-texto"
              animate={{ left: filtros.comparar ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          </span>
          Comparar
        </button>
        <p className="ml-auto hidden text-[0.7rem] text-apagado md:block">
          <span className="tabular text-suave">
            {fmt.dia(periodo.inicio)} – {fmt.dia(periodo.fim)}
          </span>{" "}
          · atualizado {atualizado}
        </p>
        <button
          type="button"
          onClick={atualizar}
          disabled={atualizando}
          className="hidden rounded-full border border-linha p-2 text-suave hover:text-texto disabled:opacity-50 md:block"
          aria-label="Atualizar os dados agora"
          title="Atualizar agora"
        >
          <RefreshCw className={cn("size-3.5", atualizando && "animate-spin")} />
        </button>
        <button
          type="button"
          onClick={() => setTema(tema === "dark" ? "light" : "dark")}
          className="ml-auto rounded-full border border-linha p-2 text-suave md:ml-0 lg:hidden"
          aria-label={tema === "dark" ? "Usar tema claro" : "Usar tema escuro"}
        >
          {tema === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}

/** Topo de cada tela: número, título grande em Anton com o acento em itálico, e a frase do que se vê. */
export function Cabecalho({ indice, titulo, acento, descricao }: { indice: string; titulo: string; acento: string; descricao: string }) {
  return (
    <header className="mb-8 grid gap-4 sm:mb-10 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-apagado">
          <span className="text-bronze">{indice}</span>
          <span className="h-px w-6 bg-linha" />
          Gestão de tráfego
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] uppercase leading-[0.9] text-texto">
          {titulo} <span className="font-serif normal-case italic text-indigo-claro">{acento}</span>
        </h1>
      </div>
      <p className="max-w-md text-sm leading-relaxed text-suave lg:col-span-4 lg:justify-self-end">{descricao}</p>
    </header>
  );
}

/** De onde vêm os números (rodapé do menu). */
function Fontes() {
  const { dados } = useDados();
  if (!dados) return null;
  const itens = dados.fontes.exemplo
    ? [{ nome: "Dados de exemplo", ok: false }]
    : [
        { nome: "CRM + formulários", ok: dados.fontes.banco },
        { nome: dados.fontes.meta ? "Meta Ads" : "Meta Ads (não conectada)", ok: dados.fontes.meta },
      ];
  return (
    <ul className="space-y-1.5 text-[0.68rem] text-apagado">
      {itens.map((i) => (
        <li key={i.nome} className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", i.ok ? "bg-ok" : "bg-bronze")} aria-hidden />
          {i.nome}
        </li>
      ))}
    </ul>
  );
}

function Carregando({ erro, aoTentar, carregando }: { erro: string | null; aoTentar: () => void; carregando: boolean }) {
  return (
    <div className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-5xl uppercase leading-none">
          DLM<span className="text-bronze">.</span>
        </p>
        {erro ? (
          <>
            <p className="mt-6 text-sm text-suave">Não foi possível carregar os dados ({erro}).</p>
            <button
              type="button"
              onClick={aoTentar}
              disabled={carregando}
              className="mt-4 rounded-full border border-linha px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-texto hover:border-indigo-claro disabled:opacity-50"
            >
              Tentar de novo
            </button>
          </>
        ) : (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-suave">
            <RefreshCw className="size-4 animate-spin" aria-hidden /> Carregando os números do CRM e das campanhas…
          </p>
        )}
      </div>
    </div>
  );
}
