import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const src = readFileSync('./src/data/catalog.ts', 'utf8')
const wineStart = src.indexOf('export const catalogWines')
const wineSrc = src.slice(wineStart)

const wines = []
const re =
  /\{\s*"id":\s*(\d+),\s*"name":\s*"((?:\\.|[^"\\])*)",\s*"slug":\s*"([^"]+)",[\s\S]*?"permalink":\s*"([^"]+)"/g

let m
while ((m = re.exec(wineSrc))) {
  wines.push({
    id: Number(m[1]),
    name: m[2].replace(/\\"/g, '"'),
    slug: m[3],
    permalink: m[4],
  })
}

console.log('Found wines:', wines.length)

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]+/g, ' ')
    .trim()
}

const out = {}

for (const w of wines) {
  process.stdout.write(`Fetching ${w.slug}...\n`)
  try {
    const res = await fetch(w.permalink, {
      headers: { 'User-Agent': 'Mozilla/5.0 AlturaDemoBot/1.0' },
    })
    if (!res.ok) {
      out[w.slug] = { error: res.status }
      continue
    }
    const html = await res.text()

    const shortMatch = html.match(
      /class="[^"]*woocommerce-product-details__short-description[^"]*"[\s\S]*?>([\s\S]*?)<\/div>/i,
    )
    const short = shortMatch ? strip(shortMatch[1]) : ''

    const descMatch = html.match(
      /id="tab-description"[\s\S]*?>([\s\S]*?)(?:<\/div>\s*<div[^>]*id="tab-|<div[^>]*class="[^"]*woocommerce-Tabs)/i,
    )
    let long = descMatch ? strip(descMatch[1]) : ''
    if (!long) {
      const alt = html.match(
        /class="[^"]*woocommerce-Tabs-panel--description[^"]*"[\s\S]*?>([\s\S]*?)<\/div>/i,
      )
      long = alt ? strip(alt[1]) : ''
    }

    const attrs = {}
    const rows = [
      ...html.matchAll(/<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi),
    ]
    for (const [, th, td] of rows) {
      const k = strip(th)
      const v = strip(td)
      if (k && v && k.length < 48 && v.length < 160) attrs[k] = v
    }

    // OG description fallback
    const og = html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1]

    out[w.slug] = {
      short: short.slice(0, 800),
      body: long.slice(0, 2800),
      og: og ? strip(og).slice(0, 500) : '',
      attrs,
    }
  } catch (e) {
    out[w.slug] = { error: String(e) }
  }
}

mkdirSync('./scripts', { recursive: true })
writeFileSync('./scripts/product-scrape.json', JSON.stringify(out, null, 2))
console.log('Wrote', Object.keys(out).length, 'products')
