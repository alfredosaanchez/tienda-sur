"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

function buildWhatsAppOrderLink(
  phone: string,
  items: { name: string; price: number; quantity: number }[],
  total: number
) {
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  const lines = items.map(
    (i) => `• ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toFixed(2)}`
  );
  const message = [
    "¡Hola! Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Total: $${total.toFixed(2)}`,
  ].join("\n");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

function buildEmailOrderLink(
  email: string,
  items: { name: string; price: number; quantity: number }[],
  total: number
) {
  const lines = items.map(
    (i) => `${i.quantity}x ${i.name} - $${(i.price * i.quantity).toFixed(2)}`
  );
  const body = [
    "Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Total: $${total.toFixed(2)}`,
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(
    "Nuevo pedido"
  )}&body=${encodeURIComponent(body)}`;
}

export default function CartWidget({
  contactPhone,
  contactEmail,
}: {
  contactPhone?: string | null;
  contactEmail?: string | null;
}) {
  const { items, removeItem, updateQuantity, clearCart, totalCount, totalPrice } =
    useCart();
  const [open, setOpen] = useState(false);

  const checkoutLink = contactPhone
    ? buildWhatsAppOrderLink(contactPhone, items, totalPrice)
    : contactEmail
    ? buildEmailOrderLink(contactEmail, items, totalPrice)
    : null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir carrito"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-ink text-bg shadow-neu flex items-center justify-center hover:-translate-y-0.5 transition-transform"
      >
        <span className="text-xl">🛍️</span>
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-bg text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {totalCount}
          </span>
        )}
      </button>

      {/* Fondo oscuro + panel lateral */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm h-full bg-surface shadow-neu p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">Tu carrito</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar carrito"
                className="w-9 h-9 rounded-full bg-bg shadow-neu-sm flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Todavía no agregaste ningún producto.
              </p>
            ) : (
              <>
                <ul className="flex flex-col gap-4 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-bg shadow-neu-inset shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-ink-soft mb-2">
                          ${item.price.toFixed(2)} c/u
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full bg-bg shadow-neu-sm text-xs"
                          >
                            −
                          </button>
                          <span className="text-sm w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              item.stock !== null &&
                              item.quantity >= item.stock
                            }
                            className="w-6 h-6 rounded-full bg-bg shadow-neu-sm text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-xs text-red-600"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink/10 pt-4 mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-soft">Productos</span>
                    <span>{totalCount}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutLink ? (
                  <a
                    href={checkoutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 rounded-full bg-ink text-bg shadow-neu-sm hover:opacity-90 transition-opacity mb-3"
                  >
                    Finalizar pedido
                  </a>
                ) : (
                  <p className="text-xs text-red-600 mb-3">
                    Configura un teléfono o correo en "Contenido del sitio"
                    (panel admin) para poder recibir pedidos.
                  </p>
                )}

                <button
                  onClick={clearCart}
                  className="w-full text-center py-2 text-xs text-ink-soft hover:text-ink"
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
