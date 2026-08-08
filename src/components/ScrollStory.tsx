import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nProvider'
import { Pairings } from './Pairings'
import { TextCta } from './TextCta'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const INTRO_SESSION_KEY = 'altura-intro-seen'

const wines = [
  { name: 'Muscat des Alpes', year: '2025', price: '19 €', img: '/images/bottle-muscat.png' },
  { name: 'Cuvée du Fondateur', year: '2024', price: '33 €', img: '/images/bottle-michel.png' },
  { name: 'Chardonnay Altitude', year: '2025', price: '13 €', img: '/images/bottle-chardonnay.png' },
  { name: 'Clairet des Cimes', year: '2022', price: '35 €', img: '/images/bottle-clairetz.png' },
]

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function ScrollStory() {
  const { t } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const [showIntro] = useState(() => !hasSeenIntro())
  const [heroUnlocked, setHeroUnlocked] = useState(() => hasSeenIntro())
  const [heroSoundOn, setHeroSoundOn] = useState(false)
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  // Pick a lighter source on small screens (source[media] is unreliable in some browsers)
  const [heroSrc] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? '/videos/hero-mobile.mp4'
      : '/videos/hero.mp4',
  )
  const heroUnlockedRef = useRef(heroUnlocked)
  heroUnlockedRef.current = heroUnlocked

  const toggleHeroSound = () => {
    const video = heroVideoRef.current
    if (!video) return
    const next = !heroSoundOn
    video.muted = !next
    if (next) {
      video.volume = 1
      void video.play().catch(() => {})
    }
    setHeroSoundOn(next)
  }

  useEffect(() => {
    if (reduceMotion || !showIntro || heroUnlocked) return
    const video = heroVideoRef.current
    if (!video) return
    video.pause()
    try {
      video.currentTime = 0
    } catch {
      /* ignore */
    }
  }, [reduceMotion, showIntro, heroUnlocked])

  // Kick playback as soon as the hero unlocks — IO alone often waits for a scroll on mobile
  useEffect(() => {
    if (reduceMotion || !heroUnlocked) return
    const video = heroVideoRef.current
    if (!video) return
    const kick = () => {
      if (!heroUnlockedRef.current) return
      // Autoplay policies: muted + playsInline is reliable on iOS/Android
      if (!heroSoundOn) video.muted = true
      void video.play().catch(() => {
        video.muted = true
        void video.play().catch(() => {})
      })
    }
    kick()
    // Retry once the file has enough data (common on mobile networks)
    video.addEventListener('loadeddata', kick, { once: true })
    video.addEventListener('canplay', kick, { once: true })
    return () => {
      video.removeEventListener('loadeddata', kick)
      video.removeEventListener('canplay', kick)
    }
  }, [heroUnlocked, reduceMotion, heroSoundOn])

  useEffect(() => {
    if (reduceMotion) return
    const video = heroVideoRef.current
    const hero = root.current?.querySelector<HTMLElement>("[data-chapter='hero']")
    if (!video || !hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !heroUnlockedRef.current) return
        if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
          void video.play().catch(() => {})
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: [0, 0.05, 0.15, 0.35] },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [reduceMotion])

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
      const introGo = el.querySelector<HTMLButtonElement>('[data-intro-go]')
      const heroBoot = gsap.utils.toArray<HTMLElement>('[data-hero-boot]', el)

      const disposers: Array<() => void> = []
      let heroEscortArmed = false

      const armScroll = () => {
        ScrollTrigger.refresh()
        window.setTimeout(() => ScrollTrigger.refresh(), 200)
      }

      const heroMedia = el.querySelector<HTMLElement>('[data-media]')
      // Match the scrubbed hero start scale so arming ScrollTrigger later doesn't snap
      if (heroMedia && !reduce) {
        gsap.set(heroMedia, { scale: 1.06, force3D: true })
      }

      const skipIntro = () => {
        intro?.remove()
        gsap.set(heroBoot, { clearProps: 'all' })
        heroUnlockedRef.current = true
        setHeroUnlocked(true)
        const video = heroVideoRef.current
        if (video) {
          video.muted = true
          video.playsInline = true
          void video.play().catch(() => {})
        }
        armScrollChapters()
        armScroll()
      }

      if (reduce || !showIntro) {
        skipIntro()
      } else if (
        !intro ||
        !introLeft ||
        !introRight ||
        !introRule ||
        !introGo ||
        introWord.length < 2
      ) {
        armScrollChapters()
      } else {
        const lenis = window.__lenis
        lenis?.stop()

        // Keep the scrollbar visible — overflow:hidden + padding was causing a rightward jump.
        // Block input scroll only; layout width stays identical before/after the curtain.
        const blockScroll = (e: Event) => {
          e.preventDefault()
        }
        const blockKeys = (e: KeyboardEvent) => {
          if (
            ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(
              e.key,
            )
          ) {
            e.preventDefault()
          }
        }
        window.addEventListener('wheel', blockScroll, { passive: false })
        window.addEventListener('touchmove', blockScroll, { passive: false })
        window.addEventListener('keydown', blockKeys)

        gsap.set(introWord, { autoAlpha: 0, y: 18 })
        gsap.set(introRule, { scaleY: 0 })
        gsap.set(introGo, { autoAlpha: 0, y: 14 })
        gsap.set(heroBoot, { autoAlpha: 0, y: 28 })

        const unlockScroll = () => {
          window.removeEventListener('wheel', blockScroll)
          window.removeEventListener('touchmove', blockScroll)
          window.removeEventListener('keydown', blockKeys)
        }

        const finishIntro = () => {
          try {
            sessionStorage.setItem(INTRO_SESSION_KEY, '1')
          } catch {
            /* ignore */
          }
          unlockScroll()
          lenis?.start()
          intro.remove()
          // Sync React after the curtain — avoids remounting video props mid-open
          const video = heroVideoRef.current
          setHeroUnlocked(true)
          setHeroSoundOn(Boolean(video && !video.muted))
          // Hero media is already at scale 1.06 — ST arms with no visual jump
          armScrollChapters()
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            window.setTimeout(() => ScrollTrigger.refresh(), 180)
          })
        }

        const openCurtain = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: finishIntro,
        })

        openCurtain
          .to(introGo, { autoAlpha: 0, y: -8, duration: 0.35, ease: 'power2.in' }, 0)
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

        const revealMark = gsap.timeline({ defaults: { ease: 'power3.out' } })
        revealMark
          .to(introWord, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power4.out' }, 0.2)
          .to(introRule, { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0.85)
          .to(introGo, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 1.15)

        const startHeroMedia = () => {
          const video = heroVideoRef.current
          if (!video) return
          // Drive the element directly during the curtain — no React re-render yet
          heroUnlockedRef.current = true
          video.playsInline = true
          video.volume = 1
          // Mobile browsers block unmuted autoplay — start muted there, sound on desktop
          const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
          if (mobile) {
            video.muted = true
            void video.play().catch(() => {})
            return
          }
          video.muted = false
          if (video.paused) {
            void video.play().catch(() => {
              video.muted = true
              void video.play().catch(() => {})
            })
          }
        }

        // Warm the decoder behind the curtains so open doesn't hitch on first frames
        const warmVideo = heroVideoRef.current
        if (warmVideo) {
          warmVideo.muted = true
          warmVideo.playsInline = true
          const prime = () => {
            void warmVideo.play().then(() => {
              warmVideo.pause()
              try {
                warmVideo.currentTime = 0
              } catch {
                /* ignore */
              }
            }).catch(() => {})
          }
          if (warmVideo.readyState >= 2) prime()
          else warmVideo.addEventListener('loadeddata', prime, { once: true })
        }

        const onProceed = () => {
          introGo.disabled = true
          startHeroMedia()
          openCurtain.play(0)
        }

        introGo.addEventListener('click', onProceed)
        disposers.push(() => introGo.removeEventListener('click', onProceed))
        disposers.push(() => {
          revealMark.kill()
          openCurtain.kill()
          unlockScroll()
          lenis?.start()
        })
      }

      function armHeroToViniEscort() {
        // Desktop only — on mobile the forced escort feels sticky and fights native scroll
        if (reduce || heroEscortArmed) return
        if (window.matchMedia('(max-width: 767px)').matches) return
        const vini = root.current?.querySelector<HTMLElement>('#vini')
        const hero = root.current?.querySelector<HTMLElement>("[data-chapter='hero']")
        if (!vini || !hero) return
        heroEscortArmed = true

        let locking = false
        let unlockTimer = 0

        // Ease-out quart — long decelerate, no snap at the end
        const softEase = (t: number) => 1 - Math.pow(1 - t, 4)
        const escortDuration = 2.55

        const zone = () => {
          const viniTop = vini.getBoundingClientRect().top
          const vh = window.innerHeight
          return {
            onHero: viniTop > vh * 0.42,
            approachingHero:
              viniTop < vh * 0.72 && viniTop > -vh * 0.12 && window.scrollY > 24,
          }
        }

        const unlockEscort = () => {
          locking = false
          if (unlockTimer) {
            window.clearTimeout(unlockTimer)
            unlockTimer = 0
          }
        }

        const escortTo = (target: HTMLElement | number) => {
          if (locking) return
          locking = true
          const lenis = window.__lenis

          if (unlockTimer) window.clearTimeout(unlockTimer)
          unlockTimer = window.setTimeout(unlockEscort, escortDuration * 1000 + 120)

          if (lenis) {
            lenis.scrollTo(target, {
              offset: 0,
              duration: escortDuration,
              easing: softEase,
              lock: true,
              onComplete: unlockEscort,
            })
          } else if (typeof target === 'number') {
            window.scrollTo({ top: target, behavior: 'smooth' })
            unlockTimer = window.setTimeout(unlockEscort, 900)
          } else {
            target.scrollIntoView({ behavior: 'smooth' })
            unlockTimer = window.setTimeout(unlockEscort, 900)
          }
        }

        const onWheel = (e: WheelEvent) => {
          if (locking) {
            e.preventDefault()
            e.stopImmediatePropagation()
            return
          }
          const { onHero, approachingHero } = zone()

          if (e.deltaY > 18 && onHero) {
            e.preventDefault()
            e.stopImmediatePropagation()
            escortTo(vini)
            return
          }

          if (e.deltaY < -18 && approachingHero) {
            e.preventDefault()
            e.stopImmediatePropagation()
            escortTo(hero)
          }
        }

        window.addEventListener('wheel', onWheel, { passive: false, capture: true })

        disposers.push(() => {
          if (unlockTimer) window.clearTimeout(unlockTimer)
          window.removeEventListener('wheel', onWheel, true)
        })
      }

      function armScrollChapters() {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px)', () => {
          const hero = root.current?.querySelector<HTMLElement>("[data-chapter='hero']")
          const heroImg = hero?.querySelector<HTMLElement>('[data-media]')
          const heroBrand = hero?.querySelector<HTMLElement>('[data-brand]')
          if (hero && heroImg && heroBrand) {
            // No pin: first scroll can escort straight to #vini
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.4,
                },
              })
              .fromTo(heroImg, { scale: 1.06 }, { scale: 1, ease: 'none' }, 0)
              .to(heroBrand, { yPercent: -8, ease: 'none' }, 0)
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
          const parallaxShots = [
            { id: '#visita', sel: '[data-visita-img]', from: -10, to: 10, scrub: 0.65 },
            { id: '#visione', sel: '[data-visione-img]', from: -12, to: 12, scrub: 0.7 },
            { id: '#degustazione', sel: '[data-degust-img]', from: -12, to: 12, scrub: 0.8 },
          ] as const

          parallaxShots.forEach(({ id, sel, from, to, scrub }) => {
            const section = root.current?.querySelector<HTMLElement>(id)
            const img = section?.querySelector<HTMLElement>(sel)
            if (!section || !img) return

            gsap.fromTo(
              img,
              { yPercent: from, force3D: true },
              {
                yPercent: to,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub,
                  invalidateOnRefresh: true,
                },
              },
            )
          })

          ScrollTrigger.refresh()
        }

        armHeroToViniEscort()
      }

      return () => {
        disposers.forEach((d) => d())
      }
    },
    { scope: root, dependencies: [showIntro] },
  )

  return (
    <div ref={root}>
      {showIntro && (
        <div
          data-intro
          className="fixed inset-0 z-[100] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('intro.aria')}
        >
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
                Altura
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
                Altura
                <span className="align-super text-[0.45em] tracking-normal">®</span>
              </p>
            </div>
          </div>

          {/* Center seam that marks the split */}
          <div className="pointer-events-none absolute left-1/2 top-[38%] z-20 h-[24%] -translate-x-1/2">
            <div data-intro-rule className="h-full w-px origin-center bg-gold/70" />
          </div>

          <div className="absolute left-1/2 top-[calc(50%+clamp(2.6rem,7vw,4.25rem))] z-30 -translate-x-1/2">
            <button
              type="button"
              data-intro-go
              className="font-body text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-ink underline decoration-ink/35 underline-offset-[7px] opacity-0 transition-opacity hover:opacity-55"
            >
              {t('intro.enter')}
            </button>
          </div>
        </div>
      )}

      <section id="top" data-chapter="hero" className="chapter">
        <div className="chapter-stage bg-ink">
          <div data-media className="chapter-media">
            {reduceMotion ? (
              <img
                src="/images/hero-clean.jpg"
                alt={t('hero.alt')}
                className="h-full w-full object-cover object-[center_40%]"
              />
            ) : (
              <video
                ref={heroVideoRef}
                className="h-full w-full object-cover object-center"
                src={heroSrc}
                autoPlay={heroUnlocked && !showIntro}
                muted={!heroSoundOn}
                loop
                playsInline
                preload="metadata"
                poster="/images/hero-clean.jpg"
                aria-hidden
              />
            )}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(26,31,36,0.62)_0%,rgba(26,31,36,0.28)_48%,rgba(26,31,36,0.18)_100%)]" />

          <div
            data-hero-boot
            className="relative z-10 flex h-full flex-col justify-between px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[5.5rem] text-paper sm:px-6 md:px-10 md:pb-14 md:pt-32 lg:px-14"
          >
            <p className="mx-auto max-w-[12rem] text-center font-body text-[0.65rem] leading-relaxed tracking-[0.14em] uppercase text-paper/70 md:text-[0.72rem]">
              {t('hero.location')}
            </p>

            <div data-brand className="mx-auto flex w-full max-w-[36rem] flex-col items-center text-center">
              <h1 className="font-body text-[clamp(2.85rem,14vw,9rem)] font-semibold uppercase leading-[0.86] tracking-[0.02em]">
                Altura
                <span className="align-super text-[0.45em] tracking-normal">®</span>
              </h1>

              <p className="mt-4 font-body text-[clamp(1.05rem,4.5vw,1.35rem)] font-medium italic leading-snug tracking-[0.02em] text-paper/90 md:mt-8">
                {t('hero.tagline')}
              </p>

              <p className="mt-4 max-w-sm font-body text-[0.9rem] leading-relaxed text-paper/75 md:mt-5 md:text-[0.95rem]">
                {t('hero.lead')}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-6 md:gap-x-8">
                <TextCta
                  href="#vini"
                  className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper underline decoration-paper/35 underline-offset-[6px] transition-opacity hover:opacity-70 md:text-[0.78rem]"
                >
                  {t('hero.ctaCollection')}
                </TextCta>
                <TextCta
                  href="#visita"
                  className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper/80 transition-opacity hover:opacity-100 md:text-[0.78rem]"
                >
                  {t('hero.ctaVisit')}
                </TextCta>
              </div>
            </div>
          </div>

          {!reduceMotion && (
            <button
              type="button"
              onClick={toggleHeroSound}
              aria-pressed={heroSoundOn}
              aria-label={heroSoundOn ? t('hero.mute') : t('hero.unmute')}
              title={heroSoundOn ? t('hero.mute') : t('hero.unmute')}
              className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-5 z-20 flex h-9 w-9 items-center justify-center text-paper/55 transition-opacity duration-300 hover:opacity-100 sm:left-6 md:bottom-8 md:left-10 lg:left-14"
            >
              {heroSoundOn ? (
                <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden>
                  <path
                    d="M4 10v4h3.2L12 18.5V5.5L7.2 10H4z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.2 9.2a4.2 4.2 0 0 1 0 5.6M17.8 6.8a7.5 7.5 0 0 1 0 10.4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden>
                  <path
                    d="M4 10v4h3.2L12 18.5V5.5L7.2 10H4z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 9.5l4 4m0-4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </section>

      <section id="vini" data-chapter="vini" className="chapter">
        <div className="relative flex min-h-[100svh] flex-col overflow-visible bg-paper md:h-[100svh]">
          <div className="flex shrink-0 flex-col items-center gap-3 px-5 pb-4 pt-20 text-center md:px-8 md:pb-5 md:pt-16">
            <h2 className="font-body text-[clamp(1.65rem,6vw,2.8rem)] font-semibold tracking-tight">
              {t('vini.heading')}
            </h2>
            <p className="font-body text-sm text-ink-2 md:text-[0.95rem]">
              {t('vini.sub')}
            </p>
            <TextCta
              to="/catalogo"
              className="mt-1 font-body text-sm font-semibold underline decoration-ink/30 underline-offset-4 transition-opacity hover:opacity-70"
            >
              {t('vini.cta')}
            </TextCta>
          </div>

          <div className="grid min-h-[70svh] flex-1 grid-cols-2 md:min-h-0 md:grid-cols-4">
            {wines.map((w, i) => (
              <Link
                key={w.name}
                data-wine
                to="/catalogo"
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="anni" data-chapter="anni" className="chapter">
        <div className="bg-paper px-5 py-20 md:relative md:h-[100svh] md:overflow-hidden md:px-10 md:py-0">
          <div className="mx-auto flex h-full max-w-[1100px] flex-col items-center justify-center gap-10 md:gap-12">
            <p className="font-body text-sm text-ink-2">{t('anni.eyebrow')}</p>

            <div className="flex w-full flex-col items-center gap-10 md:gap-12">
              <article
                data-anno
                className="flex w-full max-w-[52rem] flex-col items-center gap-3 border-t border-line pt-5 text-center sm:flex-row sm:items-center sm:gap-10 sm:pt-6 sm:text-left md:gap-14"
              >
                <p className="shrink-0 font-body text-[clamp(2.6rem,12vw,5.5rem)] font-semibold leading-none tracking-tight sm:w-[7.5rem] sm:text-right md:w-[9.5rem]">
                  1972
                </p>
                <p className="max-w-md font-body text-[0.98rem] leading-relaxed text-ink-2 md:max-w-lg md:text-[1.05rem]">
                  {t('anni.1972')}
                </p>
              </article>

              <article
                data-anno
                className="flex w-full max-w-[52rem] flex-col items-center gap-3 border-t border-line pt-5 text-center sm:flex-row sm:items-center sm:gap-10 sm:pt-6 sm:text-left md:gap-14"
              >
                <p className="shrink-0 font-body text-[clamp(2.6rem,12vw,5.5rem)] font-semibold leading-none tracking-tight sm:w-[7.5rem] sm:text-right md:w-[9.5rem]">
                  2015
                </p>
                <p className="max-w-md font-body text-[0.98rem] leading-relaxed text-ink-2 md:max-w-lg md:text-[1.05rem]">
                  {t('anni.2015')}
                </p>
              </article>

              <article
                data-anno
                className="flex w-full max-w-[52rem] flex-col items-center gap-3 border-t border-line pt-5 text-center sm:flex-row sm:items-center sm:gap-10 sm:pt-6 sm:text-left md:gap-14"
              >
                <p className="shrink-0 font-body text-[clamp(2.6rem,12vw,5.5rem)] font-semibold leading-none tracking-tight sm:w-[7.5rem] sm:text-right md:w-[9.5rem]">
                  {t('anni.oggiLabel')}
                </p>
                <p className="max-w-md font-body text-[0.98rem] leading-relaxed text-ink-2 md:max-w-lg md:text-[1.05rem]">
                  {t('anni.oggi')}
                </p>
              </article>
            </div>
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
            alt={t('esperienze.alt')}
            className="h-full w-full object-cover object-[18%_42%] md:object-[center_40%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,31,36,0.1)_0%,rgba(26,31,36,0.25)_45%,rgba(26,31,36,0.72)_100%)] md:bg-[linear-gradient(180deg,rgba(26,31,36,0.15)_0%,rgba(26,31,36,0.55)_55%,rgba(26,31,36,0.78)_100%)]" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-start bg-ink px-5 pb-14 pt-10 text-left sm:px-6 md:min-h-[100svh] md:items-end md:justify-end md:bg-transparent md:px-10 md:pb-20 md:pt-32 md:text-right lg:px-14">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-paper/65">
            {t('esperienze.eyebrow')}
          </p>
          <h2 className="mt-4 max-w-[14ch] font-body text-[clamp(2.2rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-tight">
            {t('esperienze.heading')}
          </h2>
          <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-paper/75 md:text-[1rem]">
            {t('esperienze.body')}
          </p>
          <TextCta
            href="#visita"
            className="mt-8 font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-paper underline decoration-paper/35 underline-offset-[6px] transition-opacity hover:opacity-70 md:text-[0.78rem]"
          >
            {t('esperienze.cta')}
          </TextCta>
        </div>
      </section>

      <section id="visita" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1500px] lg:min-h-[100svh] lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 md:py-24 lg:order-1 lg:px-14 lg:py-28">
            <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              {t('visita.eyebrow')}
            </p>
            <h2 className="mt-4 max-w-[12ch] font-body text-[clamp(2rem,9vw,4.2rem)] font-semibold leading-[0.95] tracking-tight md:mt-5">
              {t('visita.heading')}
            </h2>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-6 md:text-[1rem]">
              {t('visita.body')}
            </p>
            <p className="mt-4 max-w-md font-display text-[1rem] italic leading-relaxed text-ink md:mt-5 md:text-[1.05rem]">
              {t('visita.quote')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-8">
              <TextCta
                href="/#visita"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60 md:text-[0.78rem]"
              >
                {t('visita.ctaBook')}
              </TextCta>
              <TextCta
                href="/#visita"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-100 md:text-[0.78rem]"
              >
                {t('visita.ctaMore')}
              </TextCta>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center px-4 pb-2 pt-10 sm:px-5 md:px-8 md:py-14 lg:order-2 lg:py-16 lg:pr-10">
            <div data-visita-frame className="relative w-full max-w-[520px] overflow-hidden">
              <img
                data-visita-img
                src="/images/picnic.jpg"
                alt={t('visita.alt')}
                className="h-auto w-full scale-[1.14] object-contain will-change-transform lg:max-h-[min(85vh,780px)] lg:w-auto"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="visione" className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1500px] lg:min-h-[100svh] lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 sm:px-6 md:px-10 md:py-24 lg:order-1 lg:px-14 lg:py-28">
            <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              {t('visione.eyebrow')}
            </p>
            <h2 className="mt-4 max-w-[12ch] font-body text-[clamp(2rem,9vw,4.2rem)] font-semibold leading-[0.95] tracking-tight md:mt-5">
              {t('visione.heading')}
            </h2>
            <p className="mt-5 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-6 md:text-[1rem]">
              {t('visione.body1')}
            </p>
            <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-ink-2 md:mt-5 md:text-[1rem]">
              {t('visione.body2')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-8">
              <TextCta
                href="#anni"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60 md:text-[0.78rem]"
              >
                {t('visione.ctaStory')}
              </TextCta>
              <TextCta
                href="#visita"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-100 md:text-[0.78rem]"
              >
                {t('visione.ctaVisit')}
              </TextCta>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center px-4 pb-2 pt-10 sm:px-5 md:px-8 md:py-14 lg:order-2 lg:py-16 lg:pr-10">
            <div data-visione-frame className="relative w-full max-w-[520px] overflow-hidden">
              <img
                data-visione-img
                src="/images/visione-uve.png"
                alt={t('visione.alt')}
                className="h-auto w-full scale-[1.14] object-contain will-change-transform lg:max-h-[min(85vh,780px)] lg:w-auto"
                decoding="async"
              />
            </div>
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
              alt={t('degustazione.alt')}
              width={1024}
              height={768}
              className="absolute left-0 top-[-12%] h-[124%] w-full object-cover will-change-transform"
              decoding="async"
            />
          </div>
        </div>

        <div className="mx-auto flex max-w-[40rem] flex-col items-center px-5 py-14 text-center sm:px-6 md:py-20">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
            {t('degustazione.eyebrow')}
          </p>
          <h2 className="mt-4 font-body text-[clamp(1.9rem,8vw,3.8rem)] font-semibold leading-[1.05] tracking-tight md:mt-5">
            {t('degustazione.heading')}
          </h2>
          <p className="mt-7 font-body text-[1rem] leading-relaxed text-ink-2">
            {t('degustazione.body1')}
          </p>
          <p className="mt-5 font-display text-[1.1rem] italic leading-relaxed text-ink">
            {t('degustazione.quote')}
          </p>
          <p className="mt-5 font-body text-[0.98rem] leading-relaxed text-ink-2">
            {t('degustazione.body2')}
          </p>
          <TextCta
            href="/#visita"
            className="mt-10 font-body text-[0.78rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60"
          >
            {t('degustazione.cta')}
          </TextCta>
        </div>
      </section>
    </div>
  )
}

