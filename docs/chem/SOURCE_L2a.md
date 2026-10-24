# Quelle: Vorlesung 2 (Prof. Norris), Folien 8–23, plus Übung 2 (Clara Henricsson)

Folie NN = PDF-Seite NN (gedruckt «Lecture #2, p. NN−1»). Handschrift der Folien in *Kursiv* in eckigen Klammern. «(unleserlich)» = nicht lesbar.
Lektion: `ch-gase` → `src/lessons/CH2Gase.tsx`.

## Folie 8 (p. 7) — Today's Topic: Gases
- Important topic for engineers. Three states of matter: solid, liquid, vapor. Example: H2O (Bild: Wasserdampf, flüssiges Wasser, Eis als Teilchenbilder; Eisberg).
- Gases have similar physical properties, even if they have different chemical properties.
- Physical properties of gases: expand to fill their container; can be compressed; form homogeneous mixtures; molecules occupy tiny fraction of volume.
- [*Important topic for industry, applications, and everyday life*] [*Gasoline and water do not mix in liquid phase but their vapors form homogeneous mixture*] [*Gas molecules in air occupy ≈0.1 % of total volume*]

## Folie 9 (p. 8) — Common Gases at Room Temperature
Tabelle Formel / Name / Eigenschaft: HCN hydrogen cyanide (very toxic, slight odor of bitter almonds); H2S hydrogen sulfide (very toxic, odor of rotten eggs); CO carbon monoxide (toxic, colorless, odorless); CO2 carbon dioxide (colorless, odorless); CH4 methane (colorless, odorless, flammable); C2H4 ethene/ethylene (colorless, ripens fruit); C3H8 propane (colorless, odorless, bottled gas); N2O nitrous oxide (colorless, sweet odor, laughing gas); NO2 nitrogen dioxide (toxic, red-brown, irritating odor); NH3 ammonia (colorless, pungent odor); SO2 sulfur dioxide (colorless, irritating odor).

## Folie 10 (p. 9) — Parameters to Describe Gases?
- How can we describe the physical state of a gas? For a simple gas we need only 4 parameters: Volume V, Amount n (number of moles), Temperature T, Pressure P.
- V, n: **extensive properties** (depend on size of sample). T, P: **intensive properties** (do not depend on size of sample). Another example: density (mass/volume).
- P = F/A = [N/m²] ≡ [Pa].
- [*SI unit of force ⇒ Newton, N. SI unit of pressure ⇒ Pascal, Pa*]
- Bild: keines.

## Folie 11 (p. 10) — Origin of Pressure?
- Molecules randomly moving; hit any surface and cause force per unit area. Bild: Gas in a container, Moleküle strike surface.
- Atmospheric pressure? Pressure due to Earth's gravity. Consider column of air, 1 m² in area (Bild: Luftsäule, 1 m × 1 m, Masse 10⁴ kg, Gravitationskraft).
- m ≈ 10 000 kg, g = 9.8 m²/s [sic, s. Fehler unten]; F = mg ≈ 1×10⁵ N; P_atm ≈ 1×10⁵ N/m² ≈ 100 kPa; P_atm ≈ 1 bar (Estimate, see below).
- [*Pulling gas molecules toward Earth*] [*1 bar = 1×10⁵ Pa*] [*g: acceleration due to Earth's gravity*]

## Folie 12 (p. 11) — Measuring Atmospheric Pressure? Barometer
- Barometer: tool to measure P_atm. Bild: umgekehrtes Rohr in einer Hg-Schale, Vakuum oben, Höhe h, P_atm drückt auf die Schale. Evangelista Torricelli 1608–1647. [*Student of Galileo. Invented barometer.*]
- P_Hg = F/A = mg/A = ρVg/A, V = A h. ρ ≡ m/V = density = 13.5 g/cm³ for Hg.
- P_Hg = ρ A h g / A = ρ g h (Hydrostatic pressure) [hervorgehoben].
- At sea level h = 760 mm Hg; P_atm = 760 mm Hg.
- In different units: P_atm = 760 torr = 1 atm = 101.325 kPa = 1.01325 bar.
- [*We will use rho, ρ, as symbol for density to be consistent with your other classes. [But Brown uses d.]*]

## Folie 13 (p. 12) — Measuring Relative Pressure? Manometer
- Manometer: tool to measure P relative to P_atm. P_gas = P_atm + ρ g h. Bild: U-Rohr mit offenem Ende (P_atm), Gaskolben (P_gas), Hg; Höhen 136.4 mm und 103.8 mm, Differenz h.
- Also used to measure blood pressure: «120 over 80» in mm Hg. [*systolic over diastolic (max)(min)*]

## Folie 14 (p. 13) — P–V Relationship: Boyle's Law
- [*Now how do the 4 parameters (V, n, T, P) relate to each other? We will consider in pairs …*]
- Zwei Diagramme: P gegen V (Hyperbel, Punkte), P gegen 1/V (Gerade durch 0).
- Keep n and T constant. If we halve volume → pressure doubles [*Makes sense!*].
- PV = constant, or P = constant/V. First gas law. Law: states what happens. [*That is P and V are inversely proportional*] [*Scientific theory tries to explain scientific law*]
- [*Note: Robert Boyle (1627–1691) was first to change one variable to determine how another variable changes, i.e. how the two variables are related. Key idea in science/engineering! Note 2: When we breathe, our body is exploiting Boyle's Law.*]

## Folie 15 (p. 14) — V–T Relationship: Charles's Law
- Zwei Diagramme: V gegen T(°C) (Gerade, gestrichelt bis −273.15), V gegen T(K) (Gerade durch 0).
- Keep n and P constant. V is linear with T. Rescale −273.15 °C = 0 K [*Zero Kelvin «Absolute zero»*]. ΔT of 1.0 °C = 1.0 K [*Just resetting zero of temperature scale*].
- V = constant · T, or V/T = constant. Second gas law. [*V and T are directly proportional*]
- [*Gas actually never reaches absolute zero because it liquifies and solidifies first*] [*Note: we always write units of Celsius as «°C»; but we write units of Kelvin just «K»*] Jacques Charles (1746–1823).

## Folie 16 (p. 15) — V–n Relationship: Avogadro's Law; Avogadro's Hypothesis
- Diagramm V gegen n (Gerade durch 0). [*Amount in moles*]
- Keep P, T constant. V is linear with n. V = constant · n, or V/n = constant. Third gas law. [*V and n are directly proportional*]
- Avogadro's Hypothesis: Moreover, constant is approximately the same for all gases! Equal volumes of two different gases at same P, T contain same number of molecules. «Wow!» (Emoji)
- [*Amedeo Avogadro (1776–1856)*]

## Folie 17 (p. 16) — Standard Temperature and Pressure; Ideal Gas
- [*To establish a «normal» P, T we define the … «STP»*]
- We set STP as T = 0 °C = 273.15 K, P = 1 atm = 101.325 kPa. Molar volume at STP = 22.41 L [*As engineer, you should know this number*].
  - Good approximation for any gas; even though the mass of 1 mole of different gases varies [*Ex: 1 mol H2 ≙ 2 g, 1 mol CH4 ≙ 16 g*]; strictly true for an «ideal gas».
- Ideal Gas: hypothetical gas that follows V ∝ 1/P |n,T (Boyle), V ∝ T |n,P (Charles), V ∝ n |P,T (Avogadro) ⇒ V ∝ nT/P ⇒ V = R (nT/P). R ≡ «Gas Constant». [*Three gas laws: …; where we set the proportionality constant as R*]

## Folie 18 (p. 17) — Ideal Gas Law (IGL)
- [*Or «Ideal Gas Equation». Incredibly important!*] PV = nRT [*Typically written as*].
- R ≡ Gas Constant; R = 8.314 m³·Pa/(mol·K) or = 8.314 J/(mol·K) [*both in SI units*]; R = 0.08206 L·atm/(mol·K); R = 62.36 L·torr/(mol·K).
- Assumptions: molecules in gas do not interact; volume that molecules occupy is much smaller than the total volume (Bild: Behälter mit wenigen Punkten, «molecule (not to scale)») [*That is, the total volume that contains gas is a small fraction of the total volume*].
- Note: amount of gas depends on number of gaseous species present. Ex: A → B + C ⇒ pressure doubles if V, T are constant [*Decomposition reaction*].

## Folie 19 (p. 18) — Using Ideal Gas Law?
- Very useful! PV = nRT, R is constant. Many problem variations. Common on exams!
- Type 1: given three of four variables; need missing variable. Strategy: rearrange ideal gas law for desired variable: P = nRT/V, V = nRT/P, n = PV/RT, T = PV/nR.
- Type 2: two variables remain constant; two other variables are changing.
  - Ex1: n, T constant → PV = nRT is constant → P_i V_i = P_f V_f → P_f = P_i V_i/V_f.
  - Ex2: n, V constant → P/T = nR/V is constant → P_i/T_i = P_f/T_f → P_f = P_i T_f/T_i.
- [*i: initial, f: final. What is final pressure, P_f, given P_i and change in volume from V_i to V_f?*] [*The point is not to memorise these variations but to learn how to work with ideal gas law given knowns and unknowns.*]

## Folie 20 (p. 19) — Using Ideal Gas Law? (Type 3)
- Type 3: 1 variable remains constant; three other variables are changing. Ex: n constant → PV/T = nR is constant → P_i V_i/T_i = P_f V_f/T_f → P_f = P_i (V_i/V_f)(T_f/T_i).
- Problem: Balloon of V = 6.0 L at P = 101.3 kPa rises until P = 45.6 kPa. Temperature falls from 22 °C to −21 °C. What is the final volume?
  - Knowns: n = fixed, V_i = 6.0 L, P_i = 101.3 kPa, P_f = 45.6 kPa, T_i = 22 °C, T_f = −21 °C. Unknown: V_f = ?
  - Strategy: PV/T = nR is constant → P_i V_i/T_i = P_f V_f/T_f; solve for unknown → V_f = V_i (P_i/P_f)(T_f/T_i); plug in knowns → **V_f = 11 L**.
- [*IMPORTANT! Temperatures must always be in Kelvin. Remember Charles's Law only made sense in K.*]

## Folie 21 (p. 20) — Other Uses of the IGL
- Density, ρ [*We can determine density of a gas*]. Rearranging IGL: n/V = P/RT. Multiply both sides by molecular weight M_w (g/mol): (n/V)·M_w = (P/RT)·M_w. Units: mol/L · g/mol = g/L = density. ⇒ ρ = (P/RT)·M_w [hervorgehoben]. [*Can get density of the gas. Note: density of gas depends on P, T, and M_w*]
- Molecular Weight, M_w, or molar mass (g/mol). Rearranging density expression: M_w = ρRT/P [hervorgehoben]. Thus, we can use IGL to determine the density if we know molecular weight or vice versa.
- [*We will use rho, ρ, as symbol for density to be consistent with your other classes. [But Brown uses d.]*]

## Folie 22 (p. 21) — Consequence of IGL for Gaseous Mixtures: Partial pressure
- Consider mixture containing i different gaseous species. IGL ⇒ total pressure P_tot just depends on total number of moles n_tot of gas. [*Assumed to be ideal*]
- n_tot = n_1 + n_2 + … + n_i [*Total number of moles*].
- P_tot = n_tot RT/V = (n_1 + n_2 + … + n_i) RT/V = n_1 RT/V + n_2 RT/V + … + n_i RT/V [*T, V are the same for all species because they are all in same container*].
- **P_tot = P_1 + P_2 + … + P_i** — Dalton's law of partial pressures. P_i ≡ partial pressure of species i. [*Each species contributes to pressure according to its amount (i.e. n_i)*]
- [*Makes sense! IGL says each ideal species behaves the same way and independently. Only the number of gas molecules matters!*]

## Folie 23 (p. 22) — Mixtures and Mole Fraction
- Note: this implies P_i = (n_i/n_tot) P_tot = X_i P_tot, where X_i ≡ n_i/n_tot — Mole fraction [hervorgehoben]. Fraction of total moles in mixture that are species i.

---

# Übung 2 (Clara Henricsson, handschriftlich), Seiten, die zu `ch-gase` gehören

- **S. 1** 2.1 Organisation (Polybox, Bonus +0.25 Note für 10 von 13 Übungsblättern und 2 von 3 Quizzes; 1 Cheatsheet vorne und hinten). 2.2 Significant Figures = SigFigs: exakte Zahlen (a dozen = 12); inexakte Zahlen (Messungen, 12.001 meters). Regeln: jede Ziffer ≠ 0 ist signifikant (63,29 → 4); jede Null zwischen Ziffern ≠ 0 ist signifikant (60,01 → 4); führende Nullen nicht (0,002 → 1); Nullen am Ende sind signifikant, wenn der Wert ein Komma hat (7,0 → 2); Achtung: 0,070 → 2; Achtung: 700 = 7·10² → 1.
- **S. 2** SigFigs in Calculations. Addition/Subtraktion: Ergebnis hat gleich viele Dezimalstellen wie der unsicherste Wert (20,43 + 1,322 + 83,1 = 104,842 → 104,8). Multiplikation/Division: gleich viele SigFigs wie der Wert mit den wenigsten (6,221 · 5,2 = 32,3492 → 32). Rundung: ist die erste weggelassene Ziffer ≥ 5, wird aufgerundet (7,248 → 7,25 (3 SigFigs); 7,248 → 7,2 (2)). Logarithmen: Ergebnis hat gleich viele SigFigs **nach dem Komma** wie der Input SigFigs insgesamt: t = log10(1,00·10⁸) → 10^t = 1,00·10⁸ → t = 8,000. [Meme: «Isn't 1000 and 1000.00 the same? – Depends on the field. – In math, yes. – In chemistry, hell no!»]
- **S. 3** Exercise 1: a = 2,0 · 7,14 + 9,00009 = 14,28 + 9,00009 = 14 + 9,00009 = **23**; b = (8,1 + 7,26) · 3,0 = 15,36 · 3,0 = 15,4 · 3,0 = 46,6 = **47**; c = −log10(1,0·10³): 10^c = 1,0·10⁻³ → c = **−3,00**. [*SigFigs are very important in the exam! → 1 point per calculation exercise → can make up to 0,5 grade difference → just do it → this is the proper scientific way*]
- **S. 4** 2.3 Ideal Gas Law: PV = nRT; P ≙ gas pressure [Pa]; V ≙ gas volume [m³]; T ≙ absolute temperature [K]; R ≙ «Boltzmann constant» [sic] [R] = m³·Pa/(mol·K); R = 8,314 m³Pa/(mol K) = 8,314 J/(mol K) = 0,08314 L·Bar/(mol K) = 0,08206 L·atm/(mol K). n ≙ moles of gas, [n] = 1, n = m/M (m Masse [g], M molare Masse [g/mol], mol ≙ 6,022·10²³). Gas particles don't interact and have no volume; behaviour of an ideal gas only depends on number of gas particles, not which atom/molecule type it is. Mole fraction: X_i = n_i/n_tot. STP: T = 0 °C = 273 K; P = 101'325 Pa. Molar volume at STP: V = 22,41 L. Partial pressure: P_tot = P_1 + P_2; n_tot = n_1 + n_2 (Bild: zwei Behälter, rot und blau, ergeben zusammen einen gemischten Behälter).
- **S. 5** Type 1 question: all but one quantity given → just reformulate the ideal gas law: P = nRT/V. **Exercise 2:** Tennis balls are usually filled with either air or N2 gas to a pressure above atmospheric pressure to increase their bounce. If a tennis ball has a volume of 144 cm³ and contains 0.33 g of N2 gas, what is the pressure inside the ball at 24 °C? Lösung: PV = nRT = (m/M) RT → P = mRT/(VM) = 0,33 g · 8,314 m³Pa/(mol K) · 297,15 K / (144·10⁻⁶ m³ · 28 g/mol) = «20·10⁵ Pa» (2 SigFigs) [sic; richtig 2,0·10⁵ Pa, s. Fehler CH-xxx unten]. Type 2 question: information on two states are given, rest kept constant. P1, P2, T1 given → find T2. Set a constant: P/T = nR/V = const.; P1/T1 = P2/T2 → T2 = (P2/P1)·T1.
- **S. 6** **Exercise 3:** A cylinder fitted with a movable piston holds 50.0 L of O2 gas at 1.875 MPa. What volume will the gas occupy if the temperature is constant while the pressure is reduced to 101.3 kPa? V1 = 50,0 L; P1 = 1'875 kPa; P2 = 101,3 kPa; P·V = nRT constant; P1V1 = P2V2; V2 = P1V1/P2 = **926 L** (3 SigFigs). Barometer: P = ρ·g·h (P [Pa], ρ [kg/m³], g = 9,81 m/s², h [m]); Skizze: Hg-Wanne mit Rohr, Höhe h. Manometer: P_G = P_atm + ρ·g·h; Skizze: U-Rohr, Gas P_G links, P_atm rechts, Höhe h, liquid Hg quicksilver.
- **S. 7** 2.4 Kinetic Molecular Theory (→ Lektion `ch-kinetik`, s. SOURCE_L2b).
- **S. 8** Exercise 4 (→ `ch-kinetik`).
- **S. 9** **Exercise 5:** Consider the following samples of gases (Bild: drei Kästen (i), (ii), (iii) mit He = gelbe Kugeln und N2 = blaue Doppelkugeln; (i) 5 He + 2 N2, (ii) 3 He + 1 N2, (iii) 2 He + 5 N2). If the three samples are all at the same temperature, rank them with respect to (a) total pressure, (b) partial pressure of helium, (c) density, (d) average kinetic energy of particles. Lösung: [*pressure depends on amount of atoms n: P = nRT/V; density depends on the mass m: ρ = m/V*] a) P_i = P_iii > P_ii; b) P_He,i > P_He,ii > P_He,iii; c) m_N2 > m_He → ρ_iii > ρ_i > ρ_ii; d) T constant, same → E_kin the same for all: E_kin,i = E_kin,ii = E_kin,iii.
- **S. 10** 2.5 Cheatsheet (Beispiele: SCHALDACH-Cheatsheet und JOETAN-Cheatsheet, Kapitel 5.5 Ideal Gases: Boyle, Charles, Avogadro, STP-Molvolumen, Atmosphärendruck, Barometer, Manometer, Dichte, Dalton). Schaldach: «Significant figures: + or − : value with least dec. places determines dec. places of result; × or / : value with least sig. figs determines sig. figs of result; ln(x): sig. figures of x equal the decimal places of result; e^x: dec. places of x equal the sig. figures of result. Caution: constants are disregarded when determining significant figures.» «ρ = P M_w/(R T)», P_tot = Σ P_i = Σ X_i P_tot.
- **S. 11** 2.6 Problem Set 2 (optional problems, Aufgaben 1–5 bis nächste Woche abgeben): 1) P = ρ g h, Höhendifferenz entspricht Druckdifferenz; 2) PV = nRT, n = m/M; 3) ideales Gas, V = const., molares Verhältnis χ_CO2 = 0,75; χ_H2O = 0,25; 4) V = 4/3 π r³, PV = nRT = const.; 5) check theory if unsure. 2.7 Kahoot.
- **S. 12** 2.8 Bonus: Automobile air bags are inflated with nitrogen gas, which is formed by the decomposition of solid sodium azide (NaN3). The other product is sodium metal. Calculate the volume of nitrogen gas at 27 °C and 100.8 kPa formed by the decomposition of 130 g of sodium azide. a) Find the amount of N2 (in moles) b) Find the volume. M_Na = 23 g/mol, M_N = 14 g/mol. Gleichung: 2 NaN3(s) → 2 Na(s) + 3 N2(g); a) n_NaN3 = m/M = 130 g/((23 + 3·14) g/mol) = 2,0 mol; n_N2 = n_NaN3 · 3/2 = 3,0 mol; b) V = nRT/P = 3,0 mol · 8,314 m³Pa/(mol K) · 300 K/100'800 Pa = 0,074 m³ (2 SigFigs).

