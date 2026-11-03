"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { evento, guardarOrigem, linkComRef, pageView } from "@/lib/rastreio";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta Pixel + origem da campanha, em todas as páginas.
 * - guarda as UTMs da visita (ver lib/rastreio);
 * - PageView a cada troca de página;
 * - em qualquer link do WhatsApp, acrescenta "(ref: campanha)" na mensagem e envia o evento Contact.
 *   Na Black Friday o clique é segurado pelo formulário (defaultPrevented), que faz isso por conta própria.
 */
export function Rastreio() {
  const pathname = usePathname();
  const primeira = useRef(true);

  useEffect(() => {
    guardarOrigem();
    if (primeira.current) {
      primeira.current = false; // o PageView da primeira página vai no script abaixo
      return;
    }
    pageView();
  }, [pathname]);

  useEffect(() => {
    // fase de bolha: roda depois do formulário da Black Friday (fase de captura) e antes do navegador abrir o link
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (!a || e.defaultPrevented) return;
      a.href = linkComRef(a.href);
      evento("Contact", { content_name: a.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!PIXEL_ID) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
