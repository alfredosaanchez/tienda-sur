"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount = (product.discount_percent ?? 0) > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - (product.discount_percent ?? 0) / 100)
    : product.price;

  const stock = product.stock ?? null;
  const isOutOfStock = stock !== null && stock <= 0;
  const quantityInCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
  const reachedMax = stock !== null && quantityInCart >= stock;

  const handleAdd = () => {
    if (isOutOfStock || reachedMax) return;
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image_url: product.image_url,
      stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  let buttonLabel = added ? "Agregado ✓" : "Agregar al carrito";
  if (isOutOfStock) buttonLabel = "Agotado";
  else if (reachedMax) buttonLabel = "Máximo disponible";

  return (
    <div className="snap-card shrink-0 w-64 md:w-72 bg-surface rounded-xl2 shadow-neu p-4 flex flex-col">
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-bg shadow-neu-inset">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="288px"
            className={`object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
            Sin imagen
          </div>
        )}
        {hasDiscount && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-bg text-xs px-2.5 py-1 rounded-full">
            -{product.discount_percent}%
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full">
            Agotado
          </span>
        )}
      </div>

      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        {product.categories?.name && (
          <p className="text-xs text-ink-soft uppercase tracking-wide mt-1">
            {product.categories.name}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium">${finalPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-ink-soft line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {!isOutOfStock && stock !== null && stock <= 5 && (
          <p className="text-xs text-accent mt-1">
            ¡Quedan {stock} disponible{stock === 1 ? "" : "s"}!
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={isOutOfStock || reachedMax}
          className={`mt-4 text-center py-2.5 rounded-full text-sm shadow-neu-sm transition-colors ${
            isOutOfStock || reachedMax
              ? "bg-bg text-ink-soft shadow-neu-inset cursor-not-allowed"
              : added
              ? "bg-accent text-bg"
              : "bg-ink text-bg hover:opacity-90"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
