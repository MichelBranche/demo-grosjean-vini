import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

function isTouchScrollDevice() {
  return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // Native touch scroll only on mobile — Lenis + momentum flings fight and “teleport” up
    if (isTouchScrollDevice()) {
      const onScroll = () => ScrollTrigger.update()
      window.addEventListener('scroll', onScroll, { passive: true })

      // iOS/Android URL-bar show/hide fires resize with width unchanged — refreshing
      // ScrollTrigger mid-fling jumps the page. Only refresh on real layout width changes.
      let lastW = window.innerWidth
      const onResize = () => {
        const w = window.innerWidth
        if (w === lastW) return
        lastW = w
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }

    const lenis = new Lenis({
      duration: 1.55,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.35,
      syncTouch: false,
      wrapper: window,
      content: document.documentElement,
      // Softer ease-out — less “snap”, fewer mid-scroll fights with the wheel
      easing: (t) => 1 - Math.pow(1 - t, 3.2),
    })

    lenis.on('scroll', ScrollTrigger.update)
    window.__lenis = lenis

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    let lastW = window.innerWidth
    const onResize = () => {
      const w = window.innerWidth
      if (w === lastW) return
      lastW = w
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(tick)
      delete window.__lenis
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return <>{children}</>
}
