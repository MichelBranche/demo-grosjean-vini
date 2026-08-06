import { readFileSync, writeFileSync } from 'fs'

const scraped = JSON.parse(readFileSync('./scripts/product-scrape.json', 'utf8'))

function clean(text = '') {
  return text
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\*\*[^*]+\*\*/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n +/g, '\n')
    .replace(/ +\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function splitParagraphs(text) {
  return clean(text)
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function parseTasting(text) {
  const t = clean(text)
  const notes = {}
  const color = t.match(/Colore:\s*([^\n]+)/i)?.[1]?.trim()
  const nose = t.match(/Profumo:\s*([^\n]+)/i)?.[1]?.trim()
  const palate = t.match(/Sapore:\s*([^\n.]+(?:\.[^\n]*)?)/i)?.[1]?.trim()
  if (color) notes.color = color.replace(/\.$/, '')
  if (nose) notes.nose = nose.replace(/\.$/, '')
  if (palate) notes.palate = palate.replace(/\.{2,}$/, '.').replace(/\.$/, '')
  return Object.keys(notes).length ? notes : null
}

const entries = Object.entries(scraped).map(([slug, data]) => {
  const raw = clean(data.short || data.og || '')
  const paragraphs = splitParagraphs(raw)
  const tasting = parseTasting(raw)

  // If tasting-led, keep remaining narrative as lead
  let lead = paragraphs[0] || ''
  let story = paragraphs.slice(1)

  if (tasting && /^Colore:/i.test(lead)) {
    lead = story[0] || ''
    story = story.slice(1)
  }

  // Prefer first non-tasting paragraph as lead when first is tasting block
  if (!lead && paragraphs.length) {
    lead = paragraphs.find((p) => !/^Colore:/i.test(p)) || ''
  }

  return [
    slug,
    {
      lead: lead.slice(0, 420),
      story: story.map((p) => p.slice(0, 700)).slice(0, 4),
      tasting,
    },
  ]
})

const file = `/* Auto-generated from grosjeanvins.it product pages — edit carefully */
export type ProductTasting = {
  color?: string
  nose?: string
  palate?: string
}

export type ProductDetails = {
  lead: string
  story: string[]
  tasting: ProductTasting | null
}

export const productDetails: Record<string, ProductDetails> = ${JSON.stringify(
  Object.fromEntries(entries),
  null,
  2,
)}
`

writeFileSync('./src/data/productDetails.ts', file)
console.log('Wrote productDetails for', entries.length, 'products')
