import { useMemo } from 'react'
import { useI18n } from '../i18n/I18nProvider'

const RECIPE_META = [
  { wine: 'Chambave Muscat', img: '/images/pair-muscat.png', key: 'r1', ings: 9 },
  { wine: 'Chardonnay', img: '/images/pair-chardonnay.png', key: 'r2', ings: 8 },
  { wine: 'Chardonnay', img: '/images/pair-michel.png', key: 'r3', ings: 7 },
  { wine: 'Clairet', img: '/images/pair-clairetz.png', key: 'r4', ings: 9 },
] as const

export function Pairings() {
  const { t, locale } = useI18n()

  const recipes = useMemo(
    () =>
      RECIPE_META.map((r) => ({
        wine: r.wine,
        img: r.img,
        dish: t(`pairings.${r.key}.dish`),
        steps: t(`pairings.${r.key}.steps`),
        ingredients: Array.from({ length: r.ings }, (_, i) => t(`pairings.${r.key}.i${i}`)),
      })),
    [t, locale],
  )

  return (
    <section id="abbinamenti" className="bg-paper text-ink">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-5 pb-16 pt-20 text-center sm:px-6 md:gap-5 md:pb-28 md:pt-32">
        <h2 className="font-body text-[clamp(1.65rem,6vw,2.8rem)] font-semibold tracking-tight">
          {t('pairings.heading')}
        </h2>
        <p className="font-body text-[0.92rem] leading-relaxed text-ink-2 md:text-base">
          {t('pairings.sub')}
        </p>
      </div>

      <div className="flex flex-col gap-20 pb-20 md:gap-40 md:pb-40">
        {recipes.map((r, i) => {
          const flip = i % 2 === 1
          return (
            <article
              key={`${r.wine}-${r.dish}`}
              data-pair-article
              className={`mx-auto grid w-full max-w-[1400px] items-start gap-8 px-5 md:grid-cols-2 md:gap-20 md:px-10 lg:gap-28 ${
                flip ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div
                data-pair-frame
                className="relative aspect-[4/5] w-full overflow-hidden md:sticky md:top-24 md:aspect-[5/6]"
              >
                <img
                  data-pair-img
                  src={r.img}
                  alt={`${r.wine} — ${r.dish}`}
                  className="absolute left-0 top-[-12%] h-[124%] w-full object-cover will-change-transform"
                />
              </div>

              <div
                className={`mx-auto max-w-lg pt-1 text-center md:mx-0 md:pt-2 md:text-left ${
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
                      <li key={item} className="font-body text-[0.92rem] leading-snug text-ink md:text-[0.95rem]">
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
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
