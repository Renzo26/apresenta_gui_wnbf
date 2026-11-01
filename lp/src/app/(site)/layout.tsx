import { SmoothScroll } from "@/components/smooth-scroll";

// LP e linktree usam o scroll suave (Lenis + GSAP); a página da Black fica fora para carregar mais leve.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
