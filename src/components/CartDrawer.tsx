import { useEffect } from 'react'
import { useCart, formatPrice } from '../cart/CartProvider'
import { useI18n } from '../i18n/I18nProvider'

export function CartDrawer() {
  const { t } = useI18n()
  const { items, open, setOpen, total, setQty, removeItem, clear, count } = useCart()

  useEffect(() => {
    if (!open) return
    const lenis = window.__lenis
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open, setOpen])

  return (
    <div
      className={`fixed inset-0 z-[130] overflow-hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/35 transition-opacity duration-400 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={t('cart.close')}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-paper text-ink shadow-[-12px_0_40px_rgba(26,31,36,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-5 md:px-6">
          <div>
            <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-2">
              {t('cart.eyebrow')}
            </p>
            <h2 className="mt-1 font-body text-[1.35rem] font-semibold tracking-tight">
              {t('cart.title')}
              {count > 0 && (
                <span className="ml-2 font-body text-[0.95rem] font-normal text-ink-2">
                  ({count})
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="nav-icon text-ink"
            aria-label={t('cart.close')}
          >
            <svg viewBox="0 0 24 24" className="h-[1.25rem] w-[1.25rem]" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
          {items.length === 0 ? (
            <p className="py-16 text-center font-body text-[0.95rem] text-ink-2">{t('cart.empty')}</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="flex h-24 w-16 shrink-0 items-end justify-center bg-paper-2/60">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[0.92rem] font-semibold leading-snug tracking-tight">
                      {item.name}
                    </p>
                    <p className="mt-1 font-body text-[0.82rem] text-ink-2">{item.price}</p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center font-body text-ink transition-opacity hover:opacity-55"
                          aria-label={t('cart.decrease')}
                          onClick={() => setQty(item.id, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-[1.75rem] text-center font-body text-[0.9rem]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center font-body text-ink transition-opacity hover:opacity-55"
                          aria-label={t('cart.increase')}
                          onClick={() => setQty(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-55"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-5 py-5 md:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2">
              {t('cart.total')}
            </span>
            <span className="font-body text-[1.25rem] font-semibold tracking-tight">
              {formatPrice(total)}
            </span>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => {
              /* checkout disabled in demo */
            }}
            className="mt-5 w-full bg-ink px-4 py-3.5 font-body text-[0.78rem] tracking-[0.14em] uppercase text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            title={t('demo.disabled')}
          >
            {t('cart.checkout')}
          </button>
          <p className="mt-3 text-center font-body text-[0.78rem] leading-snug text-ink-2">
            {t('cart.demoNote')}
          </p>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full py-2 font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-55"
            >
              {t('cart.clear')}
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}
