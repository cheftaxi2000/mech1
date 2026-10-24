# Source transcription — Lecture 4, slides 16–30 (+ exercise class 4)

Printed «Lecture #4, p. NN−2». Slides 16–18 and 26–28 contain much handwriting (OCR garbled; read from the images).

## Slide 16 — «Enthalpy, H»
(Rand) «In some sense, thermodynamics is all about defining useful state functions. We will now introduce a second important state function…»
- «H ≡ E + PV» ⇒ internal energy + (pressure · volume). «E, P, and V are state functions ⇒ H is state function.» (Rand: «Why this? We will see…»)
- «Consider piston of area A with gas pushing against constant pressure P.» Drawing: cylinder with gas, piston moves from x_initial to x_final, Δx. (Rand) «Assuming piston is massless», «The expanding gas in piston does work on the surroundings, so w < 0», «Assuming constant pressure».
- «Piston moves Δx. How much work is done?» W = −F·Δx; P = F/A ⇒ F = P·A; W = −P·A·Δx = −P·ΔV «pressure–volume work». (Rand) «Change in volume = ΔV = V_final − V_initial = A(x_final − x_initial)». «If the gas were compressed by piston, then ΔV < 0 and w > 0.» (The lecture writes the work as W here and as w elsewhere.)

## Slide 17 — «ΔH» (handwritten)
(Rand) «Like changes in energy, we will be interested in changes in enthalpy. Why?» «Sum and product rule for derivatives».
- ΔH = Δ(E + PV) = ΔE + PΔV + VΔP = ΔE + PΔV at constant pressure. (Rand) «The two w's cancel because we are assuming only pressure–volume work.»
- = q_p + w + (−w) = q_p. q_p = {heat added to system at constant pressure}.
- «∴ Change in enthalpy is equal to heat q_p at constant pressure.»
- «Because chemistry typically is at constant P and q_p can be measured (Rand: by calorimetry, see below) we can determine ΔH for a reaction!»
- ΔH > 0 ⇒ system gained heat (From surroundings, q_p > 0, ENDOTHERMIC). ΔH < 0 ⇒ system lost heat (To surroundings, q_p < 0, EXOTHERMIC).

## Slide 18 — «Wait! Contradiction?»
- «ΔH = q_p is state function but q is not state function. Contradiction? No, because q_p is heat change at constant P and we assumed only P–V work involved.» (Rand: «In other words, we have assumed specific conditions.») ΔH = q_p = ΔE + PΔV.
- «Similarly, for piston with fixed volume: ΔE = q + w = q − PΔV = q − P·0 = q_v.» (Rand: heat change at constant volume.)
- ΔH − ΔE = PΔV. «If ΔV is small ⇒ ΔH ≈ ΔE.» (Rand: «The difference between ΔH and ΔE is the P–V work done by the system if process done at constant P»; «Many reactions create negligible volume change»; «∴ If ΔV is small, ΔH is good approximation to internal energy change, ΔE».)

## Slide 19 — «Enthalpies of Reaction»
(Rand) «Now we can use these ideas to determine heat absorbed/released by a chemical reaction.»
- ΔH = H_final − H_initial = H_products − H_reactants ≡ ΔH_rxn. aka «Heat of Reaction»; «Enthalpy Diagram»: vertical axis H, level «2 H₂(g) + O₂(g)» (H_initial, reactants), red arrow «reaction» ΔH < 0, level «2 H₂O(g)» (H_final, products). ΔH_rxn = −483.6 kJ·mol⁻¹. «Note: The final state of water is gas. Unlike on p. 13 above.» (Rand) «For 2 mol H₂ + 1 mol O₂», «Our reaction here is 2H₂(g) + O₂(g) → 2H₂O(g); different from (p. 13): 2H₂(g) + O₂(g) → 2H₂O(ℓ)», «Thus, we need to specify state and conditions. We typically assume standard temperature and pressure (STP) unless stated otherwise.»
- Rules for thermochemical reactions: Enthalpy is an extensive property (Rand: «Enthalpy change of reaction is proportional to amounts of substances»); ΔH_forward = −ΔH_reverse (Rand: «equal but opposite enthalpy change for reverse reaction»); ΔH_rxn depends on state (s, ℓ, g) of reactants and products.

