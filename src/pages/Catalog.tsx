import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useSearchParams } from 'react-router-dom'
import { catalogCategories, catalogWines } from '../data/catalog'
import { useI18n } from '../i18n/I18nProvider'
import { useCart } from '../cart/CartProvider'

gsap.registerPlugin(ScrollTrigger)

export function Catalog() {
  const { t } = useI18n()
  const { addItem, items } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const paramCat = searchParams.get('c')
  const initial =
    paramCat && catalogCategories.some((c) => c.slug === paramCat) ? paramCat : 'tutti'
  const [active, setActive] = useState<string>(initial)
  const [gate, setGate] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paramCat && catalogCategories.some((c) => c.slug === paramCat)) {
      setActive(paramCat)
    } else if (!paramCat) {
      setActive('tutti')
    }
  }, [paramCat])

  const setFilter = (slug: string) => {
    setActive(slug)
    if (slug === 'tutti') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ c: slug }, { replace: true })
    }
  }

  const wines = useMemo(() => {
    if (active === 'tutti') return catalogWines
    return catalogWines.filter((w) => w.categories.includes(active))
  }, [active])

  useEffect(() => {
    const open = () => setGate(true)
    window.addEventListener('grosjean:page-ready', open)
    const fallback = window.setTimeout(open, 700)
    return () => {
      window.removeEventListener('grosjean:page-ready', open)
      window.clearTimeout(fallback)
    }
  }, [])

  const firstFilter = useRef(true)
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false
      return
    }
    setGate(false)
    const timer = window.setTimeout(() => setGate(true), 40)
    return () => window.clearTimeout(timer)
  }, [active])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !gate) return

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-wine-card]'))
    if (!cards.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(cards, { autoAlpha: 1, scale: 1, y: 0 })
      return
    }

    gsap.set(cards, { autoAlpha: 0, scale: 0.82, y: 28 })

    const batch = ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      onEnter: (els) => {
        gsap.to(els, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          overwrite: true,
        })
      },
    })

    ScrollTrigger.refresh()

    return () => {
      batch.forEach((st) => st.kill())
      gsap.killTweensOf(cards)
    }
  }, [gate, wines])

  const catLabel = (slug: string) => t(`cat.${slug}`)

  return (
    <div className="bg-paper text-ink">
      <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-28 md:px-10 md:pb-14 md:pt-32 lg:px-14">
        <Link
          to="/#vini"
          className="font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2 transition-opacity hover:opacity-55"
        >
          {t('catalog.back')}
        </Link>

        <div className="mt-8 max-w-2xl">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
            {t('catalog.eyebrow')}
          </p>
          <h1 className="mt-4 font-body text-[clamp(2.2rem,7vw,4rem)] font-semibold leading-[0.95] tracking-tight">
            {t('catalog.title')}
          </h1>
          <p className="mt-5 font-body text-[0.98rem] leading-relaxed text-ink-2 md:text-[1.05rem]">
            {t('catalog.intro')}
          </p>
        </div>

        <div className="mt-10 space-y-3 border-y border-line py-4 md:mt-12 md:space-y-4 md:py-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-7">
            <button
              type="button"
              onClick={() => setFilter('tutti')}
              className={`font-body text-[0.72rem] tracking-[0.14em] uppercase transition-opacity ${
                active === 'tutti' ? 'text-ink' : 'text-ink-2 hover:opacity-70'
              }`}
            >
              {t('cat.tutti')}
            </button>
            {catalogCategories
              .filter((c) => ['rossi', 'bianchi', 'rosati', 'bollicine'].includes(c.slug))
              .map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  className={`font-body text-[0.72rem] tracking-[0.14em] uppercase transition-opacity ${
                    active === c.slug ? 'text-ink' : 'text-ink-2 hover:opacity-70'
                  }`}
                >
                  {catLabel(c.slug)}
                </button>
              ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-7">
            {catalogCategories
              .filter((c) => !['rossi', 'bianchi', 'rosati', 'bollicine'].includes(c.slug))
              .map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  className={`font-body text-[0.72rem] tracking-[0.14em] uppercase transition-opacity ${
                    active === c.slug ? 'text-ink' : 'text-ink-2 hover:opacity-70'
                  }`}
                >
                  {catLabel(c.slug)}
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10 md:pb-32 lg:px-14">
        <p className="mb-8 font-body text-[0.78rem] text-ink-2">
          {wines.length} {wines.length === 1 ? t('catalog.countOne') : t('catalog.countMany')}
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-3 md:gap-x-8 md:gap-y-20 lg:grid-cols-4"
        >
          {wines.map((w) => {
            const isBoxShot = w.slug === 'les_vins_introuvables' || w.categories.includes('wine-box')
            const inCart = items.some((i) => i.id === w.id)

            return (
              <article
                key={`${active}-${w.id}`}
                data-wine-card
                className="group flex flex-col items-center text-center"
                style={{ visibility: 'hidden', opacity: 0 }}
              >
                <div className="relative w-full">
                  <Link
                    to={`/catalogo/${w.slug}`}
                    className={
                      isBoxShot
                        ? 'relative block aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]'
                        : 'relative flex h-[300px] w-full items-end justify-center sm:h-[340px] md:h-[400px]'
                    }
                  >
                    {w.img ? (
                      <img
                        src={w.img}
                        alt={w.name}
                        className={
                          isBoxShot
                            ? 'h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]'
                            : 'bottle-shadow max-h-full w-auto max-w-[92%] object-contain transition-transform duration-500 group-hover:scale-[1.04] md:max-w-full'
                        }
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border border-line text-ink-2">
                        —
                      </div>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => addItem(w)}
                    aria-label={inCart ? t('cart.added') : t('cart.add')}
                    className={
                      inCart
                        ? 'absolute right-0 bottom-[12%] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-wine text-paper shadow-[0_6px_18px_rgba(40,28,20,0.18)] transition-[transform,background-color] duration-300 hover:scale-105 active:scale-95 md:h-11 md:w-11'
                        : 'absolute right-0 bottom-[12%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper/90 text-ink shadow-[0_6px_18px_rgba(40,28,20,0.12)] backdrop-blur-[2px] transition-[transform,background-color,border-color,color] duration-300 hover:border-ink hover:bg-ink hover:text-paper active:scale-95 md:h-11 md:w-11'
                    }
                  >
                    {inCart ? (
                      <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden>
                        <path
                          d="M5 12.5l4.2 4.2L19 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" aria-hidden>
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <h2 className="mt-6 max-w-[18ch] font-body text-[0.92rem] font-semibold leading-snug tracking-tight md:text-[1.05rem]">
                  <Link to={`/catalogo/${w.slug}`} className="transition-opacity hover:opacity-55">
                    {w.name}
                  </Link>
                </h2>
                <p className="mt-2 font-body text-[0.88rem] text-ink-2 md:text-[0.95rem]">{w.price}</p>
                <p className="mt-1 font-body text-[0.65rem] tracking-[0.12em] uppercase text-ink/45">
                  {catLabel(w.category)}
                </p>
              </article>
            )
          })}
        </div>

        {wines.length === 0 && (
          <p className="py-20 text-center font-body text-ink-2">{t('catalog.empty')}</p>
        )}
      </section>
    </div>
  )
}
