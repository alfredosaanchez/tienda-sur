export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <span className="font-display italic text-2xl tracking-tight">SUR</span>

        <ul className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
          <li><a href="#catalogo" className="hover:text-ink transition-colors">Catálogo</a></li>
          <li><a href="#nosotros" className="hover:text-ink transition-colors">Nosotros</a></li>
          <li><a href="#contacto" className="hover:text-ink transition-colors">Contacto</a></li>
        </ul>

        <a
          href="#catalogo"
          className="text-sm px-5 py-2.5 rounded-full bg-ink text-bg shadow-neu-sm hover:opacity-90 transition-opacity"
        >
          Ver colección
        </a>
      </nav>
    </header>
  );
}
