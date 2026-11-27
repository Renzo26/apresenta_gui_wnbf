// Entrada pelo botão do CRM: /entrar?t=<token de 60 s>. Confere, abre a sessão e vai para o início.
import { COOKIE, DURACAO_S, criarSessao, lerTokenDoCrm } from "@/lib/acesso";
import { usuarioComAcesso } from "@/lib/fonte";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = process.env.DASH_URL ?? url.origin;
  const dados = await lerTokenDoCrm(url.searchParams.get("t") ?? "");
  if (!dados || !(await usuarioComAcesso(dados.sub).catch(() => false))) {
    return Response.redirect(new URL("/acesso?erro=1", base), 303);
  }
  const seguro = base.startsWith("https://") ? "; Secure" : "";
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/", base).toString(),
      "Set-Cookie": `${COOKIE}=${await criarSessao(dados.sub)}; Path=/; Max-Age=${DURACAO_S}; HttpOnly; SameSite=Lax${seguro}`,
      "Cache-Control": "no-store",
    },
  });
}
