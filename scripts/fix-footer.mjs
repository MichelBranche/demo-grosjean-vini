import { readFileSync, writeFileSync } from 'fs'

const p = 'c:/Users/miche/Desktop/demo-cantina-altura/src/components/Footer.tsx'
let t = readFileSync(p, 'utf8')

const pairs = [
  ['https://www.facebook.com/grosjeanvins/', '#'],
  ['https://www.instagram.com/grosjean.vins/', '#'],
  ['https://www.youtube.com/channel/UClXTQFWf8YgrEcyBdRzpsSA', '#'],
  ['https://www.tiktok.com/@grosjean.vins', '#'],
  ["href: 'https://grosjeanvins.it/degustazione/'", "href: '/#degustazione'"],
  ["href: 'https://grosjeanvins.it/'", "href: '/catalogo'"],
  ['https://grosjeanvins.it/', '/catalogo'],
  ['info@grosjeanvins.it', 'hello@maisonaltura.demo'],
  ['+390165775791', '+390000000000'],
  ['+39 0165 77 57 91', '+39 000 000 0000'],
  ['Grosjean', 'Altura'],
  ['Società Agricola Altura Vins s.s.', 'Maison Altura S.r.l. — demo'],
  ['P.IVA 00536390073', 'P.IVA 00000000000'],
  ['Fraz. Ollignan 2, 11020 Quart (AO)', 'Les Hauts, Saint-Martin — Alpi'],
  ['Fraz. Ollignan 2, 11020 Quart', 'Les Hauts, Saint-Martin — Alpi'],
  ['Michel Branche', 'Studio Demo'],
  ['https://michelbranche.it', 'https://example.com'],
]

for (const [a, b] of pairs) t = t.split(a).join(b)

writeFileSync(p, t)
console.log('ok', !t.includes('grosjean'), !t.includes('catalogo"bg'), t.includes('shopLinks'))
