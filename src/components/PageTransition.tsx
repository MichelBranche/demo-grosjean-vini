import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ScrollStory } from './ScrollStory'
import { Catalog } from '../pages/Catalog'
import { Product } from '../pages/Product'
import { Checkout } from '../pages/Checkout'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  return (
    <main>
      <ScrollStory />
    </main>
  )
}

/** Deep Bordeaux — quiet luxury, not candy red */
const WINE_FILL =
  'linear-gradient(165deg, #5a2624 0%, #6b2e2b 22%, #4a1f1d 58%, #2e1211 100%)'
const WINE_SOLID = '#4a1f1d'

function isCatalogFamily(path: string) {
  return path === '/catalogo' || path.startsWith('/catalogo/')
}

/** Full wine wipe only between major sections — skip catalog ↔ product chatter */
function shouldSkipWineWipe(from: string, to: string) {
  return isCatalogFamily(from) && isCatalogFamily(to)
}

/** Soft meniscus — low amplitude, editorial pour (viewBox 0 0 2400 160) */
const WAVE_A =
  'M0,88 C280,62 480,118 760,84 C1040,52 1280,112 1560,80 C1840,50 2120,108 2400,86 L2400,160 L0,160 Z'
const WAVE_B =
  'M0,86 C260,112 520,58 800,90 C1080,118 1340,56 1620,88 C1900,116 2160,60 2400,84 L2400,160 L0,160 Z'
const WAVE_C =
  'M0,90 C300,70 540,108 820,78 C1100,50 1360,114 1640,82 C1920,54 2180,104 2400,88 L2400,160 L0,160 Z'

function churnWave(
  path: SVGPathElement,
  opts: { duration: number; delay?: number; repeat?: number },
) {
  return gsap
    .timeline({ repeat: opts.repeat ?? -1, delay: opts.delay ?? 0 })
    .to(path, { attr: { d: WAVE_B }, duration: opts.duration, ease: 'sine.inOut' })
    .to(path, { attr: { d: WAVE_C }, duration: opts.duration, ease: 'sine.inOut' })
    .to(path, { attr: { d: WAVE_A }, duration: opts.duration, ease: 'sine.inOut' })
}

