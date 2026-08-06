import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

const root = "c:/Users/miche/Desktop/demo-cantina-altura"

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git") continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(tsx?|jsx?|css|html|md|json|mjs)$/.test(name)) out.push(p)
  }
  return out
}

const replacements = [
  [/alturavins\.it/gi, "maisonaltura.demo"],
  [/Maison Altura/g, "Maison Altura"],
  [/Altura®/g, "Altura®"],
  [/ALTURA®/g, "ALTURA®"],
  [/Altura/g, "Altura"],
  [/altura/g, "altura"],
  [/ALTURA/g, "ALTURA"],
  [/Valle d['']Aosta/gi, "Alpi"],
  [/Vallee d['']Aoste/gi, "Alpes"],
  [/the Alps/gi, "the Alps"],
  [/alpine[oa]?/gi, "alpine"],
  [/alpin/gi, "alpin"],
  [/Saint-Martin · Alpi/g, "Saint-Martin · Alpi"],
  [/Saint-Martin · Alps/g, "Saint-Martin · Alps"],
  [/Saint-Martin · Alpes/g, "Saint-Martin · Alpes"],
  [/Saint-Martin · Alpstal/g, "Saint-Martin · Alpen"],
  [/\bQuart\b/g, "Saint-Martin"],
  [/Les Hauts/g, "Les Hauts"],
  [/racines hautes, regards loin/gi, "racines hautes, regards loin"],
  [/racines hautes, regards loin/g, "Racines hautes, regards loin"],
  [/Studio Demo/g, "Studio Demo"],
  [/michelbranche\.it/gi, "example.com"],
  [/Cimes/g, "Cimes"],
  [/Étienne/g, "Étienne"],
  [/Léa, Paul, Nina e Hugo/g, "Léa, Paul, Nina e Hugo"],
  [/Léa, Paul, Nina and Hugo/g, "Léa, Paul, Nina and Hugo"],
  [/Brasserie des Alpes/g, "Brasserie des Alpes"],
  [/l['']Alpage/gi, "L’Alpage"],
  [/Alpage/g, "Alpage"],
  [/Cuvée du Fondateur/g, "Cuvée du Fondateur"],
  [/Clairet des Cimes des Cimes/g, "Clairet des Cimes des Cimes"],
  [/Clairet des Cimes/g, "Clairet des Cimes des Cimes"],
  [/Muscat des Alpes/g, "Muscat des Alpes"],
  [/Noir des Crêtes/g, "Noir des Crêtes"],
  [/Rouge des Cimes/g, "Rouge des Cimes"],
  [/Noir d’Altitude/g, "Noir d’Altitude"],
  [/Rouge Roche/g, "Rouge Roche"],
  [/Arvine Blanche/g, "Arvine Blanche"],
  [/Rosé des Crêtes/g, "Rosé des Crêtes"],
  [/Mont Blanc/g, "Mont Blanc"],
  [/Blanc de Roche/g, "Blanc de Roche"],
  [/Passerillé des Cimes/g, "Passerillé des Cimes"],
  [/Héritage Rouge/g, "Héritage Rouge"],
  [/Force 1972/g, "Force 1972"],
  [/Coffret Altura/g, "Coffret Altura"],
  [/Coffret Altura/g, "Coffret Altura"],
  [/1972/g, "1972"],
  [/2015/g, "2015"],
  [/P\.IVA 00536390073/g, "P.IVA 00000000000"],
  [/Società Agricola Altura Vins s\.s\./g, "Maison Altura S.r.l. — demo"],
  [/Società Agricola Maison Altura s\.s\./g, "Maison Altura S.r.l. — demo"],
  [/\+39 000 000 0000/g, "+39 000 000 0000"],
  [/info@altura\.demo/gi, "hello@maisonaltura.demo"],
  [/info@maisonaltura\.demo/gi, "hello@maisonaltura.demo"],
  [/altura:page-ready/g, "altura:page-ready"],
  [/altura:page-ready/g, "altura:page-ready"],
]

for (const file of walk(root)) {
  let text = readFileSync(file, "utf8")
  const before = text
  for (const [re, to] of replacements) text = text.replace(re, to)
  if (text !== before) {
    writeFileSync(file, text)
    console.log("updated", file.replace(root, ""))
  }
}

writeFileSync(join(root, "package.json"), JSON.stringify({
  name: "maison-altura-demo",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc -b && vite build",
    lint: "oxlint",
    preview: "vite preview"
  },
  dependencies: {
    "@gsap/react": "^2.1.2",
    "@vercel/analytics": "^2.0.1",
    gsap: "^3.15.0",
    lenis: "^1.3.25",
    react: "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.18.2"
  },
  devDependencies: {
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^24.13.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    oxlint: "^1.71.0",
    tailwindcss: "^4.3.3",
    typescript: "~6.0.2",
    vite: "^8.1.1"
  }
}, null, 2) + "\n")

writeFileSync(join(root, "index.html"), `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/images/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Maison Altura — demo neutra di cantina alpina. Viticoltura di montagna, racconto e catalogo."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Instrument+Serif:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <title>Maison Altura · Demo cantina</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`)

writeFileSync(join(root, "README.md"), `# Maison Altura — demo cantina neutra

Clone stilistico del progetto Altura, **senza riferimenti al brand originale**.

- Brand fittizio: **Maison Altura** (Saint-Martin, Alpi)
- Foto stock Unsplash (vigneti / bottiglie / cibo)
- Catalogo e testi demo

\`\`\`bash
npm install
npm run dev
\`\`\`
`)

console.log("rebrand pass done")
