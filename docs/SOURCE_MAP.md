# Source map — Mechanik I Mitschrift

Source file: `Mitschrift.pdf` (uploaded 2026-10-10, 22 PDF pages, A4; typeset notes + photographed slides + handwritten additions).
**Page references everywhere in this project use the PRINTED page number** (header/footer of the notes), not the PDF page index.

> The PDF's embedded text layer has broken glyph mappings (e.g. it reads ρ, φ as "ω, ε"). Never trust `pdftotext` output for symbols — read the rendered page.

## Page index

| PDF p. | Printed p. | Content | Type |
|---|---|---|---|
| — | 1–2 | **missing** (presumably title page / table of contents) | — |
| 1 | 3 | Ch. 1 intro, material system, reference body, Cartesian coords (Fig 1.4, 1.7), cylindrical coords (Fig 1.8, 1.10) | typeset |
| 2 | 4 | Cyl.↔Cart. conversions, spherical coords (Fig 1.12), Sph.↔Cart. conversions | typeset |
| 3 | 5 | §1.1 vectors, position vector, orthonormal basis, scalar & cross product, §1.1.1 Cartesian basis | typeset + figures |
| 4 | 6 | scalar/vector components, eq. (1), basis ↔ coordinates, §1.1.2 cylindrical basis, eq. (2) | typeset |
| 5 | 7 | §1.1.3 spherical basis (figure only + 2 lines) | typeset, mostly empty |
| 6 | 8 | Ch. 2 velocity: 1D, velocity vector, §2.1, arc length, speed ṡ, v = ṡ τ | typeset |
| (screenshot) | 9 | v̲ = ṙ̲ = τ̲ ṡ via chain rule; §2.2 explicit velocity in Cartesian basis, start of cylindrical | typeset + handwritten strike-throughs; supplied separately 2026-10-10 as an iPad screenshot (GoodNotes page 11) |
| 7 | 10 | e_ρ, e_φ in Cartesian basis, ė_ρ = φ̇ e_φ, velocity in cyl. and sph. basis, Beispiel (unsolved) | typeset + handwritten |
| 8 | 11 | Kreisbewegung, ω = φ̇ e_z, v = ω × r | typeset + handwritten |
| 9 | (none) | two photographed lecture slides "Kreisbewegung" (slide label L5) | photos |
| 10 | 12 | Ch. 3 rigid body, Fig 3.1, SdpG statement + proof | typeset + handwritten |
| 11 | 13 | Beispiel gleitende Leiter (handwritten solution), Translation, Fig 3.4 | mixed |
| 12 | 14 | congruent trajectories, circular/momentary translation figures, Beispiel Würfel (empty) | typeset + figures |
| 13 | 15 | Rotation: definition, axis μ, three properties | typeset + handwritten |
| 14 | 16 | Proof of property 2 (circular motion) | typeset |
| 15 | 17 | Proof of property 3 (equal angular speed), eq. (3) v = ω × r | typeset |
| 16 | 18 | Fig 3.8 velocity distribution in rotation; v = ω × r valid if O on μ | typeset |
| 17 | 19 | Beispiel Würfel, Rotation (two variants, handwritten solutions) | mixed |
| 18 | 20 | Rollen = momentane Rotation; Gleiten/Rollen contact conditions; Kreiselung intro | typeset |
| 19 | 21 | Proof: Kreiselung = momentane Rotation (Fig 3.11) | typeset + handwritten |
| 20 | 22 | Allgemeinste Bewegung, ω independent of reference point, Grundgleichung | typeset |
| 21 | 23 | Beispiel Tetraeder (empty), Beispiel Würfel allgemeine Bewegung (handwritten) | mixed |
| 22 | (none) | handwritten continuation of the p. 23 cube example | handwritten |
| (screenshot) | 24 | Kinemate {v̲_B, ω̲}, 1. and 2. invariant, Fig. 3.16 Zentralachse und Schraube | typeset + figure + student's red notes; supplied 2026-10-19 as iPad screenshots (GoodNotes p. 28) |
| (screenshot) | 25 | Allgemeine Bewegung als Schraubung, Kinemate der Punkte auf ζ, Problem Fig. 3.30, |v|_max/min, special cases | typeset + handwritten (GoodNotes p. 29) |
| (screenshot) | (none, after 25) | handwritten solution of Problem Fig. 3.30 (central axis ζ) | handwritten |
| (screenshot) | 26 | 3.1 Ebene Bewegung: ω̲ ⊥ plane; Satz vom Momentanzentrum, Fig. 3.19 | typeset + photo |
| (screenshot) | 27 | Fig. 3.20 rollendes Rad (Z = Momentanzentrum); Beispiel Leiter, «Löse mit SMZ» (solution missing) | typeset + handwritten |
| (screenshot) | 28 | Fig. 3.21 Planetengetriebe (Sonnenrad, Hohlrad, Planetenrad, Arm) with handwritten solution | typeset + handwritten |

## Page-by-page transcription (content, notation, equations)

Equation numbers in parentheses are the lecture's own.

### p. 3 — 1 Bewegung eines materiellen Punktes
- *Materielles System*: Menge von materiellen Punkten.
- Lage eines materiellen Punktes M zur Zeit t: M(t), geometrischer Punkt im 3D-Raum.
- Bewegung: Lageänderung als Funktion der Zeit → M(t₁), M(t₂), …
- Beschreibung der Lage benötigt *starren Bezugskörper* (Abstand zwischen 2 Punkten des Körpers konstant).
- Fig 1.4 kartesische Koordinaten (points M_x, M_y, M_z, M_xy); Fig 1.7 Koordinatenlinien (x̄, ȳ, z̄ through M).
- x'Ox, y'Oy, z'Oz: gerichtete orthogonale Achsen (im Bezugskörper). x, y, z beschreiben Lage von M.
- Bewegung: x = F_x(t), y = F_y(t), z = F_z(t).
- Zylindrische Koordinaten ρ, φ, z (Fig 1.8; Fig 1.10 Koordinatenlinien incl. circle, labelled z̄, φ̄, ρ through M). Bahnkurve ρ = F_ρ(t), φ = F_φ(t), z = F_z(t).

### p. 4
- x = ρ cos φ, y = ρ sin φ, z = z. Umgekehrt ρ = √(x²+y²), φ = arctan(y/x), z = z. → **R-001**
- Sphärische Koordinaten r, θ, ψ (Fig 1.12 + Koordinatenlinien). Bahnkurve r = F_r(t), θ = F_θ(t), ψ = F_ψ(t).
- x = r sin θ cos ψ, y = r sin θ sin ψ, z = r cos θ. Umgekehrt r = √(x²+y²+z²), θ = arctan(√(x²+y²)/z), ψ = arctan(y/x). → **R-001**