# Fehler / Auffälligkeiten (vorgeschlagene Review-IDs)
- **CH-A (Folie 11):** «g = 9.8 m²/s» — die Einheit der Fallbeschleunigung ist m/s². Die Rechnung 10⁴ kg · 9.8 m/s² ≈ 1·10⁵ N stimmt.
- **CH-B (Übung 2, S. 4):** «R ≙ Boltzmann constant» — R ist die (universelle) Gaskonstante; die Boltzmann-Konstante ist k_B = R/N_A ≈ 1,38·10⁻²³ J/K.
- **CH-C (Übung 2, S. 5, Exercise 2):** Ergebnis «20·10⁵ Pa» — die Rechnung gibt 2,0·10⁵ Pa (Zehnerpotenz zu viel).
- **CH-D (Übung 2, S. 6, Exercise 3):** V₂ = 1875·50,0/101,3 = 925,5 L → auf drei Ziffern **925 L**; das Blatt schreibt 926 L.
- **CH-E (Übung 2, S. 2–3, SigFigs):** (1) 20,43 + 1,322 + 83,1 = 104,852 (das Blatt schreibt 104,842) → nach der Regel **104,9** (das Blatt: 104,8). (2) Exercise 1b: (8,1 + 7,26)·3,0 = 15,4·3,0 = 46,2 → **46** (das Blatt: 46,6 → 47).
- Keine Fehler, nur Rundung: Folie 12 ρ_Hg = 13.5 g/cm³ (genauer 13.595); mit 13.5 gibt ρgh für 760 mm ≈ 100.6 kPa statt 101.3 kPa. Folie 13: Quecksilberstände 136.4 mm und 103.8 mm (Bild aus Brown), h = 32.6 mm; die Folie rechnet kein Beispiel vor.
