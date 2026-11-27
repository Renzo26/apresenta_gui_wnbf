// Os números do dashboard. Lê banco + Meta e guarda por 5 minutos (todos os gestores veem o mesmo).
import { COOKIE, lerSessao, modoExemplo } from "@/lib/acesso";
import type { Dados } from "@/lib/dados";
import { dadosDeExemplo } from "@/lib/exemplo";
import { montarDados, usuarioComAcesso } from "@/lib/fonte";

const VALIDADE_MS = 5 * 60 * 1000;
let cache: { em: number; dados: Dados } | null = null;
let carregando: Promise<Dados> | null = null;

const json = (corpo: unknown, status = 200) => Response.json(corpo, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(req: Request) {
  if (modoExemplo()) return json(dadosDeExemplo());

  const cookie = req.headers.get("cookie")?.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`))?.[1];
  const uid = await lerSessao(cookie);
  if (!uid || !(await usuarioComAcesso(uid).catch(() => false))) return json({ erro: "sem acesso" }, 401);

  const forcar = new URL(req.url).searchParams.has("atualizar");
  if (!forcar && cache && Date.now() - cache.em < VALIDADE_MS) return json(cache.dados);
  try {
    carregando ??= montarDados().finally(() => (carregando = null));
    const dados = await carregando;
    cache = { em: Date.now(), dados };
    return json(dados);
  } catch (e) {
    console.error("[dados]", e instanceof Error ? e.message : e);
    if (cache) return json({ ...cache.dados, avisos: [...cache.dados.avisos, "Falha ao atualizar agora: mostrando os últimos dados."] });
    return json({ erro: "falha ao carregar os dados" }, 500);
  }
}
