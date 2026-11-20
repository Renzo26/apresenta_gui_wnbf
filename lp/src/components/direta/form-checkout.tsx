"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Lock, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CHECKOUT_BF, HOST_CHECKOUT_BF, PLANOS_BF, reais, type PlanoBF } from "@/lib/black-friday";
import { mascaraTelefone, registrarLead, validar, type Campos } from "@/lib/lead";
import { evento, eventoPersonalizado, origem } from "@/lib/rastreio";
import { cn } from "@/lib/utils";

const GUARDADO = "dlm-lead"; // mesmo do formulário da /black: quem já respondeu encontra preenchido
const VAZIO: Campos = { nome: "", email: "", telefone: "" };

/**
 * Formulário antes do checkout (/direta). Segura o clique em qualquer link do checkout, pede nome, e-mail e
 * telefone, grava o lead (banco + Pixel/API de Conversões, como na /black) e só então abre o pagamento,
 * na mesma aba, com os UTMs da visita.
 */
export function FormCheckout() {
  const [destino, setDestino] = useState<{ href: string; plano?: PlanoBF } | null>(null);
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [indo, setIndo] = useState(false);
  const lenis = useLenis();
  const primeiro = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(`a[href*="${HOST_CHECKOUT_BF}"]`);
      if (!a || e.defaultPrevented || e.button !== 0) return;
      e.preventDefault();
      try {
        const salvo = localStorage.getItem(GUARDADO);
        if (salvo) setCampos((c) => (c.nome ? c : { ...VAZIO, ...JSON.parse(salvo) }));
      } catch {}
      const url = new URL(a.href);
      const plano = PLANOS_BF.find((p) => CHECKOUT_BF[p.id] === `${url.origin}${url.pathname}`);
      eventoPersonalizado("AbrirFormulario", { botao: `Checkout ${plano?.nome ?? ""}`.trim(), content_name: plano?.nome ?? "Consultoria", campanha: origem().utm_campaign });
      setIndo(false);
      setDestino({ href: a.href, plano });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // voltou do checkout pelo botão "voltar" (página restaurada do cache): libera o botão de novo
  useEffect(() => {
    const aoVoltar = (e: PageTransitionEvent) => e.persisted && (setIndo(false), setDestino(null));
    window.addEventListener("pageshow", aoVoltar);
    return () => window.removeEventListener("pageshow", aoVoltar);
  }, []);

  // aberto: trava o scroll, foca o primeiro campo e fecha no Esc
  useEffect(() => {
    if (!destino) return;
    lenis?.stop();
    const t = setTimeout(() => primeiro.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDestino(null);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [destino, lenis]);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!destino || indo) return;
    const encontrados = validar(campos);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    const utms = origem();
    const { plano } = destino;
    registrarLead({
      ...campos,
      nome: campos.nome.trim(),
      email: campos.email.trim(),
      origem: `Checkout · ${plano ? `Plano ${plano.nome}` : "Consultoria"}`,
      plano: plano?.nome,
      pagina: window.location.pathname,
      utms,
      referrer: document.referrer,
      url: window.location.href,
      empresa: e.currentTarget.querySelector<HTMLInputElement>('input[name="empresa"]')?.value,
    });
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(campos));
    } catch {}

    evento(
      "InitiateCheckout",
      plano ? { value: plano.por, currency: "BRL", content_name: `Plano ${plano.nome} · Black`, content_ids: [plano.id] } : undefined,
    );

    // checkout com os UTMs da visita, para a venda não perder a campanha
    const url = new URL(destino.href);
    for (const [k, v] of Object.entries(utms)) if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    setIndo(true);
    // um respiro para o Pixel sair antes da troca de página (o lead já vai com keepalive)
    setTimeout(() => window.location.assign(url.toString()), 350);
  };

  const campo = (nome: keyof Campos) => ({
    id: `ck-${nome}`,
    name: nome,
    value: campos[nome],
    "aria-invalid": Boolean(erros[nome]),
    "aria-describedby": erros[nome] ? `ck-${nome}-erro` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = nome === "telefone" ? mascaraTelefone(e.target.value) : e.target.value;
      setCampos((c) => ({ ...c, [nome]: v }));
      if (erros[nome]) setErros((er) => ({ ...er, [nome]: undefined }));
    },
    className: cn(
      "mt-1.5 w-full rounded-xl border bg-bone/[0.04] px-4 py-3.5 text-base text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-ouro",
      erros[nome] ? "border-red-400" : "border-bone/15",
    ),
  });

  const plano = destino?.plano;

  return (
    <AnimatePresence>
      {destino && (
        <motion.div
          key="checkout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-carvao/80 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setDestino(null)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ck-titulo"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[100svh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-grafite p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-bone ring-1 ring-ouro/30 sm:rounded-[2rem] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setDestino(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
            >
              <X className="size-5" />
            </button>

            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ouro">
              Black Friday · {plano ? `Plano ${plano.nome} · ${reais(plano.por)}` : "Consultoria"}
            </p>
            <h2 id="ck-titulo" className="mt-2 pr-8 font-display text-[2.2rem] uppercase leading-[0.95]">
              Último passo <span className="font-serif normal-case italic text-ouro">antes do pagamento</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bone/65">Seus dados para a equipe te chamar no WhatsApp e começar a consultoria logo depois da compra.</p>

            <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
              {/* armadilha para robôs: invisível para pessoas e leitores de tela */}
              <input type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
              <div>
                <label htmlFor="ck-nome" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  Nome completo
                </label>
                <input ref={primeiro} type="text" autoComplete="name" placeholder="Seu nome e sobrenome" {...campo("nome")} />
                <Erro id="ck-nome-erro" texto={erros.nome} />
              </div>
              <div>
                <label htmlFor="ck-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  E-mail
                </label>
                <input type="email" inputMode="email" autoComplete="email" placeholder="voce@email.com" {...campo("email")} />
                <Erro id="ck-email-erro" texto={erros.email} />
              </div>
              <div>
                <label htmlFor="ck-telefone" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  Telefone (WhatsApp)
                </label>
                <input type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(55) 99999-9999" {...campo("telefone")} />
                <Erro id="ck-telefone-erro" texto={erros.telefone} />
              </div>

              <button
                type="submit"
                disabled={indo}
                className="mt-2 w-full rounded-full bg-ouro py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-carvao transition-colors hover:bg-bone disabled:opacity-70"
              >
                {indo ? "Abrindo o pagamento…" : "Ir para o pagamento"}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-bone/45">
                <Lock className="size-3" /> Use o mesmo e-mail na compra: é por ele que você entra no curso bônus.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Erro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-300">
      {texto}
    </p>
  );
}
