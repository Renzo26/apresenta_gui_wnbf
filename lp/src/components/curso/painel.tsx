"use client";

import { ArrowDown, ArrowUp, Download, ExternalLink, LogOut, Plus, Trash2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------- tipos ----------
type Curso = { titulo: string; subtitulo: string; boas_vindas: string; biblioteca: string; suporte: string; compra: string };
type AulaEd = { _k: string; id?: string; modulo: string; titulo: string; descricao: string; duracao: string; capa: string; material: string; link: string };
type Contagem = { total: number; ativos: number };
type Aluno = { email: string; ativo: boolean; liberado_em: string; ultimo_acesso: string | null; acessos: number };
type Aviso = { tipo: "ok" | "erro"; texto: string } | null;
type Aba = "aulas" | "alunos" | "curso" | "admins";
type AdminLinha = { email: string; criado_em: string; ultimo_acesso: string | null };

const API = "/curso-nutricao/api/admin";
async function chamar(acao: string, campos: Record<string, unknown> = {}) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao, ...campos }), cache: "no-store" });
  return r.json();
}

let seq = 0;
const chave = () => `k${++seq}`;
const paraEdicao = (aulas: Omit<AulaEd, "_k">[]): AulaEd[] =>
  aulas.map((a) => ({ _k: chave(), id: a.id, modulo: a.modulo ?? "", titulo: a.titulo ?? "", descricao: a.descricao ?? "", duracao: a.duracao ?? "", capa: a.capa ?? "", material: a.material ?? "", link: a.link ?? "" }));
