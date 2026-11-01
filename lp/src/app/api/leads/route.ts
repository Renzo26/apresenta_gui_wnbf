// Recebe o lead do formulário da Black Friday e grava em paginas.leads.
import { SCHEMA, db } from "@/lib/db";
import { validar } from "@/lib/lead";

const LIMITE_BYTES = 8_000;
const MAX_POR_IP = 5;
const JANELA_MS = 10 * 60 * 1000;
const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

// limite simples em memória (um container só); protege o banco de spam
const envios = new Map<string, number[]>();
function passouDoLimite(ip: string) {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  envios.set(ip, recentes);
  if (envios.size > 5_000) envios.clear();
  return recentes.length > MAX_POR_IP;
}

const texto = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > LIMITE_BYTES) return Response.json({ erro: "grande demais" }, { status: 413 });

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: "json inválido" }, { status: 400 });
  }

  // campo invisível no formulário: só robô preenche. Responde ok e não grava.
  if (texto(corpo.empresa, 200)) return Response.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (passouDoLimite(ip)) return Response.json({ erro: "muitas tentativas" }, { status: 429 });

  const campos = { nome: String(corpo.nome ?? ""), email: String(corpo.email ?? ""), telefone: String(corpo.telefone ?? "") };
  const erros = validar(campos);
  if (Object.keys(erros).length) return Response.json({ erros }, { status: 422 });

  const parametros: Record<string, string> = {};
  if (corpo.utms && typeof corpo.utms === "object") {
    for (const [k, v] of Object.entries(corpo.utms as Record<string, unknown>).slice(0, 20)) {
      if (typeof v === "string") parametros[k.slice(0, 50)] = v.slice(0, 300);
    }
  }

  const sql = db();
  const lead = {
    nome: campos.nome.trim().slice(0, 200),
    email: campos.email.trim().toLowerCase().slice(0, 200),
    telefone: campos.telefone.replace(/\D/g, ""),
    pagina: texto(corpo.pagina, 200) ?? "/",
    origem: texto(corpo.origem, 200),
    plano: texto(corpo.plano, 50),
    ...Object.fromEntries(UTMS.map((u) => [u, parametros[u] ?? null])),
    parametros: sql.json(parametros),
    referrer: texto(corpo.referrer, 500),
    user_agent: texto(req.headers.get("user-agent"), 500),
  };

  try {
    await sql`insert into ${sql(SCHEMA)}.leads ${sql(lead)}`;
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[leads] falha ao gravar:", e instanceof Error ? e.message : e);
    return Response.json({ erro: "falha ao gravar" }, { status: 500 });
  }
}
