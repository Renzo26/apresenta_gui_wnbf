"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, type Variants } from "motion/react";
import { LINKS, PERFIL, type LinkBio } from "@/lib/links";
import atleta from "@/public/img/dlm-atleta.png";
import logo from "@/public/img/dlm-logo.png";

gsap.registerPlugin(useGSAP);

const lista: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};
const item: Variants = {
  oculto: { opacity: 0, y: 18 },
  visivel: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

export function LinkTree() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-foto]", { clipPath: "inset(8% 8% 8% 8% round 32px)", duration: 1.4 }, 0)
          .from("[data-foto] img", { scale: 1.18, duration: 1.8 }, 0)
          .from("[data-nome] > *", { yPercent: 110, duration: 1, stagger: 0.08 }, 0.25);
      });
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className="relative min-h-[100svh] overflow-hidden bg-[#0a0d2e] text-white">
      {/* brilho no azul da marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(58,58,190,0.55), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(39,39,143,0.45), transparent 70%)",
        }}
      />

      <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[460px] flex-col px-4 pb-8 pt-4 sm:pt-10">
        <section className="relative">
          <div data-foto className="relative aspect-[4/4.2] w-full overflow-hidden rounded-[32px] bg-[#141852]" style={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}>
            {/* o arquivo tem "DLM TEAM" na parte de baixo; o recorte mostra rosto, braço e medalha */}
            <Image
              src={atleta}
              alt={`${PERFIL.nome} com medalha da WNBF`}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 480px) 460px, 100vw"
              className="scale-[1.06] object-cover object-[50%_8%]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0a0d2e] via-[#0a0d2e]/70 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d1f86]">
              <Medalha /> {PERFIL.selo}
            </span>
            <h1 data-nome className="font-[family-name:var(--font-display)] text-[3.1rem] uppercase leading-[0.92] tracking-[0.005em] sm:text-[3.5rem]">
              <span className="block overflow-hidden">
                <span className="block">Jayme</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block">De Lamadrid</span>
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {PERFIL.marca} · {PERFIL.linha}
            </p>
          </div>
        </section>

        <motion.ul variants={lista} initial="oculto" animate="visivel" className="mt-6 flex flex-col gap-3">
          {LINKS.map((l) => (
            <motion.li key={l.id} variants={item}>
              <Botao link={l} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-auto flex flex-col items-center gap-3 pt-12"
        >
          <div className="relative aspect-[415/245] w-28 overflow-hidden rounded-xl bg-white">
            <Image src={logo} alt={PERFIL.marca} fill sizes="112px" className="object-cover object-[50%_45%]" />
          </div>
          <p className="text-xs text-white/45">© {PERFIL.marca}</p>
        </motion.footer>
      </main>
    </div>
  );
}

function Botao({ link }: { link: LinkBio }) {
  const claro = link.destaque;
  return (
    <motion.a
      href={link.href}
      target={link.tipo === "whatsapp" ? "_blank" : undefined}
      rel={link.tipo === "whatsapp" ? "noopener noreferrer" : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`group flex min-h-[72px] items-center gap-4 rounded-2xl px-4 py-3 outline-none ring-offset-2 ring-offset-[#0a0d2e] focus-visible:ring-2 focus-visible:ring-white ${
        claro ? "bg-white text-[#0a0d2e] shadow-[0_18px_40px_-18px_rgba(120,120,255,0.7)]" : "border border-white/15 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.1]"
      }`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${claro ? "bg-[#1d1f86] text-white" : "bg-white/10 text-white"}`}>
        {link.tipo === "whatsapp" ? <IconeWhats /> : <IconeHalter />}
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-[15px] font-semibold uppercase tracking-[0.06em]">{link.titulo}</span>
        <span className={`text-[13px] ${claro ? "text-[#0a0d2e]/60" : "text-white/55"}`}>{link.detalhe}</span>
      </span>
      <span aria-hidden className="text-lg transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </motion.a>
  );
}

function IconeWhats() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.95 3.85Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.17.24-.64.8-.78.96-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.43-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.57.68 2.18.73 2.96.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

function IconeHalter() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
    </svg>
  );
}

function Medalha() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="15" r="6" />
      <path d="M8.5 9.8 6 2h4l2 5 2-5h4l-2.5 7.8" />
    </svg>
  );
}
