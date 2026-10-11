/**
 * Pure scene description of the animated derivation x = ρ cos φ, y = ρ sin φ (lecture p. 4, Fig. 1.8).
 * cylScene(step, t, lang) returns what to draw (shapes in SVG coordinates) and where the KaTeX labels go;
 * CylDerivationFigure only renders it. Being pure, every frame can be unit-tested (cylScene.test.ts).
 *
 * Steps (index → caption number):
 *  0 → 1  M drops vertically onto M_xy in the lecture's oblique view (x, y unchanged).
 *  1 → 2  The camera rises to look down the z-axis; the right triangle O–M_x–M_xy appears (ρ, φ).
 *  2 → 3  Legs become the signed coordinates x = ρ cos φ, y = ρ sin φ; φ sweeps once around and leaves
 *         a ghost triangle in quadrants II, III, IV.
 *  3 → 4  Squares on the three sides: ρ² = x² + y²; then tan φ = y/x.
 *  4 → 5  Limiting cases φ = 0 → (ρ, 0) and φ = π/2 → (0, ρ); the step ends showing both.
 * Every step's final frame (t = 1) shows what its caption says (it is the resting / reduced-motion frame).
 */
import { type Vec3, add, scale, sub } from '../../physics/vec';
import { fmtNum, type Lang } from '../../i18n';
import { OBLIQUE, TOP, centroid, ease, lerpView, outerSquares, project, seg, triangle, type P2, type View } from './geometry';
import { DEG, H, TAU, W, arrowHead, sceneBuilder, wrap as wrapAngle, type Anchor, type Ink, type Scene, type SceneLabel } from './scene';
export type { Scene, SceneLabel } from './scene';

export { W, H, labelBox } from './scene';
export const RHO = 1.6;
export const PHI0 = (40 * Math.PI) / 180;
export const Z0 = 1.3;
export const wrap = wrapAngle;

/** φ as a function of (step, t). In the sweep, φ moves in whole degrees so drawing and readout agree. */
export function phiAt(step: number, t: number): number {
  if (step === 2) {
    const raw = PHI0 + TAU * ease(seg(t, 0.15, 0.92));
    return Math.round(raw / DEG) * DEG;
  }
  if (step === 4) {
    if (t < 0.15) return PHI0 * (1 - ease(seg(t, 0, 0.15)));
    if (t < 0.45) return 0; // limiting case φ = 0
    if (t < 0.6) return (Math.PI / 2) * ease(seg(t, 0.45, 0.6));
    return Math.PI / 2; // limiting case φ = π/2, held to the end of the step
  }
  return PHI0;
}

/** Ghost triangles left behind by the sweep, one per quadrant II–IV. */
export const GHOSTS = [1, 2, 3].map((k) => PHI0 + (k * Math.PI) / 2);
export const SIGNS = [String.raw`x<0,\ y>0`, String.raw`x<0,\ y<0`, String.raw`x>0,\ y<0`];

