import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart, formatPrice } from '../cart/CartProvider'
import { useI18n } from '../i18n/I18nProvider'
import { TextCta } from '../components/TextCta'

type PayMethod = 'card' | 'paypal' | 'transfer'

export function Checkout() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { items, total, count, clear, setOpen } = useCart()
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form')
  const [pay, setPay] = useState<PayMethod>('card')
  const [orderId, setOrderId] = useState('')
  const [snapshot, setSnapshot] = useState<{
    items: typeof items
    total: number
    count: number
  } | null>(null)

  const summary = snapshot ?? { items, total, count }

  const payOptions = useMemo(
    () =>
      [
        { id: 'card' as const, label: t('checkout.payCard') },
        { id: 'paypal' as const, label: t('checkout.payPaypal') },
        { id: 'transfer' as const, label: t('checkout.payTransfer') },
      ] as const,
    [t],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0 || step !== 'form') return

    setSnapshot({ items: [...items], total, count })
    setStep('paying')
    setOpen(false)

    const id = `ALT-${Date.now().toString(36).toUpperCase()}`
    window.setTimeout(() => {
      setOrderId(id)
      clear()
      setStep('done')
    }, 1600)
  }

  if (items.length === 0 && step === 'form') {
    return <Navigate to="/catalogo" replace />
  }

  return (
    <div className="bg-paper text-ink">
      <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-28 md:px-10 md:pb-14 md:pt-32 lg:px-14">
        <TextCta
          to="/catalogo"
          className="font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2 transition-opacity hover:opacity-55"
        >
          {t('checkout.back')}
        </TextCta>

        <div className="mt-8 max-w-2xl">
          <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
            {t('checkout.eyebrow')}
          </p>
          <h1 className="mt-4 font-body text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[0.95] tracking-tight">
            {step === 'done' ? t('checkout.successTitle') : t('checkout.title')}
          </h1>
          <p className="mt-5 font-body text-[0.95rem] leading-relaxed text-ink-2 md:text-[1rem]">
            {step === 'done' ? t('checkout.successLead') : t('checkout.intro')}
          </p>
        </div>
      </section>

      {step === 'done' ? (
        <section className="mx-auto max-w-[1400px] px-5 pb-28 md:px-10 lg:px-14">
          <div className="mx-auto max-w-xl border-t border-line pt-10 text-center">
            <p className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              {t('checkout.orderRef')}
            </p>
            <p className="mt-3 font-body text-[1.5rem] font-semibold tracking-tight">{orderId}</p>
            <p className="mx-auto mt-6 max-w-md font-body text-[0.92rem] leading-relaxed text-ink-2">
              {t('checkout.successBody')}
            </p>

            <ul className="mx-auto mt-10 max-w-md divide-y divide-line text-left">
              {summary.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="font-body text-[0.9rem]">
                    {item.name}{' '}
                    <span className="text-ink-2">×{item.qty}</span>
                  </span>
                  <span className="font-body text-[0.9rem] text-ink-2">
                    {formatPrice(item.priceValue * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-4 flex max-w-md items-baseline justify-between border-t border-line pt-4">
              <span className="font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2">
                {t('cart.total')}
              </span>
              <span className="font-body text-[1.2rem] font-semibold">
                {formatPrice(summary.total)}
              </span>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <TextCta
                to="/catalogo"
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-60"
              >
                {t('checkout.continueShop')}
              </TextCta>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-100"
              >
                {t('checkout.home')}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:px-10 lg:gap-20 lg:px-14">
          <form onSubmit={onSubmit} className="min-w-0">
            <fieldset disabled={step === 'paying'} className="space-y-10 disabled:opacity-70">
              <div>
                <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
                  {t('checkout.shipTitle')}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label={t('checkout.name')} name="name" autoComplete="name" required className="sm:col-span-2" />
                  <Field label={t('checkout.email')} name="email" type="email" autoComplete="email" required />
                  <Field label={t('checkout.phone')} name="phone" type="tel" autoComplete="tel" />
                  <Field label={t('checkout.address')} name="address" autoComplete="street-address" required className="sm:col-span-2" />
                  <Field label={t('checkout.city')} name="city" autoComplete="address-level2" required />
                  <Field label={t('checkout.zip')} name="zip" autoComplete="postal-code" required />
                  <Field
                    label={t('checkout.country')}
                    name="country"
                    autoComplete="country-name"
                    defaultValue="Italia"
                    required
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
                  {t('checkout.payTitle')}
                </h2>
                <div className="mt-5 space-y-0 border-y border-line">
                  {payOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-line py-4 last:border-b-0"
                    >
                      <input
                        type="radio"
                        name="pay"
                        value={opt.id}
                        checked={pay === opt.id}
                        onChange={() => setPay(opt.id)}
                        className="h-4 w-4 accent-[var(--ink)]"
                      />
                      <span className="font-body text-[0.95rem]">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-4 font-body text-[0.82rem] leading-relaxed text-ink-2">
                  {t('checkout.payNote')}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-ink px-6 py-4 font-body text-[0.78rem] font-semibold tracking-[0.14em] uppercase text-paper transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-[16rem]"
              >
                {step === 'paying' ? t('checkout.processing') : t('checkout.confirm')}
              </button>
            </fieldset>
          </form>

          <aside className="md:sticky md:top-28 md:self-start">
            <h2 className="font-body text-[0.72rem] tracking-[0.16em] uppercase text-ink-2">
              {t('checkout.summary')}
            </h2>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {summary.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="flex h-20 w-14 shrink-0 items-end justify-center bg-paper-2/60">
                    {item.img ? (
                      <img src={item.img} alt="" className="max-h-full max-w-full object-contain" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[0.9rem] font-semibold leading-snug">{item.name}</p>
                    <p className="mt-1 font-body text-[0.78rem] text-ink-2">
                      {item.price} · ×{item.qty}
                    </p>
                  </div>
                  <p className="shrink-0 font-body text-[0.9rem]">
                    {formatPrice(item.priceValue * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between border-t border-line py-5">
              <span className="font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink-2">
                {t('cart.total')}
              </span>
              <span className="font-body text-[1.25rem] font-semibold tracking-tight">
                {formatPrice(summary.total)}
              </span>
            </div>
            <p className="font-body text-[0.78rem] leading-relaxed text-ink-2">
              {t('checkout.demoBanner')}
            </p>
            <Link
              to="/catalogo"
              className="mt-4 inline-block font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-2 transition-opacity hover:opacity-55"
            >
              {t('checkout.editCart')}
            </Link>
          </aside>
        </section>
      )}
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  defaultValue,
  className = '',
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  defaultValue?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-body text-[0.68rem] tracking-[0.12em] uppercase text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-2.5 font-body text-[0.95rem] text-ink outline-none transition-[border-color] placeholder:text-ink/30 focus:border-ink"
      />
    </label>
  )
}
