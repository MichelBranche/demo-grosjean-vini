import { mkdirSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const img = (...p) => join(root, "public", "images", ...p)
mkdirSync(img("bottles"), { recursive: true })

const pool = [
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566994071861-87ece93c5a6a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578911373430-46710a839822?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606676539940-1278092be4c4?auto=format&fit=crop&w=800&q=80",
]

const force = [
  ["hero-clean.jpg", pool[2]],
  ["hero-dark.jpg", pool[0]],
  ["hero-vigna.png", pool[1]],
  ["hero-bn.png", pool[4]],
  ["hero-degusta.jpg", pool[6]],
  ["vini.jpg", pool[0]],
  ["rovettaz.jpg", pool[2]],
  ["picnic.jpg", pool[6]],
  ["degustazione.png", pool[0]],
  ["degustazione.jpg", pool[0]],
  ["degustavigna.jpg", pool[2]],
  ["cantina.webp", pool[3]],
  ["visione-uve.png", pool[5]],
  ["pair-muscat.png", pool[7]],
  ["pair-chardonnay.png", pool[8]],
  ["pair-michel.png", pool[9]],
  ["pair-clairetz.png", pool[10]],
  ["catalog/scatola-mista.png", pool[11]],
  ["bottle-muscat.png", pool[0]],
  ["bottle-chardonnay.png", pool[1]],
  ["bottle-michel.png", pool[2]],
  ["bottle-clairetz.png", pool[3]],
]

for (let i = 0; i < 30; i++) force.push([`bottles/bottle-${String(i+1).padStart(2,"0")}.jpg`, pool[i % pool.length]])

async function dl(url, dest) {
  console.log("overwrite", dest)
  const res = await fetch(url, { headers: { "User-Agent": "MaisonAlturaDemo/1.0" }, redirect: "follow" })
  if (!res.ok) throw new Error(String(res.status))
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

for (const [p, u] of force) {
  try { await dl(u, img(p)) } catch (e) { console.error("FAIL", p, e.message) }
}
console.log("done")