const semChave = (aulas: AulaEd[]) => aulas.map(({ _k, ...a }) => a); // eslint-disable-line @typescript-eslint/no-unused-vars
const quando = (d: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

function baixar(nome: string, conteudo: string, tipo: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PainelCurso() {
  const [fase, setFase] = useState<"carregando" | "login" | "dentro">("carregando");
  const [eu, setEu] = useState("");
  const [curso, setCurso] = useState<Curso | null>(null);
  const [aulas, setAulas] = useState<AulaEd[]>([]);
  const [contagem, setContagem] = useState<Contagem>({ total: 0, ativos: 0 });
  const [aba, setAba] = useState<Aba>("alunos");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [sujo, setSujo] = useState(false);

  const carregar = useCallback((r: { eu?: string; curso: Curso; aulas: Omit<AulaEd, "_k">[]; contagem: Contagem }) => {
    if (r.eu) setEu(r.eu);
    setCurso(r.curso);
    setAulas(paraEdicao(r.aulas));
    setContagem(r.contagem);
    setSujo(false);
    setFase("dentro");
  }, []);

  useEffect(() => {
    chamar("estado")
      .then((r) => {
        if (r.ok) carregar(r);
        else setFase("login");
      })
      .catch(() => setFase("login"));
  }, [carregar]);

  // aviso antes de sair com aulas não salvas
  useEffect(() => {
    const antes = (e: BeforeUnloadEvent) => {
      if (sujo) e.preventDefault();
    };
    addEventListener("beforeunload", antes);
    return () => removeEventListener("beforeunload", antes);
  }, [sujo]);

  const avisar = (tipo: "ok" | "erro", texto: string) => {
    setAviso({ tipo, texto });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const precisaLogin = () => {
    setFase("login");
    avisar("erro", "Sua sessão do painel expirou. Entre de novo.");
  };

  const sair = async () => {
    if (sujo && !confirm("Há alterações nas aulas que não foram salvas. Sair mesmo assim?")) return;
    await chamar("sair").catch(() => {});
    setFase("login");
  };

  if (fase === "carregando")
    return (
      <main className="grid min-h-svh place-items-center bg-[#f4f2ec]">
        <span className="size-8 animate-spin rounded-full border-2 border-night/10 border-t-indigo" aria-label="Carregando" />
      </main>
    );
  if (fase === "login") return <Login aoEntrar={carregar} aviso={aviso} />;

  return (
    <main className="min-h-svh bg-[#f4f2ec] text-ink">
      <header className="bg-night text-bone">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-bronze">DLM TEAM · Painel</p>
            <h1 className="mt-1 font-display text-2xl uppercase leading-none sm:text-3xl">{curso?.titulo}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="hidden text-bone/55 md:inline">{eu}</span>
            <a href="/curso-nutricao" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-4 py-2 font-semibold hover:border-bone/60">
              Ver área do aluno <ExternalLink className="size-3.5" />
            </a>
            <button type="button" onClick={sair} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-bone/70 hover:text-bone">
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 px-5 sm:px-8" role="tablist">
          {(
            [
              ["alunos", `Alunos · ${contagem.ativos}`],
              ["aulas", `Aulas · ${aulas.length}`],
              ["curso", "Dados do curso"],
              ["admins", "Admins"],
            ] as [Aba, string][]
          ).map(([id, nome]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={aba === id}
              onClick={() => {
                setAba(id);
                setAviso(null);
              }}
              className={cn("relative rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors", aba === id ? "text-night" : "text-bone/60 hover:text-bone")}
            >
              {aba === id && <motion.span layoutId="aba-painel" className="absolute inset-0 rounded-t-xl bg-[#f4f2ec]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative">{nome}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {aviso && (
          <div role="status" className={cn("mb-6 flex items-start justify-between gap-4 rounded-2xl px-4 py-3 text-sm", aviso.tipo === "ok" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900")}>
            <span className="whitespace-pre-line">{aviso.texto}</span>
            <button type="button" onClick={() => setAviso(null)} aria-label="Fechar aviso">
              <X className="size-4" />
            </button>
          </div>
        )}
        {aba === "aulas" && curso && (
          <AbaAulas
            curso={curso}
            aulas={aulas}
            setAulas={(a) => {
              setAulas(a);
              setSujo(true);
            }}
            sujo={sujo}
            aoSalvo={(r) => {
              carregar(r);
              avisar("ok", `Aulas salvas (${r.aulas.length}).${r.problemas?.length ? `\nVídeo não reconhecido em: ${r.problemas.join(", ")}` : ""}`);
            }}
            avisar={avisar}
            precisaLogin={precisaLogin}
          />
        )}
        {aba === "alunos" && <AbaAlunos contagem={contagem} setContagem={setContagem} avisar={avisar} precisaLogin={precisaLogin} />}
        {aba === "admins" && <AbaAdmins eu={eu} avisar={avisar} precisaLogin={precisaLogin} />}
        {aba === "curso" && curso && (
          <AbaCurso
            curso={curso}
            aoSalvar={async (c) => {
              const r = await chamar("salvar", { curso: c, aulas: semChave(aulas) });
              if (r.precisaLogin) return precisaLogin();
              if (!r.ok) return avisar("erro", "Não consegui salvar.");
              carregar(r);
              avisar("ok", "Dados do curso salvos.");
            }}
          />
        )}
      </div>
    </main>
  );
}

// ---------- login ----------
function Login({ aoEntrar, aviso }: { aoEntrar: (r: never) => void; aviso: Aviso }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(aviso?.tipo === "erro" ? aviso.texto : "");
  const [enviando, setEnviando] = useState(false);
  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      const r = await chamar("entrar", { email: email.trim().toLowerCase(), senha });
      if (r.ok) return aoEntrar(r as never);
      setErro(r.erro === "limite" ? "Muitas tentativas. Espere 15 minutos." : r.erro === "senha" ? "E-mail ou senha incorretos." : "Não consegui entrar. Tente de novo.");
    } catch {
      setErro("Não consegui entrar. Tente de novo.");
    }
    setEnviando(false);
  };
  return (
    <main className="grid min-h-svh place-items-center bg-night px-5 text-bone">
      <form onSubmit={enviar} className="w-full max-w-sm rounded-[2rem] bg-bone p-7 text-ink">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-bronze-deep">DLM TEAM · Painel</p>
        <h1 className="mt-2 font-display text-3xl uppercase leading-none text-night">Área de membros</h1>
        <label htmlFor="email-painel" className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-steel">
          E-mail
        </label>
        <input
          id="email-painel"
          type="email"
          autoComplete="username"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-night/15 bg-white px-4 py-3 outline-none focus:border-indigo"
        />
        <label htmlFor="senha-painel" className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-steel">
          Senha
        </label>
        <input
          id="senha-painel"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-night/15 bg-white px-4 py-3 outline-none focus:border-indigo"
        />
        {erro && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        <button type="submit" disabled={enviando} className="mt-5 w-full rounded-full bg-indigo py-3.5 font-bold text-bone hover:bg-navy disabled:opacity-70">
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}

// ---------- pedaços de formulário ----------
function Campo({ rotulo, dica, children, className }: { rotulo: string; dica?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-steel">{rotulo}</span>
      <span className="mt-1.5 block">{children}</span>
      {dica && <span className="mt-1 block text-xs text-steel">{dica}</span>}
    </label>
  );
}
const entrada = "w-full rounded-xl border border-night/15 bg-white px-3 py-2.5 text-sm text-night outline-none focus:border-indigo";
const cartao = "rounded-[1.5rem] border border-night/10 bg-white p-5 sm:p-6";
const botao = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50";

// ---------- aulas ----------
function AbaAulas({
  curso,
  aulas,
  setAulas,
  sujo,
  aoSalvo,
  avisar,
  precisaLogin,
}: {
  curso: Curso;
  aulas: AulaEd[];
  setAulas: (a: AulaEd[]) => void;
  sujo: boolean;
  aoSalvo: (r: { curso: Curso; aulas: Omit<AulaEd, "_k">[]; contagem: Contagem; problemas?: string[] }) => void;
  avisar: (t: "ok" | "erro", m: string) => void;
  precisaLogin: () => void;
}) {
  const [aberta, setAberta] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [jsonTexto, setJsonTexto] = useState("");
  const arquivo = useRef<HTMLInputElement>(null);

  const mudar = (k: string, campo: keyof AulaEd, valor: string) => setAulas(aulas.map((a) => (a._k === k ? { ...a, [campo]: valor } : a)));
  const mover = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= aulas.length) return;
    const nova = [...aulas];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setAulas(nova);
  };
  const nova = () => {
    const ultima = aulas[aulas.length - 1];
    const a: AulaEd = { _k: chave(), modulo: ultima?.modulo ?? "", titulo: "", descricao: "", duracao: "", capa: "", material: "", link: "" };
    setAulas([...aulas, a]);
    setAberta(a._k);
  };
  const salvar = async () => {
    setSalvando(true);
    const r = await chamar("salvar", { curso, aulas: semChave(aulas) }).catch(() => ({ ok: false }));
    setSalvando(false);
    if (r.precisaLogin) return precisaLogin();
    if (!r.ok) return avisar("erro", "Não consegui salvar.");
    aoSalvo(r);
  };
  const importar = async () => {
    let json: unknown;
    try {
      json = JSON.parse(jsonTexto);
    } catch {
      return avisar("erro", "Escolha um arquivo .json ou cole o JSON.");
    }
    if (!confirm("Importar vai substituir todas as aulas atuais. Continuar?")) return;
    const r = await chamar("importar", { curso, json }).catch(() => ({ ok: false }));
    if (r.precisaLogin) return precisaLogin();
    if (!r.ok) return avisar("erro", "Não consegui importar.");
    setJsonTexto("");
    aoSalvo(r);
  };
  const exportar = () =>
    baixar(
      "aulas-curso-nutricao.json",
      JSON.stringify({ formato: "dlm-area-membros", versao: 1, curso: { biblioteca: curso.biblioteca }, aulas: semChave(aulas).map(({ id, ...a }) => a) }, null, 2), // eslint-disable-line @typescript-eslint/no-unused-vars
      "application/json",
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-steel">Clique numa aula para editar. A ordem aqui é a ordem que o aluno vê.</p>
        <div className="flex gap-2">
          <button type="button" onClick={nova} className={cn(botao, "border border-night/15 bg-white hover:border-night/40")}>
            <Plus className="size-4" /> Nova aula
          </button>
          <button type="button" onClick={salvar} disabled={salvando || !sujo} className={cn(botao, "bg-indigo text-bone hover:bg-navy")}>
            {salvando ? "Salvando…" : sujo ? "Salvar aulas" : "Tudo salvo"}
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {aulas.map((a, i) => {
          const abertaAgora = aberta === a._k;
          return (
            <li key={a._k} className="overflow-hidden rounded-2xl border border-night/10 bg-white">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-7 shrink-0 font-display text-lg text-steel tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <button type="button" onClick={() => setAberta(abertaAgora ? null : a._k)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate font-semibold text-night">{a.titulo || "Aula sem título"}</span>
                  <span className="block truncate text-xs text-steel">
                    {a.modulo || "Sem módulo"}
                    {a.duracao && ` · ${a.duracao}`}
                    {!a.link && " · sem vídeo"}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} title="Subir" aria-label="Subir" className="rounded-lg p-2 text-steel hover:bg-night/5 disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === aulas.length - 1} title="Descer" aria-label="Descer" className="rounded-lg p-2 text-steel hover:bg-night/5 disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirm(`Remover a aula "${a.titulo || "sem título"}"?`) && setAulas(aulas.filter((x) => x._k !== a._k))}
                    title="Remover"
                    aria-label="Remover"
                    className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              {abertaAgora && (
                <div className="grid gap-4 border-t border-night/10 bg-[#faf9f6] p-4 sm:grid-cols-2">
                  <Campo rotulo="Título">
                    <input className={entrada} value={a.titulo} onChange={(e) => mudar(a._k, "titulo", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Módulo">
                    <input className={entrada} value={a.modulo} placeholder="Módulo 1 · Fundamentos" onChange={(e) => mudar(a._k, "modulo", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Vídeo (Bunny)" dica="Aceita o link de reprodução, o de incorporação, o código <iframe> inteiro ou só o ID do vídeo." className="sm:col-span-2">
                    <input className={entrada} value={a.link} placeholder="https://iframe.mediadelivery.net/play/813424/…" onChange={(e) => mudar(a._k, "link", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Duração">
                    <input className={entrada} value={a.duracao} placeholder="12 min" onChange={(e) => mudar(a._k, "duracao", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Capa (imagem)">
                    <input className={entrada} value={a.capa} placeholder="https://…/thumbnail.jpg" onChange={(e) => mudar(a._k, "capa", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Material (PDF ou link)" className="sm:col-span-2">
                    <input className={entrada} value={a.material} placeholder="https://…" onChange={(e) => mudar(a._k, "material", e.target.value)} />
                  </Campo>
                  <Campo rotulo="Descrição" className="sm:col-span-2">
                    <textarea className={cn(entrada, "min-h-24")} value={a.descricao} onChange={(e) => mudar(a._k, "descricao", e.target.value)} />
                  </Campo>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!aulas.length && <p className="py-10 text-center text-steel">Nenhuma aula ainda.</p>}

      <section className={cartao}>
        <h2 className="font-display text-xl uppercase text-night">Importar e exportar (JSON)</h2>
        <p className="mt-1 text-sm text-steel">Importar substitui todas as aulas atuais.</p>
        <textarea
          className={cn(entrada, "mt-4 min-h-28 font-mono text-xs")}
          placeholder='{"aulas": [ … ]}'
          value={jsonTexto}
          onChange={(e) => setJsonTexto(e.target.value)}
        />
        <input
          ref={arquivo}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setJsonTexto(await f.text());
            e.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => arquivo.current?.click()} className={cn(botao, "border border-night/15 hover:border-night/40")}>
            <Upload className="size-4" /> Escolher arquivo
          </button>
          <button type="button" onClick={importar} disabled={!jsonTexto.trim()} className={cn(botao, "bg-night text-bone hover:bg-navy")}>
            Importar JSON
          </button>
          <button type="button" onClick={exportar} className={cn(botao, "border border-night/15 hover:border-night/40")}>
            <Download className="size-4" /> Baixar JSON das aulas
          </button>
        </div>
      </section>
    </div>
  );
}

// ---------- alunos ----------
function AbaAlunos({
  contagem,
  setContagem,
  avisar,
  precisaLogin,
}: {
  contagem: Contagem;
  setContagem: (c: Contagem) => void;
  avisar: (t: "ok" | "erro", m: string) => void;
  precisaLogin: () => void;
}) {
  const [colados, setColados] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "bloqueados">("todos");
  const [pagina, setPagina] = useState(0);
  const [lista, setLista] = useState<{ alunos: Aluno[]; total: number; paginas: number } | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const carregar = useCallback(async () => {
    const r = await chamar("alunos", { busca, filtro, pagina }).catch(() => null);
    if (!r) return;
    if (r.precisaLogin) return precisaLogin();
    setLista(r);
    setContagem(r.contagem);
  }, [busca, filtro, pagina, precisaLogin, setContagem]);

  useEffect(() => {
    const t = setTimeout(carregar, busca ? 250 : 0);
    return () => clearTimeout(t);
  }, [carregar, busca]);

  const emMassa = async (acao: "liberar" | "bloquear") => {
    setOcupado(true);
    const r = await chamar(acao, { emails: colados }).catch(() => null);
    setOcupado(false);
    if (r?.precisaLogin) return precisaLogin();
    if (!r?.ok) return avisar("erro", r?.erro === "sem_emails" ? "Não achei nenhum e-mail no texto colado." : "Não consegui salvar.");
    setColados("");
    avisar("ok", `${r.achados} e-mail(s) ${acao === "liberar" ? "liberados" : "bloqueados"}.`);
    carregar();
  };
  const umAluno = async (acao: "liberar" | "bloquear" | "excluir", email: string) => {
    if (acao === "excluir" && !confirm(`Excluir ${email} da lista? (para só tirar o acesso, use Bloquear)`)) return;
    const r = await chamar(acao, { emails: email }).catch(() => null);
    if (r?.precisaLogin) return precisaLogin();
    if (!r?.ok) return avisar("erro", "Não consegui salvar.");
    carregar();
  };
  const csv = async () => {
    const r = await chamar("csv").catch(() => null);
    if (r?.ok) baixar("alunos-curso-nutricao.csv", r.csv, "text/csv");
  };
  const qtd = (colados.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? []).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Com acesso", contagem.ativos],
          ["Bloqueados", contagem.total - contagem.ativos],
          ["Total na lista", contagem.total],
        ].map(([n, v]) => (
          <div key={n} className={cartao}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-steel">{n}</p>
            <p className="mt-1 font-display text-4xl leading-none text-night tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <section className={cartao}>
        <h2 className="font-display text-xl uppercase text-night">Liberar ou bloquear em massa</h2>
        <p className="mt-1 text-sm text-steel">
          Cole os e-mails do jeito que vierem (um por linha, separados por vírgula ou a planilha inteira). O painel acha os e-mails sozinho e ignora o resto.
        </p>
        <textarea className={cn(entrada, "mt-4 min-h-32")} placeholder={"maria@gmail.com\njoao@hotmail.com"} value={colados} onChange={(e) => setColados(e.target.value)} />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => emMassa("liberar")} disabled={!qtd || ocupado} className={cn(botao, "bg-indigo text-bone hover:bg-navy")}>
            Liberar acesso{qtd ? ` (${qtd})` : ""}
          </button>
          <button type="button" onClick={() => emMassa("bloquear")} disabled={!qtd || ocupado} className={cn(botao, "border border-red-300 text-red-800 hover:bg-red-50")}>
            Bloquear acesso
          </button>
        </div>
      </section>

      <section className={cartao}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl uppercase text-night">Alunos</h2>
          <button type="button" onClick={csv} className={cn(botao, "border border-night/15 hover:border-night/40")}>
            <Download className="size-4" /> Baixar lista (CSV)
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="search"
            className={cn(entrada, "max-w-xs")}
            placeholder="Buscar e-mail"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(0);
            }}
          />
          <div className="flex gap-1 rounded-full bg-night/5 p-1 text-sm">
            {(
              [
                ["todos", "Todos"],
                ["ativos", "Com acesso"],
                ["bloqueados", "Bloqueados"],
              ] as const
            ).map(([v, n]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setFiltro(v);
                  setPagina(0);
                }}
                className={cn("rounded-full px-3 py-1.5 font-semibold", filtro === v ? "bg-white text-night shadow-sm" : "text-steel hover:text-night")}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-1 mt-4 overflow-x-auto px-1">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-steel">
              <tr className="border-b border-night/10">
                <th className="py-2 pr-3 font-semibold">E-mail</th>
                <th className="px-3 py-2 font-semibold">Situação</th>
                <th className="px-3 py-2 font-semibold">Liberado em</th>
                <th className="px-3 py-2 font-semibold">Último acesso</th>
                <th className="px-3 py-2 text-right font-semibold">Acessos</th>
                <th className="py-2 pl-3" />
              </tr>
            </thead>
            <tbody>
              {lista?.alunos.map((a) => (
                <tr key={a.email} className="border-b border-night/5">
                  <td className="py-2.5 pr-3 font-medium text-night">{a.email}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", a.ativo ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900")}>
                      {a.ativo ? "Com acesso" : "Bloqueado"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-steel tabular-nums">{quando(a.liberado_em)}</td>
                  <td className="px-3 py-2.5 text-steel tabular-nums">{quando(a.ultimo_acesso)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{a.acessos}</td>
                  <td className="py-2.5 pl-3 text-right">
                    <span className="inline-flex gap-1">
                      <button type="button" onClick={() => umAluno(a.ativo ? "bloquear" : "liberar", a.email)} className="rounded-full px-2.5 py-1 text-xs font-semibold text-indigo hover:bg-indigo/10">
                        {a.ativo ? "Bloquear" : "Liberar"}
                      </button>
                      <button type="button" onClick={() => umAluno("excluir", a.email)} className="rounded-full px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
                        Excluir
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista && !lista.alunos.length && <p className="py-8 text-center text-steel">Nenhum aluno encontrado.</p>}
        </div>
        {lista && lista.paginas > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <button type="button" disabled={pagina === 0} onClick={() => setPagina(pagina - 1)} className={cn(botao, "border border-night/15")}>
              ← Anterior
            </button>
            <span className="text-steel">
              Página {pagina + 1} de {lista.paginas} · {lista.total} alunos
            </span>
            <button type="button" disabled={pagina + 1 >= lista.paginas} onClick={() => setPagina(pagina + 1)} className={cn(botao, "border border-night/15")}>
              Próxima →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- admins ----------
function AbaAdmins({ eu, avisar, precisaLogin }: { eu: string; avisar: (t: "ok" | "erro", m: string) => void; precisaLogin: () => void }) {
  const [admins, setAdmins] = useState<AdminLinha[] | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    chamar("admins")
      .then((r) => (r.precisaLogin ? precisaLogin() : setAdmins(r.admins)))
      .catch(() => {});
  }, [precisaLogin]);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    const alvo = email.trim().toLowerCase();
    const existe = admins?.some((a) => a.email === alvo);
    setSalvando(true);
    const r = await chamar("salvar_admin", { email: alvo, senha }).catch(() => null);
    setSalvando(false);
    if (r?.precisaLogin) return precisaLogin();
    if (!r?.ok) return avisar("erro", r?.erro === "senha_curta" ? "A senha precisa ter pelo menos 8 caracteres." : r?.erro === "email" ? "E-mail inválido." : "Não consegui salvar.");
    setAdmins(r.admins);
    setEmail("");
    setSenha("");
    avisar("ok", existe ? `Senha de ${alvo} trocada.` : `${alvo} agora é admin do painel.`);
  };
  const remover = async (alvo: string) => {
    if (!confirm(`Tirar ${alvo} dos admins do painel?`)) return;
    const r = await chamar("remover_admin", { email: alvo }).catch(() => null);
    if (r?.precisaLogin) return precisaLogin();
    if (!r?.ok) return avisar("erro", "Não consegui remover.");
    setAdmins(r.admins);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className={cn(cartao, "lg:col-span-7")}>
        <h2 className="font-display text-xl uppercase text-night">Quem entra no painel</h2>
        <ul className="mt-4 divide-y divide-night/5">
          {admins?.map((a) => (
            <li key={a.email} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span>
                <b className="font-semibold text-night">{a.email}</b>
                {a.email === eu && <span className="ml-2 rounded-full bg-indigo/10 px-2 py-0.5 text-xs font-bold text-indigo">você</span>}
                <span className="block text-xs text-steel">Último acesso: {quando(a.ultimo_acesso)}</span>
              </span>
              {a.email !== eu && (
                <button type="button" onClick={() => remover(a.email)} className="rounded-full px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      <form onSubmit={salvar} className={cn(cartao, "space-y-4 lg:col-span-5")}>
        <div>
          <h2 className="font-display text-xl uppercase text-night">Novo admin ou trocar senha</h2>
          <p className="mt-1 text-sm text-steel">Com um e-mail que já é admin, a senha dele é trocada (e quem estava logado com a antiga sai).</p>
        </div>
        <Campo rotulo="E-mail">
          <input type="email" required autoComplete="off" className={entrada} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Campo>
        <Campo rotulo="Senha" dica="Mínimo 8 caracteres. Fica guardada só como hash.">
          <input type="password" required minLength={8} autoComplete="new-password" className={entrada} value={senha} onChange={(e) => setSenha(e.target.value)} />
        </Campo>
        <button type="submit" disabled={salvando} className={cn(botao, "bg-indigo px-6 text-bone hover:bg-navy")}>
          {salvando ? "Salvando…" : "Salvar admin"}
        </button>
      </form>
    </div>
  );
}

// ---------- dados do curso ----------
function AbaCurso({ curso, aoSalvar }: { curso: Curso; aoSalvar: (c: Curso) => Promise<void> }) {
  const [c, setC] = useState(curso);
  const [salvando, setSalvando] = useState(false);
  const mudar = (k: keyof Curso, v: string) => setC({ ...c, [k]: v });
  return (
    <form
      className={cn(cartao, "grid gap-5 sm:grid-cols-2")}
      onSubmit={async (e) => {
        e.preventDefault();
        setSalvando(true);
        await aoSalvar(c);
        setSalvando(false);
      }}
    >
      <Campo rotulo="Título do curso" className="sm:col-span-2">
        <input className={entrada} value={c.titulo} onChange={(e) => mudar("titulo", e.target.value)} required />
      </Campo>
      <Campo rotulo="Subtítulo" className="sm:col-span-2">
        <input className={entrada} value={c.subtitulo} onChange={(e) => mudar("subtitulo", e.target.value)} />
      </Campo>
      <Campo rotulo="Boas-vindas (aparece acima das aulas)" className="sm:col-span-2">
        <textarea className={cn(entrada, "min-h-24")} value={c.boas_vindas} onChange={(e) => mudar("boas_vindas", e.target.value)} />
      </Campo>
      <Campo rotulo="Biblioteca do Bunny (ID)" dica="Permite colar só o ID do vídeo no lugar do link.">
        <input className={entrada} value={c.biblioteca} placeholder="813424" inputMode="numeric" onChange={(e) => mudar("biblioteca", e.target.value)} />
      </Campo>
      <Campo rotulo="Link de suporte" dica="Aparece para quem tenta entrar com um e-mail sem acesso.">
        <input className={entrada} value={c.suporte} placeholder="https://wa.me/55…" onChange={(e) => mudar("suporte", e.target.value)} />
      </Campo>
      <Campo rotulo="Link de compra" dica="“Ainda não é aluno? Garanta sua vaga” na tela de entrada. Vazio = não aparece." className="sm:col-span-2">
        <input className={entrada} value={c.compra} placeholder="https://…" onChange={(e) => mudar("compra", e.target.value)} />
      </Campo>
      <div className="sm:col-span-2">
        <button type="submit" disabled={salvando} className={cn(botao, "bg-indigo px-6 text-bone hover:bg-navy")}>
          {salvando ? "Salvando…" : "Salvar dados do curso"}
        </button>
      </div>
    </form>
  );
}
