"use client";

import { ArrowLeft, ArrowRight, Check, FileText, Lock, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------- tipos (o que a API devolve) ----------
type CursoPublico = { titulo: string; subtitulo: string; suporte: string; compra: string; boas_vindas?: string };
type Aula = { id: string; modulo: string; titulo: string; descricao: string; duracao: string; capa: string; material: string; embed: string };
type Dados = { ok: true; email: string; admin: boolean; curso: CursoPublico; aulas: Aula[] };
type Estado = { fase: "carregando" } | { fase: "erro_rede" } | { fase: "entrada"; curso: CursoPublico; erro?: string } | { fase: "dentro"; dados: Dados };

const API = "/curso-nutricao/api/aluno";
const MENSAGENS: Record<string, string> = {
  invalido: "Digite um e-mail válido.",
  nao_encontrado: "Não encontramos esse e-mail na lista de alunos. Confira se é o mesmo e-mail que você usou na compra.",
  bloqueado: "O acesso deste e-mail está suspenso. Fale com o suporte.",
  limite: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.",
  rede: "Não conseguimos conectar. Confira sua internet e tente de novo.",
  servidor: "Algo deu errado do nosso lado. Tente de novo em instantes.",
};
const EASE = [0.22, 1, 0.36, 1] as const;

async function chamar(acao: string, campos: Record<string, unknown> = {}) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao, ...campos }), cache: "no-store" });
  return r.json();
}

const dois = (n: number) => String(n).padStart(2, "0");

/** "Nutrição Básica para Naturais" → NUTRIÇÃO BÁSICA + "para Naturais" em itálico, como "Biblioteca do Jayme". */
function TituloRico({ titulo, className }: { titulo: string; className?: string }) {
  const m = /^(.+?)\s+((?:para|do|da|de|dos|das|no|na)\s+.+)$/i.exec(titulo);
  return (
    <h1 className={cn("font-display uppercase leading-[0.9]", className)}>
      {m ? (
        <>
          {m[1]} <span className="font-serif normal-case italic text-indigo-soft">{m[2]}</span>
        </>
      ) : (
        titulo
      )}
    </h1>
  );
}

function Paragrafos({ texto }: { texto: string }) {
  return (
    <>
      {texto
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
    </>
  );
}

// ---------- progresso (fica no navegador do aluno) ----------
function useProgresso(email: string | null) {
  const chave = `dlm_curso_feitas:${email ?? ""}`;
  const [feitas, setFeitas] = useState<string[]>([]);
  useEffect(() => {
    if (!email) return;
    let lidas: string[] = [];
    try {
      lidas = JSON.parse(localStorage.getItem(chave) ?? "[]");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura do armazenamento do navegador ao entrar
    setFeitas(Array.isArray(lidas) ? lidas : []);
  }, [chave, email]);
  const marcar = useCallback(
    (id: string, valor: boolean) =>
      setFeitas((atual) => {
        const nova = atual.filter((x) => x !== id).concat(valor ? [id] : []);
        try {
          localStorage.setItem(chave, JSON.stringify(nova));
        } catch {}
        return nova;
      }),
    [chave],
  );
  return { feitas, marcar };
}

// ---------- rota pelo #aula-id (o botão voltar do celular funciona) ----------
function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const ler = () => setHash(location.hash);
    ler();
    addEventListener("hashchange", ler);
    return () => removeEventListener("hashchange", ler);
  }, []);
  return hash;
}