### p. 5 — 1.1 Vektorielle Darstellung von Lage und Bewegung
- Vektor: Pfeil mit Länge und Richtung/Orientierung → Informationsträger.
- r̲: Ortsvektor (punktgebunden), definiert eindeutig Lage von M. Bewegung t → r̲ = r̲(t), Vektorfunktion.
- Basis nötig; hier orthonormierte Basisvektoren e̲₁, e̲₂, e̲₃: e̲₁ ⊥ e̲₂ ⊥ e̲₃, |e̲ᵢ| = 1.
- Skalarprodukt a̲·b̲ = |a̲||b̲| cos φ; e̲₁·e̲₁ = 1; e̲₁·e̲₂ = 0 → φ = π/2; a̲·e̲₁ = |a̲| cos φ = Projektion von a̲ auf e̲₁-Richtung.
- Kreuzprodukt |c̲| = |a̲||b̲| sin φ (parallelogram figure, c̲ ⊥ a̲, b̲). e̲₁×e̲₂ = e̲₃, e̲₂×e̲₃ = e̲₁, e̲₃×e̲₁ = e̲₂ → Rechtssystem.
- 1.1.1 Kartesische Basis e̲_x, e̲_y, e̲_z; r̲ = r_x e̲_x + r_y e̲_y + r_z e̲_z.

### p. 6
- r_x = r̲·e̲_x = x, r_y = r̲·e̲_y = y, r_z = r̲·e̲_z = z.
- (1) r̲(t) = x(t) e̲_x + y(t) e̲_y + z(t) e̲_z.
- Allgemein: Basis ⟷ Koordinaten. Basisvektoren: Einheitsvektoren parallel bzw. tangential zu Koordinatenlinien im betrachteten Punkt! (figure: Cartesian basis drawn at O and at M — identical.)
- 1.1.2 Zylindrische Basis e̲_ρ, e̲_φ, e̲_z; r̲ = ρ e̲_ρ + z e̲_z; e̲_ρ(φ), "auch hier sind 3 Informationen nötig!"
- (2) r̲(t) = ρ(t) · e̲_ρ(φ(t)) + z(t) e̲_z. Figure: e̲_ρ, e̲_φ, e̲_z at M.

### p. 7 — 1.1.3 Sphärische Basis
- Figure "Sphärische Basis, tangential zu Koordinatenlinien": e̲_r, e̲_θ, e̲_ψ at M. r̲ = r · e̲_r, e̲_r(Θ, Ψ). Rest of page empty.

### p. 8 — 2 Geschwindigkeit
- Geradlinige Bewegung: x(t) skalare Funktion; v = dx/dt = ẋ = lim_{Δt→0} (x(t+Δt) − x(t))/Δt.
- Gesucht für 3D: v̲ ⟺ r̲(t). Geschwindigkeitsvektor v̲ liegt tangential an Bahnkurve.
- Zu zeigen: v̲ = ṙ̲ = (ẋ, ẏ, ż) für kartesische Basis. (Proof on p. 9.)
- 2.1 figure: r̲(t), r̲(t+Δt), Δr̲, arc Δs, Bogenlänge s, τ̲ tangentialer Einheitsvektor.
- Schnelligkeit ṡ = lim (s(t+Δt) − s(t))/Δt = lim Δs/Δt. v̲ = ṡ · τ̲. ṡ: wie schnell? τ̲: in welche Richtung?

### p. 9 (supplied separately as a screenshot; not in the PDF)
- Vektorfunktion r̲(t): ṙ̲ = lim_{Δt→0} (r̲(t+Δt) − r̲(t))/Δt = lim_{Δt→0} Δr̲/Δt.
- Δr̲ = r̲(t+Δt) − r̲(t) → r̲(t) + Δr̲ = r̲(t+Δt).
- für Δt → 0: ṙ̲ ∥ Δr̲. Δr̲ ∥ τ̲ → ṙ̲ ∥ τ̲, v̲ (siehe Figur [= Fig. on p. 8]). → R-014
- r̲(t) → r̲(s) = r̲(s(t)).
  dr̲/dt = ṙ̲ = (dr̲/ds)(ds/dt) (Kettenregel), ds/dt = ṡ (underbrace).
  dr̲/ds = lim_{Δs→0} Δr̲/Δs = τ̲.
  ṙ̲ = (dr̲/ds) · ṡ = τ̲ · ṡ = v̲. → R-014
- **2.2 Explizite Darstellung der Geschwindigkeit.** "Darstellung von r̲ = ṙ̲, d.h. v̲:" → R-013
- • Kartesische Basis: r̲(t) = x(t) e̲_x + y(t) e̲_y + z(t) e̲_z;
  ṙ̲ = ẋ e̲_x + x ė̲_x + ẏ e̲_y + y ė̲_y + ż e̲_z + z ė̲_z, with the three terms x ė̲_x, y ė̲_y, z ė̲_z struck through (constant basis);
  highlighted: **ṙ̲ = ẋ e̲_x + ẏ e̲_y + ż e̲_z**.
- • Zylindrische Basis: r̲ = ρ(t) · e̲_ρ(φ(t)) + z(t) e̲_z;
  ṙ̲ = ρ̇ e̲_ρ + ρ ė̲_ρ + ż e̲_z + z ė̲_z (last term struck through);
  ė̲_ρ ≠ 0. e̲_ρ: beschreibe als Vektor in einer konstanten Basis! (continues on p. 10 with e̲_ρ = cos φ e̲_x + sin φ e̲_y).

### p. 10
- e̲_ρ = cos φ e̲_x + sin φ e̲_y; e̲_φ = −sin φ e̲_x + cos φ e̲_y (figure).
- ė̲_ρ = (cos φ)˙ e̲_x + (sin φ)˙ e̲_y = φ̇(−sin φ e̲_x + cos φ e̲_y) = φ̇ e̲_φ.
- ṙ̲ = ρ̇ e̲_ρ + ρ φ̇ e̲_φ + ż e̲_z = v̲.
- Sphärische Basis: r̲(t) = r(t) e̲_r; highlighted: ṙ̲(t) = ṙ e̲_r + r θ̇ e̲_θ + r sin θ ψ̇ e̲_ψ = v̲ (handwritten: "Beweis cf Hausübung 3").
- Beispiel: Gegeben r̲ = (at, at, b a² t²) (Bahnkurve in kartesischer Basis). Gesucht v̲(t), ṡ(t), τ̲(t). *Not solved in the notes.* → R-008

