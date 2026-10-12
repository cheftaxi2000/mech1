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
