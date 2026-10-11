/**
 * Pure scene of the animated derivation of the spherical coordinates (lecture p. 4, Fig. 1.12):
 *   z = r cos θ, ρ = r sin θ  ⇒  x = r sin θ cos ψ, y = r sin θ sin ψ;  x² + y² + z² = r²;  tan θ = ρ/z.
 *
 * Steps (index → caption number), each final frame showing what its caption says:
 *  0 → 1  Lecture view (Fig. 1.12): M and r; the vertical half-plane through the z-axis and M; the right
 *         triangle O–M_z–M with hypotenuse r and angle θ at O.
 *  1 → 2  Camera turns to face that plane. Legs z = r cos θ (along z) and ρ = r sin θ (⟂ z-axis).
 *         θ swings past 90°: z becomes negative while ρ stays ≥ 0; a ghost at θ = 140° remains.
 *  2 → 3  The ρ-leg drops into the xy-plane (it is exactly O–M_xy); camera looks down the z-axis;
 *         the cylindrical triangle gives x = ρ cos ψ, y = ρ sin ψ, i.e. x = r sin θ cos ψ, y = r sin θ sin ψ.
 *  3 → 4  Pythagoras twice: floor triangle ρ² = x² + y², vertical triangle r² = ρ² + z² ⇒ x² + y² + z² = r².
 *  4 → 5  Back in the vertical plane: tan θ = ρ/z = √(x² + y²)/z.
 * Colours: x blue, y amber, z green, ρ teal, r dark, angles purple (scene.ts).
 */
import { type Vec3, add, scale, sub } from '../../physics/vec';
import { eRho } from '../../physics/coords';
import { fmtNum, type Lang } from '../../i18n';
import { OBLIQUE, ease, lerpView, project, seg, type P2, type View } from './geometry';
import { DEG, H, W, arrowHead, sceneBuilder, type Anchor, type Ink, type Scene, type SceneLabel } from './scene';

export const R_S = 1.9;
export const TH0 = 50 * DEG;
export const PS0 = 40 * DEG;
export const TH_GHOST = 140 * DEG;

/** Facing the vertical plane through the z-axis at azimuth ψ: e_ρ(ψ) points right, z up (10° from above). */
export const FACE: View = { alpha: PS0 - Math.PI / 2, beta: 10 * DEG, cx: 150, cy: 158, s: 62 };
/** Looking down the z-axis (x right, y up), shifted left to leave room for the leg labels. */
export const TOP_S: View = { alpha: -Math.PI / 2, beta: Math.PI / 2, cx: 172, cy: 172, s: 62 };

/** θ as a function of (step, t): constant except for the swing past 90° in step index 1 (whole degrees). */
export function thetaAt(step: number, t: number): number {
  if (step !== 1) return TH0;
  const up = ease(seg(t, 0.4, 0.62)), down = ease(seg(t, 0.72, 0.92));
  const raw = TH0 + (TH_GHOST - TH0) * (up - down);
  return Math.round(raw / DEG) * DEG;
}

/** Point of the vertical half-plane at azimuth ψ: s along e_ρ(ψ), height h. */
const inPlane = (s: number, h: number, psi = PS0): Vec3 => add(scale(s, eRho(psi)), [0, 0, h]);

