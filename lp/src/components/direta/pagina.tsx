import { BookOpen, CalendarCheck, ClipboardList, Dumbbell, MessageCircle, Percent, Play, Plus } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import aluno1Antes from "@/assets/resultados/aluno1-antes.jpg";
import aluno1Depois from "@/assets/resultados/aluno1-depois.jpg";
import aluno2Antes from "@/assets/resultados/aluno2-antes.jpg";
import aluno2Depois from "@/assets/resultados/aluno2-depois.jpg";
import aluno3Antes from "@/assets/aluno-antes-bf.jpg";
import aluno3Depois from "@/assets/aluno-depois-bf.jpg";
import jayme from "@/assets/jayme-medalha.jpg";
import { FormCheckout } from "@/components/direta/form-checkout";
import { PlanosDireta } from "@/components/direta/planos";
import { Logo } from "@/components/sections/header";
import { CURSO_BONUS_BF, DESCONTO_BF, FAQ_BF, INCLUSO_BF, PARCELAS_BF } from "@/lib/black-friday";
import { PERFIL, PROVAS } from "@/lib/content";

const ICONES = [ClipboardList, Dumbbell, MessageCircle, CalendarCheck];

const RESULTADOS: [StaticImageData, StaticImageData][] = [
  [aluno1Antes, aluno1Depois],
  [aluno2Antes, aluno2Depois],
  [aluno3Antes, aluno3Depois],
];

const BONUS = [
  { icone: Play, titulo: CURSO_BONUS_BF.nome, texto: `${CURSO_BONUS_BF.aulas} aulas em vídeo, ${CURSO_BONUS_BF.duracao.toLowerCase()}, na área de membros.` },
  { icone: BookOpen, titulo: "E-book A Musculação para Naturais", texto: "Material de apoio sobre treino para naturais, enviado pela equipe depois da compra." },
  { icone: Percent, titulo: `${DESCONTO_BF}% OFF + ${PARCELAS_BF}x sem juros`, texto: "E o valor da Black vale também nas renovações." },
];

// as dúvidas que mais travam a compra (texto da /black, com a resposta do checkout)
const PERGUNTAS = ["Posso parcelar?", "Qual plano compensa mais?", "O valor da Black vale para as renovações?", "A dieta é restritiva? Vou precisar de suplementos?"];
const FAQ = [
  ...FAQ_BF.filter((f) => PERGUNTAS.includes(f.p)),
  {
    p: "O que acontece depois que eu pago?",
    r: "A equipe te chama no WhatsApp para começar a avaliação e o acesso ao curso bônus é liberado no e-mail da compra. O treino e a dieta chegam em 3 a 5 dias úteis.",
  },
];

/**
 * /direta: página curta de venda direta. Os planos já no topo (cada botão abre o formulário e depois o checkout)
 * e, abaixo, os motivos em blocos rápidos: o que vem, resultados, bônus, quem acompanha, dúvidas e os planos de novo.
 */
