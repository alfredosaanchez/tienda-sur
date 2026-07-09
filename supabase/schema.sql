-- ============================================================
-- ESQUEMA DE BASE DE DATOS - TIENDA SUR
-- Copia y pega TODO este archivo en Supabase -> SQL Editor -> Run
-- ============================================================

-- Tabla de categorías (camisas, monos, pantalones, shorts...)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default now()
);

-- Tabla de productos (prendas)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  discount_percent numeric(5,2) default 0,
  category_id uuid references categories(id) on delete set null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Índice para filtrar productos por categoría rápidamente
create index if not exists idx_products_category on products(category_id);

-- ============================================================
-- SEGURIDAD (Row Level Security)
-- La tienda (catálogo) la puede LEER cualquier visitante.
-- Solo un usuario autenticado (el admin) puede crear/editar/borrar.
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;

-- Lectura pública (para que el catálogo cargue sin login)
create policy "Categorias visibles para todos"
  on categories for select
  using (true);

create policy "Productos visibles para todos"
  on products for select
  using (true);

-- Escritura solo para usuarios logueados (el admin)
create policy "Solo admin logueado puede insertar categorias"
  on categories for insert
  to authenticated
  with check (true);

create policy "Solo admin logueado puede editar categorias"
  on categories for update
  to authenticated
  using (true);

create policy "Solo admin logueado puede borrar categorias"
  on categories for delete
  to authenticated
  using (true);

create policy "Solo admin logueado puede insertar productos"
  on products for insert
  to authenticated
  with check (true);

create policy "Solo admin logueado puede editar productos"
  on products for update
  to authenticated
  using (true);

create policy "Solo admin logueado puede borrar productos"
  on products for delete
  to authenticated
  using (true);

-- ============================================================
-- CATEGORÍAS INICIALES (puedes agregar más desde el panel admin)
-- ============================================================
insert into categories (name, slug) values
  ('Camisas', 'camisas'),
  ('Monos', 'monos'),
  ('Pantalones', 'pantalones'),
  ('Shorts', 'shorts')
on conflict (name) do nothing;
