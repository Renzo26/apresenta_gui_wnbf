"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Lock, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  linkComNome,
  mascaraTelefone,
  planoDoLink,
  registrarLead,
  validar,
  type Campos,
} from "@/lib/lead";
import { eventoPersonalizado, origem, refCampanha } from "@/lib/rastreio";
import { cn } from "@/lib/utils";

const GUARDADO = "dlm-lead"; // só preenche o formulário de novo para quem já respondeu, neste navegador
const VAZIO: Campos = { nome: "", email: "", telefone: "" };

/**
 * Formulário antes do WhatsApp. Escuta os cliques em qualquer link wa.me da página,
 * segura o clique, pede nome, e-mail e telefone e só então abre o WhatsApp com a mensagem do botão.
 */
export function BfLeadForm() {
  const [destino, setDestino] = useState<{ href: string; origem: string } | null>(null);
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const lenis = useLenis();
  const primeiro = useRef<HTMLInputElement>(null);

  // intercepta os links do WhatsApp (botões, header, rodapé, CTA fixo...)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (!a || e.defaultPrevented || e.button !== 0) return;
      e.preventDefault();
      // quem já respondeu neste navegador encontra o formulário preenchido
      try {
        const salvo = localStorage.getItem(GUARDADO);
        if (salvo) setCampos((c) => (c.nome ? c : { ...VAZIO, ...JSON.parse(salvo) }));
      } catch {}
      const botao = a.textContent?.trim().replace(/\s+/g, " ") || "WhatsApp";
      eventoPersonalizado("AbrirFormulario", {
        botao: botao.slice(0, 80),
        content_name: planoDoLink(a.href) ?? "Consultoria",
        campanha: origem().utm_campaign,
      });
      setDestino({ href: a.href, origem: botao });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // ao abrir: trava o scroll e foca o primeiro campo
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

  const plano = destino ? planoDoLink(destino.href) : undefined;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!destino) return;
    const encontrados = validar(campos);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    const utms = origem();
    registrarLead({
      ...campos,
      nome: campos.nome.trim(),
      email: campos.email.trim(),
      origem: destino.origem,
      plano,
      pagina: window.location.pathname,
      utms,
      referrer: document.referrer,
      url: window.location.href,
      empresa: (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('input[name="empresa"]')?.value,
    });
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(campos));
    } catch {}

    // abre no mesmo clique do envio (não é bloqueado como pop-up)
    window.open(linkComNome(destino.href, campos.nome, refCampanha(utms)), "_blank", "noopener");
    setDestino(null);
  };

  const campo = (nome: keyof Campos) => ({
    id: `lead-${nome}`,
    name: nome,
    value: campos[nome],
    "aria-invalid": Boolean(erros[nome]),
    "aria-describedby": erros[nome] ? `lead-${nome}-erro` : undefined,
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

  return (
    <AnimatePresence>
      {destino && (
        <motion.div
          key="lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-carvao/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setDestino(null)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-titulo"
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

            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ouro">Black Friday · {plano ? `Plano ${plano}` : "Consultoria"}</p>
            <h2 id="lead-titulo" className="mt-2 pr-8 font-display text-[2.2rem] uppercase leading-[0.95]">
              Falta pouco <span className="font-serif normal-case italic text-ouro">para garantir</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bone/65">Preencha seus dados e a equipe continua o atendimento com você no WhatsApp.</p>

            <form onSubmit={enviar} noValidate className="mt-6 space-y-4">
              {/* armadilha para robôs: invisível para pessoas e leitores de tela */}
              <input type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
              <div>
                <label htmlFor="lead-nome" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  Nome completo
                </label>
                <input ref={primeiro} type="text" autoComplete="name" placeholder="Seu nome e sobrenome" {...campo("nome")} />
                <Erro id="lead-nome-erro" texto={erros.nome} />
              </div>
              <div>
                <label htmlFor="lead-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  E-mail
                </label>
                <input type="email" inputMode="email" autoComplete="email" placeholder="voce@email.com" {...campo("email")} />
                <Erro id="lead-email-erro" texto={erros.email} />
              </div>
              <div>
                <label htmlFor="lead-telefone" className="text-xs font-semibold uppercase tracking-[0.14em] text-bone/70">
                  Telefone (WhatsApp)
                </label>
                <input type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(55) 99999-9999" {...campo("telefone")} />
                <Erro id="lead-telefone-erro" texto={erros.telefone} />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-ouro py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-carvao transition-colors hover:bg-bone"
              >
                Continuar no WhatsApp
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-bone/45">
                <Lock className="size-3" /> Seus dados são usados só para o seu atendimento.
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