## Slide 20 — «Calorimetry»
- Used to measure ΔH ⇒ heat flows change T (Rand: of a substance).
- «Heat Capacity: heat required for ΔT = 1 K for a particular substance.»
- Molar heat capacity C_m [J·mol⁻¹·K⁻¹]: q = n·C_m·ΔT (Rand: per mole; heat flow required to increase n moles of substance by ΔT).
- Specific heat capacity C_s [J·g⁻¹·K⁻¹]: q = m·C_s·ΔT (Rand: per gram; heat flow required to increase m grams of substance by ΔT). (Rand) «Per degree Kelvin is equal to per degree Celsius».
- «Check sign: If ΔT > 0 ⇒ T_final > T_initial ⇒ q > 0» (Rand: heat absorbed by substance).
- Ex: H₂O, C_s = 4.18 J·g⁻¹·K⁻¹ at 14.5 °C. Note: values vary slightly with temperature. «Again, H₂O is unusual molecule. Has large value of C_s.» (Rand) «Imagine climate change without oceans to moderate the effects!»

## Slide 21 — «Ex: Constant Pressure»
(Rand) «Measuring heat flows: we can consider two possibilities…»
- «System (reactants) and surroundings (H₂O) combined in insulated calorimeter.» Drawing: cup with thermometer, stir bar, «reactants in H₂O», insulation, open top. (Rand) «e.g. styrofoam cup», «coffee-cup calorimeter», «rxn ≡ reaction».
- «Because ΔH_rxn = q_rxn = −q_H₂O.» If exothermic: q_rxn < 0 ⇒ q_H₂O > 0 (H₂O warms up). If endothermic: q_rxn > 0 ⇒ q_H₂O < 0 (H₂O is cooled).

## Slide 22 — «Ex: Constant Volume»
- «Can also seal vessel ⇒ “bomb”. Then ΔE_rxn = q_rxn = −q_H₂O.» (Rand: «See p. 16, ΔE = q_v»; «Can use spark to ignite reactants».) Drawing «bomb calorimeter»: stirrer, sample, ignition wires, thermometer, insulated container, bomb (reaction chamber), water, sample.

## Slide 23 — «Hess's Law»
(Rand) «Fortunately, ΔH_rxn for many reactions have been tabulated, and we can use the fact that H is a state function…»
- «If rxn can be written in steps: ΔH₁, ΔH₂, ΔH₃, … Then enthalpy change of rxn is sum of the enthalpy changes for all steps: ΔH_rxn = ΔH₁ + ΔH₂ + ΔH₃ + …»
- Ex: 2 H₂(g) + O₂(g) → 2 H₂O(l), ΔH_rxn = ?
- Table: 2 H₂(g) + O₂(g) → 2 H₂O(g), ΔH₁ = −483.6 kJ·mol⁻¹; 2 H₂O(g) → 2 H₂O(l), ΔH₂ = −88 kJ·mol⁻¹. (Rand) «2nd reaction is condensation of water vapor».

## Slide 24 — «Hess's Law» (adding)
Adding: 2 H₂ + O₂ + 2 H₂O(g) → 2 H₂O(g) + 2 H₂O(l); (Rand) «Cancel 2H₂O(g) on both sides»; result 2 H₂(g) + O₂(g) → 2 H₂O(l), ΔH_rxn = −572 kJ·mol⁻¹.

## Slide 25 — «Hess's Law» + Enthalpy Diagram
Same table and sum. «Enthalpy Diagram»: axis H; top level 2 H₂(g) + O₂(g) (reactants, H_initial); arrow −483.6 kJ·mol⁻¹ down to 2 H₂O(g); arrow −88 kJ·mol⁻¹ down to 2 H₂O(l) (products, H_final); a long arrow on the right ΔH_rxn = −572 kJ·mol⁻¹.

## Slide 26 — «Enthalpies of Formation»
(Rand) «Moreover, to determine ΔH_rxn for reactions that are not tabulated, we can use Hess's Law and…»
- «Standard enthalpies of formation, ΔH_f°» (Rand: superscript «o» denotes standard; standard T and P: 25 °C and 1 atm). «⇒ Enthalpy required to create 1 mol of substance from elements at STP.» Elements (standard state) → Compound (1 mol at standard state): ΔH_rxn = ΔH_f°.
- Ex: Propane C₃H₈: 3 C(graphite) + 4 H₂(g) → C₃H₈(g), ΔH_f° = −103.9 kJ·mol⁻¹. (Rand: structural formula of propane.)
- «All elements in most stable form at STP have ΔH_f° = 0.»