### p. 11 — Kreisbewegung
- ρ = R, φ = φ(t), z = z₀. In zylindrischer Basis r̲(t) = R e̲_ρ + z₀ e̲_z, e̲_ρ(φ(t)).
- r̲ : (R, φ(t), z₀) crossed out "Falsch!" → r̲ : (R, 0, z₀).
- v̲ = ρ̇ e̲_ρ + ρ φ̇ e̲_φ + ż e̲_z = R φ̇ e̲_φ: tangential zum Kreis. ṡ = R φ̇, τ̲ = e̲_φ.
- φ̇: Winkelschnelligkeit in rad/s. "Winkelgeschwindigkeit" ω̲ = φ̇ e̲_z.
- Umformung: e̲_φ = e̲_z × e̲_ρ → v̲ = Rφ̇ (e̲_z × e̲_ρ) = φ̇ e̲_z × R e̲_ρ; R e̲_ρ = r̲ − z₀ e̲_z; v̲ = φ̇ e̲_z × (r̲ − z₀ e̲_z) = φ̇ e̲_z × r̲ − z₀ φ̇ (e̲_z × e̲_z) [handwritten: kolineare Vektoren → Kreuzprodukt = 0]; v̲ = ω̲ × r̲: Kreisbewegung.
- Allgemein! ω̲ ∥ Achse der Bewegung, v̲ = 0 auf der Achse.
- Kartesisch: ω̲ = φ̇ e̲_z, r̲ = R cos φ e̲_x + R sin φ e̲_y + z₀ e̲_z; v̲ = (0,0,φ̇) × (R cos φ, R sin φ, z₀) = (−φ̇ R sin φ, φ̇ R cos φ, 0) = φ̇ R e̲_φ.

### PDF p. 9 (unnumbered) — slides "Kreisbewegung" (L5)
- Slide 1: r̲ = R e̲_ρ + z₀ e̲_z; v̲ = ρ̇ e̲_ρ + ρ φ̇ e̲_φ + ż e̲_z; v̲ = R φ̇ e̲_φ (Winkelschnelligkeit); ω̲ = φ̇ e̲_z (Winkelgeschwindigkeit); v̲ = ω̲ × r̲; (0,0,φ̇) × (R,0,z₀) = (0·z₀ − φ̇·0, φ̇R − 0·z₀, 0·0 − 0·R) = (0, φ̇R, 0) = φ̇ R e̲_φ = v̲ (components in the cylindrical basis).
- Slide 2: same plus a rotation about a general axis μ through A, B (a = AB), local basis sketch. Partly obscured.

### p. 12 — 3 Starrer Körper
- Eigenschaften: Abstand zwischen 2 beliebigen Punkten konstant; Winkel zwischen Verbindungsvektoren konstant → keine Gestalt-/Volumenänderung, keine Deformation. Fig 3.1.
- a̲ = MM', b̲ = MM''. i.A. a̲(t₁) ≠ a̲(t₂); |a̲(t₁)| = |a̲(t₂)|, |b̲(t₁)| = |b̲(t₂)|, α(t₁) = α(t₂) ∀ t₁, t₂, … → a̲(t)·b̲(t) = |a̲||b̲| cos α konstant. (Handwritten: (a̲·b̲)˙ = [|a||b| cos α]˙ = 0.)
- a̲(t)·a̲(t) = |a̲|² konstant → **Satz der projizierten Geschwindigkeiten (SdpG)**: Die Geschwindigkeiten v̲_M, v̲_N zweier beliebiger Punkte M und N eines starren Körpers weisen zu allen Zeiten gleiche Projektionen v̲'_M = v̲'_N in Richtung ihrer Verbindungsgeraden MN auf.
- Beweis: a̲·a̲ = konst → (a̲·a̲)˙ = 0 = 2(a̲·ȧ̲); a̲ = r̲_N − r̲_M, ȧ̲ = v̲_N − v̲_M; a̲·(v̲_N − v̲_M) = 0 → v̲_N·a̲ = v̲_M·a̲.

### p. 13
- Beispiel gleitende Leiter (handwritten): Leiter bewegt sich nach oben; A gleitet am Boden, B an der Wand. Gegeben L, α, ṡ_A = v_H. v̲_A = (v_H,0,0), v̲_B = (0,v_V,0). SdpG: v̲_A·AB = v̲_B·AB with AB = (L cos α, L sin α, 0) → v_H L cos α = v_V L sin α → v_V = v_H cos α / sin α (cot α). → R-006 (figure labels the angle φ).
- Translation: a̲ = r̲_N − r̲_M; |a̲| konstant ∀t, Richtung veränderlich. Falls a̲ konstant in Betrag *und* Richtung → Translation. a̲ = konst → ȧ̲ = 0 = v̲_N − v̲_M → v̲_N = v̲_M, alle Punkte gleiche Geschwindigkeit. Fig 3.4 kongruente Bahnkurven.

### p. 14
- Alle Bahnkurven kongruent: geradlinige oder krummlinige Translation. Figures: kreisförmige Translation; «Momentane Translation»: a block on two inclined straight rails (labels T under the straight parts, two black bars marking off the corner zone) and a block in a bowl whose lowest part is a short flat piece between two bars, labelled T (block drawn there with a horizontal velocity arrow).
- Beispiel Würfel (cube A, B, C sketch) — *empty*.

### p. 15 — Rotation
- Rotation liegt vor, falls 2 Punkte des Körpers in Ruhe sind. Rotationsachse μ: Achse durch 2 Punkte, die in Ruhe sind (figure: A, C, B on μ).
- Eigenschaften: (1) alle Punkte auf μ in Ruhe; (2) alle Punkte ∉ μ: Kreisbewegung; (3) Winkelschnelligkeit gleich ∀ Punkte.
- Anschaulich: v̲_C ∥ μ = 0 aus SdpG; v̲_C ⊥ μ = 0 sonst Winkeländerung. → R-009

### p. 16 — Beweis 2 (Kreisbewegung)
- Figure: μ through O, D, A; P with DP ⊥ μ; r̲_P from O.
- Damit Kreisbewegung um μ: v̲_P ⊥ DP, v̲_P ⊥ μ.
- SdpG P ⟷ D: v̲_P·DP = v̲_D·DP (= 0) → v̲_P ⊥ DP.
- Zu zeigen v̲_P ⊥ μ: (DP·DA)˙ = ((r̲_P − r̲_D)·(r̲_A − r̲_D))˙ = 0; (r̲_P − r̲_D)˙·(r̲_A − r̲_D) + (r̲_P − r̲_D)·(r̲_A − r̲_D)˙ = 0, v̲_A = v̲_D = 0; ṙ̲_P·(r̲_A − r̲_D) = 0 → v̲_P ⊥ μ. → R-010
- Zylindrisch: r̲_P = ρ(t) e̲_ρ + z(t) e̲_z, v̲_P = ρ̇ e̲_ρ + ρ φ̇ e̲_φ + ż e̲_z; v̲_P ⊥ μ ⟷ e̲_z ⇒ ż = 0, z = z₀; v̲_P ⊥ DP ⟷ e̲_ρ ⇒ ρ̇ = 0, ρ = R; r̲_P = R e̲_ρ + z₀ e̲_z: Kreisbewegung!

### p. 17 — Beweis 3 (gleiche Winkelschnelligkeit)
- v̲_P = φ̇_P e̲_z × r̲_P, v̲_Q = φ̇_Q e̲_z × r̲_Q. Zu zeigen φ̇_P = φ̇_Q.
- SdpG: v̲_P·PQ = v̲_Q·PQ; φ̇_P (e̲_z × r̲_P)·(r̲_Q − r̲_P) = φ̇_Q (e̲_z × r̲_Q)·(r̲_Q − r̲_P);
  φ̇_P (e̲_z × r̲_P)·r̲_Q = −φ̇_**P** (e̲_z × r̲_Q)·r̲_P = φ̇_Q (r̲_Q × e̲_z)·r̲_P [Wegen −(a×b) = b×a] → **R-003**;
  φ̇_P (e̲_z × r̲_P)·r̲_Q = φ̇_Q (e̲_z × r̲_P)·r̲_Q [Wegen Spatprodukt (a×b)·c = (b×c)·a] → φ̇_P = φ̇_Q.
