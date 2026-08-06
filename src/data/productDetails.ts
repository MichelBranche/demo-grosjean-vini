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

export const productDetails: Record<string, ProductDetails> = {
  "alpage-grape-ale": {
    "lead": "L’Alpage Grape Ale nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosato luminoso",
      "nose": "Frutti rossi e fermentazione",
      "palate": "Secco, scorrevole, equilibrato"
    }
  },
  "gewurztraminer-altiere": {
    "lead": "Gewürztraminer Altiere nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "heritage-rouge-reserve": {
    "lead": "Héritage Rouge Réserve nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "mont-blanc-rose-magnum": {
    "lead": "Mont Blanc Rosé Magnum nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "blanc-de-roche-magnum": {
    "lead": "Blanc de Roche Magnum nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "coffret-altura": {
    "lead": "Coffret Altura nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "noir-des-cretes": {
    "lead": "Noir des Crêtes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "passerille-des-cimes": {
    "lead": "Passerillé des Cimes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "pinot-noir-vigne-haute": {
    "lead": "Pinot Noir Vigne Haute nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "pinot-noir-les-freres": {
    "lead": "Pinot Noir Les Frères nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "arvine-blanche-les-freres": {
    "lead": "Arvine Blanche Les Frères nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "force-1972-extra-dry": {
    "lead": "Force 1972 Extra Dry nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "blanc-de-roche-extra-brut": {
    "lead": "Blanc de Roche Extra Brut nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "clairet-des-cimes": {
    "lead": "Clairet des Cimes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "muscat-des-alpes": {
    "lead": "Muscat des Alpes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "gamay-saint-martin": {
    "lead": "Gamay Saint-Martin nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "chardonnay-altitude": {
    "lead": "Chardonnay Altitude nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "pinot-noir-classique": {
    "lead": "Pinot Noir Classique nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "rouge-des-cimes": {
    "lead": "Rouge des Cimes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "noir-d-altitude": {
    "lead": "Noir d’Altitude nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "rouge-roche-cru": {
    "lead": "Rouge Roche Cru nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "rouge-des-cimes-superieur": {
    "lead": "Rouge des Cimes Supérieur nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "arvine-blanche-chatel": {
    "lead": "Arvine Blanche Châtel nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "rose-des-cretes": {
    "lead": "Rosé des Crêtes nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "mont-blanc-rose-extra-brut": {
    "lead": "Mont Blanc Rosé Extra Brut nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosa chiaro brillante",
      "nose": "Frutti rossi e note di pan brioche",
      "palate": "Vivace, fine, persistente"
    }
  },
  "noir-d-altitude-cru": {
    "lead": "Noir d’Altitude Cru nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  },
  "cuvee-du-fondateur": {
    "lead": "Cuvée du Fondateur nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "arvine-blanche-cru": {
    "lead": "Arvine Blanche Cru nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Giallo paglierino luminoso",
      "nose": "Fiori bianchi, agrumi e pietra focaia",
      "palate": "Fresco, sapido, lungo"
    }
  },
  "noir-d-altitude-anniversaire": {
    "lead": "Noir d’Altitude Anniversaire nasce sui pendii di Saint-Martin: uve di montagna, raccolte a mano e vinificate in cantina con pazienza alpina.",
    "story": [
      "Il clima fresco e l’escursione termica giorno–notte preservano freschezza e aromaticità. In cantina lavoriamo con interventi minimi, per lasciare parlare il luogo.",
      "Una bottiglia pensata per la tavola e per chi cerca vini di montagna vivi, precisi e senza artifici."
    ],
    "tasting": {
      "color": "Rosso rubino",
      "nose": "Frutti di bosco, spezie e viola",
      "palate": "Morbido, tannini eleganti, finale minerale"
    }
  }
}