export function PaginaDireta() {
  return (
    <div className="min-h-svh bg-carvao text-bone">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <span className="rounded-full bg-ouro px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-carvao">
          Black Friday · {DESCONTO_BF}% OFF
        </span>
      </header>

      <main>
        {/* 1. oferta + planos */}
        <section id="planos" className="scroll-mt-4 px-4 pb-14 pt-4 sm:px-8 sm:pb-20 sm:pt-8">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-3">
                <Image src={jayme} alt={PERFIL.nome} width={44} height={44} className="size-11 rounded-full object-cover ring-2 ring-ouro" priority />
                <p className="text-left text-xs leading-snug text-bone/70">
                  <strong className="block text-sm text-bone">{PERFIL.nome}</strong>1º brasileiro campeão da WNBF
                </p>
              </div>
              <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] uppercase leading-[0.92]">
                Treino e dieta com o Jayme <span className="font-serif normal-case italic text-ouro">com {DESCONTO_BF}% off</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-bone/70">
                Consultoria online 100% natural, individualizada e com suporte diário. Escolha o plano e garanta a condição da Black.
              </p>
            </div>
            <div className="mt-10">
              <PlanosDireta />
            </div>
          </div>
        </section>

        {/* 2. o que vem */}
        <section className="px-2.5 sm:px-4">
          <div className="grain relative rounded-[2rem] bg-bone px-5 py-14 text-carvao sm:rounded-[2.75rem] sm:px-10 sm:py-20">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">
                O que vem <span className="font-serif normal-case italic text-ouro-deep">na consultoria</span>
              </h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {INCLUSO_BF.map((item, i) => {
                  const Icone = ICONES[i] ?? ClipboardList;
                  return (
                    <li key={item.titulo} className="rounded-[1.5rem] bg-white p-5 ring-1 ring-carvao/8">
                      <Icone className="size-6 text-ouro-deep" aria-hidden />
                      <h3 className="mt-4 font-display text-xl uppercase leading-tight tracking-wide">{item.titulo}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-carvao/70">{item.texto}</p>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-10 grid grid-cols-3 gap-3 border-t border-carvao/10 pt-8 text-center">
                {PROVAS.map((p) => (
                  <li key={p.rotulo}>
                    <p className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none">{p.valor}</p>
                    <p className="mt-1 text-xs leading-snug text-carvao/60 sm:text-sm">{p.rotulo}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. resultados */}
        <section className="px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">
              Alunos <span className="font-serif normal-case italic text-ouro">de verdade</span>
            </h2>
            <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
              {RESULTADOS.map(([antes, depois], i) => (
                <li key={i} className="grid w-[82%] shrink-0 snap-center grid-cols-2 gap-1 overflow-hidden rounded-[1.5rem] sm:w-auto">
                  {[antes, depois].map((img, j) => (
                    <figure key={j} className="relative aspect-[3/4]">
                      <Image src={img} alt={`Aluno da consultoria ${j ? "depois" : "antes"}`} fill sizes="(min-width: 640px) 18vw, 41vw" className="object-cover" />
                      <figcaption className="absolute bottom-2 left-2 rounded-full bg-carvao/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em]">
                        {j ? "Depois" : "Antes"}
                      </figcaption>
                    </figure>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. bônus */}
        <section className="px-2.5 sm:px-4">
          <div className="rounded-[2rem] bg-ouro px-5 py-14 text-carvao sm:rounded-[2.75rem] sm:px-10 sm:py-20">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">
                + 3 bônus <span className="font-serif normal-case italic">em todos os planos</span>
              </h2>
              <ul className="mt-8 grid gap-3 md:grid-cols-3">
                {BONUS.map((b) => (
                  <li key={b.titulo} className="flex gap-4 rounded-[1.5rem] bg-carvao p-5 text-bone">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ouro text-carvao">
                      <b.icone className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg uppercase leading-tight tracking-wide">{b.titulo}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-bone/65">{b.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. dúvidas */}
        <section className="px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">
              Dúvidas <span className="font-serif normal-case italic text-ouro">rápidas</span>
            </h2>
            <div className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
              {FAQ.map((f) => (
                <details key={f.p} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.p}
                    <Plus className="size-5 shrink-0 text-ouro transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 leading-relaxed text-bone/65">{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 6. planos de novo */}
        <section className="px-4 pb-28 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">
              Escolha seu plano <span className="font-serif normal-case italic text-ouro">e comece</span>
            </h2>
            <div className="mt-8">
              <PlanosDireta />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-bone/10 px-5 py-8 text-center text-xs text-bone/40">
        © {PERFIL.marca} · Condição de Black Friday por tempo limitado
      </footer>

      {/* celular: atalho fixo para os planos */}
      <a
        href="#planos"
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-center rounded-full bg-ouro py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-carvao shadow-2xl shadow-black/60 sm:hidden"
      >
        Garantir {DESCONTO_BF}% OFF
      </a>

      <FormCheckout />
    </div>
  );
}