// ---------------------------------------------------------------- the scene
export function cylScene(step: number, t: number, lang: Lang): Scene {
  const num = (v: number) => fmtNum(v, 2, lang, true);
  const sb = sceneBuilder();
  const L = (key: string, at: P2, tex: string, ink: Ink, o = 1, anchor: Anchor = 'c', extra: Partial<SceneLabel> = {}) =>
    sb.label(key, at, tex, ink, o, anchor, extra);
  const shapes = sb.shapes;

  // camera: oblique in step 0, moves to the top view at the start of step 1
  const camK = step === 0 ? 0 : step === 1 ? ease(seg(t, 0, 0.3)) : 1;
  const view: View = lerpView(OBLIQUE, TOP, camK);
  const P = (p: Vec3) => project(p, view);

  const phi = phiAt(step, t);
  const phiN = wrap(phi);
  const tri = triangle(RHO, phi);
  const { O, F, Mxy, x, y } = tri;
  const M3: Vec3 = [Mxy[0], Mxy[1], Z0];

  // ---- axes ----
  // in the 3D view the y-axis runs past M's vertical (as in Fig. 1.8) instead of ending on it
  const ext = { xp: 2.3 + 0.35 * camK, xn: 0.5 + 1.9 * camK, yp: 2.9 - 0.8 * camK, yn: 0.5 + 1.5 * camK };
  const axes: { a: Vec3; b: Vec3; name: string; o: number }[] = [
    { a: [-ext.xn, 0, 0], b: [ext.xp, 0, 0], name: 'x', o: 1 },
    { a: [0, -ext.yn, 0], b: [0, ext.yp, 0], name: 'y', o: 1 },
    { a: [0, 0, -0.45], b: [0, 0, 2.0], name: 'z', o: 1 - camK },
  ];
  for (const ax of axes) {
    if (ax.o < 0.02) continue;
    const a = P(ax.a), b = P(ax.b);
    shapes.push({ key: `ax-${ax.name}`, kind: 'line', cls: 'an-axis', pts: [a, b], o: ax.o });
    shapes.push({ key: `ah-${ax.name}`, kind: 'polygon', cls: 'an-axis-head', pts: arrowHead(a, b), o: ax.o });
    const lb = P(scale(1.1, ax.b));
    L(`lab-${ax.name}`, lb, ax.name, 'muted', ax.o);
  }
  // O sits in the quadrant diagonally opposite M_xy, away from the arc and the legs
  {
    const o = P(O);
    let at: P2;
    if (camK < 0.5) at = [o[0] - 10, o[1] - 14]; // 3D view: above-left, clear of the negative x- and y-axes
    else if (step === 2) at = [o[0] + 14 * Math.cos(155 * DEG), o[1] - 14 * Math.sin(155 * DEG)]; // sweep: between the QII ghost and the axis
    else at = [o[0] - (Math.sign(x) || 1) * 13, o[1] + (Math.sign(y) || 1) * 13]; // opposite M_xy
    L('lab-O', at, 'O', 'muted');
  }

  // ---- 3D part: M, the vertical drop, M_xy (step 0; fades during the camera move in step 1) ----
  if (step <= 1) {
    const dropK = step === 0 ? ease(seg(t, 0.15, 0.6)) : 1;
    const fade = 1 - camK; // M and the drop disappear as we look straight down
    const D = add(M3, scale(dropK, sub(Mxy, M3)));
    const pm = P(M3), pd = P(D), pxy = P(Mxy);
    if (dropK > 0) shapes.push({ key: 'drop', kind: 'line', cls: 'an-drop', pts: [pm, pd], o: fade });
    shapes.push({ key: 'oxy', kind: 'line', cls: 'an-guide', pts: [P(O), pxy], o: (step === 0 ? seg(t, 0.55, 0.7) : 1) * (step === 1 ? 1 - seg(t, 0.3, 0.45) : 1) });
    shapes.push({ key: 'M', kind: 'circle', cls: 'an-point', pts: [pm], r: 4.5, o: fade });
    L('lab-M', [pm[0] + 13, pm[1] - 10], 'M', 'point', fade);
    if (dropK > 0 && dropK < 1) shapes.push({ key: 'D', kind: 'circle', cls: 'an-point ghost', pts: [pd], r: 3.5 });
    const xyO = step === 0 ? seg(t, 0.55, 0.65) : 1;
    if (step === 0) {
      shapes.push({ key: 'Mxy0', kind: 'circle', cls: 'an-point', pts: [pxy], r: 4, o: xyO });
      L('lab-Mxy0', [pxy[0] + 20, pxy[1] + 10], 'M_{xy}', 'point', xyO);
    }
  }

  // ---- top view: triangle and everything built on it (steps 1–4) ----
  if (step >= 1) {
    const s1 = (a: number, b: number) => (step === 1 ? seg(t, a, b) : 1);
    const hypK = step === 1 ? ease(seg(t, 0.35, 0.55)) : 1;
    const perpK = step === 1 ? ease(seg(t, 0.5, 0.7)) : 1;
    const fillK = s1(0.65, 0.85);
    const footK = s1(0.65, 0.75);
    const arcK = step === 1 ? ease(seg(t, 0.7, 1)) : 1;
    const legK = step === 2 ? seg(t, 0, 0.12) : step > 2 ? 1 : 0;
    const sweeping = step === 2 && t > 0.12 && t < 0.93;
    const pO = P(O), pF = P(F), pM = P(Mxy);

    // step 3 (index 3): squares underneath everything
    if (step === 3) {
      const sq = outerSquares(tri, RHO, phi);
      const parts: [Vec3[], string, string, Ink, number][] = [
        [sq.sx, 'an-sq-x', 'x^2', 'x', seg(t, 0.08, 0.3)],
        [sq.sy, 'an-sq-y', 'y^2', 'y', seg(t, 0.22, 0.45)],
        [sq.sr, 'an-sq-rho', String.raw`\rho^2`, 'rho', seg(t, 0.42, 0.65)],
      ];
      for (const [poly, cls, tex, ink, o] of parts) {
        shapes.push({ key: cls, kind: 'polygon', cls, pts: poly.map(P), o });
        L(`lab-${cls}`, P(avoidAxes(centroid(poly))), tex, ink, o);
      }
      L('box-pyth', [8, 8], String.raw`\rho^2 = x^2 + y^2`, 'fg', seg(t, 0.7, 0.85), 'tl', { box: true });
      L('box-tan', [8, 46], String.raw`\tan\varphi = \dfrac{y}{x}`, 'fg', seg(t, 0.85, 1), 'tl', { box: true });
    }

    // step 2: path of M_xy (dashed circle traced so far) and the ghost triangles it leaves behind
    if (step === 2) {
      const swept = phi - PHI0;
      if (swept > 0.01) {
        const n = Math.max(2, Math.ceil(swept / (4 * DEG)));
        shapes.push({ key: 'path', kind: 'polyline', cls: 'an-path', pts: Array.from({ length: n + 1 }, (_, i) => P([RHO * Math.cos(PHI0 + (swept * i) / n), RHO * Math.sin(PHI0 + (swept * i) / n), 0])) });
      }
      GHOSTS.forEach((g, k) => {
        if (phi < g - 1e-9) return;
        const gt = triangle(RHO, g);
        const o = 0.45;
        shapes.push({ key: `g-tri-${k}`, kind: 'polygon', cls: 'an-tri', pts: [P(gt.O), P(gt.F), P(gt.Mxy)], o: o * 0.8 });
        shapes.push({ key: `g-x-${k}`, kind: 'line', cls: 'an-leg-x thin', pts: [P(gt.O), P(gt.F)], o });
        shapes.push({ key: `g-y-${k}`, kind: 'line', cls: 'an-leg-y thin', pts: [P(gt.F), P(gt.Mxy)], o });
        shapes.push({ key: `g-h-${k}`, kind: 'line', cls: 'an-rho thin', pts: [P(gt.O), P(gt.Mxy)], o });
        shapes.push({ key: `g-p-${k}`, kind: 'circle', cls: 'an-point', pts: [P(gt.Mxy)], r: 3, o });
        // fades in once M_xy has moved on, so it never sits on the live M_xy label
        L(`lab-sign-${k}`, P(scale((RHO + 0.42) / RHO, gt.Mxy)), SIGNS[k], 'fg', 0.9 * seg(phi - g, 0.35, 0.6));
      });
    }

    // step 4: the first limiting case stays visible as a ghost after φ has moved on
    if (step === 4 && t >= 0.45) {
      const g = triangle(RHO, 0);
      shapes.push({ key: 'lim0-x', kind: 'line', cls: 'an-leg-x', pts: [P(g.O), P(g.F)], o: 0.45 });
      shapes.push({ key: 'lim0-p', kind: 'circle', cls: 'an-point', pts: [P(g.Mxy)], r: 3.5, o: 0.5 });
    }

    // triangle fill + right-angle marker at M_x
    shapes.push({ key: 'tri', kind: 'polygon', cls: 'an-tri', pts: [pO, pF, pM], o: fillK });
    if (Math.abs(x) > 0.15 && Math.abs(y) > 0.15) {
      const s = 0.14, dO: Vec3 = [-Math.sign(x) * s, 0, 0], dM: Vec3 = [0, Math.sign(y) * s, 0];
      shapes.push({ key: 'ra', kind: 'polyline', cls: 'an-ra', pts: [P(add(F, dO)), P(add(add(F, dO), dM)), P(add(F, dM))], o: fillK });
    }
    // hypotenuse ρ (drawn under the legs, so a coinciding leg keeps its colour in the limiting cases)
    shapes.push({ key: 'hyp', kind: 'line', cls: 'an-rho', pts: [pO, P(scale(hypK, Mxy))], o: hypK > 0 ? 1 : 0 });
    // perpendicular from M_xy to the x-axis → becomes the y-leg
    shapes.push({ key: 'perp', kind: 'line', cls: legK > 0 ? 'an-leg-y' : 'an-guide', pts: [pM, P(add(Mxy, scale(perpK, sub(F, Mxy))))], o: perpK > 0 ? 1 : 0 });
    if (legK > 0) shapes.push({ key: 'legx', kind: 'line', cls: 'an-leg-x', pts: [pO, pF], o: legK });
    // angle arc φ (the angle M_xy actually shows, 0 ≤ φ < 2π)
    const arcEnd = phiN * arcK, rA = 0.42;
    if (arcEnd > 0.01) {
      const n = 48;
      shapes.push({ key: 'arc', kind: 'polyline', cls: 'an-arc', pts: Array.from({ length: n + 1 }, (_, i) => P([rA * Math.cos((arcEnd * i) / n), rA * Math.sin((arcEnd * i) / n), 0])) });
    }
    // foot of the perpendicular = M_x (lecture notation, Fig. 1.4)
    if (Math.abs(x) > 0.2) {
      shapes.push({ key: 'Mx', kind: 'circle', cls: 'an-foot', pts: [pF], r: 3, o: footK });
      L('lab-Mx', P([x + Math.sign(x) * 0.3, -(Math.sign(y) || 1) * 0.2, 0]), 'M_x', 'muted', footK);
    }
    shapes.push({ key: 'Mxy', kind: 'circle', cls: 'an-point', pts: [pM], r: 4 });

    // labels
    L('lab-Mxy', [pM[0] + (x >= 0 ? 18 : -18), pM[1] + (y >= 0 ? -12 : 12)], 'M_{xy}', 'point');
    if (arcK > 0.05 && phiN > 0.3) {
      let half = arcEnd / 2;
      for (let k = 0; k <= 4; k++) { const d = half - (k * Math.PI) / 2; if (Math.abs(d) < 0.25) half = (k * Math.PI) / 2 + Math.sign(d || 1) * 0.25; }
      L('lab-phi', P([0.8 * Math.cos(half), 0.8 * Math.sin(half), 0]), String.raw`\varphi`, 'angle', arcK);
    }
    // ρ on the side of the hypotenuse facing away from M_x
    // (hidden when the triangle degenerates: then the hypotenuse lies on a leg and the box says x = ρ or y = ρ)
    if (hypK > 0.9 && Math.abs(x) > 0.2 && Math.abs(y) > 0.2) {
      const mid = scale(0.5, Mxy);
      let nrm: Vec3 = [-Math.sin(phi), Math.cos(phi), 0];
      if ((F[0] - mid[0]) * nrm[0] + (F[1] - mid[1]) * nrm[1] > 0) nrm = scale(-1, nrm);
      L('lab-rho', P(add(mid, scale(step === 2 ? 0.42 : 0.24, nrm))), step === 2 ? String.raw`\rho = ${fmtNum(RHO, 1, lang, true)}` : String.raw`\rho`, 'rho');
    }
    if (legK > 0) {
      const [lo, hi] = sweeping ? [0.45, 0.6] : [0.2, 0.35]; // short legs: label hidden (it would sit on the arc / O)
      const xo = (step === 3 ? 1 - seg(t, 0, 0.1) : legK) * seg(Math.abs(x), lo, hi);
      const yo = (step === 3 ? 1 - seg(t, 0.1, 0.2) : legK) * seg(Math.abs(y), lo, hi);
      L('lab-legx', P([x / 2, -(Math.sign(y) || 1) * 0.36, 0]), sweeping ? 'x' : String.raw`x = \rho\cos\varphi`, 'x', xo);
      // right of the leg (left if x < 0); a leg lying on the y-axis gets its label on the side away from the φ arc
      const side = Math.abs(x) < 0.3 ? -(Math.sign(Math.cos(phiN / 2)) || 1) : x >= 0 ? 1 : -1;
      L('lab-legy', P([x + side * 0.12, y / 2, 0]), sweeping ? 'y' : String.raw`y = \rho\sin\varphi`, 'y', yo, side > 0 ? 'l' : 'r');
    }
    // live readout during the sweep: φ in whole degrees and x, y computed from that same φ
    if (step === 2 && t > 0.12) {
      const deg = Math.round(phiN / DEG) % 360;
      L('box-readout', [W - 6, 6], '', 'fg', 1, 'tr', { box: true, rows: [
        { tex: String.raw`\varphi = ${deg}^\circ`, ink: 'angle' },
        { tex: String.raw`x = ${num(RHO * Math.cos(deg * DEG))}`, ink: 'x' },
        { tex: String.raw`y = ${num(RHO * Math.sin(deg * DEG))}`, ink: 'y' },
      ] });
    }
    if (step === 4) {
      // bottom left: the quadrant that stays empty in both limiting cases
      L('box-lim0', [6, H - 88], String.raw`\varphi = 0\colon\ (x,y) = (\rho, 0)`, 'fg', seg(t, 0.15, 0.22), 'tl', { box: true });
      L('box-lim90', [6, H - 50], String.raw`\varphi = \pi/2\colon\ (x,y) = (0, \rho)`, 'fg', seg(t, 0.6, 0.67), 'tl', { box: true });
    }
  }

  return sb.finish({ phi: phiN });
}

/** Move a point that sits on (or next to) an axis a little off it, so the axis line does not cross its label. */
function avoidAxes(p: Vec3): Vec3 {
  let [px, py] = p;
  if (Math.abs(px) < 0.25) px = px < 0 ? px - 0.32 : -0.32;
  if (Math.abs(py) < 0.2) py = py < 0 ? py - 0.25 : -0.25;
  return [px, py, p[2]];
}
