import { useEffect, useState } from 'react'

const leftLinks = [
  { label: 'Vini', href: '#vini' },
  { label: 'Storia', href: '#anni' },
  { label: 'A tavola', href: '#abbinamenti' },
  { label: 'Esperienze', href: '#esperienze' },
  { label: 'Visita', href: '#visita' },
]

const mobileLinks = [
  ...leftLinks,
  { label: 'Visione', href: '#visione' },
  { label: 'Degustazione', href: '#degustazione' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = window.__lenis
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-ink ${
        open ? 'bg-paper' : 'border-b border-ink/15 bg-paper'
      } ${!open && scrolled ? 'shadow-[0_1px_0_rgba(26,31,36,0.06)]' : ''} transition-[box-shadow,background-color] duration-300`}
    >
      <div className="relative z-[60] grid h-[3.75rem] w-full grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[4.25rem] md:px-8 lg:px-10 xl:px-14">
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Sezioni">
          {leftLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink transition-opacity hover:opacity-55"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="relative z-[70] flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 block h-px w-full bg-ink transition duration-300 ${
                open ? 'translate-y-[5.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[5.5px] block h-px w-full bg-ink transition duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[11px] block h-px w-full bg-ink transition duration-300 ${
                open ? '-translate-y-[5.5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>

        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="relative z-[70] justify-self-center font-body text-[1.05rem] font-semibold tracking-[0.06em] uppercase sm:text-[1.15rem] md:text-[1.35rem]"
        >
          Grosjean
          <span className="align-super text-[0.45em] tracking-normal">®</span>
        </a>

        <div className="relative z-[70] flex items-center justify-end gap-3 sm:gap-4 md:gap-5">
          <a
            href="mailto:info@grosjeanvins.it"
            className="hidden text-ink transition-opacity hover:opacity-55 sm:inline-flex"
            aria-label="Contatti"
          >
            <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.25" />
              <path
                d="M5.5 19.25c1.4-3.1 3.7-4.5 6.5-4.5s5.1 1.4 6.5 4.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <a
            href="#abbinamenti"
            onClick={() => setOpen(false)}
            className="text-ink transition-opacity hover:opacity-55"
            aria-label="Cerca abbinamenti"
          >
            <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.25" />
              <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="https://grosjeanvins.it/negozio/"
            target="_blank"
            rel="noreferrer"
            className="text-ink transition-opacity hover:opacity-55"
            aria-label="Negozio"
          >
            <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" aria-hidden>
              <path
                d="M6.5 8.5h11l-.8 10.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3L6.5 8.5z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      <div
        className={`fixed inset-0 z-[55] lg:hidden ${
          open ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-paper transition-opacity duration-500 ease-out ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <nav
          className={`relative flex h-full flex-col justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[5.5rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          aria-label="Menu mobile"
        >
          <ul className="flex flex-col">
            {mobileLinks.map((l, i) => (
              <li
                key={l.href}
                className={`border-b border-line transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-5 font-body text-[clamp(1.35rem,6vw,1.75rem)] font-semibold tracking-[0.04em] uppercase"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`flex flex-col gap-4 transition-all duration-500 ease-out ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? `${120 + mobileLinks.length * 55}ms` : '0ms' }}
          >
            <a
              href="mailto:info@grosjeanvins.it"
              onClick={() => setOpen(false)}
              className="font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2"
            >
              info@grosjeanvins.it
            </a>
            <a
              href="tel:+390165775791"
              className="font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2"
            >
              +39 0165 77 57 91
            </a>
            <p className="mt-2 font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2">
              Grands vins de montagne
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
