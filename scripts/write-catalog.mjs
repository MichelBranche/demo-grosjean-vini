import { writeFileSync } from "fs"

const wines = [
  ["L’Alpage Grape Ale", "alpage-grape-ale", "5,85 €", "birra", ["birra"]],
  ["Gewürztraminer Altiere", "gewurztraminer-altiere", "18,50 €", "classici", ["classici","bianchi"]],
  ["Héritage Rouge Réserve", "heritage-rouge-reserve", "47,00 €", "edizione-limitata", ["edizione-limitata","rossi"]],
  ["Mont Blanc Rosé Magnum", "mont-blanc-rose-magnum", "54,00 €", "bollicine", ["bollicine","magnum","rosati"]],
  ["Blanc de Roche Magnum", "blanc-de-roche-magnum", "69,00 €", "bollicine", ["bollicine","magnum"]],
  ["Coffret Altura", "coffret-altura", "235,00 €", "wine-box", ["wine-box"]],
  ["Noir des Crêtes", "noir-des-cretes", "39,00 €", "edizione-limitata", ["edizione-limitata","rossi"]],
  ["Passerillé des Cimes", "passerille-des-cimes", "23,00 €", "edizione-limitata", ["edizione-limitata","bianchi"]],
  ["Pinot Noir Vigne Haute", "pinot-noir-vigne-haute", "25,00 €", "selezioni", ["selezioni","rossi"]],
  ["Pinot Noir Les Frères", "pinot-noir-les-freres", "40,00 €", "edizione-limitata", ["edizione-limitata","rossi"]],
  ["Arvine Blanche Les Frères", "arvine-blanche-les-freres", "38,00 €", "edizione-limitata", ["edizione-limitata","bianchi"]],
  ["Force 1972 Extra Dry", "force-1972-extra-dry", "12,00 €", "bollicine", ["bollicine"]],
  ["Blanc de Roche Extra Brut", "blanc-de-roche-extra-brut", "30,00 €", "bollicine", ["bollicine"]],
  ["Clairet des Cimes", "clairet-des-cimes", "28,00 €", "selezioni", ["selezioni","rossi"]],
  ["Muscat des Alpes", "muscat-des-alpes", "19,00 €", "classici", ["classici","bianchi"]],
  ["Gamay Saint-Martin", "gamay-saint-martin", "14,00 €", "classici", ["classici","rossi"]],
  ["Chardonnay Altitude", "chardonnay-altitude", "13,00 €", "classici", ["classici","bianchi"]],
  ["Pinot Noir Classique", "pinot-noir-classique", "16,00 €", "classici", ["classici","rossi"]],
  ["Rouge des Cimes", "rouge-des-cimes", "15,00 €", "classici", ["classici","rossi"]],
  ["Noir d’Altitude", "noir-d-altitude", "22,00 €", "classici", ["classici","rossi"]],
  ["Rouge Roche Cru", "rouge-roche-cru", "27,00 €", "selezioni", ["selezioni","rossi"]],
  ["Rouge des Cimes Supérieur", "rouge-des-cimes-superieur", "29,00 €", "selezioni", ["selezioni","rossi"]],
  ["Arvine Blanche Châtel", "arvine-blanche-chatel", "24,00 €", "selezioni", ["selezioni","bianchi"]],
  ["Rosé des Crêtes", "rose-des-cretes", "14,50 €", "classici", ["classici","rosati"]],
  ["Mont Blanc Rosé Extra Brut", "mont-blanc-rose-extra-brut", "26,00 €", "bollicine", ["bollicine","rosati"]],
  ["Noir d’Altitude Cru", "noir-d-altitude-cru", "32,00 €", "selezioni", ["selezioni","rossi"]],
  ["Cuvée du Fondateur", "cuvee-du-fondateur", "33,00 €", "selezioni", ["selezioni","bianchi"]],
  ["Arvine Blanche Cru", "arvine-blanche-cru", "23,00 €", "selezioni", ["selezioni","bianchi"]],
  ["Noir d’Altitude Anniversaire", "noir-d-altitude-anniversaire", "35,50 €", "edizione-limitata", ["edizione-limitata","rossi"]],
]

const items = wines.map((w, i) => {
  const [name, slug, price, category, categories] = w
  const img = slug === "coffret-altura"
    ? "/images/catalog/scatola-mista.png"
    : `/images/bottles/bottle-${String(i + 1).padStart(2, "0")}.jpg`
  return {
    id: 1000 + i,
    name,
    slug,
    price,
    category,
    categories,
    img,
    permalink: `/catalogo/${slug}`,
  }
})

const details = {}
for (const w of items) {
  details[w.slug] = {
    lead: `${w.name} nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.`,
    story: [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici.",
    ],
    tasting: w.categories.includes("bianchi")
      ? { color: "Giallo paglierino luminoso", nose: "Fiori bianchi, agrumi e pietra focaia", palate: "Fresco, sapido, lungo" }
      : w.categories.includes("rosati") || w.categories.includes("bollicine")
      ? { color: "Rosa chiaro brillante", nose: "Frutti rossi e note di pan brioche", palate: "Vivace, fine, persistente" }
      : w.categories.includes("birra")
      ? { color: "Rosato luminoso", nose: "Frutti rossi e fermentazione", palate: "Secco, scorrevole, equilibrato" }
      : { color: "Rosso rubino", nose: "Frutti di bosco, spezie e viola", palate: "Morbido, tannini eleganti, finale minerale" },
  }
}

const catalogSrc = `export type CatalogCategory = {
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

export const catalogCategories: CatalogCategory[] = [
  { slug: "rossi", name: "Rossi" },
  { slug: "bianchi", name: "Bianchi" },
  { slug: "rosati", name: "Rosati" },
  { slug: "bollicine", name: "Bollicine" },
  { slug: "classici", name: "Classici" },
  { slug: "selezioni", name: "Selezioni" },
  { slug: "edizione-limitata", name: "Edizione Limitata" },
  { slug: "magnum", name: "Magnum" },
  { slug: "wine-box", name: "Wine Box" },
  { slug: "birra", name: "Birra" },
]

export function getWineBySlug(slug: string): CatalogWine | undefined {
  return catalogWines.find((w) => w.slug === slug)
}

export function getRelatedWines(wine: CatalogWine, limit = 4): CatalogWine[] {
  const same = catalogWines.filter(
    (w) => w.id !== wine.id && w.categories.includes(wine.category),
  )
  if (same.length >= limit) return same.slice(0, limit)
  const extra = catalogWines.filter(
    (w) => w.id !== wine.id && !same.some((s) => s.id === w.id),
  )
  return [...same, ...extra].slice(0, limit)
}

export function wineFormatKey(wine: CatalogWine): "beer" | "magnum" | "box" | "bottle" {
  if (wine.categories.includes("birra")) return "beer"
  if (wine.categories.includes("magnum")) return "magnum"
  if (wine.categories.includes("wine-box")) return "box"
  return "bottle"
}

export const catalogWines: CatalogWine[] = ${JSON.stringify(items, null, 2)}
`

const detailsSrc = `export type ProductTasting = {
  color?: string
  nose?: string
  palate?: string
}

export type ProductDetails = {
  lead: string
  story: string[]
  tasting: ProductTasting | null
}

export const productDetails: Record<string, ProductDetails> = ${JSON.stringify(details, null, 2)}
`

writeFileSync("c:/Users/miche/Desktop/demo-cantina-altura/src/data/catalog.ts", catalogSrc)
writeFileSync("c:/Users/miche/Desktop/demo-cantina-altura/src/data/productDetails.ts", detailsSrc)
console.log("catalog", items.length)
