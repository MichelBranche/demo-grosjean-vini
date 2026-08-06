export type CatalogCategory = {
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

export const catalogWines: CatalogWine[] = [
  {
    "id": 1000,
    "name": "L’Alpage Grape Ale",
    "slug": "alpage-grape-ale",
    "price": "5,85 €",
    "category": "birra",
    "categories": [
      "birra"
    ],
    "img": "/images/bottles/bottle-01.png",
    "permalink": "/catalogo/alpage-grape-ale"
  },
  {
    "id": 1001,
    "name": "Gewürztraminer Altiere",
    "slug": "gewurztraminer-altiere",
    "price": "18,50 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-02.png",
    "permalink": "/catalogo/gewurztraminer-altiere"
  },
  {
    "id": 1002,
    "name": "Héritage Rouge Réserve",
    "slug": "heritage-rouge-reserve",
    "price": "47,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "/images/bottles/bottle-03.png",
    "permalink": "/catalogo/heritage-rouge-reserve"
  },
  {
    "id": 1003,
    "name": "Mont Blanc Rosé Magnum",
    "slug": "mont-blanc-rose-magnum",
    "price": "54,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "magnum",
      "rosati"
    ],
    "img": "/images/bottles/bottle-04.png",
    "permalink": "/catalogo/mont-blanc-rose-magnum"
  },
  {
    "id": 1004,
    "name": "Blanc de Roche Magnum",
    "slug": "blanc-de-roche-magnum",
    "price": "69,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "magnum"
    ],
    "img": "/images/bottles/bottle-05.png",
    "permalink": "/catalogo/blanc-de-roche-magnum"
  },
  {
    "id": 1005,
    "name": "Coffret Altura",
    "slug": "coffret-altura",
    "price": "235,00 €",
    "category": "wine-box",
    "categories": [
      "wine-box"
    ],
    "img": "/images/catalog/scatola-mista.png",
    "permalink": "/catalogo/coffret-altura"
  },
  {
    "id": 1006,
    "name": "Noir des Crêtes",
    "slug": "noir-des-cretes",
    "price": "39,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "/images/bottles/bottle-07.png",
    "permalink": "/catalogo/noir-des-cretes"
  },
  {
    "id": 1007,
    "name": "Passerillé des Cimes",
    "slug": "passerille-des-cimes",
    "price": "23,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-08.png",
    "permalink": "/catalogo/passerille-des-cimes"
  },
  {
    "id": 1008,
    "name": "Pinot Noir Vigne Haute",
    "slug": "pinot-noir-vigne-haute",
    "price": "25,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "/images/bottles/bottle-09.png",
    "permalink": "/catalogo/pinot-noir-vigne-haute"
  },
  {
    "id": 1009,
    "name": "Pinot Noir Les Frères",
    "slug": "pinot-noir-les-freres",
    "price": "40,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "/images/bottles/bottle-10.png",
    "permalink": "/catalogo/pinot-noir-les-freres"
  },
  {
    "id": 1010,
    "name": "Arvine Blanche Les Frères",
    "slug": "arvine-blanche-les-freres",
    "price": "38,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-11.png",
    "permalink": "/catalogo/arvine-blanche-les-freres"
  },
  {
    "id": 1011,
    "name": "Force 1972 Extra Dry",
    "slug": "force-1972-extra-dry",
    "price": "12,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine"
    ],
    "img": "/images/bottles/bottle-12.png",
    "permalink": "/catalogo/force-1972-extra-dry"
  },
  {
    "id": 1012,
    "name": "Blanc de Roche Extra Brut",
    "slug": "blanc-de-roche-extra-brut",
    "price": "30,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine"
    ],
    "img": "/images/bottles/bottle-13.png",
    "permalink": "/catalogo/blanc-de-roche-extra-brut"
  },
  {
    "id": 1013,
    "name": "Clairet des Cimes",
    "slug": "clairet-des-cimes",
    "price": "28,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "/images/bottles/bottle-14.png",
    "permalink": "/catalogo/clairet-des-cimes"
  },
  {
    "id": 1014,
    "name": "Muscat des Alpes",
    "slug": "muscat-des-alpes",
    "price": "19,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-15.png",
    "permalink": "/catalogo/muscat-des-alpes"
  },
  {
    "id": 1015,
    "name": "Gamay Saint-Martin",
    "slug": "gamay-saint-martin",
    "price": "14,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "/images/bottles/bottle-16.png",
    "permalink": "/catalogo/gamay-saint-martin"
  },
  {
    "id": 1016,
    "name": "Chardonnay Altitude",
    "slug": "chardonnay-altitude",
    "price": "13,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-17.png",
    "permalink": "/catalogo/chardonnay-altitude"
  },
  {
    "id": 1017,
    "name": "Pinot Noir Classique",
    "slug": "pinot-noir-classique",
    "price": "16,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "/images/bottles/bottle-18.png",
    "permalink": "/catalogo/pinot-noir-classique"
  },
  {
    "id": 1018,
    "name": "Rouge des Cimes",
    "slug": "rouge-des-cimes",
    "price": "15,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "/images/bottles/bottle-19.png",
    "permalink": "/catalogo/rouge-des-cimes"
  },
  {
    "id": 1019,
    "name": "Noir d’Altitude",
    "slug": "noir-d-altitude",
    "price": "22,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "/images/bottles/bottle-20.png",
    "permalink": "/catalogo/noir-d-altitude"
  },
  {
    "id": 1020,
    "name": "Rouge Roche Cru",
    "slug": "rouge-roche-cru",
    "price": "27,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "/images/bottles/bottle-21.png",
    "permalink": "/catalogo/rouge-roche-cru"
  },
  {
    "id": 1021,
    "name": "Rouge des Cimes Supérieur",
    "slug": "rouge-des-cimes-superieur",
    "price": "29,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "/images/bottles/bottle-22.png",
    "permalink": "/catalogo/rouge-des-cimes-superieur"
  },
  {
    "id": 1022,
    "name": "Arvine Blanche Châtel",
    "slug": "arvine-blanche-chatel",
    "price": "24,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-23.png",
    "permalink": "/catalogo/arvine-blanche-chatel"
  },
  {
    "id": 1023,
    "name": "Rosé des Crêtes",
    "slug": "rose-des-cretes",
    "price": "14,50 €",
    "category": "classici",
    "categories": [
      "classici",
      "rosati"
    ],
    "img": "/images/bottles/bottle-24.png",
    "permalink": "/catalogo/rose-des-cretes"
  },
  {
    "id": 1024,
    "name": "Mont Blanc Rosé Extra Brut",
    "slug": "mont-blanc-rose-extra-brut",
    "price": "26,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "rosati"
    ],
    "img": "/images/bottles/bottle-25.png",
    "permalink": "/catalogo/mont-blanc-rose-extra-brut"
  },
  {
    "id": 1025,
    "name": "Noir d’Altitude Cru",
    "slug": "noir-d-altitude-cru",
    "price": "32,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "/images/bottles/bottle-26.png",
    "permalink": "/catalogo/noir-d-altitude-cru"
  },
  {
    "id": 1026,
    "name": "Cuvée du Fondateur",
    "slug": "cuvee-du-fondateur",
    "price": "33,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-27.png",
    "permalink": "/catalogo/cuvee-du-fondateur"
  },
  {
    "id": 1027,
    "name": "Arvine Blanche Cru",
    "slug": "arvine-blanche-cru",
    "price": "23,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "/images/bottles/bottle-28.png",
    "permalink": "/catalogo/arvine-blanche-cru"
  },
  {
    "id": 1028,
    "name": "Noir d’Altitude Anniversaire",
    "slug": "noir-d-altitude-anniversaire",
    "price": "35,50 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "/images/bottles/bottle-29.png",
    "permalink": "/catalogo/noir-d-altitude-anniversaire"
  }
]
