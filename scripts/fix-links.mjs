import { readFileSync, writeFileSync } from 'fs'

const storyPath = 'c:/Users/miche/Desktop/demo-cantina-altura/src/components/ScrollStory.tsx'
let s = readFileSync(storyPath, 'utf8')

// Internal CTAs should not open new tabs
s = s.replace(
  /<a\n\s+href="\/#visita"\n\s+target="_blank"\n\s+rel="noreferrer"/g,
  '<a\n                href="/#visita"',
)
s = s.replace(
  /href="\/#visita"\n\s+target="_blank"\n\s+rel="noreferrer"/g,
  'href="/#visita"',
)

writeFileSync(storyPath, s)

const pairPath = 'c:/Users/miche/Desktop/demo-cantina-altura/src/components/Pairings.tsx'
let p = readFileSync(pairPath, 'utf8')
if (!p.includes("import { Link }")) {
  p = p.replace(
    "import { catalogWines } from '../data/catalog'",
    "import { Link } from 'react-router-dom'\nimport { catalogWines } from '../data/catalog'",
  )
}
p = p.replace(
  /<a\n\s+href=\{r\.shopUrl\}\n\s+target="_blank"\n\s+rel="noreferrer"\n\s+className="mt-5 inline-flex items-center gap-2 font-body text-\[0\.72rem\] font-semibold tracking-\[0\.12em\] uppercase text-ink underline decoration-ink\/30 underline-offset-\[6px\] transition-opacity hover:opacity-55"\n\s+>\n\s+\{t\('pairings\.shop'\)\}\n\s+<span aria-hidden>→<\/span>\n\s+<\/a>/,
  `<Link
                      to={r.shopUrl}
                      className="mt-5 inline-flex items-center gap-2 font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-ink underline decoration-ink/30 underline-offset-[6px] transition-opacity hover:opacity-55"
                    >
                      {t('pairings.shop')}
                      <span aria-hidden>→</span>
                    </Link>`,
)
writeFileSync(pairPath, p)

console.log('story/pairings patched')
