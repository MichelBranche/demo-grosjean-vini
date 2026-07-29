type Recipe = {
  wine: string
  dish: string
  img: string
  ingredients: string[]
  steps: string
}

const recipes: Recipe[] = [
  {
    wine: 'Chambave Muscat',
    dish: 'Capesante e gamberi al burro agrumato',
    img: '/images/pair-muscat.png',
    ingredients: [
      '6 capesante',
      '4 gamberi rossi',
      'Burro',
      'Vino bianco',
      'Scorza di limone',
      'Prezzemolo',
      'Erba cipollina',
      'Pepe nero',
      'Sale',
    ],
    steps:
      'Scottare capesante e gamberi per pochi minuti mantenendoli morbidi. Sfuma con un goccio di vino bianco e aggiungi burro, scorza di limone, prezzemolo ed erba cipollina tritati. Servi in una fondina con il fondo di cottura emulsionato e completa con zest di limone e olio extravergine.',
  },
  {
    wine: 'Chardonnay',
    dish: 'Filetto di branzino, crema di patate, asparagi e limone',
    img: '/images/pair-chardonnay.png',
    ingredients: [
      '2 filetti di branzino con pelle',
      '250 g di patate',
      '8 asparagi',
      'Burro',
      'Olio EVO',
      'Timo fresco',
      'Scorza di limone',
      'Sale Maldon e pepe bianco',
    ],
    steps:
      'Cuoci le patate e frullale con una noce di burro fino a ottenere una crema liscia. Sbollenta gli asparagi e ripassali in padella con olio e timo. Rosola il branzino dalla parte della pelle fino a renderla croccante, poi completa la cottura dal lato della polpa. Impiatta con la crema di patate, gli asparagi, il branzino e completa con scorza di limone grattugiata, olio EVO e germogli freschi.',
  },
  {
    wine: 'Chardonnay',
    dish: 'Merluzzo arrosto, crema di zucchine e asparagi',
    img: '/images/pair-michel.png',
    ingredients: [
      '2 tranci di merluzzo',
      '2 zucchine',
      '8 asparagi',
      'Basilico',
      'Olio EVO',
      'Limone',
      'Sale e pepe',
    ],
    steps:
      'Cuoci le zucchine e frullale con basilico e olio fino a ottenere una crema vellutata. Scotta gli asparagi in acqua salata e ripassali velocemente in padella. Arrostisci il merluzzo fino a ottenere una superficie dorata mantenendo l’interno morbido. Servi sulla crema di zucchine con gli asparagi, una fetta di limone, germogli e un filo di olio extravergine.',
  },
  {
    wine: 'Clairet',
    dish: 'Tagliata di manzo, verdure arrosto e rucola',
    img: '/images/pair-clairetz.png',
    ingredients: [
      '350 g di controfiletto di manzo',
      'Pomodorini',
      'Cipolla rossa',
      'Zucchine',
      'Rucola',
      'Rosmarino',
      'Olio EVO',
      'Sale in fiocchi',
      'Pepe nero',
    ],
    steps:
      'Rosola il manzo a fiamma alta e lascialo riposare prima di affettarlo. Arrostisci le verdure in forno con olio e rosmarino. Disponi la tagliata sul piatto con rucola fresca, verdure arrosto e termina con sale Maldon, pepe macinato al momento e un filo di olio extravergine.',
  },
]

export function Pairings() {
  return (
    <section id="abbinamenti" className="bg-paper text-ink">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-5 pb-16 pt-20 text-center sm:px-6 md:gap-5 md:pb-28 md:pt-32">
        <h2 className="font-body text-[clamp(1.65rem,6vw,2.8rem)] font-semibold tracking-tight">
          A tavola
        </h2>
        <p className="font-body text-[0.92rem] leading-relaxed text-ink-2 md:text-base">
          Quattro ricette per accompagnare i vini Grosjean. Dosi per 2 persone.
        </p>
      </div>

      <div className="flex flex-col gap-20 pb-20 md:gap-40 md:pb-40">
        {recipes.map((r, i) => {
          const flip = i % 2 === 1
          return (
            <article
              key={`${r.wine}-${r.dish}`}
              data-pair-article
              className={`mx-auto grid w-full max-w-[1400px] items-start gap-8 px-5 md:grid-cols-2 md:gap-20 md:px-10 lg:gap-28 ${
                flip ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div
                data-pair-frame
                className="relative aspect-[4/5] w-full overflow-hidden md:sticky md:top-24 md:aspect-[5/6]"
              >
                <img
                  data-pair-img
                  src={r.img}
                  alt={`${r.wine} — ${r.dish}`}
                  className="absolute left-0 top-[-12%] h-[124%] w-full object-cover will-change-transform"
                />
              </div>

              <div
                className={`mx-auto max-w-lg pt-1 text-center md:mx-0 md:pt-2 md:text-left ${
                  flip ? 'md:justify-self-end' : ''
                }`}
              >
                <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-2 md:text-[0.7rem]">
                  {r.wine}
                </p>
                <h3 className="mt-3 font-body text-[clamp(1.35rem,5.5vw,2.15rem)] font-semibold leading-[1.15] tracking-tight md:mt-4">
                  {r.dish}
                </h3>

                <div className="mt-8 md:mt-10">
                  <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-2 md:text-[0.7rem]">
                    Ingredienti
                  </p>
                  <ul className="mt-3 space-y-2 border-t border-line pt-4 md:mt-4">
                    {r.ingredients.map((item) => (
                      <li key={item} className="font-body text-[0.92rem] leading-snug text-ink md:text-[0.95rem]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 md:mt-12">
                  <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-2 md:text-[0.7rem]">
                    Preparazione
                  </p>
                  <p className="mt-3 border-t border-line pt-4 font-body text-[0.95rem] leading-[1.7] text-ink-2 md:mt-4 md:text-[0.98rem]">
                    {r.steps}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
