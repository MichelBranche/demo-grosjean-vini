import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nProvider'
import { CartProvider } from './cart/CartProvider'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SmoothScroll } from './components/SmoothScroll'
import { PageTransition } from './components/PageTransition'
import { CartDrawer } from './components/CartDrawer'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')

    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (!el) return false
      const lenis = window.__lenis
      if (lenis) lenis.scrollTo(el, { offset: -20 })
      else el.scrollIntoView({ behavior: 'smooth' })
      return true
    }

    if (scrollToTarget()) return

    const onReady = () => {
      window.setTimeout(scrollToTarget, 80)
    }
    window.addEventListener('grosjean:page-ready', onReady)
    const fallback = window.setTimeout(scrollToTarget, 1600)
    return () => {
      window.removeEventListener('grosjean:page-ready', onReady)
      window.clearTimeout(fallback)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <CartProvider>
          <SmoothScroll>
            <ScrollToHash />
            <Header />
            <PageTransition />
            <Footer />
            <CartDrawer />
          </SmoothScroll>
        </CartProvider>
      </BrowserRouter>
    </I18nProvider>
  )
}
