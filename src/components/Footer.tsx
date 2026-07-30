import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/grosjeanvins/',
    path: 'M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/grosjean.vins/',
    path: 'M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.2c-2.1 0-2.4 0-3.2.1-.8 0-1.4.2-1.9.4a3.9 3.9 0 0 0-1.4 1.4c-.2.5-.3 1.1-.4 1.9-.1.8-.1 1.1-.1 3.2s0 2.4.1 3.2c0 .8.2 1.4.4 1.9.3.5.7 1 1.4 1.4.5.2 1.1.3 1.9.4.8.1 1.1.1 3.2.1s2.4 0 3.2-.1c.8 0 1.4-.2 1.9-.4a3.9 3.9 0 0 0 1.4-1.4c.2-.5.3-1.1.4-1.9.1-.8.1-1.1.1-3.2s0-2.4-.1-3.2c0-.8-.2-1.4-.4-1.9a3.9 3.9 0 0 0-1.4-1.4c-.5-.2-1.1-.3-1.9-.4-.8-.1-1.1-.1-3.2-.1zm0 1.5c2.1 0 2.3 0 3.1.1.8 0 1.2.2 1.5.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.2.7.3 1.5.1.8.1 1 .1 3.1s0 2.3-.1 3.1c0 .8-.2 1.2-.3 1.5-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.7.2-1.5.3-.8.1-1 .1-3.1.1s-2.3 0-3.1-.1c-.8 0-1.2-.2-1.5-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.1-.3-.2-.7-.3-1.5-.1-.8-.1-1-.1-3.1s0-2.3.1-3.1c0-.8.2-1.2.3-1.5.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.7-.2 1.5-.3.8-.1 1-.1 3.1-.1z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UClXTQFWf8YgrEcyBdRzpsSA',
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@grosjean.vins',
    path: 'M19.6 8.4c-1.5-.1-2.9-.7-4-1.6v7.3a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 1 0 2 2.7V2.5h2.8c.1 1.6.8 3.1 1.9 4.2a5.8 5.8 0 0 0 3.1 1.5v2.9a8.5 8.5 0 0 1-1-.2z',
  },
]

function FooterHeading({ children }: { children: string }) {
  return (
    <h3 className="font-display text-[0.68rem] font-medium tracking-[0.16em] uppercase text-ink">
      {children}
    </h3>
  )
}

