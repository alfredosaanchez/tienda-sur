"use client";

import { useRef, useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/types";

export default function CatalogSwiper({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [products, activeCategory]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 20
      : 300;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section id="catalogo" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-2">
            Catálogo
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            Desliza para ver los modelos
          </h2>
        </div>

        {/* Filtro de categorías */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === "all"
                ? "bg-ink text-bg shadow-neu-sm"
                : "bg-surface text-ink-soft shadow-neu-sm"
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-ink text-bg shadow-neu-sm"
                  : "bg-surface text-ink-soft shadow-neu-sm"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Flechas de navegación — visibles solo en pantallas grandes (PC) */}
        <button
          onClick={() => scrollByCard("left")}
          aria-label="Anterior"
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-surface shadow-neu hover:shadow-neu-sm"
        >
          ←
        </button>
        <button
          onClick={() => scrollByCard("right")}
          aria-label="Siguiente"
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-surface shadow-neu hover:shadow-neu-sm"
        >
          →
        </button>

        {/* Carril de tarjetas: swipe táctil en móvil, scroll con flechas en PC */}
        <div
          ref={scrollerRef}
          className="no-scrollbar snap-x-mandatory flex gap-5 overflow-x-auto pb-4 scroll-px-6"
        >
          {filtered.length === 0 && (
            <p className="text-ink-soft py-10">
              Todavía no hay productos en esta categoría.
            </p>
          )}
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
