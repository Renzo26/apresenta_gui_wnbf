import { COOKIE } from "@/lib/acesso";

export async function GET(req: Request) {
  const base = process.env.DASH_URL ?? new URL(req.url).origin;
  return new Response(null, {
    status: 303,
    headers: { Location: new URL("/acesso", base).toString(), "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax` },
  });
}