export function sphScene(step: number, t: number, lang: Lang): Scene {
  const num = (v: number, d = 2) => fmtNum(v, d, lang, true);
  const sb = sceneBuilder();
  const L = (key: string, at: P2, tex: string, ink: Ink, o = 1, anchor: Anchor = 'c', extra: Partial<SceneLabel> = {}) =>
    sb.label(key, at, tex, ink, o, anchor, extra);
  const S = sb.shape;

  // ---- camera per step ----
  let view: View;
  if (step === 0) view = OBLIQUE;
  else if (step === 1) view = lerpView(OBLIQUE, FACE, ease(seg(t, 0, 0.25)));
  else if (step === 2) {
    const k1 = ease(seg(t, 0, 0.2)), k2 = ease(seg(t, 0.45, 0.65));
    view = k2 > 0 ? lerpView(OBLIQUE, TOP_S, k2) : lerpView(FACE, OBLIQUE, k1);
  } else if (step === 3) view = lerpView(TOP_S, OBLIQUE, ease(seg(t, 0, 0.25)));
  else view = lerpView(OBLIQUE, FACE, ease(seg(t, 0, 0.3)));
  const P = (p: Vec3) => project(p, view);
  const faceK = step === 1 ? ease(seg(t, 0, 0.25)) : step === 2 ? 1 - ease(seg(t, 0, 0.2)) : step === 4 ? ease(seg(t, 0, 0.3)) : 0;
  const topK = step === 2 ? ease(seg(t, 0.45, 0.65)) : step === 3 ? 1 - ease(seg(t, 0, 0.25)) : 0;

  const theta = thetaAt(step, t);
  const rho = R_S * Math.sin(theta), z = R_S * Math.cos(theta);
  const x = rho * Math.cos(PS0), y = rho * Math.sin(PS0);
  const O: Vec3 = [0, 0, 0], M: Vec3 = [x, y, z], Mz: Vec3 = [0, 0, z], Mxy: Vec3 = [x, y, 0], Mx: Vec3 = [x, 0, 0];

  // ---- axes (x, y fade while we face the vertical plane; z fades in the top view) ----
  const axes: { a: Vec3; b: Vec3; name: string; o: number }[] = [
    { a: [-0.4, 0, 0], b: [2.3, 0, 0], name: 'x', o: 1 - faceK }, // facing the plane, x and y would only clutter it
    { a: [0, -0.4, 0], b: [0, 2.2, 0], name: 'y', o: 1 - faceK },
    { a: [0, 0, -(0.45 + 1.5 * faceK)], b: [0, 0, 2.15], name: 'z', o: 1 - topK },
  ];
  for (const ax of axes) {
    if (ax.o < 0.02) continue;
    const a = P(ax.a), b = P(ax.b);
    S({ key: `ax-${ax.name}`, kind: 'line', cls: 'an-axis', pts: [a, b], o: ax.o });
    S({ key: `ah-${ax.name}`, kind: 'polygon', cls: 'an-axis-head', pts: arrowHead(a, b), o: ax.o });
    const lo = ax.name === 'z' ? ax.o : ax.o * (1 - faceK); // x/y labels hidden while facing the plane
    L(`lab-${ax.name}`, P(scale(1.1, ax.b)), ax.name, 'muted', lo);
  }
  { const o = P(O); L('lab-O', topK > 0.5 ? [o[0] - 12, o[1] - 12] : faceK > 0.5 ? [o[0] - 13, o[1] + 10] : [o[0] - 10, o[1] - 14], 'O', 'muted'); } // clear of the axes and leg labels

  // trace of the vertical plane in the xy-plane (orientation aid while facing the plane)
  if (faceK > 0.02 && step !== 3) S({ key: 'trace', kind: 'line', cls: 'an-guide', pts: [P(inPlane(-0.4, 0)), P(inPlane(2.25, 0))], o: faceK });

  const pO = P(O), pM = P(M), pMz = P(Mz);
  const showVertical = step === 0 || step === 1 || step === 4 || (step === 2 && t < 0.45);

  // ---- the vertical half-plane through the z-axis and M ----
  if (step <= 1 || step === 4 || (step === 2 && t < 0.3)) {
    const planeK = step === 0 ? seg(t, 0.2, 0.45) : step === 2 ? 1 - seg(t, 0.15, 0.3) : 1;
    S({ key: 'plane', kind: 'polygon', cls: 'an-plane', pts: [inPlane(0, -1.75), inPlane(2.15, -1.75), inPlane(2.15, 2.0), inPlane(0, 2.0)].map(P), o: planeK });
  }

  // ---- vertical triangle O–M_z–M (steps 0, 1, 4; leaves during step 2) ----
  if (showVertical) {
    const rK = step === 0 ? ease(seg(t, 0, 0.22)) : 1;
    const perpK = step === 0 ? ease(seg(t, 0.45, 0.65)) : 1;
    const fillK = step === 0 ? seg(t, 0.6, 0.8) : 1;
    const arcK = step === 0 ? ease(seg(t, 0.7, 1)) : 1;
    const legK = step === 1 ? seg(t, 0.25, 0.35) : step >= 2 ? 1 : 0;
    const fadeOut = step === 2 ? 1 - seg(t, 0.25, 0.45) : 1;
    const sweeping = step === 1 && t > 0.38 && t < 0.94;

    S({ key: 'vtri', kind: 'polygon', cls: 'an-tri', pts: [pO, pMz, pM], o: fillK * fadeOut });
    if (Math.abs(z) > 0.15 && rho > 0.15) {
      const s = 0.14, dO = scale(-Math.sign(z) * s, [0, 0, 1] as Vec3), dM = scale(s, eRho(PS0));
      S({ key: 'vra', kind: 'polyline', cls: 'an-ra', pts: [P(add(Mz, dO)), P(add(add(Mz, dO), dM)), P(add(Mz, dM))], o: fillK * fadeOut });
    }
    // legs: z along the axis (green), ρ perpendicular to it (teal); before step 2 the perpendicular is a dashed guide
    if (legK > 0) S({ key: 'leg-z', kind: 'line', cls: 'an-leg-z', pts: [pO, pMz], o: legK * fadeOut });
    if (step !== 2) S({ key: 'perp', kind: 'line', cls: legK > 0 ? 'an-leg-rho' : 'an-guide', pts: [pM, P(add(M, scale(perpK, sub(Mz, M))))], o: perpK > 0 ? 1 : 0 });
    S({ key: 'r', kind: 'line', cls: 'an-r', pts: [pO, P(scale(rK, M))], o: fadeOut });
    // θ arc from +z to OM
    const arcEnd = theta * arcK;
    if (arcEnd > 0.01) {
      const n = 40;
      S({ key: 'arc-th', kind: 'polyline', cls: 'an-arc', pts: Array.from({ length: n + 1 }, (_, i) => P(inPlane(0.5 * Math.sin((arcEnd * i) / n), 0.5 * Math.cos((arcEnd * i) / n)))), o: fadeOut });
      L('lab-theta', P(inPlane(0.8 * Math.sin(arcEnd / 2), 0.8 * Math.cos(arcEnd / 2))), String.raw`\theta`, 'angle', arcK * fadeOut);
    }
    if (perpK > 0.9 && Math.abs(z) > 0.1) {
      S({ key: 'Mz', kind: 'circle', cls: 'an-foot', pts: [pMz], r: 3, o: fadeOut });
      L('lab-Mz', [pMz[0] - 10, pMz[1]], 'M_z', 'muted', fadeOut, 'r');
    }
    // r on the side of OM facing away from M_z
    if (rK > 0.9) {
      const mid = scale(0.5, M);
      const away = sub(mid, add(Mz, scale(0.5, sub(M, Mz)))); // from the middle of the ρ-leg towards OM's middle …
      const dir = scale(0.3 / (Math.hypot(...(away as [number, number, number])) || 1), away);
      L('lab-r', P(add(mid, dir)), 'r', 'r', fadeOut);
    }
    if (legK > 0) {
      const zo = legK * fadeOut * seg(Math.abs(z), 0.2, 0.35);
      L('lab-legz', [pMz[0] + (pO[0] - pMz[0]) / 2 - 10, (pO[1] + pMz[1]) / 2], sweeping ? 'z' : String.raw`z = r\cos\theta`, 'z', zo, 'r');
      const above = z >= 0 ? -1 : 1;
      const pr = P(add(Mz, scale(0.5, sub(M, Mz))));
      L('lab-legrho', [pr[0], pr[1] + above * 15], sweeping ? String.raw`\rho` : String.raw`\rho = r\sin\theta`, 'rho', legK * fadeOut * seg(rho, 0.2, 0.35));
    }
    if (step === 1 && t > 0.38) {
      const deg = Math.round(theta / DEG);
      L('box-readout', [W - 6, 6], '', 'fg', 1, 'tr', { box: true, rows: [
        { tex: String.raw`r = ${num(R_S, 1)}`, ink: 'r' },
        { tex: String.raw`\theta = ${deg}^\circ`, ink: 'angle' },
        { tex: String.raw`z = ${num(R_S * Math.cos(deg * DEG))}`, ink: 'z' },
        { tex: String.raw`\rho = ${num(R_S * Math.sin(deg * DEG))}`, ink: 'rho' },
      ] });
    }
    // ghost of θ = 140° (z < 0, ρ > 0) left behind by the swing
    if (step === 1 && t >= 0.62) {
      const gM = inPlane(R_S * Math.sin(TH_GHOST), R_S * Math.cos(TH_GHOST)), gMz: Vec3 = [0, 0, R_S * Math.cos(TH_GHOST)];
      const o = 0.55;
      S({ key: 'g-tri', kind: 'polygon', cls: 'an-tri', pts: [pO, P(gMz), P(gM)], o: o * 0.8 });
      S({ key: 'g-z', kind: 'line', cls: 'an-leg-z thin', pts: [pO, P(gMz)], o });
      S({ key: 'g-rho', kind: 'line', cls: 'an-leg-rho thin', pts: [P(gMz), P(gM)], o });
      S({ key: 'g-r', kind: 'line', cls: 'an-r thin', pts: [pO, P(gM)], o });
      S({ key: 'g-M', kind: 'circle', cls: 'an-point', pts: [P(gM)], r: 3, o });
      const pg = P(gM);
      L('lab-ghost', [pg[0] + 12, pg[1] + 4], String.raw`\theta > 90^\circ\colon\ z < 0`, 'fg', 0.95, 'l');
    }
    if (step === 4) L('box-tan', [W - 6, H - 62], String.raw`\tan\theta = \dfrac{\rho}{z} = \dfrac{\sqrt{x^2+y^2}}{z}`, 'fg', seg(t, 0.35, 0.55), 'tr', { box: true });
  }
  if (step !== 3 && (step !== 2 || t < 0.45)) {
    const mo = step === 2 ? 1 - seg(t, 0.3, 0.45) : 1;
    S({ key: 'M', kind: 'circle', cls: 'an-point', pts: [pM], r: 4.5, o: mo });
    L('lab-M', [pM[0] + 14, pM[1] - 10], 'M', 'point', mo);
  }

  // ---- step 2: the ρ-leg drops into the xy-plane, then the cylindrical triangle in the top view ----
  if (step === 2) {
    const drop = ease(seg(t, 0.2, 0.45));
    const a = add(Mz, [0, 0, -z * drop]), b = add(M, [0, 0, -z * drop]); // M_z → O, M → M_xy
    S({ key: 'drop-guide', kind: 'line', cls: 'an-drop', pts: [pM, P(b)], o: seg(t, 0.2, 0.3) * (1 - topK) });
    S({ key: 'rho-seg', kind: 'line', cls: 'an-leg-rho', pts: [P(a), P(b)] });
    const pB = P(b);
    S({ key: 'Mxy', kind: 'circle', cls: 'an-point', pts: [pB], r: 4, o: seg(t, 0.4, 0.45) });
    L('lab-Mxy', [pB[0] + 18, pB[1] - 10], 'M_{xy}', 'point', seg(t, 0.4, 0.45));
    const triK = seg(t, 0.62, 0.8);
    const subK = seg(t, 0.85, 0.95);
    if (triK > 0) {
      const pO2 = P(O), pMx = P(Mx);
      S({ key: 'ftri', kind: 'polygon', cls: 'an-tri', pts: [pO2, pMx, pB], o: triK });
      S({ key: 'leg-x', kind: 'line', cls: 'an-leg-x', pts: [pO2, pMx], o: triK });
      S({ key: 'leg-y', kind: 'line', cls: 'an-leg-y', pts: [pMx, pB], o: triK });
      const n = 32;
      S({ key: 'arc-psi', kind: 'polyline', cls: 'an-arc', pts: Array.from({ length: n + 1 }, (_, i) => P([0.42 * Math.cos((PS0 * i) / n), 0.42 * Math.sin((PS0 * i) / n), 0])), o: triK });
      L('lab-psi', P([0.72 * Math.cos(PS0 / 2), 0.72 * Math.sin(PS0 / 2), 0]), String.raw`\psi`, 'angle', triK);
      L('lab-Mx', P([x + 0.28, -0.2, 0]), 'M_x', 'muted', triK);
      const xl = subK > 0.5 ? String.raw`x = r\sin\theta\cos\psi` : String.raw`x = \rho\cos\psi`;
      const yl = subK > 0.5 ? String.raw`y = r\sin\theta\sin\psi` : String.raw`y = \rho\sin\psi`;
      L('lab-legx', P([x / 2, -0.52, 0]), xl, 'x', triK); // below M_x's label
      L('lab-legy', P([x + 0.12, y / 2, 0]), yl, 'y', triK, 'l');
      L('lab-rho-top', P(add(scale(0.5, Mxy), scale(0.24, [-Math.sin(PS0), Math.cos(PS0), 0]))), String.raw`\rho`, 'rho', triK);
      L('box-subst', [8, 8], String.raw`\rho = r\sin\theta,\quad \varphi = \psi`, 'fg', subK, 'tl', { box: true });
    }
  }

  // ---- step 3: Pythagoras twice in the lecture view ----
  if (step === 3) {
    const pO3 = P(O), pMx = P(Mx), pMxy = P(Mxy), pM3 = P(M);
    const boxK = seg(t, 0.15, 0.35);
    // dashed edges of the box with sides x, y, z (M is its far corner)
    const c = (i: number, j: number, k: number): Vec3 => [i * x, j * y, k * z];
    const edges: [Vec3, Vec3][] = [
      [c(0, 1, 0), c(1, 1, 0)], [c(0, 0, 1), c(1, 0, 1)], [c(0, 1, 1), c(1, 1, 1)],
      [c(0, 1, 0), c(0, 1, 1)], [c(1, 0, 0), c(1, 0, 1)], [c(0, 0, 1), c(0, 1, 1)], [c(1, 0, 1), c(1, 1, 1)],
    ];
    edges.forEach(([a, b], i) => S({ key: `edge-${i}`, kind: 'line', cls: 'an-guide', pts: [P(a), P(b)], o: boxK * 0.8 }));
    const floorK = seg(t, 0.3, 0.5), vertK = seg(t, 0.55, 0.75);
    S({ key: 'ftri', kind: 'polygon', cls: 'an-tri', pts: [pO3, pMx, pMxy], o: floorK });
    S({ key: 'leg-x', kind: 'line', cls: 'an-leg-x', pts: [pO3, pMx] });
    S({ key: 'leg-y', kind: 'line', cls: 'an-leg-y', pts: [pMx, pMxy] });
    S({ key: 'rho-seg', kind: 'line', cls: 'an-leg-rho', pts: [pO3, pMxy] });
    S({ key: 'vtri3', kind: 'polygon', cls: 'an-tri', pts: [pO3, pMxy, pM3], o: vertK });
    S({ key: 'leg-z3', kind: 'line', cls: 'an-leg-z', pts: [pMxy, pM3], o: vertK });
    S({ key: 'r3', kind: 'line', cls: 'an-r', pts: [pO3, pM3], o: vertK });
    S({ key: 'Mxy', kind: 'circle', cls: 'an-point', pts: [pMxy], r: 4 });
    S({ key: 'M3', kind: 'circle', cls: 'an-point', pts: [pM3], r: 4.5, o: vertK });
    L('lab-Mxy', [pMxy[0] + 22, pMxy[1] + 8], 'M_{xy}', 'point');
    L('lab-M3', [pM3[0] + 14, pM3[1] - 10], 'M', 'point', vertK);
    L('lab-x3', P([x / 2, -0.22, 0]), 'x', 'x');
    L('lab-y3', P([x + 0.2, y / 2, 0]), 'y', 'y');
    L('lab-rho3', P(add(scale(0.5, Mxy), [-0.18, 0.18, 0])), String.raw`\rho`, 'rho');
    L('lab-z3', P(add(Mxy, [0.15, 0, z / 2])), 'z', 'z', vertK);
    L('lab-r3', P(add(scale(0.5, M), [-0.1, -0.1, 0.15])), 'r', 'r', vertK);
    L('box-floor', [8, 8], String.raw`\rho^2 = x^2 + y^2`, 'fg', floorK, 'tl', { box: true });
    L('box-vert', [8, 44], String.raw`r^2 = \rho^2 + z^2`, 'fg', vertK, 'tl', { box: true });
    L('box-sum', [8, 80], String.raw`x^2 + y^2 + z^2 = r^2`, 'fg', seg(t, 0.8, 0.95), 'tl', { box: true });
  }

  return sb.finish({ theta, rho, z });
}

/** Keep H in the public surface for tests that check the frame bounds. */
export { W, H };