export function AreaAluno() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  const iniciar = useCallback(() => {
    chamar("estado")
      .then((r) => setEstado(r.ok ? { fase: "dentro", dados: r } : { fase: "entrada", curso: r.curso ?? { titulo: "Área de membros", subtitulo: "", suporte: "", compra: "" } }))
      .catch(() => setEstado({ fase: "erro_rede" }));
  }, []);
  useEffect(() => {
    iniciar();
  }, [iniciar]);

  return (
    <main className="min-h-svh bg-night text-bone">
      <AnimatePresence mode="wait">
        {estado.fase === "carregando" && (
          <motion.div key="c" exit={{ opacity: 0 }} className="grid min-h-svh place-items-center">
            <span className="size-8 animate-spin rounded-full border-2 border-bone/15 border-t-bronze" aria-label="Carregando" />
          </motion.div>
        )}
        {estado.fase === "erro_rede" && (
          <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-svh place-items-center px-6 text-center">
            <div>
              <p className="text-bone/75">{MENSAGENS.rede}</p>
              <button type="button" onClick={iniciar} className="mt-4 rounded-full border border-bone/25 px-5 py-2.5 text-sm font-semibold hover:border-bone/60">
                Tentar de novo
              </button>
            </div>
          </motion.div>
        )}
        {estado.fase === "entrada" && (
          <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Entrada curso={estado.curso} aoEntrar={(dados) => setEstado({ fase: "dentro", dados })} />
          </motion.div>
        )}
        {estado.fase === "dentro" && (
          <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dentro
              dados={estado.dados}
              aoSair={() => {
                chamar("sair")
                  .catch(() => {})
                  .then(() => {
                    history.replaceState(null, "", location.pathname + location.search);
                    setEstado({ fase: "carregando" });
                    iniciar();
                  });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ---------- fundo com o brilho índigo (o mesmo da Biblioteca) ----------
function Brilho() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(60% 80% at 80% 0%, rgba(42,47,184,0.55), transparent 70%)" }}
    />
  );
}

// ---------- tela de entrada ----------
function Entrada({ curso, aoEntrar }: { curso: CursoPublico; aoEntrar: (d: Dados) => void }) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("dlm_curso_ultimo_email") ?? "";
    } catch {
      return "";
    }
  });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const limpo = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpo)) return setErro("invalido");
    setEnviando(true);
    setErro("");
    try {
      const r = await chamar("entrar", { email: limpo });
      if (r.ok) {
        try {
          localStorage.setItem("dlm_curso_ultimo_email", limpo);
        } catch {}
        return aoEntrar(r);
      }
      setErro(r.erro ?? "servidor");
    } catch {
      setErro("rede");
    }
    setEnviando(false);
  };

  return (
    <section className="grain relative min-h-svh overflow-hidden px-6 pb-16 pt-8 sm:px-10">
      <Brilho />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-bone/60 transition-colors hover:text-bone">
          <ArrowLeft className="size-4" /> De Lamadrid Team
        </Link>
        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <motion.div className="lg:col-span-7" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }}>
            <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-bronze">
              <span className="h-px w-8 bg-current" /> Área de membros
            </p>
            <TituloRico titulo={curso.titulo} className="mt-4 text-[clamp(3rem,8vw,6.2rem)]" />
            {curso.subtitulo && <p className="mt-4 max-w-xl text-lg leading-relaxed text-bone/75">{curso.subtitulo}</p>}
            <ol className="mt-8 space-y-3 text-bone/75">
              {["Digite o e-mail que você usou na compra.", "O acesso é liberado na hora, sem senha.", "Neste aparelho você fica conectado por 30 dias."].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-indigo text-xs font-bold text-bone">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          >
            <div className="rounded-[2rem] bg-bone p-6 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-8">
              <span className="grid size-11 place-items-center rounded-2xl bg-night text-bone">
                <Lock className="size-5" />
              </span>
              <h2 className="mt-5 font-display text-3xl uppercase leading-none text-night">Entrar no curso</h2>
              <form onSubmit={enviar} noValidate className="mt-6">
                <label htmlFor="email-curso" className="text-xs font-bold uppercase tracking-[0.14em] text-steel">
                  E-mail usado na compra
                </label>
                <input
                  id="email-curso"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  autoFocus={!email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="mt-2 w-full rounded-2xl border border-night/15 bg-white px-4 py-3.5 text-base text-night outline-none transition-colors placeholder:text-steel/60 focus:border-indigo"
                />
                <button
                  type="submit"
                  disabled={enviando}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-indigo py-4 font-bold text-bone transition-[background-color,transform] hover:bg-navy active:scale-[0.99] disabled:opacity-70"
                >
                  {enviando ? "Entrando…" : "Acessar aulas"}
                  {!enviando && <ArrowRight className="size-4" />}
                </button>
                <p role="alert" className="mt-3 min-h-5 text-sm text-red-700">
                  {erro && MENSAGENS[erro]}
                  {erro && (erro === "nao_encontrado" || erro === "bloqueado") && curso.suporte && (
                    <>
                      {" "}
                      <a href={curso.suporte} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                        Falar com o suporte
                      </a>
                    </>
                  )}
                </p>
              </form>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                Não lembra qual e-mail usou? Procure o e-mail de confirmação da compra na sua caixa de entrada.
                {curso.suporte && (
                  <>
                    {" "}
                    <a href={curso.suporte} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo underline underline-offset-2">
                      Precisa de ajuda?
                    </a>
                  </>
                )}
              </p>
              {curso.compra && (
                <p className="mt-3 text-sm text-steel">
                  Ainda não é aluno?{" "}
                  <a href={curso.compra} className="font-semibold text-indigo underline underline-offset-2">
                    Garanta sua vaga
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- dentro do curso ----------
function Dentro({ dados, aoSair }: { dados: Dados; aoSair: () => void }) {
  const hash = useHash();
  const { feitas, marcar } = useProgresso(dados.email);
  const idAula = /^#aula-([a-z0-9]+)$/.exec(hash)?.[1] ?? null;
  const indice = idAula ? dados.aulas.findIndex((a) => a.id === idAula) : -1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [indice]);

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-bone/10 bg-night/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3 sm:px-10">
          <Link href="/" className="font-display text-xl uppercase tracking-wide">
            DLM<span className="text-bronze">.</span>
          </Link>
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <span className="truncate text-bone/60">{dados.admin ? "Modo administrador" : dados.email}</span>
            {!dados.admin && (
              <button type="button" onClick={aoSair} className="shrink-0 rounded-full border border-bone/20 px-3.5 py-1.5 text-xs font-semibold text-bone/80 hover:border-bone/50 hover:text-bone">
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
      {dados.admin && (
        <p className="bg-bronze/15 px-6 py-2 text-center text-xs text-bone/80">Você está vendo pelo painel de administração. Os alunos entram com o e-mail da compra.</p>
      )}
      <AnimatePresence mode="wait">
        {indice >= 0 ? (
          <motion.div key={`a-${idAula}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <TelaAula dados={dados} indice={indice} feitas={feitas} marcar={marcar} />
          </motion.div>
        ) : (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TelaLista dados={dados} feitas={feitas} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TelaLista({ dados, feitas }: { dados: Dados; feitas: string[] }) {
  const total = dados.aulas.length;
  const concluidas = dados.aulas.filter((a) => feitas.includes(a.id)).length;
  const proxima = dados.aulas.find((a) => !feitas.includes(a.id)) ?? dados.aulas[0];
  const pct = total ? Math.round((concluidas / total) * 100) : 0;
  const modulos = useMemo(() => {
    const grupos: { nome: string; aulas: { aula: Aula; numero: number }[] }[] = [];
    dados.aulas.forEach((aula, i) => {
      const g = grupos.find((x) => x.nome === aula.modulo) ?? (grupos.push({ nome: aula.modulo, aulas: [] }), grupos[grupos.length - 1]);
      g.aulas.push({ aula, numero: i + 1 });
    });
    return grupos;
  }, [dados.aulas]);

  return (
    <>
      <header className="grain relative overflow-hidden px-6 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14">
        <Brilho />
        <div className="relative mx-auto max-w-6xl">
          <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-bronze">
            <span className="h-px w-8 bg-current" /> {total ? `${total} aulas · ` : ""}Área de membros
          </p>
          <TituloRico titulo={dados.curso.titulo} className="mt-4 text-[clamp(2.8rem,8vw,5.8rem)]" />
          {dados.curso.subtitulo && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bone/75">{dados.curso.subtitulo}</p>}

          {total > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="max-w-xl">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-bone/70">
                    {concluidas} de {total} aulas assistidas
                  </span>
                  <b className="font-display text-2xl leading-none tabular-nums">{pct}%</b>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-bone/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                  <motion.div className="h-full rounded-full bg-bronze" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: EASE }} />
                </div>
              </div>
              {proxima && (
                <a
                  href={`#aula-${proxima.id}`}
                  className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-bone px-6 py-3.5 font-bold text-night transition-colors hover:bg-indigo-soft"
                >
                  <Play className="size-4 shrink-0 fill-current" />
                  <span className="truncate">{concluidas ? `Continuar: ${proxima.titulo}` : "Começar pela primeira aula"}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        {dados.curso.boas_vindas && (
          <div className="mb-10 space-y-2 rounded-[1.5rem] border border-bone/10 bg-bone/[0.04] p-5 leading-relaxed text-bone/75 sm:p-6">
            <Paragrafos texto={dados.curso.boas_vindas} />
          </div>
        )}
        {!total && <p className="py-16 text-center text-bone/60">As aulas vão aparecer aqui em breve.</p>}
        {modulos.map((g) => {
          const feitasNoModulo = g.aulas.filter((i) => feitas.includes(i.aula.id)).length;
          return (
            <section key={g.nome || "sem"} className="pt-10 first:pt-0">
              {g.nome && (
                <div className="flex items-baseline justify-between gap-4 border-b border-bone/10 pb-3">
                  <h2 className="font-display text-2xl uppercase leading-none tracking-wide sm:text-3xl">{g.nome}</h2>
                  <span className="shrink-0 text-xs text-bone/50 tabular-nums">
                    {feitasNoModulo}/{g.aulas.length} aulas
                  </span>
                </div>
              )}
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.aulas.map(({ aula, numero }) => (
                  <li key={aula.id}>
                    <CartaoAula aula={aula} numero={numero} feita={feitas.includes(aula.id)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

function CartaoAula({ aula, numero, feita }: { aula: Aula; numero: number; feita: boolean }) {
  return (
    <a href={`#aula-${aula.id}`} className={cn("group block overflow-hidden rounded-[1.4rem] border border-bone/10 bg-bone/[0.04] transition-colors hover:border-indigo-soft/50", feita && "opacity-80")}>
      <span className="relative block aspect-video overflow-hidden bg-navy">
        {aula.capa ? (
          // capa do Bunny (domínio externo, trocável no painel)
          // eslint-disable-next-line @next/next/no-img-element
          <img src={aula.capa} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.04]" />
        ) : (
          <span className="grid size-full place-items-center font-display text-5xl text-bone/20">{dois(numero)}</span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
        <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-bone text-night transition-transform duration-300 group-hover:scale-110">
          <Play className="size-4 translate-x-px fill-current" />
        </span>
        {feita && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bronze px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-night">
            <Check className="size-3" strokeWidth={3} /> Assistida
          </span>
        )}
      </span>
      <span className="block p-4">
        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-bronze">
          Aula {dois(numero)}
          {aula.duracao && ` · ${aula.duracao}`}
        </span>
        <span className="mt-1.5 block font-semibold leading-snug text-bone">{aula.titulo}</span>
      </span>
    </a>
  );
}

function TelaAula({ dados, indice, feitas, marcar }: { dados: Dados; indice: number; feitas: string[]; marcar: (id: string, v: boolean) => void }) {
  const a = dados.aulas[indice];
  const anterior = dados.aulas[indice - 1];
  const seguinte = dados.aulas[indice + 1];
  const feita = feitas.includes(a.id);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-10 sm:pt-8">
      <div className="flex items-center justify-between gap-3 text-sm">
        <a href="#" className="inline-flex items-center gap-2 text-bone/70 hover:text-bone">
          <ArrowLeft className="size-4" /> Todas as aulas
        </a>
        <span className="text-bone/50 tabular-nums">
          Aula {indice + 1} de {dados.aulas.length}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ring-1 ring-bone/10">
        {a.embed ? (
          <div className="relative aspect-video">
            <iframe
              key={a.id}
              src={a.embed}
              title={a.titulo}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>
        ) : (
          <div className="grid aspect-video place-items-center px-6 text-center text-bone/60">O vídeo desta aula estará disponível em breve.</div>
        )}
      </div>

      <article className="mt-7">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-bronze">
          {a.modulo && `${a.modulo} · `}Aula {dois(indice + 1)}
          {a.duracao && ` · ${a.duracao}`}
        </p>
        <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.4rem)] uppercase leading-[0.95]">{a.titulo}</h1>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => marcar(a.id, !feita)}
            aria-pressed={feita}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors",
              feita ? "bg-bronze text-night" : "border border-bone/25 text-bone hover:border-bone/60",
            )}
          >
            <Check className="size-4" strokeWidth={3} /> {feita ? "Aula assistida" : "Marcar como assistida"}
          </button>
          {a.material && (
            <a href={a.material} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-3 text-sm font-bold hover:border-bone/60">
              <FileText className="size-4" /> Material da aula
            </a>
          )}
        </div>
        {a.descricao && (
          <div className="mt-6 max-w-3xl space-y-3 leading-relaxed text-bone/75">
            <Paragrafos texto={a.descricao} />
          </div>
        )}
      </article>

      <nav aria-label="Outras aulas" className="mt-12 grid gap-3 sm:grid-cols-2">
        {anterior ? (
          <Vizinha href={`#aula-${anterior.id}`} rotulo="← Aula anterior" titulo={anterior.titulo} />
        ) : (
          <span className="hidden sm:block" />
        )}
        <Vizinha
          href={seguinte ? `#aula-${seguinte.id}` : "#"}
          rotulo={seguinte ? "Concluir e ir para a próxima →" : "Última aula"}
          titulo={seguinte ? seguinte.titulo : "Concluir o curso ✓"}
          destaque
          onClick={() => marcar(a.id, true)}
        />
      </nav>
    </div>
  );
}

function Vizinha({ href, rotulo, titulo, destaque, onClick }: { href: string; rotulo: ReactNode; titulo: string; destaque?: boolean; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-[1.4rem] p-5 transition-colors",
        destaque ? "bg-indigo text-bone hover:bg-navy sm:text-right" : "border border-bone/10 bg-bone/[0.04] hover:border-bone/30",
      )}
    >
      <span className={cn("block text-xs font-bold uppercase tracking-[0.14em]", destaque ? "text-bone/75" : "text-bone/50")}>{rotulo}</span>
      <b className="mt-1.5 block font-semibold leading-snug">{titulo}</b>
    </a>
  );
}
