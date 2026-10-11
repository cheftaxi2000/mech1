/** Lesson "translation" (lecture pp. 13–14): example motions, pure functions. 2D, SVG-free (y up). */
export type P = [number, number];

/** Slider crank (supplement for "momentane Translation"): crank O–A (radius r) turns, rod A–B (length l), B slides on the x-axis. */
export const crankA = (th: number, r: number): P => [r * Math.cos(th), r * Math.sin(th)];
export const crankB = (th: number, r: number, l: number): P => [r * Math.cos(th) + Math.sqrt(l * l - (r * Math.sin(th)) ** 2), 0];
/** A point of the rod at fraction k from A to B. */
export const rodPoint = (th: number, r: number, l: number, k: number): P => {
  const A = crankA(th, r), B = crankB(th, r, l);
  return [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1])];
};
/** Velocity of a rod point for crank speed w (central difference in θ, then × θ̇). */
export const rodVelocity = (th: number, r: number, l: number, k: number, w: number): P => {
  const h = 1e-6, p = rodPoint(th + h, r, l, k), q = rodPoint(th - h, r, l, k);
  return [((p[0] - q[0]) / (2 * h)) * w, ((p[1] - q[1]) / (2 * h)) * w];
};
/** Angular velocity of the rod: β with sin β = r sin θ / l, β̇ = r cos θ θ̇ / (l cos β). */
export const rodOmega = (th: number, r: number, l: number, w: number) => {
  const sb = (r * Math.sin(th)) / l;
  return (r * Math.cos(th) * w) / (l * Math.sqrt(1 - sb * sb));
};
