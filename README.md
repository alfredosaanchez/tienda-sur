# ALSE — Tienda de ropa (catálogo + panel admin)

Proyecto listo para usar: página principal con catálogo deslizable (swipe) y
panel administrativo privado para agregar/editar/eliminar categorías y productos.

**Stack:** Next.js + Tailwind CSS (frontend, gratis y rápido) + Supabase (base de
datos + login + almacenamiento de imágenes, gratis) + Vercel (hosting, gratis).

---

## 0. Lo que necesitas instalar en tu PC (una sola vez)

1. **Node.js** (versión 18 o superior): descárgalo en https://nodejs.org (elige la versión "LTS").
   Para comprobar que quedó instalado, abre una terminal y escribe:
   ```
   node -v
   ```
2. **Git**: descárgalo en https://git-scm.com/downloads
3. Una cuenta gratis en **GitHub**: https://github.com
4. Una cuenta gratis en **Supabase**: https://supabase.com
5. Una cuenta gratis en **Vercel**: https://vercel.com (puedes entrar directo con tu cuenta de GitHub)

---

## 1. Crear el proyecto en Supabase (tu base de datos)

1. Entra a https://supabase.com/dashboard y crea un **New Project**.
   - Ponle un nombre, por ejemplo `sur-tienda`.
   - Crea una contraseña para la base de datos y **guárdala en un lugar seguro**.
   - Elige la región más cercana a ti.
2. Espera 1-2 minutos a que el proyecto termine de crearse.
3. En el menú izquierdo entra a **SQL Editor** → **New query**.
4. Abre el archivo `supabase/schema.sql` de este proyecto, copia TODO su contenido,
   pégalo en el editor de Supabase y dale click a **Run**.
   - Esto crea las tablas `categories` y `products`, las reglas de seguridad,
     y 4 categorías iniciales (Camisas, Monos, Pantalones, Shorts).
5. Ve a **Storage** (menú izquierdo) → **New bucket**.
   - Nombre del bucket: `products`
   - Actívalo como **Public bucket** (para que las imágenes se vean en la web).
   - Click en **Create bucket**.
6. Crea tu usuario administrador: ve a **Authentication** → **Users** → **Add user** → **Create new user**.
   - Escribe tu correo y una contraseña. Marca la opción de "Auto Confirm User" si aparece.
   - Con ese correo y contraseña vas a entrar al panel admin de la web.
7. Copia tus llaves: ve a **Settings** (ícono de engranaje) → **API**.
   - Copia el valor de **Project URL**.
   - Copia el valor de **anon public key**.
   - Los vas a necesitar en el siguiente paso.

---

## 2. Configurar el proyecto en tu computadora

1. Descomprime el ZIP de este proyecto en una carpeta.
2. Dentro de la carpeta, copia el archivo `.env.local.example` y renombra la copia a `.env.local`.
3. Abre `.env.local` con cualquier editor de texto y pega los valores que copiaste de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
4. Abre una terminal DENTRO de la carpeta del proyecto e instala las dependencias:
   ```
   npm install
   ```
5. Levanta el proyecto en tu PC:
   ```
   npm run dev
   ```
6. Abre tu navegador en **http://localhost:3000** — deberías ver la página principal.
7. Para entrar al panel admin ve a **http://localhost:3000/admin/login** y usa el
   correo/contraseña que creaste en el paso 1.6.

---

## 3. Subir el proyecto a GitHub

1. En la terminal, dentro de la carpeta del proyecto:
   ```
   git init
   git add .
   git commit -m "Primer commit: tienda ALSE"
   ```
2. Crea un repositorio nuevo (vacío, sin README) en https://github.com/new
3. GitHub te va a mostrar unos comandos parecidos a estos — cópialos y pégalos en tu terminal:
   ```
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git branch -M main
   git push -u origin main
   ```

   > **Importante:** el archivo `.env.local` (donde están tus llaves secretas) NUNCA
   > se sube a GitHub porque está listado en `.gitignore`. Eso es correcto y seguro.

---

## 4. Publicar la web gratis (Vercel)

1. Entra a https://vercel.com y da click en **Add New → Project**.
2. Conecta tu cuenta de GitHub y selecciona el repositorio que acabas de crear.
3. Antes de darle "Deploy", abre la sección **Environment Variables** y agrega las
   mismas dos variables de tu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click en **Deploy**. En 1-2 minutos tu web va a estar publicada con una URL
   como `tu-proyecto.vercel.app`.
5. Cada vez que hagas `git push` a la rama `main`, Vercel actualiza la web
   automáticamente.

---

## 5. Cómo administrar tu tienda día a día

1. Entra a `tu-web.vercel.app/admin/login` con tu correo y contraseña.
2. En **Categorías** puedes agregar nuevas (ej: "Chaquetas") o eliminar las que no uses.
3. En **Productos** puedes:
   - Crear un producto nuevo: nombre, descripción, precio, % de descuento, categoría e imagen.
   - Editar cualquier producto dando click en "Editar".
   - Eliminarlo dando click en "Eliminar".
4. Los cambios aparecen automáticamente en la página principal, sin que tengas que
   tocar código.

---

## 6. Personalizar el diseño

- **Nombre de marca:** aparece como "ALSE" en `components/Navbar.tsx`,
  `app/admin/login/page.tsx` y `app/layout.tsx`. Búscalo y reemplázalo.
