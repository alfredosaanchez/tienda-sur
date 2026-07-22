-- ============================================================
-- ACTUALIZACIÓN: sistema de inventario (stock)
-- Copia y pega TODO este archivo en Supabase -> SQL Editor -> Run
-- ============================================================

alter table products add column if not exists stock integer;

-- Nota: si dejas el stock vacío (NULL) en un producto, se considera
-- "sin control de inventario" y siempre se puede agregar al carrito.
-- Si le pones un número, se descuenta manualmente y en 0 se muestra "Agotado".