- Somit: Rotation: alle Punkte führen Kreisbewegung mit "Winkelgeschwindigkeit"/"Rotationsgeschwindigkeit" ω̲ = φ̇ e̲_μ, mit μ = z'Oz → ω̲ = φ̇ e̲_z.
- (3) v̲ = ω̲ × r̲ = φ̇ e̲_z × r̲ (mit O auf μ).

### p. 18
- v̲_M = ω̲ × OM, |v̲_M| = |ω̲|·|AM| (A = foot of perpendicular on μ). Fig 3.8 Geschwindigkeitsverteilung bei Rotation.
- Gleichung v̲ = ω̲ × r̲ gültig auch falls μ ≠ z'Oz, solange Ursprung O auf μ ist!

### p. 19 — Beispiel Würfel, Rotation
- Figure: cube edge a, O ≡ A at origin, B on x-axis, E at (0,a,0) on y-axis, C at the far top corner; red line E→C labelled μ; blue local basis at E.
- Handwritten variant 1: Gegeben Rotation, v̲_E = 0, ω̲ = (0, 2ω, ω), ω gegeben. v̲_C = ω̲ × EC (crossed out: v̲_C = ω̲ × r̲_C(AC) — "nicht auf μ"); v̲_C = (0,2ω,ω) × (0,0,a) = … (unfinished). → R-005
- Typed variant 2: Gegeben Rotation, v̲_A = (v,0,**v**), v̲_B = (v_Bx, v, −v), v̲_E = 0. Gesucht ω̲, v̲_B, μ.
  Handwritten solution: v_Bx via SdpG v̲_A·AB = v̲_B·AB → v_Bx = v. ω: v̲_A = ω̲ × EA, (v,0,**−v**) = (ω_x,ω_y,ω_z) × (0,−a,0) → v = aω_z, 0 = 0, −v = −aω_x → ω_z = ω_x = v/a. v̲_B = ω̲ × EB: (v,v,−v) = (v/a, ω_y, v/a) × (a,−a,0) → … → ω_y = 0. Result ω̲ = (v/a, 0, v/a), μ: (0,a,0) + λ(a,0,a). → **R-004**

### p. 20
- Rollen: momentane Rotation (cylinder rolling on a plane; contact line AB; μ ⟷ AB, not CD).
- Gleiten/Rollen. Kontakt (ohne Eindringen) between bodies Z₁, Z₂ at a point with tangent plane E; n̲ ⊥ E, t̲ in E.
  "Kontakt" → v̲_n(Z₁) = v̲_n(Z₂). Gleiten: v̲_t(Z₁) ≠ v̲_t(Z₂). Rollen: v̲_t(Z₁) = v̲_t(Z₂). Falls Z₂ in Ruhe: v̲(Z₁) = 0 ⟷ Rollen; v̲(Z₁) = v̲_t(Z₁) ≠ 0 ⟷ Gleiten.
- Kreiselung: liegt vor, falls nur 1 Punkt in Ruhe → wähle O. Bahnkurven auf Kugel mit Radius |r̲|. Behauptung: momentan ist nicht nur O in Ruhe, sondern eine ganze Achse durch O.

### p. 21 — Beweis (Fig 3.11)
- Two planes E_M, E_N through M and N (handwritten: v_M ⊥ r_M, **E_M ⊥ r_M** [sic — slip for E_M ⊥ v_M, see the typed line below; R-017], r_M ∈ E_M, r_N ∈ E_N, μ = E_M ∩ E_N (Gerade)).
- Wähle E_M ⊥ v̲_M, E_N ⊥ v̲_N → A ∈ E_M, A ∈ E_N.
- SdpG: v̲_A·AM = v̲_M·AM (= 0) → v̲_A = 0 oder v̲_A ⊥ AM. Same for N: v̲_A = 0 oder v̲_A ⊥ AN.
- Ansicht ⊥ AO: v̲_A ∥ AO? Nein, da v̲_A·AO = v̲_O·AO = 0 → v̲_A ⊥ AO → v̲_A = 0. → R-012
- Kreiselung als momentane Rotation; 1 Punkt (O) in Ruhe: v̲ = ω̲ × r̲.
- Kombination von Kreiselung und Translation → allgemeinster Bewegungszustand des starren Körpers!

### p. 22 — Allgemeinste Bewegung
- r̲_M = r̲_B + ρ̲; ṙ̲_M = v̲_M = v̲_B + ρ̲̇; ρ̲̇: Geschwindigkeit von M bezüglich B.
- B als Bezugspunkt auf K: bez. B führen alle Punkte eine Kreiselung aus; ω̲*: Winkelgeschwindigkeit der Kreiselung um B. ρ̲̇ = v̲*_M = ω̲* × ρ̲ = ω̲* × BM; v̲_M = v̲_B + ω̲* × BM.
- Anderer Bezugspunkt C: v̲_M = v̲_C + ω̲** × CM. Behauptung ω̲* = ω̲** = ω̲ (gleich für alle Bezugspunkte).
  v̲_B + ω̲* × BM = v̲_C + ω̲** × CM; v̲_B + ω̲* × (BC + CM) = …; v̲_B + ω̲* × BC + ω̲* × CM = v̲_C + ω̲** × CM = v̲_B + ω̲* × BC + ω̲** × CM → ω̲* = ω̲** da B, C, M beliebig.
- **Grundgleichung des Bewegungszustandes**: v̲_M = v̲_B + ω̲ × BM ∀ M, B ∈ K. Aus v̲_P, ω̲ ⇒ Geschwindigkeit in jedem Punkt berechnen.

### p. 23 (+ PDF p. 22)
- Beispiel Tetraeder, allgemeine Bewegung (D origin, A on x, C on y, B, E below; edge a) — *empty*.
- Beispiel Würfel, allgemeine Bewegung: edge L, B at origin, x toward viewer, y right, z up; P₁ = (L,L,0), P₂ = (0,L,L), P₃ = (0,0,L) (inferred from the vectors used).
  Gegeben P₁: v̲₁ = (−v,0,0), P₂: v̲₂ = (0,0,v), P₃: v̲₃ = (−v,0,0). Gesucht v̲_B, ω̲ ("Kinemat in B").
  v̲₃ = v̲₁ + ω̲ × P₁P₃; 0 = ω̲ × (−L,−L,L) → ω_y = −ω_z, ω_x = −ω_z, ω_x = ω_y → ω̲ = (ω_x, ω_x, −ω_x).
  v̲₂ − v̲₃ = (v,0,v) = ω̲ × (0,L,0) → ω_x = v/L; ω̲ = (v/L)(1,1,−1).
  v̲_B = v̲₃ + ω̲ × P₃B = (−v,0,0) + (v/L)(1,1,−1) × (0,0,−L): v_Bx = −2v, v_By = v, v_Bz = (blank). → R-007

