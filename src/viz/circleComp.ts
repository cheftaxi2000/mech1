/**
 * Pure model of the «Kreisbewegung in Komponenten» figure (lesson Kreisbewegung, section 4):
 * r(t) = R (cos φ, sin φ), φ = φ̇ t, and v = ω × r = φ̇ R (−sin φ, cos φ). The components are the slopes of x(t), y(t).
 */
export interface CircleState { phi: number; x: number; y: number; vx: number; vy: number; speed: number }
export function circleState(R: number, w: number, t: number): CircleState {
  const phi = w * t;
  return { phi, x: R * Math.cos(phi), y: R * Math.sin(phi), vx: -w * R * Math.sin(phi), vy: w * R * Math.cos(phi), speed: Math.abs(w) * R };
}
/** Slope of the tangent to x(t) and y(t) at time t (= the velocity components). */
export const tangentSlopes = (R: number, w: number, t: number): [number, number] => { const s = circleState(R, w, t); return [s.vx, s.vy]; };
