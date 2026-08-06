import { mkdirSync, writeFileSync, existsSync, statSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const img = (...p) => join(root, "public", "images", ...p)

mkdirSync(img("bottles"), { recursive: true })
mkdirSync(img("catalog"), { recursive: true })

const assets = [
  { path: "hero-clean.jpg", url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2000&q=80" },
  { path: "hero-dark.jpg", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2000&q=80" },
  { path: "hero-vigna.png", url: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1600&q=80" },
  { path: "hero-bn.png", url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=80" },
  { path: "hero-degusta.jpg", url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80" },
  { path: "vini.jpg", url: "https://images.unsplash.com/photo-1553361371-9b22f626e83b?auto=format&fit=crop&w=1600&q=80" },
  { path: "rovettaz.jpg", url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80" },
  { path: "picnic.jpg", url: "https://images.unsplash.com/photo-1528823872057-9c018a7a6403?auto=format&fit=crop&w=1200&q=80" },
  { path: "degustazione.png", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=80" },
  { path: "degustazione.jpg", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=80" },
  { path: "degustavigna.jpg", url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=80" },
  { path: "cantina.webp", url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1400&q=80" },
  { path: "visione-uve.png", url: "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=1200&q=80" },
  { path: "pair-muscat.png", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80" },
  { path: "pair-chardonnay.png", url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=80" },
  { path: "pair-michel.png", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80" },
  { path: "pair-clairetz.png", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80" },
  { path: "catalog/scatola-mista.png", url: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=1000&q=80" },
]

const bottleUrls = [
  "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1553361371-9b22f626e83b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1569529465841-dfecdabaa8fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1547595628-c61a29f80f93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1528823872057-9c018a7a6403?auto=format&fit=crop&w=600&q=80",
]

for (let i = 0; i < 30; i++) {
  assets.push({ path: `bottles/bottle-${String(i + 1).padStart(2, "0")}.jpg`, url: bottleUrls[i % bottleUrls.length] })
}

assets.push(
  { path: "bottle-muscat.png", url: bottleUrls[0] },
  { path: "bottle-chardonnay.png", url: bottleUrls[1] },
  { path: "bottle-michel.png", url: bottleUrls[2] },
  { path: "bottle-clairetz.png", url: bottleUrls[3] },
)

async function download(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 5000) {
    console.log("skip", dest)
    return
  }
  console.log("get", dest)
  const res = await fetch(url, { headers: { "User-Agent": "MaisonAlturaDemo/1.0" }, redirect: "follow" })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

for (const a of assets) {
  try { await download(a.url, img(a.path)) } catch (e) { console.error("FAIL", a.path, e.message) }
}
console.log("done")
