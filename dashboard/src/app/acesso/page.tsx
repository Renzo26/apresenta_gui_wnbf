import type { Metadata } from "next";

export const metadata: Metadata = { title: "Acesso" };

/** Sem sessão: o acesso é sempre pelo botão "Dashboard do gestor" dentro do CRM. */
export default async function Acesso({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const crm = process.env.CRM_URL;
  return (
    <main className="grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-display text-6xl uppercase leading-none">
          DLM<span className="text-bronze">.</span>
        </p>
        <p className="mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-suave">Tráfego</p>
        <h1 className="mt-10 font-display text-3xl uppercase leading-none">
          Entre pelo <span className="font-serif normal-case italic text-indigo-claro">CRM</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-suave">
          {erro
            ? "O link expirou ou seu usuário não tem acesso ao dashboard (só administradores e gestores). Abra de novo pelo CRM."
            : "O dashboard do gestor abre pelo botão “Dashboard do gestor”, no menu do CRM, com o mesmo login."}
        </p>
        {crm && (
          <a
            href={crm}
            className="mt-8 inline-block rounded-full bg-indigo px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#f2efe8] transition-opacity hover:opacity-90"
          >
            Ir para o CRM
          </a>
        )}
      </div>
    </main>
  );
}
