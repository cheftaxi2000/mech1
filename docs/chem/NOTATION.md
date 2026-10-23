# Chemie — sources, notation, figure conventions (D-027)

**Sources.** Lecture slides of Prof. David J. Norris (ETH, *Chemistry*, HS 2026), lectures 1–6, and the filled-in slides of the exercise classes 1–6 by the teaching assistant Clara Henricsson (handwritten on a tablet; some pages are images only). PDFs are **not committed** (like D-003). The course follows Brown, *Chemistry: The Central Science* (chapter numbers are on the «Announcements» slides). The polybox links for the exercise PDFs were not reachable from the build environment; the uploaded PDFs are the source.

**Chapters = lectures.** `CH1`…`CH6` = lectures 1–6; `pages: 'V<n>/<slides>'` in `curriculum.ts` (slide numbers = PDF page numbers, which repeat the printed «Lecture #n, p. k» numbering). In lessons: `<Src lec={n} p="10–24" />` for lecture slides, `<Src ex={n} p="3" />` for a page of the TA's filled-in exercise slides. Boxes: «Aus der Vorlesung» (`Box kind="lecture"`) quotes lecture slides, «Aus der Übung» (`Box kind="uebung"`) quotes the TA's slides; everything else is a `Box kind="supplement"` («Ergänzung – nicht in den Folien»). Handwriting on the slides is source content.

**Language.** The course is taught in English. Lessons are fully bilingual: German (Swiss orthography) + English; in English mode German terms are not needed (the course terms are English) but in German mode keep the English course term next to the German one at first use: «Stoffmenge (*amount of substance*)». Use `<De en="gloss">…</De>` as in the other subjects where German terms appear in English mode.

**Notation (as in the lecture).** Pressure P, volume V, temperature T (in K), amount n (mol); molar mass M; atomic number Z, mass number A; ideal gas law PV = nRT; partial pressure P_i, mole fraction χ_i; internal energy E (the lecture writes **E**, not U), heat q, work w (sign convention of the course: q, w > 0 when added to the system, ΔE = q + w), enthalpy H, entropy S, Gibbs free energy G; ΔH°_f, ΔH°_rxn, ΔG°, ΔS°; quantum numbers n, ℓ, m_ℓ, m_s; wavelength λ, frequency ν, speed of light c, Planck constant h. Units: SI with L, atm, kJ·mol⁻¹ as on the slides. Write units upright inside KaTeX (`\,\mathrm{kJ\,mol^{-1}}`), numbers with decimal comma in German (`{,}`).

**Colour roles** (CSS variables `--ch-*` in `design.css`, Plot roles `cp cv ct cn ce cs cg`): one system for every figure.

| role | meaning | colour |
|---|---|---|
| `p` | pressure P | blue |
| `v` | volume V | green |
| `t` | temperature T, heat in, hot | red |
| `n` | amount n, number of particles | purple |
| `e` | energy, enthalpy H, work | amber |
| `s` | entropy S, spreading out | teal |
| `g` | Gibbs free energy G | indigo |
| `cat` / `an` | cations / anions | red / blue |
| `el` | electrons, light | gold |

Chemistry atoms in pictures: neutral grey-blue spheres with the element symbol in KaTeX (`\mathrm{H}`); element colours only where the lesson needs to tell elements apart (use the classic palette: O red, N blue, C dark grey, H light, Cl green) — always with a legend or the symbol on the sphere.

**Shared code.** `src/chem/` — `elements.ts` (Z, symbol, names, atomic weights, period/group for the elements of the course), `formula.ts` (parse formulae, molar masses, mass fractions), `balance.ts` (balance an equation by exact Gaussian elimination, reusing `src/linalg/frac`), `constants.ts` (R, N_A, k_B, h, c, …), all tested. Plot roles in `src/viz/plot/Plot.tsx`.

**Source problems** get review IDs `CH-001`… in `docs/REVIEW_LOG.md` (the slides contain many typos from OCR/handwriting; only real physical or chemical errors are logged).
