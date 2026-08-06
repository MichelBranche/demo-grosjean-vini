import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const root = 'c:/Users/miche/Desktop/demo-cantina-altura/src'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|ts)$/.test(name)) out.push(p)
  }
  return out
}

const map = [
  ['CuvÃ©e', 'Cuvée'],
  ['HÃ©ritage', 'Héritage'],
  ['PasserillÃ©', 'Passerillé'],
  ['FrÃ¨res', 'Frères'],
  ['ChÃ¢tel', 'Châtel'],
  ['CrÃªtes', 'Crêtes'],
  ['RosÃ©', 'Rosé'],
  ['GewÃ¼rztraminer', 'Gewürztraminer'],
  ['SupÃ©rieur', 'Supérieur'],
  ['Anniversaire', 'Anniversaire'],
  ['Noir dâ€™Altitude', "Noir d'Altitude"],
  ['Lâ€™Alpage', "L'Alpage"],
  ['dâ€™Altitude', "d'Altitude"],
  ['â€”', '—'],
  ['â€™', "'"],
  ['Â®', '®'],
  ['Â·', '·'],
  ['â‚¬', '€'],
]

for (const file of walk(root)) {
  let t = readFileSync(file, 'utf8')
  const before = t
  for (const [a, b] of map) t = t.split(a).join(b)
  if (t !== before) {
    writeFileSync(file, t)
    console.log('fixed', file)
  }
}
