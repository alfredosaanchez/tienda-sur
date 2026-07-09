import Image from "next/image";
import type { SiteContent } from "@/types";

export default function Hero({ siteContent }: { siteContent: SiteContent | null }) {
  const imageUrl = siteContent?.hero_image_url;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">
          Nueva colección
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-2">
          Ropa que
        </h1>
        <h1 className="font-display italic text-5xl md:text-6xl leading-[1.05] text-accent mb-6">
          se siente bien.
        </h1>
        <p className="text-ink-soft max-w-sm mb-8 leading-relaxed">
          Camisas, monos, pantalones y shorts pensados para durar. Materiales
          nobles, cortes simples, sin ruido.
        </p>
        <a
          href="#catalogo"
          className="inline-block px-7 py-3.5 rounded-full bg-ink text-bg shadow-neu hover:-translate-y-0.5 transition-transform"
        >
          Explorar productos
        </a>
      </div>

      <div className="relative aspect-square rounded-xl2 bg-surface shadow-neu flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Foto de campaña"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            priority
          />
        ) : (
          <>
            <div className="absolute w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
            <span className="font-display italic text-2xl text-ink-soft relative z-10 text-center px-6">
              tu foto de campaña aquí
            </span>
          </>
        )}
      </div>
    </section>
  );
}
