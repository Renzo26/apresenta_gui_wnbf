"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, MessageCircle, Plus, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import antes from "@/assets/planilhas/antes.webp";
import bonus1 from "@/assets/planilhas/bonus-1.webp";
import bonus2 from "@/assets/planilhas/bonus-2.webp";
import bonus3 from "@/assets/planilhas/bonus-3.webp";
import bonus4 from "@/assets/planilhas/bonus-4.webp";
import depois from "@/assets/planilhas/depois.webp";
import dor1 from "@/assets/planilhas/dor-1.jpg";
import dor2 from "@/assets/planilhas/dor-2.jpg";
import dor3 from "@/assets/planilhas/dor-3.jpg";
import dor4 from "@/assets/planilhas/dor-4.jpg";
import jayme from "@/assets/planilhas/jayme.webp";
import logoProduto from "@/assets/planilhas/logo-produto.webp";
import publico1 from "@/assets/planilhas/publico-1.webp";
import publico2 from "@/assets/planilhas/publico-2.webp";
import publico3 from "@/assets/planilhas/publico-3.webp";
import publico4 from "@/assets/planilhas/publico-4.webp";
import publicoResumo from "@/assets/planilhas/publico-resumo.webp";
import treinoBracos from "@/assets/planilhas/treino-bracos.webp";
import treinoCostas from "@/assets/planilhas/treino-costas.webp";
import treinoOmbros from "@/assets/planilhas/treino-ombros.webp";
import treinoPeito from "@/assets/planilhas/treino-peito.webp";
import treinoPernas from "@/assets/planilhas/treino-pernas.webp";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitReveal } from "@/components/ui/split-reveal";
import { CONTACT, CTA, PERFIL } from "@/lib/content";
import { CHECKOUT_PLANILHAS, COMPARACAO, FAQ_PLANILHAS, MENTOR, PRECO_PLANILHAS, RECEBE } from "@/lib/planilhas";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DORES = [
  { img: dor1, alt: "Sente que não está melhorando e perdendo tempo, mas não sabe o que é" },
  { img: dor2, alt: "Você até teve resultados, mas não sabe como ou se vai conseguir eles de novo" },
  { img: dor3, alt: "Já viu várias dicas e truques, mas não sabe se funcionam e fica confuso" },
  { img: dor4, alt: "Não sabe se o treino de agora realmente pode te dar resultados e te tirar do lugar" },
];

const PUBLICO = [
  { img: publico1, alt: "Iniciantes: que nunca treinou e quer um treino eficiente para evoluir rápido" },
  { img: publico2, alt: "Quem já treina: mas ainda não viu os resultados que queria e quer um treino que acelere a evolução" },
  { img: publico3, alt: "Pessoas ocupadas: que têm pouco tempo e querem resultados rápidos e sem complicação" },
  { img: publico4, alt: "Avançados: que buscam um sistema comprovado para melhorar resultados sem treinos longos e chegar no top 1%" },
];

const GRUPOS: { nome: string; img: StaticImageData }[] = [
  { nome: "Peito", img: treinoPeito },
  { nome: "Costas", img: treinoCostas },
  { nome: "Braços", img: treinoBracos },
  { nome: "Pernas", img: treinoPernas },
  { nome: "Ombros", img: treinoOmbros },
];

const BONUS = [
  { img: bonus1, alt: "Bônus: acesso a todos os Treinos Essenciais no aplicativo HEVY, com rastreio de metas corporais, acompanhamento de cargas, vídeos de execução e personalização dos treinos" },
  { img: bonus2, alt: "Bônus: livro digital A Musculação para Naturais, guia de bolso para tudo relacionado à musculação para naturais" },
  { img: bonus3, alt: "Bônus: série WNBF PRO por trás dos palcos, documentando a preparação rumo aos palcos e as estratégias que levaram ao título" },
  { img: bonus4, alt: "Bônus: e-book com as melhores dicas práticas para montar o treino, ajustar a dieta e monitorar o progresso" },
];

