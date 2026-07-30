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
  {
    "slug": "rossi",
    "name": "Rossi"
  },
  {
    "slug": "bianchi",
    "name": "Bianchi"
  },
  {
    "slug": "rosati",
    "name": "Rosati"
  },
  {
    "slug": "bollicine",
    "name": "Bollicine"
  },
  {
    "slug": "classici",
    "name": "Classici"
  },
  {
    "slug": "selezioni",
    "name": "Selezioni"
  },
  {
    "slug": "edizione-limitata",
    "name": "Edizione Limitata"
  },
  {
    "slug": "magnum",
    "name": "Magnum"
  },
  {
    "slug": "wine-box",
    "name": "Wine Box"
  },
  {
    "slug": "birra",
    "name": "Birra"
  }
]

export const catalogWines: CatalogWine[] = [
  {
    "id": 60733,
    "name": "l'Oriou Birra Artigianale",
    "slug": "oriou-birra-artigianale",
    "price": "5,85 €",
    "category": "birra",
    "categories": [
      "birra"
    ],
    "img": "https://grosjeanvins.it/files/2025/12/Oriou_png_singola-1-600x1046.png",
    "permalink": "https://grosjeanvins.it/prodotto/oriou-birra-artigianale/"
  },
  {
    "id": 60097,
    "name": "Gewurztraminer Vallée D’Aoste DOC",
    "slug": "gewurztraminer-vallee-daoste-doc",
    "price": "18,50 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Chardonnay-min-600x1697.png",
    "permalink": "https://grosjeanvins.it/prodotto/gewurztraminer-vallee-daoste-doc/"
  },
  {
    "id": 59605,
    "name": "HERACO Valle d'Aosta DOC Rosso",
    "slug": "heraco-valle-daosta-doc-rosso",
    "price": "47,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2025/01/Heraco-scontorno-138x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/heraco-valle-daosta-doc-rosso/"
  },
  {
    "id": 59507,
    "name": "Montmary Rosé Metodo Classico Extra Brut Magnum",
    "slug": "montmary-rose-metodo-classico-extra-brut-magnum",
    "price": "54,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "magnum",
      "rosati"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Montmary-copia-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/montmary-rose-metodo-classico-extra-brut-magnum/"
  },
  {
    "id": 59501,
    "name": "Mas Du Jario Blanc De Noir Extra Brut Magnum",
    "slug": "mas-du-jario-blanc-de-noir-extra-brut-magnum",
    "price": "69,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "magnum"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/mas_du_jario-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/mas-du-jario-blanc-de-noir-extra-brut-magnum/"
  },
  {
    "id": 59012,
    "name": "Scatola Mista – Les Vins Introuvables",
    "slug": "les_vins_introuvables",
    "price": "235,00 €",
    "category": "wine-box",
    "categories": [
      "wine-box"
    ],
    "img": "/images/catalog/scatola-mista.png",
    "permalink": "https://grosjeanvins.it/prodotto/les_vins_introuvables/"
  },
  {
    "id": 58749,
    "name": "Donnas Superieur Vallée d'Aoste DOC",
    "slug": "donnas",
    "price": "39,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2024/05/Donnas-2021-1-600x1333.png",
    "permalink": "https://grosjeanvins.it/prodotto/donnas/"
  },
  {
    "id": 58440,
    "name": "Flétry au Vent – Vino da Uve Stramature",
    "slug": "fletry-au-vent",
    "price": "23,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2024/02/Fletry-145x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/fletry-au-vent/"
  },
  {
    "id": 221,
    "name": "Pinot Noir Vigne Tzeriat Vallée d’Aoste DOC",
    "slug": "pinot-noir-vigne-tzeriat-vallee-daoste-doc",
    "price": "25,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Pinot-Noir-Tzeriat-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/pinot-noir-vigne-tzeriat-vallee-daoste-doc/"
  },
  {
    "id": 425,
    "name": "Pinot Noir Les Freres Vallée D’Aoste DOC",
    "slug": "pinot-noir-les-freres-vallee-daoste-doc",
    "price": "40,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Pinot-Noir-Les-Freres-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/pinot-noir-les-freres-vallee-daoste-doc/"
  },
  {
    "id": 423,
    "name": "Petite Arvine Les Freres Vallée D'Aosta DOC",
    "slug": "petite-arvine-les-freres",
    "price": "38,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Petite-Arvine-Les-Freres-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/petite-arvine-les-freres/"
  },
  {
    "id": 415,
    "name": "Forcé 1968 Extra Dry Vino spumante Metodo Martinotti",
    "slug": "force-1968-extra-dry-vino-spumante-metodo-martinotti",
    "price": "12,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/force_1968-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/force-1968-extra-dry-vino-spumante-metodo-martinotti/"
  },
  {
    "id": 401,
    "name": "Mas Du Jario Blanc De Noir Extra Brut",
    "slug": "mas-du-jario-blanc-de-noir-extra-brut",
    "price": "30,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/mas_du_jario-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/mas-du-jario-blanc-de-noir-extra-brut/"
  },
  {
    "id": 391,
    "name": "Clairetz Vino Rosso",
    "slug": "clairet",
    "price": "35,00 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/clairet-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/clairet/"
  },
  {
    "id": 389,
    "name": "Chambave Muscat Vallée D’Aoste DOC",
    "slug": "chambave-muscat-vallee-daoste-doc",
    "price": "19,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/chambave_muscat-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/chambave-muscat-vallee-daoste-doc/"
  },
  {
    "id": 385,
    "name": "Gamay Vallée d’Aoste DOC",
    "slug": "gamay-vallee-daoste-doc",
    "price": "12,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Gamay-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/gamay-vallee-daoste-doc/"
  },
  {
    "id": 381,
    "name": "Chardonnay Vallée D’Aoste DOC",
    "slug": "chardonnay-vallee-daoste-doc",
    "price": "13,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Chardonnay-min-600x1697.png",
    "permalink": "https://grosjeanvins.it/prodotto/chardonnay-vallee-daoste-doc/"
  },
  {
    "id": 379,
    "name": "Pinot Noir Vallée d’Aoste DOC",
    "slug": "pinot-noir-vallee-daoste-doc",
    "price": "17,50 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Pinot-Noir-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/pinot-noir-vallee-daoste-doc/"
  },
  {
    "id": 377,
    "name": "Torrette Vallée d’Aoste DOC",
    "slug": "torrette-vallee-daoste-doc",
    "price": "14,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Torrette-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/torrette-vallee-daoste-doc/"
  },
  {
    "id": 375,
    "name": "Fumin Vallée d’Aoste DOC",
    "slug": "fumin-vallee-daoste-doc",
    "price": "21,00 €",
    "category": "classici",
    "categories": [
      "classici",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/fumin-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/fumin-vallee-daoste-doc/"
  },
  {
    "id": 235,
    "name": "Cornalin Vigne Rovettaz Vallée d’Aoste DOC",
    "slug": "cornalin-vigne-rovettaz-vallee-daoste-doc",
    "price": "21,80 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Cornalin-Rovettaz-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/cornalin-vigne-rovettaz-vallee-daoste-doc/"
  },
  {
    "id": 227,
    "name": "Torrette Superieur Vigne Rovettaz Vallée d’Aoste DOC",
    "slug": "torrette-superieur-vigne-rovettaz-vallee-daoste-doc",
    "price": "22,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/torrette_superieur_rovettaz-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/torrette-superieur-vigne-rovettaz-vallee-daoste-doc/"
  },
  {
    "id": 225,
    "name": "Petite Arvine Chatel Argent Vallée d'Aoste DOC",
    "slug": "petite-arvine-chatel-argent",
    "price": "18,50 €",
    "category": "classici",
    "categories": [
      "classici",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Petite-Arvine-Chatel-Argent-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/petite-arvine-chatel-argent/"
  },
  {
    "id": 223,
    "name": "Prëmetta Vallée d’Aoste DOC",
    "slug": "premetta-vallee-daoste-doc",
    "price": "23,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rosati"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Premetta-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/premetta-vallee-daoste-doc/"
  },
  {
    "id": 219,
    "name": "Montmary Rosé Metodo Classico Extra Brut",
    "slug": "montmary-rose-metodo-classico-extra-brut",
    "price": "23,00 €",
    "category": "bollicine",
    "categories": [
      "bollicine",
      "rosati"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Montmary-copia-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/montmary-rose-metodo-classico-extra-brut/"
  },
  {
    "id": 217,
    "name": "Fumin Vigne Rovettaz Vallée d’Aoste DOC",
    "slug": "fumin-vigne-rovettaz-vallee-daoste-doc",
    "price": "30,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Fumin-Rovettaz-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/fumin-vigne-rovettaz-vallee-daoste-doc/"
  },
  {
    "id": 215,
    "name": "Chardonnay Le Vin de Michel Vallée D’Aoste DOC",
    "slug": "chardonnay-le-vin-de-michel-vallee-daoste-doc",
    "price": "33,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Chardonnay-le-Vin-de-Michel-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/chardonnay-le-vin-de-michel-vallee-daoste-doc/"
  },
  {
    "id": 104,
    "name": "Petite Arvine Vigne Rovettaz Vallée D’Aoste DOC",
    "slug": "petite-arvine-vigne-rovettaz-vallee-daoste-doc",
    "price": "23,00 €",
    "category": "selezioni",
    "categories": [
      "selezioni",
      "bianchi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/petit_arvine_vigne_rovettaz-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/petite-arvine-vigne-rovettaz-vallee-daoste-doc/"
  },
  {
    "id": 80,
    "name": "Fumin #50anniDiVini",
    "slug": "fumin-50annidivini",
    "price": "35,50 €",
    "category": "edizione-limitata",
    "categories": [
      "edizione-limitata",
      "rossi"
    ],
    "img": "https://grosjeanvins.it/files/2023/01/Fumin-50-anni-divini-min-148x350.png",
    "permalink": "https://grosjeanvins.it/prodotto/fumin-50annidivini/"
  }
]
