# Quelle: Vorlesung 6 (Prof. Norris), Folien 6–12, plus Übung 6 (Clara Henricsson), S. 2–5

Folie NN = PDF-Seite NN (gedruckt «Lecture #6, p. NN−1»). Handschrift in [*Kursiv*]. Lektion: `ch-licht` → `src/lessons/CH6Licht.tsx`.

## Folie 6 (p. 5) — Today: Electronic Structure
- Chemistry involves electrons: they determine reactivity of atoms; they form bonds, leading to molecules (because bonds hold atoms together). Thus, to understand chemistry, we must understand the organisation of electrons in atoms.
- Aka electronic structure [*also known as*]. Full understanding requires quantum mechanics (4th semester). Today's goal: sketch basics of electronic structure of atoms.

## Folie 7 (p. 6) — Light
- [*We need to start with a description of light*]
- Light is an oscillating electromagnetic wave (Bild: Welle mit elektrischem Feld E, magnetischem Feld B senkrecht zueinander, Ausbreitungsrichtung, Wellenlänge λ). Important parameters: wavelength λ; frequency ν = c/λ; speed of light in vacuum c. [*ν = «nu»; c = 2.998×10⁸ m/s; λ = lambda*]
- «Color» of light depends on wavelength λ: 430 nm is blue, 530 nm is green, 630 nm is red.
- But light waves carry energy in discrete amounts: E = hν or E = hc/λ [*Energy, E. Thus each blue photon carries more energy than a red photon. Blue light has a shorter wavelength and a higher frequency.*] These discrete amounts of energy known as photons. h ≡ Planck's constant = 6.626×10⁻³⁴ J·s.
- [*The fact that light behaves both like a wave and a particle is known as the «wave-particle duality». It is central idea of quantum mechanics. More in 4th semester …*]

## Folie 8 (p. 7) — Light Emitted from Hydrogen Atoms
- Bild: Wasserstoff-Entladungsröhre (rosa Licht); Lichtquelle → Spalt → Prisma → Schirm (Regenbogen); darunter das Spektrum von H: **vier Linien** auf schwarzem Grund bei ≈ 410 (violett), 434 (blau-violett), 486 (blaugrün), 656 nm (rot); Achse 400–700 nm.
- [*Atomic spectrum – «Atomic lines» – Origin?*]

## Folie 9 (p. 8) — Mystery of Hydrogen
- [*With this brief background on light, we can now discuss early experiments on atoms. Starting in mid-1800s scientists like Swiss school teacher and mathematician Johann Balmer (1825–1898) studied light emitted by hydrogen atoms.*]
- Hot light sources (e.g., sun) emit white light [*includes photons with all colors in the rainbow*]. But hydrogen atoms emit photons only at certain energies, E = hc/λ.
- Energy values explained by simple empirical formula: **Rydberg equation** E_H = hc/λ_H = hc R_H (1/n₁² − 1/n₂²) [*E_H = energy of photons emitted from H atoms*], R_H ≡ Rydberg constant = 1.097×10⁷ m⁻¹; n₁, n₂ ≡ integers; n₂ > n₁ > 0 [*both are positive integers*].
- But why does this equation work?? First explanation given by Niels Bohr … (1885–1962).

## Folie 10 (p. 9) — Bohr Model
- Idea: atomic-scale solar system; nucleus = «sun», electron = «orbiting planet». [*H-atom: only one electron and one proton*]
- Bild: Kern (rot) mit gestrichelten Kreisbahnen n = 1, 2, 3, …, Elektron auf der äusseren Bahn mit Doppelpfeil zur inneren (electron orbits).
- Bohr proposed: electron can occupy only certain orbits; electron has specific «allowed» energies E_n [*n = 1, 2, 3, …*]; electron can move between allowed orbits. Requires either absorption of a photon with E_ph = hν or emission of a photon with E_ph = hν. Ex: E₃ → E₁ with E₃ > E₁: ΔE_{3→1} = E₁ − E₃ = −E_ph [*Sign? E<0: electron is losing energy by emitting a photon. Moving from orbit #3 to orbit #1.*]
- Bohr proposed these as postulates (though problematic). Correct description requires quantum mechanics, but appears to be on right track …
- [*Bohr proposed these as postulates without a real explanation. In particular, an electron moving in a circular orbit should lose energy and spiral into the nucleus. But it doesn't! However, this simple picture could explain photons emitted from hydrogen. Somehow it is on the correct track. Full explanation requires quantum mechanics.*]

## Folie 11 (p. 10) — Orbital Energies
- [*Once Bohr assumed his postulates, he could use classical equations of motion to determine the energy of the electron in each orbit.*]
- E_n = −hc R_H/n² [hervorgehoben]. [*Why are the energy levels for the electron negative? The electron lowers its energy by moving closer to the positively charged nucleus. Opposite charges attract!*] ΔE = E_{n_f} − E_{n_i} = −hc R_H (1/n_f² − 1/n_i²).
- Bild: Energieniveaus E (Achse), n = ∞ bei E = 0 (gepunktet), n = 4, 3, 2, 1 nach unten (E₁ am tiefsten), ein Elektron auf n = 3, ein senkrechter Pfeil von n = 3 nach n = 1 mit Photon (blaue Wellenlinie).
- Ex: electron relaxes from n = 3 to n = 1. What is the energy of the emitted photon? ΔE_{3→1} = E₁ − E₃ = −2.18×10⁻¹⁸ J (1 − 1/9) = −1.94×10⁻¹⁸ J [*Sign is negative because electron is lower in energy*]; E_ph = +1.94×10⁻¹⁸ J; λ_ph = hc/E_ph = **103 nm** [*Deep ultraviolet light*].
- Note: energy levels specified just with «n» [*integer*]. [*10–121 nm = Extreme ultraviolet light. ASML example: Extreme UV Lithography, Sn droplets, tool costs 100s of millions! → λ = 13.5 nm*]

## Folie 12 (p. 11) — Limitations of Bohr Model
- Cannot explain stable orbits of electron [*i.e., why does the electron not spiral into the nucleus?*]. Can only explain hydrogen atom! Other atoms?
- Quantum Mechanics: resolves limitations of Bohr model. But predicts Uncertainty Principle: Δx·Δp ≥ h/(4π) [*A fundamental limit exists to how well we can know the electron's motion!*] ⇒ Orbit is «fuzzy» [*We can still use Bohr's idea of electron orbit with fixed energy, but orbit is «fuzzy»*]. Must refer to «electron cloud». Δx, Δp: the uncertainty in how well we know position, x, and momentum, p, of electron. [*If we know electron's position and momentum exactly, then Δx = 0 and Δp = 0. This is possible in classical mechanics, but not in quantum mechanics!*]

---

# Übung 6 (Clara Henricsson, handschriftlich), S. 2–5

- **S. 2, 6.2 Light.** light: electromagnetic wave traveling at speed of light c = 3·10⁸ m/s (Skizze: Welle entlang d [m]; Bild des elektromagnetischen Spektrums: Gamma, X-ray, UV, sichtbar, Infrarot, Mikrowellen, Radio). wavelength λ: determines the color that light has to human eyes. frequency ν = c/λ, [ν] = 1/s = Hz (Hertz). photons: tiny discrete packages of energy carried by light waves; the amount of energy carried by a photon depends on the wave frequency: E_ph = h·ν = h·c/λ; h is the Planck's constant: h = 6,62·10⁻³⁴ Js. Farbmarken 430 nm, 530 nm, 630 nm im sichtbaren Bereich.
  **Exercise 1:** a) «The frequency of radiation increases as wavelength increases.» → FALSE. b) «Electromagnetic radiation travels through vacuum at constant speed, regardless of wavelength.» → TRUE. c) «Infrared light has higher frequency than visible light.» → FALSE.
- **S. 3, 6.3 Bohr Model.** a model derived from the hydrogen atom; nucleus: p⁺ (rot, +), electron orbits: e⁻; the electron can move on a circular electron orbit, denoted by number n. Potential energy of the electron depends on its orbit: E = 0 at infinite distance; the closer the e⁻ to the nucleus, the smaller E; potential energy of the n-th orbit **E_n = −h·c·R_H/n²**; R_H is the Rydberg constant: 1,097·10⁷ 1/m. (Skizze E_pot gegen x: Kurve, die von E_pot(n=1) tief unten gegen 0 steigt, mit Punkten n = 1, 2, 3.) Electron changes orbit: its potential energy changes by absorbing or releasing photons. **ΔE_{i→f} = E_f − E_i = h·c·R_H (1/n_i² − 1/n_f²)**. ΔE > 0: e⁻ moved outwards, photon absorbed. ΔE < 0: e⁻ moved inwards, photon released.
- **S. 4, Exercise 2** (Aufgabe aus Brown): Consider a transition in which the electron of a hydrogen atom is excited from n = 1 to n = ∞. (a) What is the end result of this transition? (b) What is the wavelength of light that must be absorbed to accomplish this process? (c) What will occur if light with a shorter wavelength than that in part (b) is used to excite the hydrogen atom? (Bild: Energieniveau-Diagramm, Energie × 10²⁰ J/atom, −218 bei n = 1, Pfeile für Übergänge.) Lösung: a) electron is removed from the atom. b) ΔE = 218·10⁻²⁰ J/atom; λ = hc/ΔE = (6,626·10⁻³⁴ Js · 2,998·10⁸ m/s)/(218·10⁻²⁰ J/atom) = 9,11227·10⁻⁸ m = **91,1 nm** → ultraviolet. c) λ ↓ → ΔE ↑, more energy → not only losing an e⁻, also gaining kinetic energy.
- **S. 5, 6.4 Quantum Mechanics.** Bohr's model is outdated. Heisenberg's uncertainty principle: shows that we can't determine both position x and momentum p = m·v with precision: Δx·Δp > h/(4π); [p] = kg·m/s. atomic orbitals: instead of fixed paths, electrons are in regions around the nucleus where we have 90 % chance of finding the electron (Bild: Punktwolke um einen Kern mit einer gestrichelten Linie: «each dot symbolises a potential electron position; the electron is likely to be found with a 90 % probability within this line = in orbital»). New atomic model: electrons occupy different shells (n) around the nucleus; each shell contains subshells (s, p, d, f …), which are groups of orbitals; each orbital can hold a maximum of two electrons (2p). (Exercise 3 zu den Orbitalen gehört zu `ch-orbitale`.)

# Fehler / Auffälligkeiten (für `docs/REVIEW_LOG.md` vorgeschlagen)
- **CH-F (Übung 6, S. 4, Exercise 2b):** Die Rechnung ist richtig (91,1 nm), aber der Wert «218·10⁻²⁰ J/atom» = 2,18·10⁻¹⁸ J ist in der Zehnerpotenz-Schreibweise der Brown-Achse («× 10²⁰») geschrieben; kein Fehler, nur ungewohnt.
- Folie 11 benutzt 2.18×10⁻¹⁸ J für hcR_H; mit den Folienwerten h = 6.626×10⁻³⁴, c = 2.998×10⁸, R_H = 1.097×10⁷ ergibt sich 2.1796×10⁻¹⁸ J (gerundet 2.18), λ = 102.55 nm (die Folie rundet auf 103 nm). Kein Fehler.
- Folie 9: Die Rydberg-Gleichung ist mit n₂ > n₁ > 0 geschrieben und ΔE = Energie des emittierten Photons (positiv); Folie 11 schreibt ΔE = E_f − E_i (negativ bei Emission). Beide Vorzeichen-Konventionen stehen in der Lektion nebeneinander; keine Unstimmigkeit, nur ein Vorzeichenwechsel.
