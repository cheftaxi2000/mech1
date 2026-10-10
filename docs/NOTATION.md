# Notation & conventions (as used in the lecture — do not change)

| Symbol | Meaning | Source | Implementation |
|---|---|---|---|
| a̲ (underline) | vector | throughout | TeX macro `\v{a}` → `\underline{a}` |
| e̲_x, e̲_y, e̲_z | Cartesian orthonormal basis | p. 5 | `\e{x}` |
| e̲₁ × e̲₂ = e̲₃ | right-handed system (Rechtssystem) | p. 5 | `src/physics/vec.ts cross` |
| x'Ox | oriented axis through O | p. 3 | — |
| M_x, M_y, M_z, M_xy | projections of M on axes / xy-plane (M_x is also the foot of the perpendicular from M_xy onto the x-axis — used in the animated derivation) | p. 3, Fig 1.4 | label `<Label sub="xy">M</Label>` |
| F_x(t), F_ρ(t), … | the *function* describing a coordinate in time | pp. 3–4 | — |
| ρ, φ, z | cylindrical: distance from z-axis, azimuth from +x, height | p. 3 | `Cylindrical {rho, phi, z}` |
| r, θ, ψ | spherical: distance from O, **polar angle from +z**, **azimuth ψ** | p. 4 | `Spherical {r, theta, psi}` |
| e̲_ρ, e̲_φ, e̲_z | cylindrical basis, tangent to coordinate lines | p. 6 | `eRho, ePhi` |
| e̲_r, e̲_θ, e̲_ψ | spherical basis | p. 7 | `eR, eTheta, ePsi` |
| ṡ | Schnelligkeit (speed) = ds/dt | p. 8 | `speed` |
| τ̲ | tangential unit vector, v̲ = ṡ τ̲ | p. 8 | — |
| φ̇ | Winkelschnelligkeit (scalar, rad/s) | p. 11 | — |
| ω̲ = φ̇ e̲_z | Winkelgeschwindigkeit (vector) | p. 11 | — |
| μ | rotation axis | p. 15 | — |
| e̲_μ | unit vector along μ | p. 17 | — |
| SdpG | Satz der projizierten Geschwindigkeiten | p. 12 | `sdpgDefect` |
| AB (underlined) | vector from A to B (r̲_B − r̲_A) | p. 12ff | — |
| ω̲*, ω̲** | angular velocity w.r.t. reference point B, C | p. 22 | — |
| K | the rigid body (Körper) | p. 22 | — |
| v_H, v_V | horizontal / vertical speed (ladder) | p. 13 | — |
| n̲, t̲ | contact normal / tangent | p. 20 | — |

## Things to watch
- **Winkelschnelligkeit φ̇ (scalar) vs Winkelgeschwindigkeit ω̲ (vector)** — the lecture distinguishes them deliberately (p. 11). Same for *Schnelligkeit* ṡ vs *Geschwindigkeit* v̲.
- The lecture writes vector components as column vectors in a stated basis, e.g. r̲ : (R, 0, z₀) "in zylindrischer Basis". Always state the basis when writing columns.
- Ladder example: figure labels the floor angle φ, the handwritten solution calls it α (R-006). In the lesson use α and mention it.
- Unit conventions: none stated in the notes; use SI.
- Angle ranges (supplement, not in notes): ρ ≥ 0, 0 ≤ φ, ψ < 2π, 0 ≤ θ ≤ π.
