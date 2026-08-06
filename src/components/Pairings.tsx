import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { catalogWines } from '../data/catalog'
import { useI18n } from '../i18n/I18nProvider'

gsap.registerPlugin(ScrollTrigger)

const RECIPE_META = [
  {
    wine: 'Chambave Muscat',
    img: '/images/pair-muscat.png',
    key: 'r1',
    ings: 9,
    wineSlug: 'chambave-muscat-vallee-daoste-doc',
  },
  {
    wine: 'Chardonnay',
    img: '/images/pair-chardonnay.png',
    key: 'r2',
    ings: 8,
    wineSlug: 'chardonnay-vallee-daoste-doc',
  },
  {
    wine: 'Le Vin de Michel',
    img: '/images/pair-michel.png',
    key: 'r3',
    ings: 7,
    wineSlug: 'chardonnay-le-vin-de-michel-vallee-daoste-doc',
  },
  {
    wine: 'Clairet',
    img: '/images/pair-clairetz.png',
    key: 'r4',
    ings: 9,
    wineSlug: 'clairet',
  },
] as const

function peekHeightPx() {
  if (typeof window === 'undefined') return 320
  return Math.round(Math.min(Math.max(window.innerHeight * 0.42, 260), 420))
}

export function Pairings() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const heightTween = useRef<gsap.core.Tween | null>(null)
  const veilTween = useRef<gsap.core.Tween | null>(null)
  const parallaxCtx = useRef<gsap.Context | null>(null)
  const revealCtx = useRef<gsap.Context | null>(null)
  const [open, setOpen] = useState(false)
  const booted = useRef(false)

  const recipes = useMemo(
    () =>
      RECIPE_META.map((r) => {
        const product = catalogWines.find((w) => w.slug === r.wineSlug)
        return {
          wine: r.wine,
          img: r.img,
          dish: t(`pairings.${r.key}.dish`),
          steps: t(`pairings.${r.key}.steps`),
          wineNote: t(`pairings.${r.key}.wineNote`),
          shopUrl: product?.permalink ?? `https://grosjeanvins.it/prodotto/${r.wineSlug}/`,
          ingredients: Array.from({ length: r.ings }, (_, i) => t(`pairings.${r.key}.i${i}`)),
        }
      }),
    [t, locale],
  )

  const killReveal = () => {
    revealCtx.current?.revert()
    revealCtx.current = null
    const root = sectionRef.current
    if (!root) return
    gsap.set(root.querySelectorAll('[data-pair-frame], [data-pair-copy]'), {
      autoAlpha: 1,
      y: 0,
      clearProps: 'transform,opacity,visibility',
    })
  }

  const armParallax = () => {
    parallaxCtx.current?.revert()
    parallaxCtx.current = null
    const root = sectionRef.current
    const panel = panelRef.current
    if (!root || !panel) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    parallaxCtx.current = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('[data-pair-frame]', root)
      frames.forEach((frame, i) => {
        const img = frame.querySelector<HTMLElement>('[data-pair-img]')
        if (!img) return

        // Trigger on the panel so scrub works in both peek and open heights
        const from = i % 2 === 0 ? -14 : -10
        const to = i % 2 === 0 ? 14 : 10

        gsap.fromTo(
          img,
          { yPercent: from, force3D: true },
          {
            yPercent: to,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        )
      })
      ScrollTrigger.refresh()
    }, root)
  }

  const armReveal = () => {
    killReveal()
    const root = sectionRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    revealCtx.current = gsap.context(() => {
      const articles = gsap.utils.toArray<HTMLElement>('[data-pair-article]', root)

      articles.forEach((article) => {
        const copy = article.querySelector<HTMLElement>('[data-pair-copy]')
        const frame = article.querySelector<HTMLElement>('[data-pair-frame]')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: article,
            start: 'top 92%',
            end: 'bottom 16%',
            scrub: 0.7,
            immediateRender: true,
          },
        })

        if (frame) {
          tl.fromTo(
            frame,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.16, ease: 'none' },
            0,
          )
            .to(frame, { autoAlpha: 1, y: 0, duration: 0.68, ease: 'none' }, 0.16)
            .to(frame, { autoAlpha: 0, y: -20, duration: 0.16, ease: 'none' }, 0.84)
        }
        if (copy) {
          tl.fromTo(
            copy,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: 0.16, ease: 'none' },
            0.04,
          )
            .to(copy, { autoAlpha: 1, y: 0, duration: 0.68, ease: 'none' }, 0.2)
            .to(copy, { autoAlpha: 0, y: -24, duration: 0.16, ease: 'none' }, 0.84)
        }
      })

      ScrollTrigger.refresh()
    }, root)
  }

  useLayoutEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current
    const veil = veilRef.current
    if (!panel || !inner || !veil) return

    heightTween.current?.kill()
    veilTween.current?.kill()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const peek = peekHeightPx()

    // First paint: closed peek, then arm parallax on settled layout
    if (!booted.current) {
      booted.current = true
      killReveal()
      gsap.set(panel, { height: peek, overflow: 'hidden' })
      gsap.set(veil, { autoAlpha: 1 })
      armParallax()
      return
    }

    if (reduce) {
      killReveal()
      parallaxCtx.current?.revert()
      parallaxCtx.current = null
      gsap.set(panel, {
        height: open ? 'auto' : peek,
        overflow: open ? 'visible' : 'hidden',
      })
      gsap.set(veil, { autoAlpha: open ? 0 : 1 })
      ScrollTrigger.refresh()
      return
    }

    if (open) {
      killReveal()
      gsap.set(inner.querySelectorAll('[data-pair-copy], [data-pair-frame]'), {
        clearProps: 'all',
      })
      gsap.set(panel, { overflow: 'hidden', height: panel.offsetHeight || peek })
      gsap.set(panel, { height: 'auto' })
      const full = inner.scrollHeight
      gsap.set(panel, { height: peek })

      heightTween.current = gsap.to(panel, {
        height: full,
        duration: 1.05,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(panel, { height: 'auto', overflow: 'visible' })
          armParallax()
          armReveal()
        },
      })
      veilTween.current = gsap.to(veil, {
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
      })
    } else {
      killReveal()
      const current = panel.offsetHeight || inner.scrollHeight
      gsap.set(panel, { height: current, overflow: 'hidden' })

      heightTween.current = gsap.to(panel, {
        height: peek,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => armParallax(),
      })
      veilTween.current = gsap.to(veil, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 0.15,
      })
    }

    return () => {
      heightTween.current?.kill()
      veilTween.current?.kill()
    }
  }, [open, locale])

  useLayoutEffect(
    () => () => {
      parallaxCtx.current?.revert()
      revealCtx.current?.revert()
    },
    [],
  )

  return (
    <section ref={sectionRef} id="abbinamenti" className="bg-paper pb-28 text-ink md:pb-44">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-5 pb-10 pt-20 text-center sm:px-6 md:gap-5 md:pb-14 md:pt-32">
        <h2 className="font-body text-[clamp(1.65rem,6vw,2.8rem)] font-semibold tracking-tight">
          {t('pairings.heading')}
        </h2>
        <p className="font-body text-[0.92rem] leading-relaxed text-ink-2 md:text-base">
          {t('pairings.sub')}
        </p>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="pairings-panel"
          onClick={() => setOpen((v) => !v)}
          className="group mt-2 inline-flex items-center gap-3.5 border border-ink/25 px-5 py-2.5 font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink transition-[background-color,color,border-color] duration-300 hover:border-ink hover:bg-ink hover:text-paper"
        >
          {open ? t('pairings.hide') : t('pairings.showAll')}
          <span className="relative h-3 w-3" aria-hidden>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </span>
        </button>
      </div>

      <div id="pairings-panel" ref={panelRef} className="relative overflow-hidden" aria-hidden={!open}>
        <div ref={innerRef} className="flex flex-col gap-28 pb-16 md:gap-52 md:pb-28">
          {recipes.map((r, i) => {
            const flip = i % 2 === 1
            return (
              <article
                key={`${r.wine}-${r.dish}`}
                data-pair-article
                className={`mx-auto grid w-full max-w-[1480px] items-start gap-10 px-5 md:grid-cols-2 md:gap-24 md:px-10 lg:gap-32 lg:px-14 ${
                  flip ? 'md:[&>div:first-child]:order-2' : ''
                }`}
              >
                <div
                  data-pair-frame
                  className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]"
                >
                  <img
                    data-pair-img
                    src={r.img}
                    alt={`${r.wine} — ${r.dish}`}
                    className="absolute left-0 w-full object-cover will-change-transform"
                    style={{ top: '-15%', height: '130%' }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                <div
                  data-pair-copy
                  className={`mx-auto w-full max-w-xl pt-1 text-center md:mx-0 md:max-w-2xl md:pt-2 md:text-left ${
                    flip ? 'md:justify-self-end' : ''
                  }`}
                >
                  <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-2 md:text-[0.7rem]">
                    {r.wine}
                  </p>
                  <h3 className="mt-3 font-body text-[clamp(1.35rem,5.5vw,2.15rem)] font-semibold leading-[1.15] tracking-tight md:mt-4">
                    {r.dish}
                  </h3>

                  <div className="mt-8 md:mt-10">
                    <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-2 md:text-[0.7rem]">
                      {t('pairings.ingredients')}
                    </p>
                    <ul className="mt-3 space-y-2 border-t border-line pt-4 md:mt-4">
                      {r.ingredients.map((item) => (
                        <li
                          key={item}
                          className="font-body text-[0.92rem] leading-snug text-ink md:text-[0.95rem]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 md:mt-12">
                    <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-2 md:text-[0.7rem]">
                      {t('pairings.prep')}
                    </p>
                    <p className="mt-3 border-t border-line pt-4 font-body text-[0.95rem] leading-[1.7] text-ink-2 md:mt-4 md:text-[0.98rem]">
                      {r.steps}
                    </p>
                  </div>

                  <div className="mt-10 md:mt-12">
                    <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-2 md:text-[0.7rem]">
                      {t('pairings.withWine')}
                    </p>
                    <p className="mt-3 border-t border-line pt-4 font-body text-[0.95rem] leading-[1.7] text-ink-2 md:mt-4 md:text-[0.98rem]">
                      {r.wineNote}
                    </p>
                    <a
                      href={r.shopUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-55"
                    >
                      {t('pairings.shop')}
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Soft mid fade when collapsed — peeks the first recipe */}
        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(247,243,235,0) 0%, rgba(247,243,235,0.55) 42%, rgba(247,243,235,0.92) 72%, var(--paper) 100%)',
          }}
          aria-hidden
        />
      </div>
    </section>
  )
}
