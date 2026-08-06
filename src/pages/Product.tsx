import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  getRelatedWines,
  getWineBySlug,
  wineFormatKey,
  type CatalogWine,
} from '../data/catalog'
import { productDetails } from '../data/productDetails'
import { useCart } from '../cart/CartProvider'
import { useI18n } from '../i18n/I18nProvider'

gsap.registerPlugin(ScrollTrigger)

function isNarrative(text: string) {
  return !/^(Colore|Profumo|Sapore)\s*:/i.test(text.trim())
}

export function Product() {
  const { slug = '' } = useParams()
  const { t } = useI18n()
  const { addItem, items } = useCart()
  const [qty, setQty] = useState(1)
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const wine = useMemo(() => getWineBySlug(slug), [slug])
  const related = useMemo(() => (wine ? getRelatedWines(wine, 4) : []), [wine])
  const details = wine ? productDetails[wine.slug] : undefined

  const lead = useMemo(() => {
    if (!details) return ''
    if (details.lead && isNarrative(details.lead)) return details.lead
    return details.story.find(isNarrative) ?? ''
  }, [details])

  const story = useMemo(() => {
    if (!details) return [] as string[]
    return details.story.filter(
      (p) => isNarrative(p) && p !== lead,
    )
  }, [details, lead])

  const tasting = details?.tasting
  const inCart = wine ? items.some((i) => i.id === wine.id) : false
  const isBoxShot =
    wine?.slug === 'les_vins_introuvables' || wine?.categories.includes('wine-box')

  useEffect(() => {
    setQty(1)
    window.__lenis?.scrollTo(0, { immediate: true })
  }, [slug])

  useEffect(() => {
    const root = rootRef.current
    const img = imgRef.current
    if (!root || !img) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tween = gsap.fromTo(
      img,
      { yPercent: -6, force3D: true },
      {
        yPercent: 6,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [slug])

  if (!wine) {
    return <Navigate to="/catalogo" replace />
  }

  const onAdd = () => {
    addItem(wine, qty)
  }

  return (
    <div ref={rootRef} className="bg-paper text-ink">
      <section className="mx-auto max-w-[1400px] px-5 pb-6 pt-28 md:px-10 md:pt-32 lg:px-14">
        <nav
          className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-2"
          aria-label={t('product.breadcrumbAria')}
        >
          <Link to="/catalogo" className="transition-opacity hover:opacity-55">
            {t('product.catalog')}
          </Link>
          <span aria-hidden>/</span>
          <Link
            to={`/catalogo?c=${wine.category}`}
            className="transition-opacity hover:opacity-55"
          >
            {t(`cat.${wine.category}`)}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink normal-case tracking-normal">{wine.name}</span>
        </nav>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-16 md:gap-14 md:px-10 md:pb-24 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-14">
        <div className="relative flex items-center justify-center overflow-hidden bg-paper-2/40 px-6 py-12 md:py-16 lg:sticky lg:top-28 lg:min-h-[min(78vh,720px)]">
          {wine.img ? (
            <img
              ref={imgRef}
              src={wine.img}
              alt={wine.name}
              className={
                isBoxShot
                  ? 'h-auto w-full max-w-[420px] object-contain will-change-transform'
                  : 'bottle-shadow h-auto max-h-[min(70vh,620px)] w-auto max-w-[min(100%,280px)] object-contain will-change-transform md:max-w-[320px]'
              }
              decoding="async"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center text-ink-2">—</div>
          )}
        </div>

        <div className="lg:pt-4">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
            {t(`cat.${wine.category}`)}
          </p>
          <h1 className="mt-4 max-w-[18ch] font-body text-[clamp(1.85rem,5vw,3.15rem)] font-semibold leading-[1.02] tracking-tight">
            {wine.name}
          </h1>
          <p className="mt-5 font-body text-[1.35rem] tracking-tight md:text-[1.5rem]">{wine.price}</p>

          {lead ? (
            <p className="mt-7 max-w-[38rem] font-body text-[0.98rem] leading-relaxed text-ink-2 md:text-[1.02rem]">
              {lead}
            </p>
          ) : null}

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-4 border-y border-line py-6 font-body text-[0.88rem]">
            <div>
              <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-2">
                {t('product.format')}
              </dt>
              <dd className="mt-1.5">{t(`product.format.${wineFormatKey(wine)}`)}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-2">
                {t('product.origin')}
              </dt>
              <dd className="mt-1.5">{t('product.originValue')}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-2">
                {t('product.category')}
              </dt>
              <dd className="mt-1.5">{t(`cat.${wine.category}`)}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] tracking-[0.14em] uppercase text-ink-2">
                {t('product.producer')}
              </dt>
              <dd className="mt-1.5">Grosjean Vins</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div
              className="inline-flex items-center border border-ink/20"
              role="group"
              aria-label={t('product.qty')}
            >
              <button
                type="button"
                className="flex h-12 w-11 items-center justify-center font-body text-lg transition-opacity hover:opacity-55"
                aria-label={t('cart.decrease')}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center font-body text-[0.95rem] tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                className="flex h-12 w-11 items-center justify-center font-body text-lg transition-opacity hover:opacity-55"
                aria-label={t('cart.increase')}
                onClick={() => setQty((q) => Math.min(24, q + 1))}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-12 min-w-[14rem] items-center justify-center bg-ink px-8 font-body text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-paper transition-[opacity,transform] duration-300 hover:opacity-85 active:scale-[0.99]"
            >
              {inCart ? t('product.addAgain') : t('product.addToCart')}
            </button>
          </div>

          <p className="mt-5 max-w-md font-body text-[0.78rem] leading-relaxed text-ink-2">
            {t('product.demoNote')}
          </p>

          <ul className="mt-8 space-y-2.5 font-body text-[0.82rem] text-ink-2">
            <li>{t('product.trustShip')}</li>
            <li>{t('product.trustPay')}</li>
            <li>{t('product.trustCellar')}</li>
          </ul>
        </div>
      </section>

      {(tasting || story.length > 0) && (
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24 lg:px-14">
            {tasting ? (
              <div>
                <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
                  {t('product.tasting')}
                </h2>
                <dl className="mt-6 space-y-6">
                  {tasting.color ? (
                    <div>
                      <dt className="font-display text-[1.05rem] italic text-ink">
                        {t('product.color')}
                      </dt>
                      <dd className="mt-2 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2">
                        {tasting.color}
                      </dd>
                    </div>
                  ) : null}
                  {tasting.nose ? (
                    <div>
                      <dt className="font-display text-[1.05rem] italic text-ink">
                        {t('product.nose')}
                      </dt>
                      <dd className="mt-2 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2">
                        {tasting.nose}
                      </dd>
                    </div>
                  ) : null}
                  {tasting.palate ? (
                    <div>
                      <dt className="font-display text-[1.05rem] italic text-ink">
                        {t('product.palate')}
                      </dt>
                      <dd className="mt-2 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2">
                        {tasting.palate}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : (
              <div>
                <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
                  {t('product.about')}
                </h2>
                <p className="mt-6 max-w-md font-display text-[1.2rem] italic leading-relaxed text-ink">
                  {t('product.aboutFallback')}
                </p>
              </div>
            )}

            <div>
              <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
                {t('product.story')}
              </h2>
              <div className="mt-6 space-y-5 max-w-xl">
                {(story.length ? story : lead ? [lead] : []).map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="font-body text-[0.98rem] leading-relaxed text-ink-2"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
            <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              {t('product.related')}
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-16">
              {related.map((w) => (
                <RelatedCard key={w.id} wine={w} label={t(`cat.${w.category}`)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function RelatedCard({ wine, label }: { wine: CatalogWine; label: string }) {
  const isBoxShot =
    wine.slug === 'les_vins_introuvables' || wine.categories.includes('wine-box')

  return (
    <article className="group flex flex-col items-center text-center">
      <Link
        to={`/catalogo/${wine.slug}`}
        className={
          isBoxShot
            ? 'relative block aspect-[4/5] w-full overflow-hidden'
            : 'relative flex h-[220px] w-full items-end justify-center md:h-[260px]'
        }
      >
        {wine.img ? (
          <img
            src={wine.img}
            alt={wine.name}
            className={
              isBoxShot
                ? 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                : 'bottle-shadow max-h-full w-auto max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-[1.04]'
            }
            loading="lazy"
          />
        ) : null}
      </Link>
      <h3 className="mt-5 max-w-[16ch] font-body text-[0.88rem] font-semibold leading-snug tracking-tight md:text-[0.95rem]">
        <Link to={`/catalogo/${wine.slug}`} className="transition-opacity hover:opacity-55">
          {wine.name}
        </Link>
      </h3>
      <p className="mt-1.5 font-body text-[0.82rem] text-ink-2">{wine.price}</p>
      <p className="mt-1 font-body text-[0.62rem] tracking-[0.12em] uppercase text-ink/45">{label}</p>
    </article>
  )
}
