import Image from "next/image";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = (product.discount_percent ?? 0) > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - (product.discount_percent ?? 0) / 100)
    : product.price;

  return (
    <div className="snap-card shrink-0 w-64 md:w-72 bg-surface rounded-xl2 shadow-neu p-4 flex flex-col">
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-bg shadow-neu-inset">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="288px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
            Sin imagen
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-ink text-bg text-xs px-2.5 py-1 rounded-full">
            -{product.discount_percent}%
          </span>
        )}
      </div>

      <div className="mt-4">
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
      </div>
    </div>
  );
}
