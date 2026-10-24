# Source transcription — Lecture 5, slides 22–29 (Gibbs free energy) + Lecture 6, slide 5 + Exercise classes 5 (pp. 9–13) and 6

Slide numbers = PDF pages (the printed header «Lecture #5, p. k» is k = slide − 1). Gray/handwritten notes by the lecturer are marked «handwritten». Exercise pages = pages of `Exercise_5_filled.pdf` (TA Clara Henricsson, handwritten on a tablet).

## Lecture 5

### Slide 22 (p. 21) — Determining ΔS for Chemical Reactions
- «Last lecture»: reaction a₁R₁ + a₂R₂ + a₃R₃ + ⋯ → b₁P₁ + b₂P₂ + b₃P₃ + ⋯, where aᵢ, bⱼ are stoichiometric coefficients and Rᵢ, Pⱼ are reactants and products.
- «We showed»: ΔH°_rxn = Σ_{products, j} bⱼ ΔH°_{f,j} − Σ_{reactants, i} aᵢ ΔH°_{f,i}.
- «Similarly»: ΔS° = Σ_{products, j} bⱼ S°ⱼ − Σ_{reactants, i} aᵢ S°ᵢ. Bracket on the right: «Get ΔH°_f and S° values from tables».
- S° ≡ standard molar entropies → S for substance in its standard state.
- Handwritten: «Determined by experiments. Method beyond this course.» (pointing to S°).

### Slide 23 (p. 22) — Determining ΔS for Chemical Reactions?
- Ex: N₂(g) + 3 H₂(g) → 2 NH₃(g), ΔS°(298 K) = ?
- ΔS° = 2 S°(NH₃) − [S°(N₂) + 3 S°(H₂)] = 2·193 J mol⁻¹K⁻¹ − 192 J mol⁻¹K⁻¹ − 3·131 J mol⁻¹K⁻¹ = −199 J mol⁻¹K⁻¹. (Handwritten: «Values from Table 19.1 in Brown».)
- Box: «Note: ΔS° is negative. This is consistent with our discussion above. Namely, as the number of gas species is reduced by the reaction, the number of microstates, and hence S, also decreases.»
- Figure: none.

### Slide 24 (p. 23) — What Does This Mean for Spontaneity for this Reaction?
- Handwritten on top: «What does this mean for spontaneity? Is the reaction N₂ + 3H₂ → 2NH₃ spontaneous? We just determined ΔS_sys = −199 J/K.»
- Ex: N₂(g) + 3 H₂(g) → 2 NH₃(g), ΔS_sys = −199 J mol⁻¹K⁻¹, ΔS_surr = ?
- ΔS_surr = q_surr/T = −q_sys/T = −ΔH_sys/T = −ΔH°_rxn/T. (Handwritten: «See Brown p. 925. Calculate like in Lecture #4».)
- ΔH°_rxn = −92.4 kJ mol⁻¹ → ΔS_surr = −ΔH°_rxn/T = 92.4 kJ mol⁻¹/298 K = +310 J mol⁻¹K⁻¹.
- ΔS_univ = ΔS_sys + ΔS_surr = [−199 + 310] J mol⁻¹K⁻¹ = +111 J mol⁻¹K⁻¹ — «spontaneous!» (Handwritten: «Because our criterion is ΔS_univ is positive. Again, this does not tell us how fast reaction will be.»)
- Box: «But this criterion for spontaneity, ΔS_univ > 0, is complicated! Must analyze both system and surroundings and combine to get ΔS_univ.» «Does a better criterion exist to predict spontaneity of process?» (red). Handwritten: «Turns out yes!»

### Slide 25 (p. 24) — Gibbs Free Energy (handwritten page)
- «To find this better criterion, we need to introduce another key state function:»
- **Gibbs Free Energy** — «Spontaneity driven by lowering H or increasing S». (Handwritten margin: «Spontaneous processes decrease energy and/or increase disorder»; «Auf Deutsch: "Gibbs-Energie" oder "freie Enthalpie"».)
- «Let's combine: G ≡ H − TS where G is Gibbs Free Energy.»
- «Why?» ΔS_univ = ΔS_sys + ΔS_surr = ΔS_sys + (−ΔH_sys)/T   (at constant T, P)
- «Multiply by −T ⇒ −TΔS_univ = ΔH_sys − TΔS_sys»; «At constant T ⇒ ΔG_sys = ΔH_sys − TΔS_sys»; «Compare!»
- «Spontaneous process requires ΔS_univ > 0. Thus…» (handwritten: «Since T > 0»).
- Note: «We call ΔG_sys simply ΔG».
- Handwritten: «Josiah Willard Gibbs (1839–1903), American. First to be awarded American doctorate in engineering (1863)».

### Slide 26 (p. 25) — Gibbs Free Energy
- G ≡ H − TS ⇒ ΔG = ΔH − TΔS at constant T, P.
- If ΔG < 0 ⇒ process is spontaneous; ΔG > 0 ⇒ process is nonspontaneous (handwritten: «Work would be needed to make process occur»). Grey bubble: «More convenient criterion! ΔG only relates to system».
- Also if ΔG < 0 ⇒ process is irreversible; ΔG = 0 ⇒ process is reversible (at constant T, P).
- «Why is G called "free" energy?» «Can show that maximum amount of work we can extract from process at constant T, P is ΔG.» Handwritten: «e.g. a chemical reaction»; «So reactions with large negative ΔG are useful!»; «ΔG = −w_max».

### Slide 27 (p. 26) — Standard Free Energy of Formation
- «Like ΔH°_f, we can define ΔG°_f:» ΔG°_f ≡ free energy change to form a substance from its elements under standard conditions (1 atm and 25 °C).
- ΔG°_f = 0 for elements in their standard state.
- Other values for ΔG°_f found in tables (Appendix C in Brown).
- (red) «We can use the ΔG°_f values to determine ΔG°_rxn for any reaction».

### Slide 28 (p. 27) — Summary of ΔH°_rxn, ΔS°, and ΔG°_rxn
- For reaction a₁R₁ + … → b₁P₁ + …
- Enthalpy ΔH°_rxn = Σ_products bⱼ ΔH°_{f,j} − Σ_reactants aᵢ ΔH°_{f,i}
- Entropy ΔS° = Σ_products bⱼ S°ⱼ − Σ_reactants aᵢ S°ᵢ
- Gibbs free energy ΔG°_rxn = Σ_products bⱼ ΔG°_{f,j} − Σ_reactants aᵢ ΔG°_{f,i}
- Bracket: «Get ΔH°_f, S°, ΔG°_f values from tables».

### Slide 29 (p. 28) — Importance of Temperature (ΔG = ΔH − TΔS, «Spontaneous for ΔG < 0»)
- «ΔG depends on temperature, so how does T affect spontaneity of reaction?»
- Table (columns ΔH, ΔS, −TΔS, ΔG = ΔH − TΔS, Reaction Characteristics):
  1. −, +, −, − : Spontaneous at all temperatures
  2. +, −, +, + : Nonspontaneous at all temperatures
  3. −, −, +, + or − : Spontaneous at low T; nonspontaneous at high T
  4. +, +, −, + or − : Spontaneous at high T; nonspontaneous at low T
- Ex 1: 2 O₃(g) → 3 O₂(g) — Spontaneity favored by both enthalpy and entropy.
- Ex 2: 3 O₂(g) → 2 O₃(g) — favored by neither enthalpy nor entropy.
- Ex 3: H₂O(l) → H₂O(s) — favored only by enthalpy.
- Ex 4: H₂O(s) → H₂O(l) — favored only by entropy.
- Handwritten: «The −TΔS term becomes increasingly negative as T goes up. Eventually, a temperature is reached where −TΔS compensates for ΔH > 0. That's when the ice melts! It's all thermodynamics».
- No numbers on the slide (no ΔH, ΔS values for the examples).

### Slide 30 (p. 29) — Next time: electronic structure and periodic table; «Baby quantum mechanics».

## Lecture 6, slide 5 (p. 4)
Identical to lecture 5, slide 29 («Importance of Temperature», table 1–4, Ex 1–4, same handwritten note about the ice).

## Exercise class 5 (pp. 5–13) — the parts used here
- p. 7 «5.5 Entropy of reaction»: ΔS_system = q/T_sys, ΔS_surr = −q/T_surr (q = heat transferred to the system); ΔS_univ = ΔS_sys + ΔS_surr; > 0 spontaneous, irreversible, real; = 0 reversible («fake»); < 0 non-spontaneous, irreversible, real. 2nd law: «the entropy of the universe increases for any spontaneous process».
- p. 8: Exercise 4 (true/false), «entropy of reaction (like last week enthalpy)»: ΔS°_rxn = Σ_products Sᵢ° − Σ_reactants Sᵢ°; ° means standard temperature and pressure, 25 °C; if A+B→C has ΔS°_rxn then C→A+B has −ΔS°_rxn; and (1/n)(A+B→C) has (1/n)ΔS°_rxn. «Alternative, but almost never used»: ΔS = S_final − S_initial = k_B ln W_final − k_B ln W_initial = k_B ln(W_final/W_initial).
- p. 9 «5.6 Gibbs Free Energy»: «having to calculate ΔS_sys and ΔS_surr to determine if a process is spontaneous is tedious, which is why we use a concept called Gibbs free energy. Enthalpy represents the total energy in the system.» G = the portion of that energy that can actually be used to do work → «useful energy» ⇒ criterion for spontaneity. ΔG_sys = ΔH_sys − T·ΔS_sys (G is a state function). «the − accounts for the decrease in energy that is available to do work when energy spreads out (ΔS_sys > 0)». «ΔG_sys is the maximum amount of work extractable from the process». Sign: ΔG > 0 nonspontaneous, ΔG = 0 reversible, ΔG < 0 spontaneous. Exercise 5 (together): ice melting to water is endothermic, so ΔH > 0; ΔG = ΔH − TΔS; spontaneous if ΔG < 0; spontaneous if the temperature is high.
- p. 10 «When is a reaction spontaneous?»: ΔG = ΔH − TΔS with the table of slide 29 (the TA numbers the rows ④ ① ③ ② in the order of the printed table: ④ = lecture row 1, ① = row 2, ③ = row 3, ② = row 4). Sketch of ΔG against T: straight lines starting at ΔH on the vertical axis; shaded blue above the T axis «ΔG > 0 nonspontaneous», yellow below «ΔG < 0 spontaneous», «ΔG = 0» on the axis (purple dots where lines cross). Red lines: «negative slope, ΔS > 0»; green lines: «positive slope, ΔS < 0». «We can find the temperature at which a spontaneous reaction turns non-spontaneous or vice-versa by setting ΔG = 0.»
- p. 11 «5.7 Gibbs free energy of reaction»: ΔG°_f = «1 mole of substance is formed from its elements at STP»; ΔG°_f = 0 if substance in elemental form. ΔG°_rxn = Σ_products ΔG°_{f,i} − Σ_reactants ΔG°_{f,i}; ° means at standard temperature and pressure; reversal changes the sign; scaling by 1/n scales ΔG. «because ΔG = ΔH − TΔS we can write» ΔG°_rxn = (Σ_products ΔH°_f − Σ_reactants ΔH°_f) − T·(Σ_products S° − Σ_reactants S°).
- p. 12 «Useful Info Sheet – Appendix C»: Brown's table of thermodynamic quantities at 298.15 K (ΔH°_f, ΔG°_f in kJ/mol, S° in J/(mol·K)). Values used in the lesson (read from the page): Zn(s) 0, 0, 41.63; ZnO(s) −348.0, −318.2, 43.9; NaBr(s) −361.4, −349.3, 86.82; Na(g) 107.7, 77.3, 153.7; Br₂(g) 30.71, 3.14, 245.3; O₂(g) 0, 0, 205.0; O₃(g) 142.3, 163.4, 237.6; N₂(g) 0, 0, 191.50; H₂(g) 0, 0, 130.58; NH₃(g) −46.19, −16.66, 192.5; CaO(s) −635.5, −604.17, 39.75; CO₂(g) −393.5, −394.4, 213.6; CaCO₃(s, calcite) −1207.1, −1128.76, 92.88; SO₂(g) −296.9, −300.4, 248.5; SO₃(g) −395.2, −370.4, 256.2.
- p. 13 Exercise 6 (from Brown; «together»): «Using data from Appendix C, calculate ΔG° for the following reactions. Indicate whether each reaction is spontaneous at 298 K under standard conditions. (a) 2 Zn(s) + O₂(g) → 2 ZnO(s); (b) 2 NaBr(s) → 2 Na(g) + Br₂(g).»
  - a) ΔG°_rxn = −0 − 0 + 2·ΔG°_{f,ZnO} = −636,4 kJ/mol; ΔG°_rxn < 0, spontaneous.
  - b) ΔG°_rxn = −2·ΔG°_{f,NaBr} + 2·ΔG°_{f,Na(g)} + ΔG°_{f,Br₂} = **848,3 kJ/mol** (handwritten; the table values give 856,3, see CH-501); ΔG°_rxn > 0, nonspontaneous.
  - Exercise 7: «a) From the values given for ΔH° and ΔS°, calculate ΔG° for the following reaction at 298 K. b) at what temperature (if any) would the reaction become spontaneous or non-spontaneous?» 2 PbS(s) + 3 O₂(g) → 2 PbO(s) + 2 SO₂(g), ΔH° = −844 kJ; ΔS° = −165 J/K. a) ΔG° = ΔH° − TΔS° = −795 kJ; ΔG°(298 K) < 0, spontaneous. b) ΔG° = ΔH° − TΔS° = −844 kJ + 0,165 kJ/K · T ≐ 0 → T = 844/0,165 K = 5115 K. «for T > 5115 K the reaction is nonspontaneous». Sketch: ΔG against T, rising line from ΔH, marks at 298 K and 5115 K.
- p. 14 «5.8 Summary»: enthalpy H → ΔH ≙ heat flow; entropy S → disorder/chaos; Gibbs free energy G → useful energy. «5.9 Cheatsheet» (two small cheat sheets, not transcribed in detail).
- p. 15 «5.10 Problem Set 5»: review of theory; increasing microstates → entropy; ΔG°_rxn = Σ ΔG°_f(products) − Σ ΔG°_f(reactants) (analogous to ΔS° and ΔH°); ΔG = ΔH − TΔS ≐ 0, enter ΔS and ΔH and solve for T; ΔH°_rxn = Σ … ; ΔH_vap = ΔH°_f Br₂(g) − ΔH°_f Br₂(l); ΔS_vap = q/T = ΔH_vap/T.

## Exercise class 6
Exercise class 6 (14 pp.) covers the quantum mechanics of lecture 6, not the Gibbs recap; see `SOURCE_L6b.md` / `SOURCE_L6c.md`.

## Not on the slides (added in the lesson as «Ergänzung»)
- Numbers for Ex 1–4 of slide 29 (ΔH, ΔS of 2 O₃ → 3 O₂ from Appendix C; ΔH_fus of ice 6,01 kJ/mol, T_m = 273,15 K).