export function PageTransition() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const displayPath = useRef(location.pathname)
  const root = useRef<HTMLDivElement>(null)
  const liquidRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const softVeilRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLParagraphElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const waveBackRef = useRef<SVGPathElement>(null)
  const waveMidRef = useRef<SVGPathElement>(null)
  const waveFrontRef = useRef<SVGPathElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const busy = useRef(false)
  const pending = useRef(location)
  const tween = useRef<gsap.core.Timeline | null>(null)
  const waveTweens = useRef<gsap.core.Timeline[]>([])

  const killWaves = () => {
    waveTweens.current.forEach((t) => t.kill())
    waveTweens.current = []
  }

  useEffect(() => {
    const el = root.current
    const liquid = liquidRef.current
    const veil = veilRef.current
    const soft = softVeilRef.current
    const mark = markRef.current
    if (el) gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' })
    if (liquid) gsap.set(liquid, { y: '100%' })
    if (veil) gsap.set(veil, { autoAlpha: 0 })
    if (soft) gsap.set(soft, { autoAlpha: 0 })
    if (mark) gsap.set(mark, { autoAlpha: 0 })

    return () => {
      tween.current?.kill()
      killWaves()
      busy.current = false
      window.__lenis?.start()
    }
  }, [])

  useEffect(() => {
    pending.current = location

    if (first.current) {
      first.current = false
      displayPath.current = location.pathname
      setDisplayLocation(location)
      return
    }

    if (location.pathname === displayPath.current) {
      setDisplayLocation(location)
      window.dispatchEvent(new CustomEvent('altura:page-ready'))
      return
    }

    if (busy.current) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const softNav = shouldSkipWineWipe(displayPath.current, location.pathname)

    const finishSwap = (next: typeof location) => {
      displayPath.current = next.pathname
      setDisplayLocation(next)
      window.scrollTo(0, 0)
      window.__lenis?.scrollTo(0, { immediate: true })
      window.dispatchEvent(new CustomEvent('altura:page-ready'))
    }

    if (reduce) {
      finishSwap(location)
      return
    }

    // Catalog ↔ product: quiet paper crossfade
    if (softNav) {
      const el = root.current
      const soft = softVeilRef.current
      const liquid = liquidRef.current
      const veil = veilRef.current
      const mark = markRef.current
      if (!el || !soft) {
        finishSwap(location)
        return
      }

      busy.current = true
      const lenis = window.__lenis
      tween.current?.kill()
      killWaves()

      gsap.set(el, { autoAlpha: 1, pointerEvents: 'all', backgroundColor: 'transparent' })
      if (liquid) gsap.set(liquid, { autoAlpha: 0 })
      if (veil) gsap.set(veil, { autoAlpha: 0 })
      if (mark) gsap.set(mark, { autoAlpha: 0 })
      gsap.set(soft, { autoAlpha: 0 })

      lenis?.stop()

      const next = location
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          const latest = pending.current
          if (latest.pathname !== displayPath.current) {
            if (shouldSkipWineWipe(displayPath.current, latest.pathname)) {
              finishSwap(latest)
            }
          }
          busy.current = false
          gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' })
          gsap.set(soft, { autoAlpha: 0 })
          if (liquid) gsap.set(liquid, { autoAlpha: 1, y: '100%' })
          lenis?.start()
          window.setTimeout(() => ScrollTrigger.refresh(), 40)
        },
      })
      tween.current = tl

      tl.to(soft, { autoAlpha: 1, duration: 0.28 }, 0)
        .add(() => finishSwap(next), 0.3)
        .to(soft, { autoAlpha: 0, duration: 0.34 }, 0.34)

      return
    }

    const el = root.current
    const liquid = liquidRef.current
    const veil = veilRef.current
    const mark = markRef.current
    const soft = softVeilRef.current
    const surface = surfaceRef.current
    const waveBack = waveBackRef.current
    const waveMid = waveMidRef.current
    const waveFront = waveFrontRef.current
    const sheen = sheenRef.current
    if (!el || !liquid || !veil) {
      finishSwap(location)
      return
    }

    busy.current = true
    const lenis = window.__lenis

    const run = (next: typeof location) => {
      tween.current?.kill()
      killWaves()

      gsap.set(el, { autoAlpha: 1, pointerEvents: 'all', backgroundColor: WINE_SOLID })
      gsap.set(liquid, { y: '100%', force3D: true, autoAlpha: 1 })
      gsap.set(veil, { autoAlpha: 0 })
      if (soft) gsap.set(soft, { autoAlpha: 0 })
      if (mark) gsap.set(mark, { autoAlpha: 0, y: 10, letterSpacing: '0.14em' })
      if (surface) gsap.set(surface, { x: 0, y: 0 })
      if (waveBack) gsap.set(waveBack, { attr: { d: WAVE_A } })
      if (waveMid) gsap.set(waveMid, { attr: { d: WAVE_C } })
      if (waveFront) gsap.set(waveFront, { attr: { d: WAVE_B } })
      if (sheen) gsap.set(sheen, { opacity: 0.06, xPercent: -12 })

      // Slow, almost still surface — class over spectacle
      if (waveBack) waveTweens.current.push(churnWave(waveBack, { duration: 1.1 }))
      if (waveMid) waveTweens.current.push(churnWave(waveMid, { duration: 0.85, delay: 0.15 }))
      if (waveFront) waveTweens.current.push(churnWave(waveFront, { duration: 0.7, delay: 0.08 }))

      if (surface) {
        waveTweens.current.push(
          gsap
            .timeline({ repeat: -1 })
            .fromTo(surface, { x: '0%' }, { x: '-50%', duration: 3.4, ease: 'none' }),
        )
      }

      lenis?.stop()

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          const latest = pending.current
          if (latest.pathname !== displayPath.current) {
            run(latest)
            return
          }
          busy.current = false
          killWaves()
          gsap.set(el, { autoAlpha: 0, pointerEvents: 'none', backgroundColor: 'transparent' })
          gsap.set(liquid, { y: '100%', autoAlpha: 1 })
          gsap.set(veil, { autoAlpha: 0 })
          if (mark) gsap.set(mark, { autoAlpha: 0 })
          if (surface) gsap.set(surface, { x: 0, y: 0 })
          lenis?.start()
          window.setTimeout(() => ScrollTrigger.refresh(), 60)
        },
      })
      tween.current = tl

      // 1) Deliberate pour rises
      tl.fromTo(
        liquid,
        { y: '100%' },
        { y: '-6%', duration: 1.2, force3D: true, ease: 'power2.inOut' },
        0,
      )

      if (sheen) {
        tl.to(sheen, { opacity: 0.14, xPercent: 18, duration: 1.2, ease: 'sine.inOut' }, 0)
      }

      // 2) Seal + wordmark — held, not flashed
      tl.set(veil, { autoAlpha: 1 }, 1.05)
      if (mark) {
        tl.to(
          mark,
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: '0.1em',
            duration: 0.55,
            ease: 'power3.out',
          },
          1.12,
        )
      }

      // 3) Quiet beat, then swap under full cover
      tl.add(() => {
        displayPath.current = next.pathname
        setDisplayLocation(next)
        window.scrollTo(0, 0)
        lenis?.scrollTo(0, { immediate: true })
        window.dispatchEvent(new CustomEvent('altura:page-ready'))
      }, 1.65)

      // 4) Mark dissolves, wine withdraws upward
      if (mark) {
        tl.to(
          mark,
          { autoAlpha: 0, y: -6, letterSpacing: '0.16em', duration: 0.35, ease: 'power2.in' },
          1.85,
        )
      }

      tl.set(liquid, { y: '-6%' }, 2.1)
        .set(veil, { autoAlpha: 0 }, 2.1)
        .fromTo(
          liquid,
          { y: '-6%' },
          { y: '-115%', duration: 1.15, force3D: true, ease: 'power2.inOut' },
          2.1,
        )

      if (sheen) {
        tl.to(sheen, { opacity: 0.04, xPercent: 42, duration: 1.15, ease: 'sine.inOut' }, 2.1)
      }
    }

    run(location)
  }, [location])

  return (
    <>
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route
          path="/catalogo"
          element={
            <main>
              <Catalog />
            </main>
          }
        />
        <Route
          path="/catalogo/:slug"
          element={
            <main>
              <Product />
            </main>
          }
        />
        <Route
          path="/checkout"
          element={
            <main>
              <Checkout />
            </main>
          }
        />
      </Routes>

      <div
        ref={root}
        className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
        style={{ visibility: 'hidden', opacity: 0 }}
        aria-hidden
      >
        <div
          ref={liquidRef}
          data-liquid
          className="absolute inset-x-0 -top-4 h-[calc(125%+2rem)] will-change-transform"
          style={{ transform: 'translate3d(0, 100%, 0)' }}
        >
          <div
            className="absolute left-0 top-0 w-full overflow-hidden"
            style={{ transform: 'translateY(-100%)' }}
          >
            <div ref={surfaceRef} className="w-[200%] max-w-none will-change-transform">
              <svg
                className="block h-[min(12vw,5.5rem)] w-full"
                viewBox="0 0 2400 160"
                preserveAspectRatio="none"
                aria-hidden
              >
                <rect width="2400" height="160" fill={WINE_SOLID} />
                <path ref={waveBackRef} d={WAVE_A} fill="#3a1816" />
                <path ref={waveMidRef} d={WAVE_C} fill="#522422" />
                <path ref={waveFrontRef} d={WAVE_B} fill="#6a322f" />
                <path
                  d="M0,86 C300,64 560,108 840,82 C1120,58 1400,106 1680,80 C1960,56 2200,98 2400,84"
                  fill="none"
                  stroke="rgba(255,245,235,0.08)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div
            className="absolute inset-x-0 -top-1 bottom-0"
            style={{ background: WINE_FILL }}
          />

          <div
            ref={sheenRef}
            data-sheen
            className="pointer-events-none absolute inset-y-[10%] left-[-15%] w-[48%]"
            style={{
              opacity: 0.06,
              background:
                'linear-gradient(108deg, transparent 0%, rgba(255,248,240,0.07) 45%, transparent 72%)',
            }}
          />
        </div>

        <div
          ref={softVeilRef}
          className="absolute inset-0 bg-paper"
          style={{ opacity: 0, visibility: 'hidden' }}
        />

        <div
          ref={veilRef}
          className="absolute"
          style={{
            top: '-12px',
            right: '-12px',
            bottom: '-12px',
            left: '-12px',
            background: WINE_FILL,
            opacity: 0,
            visibility: 'hidden',
          }}
        />

        <p
          ref={markRef}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-body text-[clamp(1.35rem,3.8vw,2rem)] font-semibold uppercase tracking-[0.1em] text-paper/95"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          Altura
          <span className="align-super text-[0.42em] tracking-normal">®</span>
        </p>
      </div>
    </>
  )
}
