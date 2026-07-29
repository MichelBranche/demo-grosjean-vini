import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Pairings } from './Pairings'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const wines = [
  { name: 'Chambave Muscat', year: '2025', price: '19 €', img: '/images/bottle-muscat.png' },
  { name: 'Le Vin de Michel', year: '2024', price: '33 €', img: '/images/bottle-michel.png' },
  { name: 'Chardonnay', year: '2025', price: '13 €', img: '/images/bottle-chardonnay.png' },
  { name: 'Clairetz', year: '2022', price: '35 €', img: '/images/bottle-clairetz.png' },
]

export function ScrollStory() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const el = root.current
      if (!el) return

      const intro = el.querySelector<HTMLElement>('[data-intro]')
      const introLeft = el.querySelector<HTMLElement>('[data-intro-left]')
      const introRight = el.querySelector<HTMLElement>('[data-intro-right]')
      const introWord = gsap.utils.toArray<HTMLElement>('[data-intro-word]', el)
      const introRule = el.querySelector<HTMLElement>('[data-intro-rule]')
      const heroBoot = gsap.utils.toArray<HTMLElement>('[data-hero-boot]', el)

      const armScroll = () => {
        ScrollTrigger.refresh()
        window.setTimeout(() => ScrollTrigger.refresh(), 200)
      }

      if (reduce) {
        intro?.remove()
        gsap.set(heroBoot, { clearProps: 'all' })
        armScrollChapters()
        return
      }

      if (!intro || !introLeft || !introRight || !introRule || introWord.length < 2) {
        armScrollChapters()
        return
      }

      const lenis = window.__lenis
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      gsap.set(introWord, { autoAlpha: 0, y: 18 })
      gsap.set(introRule, { scaleY: 0 })
      gsap.set(heroBoot, { autoAlpha: 0, y: 28 })

      const boot = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          document.documentElement.style.overflow = ''
          document.body.style.overflow = ''
          lenis?.scrollTo(0, { immediate: true })
          lenis?.start()
          intro.remove()
          armScrollChapters()
          armScroll()
        },
      })

      boot
        .to(introWord, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power4.out' }, 0.2)
        .to(introRule, { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0.85)
        .to({}, { duration: 0.45 })
        .to(
          introLeft,
          { xPercent: -100, duration: 1.25, ease: 'power4.inOut' },
          'open',
        )
        .to(
          introRight,
          { xPercent: 100, duration: 1.25, ease: 'power4.inOut' },
          'open',
        )
        .to(
          introRule,
          { autoAlpha: 0, duration: 0.35, ease: 'power2.in' },
          'open',
        )
        .to(
          heroBoot,
          { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out' },
          'open+=0.45',
        )

      function armScrollChapters() {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px)', () => {
          const hero = root.current?.querySelector<HTMLElement>("[data-chapter='hero']")
          const heroImg = hero?.querySelector<HTMLElement>('[data-media]')
          const heroBrand = hero?.querySelector<HTMLElement>('[data-brand]')
          if (hero && heroImg && heroBrand) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: '+=120%',
                  scrub: 0.45,
                  pin: true,
                  anticipatePin: 1,
                },
              })
              .fromTo(heroImg, { scale: 1.08 }, { scale: 1, ease: 'none' }, 0)
              .to(heroBrand, { yPercent: -12, ease: 'none' }, 0)
          }

          const years = root.current?.querySelector<HTMLElement>("[data-chapter='anni']")
          const yearCards = years ? gsap.utils.toArray<HTMLElement>('[data-anno]', years) : []
          if (years && yearCards.length >= 3) {
            gsap.set(yearCards, { autoAlpha: 0.2, y: 40 })
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: years,
                  start: 'top top',
                  end: '+=170%',
                  scrub: 0.5,
                  pin: true,
                  anticipatePin: 1,
                },
              })
              .to(yearCards[0], { autoAlpha: 1, y: 0, ease: 'none', duration: 0.35 }, 0)
              .to(yearCards[0], { autoAlpha: 0.25, ease: 'none', duration: 0.25 }, 0.45)
              .to(yearCards[1], { autoAlpha: 1, y: 0, ease: 'none', duration: 0.35 }, 0.45)
              .to(yearCards[1], { autoAlpha: 0.25, ease: 'none', duration: 0.25 }, 0.9)
              .to(yearCards[2], { autoAlpha: 1, y: 0, ease: 'none', duration: 0.35 }, 0.9)
          }
        })

        mm.add('(max-width: 767px)', () => {
          const hero = root.current?.querySelector<HTMLElement>("[data-chapter='hero']")
          const heroImg = hero?.querySelector<HTMLElement>('[data-media]')
          if (hero && heroImg) {
            gsap.fromTo(
              heroImg,
              { scale: 1.06 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.5,
                },
              },
            )
          }

          const years = root.current?.querySelector<HTMLElement>("[data-chapter='anni']")
          const yearCards = years ? gsap.utils.toArray<HTMLElement>('[data-anno]', years) : []
          yearCards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0.35, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  end: 'top 55%',
                  scrub: 0.6,
                },
              },
            )
          })
        })

        const winesEl = root.current?.querySelector<HTMLElement>("[data-chapter='vini']")
        if (winesEl) {
          const cards = gsap.utils.toArray<HTMLElement>('[data-wine]', winesEl)
          const bottles = cards
            .map((card) => card.querySelector<HTMLElement>('[data-bottle]'))
            .filter(Boolean) as HTMLElement[]

          gsap.set(bottles, { transformOrigin: '50% 100%', force3D: true })

          if (!reduce && window.matchMedia('(pointer: fine)').matches) {
            cards.forEach((card) => {
              const bottle = card.querySelector<HTMLElement>('[data-bottle]')
              if (!bottle) return

              const grow = () => {
                bottles.forEach((b) => {
                  const active = b === bottle
                  gsap.to(b, {
                    scale: active ? 1.28 : 0.92,
                    opacity: active ? 1 : 0.5,
                    duration: active ? 1.35 : 1.1,
                    ease: active ? 'power3.out' : 'power2.out',
                    overwrite: 'auto',
                  })
                })
              }

              const reset = () => {
                gsap.to(bottles, {
                  scale: 1,
                  opacity: 1,
                  duration: 1.15,
                  ease: 'power2.inOut',
                  overwrite: 'auto',
                })
              }

              card.addEventListener('pointerenter', grow)
              card.addEventListener('pointerleave', reset)
            })
          }
        }

        if (!reduce) {
          const pairArticles = gsap.utils.toArray<HTMLElement>('[data-pair-article]', root.current)
          pairArticles.forEach((article) => {
            const img = article.querySelector<HTMLElement>('[data-pair-img]')
            if (!img) return

            gsap.fromTo(
              img,
              { yPercent: -12 },
              {
                yPercent: 12,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: article,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            )
          })

          const degustSection = root.current?.querySelector<HTMLElement>('#degustazione')
          const degustImg = degustSection?.querySelector<HTMLElement>('[data-degust-img]')
          if (degustSection && degustImg) {
            gsap.fromTo(
              degustImg,
              { yPercent: -12 },
              {
                yPercent: 12,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: degustSection,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          ScrollTrigger.refresh()
        }
      }
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <div data-intro className="fixed inset-0 z-[100] overflow-hidden" aria-hidden>
        {/* Left curtain — holds left half of the wordmark */}
        <div
          data-intro-left
          className="absolute inset-y-0 left-0 z-10 w-1/2 overflow-hidden bg-paper will-change-transform"
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
            <p
              data-intro-word
              className="whitespace-nowrap font-body text-[clamp(2.2rem,11vw,6.5rem)] font-semibold uppercase leading-none tracking-[0.06em] text-ink"
            >
              Grosjean
              <span className="align-super text-[0.45em] tracking-normal">®</span>
            </p>
          </div>
        </div>

        {/* Right curtain — holds right half of the wordmark */}
        <div
          data-intro-right
          className="absolute inset-y-0 right-0 z-10 w-1/2 overflow-hidden bg-paper will-change-transform"
        >
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2">
            <p
              data-intro-word
              className="whitespace-nowrap font-body text-[clamp(2.2rem,11vw,6.5rem)] font-semibold uppercase leading-none tracking-[0.06em] text-ink"
            >
              Grosjean
              <span className="align-super text-[0.45em] tracking-normal">®</span>
            </p>
          </div>
        </div>

        {/* Center seam that marks the split */}
        <div className="pointer-events-none absolute left-1/2 top-[38%] z-20 h-[24%] -translate-x-1/2">
          <div data-intro-rule className="h-full w-px origin-center bg-gold/70" />
        </div>
      </div>

      <section id="top" data-chapter="hero" className="chapter">
        <div className="chapter-stage bg-ink">
          <div data-media className="chapter-media">
            <img
              src="/images/hero-clean.jpg"
              alt="Pendii vitati in Valle d’Aosta"
              className="h-full w-full object-cover object-[center_40%]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(26,31,36,0.62)_0%,rgba(26,31,36,0.28)_48%,rgba(26,31,36,0.18)_100%)]" />

          <div
            data-hero-boot
            className="relative z-10 flex h-full flex-col justify-between px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[5.5rem] text-paper sm:px-6 md:px-10 md:pb-14 md:pt-32 lg:px-14"
          >
            <p className="mx-auto max-w-[12rem] text-center font-body text-[0.65rem] leading-relaxed tracking-[0.14em] uppercase text-paper/70 md:text-[0.72rem]">
              Quart · Valle d’Aosta
            </p>

            <div data-brand className="mx-auto flex w-full max-w-[36rem] flex-col items-center text-center">
              <h1 className="font-body text-[clamp(2.85rem,14vw,9rem)] font-semibold uppercase leading-[0.86] tracking-[0.02em]">
                Grosjean
                <span className="align-super text-[0.45em] tracking-normal">®</span>
              </h1>

              <p className="mt-4 font-body text-[clamp(1.05rem,4.5vw,1.35rem)] font-medium italic leading-snug tracking-[0.02em] text-paper/90 md:mt-8">
                Grands vins de montagne
              </p>

              <p className="mt-4 max-w-sm font-body text-[0.9rem] leading-relaxed text-paper/75 md:mt-5 md:text-[0.95rem]">
                Viticoltura eroica a Quart. Prima cantina biologica della Valle d’Aosta.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-6 md:gap-x-8">
                <a
                  href="#vini"
                  className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper underline decoration-paper/35 underline-offset-[6px] transition-opacity hover:opacity-70 md:text-[0.78rem]"
                >
                  La collezione
                </a>
                <a
                  href="#visita"
                  className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper/80 transition-opacity hover:opacity-100 md:text-[0.78rem]"
                >
                  Prenota una visita →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vini" data-chapter="vini" className="chapter">
        <div className="relative flex min-h-[100svh] flex-col overflow-visible bg-paper md:h-[100svh]">
          <div className="flex shrink-0 flex-col items-center gap-3 px-5 pb-4 pt-20 text-center md:px-8 md:pb-5 md:pt-16">
            <h2 className="font-body text-[clamp(1.65rem,6vw,2.8rem)] font-semibold tracking-tight">
              La nostra collezione
            </h2>
            <p className="font-body text-sm text-ink-2 md:text-[0.95rem]">
              Una selezione dalla cantina
            </p>
            <a
              href="https://grosjeanvins.it/negozio/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-body text-sm font-semibold underline decoration-ink/30 underline-offset-4"
            >
              Negozio completo ↗
            </a>
          </div>

          <div className="grid min-h-[70svh] flex-1 grid-cols-2 md:min-h-0 md:grid-cols-4">
            {wines.map((w, i) => (
              <a
                key={w.name}
                data-wine
                href="https://grosjeanvins.it/negozio/"
                target="_blank"
                rel="noreferrer"
                className={`relative z-0 flex min-h-0 flex-col items-center border-line px-2 pb-6 pt-3 hover:z-20 md:px-4 md:pb-10 md:pt-4 ${
                  i % 2 === 1 ? 'border-l' : ''
                } ${i >= 2 ? 'border-t md:border-t-0' : ''} ${i > 0 ? 'md:border-l' : ''}`}
              >
                <div className="relative flex min-h-[38vw] w-full flex-1 items-end justify-center md:min-h-0">
                  <img
                    data-bottle
                    src={w.img}
                    alt={w.name}
                    className="bottle-shadow relative h-[72%] max-h-full w-auto object-contain md:h-[82%]"
                    draggable={false}
                  />
                </div>
                <div className="mt-3 w-full shrink-0 px-1 text-center md:mt-5">
                  <h3 className="font-display text-[0.68rem] font-semibold tracking-[0.06em] uppercase md:text-[0.85rem] md:tracking-[0.08em]">
                    {w.name}
                  </h3>
                  <p className="mt-1 font-body text-[0.75rem] text-ink-2 md:mt-1.5 md:text-sm">
                    {w.year} · {w.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="anni" data-chapter="anni" className="chapter">
        <div className="bg-paper px-5 py-20 md:relative md:h-[100svh] md:overflow-hidden md:px-10 md:py-0">
          <div className="mx-auto flex max-w-[1100px] flex-col justify-center gap-10 md:h-full md:gap-12">
            <p className="font-body text-sm text-ink-2">Tre date, una famiglia</p>

            <article data-anno className="border-t border-line pt-5 md:pt-6">
              <p className="font-body text-[clamp(2.6rem,14vw,6rem)] font-semibold leading-none tracking-tight">
                1968
              </p>
              <p className="mt-3 max-w-lg font-body text-[0.98rem] leading-relaxed text-ink-2 md:mt-4 md:text-[1.05rem]">
                Nonno Dauphin presenta il Ciliegiolo all’Exposition des Vins du Val d’Aoste. Nasce
                l’impresa.
              </p>
            </article>

            <article data-anno className="border-t border-line pt-5 md:pt-6">
              <p className="font-body text-[clamp(2.6rem,14vw,6rem)] font-semibold leading-none tracking-tight">
                2011
              </p>
              <p className="mt-3 max-w-lg font-body text-[0.98rem] leading-relaxed text-ink-2 md:mt-4 md:text-[1.05rem]">
                Conversione biologica: prima cantina della Valle d’Aosta a scegliere questa strada.
              </p>
            </article>

            <article data-anno className="border-t border-line pt-5 md:pt-6">
              <p className="font-body text-[clamp(2.6rem,14vw,6rem)] font-semibold leading-none tracking-tight">
                Oggi
              </p>
              <p className="mt-3 max-w-lg font-body text-[0.98rem] leading-relaxed text-ink-2 md:mt-4 md:text-[1.05rem]">
                Hervé, Didier, Simon e Marco: la terza generazione custode dei cru e dei vitigni
                autoctoni.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Pairings />

      <section
        id="esperienze"
        className="relative flex flex-col overflow-hidden bg-ink text-paper md:min-h-[100svh] md:justify-end"
      >
        <div className="relative h-[58svh] w-full shrink-0 md:absolute md:inset-0 md:h-full">
          <img
            src="/images/degustavigna.jpg"
            alt="Vigna Grosjean a Quart"
            className="h-full w-full object-cover object-[18%_42%] md:object-[center_40%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,31,36,0.1)_0%,rgba(26,31,36,0.25)_45%,rgba(26,31,36,0.72)_100%)] md:bg-[linear-gradient(180deg,rgba(26,31,36,0.15)_0%,rgba(26,31,36,0.55)_55%,rgba(26,31,36,0.78)_100%)]" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-start bg-ink px-5 pb-14 pt-10 text-left sm:px-6 md:min-h-[100svh] md:items-end md:justify-end md:bg-transparent md:px-10 md:pb-20 md:pt-32 md:text-right lg:px-14">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-paper/65">
            Dal calice alla vigna
          </p>
          <h2 className="mt-4 max-w-[14ch] font-body text-[clamp(2.2rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-tight">
            Vieni a vivere Quart
          </h2>
          <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-paper/75 md:text-[1rem]">
            Dopo la tavola, i filari. Degustazioni, picnic e racconti tra le vigne di Ollignan.
          </p>
          <a
            href="#visita"
            className="mt-8 inline-block font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper underline decoration-paper/35 underline-offset-[6px] transition-opacity hover:opacity-70 md:text-[0.78rem]"
          >
            Scopri le esperienze
          </a>
        </div>
      </section>

      <section id="visita" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1500px] lg:min-h-[100svh] lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 md:py-24 lg:order-1 lg:px-14 lg:py-28">
            <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              Alla scoperta del Terroir valdostano
            </p>
            <h2 className="mt-4 max-w-[12ch] font-body text-[clamp(2rem,9vw,4.2rem)] font-semibold leading-[0.95] tracking-tight md:mt-5">
              PicNic in Vigna
            </h2>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-6 md:text-[1rem]">
              Goditi un calice di vino con la spettacolare vista delle montagne che circondano Aosta,
              immerso nei filari dei migliori Cru della Valle d’Aosta, abbracciato dai filari dei
              vitigni autoctoni. Immerso nella natura potrai apprezzare appieno l’espressione dei
              nostri vini che crescono in un ambiente sano e pulito.
            </p>
            <p className="mt-4 max-w-md font-display text-[1rem] italic leading-relaxed text-ink md:mt-5 md:text-[1.05rem]">
              «Prima di amare, impara a camminare sulla neve senza lasciare impronte» — noi vogliamo
              essere custodi e giardinieri dei nostri Terroir.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-8">
              <a
                href="https://grosjeanvins.it/degustazione/"
                target="_blank"
                rel="noreferrer"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60 md:text-[0.78rem]"
              >
                Prenota una visita
              </a>
              <a
                href="https://grosjeanvins.it/"
                target="_blank"
                rel="noreferrer"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-100 md:text-[0.78rem]"
              >
                Scopri di più →
              </a>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center px-4 pb-2 pt-10 sm:px-5 md:px-8 md:py-14 lg:order-2 lg:py-16 lg:pr-10">
            <img
              src="/images/picnic.jpg"
              alt="Picnic in vigna Grosjean a Quart"
              className="h-auto w-full max-w-[520px] object-contain lg:max-h-[min(85vh,780px)] lg:w-auto"
            />
          </div>
        </div>
      </section>

      <section id="visione" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1500px] lg:min-h-[100svh] lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 md:py-24 lg:order-1 lg:px-14 lg:py-28">
            <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              Custodi del territorio
            </p>
            <h2 className="mt-4 max-w-[12ch] font-body text-[clamp(2rem,9vw,4.2rem)] font-semibold leading-[0.95] tracking-tight md:mt-5">
              La nostra visione
            </h2>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-6 md:text-[1rem]">
              Crescere per rappresentare al meglio il panorama vitivinicolo della Valle d’Aosta —
              con la stessa cura con cui coltiviamo i filari.
            </p>
            <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-5 md:text-[1rem]">
              Tutelare il terroir e l’ambiente in cui viviamo, per dare futuro ai nostri figli.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-8">
              <a
                href="#anni"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60 md:text-[0.78rem]"
              >
                La nostra storia
              </a>
              <a
                href="#visita"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-100 md:text-[0.78rem]"
              >
                Vieni a Quart →
              </a>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center px-4 pb-2 pt-10 sm:px-5 md:px-8 md:py-14 lg:order-2 lg:py-16 lg:pr-10">
            <img
              src="/images/visione-uve.png"
              alt="Uve Grosjean con coccinella in vigna"
              className="h-auto w-full max-w-[520px] object-contain lg:max-h-[min(85vh,780px)] lg:w-auto"
            />
          </div>
        </div>
      </section>

      <section id="degustazione" className="bg-paper text-ink">
        <div className="mx-auto flex justify-center px-4 pt-14 sm:px-5 md:px-8 md:pt-20">
          <div
            data-degust-frame
            className="relative aspect-[4/3] w-full max-w-[1024px] overflow-hidden"
          >
            <img
              data-degust-img
              src="/images/degustazione.png"
              alt="Degustazione Grosjean — Müller Thurgau, pane e miele"
              width={1024}
              height={768}
              className="absolute left-0 top-[-12%] h-[124%] w-full object-cover will-change-transform"
              decoding="async"
            />
          </div>
        </div>

        <div className="mx-auto flex max-w-[40rem] flex-col items-center px-5 py-14 text-center sm:px-6 md:py-20">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
            In cantina
          </p>
          <h2 className="mt-4 font-body text-[clamp(1.9rem,8vw,3.8rem)] font-semibold leading-[1.05] tracking-tight md:mt-5">
            Degustazione e visita in cantina
          </h2>
          <p className="mt-7 font-body text-[1rem] leading-relaxed text-ink-2">
            Il vino non è soltanto un prodotto di consumo: è l’espressione di un terroir, di fatica e
            lavoro umano che guida e plasma le forze della natura.
          </p>
          <p className="mt-5 font-display text-[1.1rem] italic leading-relaxed text-ink">
            «Il vino è come un bel libro, pieno di racconti, di personaggi ed avventure — e
            l’etichetta non è altro che la copertina di tale libro.»
          </p>
          <p className="mt-5 font-body text-[0.98rem] leading-relaxed text-ink-2">
            La degustazione inizia dall’impressione della bottiglia e dell’etichetta, poi si apre al
            viaggio dei sensi — olfatto e gusto. La visita in cantina e vigneto completa
            l’esplorazione: aneddoti e ricette familiari tra una barrique e l’altra.
          </p>
          <a
            href="https://grosjeanvins.it/degustazione/"
            target="_blank"
            rel="noreferrer"
            className="mt-10 font-body text-[0.78rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60"
          >
            Prenota una visita
          </a>
        </div>
      </section>
    </div>
  )
}