function FooterLink({ href, children }: { href: string; children: string }) {
  const external = href.startsWith('http') || href.startsWith('mailto:')
  const className =
    'block font-body text-[0.95rem] leading-[1.7] text-ink transition-opacity hover:opacity-55'

  if (external) {
    return (
      <a
        href={href}
        className={className}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

function Accordion({
  title,
  children,
  open,
  onToggle,
}: {
  title: string
  children: ReactNode
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <FooterHeading>{title}</FooterHeading>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`h-3.5 w-3.5 shrink-0 stroke-ink stroke-[1.5] transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

function SocialRow() {
  return (
    <ul className="flex items-center justify-center gap-4">
      {socialLinks.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/30 text-ink transition-opacity hover:opacity-50"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
              <path d={s.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}

function DrinkMark({ className = 'h-8' }: { className?: string }) {
  const { t } = useI18n()

  return (
    <div
      className="inline-flex items-center gap-2.5 text-ink"
      role="img"
      aria-label={t('footer.drinkAria')}
    >
      <svg
        viewBox="0 0 48 48"
        className={`w-auto shrink-0 ${className}`}
        fill="none"
        aria-hidden
      >
        <circle cx="24" cy="24" r="21.5" stroke="currentColor" strokeWidth="1.75" />
        <path d="M10 38 38 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <g fill="currentColor">
          <circle cx="20.5" cy="13" r="3.1" />
          <path d="M15.2 17.2c0-.7.55-1.2 1.35-1.45.9-.3 2.3-.4 4-.4s3.1.1 4 .4c.8.25 1.35.75 1.35 1.45v2.4c0 .85-.5 1.55-1.2 1.95.95.7 1.85 1.85 2.25 3.35.55 2.05 0 3.85-1.15 4.55-.3.2-.7.2-1 0l-1.3-.75v5.6c0 .7-.55 1.25-1.25 1.25h-1.6c-.7 0-1.25-.55-1.25-1.25v-5.45l-1.4.7c-.3.15-.7.15-1 0-1.05-.65-1.55-2.4-1-4.35.4-1.4 1.2-2.5 2.1-3.2-.75-.4-1.25-1.15-1.25-2v-2.4z" />
          <path d="M28.8 15.8h2.35c1.05 0 1.7.65 1.55 1.55l-.85 4.9c-.15.8-.85 1.35-1.65 1.35h-.55l.5-3.05c.05-.4-.25-.7-.65-.7h-.85c-.4 0-.7.3-.7.7v5.15c0 .35.3.65.65.65h1.2c1.1 0 2-.75 2.2-1.8l1.05-5.55c.3-1.65-.95-3-2.65-3H28.8c-.4 0-.7.3-.7.7s.3.7.7.7z" />
        </g>
      </svg>
      <p className="font-body text-[0.58rem] font-semibold leading-[1.35] tracking-[0.12em] uppercase">
        {t('footer.drink1')}
        <br />
        {t('footer.drink2')}
      </p>
    </div>
  )
}

export function Footer() {
  const { t } = useI18n()
  const [open, setOpen] = useState<'shop' | 'info' | 'contact' | null>(null)

  const shopLinks = [
    { key: 'footer.shop.catalogo', href: '/catalogo' },
    { key: 'footer.shop.classici', href: '/catalogo' },
    { key: 'footer.shop.selezioni', href: '/catalogo' },
    { key: 'footer.shop.bollicine', href: '/catalogo' },
    { key: 'footer.shop.degustazione', href: 'https://grosjeanvins.it/degustazione/' },
  ] as const

  const infoLinks = [
    { key: 'footer.info.famiglia', href: '/#anni' },
    { key: 'footer.info.aTavola', href: '/#abbinamenti' },
    { key: 'footer.info.visione', href: '/#visione' },
    { key: 'footer.info.degustazione', href: '/#degustazione' },
    { key: 'footer.info.visita', href: '/#visita' },
    { key: 'footer.info.catalogo', href: '/catalogo' },
    { key: 'footer.info.contatti', href: 'mailto:info@grosjeanvins.it' },
  ] as const

  const toggle = (key: 'shop' | 'info' | 'contact') =>
    setOpen((prev) => (prev === key ? null : key))

  return (
    <footer className="bg-paper text-ink">
      {/* ——— Mobile (reference Taylor) ——— */}
      <div className="px-5 pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:hidden">
        <div className="mx-auto max-w-md">
          <FooterHeading>{t('footer.heritageTitle')}</FooterHeading>
          <p className="mt-4 font-body text-[0.95rem] leading-[1.65] text-ink">
            {t('footer.heritageBody')}
          </p>

          <div className="mt-8 border-b border-line">
            <Accordion
              title={t('footer.shopTitle')}
              open={open === 'shop'}
              onToggle={() => toggle('shop')}
            >
              <ul>
                {shopLinks.map((link) => (
                  <li key={link.key}>
                    <FooterLink href={link.href}>{t(link.key)}</FooterLink>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              title={t('footer.infoTitle')}
              open={open === 'info'}
              onToggle={() => toggle('info')}
            >
              <ul>
                {infoLinks.map((link) => (
                  <li key={link.key}>
                    <FooterLink href={link.href}>{t(link.key)}</FooterLink>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              title={t('footer.contactTitle')}
              open={open === 'contact'}
              onToggle={() => toggle('contact')}
            >
              <div className="space-y-1 font-body text-[0.95rem] leading-[1.7]">
                <p>
                  <a href="tel:+390165775791" className="transition-opacity hover:opacity-55">
                    +39 0165 77 57 91
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@grosjeanvins.it"
                    className="underline decoration-ink/25 underline-offset-4 transition-opacity hover:opacity-55"
                  >
                    {t('footer.writeUs')}
                  </a>
                </p>
              </div>
            </Accordion>
          </div>

          <p className="mt-10 text-center font-body text-[clamp(3.2rem,18vw,5.5rem)] font-semibold uppercase leading-none tracking-[0.06em]">
            Grosjean<span className="align-super text-[0.45em] tracking-normal">®</span>
          </p>

          <div className="mt-8 flex flex-col items-center gap-6 border-t border-line pt-8">
            <SocialRow />

            <DrinkMark className="h-9" />

            <p className="max-w-[22rem] text-center font-body text-[0.65rem] leading-relaxed text-ink-2">
              Società Agricola Grosjean Vins s.s. · P.IVA 00536390073
              <br />
              Fraz. Ollignan 2, 11020 Quart (AO)
            </p>

            <div className="flex items-center gap-6 font-body text-[0.82rem]">
              <a
                href="https://grosjeanvins.it/"
                target="_blank"
                rel="noreferrer"
                className="transition-opacity hover:opacity-55"
              >
                {t('footer.terms')}
              </a>
              <a
                href="https://grosjeanvins.it/"
                target="_blank"
                rel="noreferrer"
                className="transition-opacity hover:opacity-55"
              >
                {t('footer.privacy')}
              </a>
            </div>

            <p className="font-body text-[0.75rem] text-ink-2">
              {t('footer.designBy')}{' '}
              <a
                href="https://michelbranche.it"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/40 underline-offset-4 transition-opacity hover:opacity-55"
              >
                Michel Branche
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ——— Desktop ——— */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1400px] px-10 pt-24">
          <div className="grid grid-cols-4 gap-x-12">
            <div className="min-w-0">
              <FooterHeading>{t('footer.heritageTitle')}</FooterHeading>
              <p className="mt-5 max-w-[30ch] font-body text-[0.95rem] leading-[1.6] text-ink">
                {t('footer.heritageBody')}
              </p>
            </div>

            <div className="min-w-0">
              <FooterHeading>{t('footer.shopTitle')}</FooterHeading>
              <ul className="mt-5">
                {shopLinks.map((link) => (
                  <li key={link.key}>
                    <FooterLink href={link.href}>{t(link.key)}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <FooterHeading>{t('footer.infoTitle')}</FooterHeading>
              <ul className="mt-5">
                {infoLinks.map((link) => (
                  <li key={link.key}>
                    <FooterLink href={link.href}>{t(link.key)}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <FooterHeading>{t('footer.contactTitle')}</FooterHeading>
              <div className="mt-5 space-y-1 font-body text-[0.95rem] leading-[1.7]">
                <p>
                  <span className="text-ink-2">{t('footer.phoneLabel')} </span>
                  <a href="tel:+390165775791" className="transition-opacity hover:opacity-55">
                    +39 0165 77 57 91
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@grosjeanvins.it"
                    className="underline decoration-ink/25 underline-offset-4 transition-opacity hover:opacity-55"
                  >
                    {t('footer.writeUs')}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] overflow-hidden px-6 pb-16 pt-20">
          <p className="text-center font-body text-[clamp(4rem,17.5vw,14.5rem)] font-semibold uppercase leading-none tracking-[0.06em] text-ink">
            Grosjean<span className="align-super text-[0.45em] tracking-normal">®</span>
          </p>
        </div>

        <div className="border-t border-line/60">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-10 py-10">
            <p className="text-center font-body text-[0.68rem] leading-relaxed text-ink-2">
              Società Agricola Grosjean Vins s.s. · P.IVA 00536390073 · Fraz. Ollignan 2, 11020 Quart
              (AO)
            </p>

            <div className="flex items-center justify-between gap-8">
              <DrinkMark className="h-8" />

              <div className="flex items-center gap-6 font-body text-[0.82rem]">
                <a
                  href="https://grosjeanvins.it/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-55"
                >
                  {t('footer.terms')}
                </a>
                <a
                  href="https://grosjeanvins.it/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-55"
                >
                  {t('footer.privacy')}
                </a>
              </div>
            </div>

            <SocialRow />

            <p className="text-center font-body text-[0.75rem] text-ink-2">
              {t('footer.designBy')}{' '}
              <a
                href="https://michelbranche.it"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/40 underline-offset-4 transition-opacity hover:opacity-55"
              >
                Michel Branche
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
