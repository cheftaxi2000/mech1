# Informatik I — plan

Source: the lecture notes `infln01`–`infln07` (Fischer, Friedrich, Sasse; ETH, service course 252-0832/-0847/-0856, HS 2026, English) and the German «Theorieblätter» `ThB_unknown_Info1` (command cheat sheets per week). The notes mark starred sections as not examinable; the lessons follow that.

## Philosophy (carried over from Mechanik, adapted)
Same as the other subjects: picture first, short sentences, one idea per step, a figure for every concept, every symbol in KaTeX, DE/EN, source pages on every lecture box. Adapted for programming:
- The picture is the **machine**: memory boxes with addresses, registers, the instruction that runs next, values after every step (`src/info/*.ts` pure machine models + tests → figures).
- Code is a first-class citizen: `<Code>` listings (never translated), `<K>` inline code, the running line highlighted in the simulators.
- **Attempt-first checks are allowed in Informatik** (D-030): `Predict` / `Choice` at the points where mentally running the program is the skill. Few and high-value.
- Always three questions: what does the computer do, why does it work, how can I predict it.

## Curriculum (one chapter per notes file)
| Chapter | Notes | Lessons (planned) |
|---|---|---|
| I1 | infln01 (pp. 8–?) | **i-algorithmus** (pp. 8–12, done) · Turing / von Neumann / Sprachen, Syntax & Semantik (12–17) · Aufbau eines C++-Programms, Ausgabe · Variablen: Deklaration, Initialisierung, Zuweisung · Eingabe, Ausdrücke, Konstanten |
| I2 | infln02 | Arithmetische Ausdrücke, Vorrang, Ausdrucksbaum · Ganze Zahlen (Überlauf) · Fliesskommazahlen · Wahrheitswerte |
| I3 | infln03 | Auswahl (if/switch) · Schleifen (while, do-while, for) · Blöcke und Sichtbarkeit · Sprünge, Kontrollflussdiagramme — **done (5 lessons, draft)** |
| I4 | infln04 | Funktionen und Aufrufe (Pass by value) · Vor-/Nachbedingungen, schrittweise Verfeinerung · Gültigkeitsbereich · Bibliotheken, Namensräume |
| I5 | infln05 | Vektoren (Speicherlayout) · Referenzen, Pass by reference · const-Referenzen |
| I6 | infln06 | ASCII / UTF-8, Caesar-Chiffre |
| I7 | infln07 | Rekursion: Aufrufstapel, Beispiele, Strategien |

Order inside a chapter follows conceptual dependencies, not page order, where they differ.
