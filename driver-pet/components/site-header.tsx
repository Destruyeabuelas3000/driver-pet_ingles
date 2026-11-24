'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ClipboardCheck, Menu, Search, User, X } from 'lucide-react'
import { cn, publicAsset } from '@/lib/utils'

/* NOTA EDITABLE: enlaces del menú principal */
const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/paseadores', label: 'Nuestros Paseadores' },
  { href: '/rutas', label: 'Rutas' },
  { href: '/resenas', label: 'Reseñas' },
  { href: '#contacto', label: 'Contacto' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/paseadores${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-secondary/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Driver Pet, inicio">
          <Image src={publicAsset('/images/logo-icon.png')} alt="" width={56} height={35} className="h-9 w-auto" priority />
          <span className="text-lg font-bold leading-none tracking-tight text-primary">
            DRIVER
            <span className="block text-[#1d2f4a]">PET</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="mx-auto hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'border-b-2 pb-1 transition-colors hover:text-primary',
                      active ? 'border-primary text-primary' : 'border-transparent text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <form onSubmit={onSearch} role="search" className="ml-auto hidden lg:block md:ml-0">
          <label htmlFor="header-search" className="sr-only">
            Buscar paseador
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="header-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              className="h-9 w-56 rounded-full border border-border bg-card pr-4 pl-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>

        <div className="relative ml-auto md:ml-0">
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            aria-expanded={userOpen}
            aria-haspopup="menu"
            className="flex size-10 items-center justify-center rounded-full border-2 border-primary bg-card text-primary transition-colors hover:bg-accent"
          >
            <User className="size-5" aria-hidden />
            <span className="sr-only">Menú de usuario</span>
          </button>
          {userOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-card p-1 shadow-lg"
            >
              <Link
                role="menuitem"
                href="/mi-perfil"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
              >
                <User className="size-4 text-primary" aria-hidden />
                Mi perfil (dueño)
              </Link>
              <Link
                role="menuitem"
                href="/perfil-paseador"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
              >
                <ClipboardCheck className="size-4 text-primary" aria-hidden />
                Cambiar a perfil de paseador
              </Link>
              <Link
                role="menuitem"
                href="/reportar"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
              >
                <ClipboardCheck className="size-4 text-primary" aria-hidden />
                Finalizar y reportar paseo
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          <span className="sr-only">Abrir menú</span>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Móvil" className="border-t bg-secondary md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm font-medium hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