/** Página de venda dos Treinos Essenciais 2.0, na mesma ordem da página anterior e no visual da LP. */
export function Planilhas() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pl-hero > *", { y: 30, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.1 });
        gsap.utils.toArray<HTMLElement>(".pl-revela").forEach((el) => {
          gsap.from(el.children, { y: 50, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="bg-night pb-24 text-bone lg:pb-0">
      {/* topo */}
      <section className="p-2.5 sm:p-4">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-[radial-gradient(70%_70%_at_50%_0%,#2a2fb8_0%,#10154a_55%,#080a24_100%)] px-6 pb-16 pt-6 sm:rounded-[2.75rem] sm:px-10 sm:pb-24">
          <Link href="/" className="font-display text-2xl leading-none">
            DLM<span className="sr-only"> · {PERFIL.marca}</span>
          </Link>
          <div className="pl-hero mx-auto mt-10 flex max-w-4xl flex-col items-center text-center sm:mt-14">
            <Image src={logoProduto} alt="Treinos Essenciais 2.0" preload sizes="320px" className="h-auto w-[min(18rem,70vw)]" />
            <h1 className="mt-8 font-display text-[clamp(2.4rem,6.5vw,5.2rem)] uppercase leading-[0.92]">
              Construa o corpo que você sempre quis ver no espelho,{" "}
              <span className="font-serif normal-case italic text-bronze">com ganhos de massa e força a cada semana.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-bone/75">
              Clique no botão abaixo para falar com a minha equipe e garantir um desconto de 10% nas planilhas.
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <MagneticButton href={CTA.planilhas} external variant="bronze" className="px-8 py-5">
                Quero 10% de desconto
              </MagneticButton>
              <MagneticButton href={CHECKOUT_PLANILHAS} external variant="outline-light" className="px-8 py-5">
                Quero entrar agora
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* dores */}
      <Painel claro>
        <div className="pl-revela text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95] text-night">
            Se você ainda não conseguiu o shape que gostaria,{" "}
            <span className="font-serif normal-case italic text-indigo">provavelmente enfrenta problemas como:</span>
          </h2>
        </div>
        <ul className="pl-revela mt-10 grid gap-4 sm:grid-cols-2">
          {DORES.map((d) => (
            <li key={d.alt} className="overflow-hidden rounded-[1.5rem] ring-1 ring-night/10">
              <Image src={d.img} alt={d.alt} placeholder="blur" sizes="(min-width: 640px) 560px, 100vw" className="h-auto w-full" />
            </li>
          ))}
        </ul>
        <div className="pl-revela mx-auto mt-10 max-w-3xl space-y-4 rounded-[1.75rem] bg-night p-7 text-center text-lg leading-relaxed text-bone/80 sm:p-10">
          <p>
            A verdade é que o <Destaque>problema não está no quanto você se dedica</Destaque> ou o quanto sabe sobre musculação.
          </p>
          <p>
            A maioria das pessoas passa meses, até anos, testando dietas, experimentando técnicas novas, consultorias aleatórias{" "}
            <Destaque>e, no final, nada dá os resultados que você queria.</Destaque>
          </p>
          <p>
            Isso acontece porque muitos <Destaque>métodos genéricos da internet não usam periodização,</Destaque> progressão e exercícios certos,
            deixando esse problema para você resolver sozinho.
          </p>
          <p>
            <Destaque>Mas agora existe um jeito comprovado, fácil e seguro de treinar</Destaque> para quem quer chegar no melhor físico da vida e parar
            de perder tempo…
          </p>
        </div>
      </Painel>

      {/* apresentando */}
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="pl-revela mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow className="text-bronze">Apresentando</Eyebrow>
          <Image src={logoProduto} alt="Treinos Essenciais 2.0" sizes="280px" className="mt-6 h-auto w-[min(16rem,60vw)]" />
          <h2 className="mt-8 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95]">Você não vai mais ficar sem saber o que fazer.</h2>
          <p className="mt-5 text-lg leading-relaxed text-bone/75">
            Esse é o sistema com treinos prontos, criados pelo Jayme para quem é natural, com materiais e aulas que te levam do iniciante ao avançado.
          </p>
          <p className="mt-4 leading-relaxed text-bone/65">
            Sei como é frustrante tentar de tudo e continuar no mesmo lugar, por isso melhoramos os Treinos Essenciais para ser a prova de frustrações.
          </p>
          <p className="mt-4 leading-relaxed text-bone/65">
            Diferente de outros métodos genéricos, que simplesmente te entregam planilhas complicadas e te deixam por conta própria, os Treinos Essenciais
            2.0 te dão o passo a passo completo e mais…
          </p>
          <div className="mt-10 w-full rounded-[1.75rem] bg-bronze px-6 py-7 text-night">
            <p className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase leading-none">1 ano de planejamento em cada treino</p>
            <p className="mt-2 font-semibold">(Com resultados visíveis nos primeiros meses!)</p>
          </div>
          <p className="mt-10 leading-relaxed text-bone/75">
            A versão 2.0 é muito além da 1.0. Nós melhoramos o que já funcionava: adicionamos aulas curtas e tutoriais, materiais detalhados sobre cada
            treino e uma novidade exclusiva de mercado… <span className="italic text-bone/55">(mas isso eu te conto já, já)</span>
          </p>
          <p className="mt-4 leading-relaxed text-bone/75">
            Ou seja, se antes já era bom, agora é o momento perfeito para qualquer um, não importa o nível, chegar no físico que sempre quis.
          </p>
        </div>
      </section>

      {/* para quem é */}
      <Painel claro>
        <div className="pl-revela text-center">
          <Eyebrow className="justify-center">Para quem é</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95] text-night">
            Para quem é o <span className="font-serif normal-case italic text-indigo">Treinos Essenciais 2.0?</span>
          </h2>
        </div>
        <ul className="pl-revela mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PUBLICO.map((p) => (
            <li key={p.alt}>
              <Image src={p.img} alt={p.alt} sizes="(min-width: 1024px) 280px, 45vw" className="h-auto w-full" />
            </li>
          ))}
        </ul>
        <div className="pl-revela mx-auto mt-6 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink/60">Em resumo:</p>
          <Image
            src={publicoResumo}
            alt="Se você quer um corpo mais forte e definido com um método inteligente e fácil de seguir, o Treinos Essenciais 2.0 foi feito para você"
            sizes="(min-width: 640px) 640px, 100vw"
            className="mt-3 h-auto w-full"
          />
          <Comprar className="mt-8" />
        </div>
      </Painel>

      <PorDentro />
      <Recebe />
      <Comparacao />

      {/* bônus */}
      <Painel claro>
        <div className="pl-revela text-center">
          <Eyebrow className="justify-center">Sem custo algum</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95] text-night">
            Bônus <span className="font-serif normal-case italic text-indigo">exclusivos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-semibold text-ink/75">
            Além do acesso completo aos Treinos Essenciais 2.0 você recebe os seguintes bônus para potencializar ainda mais seus resultados sem custo algum:
          </p>
        </div>
        <ul className="pl-revela mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BONUS.map((b) => (
            <li key={b.alt}>
              <Image src={b.img} alt={b.alt} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw" className="h-auto w-full" />
            </li>
          ))}
        </ul>
      </Painel>

      {/* garantia */}
      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="pl-revela mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] bg-navy p-8 text-center ring-1 ring-indigo-soft/30 sm:p-12">
          <ShieldCheck className="size-14 text-bronze" strokeWidth={1.3} />
          <p className="mt-4 font-display text-6xl leading-none">
            7 <span className="text-bronze">dias</span>
          </p>
          <p className="mt-5 leading-relaxed text-bone/80">
            Oferecemos uma <Destaque>garantia incondicional de 7 dias</Destaque>, você pode testar os Treinos Essenciais 2.0 sem riscos. Se, por qualquer
            motivo, você não estiver satisfeito com o que ver lá dentro, <strong className="text-bone">basta solicitar o reembolso dentro de 7 dias após a confirmação do pagamento.</strong>
          </p>
          <p className="mt-4 leading-relaxed text-bone/80">
            <strong className="text-bone">Essa garantia é prevista por lei,</strong> sem perguntas ou complicações. É só pedir e enviamos todo o seu dinheiro de volta.
          </p>
          <p className="mt-4 font-semibold text-bronze">Aproveite com total segurança — seu risco é zero!</p>
        </div>
      </section>

      {/* mentor */}
      <Painel claro>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="pl-revela mx-auto w-full max-w-sm">
            <Image src={jayme} alt="Jayme De Lamadrid com a medalha WNBF PRO no palco" sizes="(min-width: 1024px) 380px, 80vw" className="h-auto w-full" />
          </div>
          <div className="pl-revela">
            <Eyebrow>Quem será seu mentor?</Eyebrow>
            <SplitReveal className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] uppercase leading-[0.95] text-night">
              Prazer, meu nome é <span className="font-serif normal-case italic text-indigo">Jayme De Lamadrid.</span>
            </SplitReveal>
            <p className="mt-5 leading-relaxed text-ink/75">
              Hoje, sou uma das maiores referências em musculação natural no Brasil e já ajudei mais de 22.000 pessoas a chegarem na melhor versão física –
              sem comprometer a saúde com esteroides.
            </p>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-ink/60">Nos últimos anos:</p>
            <ul className="mt-3 space-y-2.5">
              {MENTOR.map((m) => (
                <li key={m} className="flex gap-3 text-ink/80">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-indigo text-bone">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-ink/75">
              Agora, meu objetivo é democratizar esse conhecimento e mostrar que qualquer pessoa pode conquistar um físico mais definido com os{" "}
              <strong className="text-night">TREINOS ESSENCIAIS 2.0.</strong>
            </p>
            <Comprar className="mt-8" />
          </div>
        </div>
      </Painel>

      <Duvidas />

      <footer className="px-6 py-10 text-center text-xs text-bone/45">
        Jayme de Lamadrid © Todos os direitos reservados ·{" "}
        <Link href="/" className="underline-offset-4 hover:underline">
          {PERFIL.marca}
        </Link>
      </footer>

      {/* CTA fixo no celular */}
      <div className="fixed inset-x-3 bottom-3 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <a
          href={CHECKOUT_PLANILHAS}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-full bg-bronze px-6 py-4 text-night shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
        >
          <span className="text-sm font-extrabold uppercase tracking-[0.08em]">Quero entrar agora</span>
          <span className="text-sm font-bold">{PRECO_PLANILHAS}</span>
        </a>
      </div>
    </main>
  );
}

function PorDentro() {
  const [grupo, setGrupo] = useState(0);
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="pl-revela text-center">
          <Eyebrow className="justify-center text-bronze">Exclusivo para alunos</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95]">
            Os Treinos Essenciais 2.0 <span className="font-serif normal-case italic text-indigo-soft">por dentro</span>
          </h2>
        </div>

        <div className="pl-revela mt-14 grid items-center gap-8 lg:grid-cols-2">
          <h3 className="font-display text-3xl uppercase leading-tight sm:text-4xl">Esse é você hoje, sem os Treinos Essenciais 2.0</h3>
          <Image src={antes} alt="Aluno antes dos Treinos Essenciais 2.0" sizes="(min-width: 1024px) 560px, 100vw" className="mx-auto h-auto w-full max-w-md" />
        </div>

        <div className="pl-revela mt-16 text-center">
          <h3 className="font-display text-3xl uppercase leading-tight sm:text-4xl">Você escolhe qual grupo é seu foco</h3>
          <div role="tablist" aria-label="Grupo muscular" className="mt-6 flex flex-wrap justify-center gap-2">
            {GRUPOS.map((g, i) => (
              <button
                key={g.nome}
                type="button"
                role="tab"
                aria-selected={grupo === i}
                onClick={() => setGrupo(i)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.1em] transition-colors",
                  grupo === i ? "bg-bronze text-night" : "bg-bone/[0.06] text-bone/75 ring-1 ring-bone/15 hover:text-bone",
                )}
              >
                {g.nome}
              </button>
            ))}
          </div>
          <p className="mt-8 font-serif text-2xl italic text-bronze">Esse será seu treino de {GRUPOS[grupo].nome}</p>
          <div className="relative mx-auto mt-4 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={grupo}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={GRUPOS[grupo].img}
                  alt={`Planilha de treino de ${GRUPOS[grupo].nome} dos Treinos Essenciais 2.0`}
                  sizes="(min-width: 640px) 576px, 100vw"
                  className="h-auto w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="pl-revela mt-16 grid items-center gap-8 lg:grid-cols-2">
          <h3 className="font-display text-3xl uppercase leading-tight sm:text-4xl lg:order-last">
            Você em menos de 1 ano <span className="font-serif normal-case italic text-bronze">com os Treinos Essenciais 2.0</span>
          </h3>
          <Image src={depois} alt="Aluno depois dos Treinos Essenciais 2.0" sizes="(min-width: 1024px) 560px, 100vw" className="mx-auto h-auto w-full max-w-md" />
        </div>
        <div className="pl-revela mt-12 flex justify-center">
          <Comprar />
        </div>
      </div>
    </section>
  );
}

