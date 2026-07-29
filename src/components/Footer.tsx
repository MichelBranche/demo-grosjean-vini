import { useState, type ReactNode } from 'react'

const shopLinks = [
  { label: 'Tutti i vini', href: 'https://grosjeanvins.it/negozio/' },
  { label: 'Rossi', href: 'https://grosjeanvins.it/negozio/' },
  { label: 'Bianchi', href: 'https://grosjeanvins.it/negozio/' },
  { label: 'Cru Rovettaz', href: 'https://grosjeanvins.it/negozio/' },
  { label: 'Degustazione', href: 'https://grosjeanvins.it/degustazione/' },
]

const infoLinks = [
  { label: 'La famiglia', href: '#anni' },
  { label: 'A tavola', href: '#abbinamenti' },
  { label: 'Visione', href: '#visione' },
  { label: 'Degustazione', href: '#degustazione' },
  { label: 'Visita in cantina', href: '#visita' },
  { label: 'Negozio online', href: 'https://grosjeanvins.it/negozio/' },
  { label: 'Contatti', href: 'mailto:info@grosjeanvins.it' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/grosjeanvins/',
    path: 'M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/grosjeanvins/',
    path: 'M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.2c-2.1 0-2.4 0-3.2.1-.8 0-1.4.2-1.9.4a3.9 3.9 0 0 0-1.4 1.4c-.2.5-.3 1.1-.4 1.9-.1.8-.1 1.1-.1 3.2s0 2.4.1 3.2c0 .8.2 1.4.4 1.9.3.5.7 1 1.4 1.4.5.2 1.1.3 1.9.4.8.1 1.1.1 3.2.1s2.4 0 3.2-.1c.8 0 1.4-.2 1.9-.4a3.9 3.9 0 0 0 1.4-1.4c.2-.5.3-1.1.4-1.9.1-.8.1-1.1.1-3.2s0-2.4-.1-3.2c0-.8-.2-1.4-.4-1.9a3.9 3.9 0 0 0-1.4-1.4c-.5-.2-1.1-.3-1.9-.4-.8-.1-1.1-.1-3.2-.1zm0 1.5c2.1 0 2.3 0 3.1.1.8 0 1.2.2 1.5.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.2.7.3 1.5.1.8.1 1 .1 3.1s0 2.3-.1 3.1c0 .8-.2 1.2-.3 1.5-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.7.2-1.5.3-.8.1-1 .1-3.1.1s-2.3 0-3.1-.1c-.8 0-1.2-.2-1.5-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.1-.3-.2-.7-.3-1.5-.1-.8-.1-1-.1-3.1s0-2.3.1-3.1c0-.8.2-1.2.3-1.5.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.7-.2 1.5-.3.8-.1 1-.1 3.1-.1z',
  },
  {
    label: 'YouTube',
    href: 'https://grosjeanvins.it/',
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z',
  },
  {
    label: 'LinkedIn',
    href: 'https://grosjeanvins.it/',
    path: 'M6.5 8.5H3.6V20h2.9V8.5zM5 3.5A1.7 1.7 0 1 0 5 6.9 1.7 1.7 0 0 0 5 3.5zM20.4 20h-2.9v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10.7V8.5h2.8v1.6h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V20z',
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
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className="block font-body text-[0.95rem] leading-[1.7] text-ink transition-opacity hover:opacity-55"
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
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
  return (
    <div
      className="inline-flex items-center gap-2.5 text-ink"
      role="img"
      aria-label="Bevi responsabilmente"
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
        Bevi
        <br />
        responsabilmente
      </p>
    </div>
  )
}

export function Footer() {
  const [open, setOpen] = useState<'shop' | 'info' | 'contact' | null>(null)

  const toggle = (key: 'shop' | 'info' | 'contact') =>
    setOpen((prev) => (prev === key ? null : key))

  return (
    <footer className="bg-paper text-ink">
      {/* ——— Mobile (reference Taylor) ——— */}
      <div className="px-5 pt-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:hidden">
        <div className="mx-auto max-w-md">
          <FooterHeading>Eredità in ogni bottiglia</FooterHeading>
          <p className="mt-4 font-body text-[0.95rem] leading-[1.65] text-ink">
            Dal 1968 a Quart, tre generazioni di viticoltori. Prima cantina biologica della Valle
            d’Aosta: vini di montagna nati da pendii eroici e da un motto di famiglia — bien faire
            et laisser dire.
          </p>

          <div className="mt-8 border-b border-line">
            <Accordion
              title="Acquista i vini"
              open={open === 'shop'}
              onToggle={() => toggle('shop')}
            >
              <ul>
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              title="Informazioni"
              open={open === 'info'}
              onToggle={() => toggle('info')}
            >
              <ul>
                {infoLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              title="Contatti"
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
                    Scrivici
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
                Termini
              </a>
              <a
                href="https://grosjeanvins.it/"
                target="_blank"
                rel="noreferrer"
                className="transition-opacity hover:opacity-55"
              >
                Privacy
              </a>
            </div>

            <p className="font-body text-[0.75rem] text-ink-2">
              Design by{' '}
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
              <FooterHeading>Eredità in ogni bottiglia</FooterHeading>
              <p className="mt-5 max-w-[30ch] font-body text-[0.95rem] leading-[1.6] text-ink">
                Dal 1968 a Quart, tre generazioni di viticoltori. Prima cantina biologica della Valle
                d’Aosta: vini di montagna nati da pendii eroici e da un motto di famiglia — bien
                faire et laisser dire.
              </p>
            </div>

            <div className="min-w-0">
              <FooterHeading>Acquista i vini</FooterHeading>
              <ul className="mt-5">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <FooterHeading>Informazioni</FooterHeading>
              <ul className="mt-5">
                {infoLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <FooterHeading>Contatti</FooterHeading>
              <div className="mt-5 space-y-1 font-body text-[0.95rem] leading-[1.7]">
                <p>
                  <span className="text-ink-2">Telefono </span>
                  <a href="tel:+390165775791" className="transition-opacity hover:opacity-55">
                    +39 0165 77 57 91
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@grosjeanvins.it"
                    className="underline decoration-ink/25 underline-offset-4 transition-opacity hover:opacity-55"
                  >
                    Scrivici
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
                  Termini
                </a>
                <a
                  href="https://grosjeanvins.it/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-55"
                >
                  Privacy
                </a>
              </div>
            </div>

            <SocialRow />

            <p className="text-center font-body text-[0.75rem] text-ink-2">
              Design by{' '}
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
