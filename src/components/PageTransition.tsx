import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ScrollStory } from './ScrollStory'
import { Catalog } from '../pages/Catalog'
import { Product } from '../pages/Product'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  return (
    <main>
      <ScrollStory />
    </main>
  )
}

const WINE_FILL =
  'linear-gradient(180deg, #6e2f2d 0%, #8a3d3a 28%, #5c2422 72%, #3d1716 100%)'

function isCatalogFamily(path: string) {
  return path === '/catalogo' || path.startsWith('/catalogo/')
}

/** Full wine wipe only between major sections — skip catalog ↔ product chatter */
function shouldSkipWineWipe(from: string, to: string) {
  return isCatalogFamily(from) && isCatalogFamily(to)
}

/** Tall, pour-like surface shapes (viewBox 0 0 2400 160 — double width for seamless drift) */
const WAVE_A =
  'M0,80 C200,20 350,150 550,70 C750,0 900,155 1150,75 C1350,10 1550,145 1750,65 C1950,5 2150,140 2400,80 L2400,160 L0,160 Z'
const WAVE_B =
  'M0,80 C180,145 400,5 580,95 C760,160 980,15 1180,85 C1380,150 1580,10 1780,90 C1980,155 2200,20 2400,80 L2400,160 L0,160 Z'
const WAVE_C =
  'M0,80 C220,40 380,130 560,55 C740,140 920,25 1120,100 C1320,20 1520,150 1720,60 C1920,130 2140,35 2400,80 L2400,160 L0,160 Z'

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
      window.dispatchEvent(new CustomEvent('grosjean:page-ready'))
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
      window.dispatchEvent(new CustomEvent('grosjean:page-ready'))
    }

    if (reduce) {
      finishSwap(location)
      return
    }

    // Catalog ↔ product: quick paper crossfade (~0.5s)
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
            // Another soft hop queued — restart soft path via effect won't re-fire;
            // finish immediately if still catalog family
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

      tl.to(soft, { autoAlpha: 1, duration: 0.22 }, 0)
        .add(() => finishSwap(next), 0.24)
        .to(soft, { autoAlpha: 0, duration: 0.28 }, 0.28)

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

      gsap.set(el, { autoAlpha: 1, pointerEvents: 'all', backgroundColor: '#5c2422' })
      gsap.set(liquid, { y: '100%', force3D: true, autoAlpha: 1 })
      gsap.set(veil, { autoAlpha: 0 })
      if (soft) gsap.set(soft, { autoAlpha: 0 })
      if (mark) gsap.set(mark, { autoAlpha: 0, scale: 0.96 })
      if (surface) gsap.set(surface, { x: 0, y: 0 })
      if (waveBack) gsap.set(waveBack, { attr: { d: WAVE_A } })
      if (waveMid) gsap.set(waveMid, { attr: { d: WAVE_C } })
      if (waveFront) gsap.set(waveFront, { attr: { d: WAVE_B } })
      if (sheen) gsap.set(sheen, { opacity: 0.12, xPercent: -20 })

      if (waveBack) waveTweens.current.push(churnWave(waveBack, { duration: 0.38 }))
      if (waveMid) waveTweens.current.push(churnWave(waveMid, { duration: 0.28, delay: 0.08 }))
      if (waveFront) waveTweens.current.push(churnWave(waveFront, { duration: 0.22, delay: 0.04 }))

      if (surface) {
        waveTweens.current.push(
          gsap
            .timeline({ repeat: -1 })
            .fromTo(surface, { x: '0%' }, { x: '-50%', duration: 1.15, ease: 'none' }),
        )
      }

      lenis?.stop()

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
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

      // 1) Wine rises with living surface
      tl.fromTo(
        liquid,
        { y: '100%' },
        { y: '-8%', duration: 0.85, force3D: true, ease: 'power3.inOut' },
        0,
      )

      if (surface) {
        tl.fromTo(
          surface,
          { y: 10 },
          { y: -6, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: 3 },
          0,
        )
      }
      if (sheen) {
        tl.to(sheen, { opacity: 0.22, xPercent: 28, duration: 0.85, ease: 'none' }, 0)
      }

      // 2) Solid veil seals the viewport (kills any top hairline), then mark
      tl.set(veil, { autoAlpha: 1 }, 0.78)
      if (mark) {
        tl.to(mark, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 0.82)
      }

      // 3) Swap under full cover
      tl.add(() => {
        displayPath.current = next.pathname
        setDisplayLocation(next)
        window.scrollTo(0, 0)
        lenis?.scrollTo(0, { immediate: true })
        window.dispatchEvent(new CustomEvent('grosjean:page-ready'))
      }, 1.05)

      // 4) Mark out, then pour away: unveil into draining liquid
      if (mark) {
        tl.to(mark, { autoAlpha: 0, scale: 0.98, duration: 0.2, ease: 'power2.in' }, 1.2)
      }

      tl.set(liquid, { y: '-8%' }, 1.35)
        .set(veil, { autoAlpha: 0 }, 1.35)
        .fromTo(
          liquid,
          { y: '-8%' },
          { y: '-115%', duration: 0.9, force3D: true, ease: 'power3.inOut' },
          1.35,
        )

      if (surface) {
        tl.to(surface, { y: 4, duration: 0.9, ease: 'sine.inOut' }, 1.35)
      }
      if (sheen) {
        tl.to(sheen, { opacity: 0.06, xPercent: 75, duration: 0.9, ease: 'none' }, 1.35)
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
                className="block h-[min(18vw,7.5rem)] w-full"
                viewBox="0 0 2400 160"
                preserveAspectRatio="none"
                aria-hidden
              >
                {/* Solid bed so wave troughs never flash paper underneath */}
                <rect width="2400" height="160" fill="#5c2422" />
                <path ref={waveBackRef} d={WAVE_A} fill="#4a1c1a" />
                <path ref={waveMidRef} d={WAVE_C} fill="#6e2f2d" />
                <path ref={waveFrontRef} d={WAVE_B} fill="#8a3d3a" />
                <path
                  d="M0,78 C200,35 400,115 600,70 C800,30 1000,110 1200,72 C1400,38 1600,108 1800,68 C2000,32 2200,100 2400,78"
                  fill="none"
                  stroke="rgba(110,47,45,0.55)"
                  strokeWidth="3"
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
            className="pointer-events-none absolute inset-y-[8%] left-[-20%] w-[55%]"
            style={{
              opacity: 0.12,
              background:
                'linear-gradient(105deg, transparent 0%, rgba(138,61,58,0.35) 42%, rgba(207,181,56,0.06) 58%, transparent 78%)',
            }}
          />
        </div>

        {/* Soft paper veil — catalog ↔ product */}
        <div
          ref={softVeilRef}
          className="absolute inset-0 bg-paper"
          style={{ opacity: 0, visibility: 'hidden' }}
        />

        {/* Full-bleed seal — no transforms, oversized so no edge hairline */}
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
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-body text-[clamp(1.5rem,4.5vw,2.4rem)] font-semibold uppercase tracking-[0.08em] text-paper"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          Grosjean
          <span className="align-super text-[0.45em] tracking-normal">®</span>
        </p>
      </div>
    </>
  )
}
