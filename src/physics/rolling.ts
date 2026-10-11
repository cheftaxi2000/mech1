/**
 * Rolling and sliding (lecture p. 20), plane motion. A wheel of radius R (centre C, velocity v_c along x)
 * turns with the spin Ω (clockwise positive, so Ω > 0 turns it "forward" to +x); it touches a belt (body Z₂)
 * that moves with the speed u along x (u = 0: ground at rest). x to the right, y up, positions relative to C.
 */
export type P2 = [number, number];

/** Velocity of the wheel point at p (relative to C): v = v_c e_x + ω × p with ω = −Ω e_z. */
export const wheelVelocity = (vc: number, Om: number, p: P2): P2 => [vc + Om * p[1], -Om * p[0]];

/** Tangential velocity of the wheel's contact point K = C − R e_y (its normal velocity is 0). */
export const contactVelocity = (vc: number, Om: number, R: number): number => vc - Om * R;

/** Slip: v_t(Z₁) − v_t(Z₂) at the contact. Rolling ⟺ slip = 0 (lecture: v_t(Z₁) = v_t(Z₂)). */
export const slip = (vc: number, Om: number, R: number, u: number): number => contactVelocity(vc, Om, R) - u;

/** The momentary centre of rotation (where v = 0), relative to C; null for a translation (Ω = 0). */
export const momentaryCentre = (vc: number, Om: number): P2 | null => (Om === 0 ? null : [0, -vc / Om]);

/** Position of a rim point (relative to the start of C) after time t; β0 = angle from the top, clockwise. */
export const rimPoint = (vc: number, Om: number, R: number, beta0: number, t: number): P2 => {
  const b = beta0 + Om * t;
  return [vc * t + R * Math.sin(b), R * Math.cos(b)];
};