function Recebe() {
  return (
    <Painel claro>
      <div className="pl-revela text-center">
        <Eyebrow className="justify-center">Tudo incluso</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95] text-night">
          O que você <span className="font-serif normal-case italic text-indigo">vai receber</span>
        </h2>
      </div>
      <ul className="pl-revela mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RECEBE.map((r, i) => (
          <li key={r.titulo} className={cn("rounded-[1.5rem] p-6", i % 3 === 0 ? "bg-night text-bone" : "border border-night/10 bg-bone")}>
            <span className={cn("font-serif text-4xl italic", i % 3 === 0 ? "text-bronze" : "text-indigo/60")}>0{i + 1}</span>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight tracking-wide">{r.titulo}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", i % 3 === 0 ? "text-bone/70" : "text-ink/70")}>{r.texto}</p>
          </li>
        ))}
      </ul>
      <div className="pl-revela mt-10 flex justify-center">
        <Comprar />
      </div>
    </Painel>
  );
}

function Comparacao() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="pl-revela text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95]">
            1.0 <span className="font-serif normal-case italic text-indigo-soft">ou</span> 2.0?
          </h2>
        </div>
        <div className="pl-revela mt-10 overflow-hidden rounded-[1.75rem] ring-1 ring-bone/15">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-bone/[0.06]">
              <tr>
                <th scope="col" className="px-4 py-4 font-display text-base uppercase tracking-wide sm:px-6 sm:text-lg">
                  O que está incluso
                </th>
                <th scope="col" className="px-2 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-bone/60 sm:text-sm">
                  Essenciais 1.0
                </th>
                <th scope="col" className="bg-indigo px-2 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] sm:text-sm">
                  Essenciais 2.0
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARACAO.map(([item, v1, v2]) => (
                <tr key={item} className="border-t border-bone/10">
                  <th scope="row" className="px-4 py-4 font-medium text-bone/85 sm:px-6">
                    {item}
                  </th>
                  <td className="px-2 py-4 text-center">
                    <Marca sim={v1} />
                  </td>
                  <td className="bg-indigo/25 px-2 py-4 text-center">
                    <Marca sim={v2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pl-revela mt-16 rounded-[2rem] bg-[radial-gradient(80%_80%_at_50%_0%,#2a2fb8_0%,#10154a_70%)] px-6 py-12 text-center sm:px-12">
          <p className="mx-auto max-w-xl text-lg text-bone/80">
            Para obter acesso à versão 100% atualizada e melhorada, <strong className="text-bone">você vai pagar apenas</strong>
          </p>
          <p className="mt-3 font-display text-[clamp(3.5rem,10vw,6rem)] leading-none text-bronze">{PRECO_PLANILHAS}</p>
          <p className="mt-2 text-sm text-bone/60">Acesso por 1 ano · garantia de 7 dias</p>
          <Comprar className="mt-8" />
        </div>
      </div>
    </section>
  );
}

function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);
  return (
    <Painel claro>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Dúvidas</Eyebrow>
          <SplitReveal className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4rem)] uppercase leading-[0.92] text-night">
            Perguntas <span className="font-serif normal-case italic text-indigo">frequentes</span>
          </SplitReveal>
          <a
            href={CTA.planilhas}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo underline decoration-indigo/30 underline-offset-4 hover:decoration-indigo"
          >
            <MessageCircle className="size-4" /> Fale com a minha equipe · {CONTACT.phoneDisplay}
          </a>
        </div>
        <ul className="lg:col-span-7 lg:col-start-6">
          {FAQ_PLANILHAS.map((f, i) => {
            const open = aberta === i;
            return (
              <li key={f.p} className="border-b border-night/12 first:border-t">
                <button
                  type="button"
                  onClick={() => setAberta(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-lg uppercase tracking-wide text-night sm:text-xl">{f.p}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "#2a2fb8" : "rgba(8,10,36,0)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={cn("grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-night/20", open ? "text-bone" : "text-night")}
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 leading-relaxed text-ink/70">{f.r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </Painel>
  );
}

function Painel({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <section className="px-2.5 sm:px-4">
      <div className={cn("grain relative rounded-[2rem] px-6 py-20 sm:rounded-[2.75rem] sm:px-10 sm:py-28", claro ? "bg-bone text-ink" : "bg-navy")}>
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </section>
  );
}

function Comprar({ className }: { className?: string }) {
  return (
    <MagneticButton href={CHECKOUT_PLANILHAS} external variant="bronze" className={cn("px-9 py-5", className)}>
      Quero entrar agora
    </MagneticButton>
  );
}

function Destaque({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-bronze underline decoration-bronze/40 underline-offset-4">{children}</strong>;
}

function Marca({ sim }: { sim: boolean }) {
  return sim ? (
    <Check className="mx-auto size-5 text-emerald-400" strokeWidth={3} aria-label="Sim" />
  ) : (
    <X className="mx-auto size-5 text-red-400" strokeWidth={3} aria-label="Não" />
  )
}
