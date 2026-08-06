import { readFileSync, writeFileSync } from "fs"

const root = "c:/Users/miche/Desktop/demo-cantina-altura"

// Pairings
let pairings = readFileSync(root + "/src/components/Pairings.tsx", "utf8")
pairings = pairings
  .replace(/wine: 'Chambave Muscat'/, "wine: 'Muscat des Alpes'")
  .replace(/wine: 'Chardonnay'/, "wine: 'Chardonnay Altitude'")
  .replace(/wine: 'Le Vin de Michel'|wine: 'Cuvée du Fondateur'/, "wine: 'Cuvée du Fondateur'")
  .replace(/wine: 'Clairet'|wine: 'Clairet des Cimes'/, "wine: 'Clairet des Cimes'")
  .replace(/wineSlug: 'chambave-muscat-vallee-daoste-doc'/, "wineSlug: 'muscat-des-alpes'")
  .replace(/wineSlug: 'chardonnay-vallee-daoste-doc'/, "wineSlug: 'chardonnay-altitude'")
  .replace(/wineSlug: 'chardonnay-le-vin-de-michel-vallee-daoste-doc'/, "wineSlug: 'cuvee-du-fondateur'")
  .replace(/wineSlug: 'clairet'/, "wineSlug: 'clairet-des-cimes'")
  .replace(/shopUrl: product\?\.permalink \?\? `https:\/\/maisonaltura\.demo\/prodotto\/\$\{r\.wineSlug\}\/`/, "shopUrl: `/catalogo/${r.wineSlug}`")
  .replace(/product\?\.permalink \?\? `https:\/\/maisonaltura\.demo\/prodotto\/\$\{r\.wineSlug\}\//, "`/catalogo/${r.wineSlug}")
writeFileSync(root + "/src/components/Pairings.tsx", pairings)

// Fix shopUrl line more carefully
pairings = readFileSync(root + "/src/components/Pairings.tsx", "utf8")
pairings = pairings.replace(
  /shopUrl: product\?\.permalink \?\? `[^`]+`/,
  "shopUrl: `/catalogo/${r.wineSlug}`",
)
writeFileSync(root + "/src/components/Pairings.tsx", pairings)

// Header popular + phone
let header = readFileSync(root + "/src/components/Header.tsx", "utf8")
header = header.replace(
  /const POPULAR_SLUGS = \[[\s\S]*?\]/,
  `const POPULAR_SLUGS = [
  'rouge-des-cimes',
  'noir-d-altitude',
  'arvine-blanche-cru',
  'chardonnay-altitude',
  'pinot-noir-classique',
  'mont-blanc-rose-extra-brut',
]`,
)
header = header.replace(/tel:\+390165775791/g, "tel:+390000000000")
header = header.replace(/\+39 0165 77 57 91/g, "+39 000 000 0000")
writeFileSync(root + "/src/components/Header.tsx", header)

// Footer
let footer = readFileSync(root + "/src/components/Footer.tsx", "utf8")
footer = footer
  .replace(/https:\/\/www\.facebook\.com\/alturavins\//g, "#")
  .replace(/https:\/\/www\.instagram\.com\/altura\.vins\//g, "#")
  .replace(/https:\/\/www\.youtube\.com\/[^\"]+/g, "#")
  .replace(/https:\/\/www\.tiktok\.com\/[^\"]+/g, "#")
  .replace(/https:\/\/maisonaltura\.demo\/[^\"]*/g, "/catalogo")
  .replace(/tel:\+390165775791/g, "tel:+390000000000")
  .replace(/\+39 0165 77 57 91/g, "+39 000 000 0000")
  .replace(/Società Agricola Maison Altura s\.s\./g, "Maison Altura S.r.l. — demo")
  .replace(/Fraz\. Les Hauts 2, 11020 Saint-Martin/g, "Les Hauts, Saint-Martin — Alpi")
  .replace(/hello@maisonaltura\.demo/g, "hello@maisonaltura.demo")
writeFileSync(root + "/src/components/Footer.tsx", footer)

// ScrollStory showcase wines
let story = readFileSync(root + "/src/components/ScrollStory.tsx", "utf8")
story = story.replace(
  /const wines = \[[\s\S]*?\]/,
  `const wines = [
  { name: 'Muscat des Alpes', year: '2025', price: '19 €', img: '/images/bottle-muscat.png' },
  { name: 'Cuvée du Fondateur', year: '2024', price: '33 €', img: '/images/bottle-michel.png' },
  { name: 'Chardonnay Altitude', year: '2025', price: '13 €', img: '/images/bottle-chardonnay.png' },
  { name: 'Clairet des Cimes', year: '2022', price: '35 €', img: '/images/bottle-clairetz.png' },
]`,
)
story = story.replace(/https:\/\/maisonaltura\.demo\/[^\"]+/g, "/#visita")
story = story.replace(/Clairet des Cimes des Cimes/g, "Clairet des Cimes")
writeFileSync(root + "/src/components/ScrollStory.tsx", story)

// Product producer already Maison Altura
// Catalog isBoxShot slug
let catalogPage = readFileSync(root + "/src/pages/Catalog.tsx", "utf8")
catalogPage = catalogPage.replace(/les_vins_introuvables/g, "coffret-altura")
writeFileSync(root + "/src/pages/Catalog.tsx", catalogPage)

let product = readFileSync(root + "/src/pages/Product.tsx", "utf8")
product = product.replace(/les_vins_introuvables/g, "coffret-altura")
writeFileSync(root + "/src/pages/Product.tsx", product)

// Dictionaries leftover Valle d'Aosta / Vallee
let dict = readFileSync(root + "/src/i18n/dictionaries.ts", "utf8")
dict = dict
  .replace(/Clairet des Cimes des Cimes/g, "Clairet des Cimes")
  .replace(/vallee-daoste/gi, "alpes")
  .replace(/Valle d’Aosta/g, "Alpi")
  .replace(/https:\/\/maisonaltura\.demo\/[^\']+/g, "/catalogo")
writeFileSync(root + "/src/i18n/dictionaries.ts", dict)

console.log("patched components")
