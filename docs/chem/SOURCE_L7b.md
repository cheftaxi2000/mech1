# Source transcription — Lecture 7, slides 17–34 (Lewis structures, resonance, bond enthalpies, VSEPR)

Slide numbers = PDF pages (header «Lecture #7, p. k», k = slide − 1). Lessons: `ch-lewis` (slides 18–24), `ch-bindungsenthalpie` (slides 25–26 + exercise p. 5), `ch-vsepr` (slides 27–33).

### Slide 18 (p. 17) — Drawing Lewis Structures
Handwritten top: «As molecules become more complicated, we need rules to draw Lewis structures …» Rules (Ex: HCN on the right):
1. Sum valence electrons of all atoms — «Factor in overall charge» — 1 + 4 + 5 = 10.
2. Write symbols and connect with single bonds — «Central atom often written first in formula (but not always)» — H–C–N (margin «Each line takes 2 valence electrons»).
3. Complete octets around non-central atoms — «H only needs 2 electrons» — H–C–N with three lone pairs on N.
4. Place remaining valence electrons around central atom — «Even if it then has more than 8 electrons» — margin «None left. Carbon has 4 electrons.»
5. Try multiple bonds if central atom does not have octet — H–C≡N: (boxed). Handwritten: «Final Lewis structure. C, N satisfy octet rule. H has 2 electrons, as required.»

### Slide 19 (p. 18) — Alternative Lewis Structures
Handwritten top: «However, sometimes we can satisfy octet rule with more than one Lewis structure for same molecule. Then, which one is correct?» Sometimes octet rule satisfied with more than one Lewis structure. Which one is correct? Calculate formal charge of each atom in each Lewis structure: **Formal charge on specific atom = (atom's valence e⁻'s) − ½(atom's bonding e⁻'s) − (atom's non-bonding e⁻'s)** (margin «Note: sum of formal charges equals charge on molecule»). Ex: CN⁻ (cyanide ion) [:C≡N:]⁻: C: 4 − ½(6) − 2 = −1; N: 5 − ½(6) − 2 = 0. **Dominant Lewis structure for molecule has formal charges closest to zero and any negative formal charges are on more electronegative atoms** (margins «Given 2 or more alternative Lewis structures», «If there are any negative formal charges»).

### Slide 20 (p. 19) — Alternative Lewis Structures (Brown tables)
CO₂: O=C=O: valence electrons 6 4 6, −(electrons assigned to atom) 6 4 6, formal charge 0 0 0 (boxed red) vs :O–C≡O: 6 4 6 / 7 4 5 / −1 0 +1. Thiocyanate ion NCS⁻: [:N–C≡S:]⁻ −2 0 +1; [N=C=S]⁻ −1 0 0 (boxed red); [:N≡C–S:]⁻ 0 0 −1. Handwritten: «N is more electronegative than S».

### Slide 21 (p. 20) — Oxidation Number vs. Formal Charge vs. Partial Charge
Handwritten top: «We now have three ways to describe the electronic charge on a specific atom in a molecule: oxidation state, formal charge, and partial charge. What's the difference?»
- Oxidation number: charges atoms would have if bonds completely ionic • shared e's given completely to more electronegative atom • overestimates role of electronegativity.
- Formal charge: charges atoms would have if bonding e's shared equally • ignores electronegativity.
- Partial charge: somewhere in between.
- Ex: H–Cl: oxidation numbers +1 −1; formal charges 0 0; actual partial charges δ+ δ−, 0.18+ 0.18−. Handwritten: «These are just bookkeeping systems. Do not represent actual charges.» / «These represent actual charges.»

### Slide 22 (p. 21) — Resonance Structures
Two alternative, but completely equivalent Lewis structures. Ex 1: ozone, O₃: 18 v.e.'s; central O needs 1 single bond and 1 double bond. O=O–O ↔ O–O=O. «Which one is correct?» «Blend of both resonance structures» (boxed red with ↔). «Actual structure»: space-filling picture, both bond lengths 127.8 pm, angle 117°, «Bond lengths same»; margin «Why is molecule bent? See below.»

### Slide 23 (p. 22) — Resonance Structures
Ex 2: benzene, C₆H₆: alternating single and double bonds (two Kekulé structures with H, ↔). «But bond lengths in the ring are same — intermediate between C–C single and double bond.» Skeletal hexagons ↔ or hexagon with circle: «Electrons from double bonds delocalized over the ring».

### Slide 24 (p. 23) — Exceptions to the Octet Rule
Some molecules fail the octet rule. Exceptions involve: **odd number of electrons**: N=O drawn two ways (the unpaired electron on N or on O), 11 v.e.'s (margin «NO ≡ nitric oxide or nitrogen monoxide»). **Less than octet of v.e.'s**: BF₃ «B has 6 electrons»: dominant structure (three single bonds, all formal charges 0) ↔ three less important structures with one B=F double bond (F +1, B −1). **More than octet of v.e.'s**: PF₅ «P has 10 electrons», «Called hypervalent», «Period 3 or beyond».

### Slide 25 (p. 24) — Strengths of Covalent Bonds
Bond enthalpies: enthalpy change for breaking particular bond; positive number: energy required to break bond; values available in tables; give average bond enthalpies for specific bonds; can use to estimate ΔH_rxn: **ΔH_rxn = Σ(enthalpies for bonds broken) − Σ(enthalpies for bonds formed)**. Table 8.3 «Average Bond Enthalpies (kJ/mol)», transcribed completely in `src/chem/bonding.ts` (`BOND_H`): single bonds C–H 413, C–C 348, C–N 293, C–O 358, C–F 485, C–Cl 328, C–Br 276, C–I 240, C–S 259; N–H 391, N–N 163, N–O 201, N–F 272, N–Cl 200, N–Br 243; H–H 436, H–F 567, H–Cl 431, H–Br 366, H–I 299; O–H 463, O–O 146, O–F 190, O–Cl 203, O–I 234; S–H 339, S–F 327, S–Cl 253, S–Br 218, S–S 266; F–F 155, Cl–F 253, Cl–Cl 242, Br–F 237, Br–Cl 218, Br–Br 193, I–Cl 208, I–Br 175, I–I 151; Si–H 323, Si–Si 226, Si–C 301, Si–O 368, Si–Cl 464. Multiple bonds C=C 614, C≡C 839, C=N 615, C≡N 891, C=O 799, C≡O 1072, N=N 418, N≡N 941, N=O 607, O=O 495, S=O 523, S=S 418.

### Slide 26 (p. 25) — Lengths of Covalent Bonds
Table 8.4 «Average Bond Lengths for Some Single, Double, and Triple Bonds» (pm): C–C 154, C=C 134, C≡C 120, C–N 143, C=N 138, C≡N 116, C–O 143, C=O 123, C≡O 113, N–N 147, N=N 124, N≡N 110, N–O 136, N=O 122, O–O 148, O=O 121. «Bonds get shorter between two atoms as number of bonds increases».

### Slide 27 (p. 26) — What About Molecular Shape?
3D versus 2D. Lewis structures useful, but two dimensional. Ex: tetrachloromethane (carbon tetrachloride), CCl₄ (Lewis structure). Show connectivity, bonding, but not shape. Actual shape: four Cl atoms at corners of tetrahedron (ball-and-stick model: «All C–Cl bond lengths 1.78 Å», «All Cl–C–Cl angles 109.5°»; wedge drawing; space-filling model). Shape = connectivity + bond angles. Size = shape + bond lengths. «How can we predict the shape of simple molecules?»

### Slide 28 (p. 27) — Predicting Shapes?
Simple molecules: AB_n. Limited number of possible shapes. Depends on value of n (n = 2: CO₂ AB₂ linear, SO₂ AB₂ bent; n = 3: SO₃ AB₃ trigonal planar, NF₃ AB₃ trigonal pyramidal, ClF₃ AB₃ T-shaped). Most molecules derived from 5 basic shapes: AB₂ linear (180°), AB₃ trigonal planar (120°), AB₄ tetrahedral (109.5°), AB₅ trigonal bipyramidal (90°, 120°), AB₆ octahedral (90°). Box: «By removing atoms we obtain other possible shapes»: tetrahedral → (removal of one corner atom) trigonal pyramidal → (removal of a second corner atom) bent.

### Slide 29 (p. 28) — Why Remove Atoms?
Valence-shell electron-pair repulsion (VSEPR) model. Electrons repel each other. Electron pairs move as far apart as possible. Explains 5 basic shapes and bond angles. In addition to bonds, we also count lone pairs. Electron domains: bonds or "lone pairs" around central atom. Shape determined by number of electron domains around central atom. **Electron-domain geometry** (includes atoms *and* "lone pairs") *versus* **molecular geometry** (includes just atoms).

### Slide 30 (p. 29) — Repulsion of Electron Domains
Balloon analogy: two balloons linear orientation, three balloons trigonal-planar orientation, four balloons tetrahedral orientation. Possible electron-domain geometries (table): 2 linear 180°; 3 trigonal planar 120°; 4 tetrahedral 109.5°; 5 trigonal bipyramidal 120°, 90°; 6 octahedral 90°.

### Slide 31 (p. 30) — Possible Molecular Geometries
Refinements: «Lone pairs take up more space»: CH₄ 109.5°, NH₃ 107°, H₂O 104.5° (wedge drawings with lone-pair lobes). «Multiple bonds take up more space»: phosgene Cl₂C=O: Cl–C–Cl 111.4°, Cl–C=O 124.3° (handwritten «Phosgene: used as a chemical weapon during World War I. ⇒ Responsible for ~85,000 deaths.»). Table: 2 domains linear: 2 bonding, 0 nonbonding → linear (O=C=O). 3 trigonal planar: 3/0 trigonal planar (BF₃), 2/1 bent (NO₂⁻). 4 tetrahedral: 4/0 tetrahedral (CH₄), 3/1 trigonal pyramidal (NH₃), 2/2 bent (H₂O).

### Slide 32 (p. 31) — Predicting Shape with VSEPR Model
Process: 1. Draw Lewis structure. 2. Count electron domains. 3. Determine electron-domain geometry. 4. Determine molecular geometry from position of atoms. «We will practice in exercise and problem set #7». Ex: NH₃: H–N–H with H below and a lone pair on N → tetrahedral (dashed) → trigonal pyramidal (ball-and-stick).

### Slide 33 (p. 32) — Possible Molecular Geometries: Hypervalent atoms
Atoms from period 3 and beyond. Can have more than 4 e⁻ pairs. Lone pairs occupy positions with most space. Table: 5 domains trigonal bipyramidal: 5/0 trigonal bipyramidal (PCl₅), 4/1 seesaw (SF₄), 3/2 T-shaped (ClF₃), 2/3 linear (XeF₂). 6 domains octahedral: 6/0 octahedral (SF₆), 5/1 square pyramidal (BrF₅), 4/2 square planar (XeF₄). Handwritten bottom: «NEXT TIME: Intermolecular interactions. How do molecules attract each other? And how does it affect physical properties?»

### Slide 34 (p. 33) — What We Learned (list). Not used.

## Exercise class 7, pages used here
- **p. 5**: **bond length**: the distance between two bonded atoms → «double bonds are shorter than single bonds» A=A < A–A «(only same atom type, we don't know about A-B)»; «the smaller the atomic radii, the shorter the bond»; «the bond length does not solely depend on ΔEN, but if ΔEN bigger, the bond can be stronger & shorter». **Bond enthalpy**: «to break a covalent bond, we need an energy known as the bond enthalpy. It can be used to approximate reaction enthalpies» (Table 8.3), boxed ΔH_rxn = Σ enthalpies for bonds broken − Σ enthalpies for bonds formed.
- **p. 9 «7.5 Charges in Molecules»**: **oxidation number**: charges atoms would have if they would be completely ionic → shared e⁻ given completely to more electronegative atom → overestimates the role of electronegativity; printed rules box (atoms in elemental form 0; monoatomic ions: ionic charge; nonmetals: O −2 except peroxide −1, H +1 except bonded to metal −1, F −1 always, Cl Br I −1 except bonded to oxygen; sum equals net charge); H–F drawn with +1 / −1 and the bond split towards F. **Formal charge of an atom**: «# ve⁻ of the atom according to the periodic table versus its # ve⁻ in the whole molecule → ignores electronegativity → "equal split"»; boxed FC = #ve − assigned e⁻ = #ve − ½ #bonding e⁻ − #nonbonding e⁻. Exercise 6: table for H–F (ve 1 7, assigned 1 7, FC 0 0) and empty columns for O=C=O and :O–C≡O: (answers: slide 20). **Partial charge**: represents the actual charge, somewhere between formal charge and oxidation number; δ represents the partial charge (H–F with δ⁺ δ⁻).
- **p. 10 «7.6 Lewis structure»**: for 2D visualisation: ① write down the # ve⁻ for every atom ② connect atoms with single bonds and place ve⁻ ③ try using double/triple bonds to fulfill octet rule (HCN: H → 1, C → 4, N → 5; H–C(:)–N: → H–C≡N:). **Resonance structures**: if they are identical: O₃ mirrored, benzene rotated by 60°; «the e⁻ jumps around the bonds». **Alternative structures**: if multiple structures fulfill the octet rule: NCS⁻. **Dominant Lewis structure**: the one where the formal charges are closest to 0 with the negative formal charges on more electronegative atoms ⇒ most stable. «Ions need a bracket and a charge!»
- **p. 11 Exercise 7**: a) valence electrons of O and Xe; b) four Lewis structures K, L, M, N of XeO₃ (K: three single bonds; L: two single, one double; M: two double, one single; N: three double; Xe keeps one lone pair); c) «structure K satisfies the octet rule for each atom»; d) «How many resonance structures does M have?» «three»; e) formal charges for all four (left blank); f) «Which structure minimizes overall formal charges? → this is the structure we should chose! N, 3 double bonds». Shown in the lesson as a worked example (formal charges computed: K +3/−1/−1/−1, L +2/−1/−1/0, M +1/0/0/−1, N 0/0/0/0).
- **p. 12 «7.6 VSEPR model»** (numbered 7.6 a second time): bonding domains: bonds; non-bonding domains: lone pairs. **VSEPR model**: «a 3D representation for a central atom surrounded by identical corner atoms» NH₃: ① draw Lewis structure, 2D ② count # of bonding domains (3) and # of non-bonding domains (1) ③ find geometry with table. «→ electron-pair geometry: only includes the geometry»; «→ molecular geometry: includes bonds and lone pairs» — see CH-014. Table (Electron-pair geometry by number of electron dense areas 2–6, molecular geometry with 0–4 lone pairs; 6 domains with 3 or 4 lone pairs crossed out «not possible»). «lone pairs take up more space than bonds» (CH₄, NH₃, H₂O angles), «double/triple bonds take up more space than single bonds» (phosgene).
- **p. 13**: Exercise 8 (bond angles in trigonal planar, tetrahedral, octahedral, linear), Exercise 9 (geometries for 3/0, 3/1, 2/2 domains) → quiz bank.
- **p. 14 «7.7 Cheatsheet»**: two former students' cheat sheets (Joetan, Schaldach) summarising the lecture; Schaldach: «If atoms have ΔEN > 0.5, partial charges (δ⁺, δ⁻) are formed» and «If ΔEN > 2 the covalent bond has an ionic character». Not used as a source (summaries of the same slides; the 0.5 threshold is not in the lecture).
- **p. 15 «7.8 Problem Set 7»**: hints for the homework (bond enthalpies, Born–Haber, Lewis structures, VSEPR, N₃⁻ bent vs linear). Not used (homework).

## Not on the slides (added as «Ergänzung»)
- Example reactions for the bond-enthalpy estimate: H₂ + Cl₂ → 2 HCl (−184 kJ), CH₄ + 2 O₂ → CO₂ + 2 H₂O(g) (−808 kJ), N₂ + 3 H₂ → 2 NH₃ (−97 kJ), CH₄ + Cl₂ → CH₃Cl + HCl (−104 kJ), all computed with Table 8.3.
- Where lone pairs sit in the trigonal bipyramid (equatorial: fewer 90° neighbours) — the slide only says «positions with most space».
- Pauling EN of Xe (2.6) for the oxidation numbers of XeO₃.