- **Colores:** editables en `tailwind.config.js`, dentro de `theme.extend.colors`.
- **Texto del Hero (portada):** editable en `components/Hero.tsx`.
- **Imagen principal del Hero:** por ahora hay un espacio de ejemplo. Puedes poner
  tu propia imagen agregándola en la carpeta `public/images` y usando el
  componente `<Image>` de Next.js en `components/Hero.tsx`.

---

## Actualización: foto de portada, botón Comprar, Nosotros y Contacto

Si ya tenías el proyecto funcionando y acabas de actualizar los archivos, hazlo en este orden:

1. Ve a Supabase → **SQL Editor** → pega y ejecuta el contenido de
   `supabase/update_site_content.sql` (crea la tabla `site_content`).
2. Copia tu archivo `.env.local` a la carpeta nueva del proyecto (no viene incluido
   por seguridad).
3. Corre `npm install` de nuevo (por si acaso) y luego `npm run dev` para probar.
4. Entra al panel admin: ahora vas a ver un bloque nuevo llamado **"Contenido del
   sitio"** arriba de Categorías, donde puedes:
   - Subir la foto principal de la portada (reemplaza el texto "tu foto de
     campaña aquí").
   - Editar el título y el texto de la sección **Nosotros**.
   - Editar el correo, teléfono/WhatsApp y dirección de **Contacto**.
5. El botón **"Comprar"** de cada producto abre WhatsApp con un mensaje
   pre-armado, usando el teléfono que configures en "Contenido del sitio". Si no
   pones teléfono pero sí correo, abre un correo en su lugar.

---

## Actualización: carrito de compras

Ya no hace falta ejecutar nada nuevo en Supabase — el carrito se guarda en el
propio navegador del cliente (no en la base de datos). Solo necesitas
reemplazar archivos de código:

1. Copia tu `.env.local` a la carpeta nueva del proyecto (no viene en el ZIP).
2. Reemplaza/agrega estos archivos:
   - `contexts/CartContext.tsx` (nuevo)
   - `components/CartWidget.tsx` (nuevo)
   - `components/ProductCard.tsx`
   - `components/CatalogSwiper.tsx`
   - `app/layout.tsx`
   - `app/page.tsx`
3. `npm install`, `npm run dev` para probar, y luego `git add . / git commit / git push` para publicar.

Cómo funciona:
- Cada producto ahora tiene un botón **"Agregar al carrito"** en vez de comprar directo.
- Un botón flotante 🛍️ abajo a la derecha muestra cuántos productos hay en el carrito.
- Al abrirlo, el cliente puede ajustar cantidades o quitar productos.
- El botón **"Finalizar pedido"** arma un solo mensaje de WhatsApp (o correo, si no
  configuraste teléfono) con todo el pedido y el total — usando el mismo
  teléfono/correo que configuras en "Contenido del sitio" en el panel admin.
- El carrito se guarda en el navegador de cada cliente (no se pierde si recarga
  la página, pero es distinto en cada dispositivo/navegador).

---

## Estructura de carpetas

```
tienda-ropa/
├─ app/
│  ├─ page.tsx                  → Página principal (catálogo)
│  ├─ layout.tsx                → Layout general + fuentes
│  ├─ globals.css               → Estilos globales
│  └─ admin/
│     ├─ login/page.tsx         → Login del admin
│     └─ dashboard/page.tsx     → Panel admin (CRUD)
├─ components/
│  ├─ Navbar.tsx
│  ├─ Hero.tsx
│  ├─ CatalogSwiper.tsx         → Catálogo con swipe / flechas
│  ├─ ProductCard.tsx
│  └─ admin/
│     ├─ CategoryManager.tsx
│     ├─ ProductManager.tsx
│     └─ LogoutButton.tsx
├─ lib/
│  ├─ supabaseClient.ts         → Cliente Supabase (navegador)
│  └─ supabaseServer.ts         → Cliente Supabase (servidor)
├─ middleware.ts                → Protege /admin/dashboard
├─ types/index.ts                → Tipos de Categoría y Producto
├─ supabase/schema.sql           → Esquema de base de datos
├─ tailwind.config.js
└─ .env.local.example
```

## ¿Por qué este stack?

- **Next.js**: genera páginas ya renderizadas en el servidor, lo que hace que
  carguen muy rápido en celulares con internet lento — ideal para catálogos con
  muchas imágenes.
- **Tailwind CSS**: no carga ninguna librería de componentes pesada; solo
  genera el CSS exacto que usas, así el sitio pesa muy poco.
- **Supabase**: te da base de datos, login de administrador y almacenamiento
  de imágenes en un solo servicio gratuito, sin tener que programar un backend
  desde cero.
- **CSS Scroll Snap** (en vez de una librería de carrusel pesada) para el
  swipe del catálogo: es nativo del navegador, funciona perfecto en móvil con
  el dedo y no agrega peso extra a la página.

---

## Problemas comunes

- **"No veo mis productos"**: revisa que copiaste bien `NEXT_PUBLIC_SUPABASE_URL`
  y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` (y en Vercel).
- **"No puedo subir imágenes"**: revisa que el bucket `products` en Supabase
  Storage esté marcado como **Public**.
- **"No puedo entrar al panel admin"**: revisa que creaste el usuario en
  Supabase → Authentication → Users, y que tenga el "Auto Confirm" activado.
