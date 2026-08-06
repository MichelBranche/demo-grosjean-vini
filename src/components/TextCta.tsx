import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

function StockArrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-[0.7em] w-[0.7em] shrink-0 translate-y-[0.05em] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[2px]"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.2M9.5 2.5V7.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type TextCtaProps = {
  children: ReactNode
  className?: string
  to?: string
  href?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>

/** Underlined editorial CTA with stock-style ↗ micro-interaction */
export function TextCta({ children, className = '', to, href, ...rest }: TextCtaProps) {
  const cls = `group inline-flex items-center gap-1.5 ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
        <StockArrow />
      </Link>
    )
  }

  return (
    <a href={href} className={cls} {...rest}>
      {children}
      <StockArrow />
    </a>
  )
}