## Slide 27 — «Using ΔH_f° to Determine ΔH°_rxn»
(Rand) «We want to determine this.» Ex: Combustion of propane: C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(ℓ), ΔH°_rxn = ?
- Step 1: «“Unform” reactants»: C₃H₈(g) → 3 C(graphite) + 4 H₂(g), −ΔH_f°[C₃H₈(g)] = −(−104 kJ·mol⁻¹).
- Step 2: «Form products»: C(graphite) + O₂(g) → CO₂(g), ΔH_f°[CO₂(g)] = (−394 kJ·mol⁻¹); H₂(g) + ½ O₂(g) → H₂O(ℓ), ΔH_f°[H₂O(ℓ)] = (−286 kJ·mol⁻¹). (Rand) «Write formation reaction for each reactant and product.»
- ΔH°_rxn = −ΔH_f°[C₃H₈(g)] + 3 ΔH_f°[CO₂(g)] + 4 ΔH_f°[H₂O(ℓ)] = −2220 kJ·mol⁻¹. (Rand) «We have to multiply by stoichiometric coefficients in reaction»; «Note: ΔH_f°[O₂(g)] = 0 because O₂(g) is in its most stable elemental form at STP»; «For propane combustion».
- **Slide arithmetic:** with the printed rounded values: 104 − 3·394 − 4·286 = 104 − 1182 − 1144 = −2222, not −2220; with the table values (−103.85, −393.5, −285.8) one gets −2219.85 ≈ −2220.

## Slide 28 — «Enthalpy Diagram for Propane Combustion»
(Rand) «Perhaps easier to see with an enthalpy diagram…» Brown's figure: vertical axis Enthalpy. Top level «3 C(graphite) + 4 H₂(g) + 5 O₂(g)» (Elements). Middle-left level «C₃H₈(g) + 5 O₂(g)» (Reactants). Level «3 CO₂(g) + 4 H₂(g) + 2 O₂(g)». Bottom level «3 CO₂(g) + 4 H₂O(l)» (Products). ① Decomposition to elements: ΔH₁ = +103.85 kJ (blue arrow up from reactants to elements). ② Formation of 3 CO₂: ΔH₂ = −1181 kJ (down from elements). ③ Formation of 4 H₂O: ΔH₃ = −1143 kJ. Red arrow on the left from reactants to products: ΔH°_rxn = −2220 kJ. (Exercise 4, p. 7 has the same diagram with the notes «This red arrow shows one route to products CO₂(g) and H₂O(l)» and «Numbered steps with pale yellow background show multistep route to same products».)

## Slide 29 — «Using ΔH_f° to Determine ΔH°_rxn» (general)
In general a₁R₁ + a₂R₂ + a₃R₃ + … → b₁P₁ + b₂P₂ + b₃P₃ + …; aᵢ, bⱼ are stoichiometric coefficients; Rᵢ, Pⱼ are reactants and products.
ΔH°_rxn = Σ_{products j} b_j ΔH°_{f,j} − Σ_{reactants i} a_i ΔH°_{f,i}. «We can use this approach to determine ΔH°_rxn for any reaction.»

## Slide 30 — «Other Enthalpies»
«In addition to ΔH_rxn, we also have:» ΔH_fus heat of fusion (melting, solid → liquid), ΔH > 0 (photo: ice cube in hand); ΔH_vap heat of vaporization (boiling, liquid → vapor), ΔH > 0 (photo: boiling pot). No numbers on the slide.
(Slide 31 «Thermodynamics, So Far…» is outside this lesson: only ΔE and ΔH so far; need spontaneity and entropy, 2nd law — «NEXT TIME!».)

