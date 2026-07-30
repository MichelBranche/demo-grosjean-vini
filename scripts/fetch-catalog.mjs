import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../src/data')
mkdirSync(outDir, { recursive: true })

const decode = (s) =>
  String(s || '')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&[^;]+;/g, '')

/** Add rossi / bianchi / rosati from product name (shop only has gamme tags). */
function enrichColorTags(name, categories) {
  const tags = new Set(categories)
  if (tags.has('birra') || tags.has('wine-box')) return [...tags]

  const n = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const isRose =
    /\brose\b/.test(n) ||
    /\brosato\b/.test(n) ||
    /premetta/.test(n) ||
    /montmary/.test(n)

  const isRed =
    /\brosso\b/.test(n) ||
    /pinot noir/.test(n) ||
    /torrette/.test(n) ||
    /fumin/.test(n) ||
    /cornalin/.test(n) ||
    /donnas/.test(n) ||
    /gamay/.test(n) ||
    /clairet/.test(n) ||
    /heraco/.test(n)

  const isWhite =
    /chardonnay/.test(n) ||
    /gewurz/.test(n) ||
    /arvine/.test(n) ||
    /muscat/.test(n) ||
    /fletry/.test(n) ||
    /muller/.test(n) ||
    (/blanc/.test(n) && !/blanc de noir/.test(n) && !tags.has('bollicine'))

  if (isRose) tags.add('rosati')
  else if (isRed) tags.add('rossi')
  else if (isWhite) tags.add('bianchi')

  return [...tags]
}

const COLOR_LABELS = {
  rossi: 'Rossi',
  bianchi: 'Bianchi',
  rosati: 'Rosati',
}

const res = await fetch('https://grosjeanvins.it/wp-json/wc/store/v1/products?per_page=100')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const products = await res.json()

const SKIP_SLUGS = new Set(['adotta-un-cru'])
const LOCAL_IMAGES = {
  les_vins_introuvables: '/images/catalog/scatola-mista.png',
}

const cats = new Map()
const wines = products
  .filter((p) => !SKIP_SLUGS.has(p.slug))
  .map((p) => {
    const shopCats = (p.categories || []).map((c) => {
      cats.set(c.slug, c.name)
      return c.slug
    })
    const name = decode(p.name)
    const categories = enrichColorTags(name, shopCats)
    for (const slug of categories) {
      if (COLOR_LABELS[slug]) cats.set(slug, COLOR_LABELS[slug])
    }

    const minor = p.prices?.currency_minor_unit ?? 2
    const raw = Number(p.prices?.price ?? 0) / 10 ** minor
    const price = `${raw.toFixed(2).replace('.', ',')} €`
    const remoteImg =
      p.images?.[0]?.srcset?.split(', ').at(-1)?.split(' ')[0] ||
      p.images?.[0]?.src ||
      ''
    const img = LOCAL_IMAGES[p.slug] || remoteImg

    return {
      id: p.id,
      name,
      slug: p.slug,
      price,
      category: shopCats[0] || categories[0] || 'altro',
      categories,
      img,
      permalink: p.permalink,
    }
  })

const categoryOrder = [
  'rossi',
  'bianchi',
  'rosati',
  'bollicine',
  'classici',
  'selezioni',
  'edizione-limitata',
  'magnum',
  'wine-box',
  'birra',
]

const categories = [
  ...categoryOrder
    .filter((slug) => cats.has(slug) || wines.some((w) => w.categories.includes(slug)))
    .map((slug) => ({
      slug,
      name: cats.get(slug) || COLOR_LABELS[slug] || slug,
    })),
  ...[...cats.entries()]
    .filter(
      ([slug]) =>
        !categoryOrder.includes(slug) &&
        slug !== 'senza-categoria' &&
        !COLOR_LABELS[slug],
    )
    .map(([slug, name]) => ({ slug, name })),
]

const file = `export type CatalogCategory = {
  slug: string
  name: string
}

export type CatalogWine = {
  id: number
  name: string
  slug: string
  price: string
  category: string
  categories: string[]
  img: string
  permalink: string
}

export const catalogCategories: CatalogCategory[] = ${JSON.stringify(categories, null, 2)}

export const catalogWines: CatalogWine[] = ${JSON.stringify(wines, null, 2)}
`

writeFileSync(join(outDir, 'catalog.ts'), file)
console.log(`Wrote ${wines.length} wines, ${categories.length} categories`)
