-- ============================================================
-- ACTUALIZACIÓN: contenido editable del sitio
-- (foto del hero, texto de "Nosotros", datos de "Contacto")
-- Copia y pega TODO este archivo en Supabase -> SQL Editor -> Run
-- ============================================================

create table if not exists site_content (
  id int primary key default 1,
  hero_image_url text,
  about_title text default 'Nosotros',
  about_text text,
  contact_email text,
  contact_phone text,
  contact_address text,
  updated_at timestamp with time zone default now()
);

alter table site_content enable row level security;

create policy "Contenido visible para todos"
  on site_content for select
  using (true);

create policy "Solo admin logueado puede editar contenido"
  on site_content for update
  to authenticated
  using (true);

-- Crea la única fila de contenido (si no existe todavía)
insert into site_content (id, about_title, about_text, contact_email, contact_phone, contact_address)
values (
  1,
  'Nosotros',
  'Contanos aquí la historia de tu marca: quiénes son, qué los hace distintos y por qué alguien debería comprarte a ti.',
  'contacto@tutienda.com',
  '+52 55 0000 0000',
  'Tu ciudad, país'
)
on conflict (id) do nothing;
