import { Caminhos } from "@/components/sections/caminhos";
import { Duvidas } from "@/components/sections/duvidas";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Marquee } from "@/components/sections/marquee";
import { Metodo } from "@/components/sections/metodo";
import { Resultados } from "@/components/sections/resultados";
import { Sobre } from "@/components/sections/sobre";
import { Statement } from "@/components/sections/statement";
import { StickyCta } from "@/components/sections/sticky-cta";

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <main>
        <Hero />

        <div className="px-2.5 sm:px-4">
          <div className="grain relative overflow-hidden rounded-[2rem] bg-bone sm:rounded-[2.75rem]">
            <Caminhos />
            <Marquee />
            <Statement />
          </div>
        </div>

        <Metodo />
        <Resultados />

        <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
          <div className="grain relative rounded-[2rem] bg-bone sm:rounded-[2.75rem]">
            <Sobre />
            <Duvidas />
          </div>
        </div>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
