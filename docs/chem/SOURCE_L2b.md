# Quelle: Vorlesung 2 (Prof. Norris), Folien 24–31, plus Übung 2 (S. 7–8)

Folie NN = PDF-Seite NN (gedruckt «Lecture #2, p. NN−1»). Handschrift in [*Kursiv*]. Lektion: `ch-kinetik` → `src/lessons/CH2Kinetik.tsx`.
Van der Waals-Folien: Folie 29–30 (Vorlesung 2) und die Wiederholung in Vorlesung 3, Folien 5–7 (s. `SOURCE_L3c.md`).

## Folie 24 (p. 23) — But Why Does IGL Explain Gas Behavior?
- Need theory ⇒ **Kinetic-Molecular Theory of Gases**.
- Model ⇒ gaseous species are in constant motion with kinetic energy E_k = ½ m v²; m ≡ mass of molecule; v ≡ velocity of molecule. [*Energy due to motion*] [*E_k ≙ kinetic energy (Exercise #1)*]
- Gaseous species (Kasten): • are randomly moving • occupy negligible volume • collide with each other but do not interact • have average E_k that depends on T. [*Kinetic theory states that …*]
- [*Gas molecules in this room are not static but in constant motion with average velocities of ~500 m/s. Gas molecules just bounce off each other when they collide, like «ping-pong» balls. Molecules don't stick to or repel each other.*]

## Folie 25 (p. 24) — Kinetic-Molecular Theory of Gases
- Gas species transfer energy upon collisions. A specific molecule in the gas may move faster or slower … But average E_k is constant for a given absolute temperature. Does not even depend on type of molecule, only T(K).
- Explains P,T relationship at molecular level! • P caused by molecular collisions with container walls • depends on number and force of such collisions • if T(K) is doubled, average E_k doubles • would expect that P is also doubled ⇒ P ∝ T(K) [*Assuming constant volume*] [*In agreement with ideal gas law*] [*Can use similar arguments to convince yourself that P ∝ 1/V*]
- Meaning of T? ⇒ average kinetic energy, E_k, of molecules.

## Folie 26 (p. 25) — Velocity Distributions
- [*But so far we have just discussed average velocities. How fast do individual molecules move?*]
- Important: molecules move with a range of velocities. Distribution depends on T and molecular mass.
- Bild links: Fraction of molecules gegen Molecular speed (m/s) für 0 °C (blau, höheres schmaleres Maximum bei ≈ 400–450 m/s) und 100 °C (rot, niedriger, breiter, Maximum nach rechts), die Fläche rechts von ≈ 500 m/s (5×10²) beider Kurven gefüllt (blau/rot).
- Bild rechts «T constant»: Kurven für O2, N2, H2O, He, H2 (Speed bis 35×10² m/s); schwerere Moleküle schmal und links, He und H2 breit und rechts.
- [*Some molecules move faster and some move slower than average velocity.*] [*IMPORTANT concepts for rest of course!*] [*Because the average molecular kinetic energy is the same for any molecule (at a given T), then the velocity distribution shifts to faster velocities for lighter molecules.*] [*Helium is light and moves so fast, it can escape Earth's gravity ⇒ limited resource*]

## Folie 27 (p. 26) — Special Velocities
- Bild: Verteilung mit drei Markierungen (gestrichelt): v_mp = the speed exhibited by the largest number of molecules; v_av = the average (mean) speed of all the molecules; v_rms = the speed of a molecule whose kinetic energy is equal to the average (mean) kinetic energy of all the molecules. Achse bis 10×10² m/s, Maximum bei ≈ 4.5×10².
- v_rms = √(3RT/M_w) [hervorgehoben] [*Depends on temperature, T, and molecular weight, M_w.*]
- [*Note: these are small v's for velocities, not big V's for volume.*]
- [*Why is v_rms to the right of the peak in the velocity distribution? Because kinetic energy, E_k, is ½mv².*]
- Die Folie gibt keine Formeln für v_mp und v_av an (nur die Reihenfolge im Bild: v_mp < v_av < v_rms).

## Folie 28 (p. 27) — Diffusion
- Diffusion: spread of substance through space. Gases at atmospheric pressure diffuse much slower than v_rms [*v_rms ≈ 500 m/s*]. Because molecules have 10¹⁰ collisions per second [*At atmospheric pressure*].
- Mean free path: average distance between collisions. Air at sea level (P = 1 atm) ⇒ 60 nm! This reduces the actual distance traveled. But for air at 100 km altitude ⇒ 10 cm!
- Bild: Behälter (handgezeichnet) mit roten Molekülen und einem blauen Molekül, das in Zickzack-Pfeilen durch die roten Moleküle wandert. [*Blue molecule diffusing through red molecules. Due to collisions it doesn't make it very far! Collisions randomize its direction of motion.*] [*So at reduced pressures in vacuum chamber, one can get «ballistic» transport of gas molecules over meters and make «molecular beams»!*]

## Folie 29 (p. 28) — Nonidealities in Gases
- IGL incredibly useful! But real gases not always ideal. At high P ⇒ volume occupied by molecules no longer negligible. At low T ⇒ molecules start to interact (i.e. «stick» to each other).
- Bild: PV/RT gegen P (MPa), 0 bis 100 MPa, Kurven N2, CH4, H2, CO2, «Ideal gas» gestrichelt bei 1.0; Einschub (0–2.0 MPa) vergrössert den Anfang: alle Kurven starten bei 1.0, CO2 fällt früh unter 1.0. Kurvenverlauf: CO2 fällt bis ≈ 0.4 (≈ 8 MPa) und steigt dann; CH4 Minimum ≈ 0.65 bei 20 MPa; N2 Minimum ≈ 0.95 bei 10 MPa; H2 steigt von Anfang an linear (> 1). Alle steigen bei hohen Drücken über 1. (Lecture 3, Folie 6: Handschrift «This plot is for n = 1 mol. Any deviation from PV/RT = 1 is non-ideality».)

## Folie 30 (p. 29) — Nonidealities in Gases: Van der Waals Equation
- (P + n²a/V²)(V − nb) = nRT [*Here, big V is volume. Just like PV = nRT but now P and V are corrected for nonidealities. n is the number of moles as always. a, b are correction factors. Can find values in tables for a specific gas.*]
- **TABLE 10.3 Van der Waals Constants for Gas Molecules**: a (L²·kPa/mol²), b (L/mol):
  - He 3.46, 0.02370; Ne 21.4, 0.0171; Ar 135, 0.0322; Kr 235, 0.0398; Xe 425, 0.0510; H2 24.7, 0.0266; N2 141, 0.0391; O2 138, 0.0318.
- Handschrift unten (Meaning): • The measured pressure is lower than the ideal gas law predicts due to interactions, so we add n²a/V² term to P. Molecules attract each other and strike container walls with less force. • The actual container volume is larger than the molecules experience. Some of the volume is now occupied by other molecules. Thus, we subtract nb term from V.

## Folie 31 (p. 30) — What We Learned
Variables needed to describe gases; pressure, barometers, and manometers; gas laws (Boyle, Charles, Avogadro); given P and T, equal volume of any gas contains same number of molecules; STP; IGL; partial pressures, mole fraction; kinetic-molecular theory of gases; velocities and velocity distributions; molecular diffusion, collisions, and mean free path; nonidealities in gases (van der Waals equation). NEXT TIME: Reactions in Water.

---

# Übung 2, Seite 7–8 (Clara Henricsson)

- **S. 7, 2.4 Kinetic Molecular Theory:** gases are in constant random motion; average velocity ~500 m/s at STP; ~10¹⁰ collisions per second at STP; mean free path ~60 nm at STP; pressure is caused by molecules colliding with the wall; molecules of a gas at a temperature have different speeds → can be depicted as a distribution. Bild: Verteilung mit u_mp (≙ most probable speed), u_av (≙ average speed), u_rms (≙ speed for molecules with average E_kin). E_kin = ½ m v², v = √(2 E_kin/m). «Distribution of velocities depends on temperature»: Bild 0 °C / 100 °C; T↑ → velocity↑; T↑ → E_kin↑. (Die TA schreibt u statt v für Geschwindigkeiten.)
- **S. 8, Exercise 4:** Consider the following graph (Kurve A: schmal, hoch, links; Kurve B: breit, niedrig, rechts). (a) If curves A and B refer to two different gases, He and O2, at the same temperature, which curve corresponds to He? (b) If A and B refer to the same gas at two different temperatures, which represents the higher temperature? (c) For each curve, which speed is highest: the most probable speed, the root-mean-square speed, or the average speed? [Section 10.6]. Lösung: a) m_He < m_O2; E_kin constant, same; E_kin = ½mv²; v = √(2E_kin/m); T constant, same → v_He > v_O2 ⇒ **B = He, A = O2**. b) T↑ → E_kin↑ → v↑ ⇒ **B is at higher T than A**. c) **v_rms > v_av > v_mp**.
- **S. 9, Exercise 5** (He/N2-Proben): (d) average kinetic energy — T constant, same → E_kin gleich für alle (→ `ch-gase`).
- **S. 10, Cheatsheet** (JOETAN, Kap. 5.5, Schülerzusammenfassung): u_mp = √(2RT/M_w) und u_rms = √(3RT/M_w) (beide als Formelkasten); Bildunterschriften: «At 0 °C, fewer than half the molecules move at speeds greater than 500 m/s. At 100 °C, more than half the molecules move at speeds greater than 500 m/s.» (zur Folie 26) und die drei Definitionen u_mp, u_av, u_rms. Eine Formel für u_av steht **nicht** auf den Folien oder der Cheatsheet-Seite; wir ergänzen sie als Ergänzungsbox (√(8RT/(πM_w)), getestet).
- **S. 11, Problem Set 2, Aufgabe 4:** V = 4/3 π r³ (Ballon), pV = nRT = const.
- **Anmerkung zu Einheiten:** Mit R = 8.314 J/(mol·K) muss M_w in kg/mol eingesetzt werden, damit v_rms in m/s herauskommt (die Folie sagt das nicht ausdrücklich).