## Exercise class 4 (E4) — pages that belong to this lesson
- p. 5 «4.4 Enthalpy»: enthalpy H = «represents total heat content of a system»; H = E + PV; pressure–volume work PV: w = F·d = P·A·d = P·V (work required to make place for system); ΔH = Δ(E + PV) = ΔE + P·ΔV (+ ΔP·V crossed out, «at constant pressure») = q_p + w + PΔV = q_p + w − w, «pressure–volume work PΔV = −w», ΔH = q_p; «enthalpy change represents the heat flow». «enthalpy of formation ΔH_f: the heat flow required to form a mol of compound from the elements at STP»; elemental form ΔH_f = 0; exothermic ΔH_f < 0; endothermic ΔH_f > 0; elements → compound (ΔH_f). **Table 5.3 «Standard Enthalpies of Formation, ΔH_f°, at 298 K» (Brown), kJ/mol** («look up ΔH_f in the tables»): C₂H₂(g) 226.7; NH₃(g) −46.19; C₆H₆(l) 49.0; CaCO₃(s) −1207.1; CaO(s) −635.5; CO₂(g) −393.5; CO(g) −110.5; C(diamond) 1.88; C₂H₆(g) −84.68; C₂H₅OH(l) −277.7; C₂H₄(g) 52.30; glucose C₆H₁₂O₆(s) −1273; HBr(g) −36.23; HCl(g) −92.30; HF(g) −268.60; HI(g) 25.9; CH₄(g) −74.80; CH₃OH(l) −238.6; C₃H₈(g) −103.85; AgCl(s) −127.0; NaHCO₃(s) −947.7; Na₂CO₃(s) −1130.9; NaCl(s) −410.9; sucrose C₁₂H₂₂O₁₁(s) −2221; H₂O(l) −285.8; H₂O(g) −241.8.
- p. 6: «enthalpy of reaction = standard heat of reaction ΔH°_rxn: enthalpy change of system due to a reaction. If you need to find ΔH_rxn, look up ΔH_f° of each component: ΔH_rxn = Σ_products b_j ΔH_{f,j}° − Σ_reactants a_i ΔH_{f,i}°.» ΔH°_rxn,forward = −ΔH°_rxn,reverse. «ΔH°_rxn depends on the state of the reactants and products (solid/liquid/gas). ° stands for standard temperature 25 °C and 1 atm.» «Hess's Law: ΔH_rxn = ΔH₁ + ΔH₂ + ΔH₃.» **Exercise 2** (together): when a system goes from state 1 to state 2 the heat may change, we can say we have an enthalpy change ΔH; it requires the enthalpy of formation ΔH_f to form or create a mole of ammonia for example; the enthalpy of reaction ΔH_rxn is the heat change that happens from doing a specific whole reaction; we could say that enthalpy represents the heat q; the enthalpy is not only the energy E of a system, but also the pressure–volume work W = PV.
- p. 7 **Exercise 3:** calculate ΔH for the reaction CO(g) + 2 H₂(g) → CH₃OH(g). ΔH_f(CO) = −110.5 kJ/mol, ΔH_f(H₂) = 0, ΔH_f(CH₃OH) = −201.2 kJ/mol (not in Table 5.3, which lists CH₃OH(l); the TA's value is for the gas, from Appendix C). ΔH_rxn = ΔH_f(CH₃OH) − ΔH_f(CO) = −201.2 + 110.5 = −90.7 kJ/mol. **Exercise 4, together:** «explain the subreactions of this reaction» C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(l), with the diagram of slide 28. ① reactants decomposed into elements: ΔH₁ = −ΔH_f°(C₃H₈(g)); ② elements form product 3 CO₂: ΔH₂ = 3ΔH_f°(CO₂); ③ elements form product 4 H₂O: ΔH₃ = 4ΔH_f°(H₂O); (tot) ΔH°_rxn = ΔH₁ + ΔH₂ + ΔH₃.
- p. 8: «4.5 Useful Info Sheet» (Brown Appendix C tables, thermodynamic quantities at 298.15 K; images only).
- p. 9 **Exercise 5:** using values from Appendix C calculate ΔH for (a) CaO(s) + 2 HF(g) → CaF₂(s) + H₂O(g); (b) Fe₂O₃(s) + 3 C(s) → 2 Fe(s) + 3 CO(g); also say if they are endothermic or exothermic. (a) ΔH_rxn = −ΔH_f,CaO − 2ΔH_f,HF + ΔH_f,CaF₂ + ΔH_f,H₂O = (635.5 + 2·268.61 − 1219.6 − 241.82) kJ/mol = −288.7 kJ/mol → exothermic. (b) ΔH_rxn = −ΔH_f,Fe₂O₃ + 3·ΔH_f,CO = (822.1x − 3·110.5) kJ/mol = 490.7 kJ/mol → endothermic (handwriting «822,12»; Appendix C gives −822.16, which yields 490.7).
- p. 10 «4.6 Calorimetry»: heat capacity: heat flow required to raise a substance's temperature by 1 degree K = 1 degree C; used to determine heat. Molar heat capacity C_m [J/(mol·K)], q = n·C_m·ΔT (molar amount of substance); specific heat capacity C_s [J/(g·K)], q = m·C_s·ΔT (mass of substance); [J/(g K)] = [J/(g °C)] because ΔT is equal for K and °C. **Exercise 6:** how much will the temperature of a cup (180 g) of coffee at 95 °C be reduced when a 45 g silver spoon (specific heat 0.24 J/g·°C) at 25 °C is placed in the coffee and the two are allowed to reach the same temperature? Assume the coffee has the same density and specific heat as water (4.18 J/g·°C). Solution: q_c = q_s: m_c ΔT_c C_sc = m_s ΔT_s C_ss; 180 g·(95 °C − T_eq)·4.18 = 45 g·(T_eq − 25 °C)·0.24; «T_eq = 89 °C». **Error:** the equation gives T_eq = 94.0 °C (the coffee cools by only 1.0 °C).
- p. 11 cheat sheets (images), p. 12 «Problem Set 4» (list: ΔE = q + w, ΔH = q; exo ΔH < 0 heat released from system; endo ΔH > 0 system takes up heat; n = m/M; q = m·C_s·ΔT; ΔH_rxn formula; m = ρ·V).
