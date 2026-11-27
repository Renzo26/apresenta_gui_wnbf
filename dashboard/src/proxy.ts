// Tudo no dashboard exige a sessão aberta pelo botão do CRM (ver src/lib/acesso.ts).
// Sem sessão: páginas mostram /acesso; a API responde 401.
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, lerSessao, modoExemplo } from "@/lib/acesso";

export async function proxy(req: NextRequest) {
  if (modoExemplo()) return NextResponse.next();
  if (await lerSessao(req.cookies.get(COOKIE)?.value)) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ erro: "sem acesso" }, { status: 401 });
  return NextResponse.rewrite(new URL("/acesso", req.url));
}

export const config = {
  // livres: a entrada pelo CRM, a tela de acesso, a saída e os arquivos estáticos
  matcher: ["/((?!entrar|acesso|sair|_next/|favicon|icon|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$).*)"],
};
