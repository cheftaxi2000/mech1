# Design — «the margin carries the apparatus»

Replaces D-031 (warm paper, Source Serif + Plex, olive accent), which read as the generic «warm editorial» look. Decision record: `docs/DECISIONS.md` D-032.

## Idea

A Swiss technical manual set in black on white. The page has two columns that never change their roles:

```
 ┌────────────┬──────────────────────────────────────────┬───────────┐
 │ margin     │ text column (≈ 66 characters)            │ figures   │
 │            │                                          │ extend →  │
 │ 2          │ Der Satz vom Momentanzentrum             │           │
 │────────────┼──────────────────────────────────────────┤ (2px rule)│
 │ Aus der    │ ░░ quoted Skript text on a grey field ░░ │           │
 │ Vorlesung  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │           │
 │ S. 26      │                                          │           │
 │            │ explanation in Charter …                 │           │
 │ Miss-      │ ▓▓ pale orange field: the false belief ▓ │           │
 │ verständnis│ ▓▓ and its correction                  ▓ │           │
 │ Herleitung │ ┌ figure / step animation on a grey ─────────────────┐ │
 │            │ └ field: grey = you can interact ────────────────────┘ │
 └────────────┴──────────────────────────────────────────┴───────────┘
```

- **Margin column** (left, 11rem): section numbers, and the label of every block: where it comes from (*Aus der Vorlesung*, S. 26), or what it is (*Ergänzung*, *Missverständnis*, *Herleitung*, *Merke*). Provenance is the product's core rule (never invent what the lecturer said), so it gets its own column instead of a label inside a box.
- **Text column**: prose, formulas, quotations. One left edge for everything you read.
- **Figures** start at the text edge and extend right into the free space.
- Below 1000px the margin folds: labels sit on one line above their block.

## Tokens

Colour: neutral, no warm or cool bias. Colour outside figures means something: orange = misconception, the physics palette = quantities. Everything else is black, white and four greys.

| token | light | dark | role |
|---|---|---|---|
| `--paper` | #ffffff | #121212 | ground |
| `--ink` | #141414 | #ededed | text, headings, active state, primary button |
| `--ink-2` | #3d3d3d | #c8c8c8 | secondary text (captions, lede) |
| `--muted` | #6b6b6b | #9a9a9a | labels, page refs (≥ 4.5:1) |
| `--faint` | #a3a3a3 | #5e5e5e | non-text marks only |
| `--rule` | #e4e4e4 | #2b2b2b | the few hairlines that remain (top bar, tables) |
| `--field` | #f3f3f3 | #1c1c1c | quoted Skript text, figures |
| `--field-2` | #e8e8e8 | #262626 | hover / pressed on a field |
| `--warn` | #a8470a | #f2a05a | misconception label |
| `--warn-bg` | #fdf2e9 | #2a1d12 | misconception field |

Type (two families, five sizes far apart):
- **Archivo** (grotesque, variable 100–900): headings, the margin, UI, captions.
- **Charter** (Charis SIL, 400/700 + italics): everything you read. Matthew Carter drew it for crisp output at small sizes; its x-height (0.482) sits well next to KaTeX (0.431 → math at 1.08em).
- IBM Plex Mono: code only.
- Sizes (desktop/iPad): 13px meta · 15px UI and margin labels · 18px body · 28px h2 · 52px h1. h3 = 19px Archivo 650.

Shape: radius 0 for fields, plates and buttons; circles only for step numbers and slider thumbs. No shadows (sticky notes excepted). No gradients. Hairlines only where they separate chrome from content (top bar, table rows, drawer outline). Sections open with a 1px ink rule across margin + text column; the section number sits in the margin in grey at heading size. Index pages (home, subject TOC) use a 2px rule per subject / chapter.

Spacing (4-base): 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.

## Content types, each with its own setting

| type | setting |
|---|---|
| explanation | Charter on white, no container |
| Skript / Übung quotation | grey field in the text column; label + page in the margin |
| supplement, intuition, tip | no container; label in the margin |
| key points | 3px ink rule on top, label in the margin |
| misconception | pale orange field; orange label in the margin; the false belief set in Archivo 600 |
| derivation | label + toggle in the margin, title as h3, steps numbered in black circles |
| figure / step animation | grey field; controls are flat white tiles on it, chosen = ink; readouts sit on white inside the field; «What to look for» leads in from the margin |
| static figure | on white |

## Chrome

Top bar: white, one hairline, burger · subject / lesson · current section on wide screens · Full|Short and DE|EN as plain words (active = ink, 600). Drawer: lesson outline, subject list, chapters; no status dots unless a lesson is unfinished. Notes button: flat black square, icon only below 1100px.

## Pages

- **Home**: typographic index. Subject name at 2.4rem Archivo, one-sentence description, counts written as a sentence, drawing unframed on the right.
- **Subject page**: chapters in the margin column, lessons in the text column, page refs right-aligned in grey; no row rules.
- **Lesson end**: next lesson as a large link with its chapter.