> **Pages 24–28** were supplied on 2026-10-19 as iPad screenshots of the student's GoodNotes file (two screenshots each of pp. 24/25 and 27). Red handwriting is mostly the **student's own notes and requests** (e.g. «Animation die das einfach visualisieren lässt», «+ Erklärung», «(Warum?)», «Lösung fehlt») — they are requests, not lecture content. Black/green/blue handwriting is the student's transcript of the lecture.

### p. 24 — Allgemeine Bewegung: Kinemate, Invarianten, Zentralachse
- Allgemeine Bewegung: v̲_M = v̲_B + ω̲ × BM̲.
- Spezialfälle: • ω̲ = 0̲ → v̲_M = v̲_B Translation • v̲_B = 0̲ → v̲_M = ω̲ × BM̲ Rotation, Rotationsachse durch B.
- i.A.: {v̲_B, ω̲}: **Kinemate** in B → charakterisiert Bewegungszustand! Wie verändert sich Kinemate je nach Ort?
- {v̲_P, ω̲'} ⟷ {v̲_B, ω̲} → ω̲' = ω̲ → 1. Invariante (invariant bez. Ort!) [student, red: «+ Erklärung»]; v̲_P = v̲_B + ω̲ × BP̲ ≠ v̲_B.
- → 2. Invariante? v̲_P = v̲_B + ω̲ × BP̲; v̲_P · e̲_ω = v̲_B · e̲_ω + (ω̲ × BP̲) · e̲_ω [last term struck out].
- Projektion von v̲ in Richtung von ω̲: v̲_ω in jedem Punkt gleich → v̲_ω: 2. Invariante. Physikalisch / anschauliche Interpretation:
- **Fig. 3.16: Zentralachse und Schraube** — B with v̲_B, ω̲, v̲_ω (blue, ∥ ω̲) and (v̲_B)^⊥; a line g through B (green); a point P on g at distance x from B (dz marked); e̲^⊥; the central axis ζ (yellow band, ∥ ω̲) through Z with v̲_Z = v̲_ω; B* with v̲_B*, (v̲_B*)^⊥; Z'.
  Equations beside the figure: v̲_P = v̲_B + ω̲ × BP̲; v̲_P = v̲_ω + v̲_B^⊥ + ω̲ × BP̲; v̲_P = v̲_ω + v_B^⊥ · e̲^⊥ − ω · x · e̲^⊥; v̲_P = v̲_ω + (v_B^⊥ − ω · x) · e̲^⊥.
- Student, red: «Bewegung» (spiral sketch), «Schraubungsachse ↳ Rotationsachse die Translation macht», «→ Animation die das einfach visualisieren lässt».

### p. 25 — Schraubung um die Zentralachse
- Allgemeine Bewegung als "Schraubung" um Zentralachse ζ. ζ: Zentralachse / Schraubungsachse.
- Kinemate der Punkte auf ζ: {v̲_ω, ω̲}, "Schraube" [handwritten: → v̲_ω ist invariabel]. → Bestimmung der Lage der Zentralachse bei allgemeinem Bewegungszustand.
- **Problem Figur 3.30** (Fig. 3.30): cube, edge 1 m; data «1 m, 2 m/s, 2 s⁻¹»; axes x toward the viewer, y right, z up; B at a bottom corner; v̲_B on a diagonal, ω̲ along y; ζ drawn in green along the bottom front edge. Second figure: v̲_B^⊥ = (0,0,2), v̲_B = (0,2,2), ω̲ = (0,2,0), edge 1.
- |v̲|_max: Maximaler Abstand von ζ; |v̲|_min: Minimaler Abstand von ζ. → R-020
- Merke: ζ braucht nicht materieller Bestandteil von Körper zu sein. [handwritten: ζ i.A. nicht im Körper; „ zeitlich veränderbar]
- • Schraube {v̲_ω, ω̲}: Kinemate der Punkte auf ζ. • 1. Invariante: ω̲, 2. Invariante: v̲_ω: → |v̲_ω| = v̲_B · ω̲/|ω̲|. → R-021
- Spezialfälle: • ω̲ = 0̲ → Translation • ω̲ ≠ 0̲, v̲_B = 0̲ → Rotation, B ∈ μ [green: → kein v̲_ω] • ω̲ ≠ 0̲, v̲_B ⊥ ω̲ → Rotation, B ∉ μ [green: → kein Schraubung, ζ wird zur Rotationsachse].
- → Wichtige Anwendung: Ebene Bewegung.
- Handwritten: v̲_ω = (v̲ · e̲_ω) · e̲_ω — «Projektion».

### (handwritten page after p. 25) — solution of Problem Fig. 3.30
- Gegeben: Kinemate in B (v̲_B; ω̲). Gesucht: ζ. v̲_B = (0,2,2).
- (v̲_B · e̲_ω) = (0,2,2)·(0,1,0) = 2; v̲_P = v̲_ω = 2 · e̲_ω.
- P ∈ ζ ⇒ v̲_P = v̲_ω ⇔ v̲_P = v̲_B · ω̲ × BP̲ [sic: «·» for «+», R-019] ⇔ (0,2,0) = (0,2,2) · (0,2,0) × (x_P, y_P, z_P) [same slip] ⇔ (0,0,−2) = (2z_P, 0, −2x_P)
  ⇒ z_P = 0, y_P → beliebig, x_P = 1 [student, red: «(Warum?)»].
- ζ: (1,0,0) + λ(0,1,0) [student, red: «Ortsvektor ← Vektor: geht von dem Punkt, gefunden durch den Ortsvektor, aus.»]. (Implicitly B = origin, BP̲ = (x_P, y_P, z_P).) Verified: `screw.test.ts`.

### p. 26 — 3.1 Ebene Bewegung; Satz vom Momentanzentrum
- Bahnkurven aller Punkte bleiben in parallelen Ebenen!
- Ebene E ∥ zu x,y-Ebene [handwritten under it, partly legible: «↳ z = 0»], Punkt P ∈ E → v̲_P = (v_Px, v_Py, 0), und Punkt A im gleichen Körper: v̲_A = v̲_P + ω̲ × PA̲.
  (v_Ax, v_Ay, 0) = (v_Px, v_Py, 0) + (ω_x, ω_y, ω_z) × (PA_x, PA_y, PA_z) [red: the two zeros boxed, «immer bei einer ebenen Bewegung»].
  v_Az = 0 = 0 + ω_x PA_y − ω_y PA_x, ∀ PA_x, PA_y → ω̲ = (0, 0, ω_z) «Rotation!» oder ω̲ = 0̲ «Translation». (A 3D plot image beside it.)
- Falls Rotation: μ ⊥ Ebene E.
- **Satz vom Momentanzentrum** (S. 56): Bei jeder ebenen Bewegung eines starren Körpers K mit ω̲ ≠ 0̲ beschreibt der ebene Schnitt K_E von K in der Bewegungsebene E eine momentane Rotation um einen Punkt Z ≡ μ ∩ E, der Momentanzentrum der ebenen Bewegung heisst. Das Momentanzentrum Z ist der einzige momentan ruhende Punkt des in Gedanken auf die ganze Ebene E ausgedehnten Körpers K_E. Die Geschwindigkeit v̲_M eines beliebigen Punktes M von K in E ist dann nach Fig. 3.19 senkrecht zur Verbindungsgeraden mit dem Momentanzentrum Z und besitzt den durch den Drehsinn von ω̲ = ω e̲_z = φ̇ e̲_z vorgeschriebenen Richtungssinn sowie den mit dem Abstand r von Z gebildeten Betrag v_M = ω r.
- Photo of the lecture; **Figur 3.19**: K_E, a point M with v̲_M ⊥ r, Z, ω (curved arrow).

### p. 27 — rollendes Rad; Leiter mit dem Momentanzentrum
- **Figur 3.20: rollendes Rad** — P on the rim with v̲_P, centre O with v̲_O, radius R, contact point Z, ω (curved arrows). «Z: Momentanzentrum; v̲_P ⊥ ZP̲, v_P = ω · |ZP̲|; v̲_O ⊥ ZO̲, v_O = ω · R».
- **Beispiel: Leiter, geführte Ebene Bewegung.** Aus SdpG: v_V = v_H · 1/tan φ.
  Figure: ladder AB, length L, A on the floor (bottom left), B at the wall (top right), angle φ at A; axes y up, x right. Handwritten: v_H at A pointing left (green), v_V / v̲_B at B pointing down (red); Z (blue) at the intersection of the red dashed vertical through A and horizontal through B, with a curved ω arrow; «e̲_y ↑, e̲_x →, e̲_z ⊙»; «gesucht: v_V; v̲_B (0, −v_V, 0)»; «Löse mit SMZ:» «v̲_A (−v_H, 0, 0)», «v_H =».
- Student, red: «Lösung fehlt». (The app's solution with the Momentanzentrum is a supplement; verified `plane.test.ts`.)

### p. 28 — Planetengetriebe
- **Figur 3.21: Planetengetriebe** (pink: «S. 57/58»): centre O; 1 Sonnenrad R₁, Z₁ ≡ O, ω₁; 2 Hohlrad R₂, Z₂ ≡ O, ω₂; 3 Planetenrad R₃, Z₃, ω₃; Arm, L, Z_A ≡ O, ω. Figure: P = contact sun–planet, Q = contact planet–ring (top), A (= O') planet centre on the arm; arrows R₂ω₂ at Q, R₁ω₁ at P, v at A (all pointing left); Z₃ on the line QPO below; ω₂ curved arrow.
- Geometrie: R₃ = ½(R₂ − R₁); L = R₁ + R₃ = ½(R₂ + R₁).
- Handwritten solution: P, Q ∈ [3]. P ∈ [1]: v_P = ω₁R₁. Q ∈ [2]: v_Q = ω₂R₂. (PQ = R₂ − R₁)
  { Z₃P · ω₃ = v_P = ω₁R₁ ; (Z₃P + PQ) · ω₃ = v_Q = ω₂R₂ } → Z₃P ω₃ − Z₃P ω₃ − PQ ω₃ = ω₁R₁ − ω₂R₂ ⇔ ω₁R₁ + PQ ω₃ = ω₂R₂ ⇔ ω₃ = (ω₂R₂ − ω₁R₁)/(R₂ − R₁). [Side note: «ω₂R₂ = ω₁R₁ ?»]
  v_A = ½(ω₂R₂ + ω₁R₁); A ∈ Arm; Z_Arm = O; ω_Arm · L = v_A; ω_Arm = v_A/L = ½(ω₂R₂ + ω₁R₁)/(½(R₂ + R₁)).
  Boxed: **ω_Arm = ω₂ · R₂/(R₂+R₁) + ω₁ · R₁/(R₂+R₁)**.
- Red (partly legible): «ω₂ = 0 → 1. (erstes) Übersetzungsverhältnis»; «ω₂ ≠ 0 … ω₂ < 0 ⇒ ω_Arm ↓».
- Sign convention implied by the figure: all velocities drawn in the same sense (to the left), i.e. ω₁, ω₂, ω₃, ω_Arm counted in the same turning sense (counter-clockwise for the drawn arrows). Verified `planetary.test.ts`.

---
## Kapitel 4 «Kräfte» (pp. 29–32) und Kapitel 5 «Leistung» (pp. 33–36)
(Source: the student's Goodnotes PDF «2018 HS Mitschrift», PDF pages 31–38 = printed pages 29–36; read from screenshots, pages 29–36. Handwriting in *italics*, colours in brackets. Verified numbers: `src/physics/force.test.ts`.)

### p. 29 — 4 Kräfte: Eigenschaften, mathematische Beschreibung
- **Eigenschaften:** • Beschreiben Wechselwirkung zwischen materiellen Systemen. • Ursachen für Veränderung von v̲ oder Veränderung der Gestalt [«v̲» and «Gestalt» underlined]. • Statik: Wie sollen Kräfte sein, damit ein System in Ruhe bleibt? → *Gleichgewicht*.
- **Mathematische Beschreibung:** → Charakterisierung der Wirkung durch Richtung, Betrag und Angriffspunkt. ⇒ Kraft: punktgebundener Vektor {A | F̲} [*Vektor F̲*, *Angriffspunkt «A»* with arrows to the two parts of {A|F̲}]. Einheit: N := Kgm/s² (Newton). → R-024
- • **Kontaktkräfte:** Wechselwirkung mit Berührung. • **Fernkräfte:** Wechselwirkung ohne Berührung. • **Kräftegruppe:** mehrere Kräfte am System [green: *äquivalente Darstellung*].
  {A_i | F̲_i}, i = 1, 2, 3… → {{A₁|F̲₁}, {A₂|F̲₂}, {A₃|F̲₃}, …}; [green: *speziell*] {A | F̲_i}, i = 1, 2, 3… → {A | R̲}, R̲ = Σ_i F̲_i.
- **Fig. 4.1: Kräfte als punktgebundene Vektoren:** a horizontal bar with five points A₁…A₅ on/at it and the forces F̲₁…F̲₅ drawn as grey arrows at them in different directions (F₁ up from A₁ at the left end, F₂ down-left onto A₂ from above, F₃ down onto A₃, F₄ down-left through A₄ (arrow tip below-left), F₅ up-right at A₅ at the right end).
- **Fig. 4.2: Kräfte mit gleichem Angriffspunkt:** (a) and (b): the same five forces F̲₁…F̲₅ at one point A, and the resultant R̲ (grey, between F̲₄ and F̲₅) — (a) with underlined letters, (b) without.

### p. 30 — Reaktionsprinzip
- **Das Reaktionsprinzip. POSTULAT:** Übt ein erster materieller Punkt A₁ auf einen zweiten A₂ die Kraft {A₂ | F̲} aus (*Actio*), so wirkt seinerseits der materielle Punkt A₂ auf A₁ mit der Gegenkraft {A₁ | −F̲} (*Reactio*).
- **ZUSATZPOSTULAT:** Bei Fernkräften liegen die Wirkungslinien von Kraft und Gegenkraft auf der Verbindungsgeraden durch A₁ und A₂.
- Figure left: two curved bodies A₁ (above, hatched) and A₂ (below, hatched) touching at one point. [*zur Zeit t₀: Kontaktkräfte: A₁(t₀) = A₂(t₀); Fernkräfte: A₁(t₀) ≠ A₂(t₀)*]. Figure right: the same two bodies slightly apart, {A₂ | F̲} with F̲₂ = F̲ drawn down onto A₂ and F̲₁ = −F̲ drawn up onto A₁, {A₁ | −F̲}; the two forces circled in red. Lower right: two circles A₁ (small, left) and A₂ (large, right) with a dashed red line through both centres, force arrows ±F̲ on the line [blue crosses at the centres].
- • Es existiert keine Kraft ohne Reaktion. • Innere und äussere Kräfte ↔ Systemabgrenzung.
- Innere Kraft: Angriffspunkt der Reaktion *auch* im System. Äussere Kraft: Angriffspunkt der Reaktion *ausserhalb* vom System.

### p. 31 — Innere/äussere Kräfte am Beispiel; Systemabgrenzung; Fig. 4.8
- Three drawings (top → bottom): (1) **Träger auf zwei Stützen mit Lastkörper:** Lastkörper (block, weight G̲ at its centre, pull Z̲ to the right at its right end, normal forces N̲₁, N̲₂ at its two feet, friction R̲₁, R̲₂ pointing left) lies on the Träger (long beam); under the beam the reactions −N̲₁, −N̲₂ (down), −R̲₁, −R̲₂ (to the right); Stützen at A (left) and B (right) [label «Stütze»]: F̲_A (up-left) and F̲_B at the beam, −F̲_A (down-right) and −F̲_B at the supports (all grey). (2) Lastkörper alone with G̲, Z̲, N̲₁, N̲₂, R̲₁, R̲₂. (3) Lastkörper + Träger with G̲, Z̲, N̲₁, N̲₂, R̲₁, R̲₂, −R̲₁, −R̲₂, −N̲₁, −N̲₂, F̲_A, F̲_B.
- Below (labels): [pink] **äussere Kräfte**, [black] **innere Kräfte**; then (4) Lastkörper alone with its forces in pink (all external), (5) Lastkörper + Träger with G̲, Z̲, F̲_A, F̲_B in pink (the contact forces N, R, −N, −R grey = inner).
- **Systemabgrenzung** System: Teilbereich des 3D Raumes, besteht i.A. aus mehreren Körpern. Abgrenzung: je nach Ziel der Analyse.
- **Fig. 4.8: verteilte Kräfte:** (a) Träger und Stütze: a single arrow on the beam on a support ⇒ the same with the force spread as hatched strip (contact area); (b) Kugel auf ebener Unterlage: arrow ⇒ arrow with hatched contact patch; (c) Ladungen: two circles (charges) with arrow ⇒ two hatched cylinders/volumes.

### p. 32 — verteilte Kräfte, Kraftdichte
- Kontaktkräfte → Flächenverteilt; Fernkräfte → Volumenverteilt } [red underlined] **Kraftdichte – verteilte Kräfte**.
- **Flächenkräfte → Flächenkraftdichte** [N/m²]: s̲ = lim_{ΔA→0} ΔF̲/ΔA. → Kraft am infinitesimalen Flächenelement: dF̲ = s̲ dA. Summe aller Kräfte: R̲ = ∫∫_A s̲ dA [typed as ∫ ∫_A, written «∫ ∫_A s̲ dA»]. Figure: a curved surface patch A with a small element dA and the force dF̲ on it.
- **Volumenkräfte → Raumkraftdichte** [N/m³]: F̲ = lim_{ΔV→0} ΔF̲/ΔV. → Kraft am infinitesimalen Volumenelement: dF̲ = F̲ dV. → R-025
- [handwritten] *das Gewicht:* a box with axes e̲_x, e̲_y, e̲_z (z up); **F̲ = −ρ·g·e̲_z** [brace over ρ·g: *γ*]; **dF̲ = dG̲ = −ρ·g·dV e̲_z**. *Summe der Kräfte:* **G̲ = −∭_V ρ g dV e̲_z = −ρ·g·V e̲_z** [*Falls homogen*, arrow to the second form].
- [handwritten, framed on the right] *Parenthèse:* ΔV → 0 ⇒ ΔM → 0; ΔV → 0 ⇒ ΔM/ΔV ≠ 0; lim_{ΔV→0} ΔM/ΔV = ρ.
- **Linienkräfte → Linienkraftdichte** [N/m]: q̲ = lim_{Δx→0} ΔF̲/Δx; dF̲ = q̲ dx → R̲ = ∫ q̲(x) dx. Figure: beam on two supports with a row of equal arrows above it (a constant line load); below: an x-axis from 0 to L with a small element dx and the arrow dF̲; R̲ = ∫₀^L q̲(x) dx.

### p. 33 — 5 Leistung
- «5 Leistung» [handwritten bubble: *„charakterisiert die Wirkung einer Kraft“*]. {A | F̲}: **P = F̲ · v̲_A**, [N m/s] = [W]. P = |F̲||v̲_A| cos α [angle α between F̲ and v̲_A in a small sketch].
- [handwritten classification, with small F/v sketches] **Antriebskraft** α < π/2: P = ++ (F ∥ v), P = + (F oblique forward). **Widerstandskraft** α > π/2: P = − , P = −−. **Leistungslos** α = π/2: P = 0.
- **Figur 5.2: Kraft ohne Leistung.** Left «Normalkraft»: a ball (circle) on a curved surface; N̲ at the contact point M₁ (on the ball), −N̲ at M₂ (on the surface), velocities v̲₁ (of M₁, tangent) and v̲₂ (of M₂, tangent). Right «Lorentzkraft»: charge +q with B̲ (up), v̲ (up-right), F̲ (down-right), right angles marked.
- **Leistung einer Einzelkraft F̲ bei Rotation:** [*F in P*] {P | F̲}, P ∉ μ: v̲_P = ω̲ × OP̲; **boxed:** P = (ω̲ × OP̲)·F̲ = ω̲·(OP̲ × F̲) [underbraces: v̲_P and M̲_O]. Side figure: a circular body K rotating about the axis μ (vertical line) with centre O on the axis, a point P and the force F̲ (blue), ω̲ (red) along the axis.
- «Leistung von F̲ bei Starrkörperrotation» [figure: grey body, axis μ with ω̲ (blue) upward, O′ on the axis above, O at the bottom, P with F̲ (red); e̲_z axes]: P = F̲·v̲_P = F̲·(ω̲×OP̲) = ω̲·(OP̲×F̲) = ω̲·M̲_O; P = ω̲·M̲_O = ω̲·M̲_O′; P = ω̲·M̲_O = ω̲·e̲_z·M̲_O = ω·M_z.

### p. 34 — Moment; mehrere Kräfte am System
- M̲_O: «Moment der Kraft {P | F̲} bez. O». M̲_O = OP̲ × F̲ = F̲ × PO̲. P = F̲·v̲_P = M̲_O·ω̲. O′ ∈ μ: M̲_O′ = O′P̲ × F̲; O′P̲ = O′O̲ + OP̲.
  M̲_O′·ω̲ = ω̲·[(O′O̲ + OP̲) × F̲] = ω̲·(O′O̲ × F̲) [underbrace: 0] + ω̲·(OP̲ × F̲) [underbrace: ω̲·M̲_O]; P = M̲_O·ω̲ = M̲_O′·ω̲.
  **Merke:** M̲_O = OP̲ × F̲ ≠ M̲_O′ = O′P̲ × F̲. μ ≡ z: P = M̲_z·ω̲ = M̲_z′·ω̲, Projektion von M̲ in z-Richtung. [handwritten: P = ω·e̲_z·M̲_O = ω·e̲_z·M̲_O′ with underbraces M_z, M_z′]; M_z′ = M̲_O′·e̲_z; M_z = M̲_O·e̲_z; M_z = M_z′; (OP̲×F̲)·e̲_z =? ((O′O̲+OP̲)×F̲)·e̲_z = (O′O̲×F̲)·e̲_z [underbrace 0] + (OP̲×F̲)·e̲_z [M_O, M_O′ underbraces].
- **Mehrere Kräfte am System:** Leistung einer Kräftegruppe: P(F̲₁, …, F̲_n) = P(F̲₁) + P(F̲₂) + … + P(F̲_n). {A | F̲_i} → P = F̲₁·v̲_A + … + F̲_n·v̲_A = (Σ_{i=1}^n F̲_i)·v̲_A = R̲·v̲_A [brace under the sum: R̲]. {A_i | F̲_i} → P = F̲₁·v̲₁ + F̲₂·v̲₂ + … + F̲_n·v̲_n.
- System: starre Körper ⇒ Einfacher! **Boxed: P = R̲·v̲_B + M̲_B·ω̲** [handwritten arrows: *Resultierende der Kräftegruppe*; *Moment der Kräftegruppe bezüglich B*].
- Leistung berechnen: • starrer Körper K, • Kinemate in B: {v̲_B, ω̲}, • Kräftegruppe {A_i, F̲_i} → P = R̲·v̲_B + M̲_B·ω̲; R̲ = Σ_{i=1}^n F̲_i: Resultierende der Kräftegruppe; M̲_B = Σ_{i=1}^n (BA̲_i × F̲_i): Moment der Kräftegruppe bez. B.

### p. 35 — Moment; Beweis; Beispiel Leiter (Figur 5.6)
- Figures: F̲ (red) at A with O: **M̲_O = OA̲ × F̲** (M̲_O blue ⟂ the plane of OA̲ and F̲, angle φ between F̲ and OA̲); **M̲_O = OA̲ × F̲ = F̲ × AO̲** (angle π − φ between F̲ and AO̲); three pictures of the right-hand rule: parallelepiped (C = A × B), hand, screw.
- **Beispiel: 2 Kräfte in B.** Rigid body with B, v̲_B (green), ω̲ (green), forces F̲₁ at A₁, F̲₂ at A₂ [red]. *in B bekannt: v̲_B, ω̲*. v̲₁ = v̲_B + ω̲ × BA̲₁; v̲₂ = v̲_B + ω̲ × BA̲₂. P = F̲₁·v̲₁ + F̲₂·v̲₂ = F̲₁·v̲_B + F̲₁·(ω̲ × BA̲₁) + F̲₂·v̲_B + F̲₂·(ω̲ × BA̲₂) [red: *a̲·(b̲×c̲) = b̲·(c̲×a̲)*] = (F̲₁ + F̲₂)·v̲_B + ω̲·(BA̲₁ × F̲₁) + ω̲·(BA̲₂ × F̲₂) [underbraces: R̲; M̲_B₁, M̲_B₂] = R̲·v̲_B + ω̲·M̲_B q.e.d.
- **Figur 5.6 (Leiter):** a ladder A–B (length L, B at the top right, 45° at A, midpoint C, «L/2» twice); |F̲_B| =: G (down at B), |F̲_C| =: W at C (red arrow from below right *to* C, perpendicular to the ladder, a right-angle mark at C); axes e̲_x (right), e̲_y (up), e̲_z (out of the page); v̲ (blue arrow at A to the right), ω̲ (⊙ at A). *Geg.:* v̲_A = (v, 0, 0)ᵀ, ω̲ = (0, 0, ω)ᵀ. *Ges.:* Gesamtleistung. → R-026
  **Methode I** (circled): M̲_AG = AB̲ × G̲ = (0, 0, −GL√2/2)ᵀ; M̲_AW = AC̲ × W̲ = (0, 0, W·L/2)ᵀ; P = R̲·v̲_A + ω̲·M̲_A = (−(√2/2)W, (√2/2)W − G, 0)·(v, 0, 0) + (0, 0, ω)·(0, 0, −GL√2/2 + W·L/2) = −(√2/2)Wv + ωW L/2 − ωGL√2/2.
  **Methode II** (circled): v̲_C = v̲_A + ω̲ × AC̲ = (v, 0, 0) + (0,0,ω)×(L√2/4, L√2/4, 0) = (v − ωL√2/4, ωL√2/4, 0); v̲_B = v̲_A + ω̲ × AB̲ = (v − ωL√2/2, ωL√2/2, 0); P = Σ_{i=1}^{2} F̲_i·v̲_i = (−(√2/2)W, (√2/2)W, 0)·v̲_C [in C] + (0, −G, 0)·v̲_B [in B] = −(√2/2)Wv + W (L/2) ω − Gω L (√2/2).

### p. 36 — Figur 5.6 graphisch
- **III** *in B:* G (red, down), velocity components of B in blue (v to the right, (√2/2)ωL up and left) → **P_B = −G (√2/2) ω L**. *in C:* velocity components of C (ωL/2 along the ladder-perpendicular direction, (√2/2)v …) with W (red) → **P_C = +W ω L/2 − W (√2/2) v**.
- **IV** *in A:* R̲: components −(√2/2)W (to the left), (√2/2)W up, G down (red), v to the right (blue) → **R̲·v̲_A = −v (√2/2) W**. M̲_A: ⊙ ω (blue), ⊙ W L/2 (red), ⊗ (√2/2) G L (red) [*M̲_A = M̲_AW + M̲_AG*, *M̲_A bezüglich z Achse*] → **M̲_A·ω̲ = +W (L/2) ω − (√2/2) G L ω**.
