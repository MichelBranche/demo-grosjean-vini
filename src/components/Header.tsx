import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { catalogCategories, catalogWines } from '../data/catalog'
import { useI18n } from '../i18n/I18nProvider'
import { useCart } from '../cart/CartProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

const POPULAR_SLUGS = [
  'rouge-des-cimes',
  'noir-d-altitude',
  'arvine-blanche-cru',
  'chardonnay-altitude',
  'pinot-noir-classique',
  'mont-blanc-rose-extra-brut',
]

const SEARCH_CAT_SLUGS = ['rossi', 'bianchi', 'rosati', 'bollicine', 'classici', 'selezioni']

export function Header() {
  const { t, locale } = useI18n()
  const { count, bump, setOpen: setCartOpen } = useCart()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [demoTip, setDemoTip] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [previewId, setPreviewId] = useState<number | null>(null)
  const [cartBump, setCartBump] = useState(false)
  const cartBumpTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const demoTipRef = useRef<HTMLDivElement>(null)
  const demoTipTimer = useRef<number | null>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const floatRaf = useRef(0)
  const floatTarget = useRef({ x: 0, y: 0 })
  const floatCurrent = useRef({ x: 0, y: 0 })
  const previewActive = useRef(false)
  const floatReady = useRef(false)

  const leftLinks = useMemo(
    () => [
      { label: t('nav.vini'), href: '/#vini' },
      { label: t('nav.storia'), href: '/#anni' },
      { label: t('nav.aTavola'), href: '/#abbinamenti' },
      { label: t('nav.esperienze'), href: '/#esperienze' },
      { label: t('nav.visita'), href: '/#visita' },
    ],
    [t, locale],
  )

  const mobileLinks = useMemo(
    () => [
      ...leftLinks,
      { label: t('nav.visione'), href: '/#visione' },
      { label: t('nav.degustazione'), href: '/#degustazione' },
      { label: t('nav.catalogo'), href: '/catalogo' },
    ],
    [leftLinks, t, locale],
  )

  const searchCategories = useMemo(
    () =>
      catalogCategories
        .filter((c) => SEARCH_CAT_SLUGS.includes(c.slug))
        .map((c) => ({ slug: c.slug, name: t(`cat.${c.slug}`) })),
    [t, locale],
  )

  const popular = useMemo(
    () =>
      POPULAR_SLUGS.map((slug) => catalogWines.find((w) => w.slug === slug)).filter(
        (w): w is (typeof catalogWines)[number] => Boolean(w),
      ),
    [],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const catMatch = searchCategories.find(
      (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q),
    )

    const colorHints = [
      { words: ['bianco', 'bianchi', 'white', 'whites', 'blanc', 'weiß', 'weiss'], slug: 'bianchi' },
      { words: ['rosso', 'rossi', 'red', 'reds', 'rouge', 'rot'], slug: 'rossi' },
      { words: ['rosato', 'rosati', 'rosé', 'rose', 'roséweine'], slug: 'rosati' },
      { words: ['bollicin', 'sparkling', 'bulles', 'schaum'], slug: 'bollicine' },
    ]
    const hinted = colorHints.find((h) => h.words.some((w) => q.includes(w)))?.slug

    return catalogWines
      .filter((w) => {
        const hay = `${w.name} ${w.categories.join(' ')}`.toLowerCase()
        if (hay.includes(q)) return true
        if (catMatch && w.categories.includes(catMatch.slug)) return true
        if (hinted && w.categories.includes(hinted)) return true
        return false
      })
      .slice(0, 8)
  }, [query, searchCategories])

  const listed = query.trim() ? results : popular
  const previewWine = previewId == null ? null : listed.find((w) => w.id === previewId) ?? null

  const FLOAT_OFFSET_X = 36
  const FLOAT_OFFSET_Y = -92
  const FLOAT_LERP_X = 0.045
  const FLOAT_LERP_Y = 0.035

  const stopFloatLoop = () => {
    if (floatRaf.current) {
      window.cancelAnimationFrame(floatRaf.current)
      floatRaf.current = 0
    }
  }

  const startFloatLoop = () => {
    if (floatRaf.current) return
    const tick = () => {
      const el = floatRef.current
      if (!el || !previewActive.current) {
        floatRaf.current = 0
        return
      }
      const cur = floatCurrent.current
      const tgt = floatTarget.current
      cur.x += (tgt.x - cur.x) * FLOAT_LERP_X
      cur.y += (tgt.y - cur.y) * FLOAT_LERP_Y
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      floatRaf.current = window.requestAnimationFrame(tick)
    }
    floatRaf.current = window.requestAnimationFrame(tick)
  }

  const aimFloat = (clientX: number, clientY: number, fromRest = false) => {
    const next = { x: clientX + FLOAT_OFFSET_X, y: clientY + FLOAT_OFFSET_Y }
    floatTarget.current = next
    if (fromRest || !floatReady.current) {
      // Parte un po’ indietro/sotto, così deve “inseguire” il cursore
      floatCurrent.current = {
        x: next.x - 48,
        y: next.y + 64,
      }
      floatReady.current = true
      const el = floatRef.current
      if (el) {
        el.style.transform = `translate3d(${floatCurrent.current.x}px, ${floatCurrent.current.y}px, 0)`
      }
    }
    startFloatLoop()
  }

  useEffect(() => {
    if (!searchOpen) {
      previewActive.current = false
      floatReady.current = false
      stopFloatLoop()
      setPreviewId(null)
    }
  }, [searchOpen])

  useEffect(() => () => stopFloatLoop(), [])

  useLayoutEffect(() => {
    if (!previewWine) return
    const el = floatRef.current
    if (!el) return
    const { x, y } = floatCurrent.current
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    startFloatLoop()
  }, [previewWine])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (bump === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setCartBump(false)
    // Restart CSS animation even on consecutive adds
    window.requestAnimationFrame(() => {
      setCartBump(true)
      if (cartBumpTimer.current) window.clearTimeout(cartBumpTimer.current)
      cartBumpTimer.current = window.setTimeout(() => setCartBump(false), 650)
    })
    return () => {
      if (cartBumpTimer.current) window.clearTimeout(cartBumpTimer.current)
    }
  }, [bump])

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
    setDemoTip(false)
    setQuery('')
  }, [location.pathname])

  const showDemoTip = () => {
    setSearchOpen(false)
    setDemoTip(true)
    if (demoTipTimer.current) window.clearTimeout(demoTipTimer.current)
    demoTipTimer.current = window.setTimeout(() => setDemoTip(false), 2800)
  }

  useEffect(() => {
    if (!demoTip) return
    const onPointer = (e: MouseEvent) => {
      if (demoTipRef.current?.contains(e.target as Node)) return
      if ((e.target as HTMLElement).closest?.('[data-demo-tip-toggle]')) return
      setDemoTip(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDemoTip(false)
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [demoTip])

  useEffect(() => {
    return () => {
      if (demoTipTimer.current) window.clearTimeout(demoTipTimer.current)
    }
  }, [])

  useEffect(() => {
    const lenis = window.__lenis
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
      mobileMenuRef.current?.scrollTo({ top: 0 })
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open])

  useEffect(() => {
    if (!searchOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuery('')
      }
    }
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if ((e.target as HTMLElement).closest?.('[data-search-toggle]')) return
      setSearchOpen(false)
      setQuery('')
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onPointer)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onPointer)
    }
  }, [searchOpen])

  const goCategory = (slug: string) => {
    setSearchOpen(false)
    setQuery('')
    setOpen(false)
    navigate(`/catalogo?c=${slug}`)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-ink ${
        open || searchOpen ? 'bg-paper' : 'border-b border-ink/15 bg-paper'
      } ${!open && !searchOpen && scrolled ? 'shadow-[0_1px_0_rgba(26,31,36,0.06)]' : ''} transition-[box-shadow,background-color] duration-300`}
    >
      <div className="relative z-[60] flex h-[4.25rem] w-full items-center justify-between px-4 md:h-[4.75rem] md:px-8 lg:px-10 xl:px-14">
        <nav className="relative z-[70] hidden items-center gap-7 lg:flex xl:gap-9" aria-label={t('nav.ariaSections')}>
          {leftLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="nav-link font-body text-[0.88rem] tracking-[0.12em] uppercase text-ink xl:text-[0.92rem]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="nav-burger relative z-[70] flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={open ? t('menu.close') : t('menu.open')}
          aria-expanded={open}
          onClick={() => {
            setSearchOpen(false)
            setOpen((v) => !v)
          }}
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

        <Link
          to="/"
          onClick={() => {
            setOpen(false)
            setSearchOpen(false)
          }}
          className="nav-brand absolute left-1/2 top-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 font-body text-[1.25rem] font-semibold tracking-[0.05em] uppercase sm:text-[1.4rem] md:text-[1.6rem]"
        >
          Altura
          <span className="relative -top-[0.55em] ml-[0.02em] inline-block text-[0.38em] leading-none tracking-normal">
            ®
          </span>
        </Link>

        <div className="relative z-[70] flex items-center justify-end gap-1 sm:gap-2 md:gap-2.5">
          <LanguageSwitcher className="hidden sm:flex" />

          <button
            type="button"
            data-search-toggle
            onClick={() => {
              setOpen(false)
              setSearchOpen((v) => !v)
              if (searchOpen) setQuery('')
            }}
            className={`nav-icon text-ink ${searchOpen ? 'is-open' : ''}`}
            aria-label={searchOpen ? t('search.close') : t('search.open')}
            aria-expanded={searchOpen}
          >
            {searchOpen ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <div className="relative hidden sm:flex sm:items-center" ref={demoTipRef}>
            <button
              type="button"
              data-demo-tip-toggle
              onClick={showDemoTip}
              className="nav-icon text-ink"
              aria-label={t('contacts.aria')}
              aria-expanded={demoTip}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M5.5 19.25c1.4-3.1 3.7-4.5 6.5-4.5s5.1 1.4 6.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div
              role="status"
              className={`absolute right-0 top-[calc(100%+0.75rem)] z-[80] w-max max-w-[16rem] origin-top-right border border-ink/15 bg-paper px-4 py-3 shadow-[0_12px_40px_rgba(26,31,36,0.12)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                demoTip
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
              }`}
              aria-hidden={!demoTip}
            >
              <span
                className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t border-ink/15 bg-paper"
                aria-hidden
              />
              <p className="relative font-body text-[0.82rem] leading-snug tracking-wide text-ink">
                {t('demo.disabled')}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`nav-icon relative text-ink${cartBump ? ' cart-icon-bump' : ''}`}
            aria-label={t('cart.aria')}
            onClick={() => {
              setSearchOpen(false)
              setOpen(false)
              setCartOpen(true)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4.5 6.5h15l-1.2 11.2a1.8 1.8 0 0 1-1.8 1.6H7.5a1.8 1.8 0 0 1-1.8-1.6L4.5 6.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 6.5V5.2a3.5 3.5 0 0 1 7 0v1.3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {count > 0 && (
              <span
                key={bump}
                className={`absolute -right-2 -top-2 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-wine px-1 font-body text-[0.62rem] font-semibold leading-none text-paper${cartBump ? ' cart-badge-bump' : ''}`}
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        className={`absolute inset-x-0 top-full z-[65] overflow-hidden border-b border-ink/15 bg-paper transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          searchOpen ? 'max-h-[min(70vh,32rem)] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
        aria-hidden={!searchOpen}
      >
        <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-2 md:px-8 lg:px-10 xl:px-14">
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full bg-transparent py-4 font-body text-[1.05rem] text-ink outline-none placeholder:text-ink/35 md:text-[1.25rem]"
              aria-label={t('search.aria')}
            />
            <div
              className={`h-px origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                searchOpen ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {searchCategories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => goCategory(c.slug)}
                className="nav-link font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2 hover:text-ink"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink/45">
              {query.trim() ? t('search.results') : t('search.popular')}
            </p>
            <ul
              className="mt-4 divide-y divide-line"
              onMouseLeave={() => {
                previewActive.current = false
                floatReady.current = false
                stopFloatLoop()
                setPreviewId(null)
              }}
              onMouseMove={(e) => {
                if (!previewActive.current) return
                aimFloat(e.clientX, e.clientY)
              }}
            >
              {listed.map((w) => (
                <li
                  key={w.id}
                  onMouseEnter={(e) => {
                    const first = !previewActive.current
                    previewActive.current = true
                    setPreviewId(w.id)
                    aimFloat(e.clientX, e.clientY, first)
                  }}
                >
                  <Link
                    to={`/catalogo/${w.slug}`}
                    className="flex items-baseline justify-between gap-4 py-3.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:opacity-70 active:scale-[0.99]"
                    onClick={() => {
                      previewActive.current = false
                      floatReady.current = false
                      stopFloatLoop()
                      setSearchOpen(false)
                      setQuery('')
                      setPreviewId(null)
                    }}
                  >
                    <span className="font-body text-[0.95rem] font-semibold tracking-tight md:text-[1.05rem]">
                      {w.name}
                    </span>
                    <span className="shrink-0 font-body text-[0.78rem] text-ink-2">{w.price}</span>
                  </Link>
                </li>
              ))}
              {query.trim() && results.length === 0 && (
                <li className="py-6 font-body text-[0.95rem] text-ink-2">
                  {t('search.noResults')}{' '}
                  <Link
                    to="/catalogo"
                    className="underline underline-offset-2"
                    onClick={() => {
                      setSearchOpen(false)
                      setQuery('')
                    }}
                  >
                    {t('search.noResultsLink')}
                  </Link>
                  .
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {previewWine?.img ? (
        <div
          ref={floatRef}
          className="pointer-events-none fixed left-0 top-0 z-[90] hidden will-change-transform md:block"
          style={{ transform: 'translate3d(-9999px,-9999px,0)' }}
          aria-hidden
        >
          <div
            key={previewWine.id}
            className="search-preview-pop h-[11.5rem] w-[4.5rem] lg:h-[13.5rem] lg:w-[5.25rem]"
          >
            <img
              src={previewWine.img}
              alt=""
              className="bottle-shadow search-preview-bob h-full w-full object-contain"
            />
          </div>
        </div>
      ) : null}

      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-[55] overflow-y-auto overscroll-y-contain bg-paper [-webkit-overflow-scrolling:touch] lg:hidden ${
          open ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!open}
      >
        <nav
          className={`flex min-h-full flex-col justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[6.25rem] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          aria-label={t('nav.ariaMobile')}
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
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="nav-mobile-link block py-4 font-body text-[clamp(1.35rem,6vw,1.95rem)] font-semibold tracking-[0.04em] uppercase sm:py-5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mt-10 flex flex-col gap-5 pb-2 transition-all duration-500 ease-out ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? `${120 + mobileLinks.length * 55}ms` : '0ms' }}
          >
            <LanguageSwitcher />
            <a
              href="mailto:hello@maisonaltura.demo"
              onClick={() => setOpen(false)}
              className="font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2"
            >
              hello@maisonaltura.demo
            </a>
            <a
              href="tel:+390000000000"
              className="font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2"
            >
              +39 000 000 0000
            </a>
            <p className="mt-2 font-body text-[0.78rem] tracking-[0.14em] uppercase text-ink-2">
              {t('footer.tagline')}
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
