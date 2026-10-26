/**
 * Supplement to «Reaktionsprinzip» (p. 30): two people on roller skates, A₁ pushes A₂.
 * During the push (duration τ) A₂ receives {A₂ | F̲} and A₁ the counter-force {A₁ | −F̲}; afterwards both roll with constant velocity.
 * Not lecture content (dynamics comes later): m a = F per body is used only to show that equal and opposite forces
 * move the lighter body faster.
 */
export interface SkaterSpec { m1: number; m2: number; F: number; tau: number }
export interface SkaterState { x1: number; x2: number; v1: number; v2: number; pushing: boolean }

/** A₁ starts at x = −d/2 and A₂ at +d/2 (touching); A₂ is pushed to +x, A₁ to −x. */
export function skaterAt(s: SkaterSpec, d: number, t: number): SkaterState {
  const a1 = -s.F / s.m1, a2 = s.F / s.m2;
  const tp = Math.min(t, s.tau), tc = Math.max(0, t - s.tau);
  const v1 = a1 * tp, v2 = a2 * tp;
  return {
    x1: -d / 2 + 0.5 * a1 * tp * tp + v1 * tc,
    x2: d / 2 + 0.5 * a2 * tp * tp + v2 * tc,
    v1, v2, pushing: t < s.tau,
  };
}
