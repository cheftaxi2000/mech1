import type { ReactElement } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang } from '../../i18n';
import { add, scale, sub, type Vec3 } from '../../physics/vec';
import { OBLIQUE, TOP, centroid, ease, lerpView, outerSquares, project, seg, triangle, type P2, type View } from './geometry';

/**
 * Animated version of the derivation x = ρ cos φ, y = ρ sin φ (lecture p. 4, Fig. 1.8).
 * Steps (index → what moves), matching the numbered derivation text:
 *  0  M drops vertically onto M_xy (x, y unchanged); the camera rises to look down the z-axis.
 *  1  The right triangle O–F–M_xy builds up: hypotenuse ρ, perpendicular to the x-axis, angle φ.
 *  2  Legs become the signed coordinates x = ρ cos φ, y = ρ sin φ; φ sweeps once around all four quadrants.
 *  3  Squares on the sides: ρ² = x² + y²; then tan φ = y/x.
 *  4  Limiting cases φ = 0 → (ρ, 0) and φ = 90° → (0, ρ).
 */
export const RHO = 1.6;
export const PHI0 = (40 * Math.PI) / 180;
export const Z0 = 1.3;
const W = 400, H = 300;

interface Lbl { at: P2; tex: string; cls?: string; o?: number; anchor?: 'c' | 'tl' | 'tr' | 'l' | 'r'; rows?: { tex: string; cls: string }[] }

const pts = (ps: P2[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

function arrowHead(from: P2, to: P2, size = 7): string {
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L;
  return pts([to, [to[0] - size * ux + size * 0.45 * uy, to[1] - size * uy - size * 0.45 * ux], [to[0] - size * ux - size * 0.45 * uy, to[1] - size * uy + size * 0.45 * ux]]);
}

/** φ as a function of (step, t): constant except while sweeping (step 2) or visiting the limits (step 4). */
export function phiAt(step: number, t: number): number {
  if (step === 2) return PHI0 + 2 * Math.PI * ease(seg(t, 0.2, 0.95));
  if (step === 4) {
    if (t < 0.15) return PHI0 * (1 - ease(seg(t, 0, 0.15)));
    if (t < 0.45) return 0; // hold: (x, y) = (ρ, 0)
    if (t < 0.6) return (Math.PI / 2) * ease(seg(t, 0.45, 0.6));
    if (t < 0.9) return Math.PI / 2; // hold: (x, y) = (0, ρ)
    return Math.PI / 2 + (PHI0 - Math.PI / 2) * ease(seg(t, 0.9, 1));
  }
  return PHI0;
}

export function CylDerivationFigure({ step, t }: { step: number; t: number }) {
  const lang = useLang();
  const num = (v: number) => fmtNum(v, 2, lang, true);

  const camK = step === 0 ? ease(seg(t, 0.58, 1)) : 1;
  const view: View = lerpView(OBLIQUE, TOP, camK);
  const P = (p: Vec3) => project(p, view);

  const phi = phiAt(step, t);
  const tri = triangle(RHO, phi);
  const { O, F, Mxy, x, y } = tri;
  const M3: Vec3 = [Mxy[0], Mxy[1], Z0];

  const lines: ReactElement[] = [];
  const labels: Lbl[] = [];

  // ---- axes (z fades out as we look straight down it) ----
  const ext = { xp: 2.4 + 0.2 * camK, xn: 0.6 + 1.8 * camK, yp: 2.4 - 0.1 * camK, yn: 0.6 + 1.3 * camK };
  const axes: { a: Vec3; b: Vec3; name: string; o: number }[] = [
    { a: [-ext.xn, 0, 0], b: [ext.xp, 0, 0], name: 'x', o: 1 },
    { a: [0, -ext.yn, 0], b: [0, ext.yp, 0], name: 'y', o: 1 },
    { a: [0, 0, -0.5], b: [0, 0, 2.2], name: 'z', o: 1 - camK },
  ];
  for (const ax of axes) {
    if (ax.o < 0.02) continue;
    const a = P(ax.a), b = P(ax.b);
    lines.push(<g key={`ax-${ax.name}`} className="an-axis" opacity={ax.o}>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      <polygon points={arrowHead(a, b)} />
    </g>);
    const lb = P(scale(1.09, ax.b));
    labels.push({ at: [lb[0] + (ax.name === 'y' ? 4 : 0), lb[1]], tex: ax.name, cls: 'muted', o: ax.o });
  }
  { const o = P([0, 0, 0]); labels.push({ at: [o[0] - 12, o[1] + 12], tex: 'O', cls: 'muted' }); }

  // ---- step 0: drop M onto the xy-plane ----
  if (step === 0) {
    const k = ease(seg(t, 0.1, 0.5));
    const D = add(M3, scale(k, sub(Mxy, M3)));
    const pm = P(M3), pd = P(D), pxy = P(Mxy);
    const mO = 1 - camK;
    if (k > 0) lines.push(<line key="drop" className="an-drop" x1={pm[0]} y1={pm[1]} x2={pd[0]} y2={pd[1]} opacity={Math.max(mO, 0.0)} />);
    // floor shadow guide O → M_xy appears with the drop
    lines.push(<line key="oxy" className="an-guide" x1={P(O)[0]} y1={P(O)[1]} x2={pxy[0]} y2={pxy[1]} opacity={seg(t, 0.4, 0.55)} />);
    lines.push(<circle key="M" className="an-point" cx={pm[0]} cy={pm[1]} r={4.5} opacity={mO} />);
    labels.push({ at: [pm[0] + 12, pm[1] - 10], tex: 'M', cls: 'point', o: mO });
    if (k > 0 && k < 1) lines.push(<circle key="D" className="an-point ghost" cx={pd[0]} cy={pd[1]} r={3.5} />);
    const xyO = seg(t, 0.45, 0.55);
    lines.push(<circle key="Mxy" className="an-point" cx={pxy[0]} cy={pxy[1]} r={4} opacity={xyO} />);
    labels.push({ at: [pxy[0] + 16, pxy[1] + 12], tex: 'M_{xy}', cls: 'point', o: xyO });
  }

  // ---- steps ≥ 1: triangle in the top view ----
  if (step >= 1) {
    const pO = P(O), pF = P(F), pM = P(Mxy);
    const hypK = step === 1 ? ease(seg(t, 0, 0.35)) : 1;
    const perpK = step === 1 ? ease(seg(t, 0.3, 0.6)) : 1;
    const fillK = step === 1 ? seg(t, 0.55, 0.8) : 1;
    const arcK = step === 1 ? ease(seg(t, 0.6, 1)) : 1;
    const legK = step === 2 ? seg(t, 0, 0.15) : step > 2 ? 1 : 0;

    // squares (step 3) go underneath everything else
    if (step === 3) {
      const sq = outerSquares(tri, RHO, phi);
      const parts: [Vec3[], string, string, number][] = [
        [sq.sx, 'an-sq-x', 'x^2', seg(t, 0.08, 0.3)],
        [sq.sy, 'an-sq-y', 'y^2', seg(t, 0.22, 0.45)],
        [sq.sr, 'an-sq-r', String.raw`\rho^2`, seg(t, 0.42, 0.65)],
      ];
      for (const [poly, cls, tex, o] of parts) {
        lines.push(<polygon key={cls} className={cls} points={pts(poly.map(P))} opacity={o} />);
        labels.push({ at: P(centroid(poly)), tex, cls: cls.replace('an-sq-', ''), o });
      }
      const fk = seg(t, 0.7, 0.85), tk = seg(t, 0.85, 1);
      labels.push({ at: [10, 8], tex: String.raw`\rho^2 = x^2 + y^2`, anchor: 'tl', o: fk, cls: 'box' });
      labels.push({ at: [10, 44], tex: String.raw`\tan\varphi = \dfrac{y}{x}`, anchor: 'tl', o: tk, cls: 'box' });
    }

    // triangle fill + right-angle marker
    lines.push(<polygon key="tri" className="an-tri" points={pts([pO, pF, pM])} opacity={fillK} />);
    if (Math.abs(x) > 0.15 && Math.abs(y) > 0.15) {
      const s = 0.14, dO: Vec3 = [-Math.sign(x) * s, 0, 0], dM: Vec3 = [0, Math.sign(y) * s, 0];
      lines.push(<polyline key="ra" className="an-ra" points={pts([P(add(F, dO)), P(add(add(F, dO), dM)), P(add(F, dM))])} opacity={fillK} />);
    }
    // perpendicular from M_xy to the x-axis (becomes the y-leg)
    const pPerpEnd = P(add(Mxy, scale(perpK, sub(F, Mxy))));
    lines.push(<line key="perp" className={legK > 0 ? 'an-leg-y' : 'an-guide'} x1={pM[0]} y1={pM[1]} x2={pPerpEnd[0]} y2={pPerpEnd[1]} opacity={perpK > 0 ? 1 : 0} />);
    // adjacent leg on the x-axis (the x-leg), from step 2 on
    if (legK > 0) lines.push(<line key="legx" className="an-leg-x" x1={pO[0]} y1={pO[1]} x2={pF[0]} y2={pF[1]} opacity={legK} />);
    // hypotenuse ρ
    const pH = P(scale(hypK, Mxy));
    lines.push(<line key="hyp" className="an-hyp" x1={pO[0]} y1={pO[1]} x2={pH[0]} y2={pH[1]} />);
    // angle arc φ (any size, sampled)
    const phiN = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); // the angle the point actually shows
    const arcEnd = phiN * arcK, rA = 0.42, n = 40;
    if (Math.abs(arcEnd) > 0.01) {
      const arc = Array.from({ length: n + 1 }, (_, i) => P([rA * Math.cos((arcEnd * i) / n), rA * Math.sin((arcEnd * i) / n), 0]));
      lines.push(<polyline key="arc" className="an-arc" points={pts(arc)} />);
    }
    lines.push(<circle key="Mxy" className="an-point" cx={pM[0]} cy={pM[1]} r={4} />);

    // labels
    labels.push({ at: [pM[0] + (x >= 0 ? 16 : -16), pM[1] + (y >= 0 ? -12 : 12)], tex: 'M_{xy}', cls: 'point' });
    const showNums = step === 2 && t > 0.2;
    const half = arcEnd / 2, rl = 0.7;
    if (arcK > 0.05 && phiN > 0.15) labels.push({ at: P([rl * Math.cos(half), rl * Math.sin(half), 0]), tex: String.raw`\varphi`, cls: 'angle', o: arcK });
    // ρ on the side of the hypotenuse facing away from F
    const mid = scale(0.5, Mxy);
    let nrm: Vec3 = [-Math.sin(phi), Math.cos(phi), 0];
    if ((F[0] - mid[0]) * nrm[0] + (F[1] - mid[1]) * nrm[1] > 0) nrm = scale(-1, nrm);
    if (hypK > 0.9) labels.push({ at: P(add(mid, scale(0.24, nrm))), tex: String.raw`\rho`, cls: 'hyp' });
    if (legK > 0) {
      const sweeping = step === 2 && t > 0.15 && t < 0.97;
      const below = y >= 0 ? -1 : 1;
      const xo = (step === 3 ? 1 - seg(t, 0, 0.1) : legK) * seg(Math.abs(x), 0.2, 0.35);
      const yo = (step === 3 ? 1 - seg(t, 0.1, 0.2) : legK) * seg(Math.abs(y), 0.2, 0.35);
      labels.push({ at: P([x / 2, below * 0.32, 0]), tex: sweeping ? 'x' : String.raw`x = \rho\cos\varphi`, cls: 'x', o: xo });
      const side = x >= 0 ? 1 : -1;
      labels.push({ at: P([x + side * 0.12, y / 2, 0]), tex: sweeping ? 'y' : String.raw`y = \rho\sin\varphi`, cls: 'y', anchor: side > 0 ? 'l' : 'r', o: yo });
    }
    if (showNums) {
      labels.push({ at: [W - 10, 8], tex: '', anchor: 'tr', cls: 'box', rows: [
        { tex: String.raw`\varphi = ${((phiN * 180) / Math.PI).toFixed(0)}^\circ`, cls: 'angle' },
        { tex: String.raw`x = ${num(x)}`, cls: 'x' },
        { tex: String.raw`y = ${num(y)}`, cls: 'y' },
      ] });
    }
    if (step === 4) {
      if (t >= 0.15 && t < 0.45) labels.push({ at: [10, 8], tex: String.raw`\varphi = 0:\ (x,\,y) = (\rho,\,0)`, anchor: 'tl', cls: 'box' });
      if (t >= 0.6 && t < 0.9) labels.push({ at: [10, 8], tex: String.raw`\varphi = 90^\circ:\ (x,\,y) = (0,\,\rho)`, anchor: 'tl', cls: 'box' });
    }
  }

  return (
    <div className="anim-fig" data-phi={phi.toFixed(4)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">{lines}</svg>
      {labels.filter((l) => (l.o ?? 1) > 0.02).map((l, i) => (
        <div key={i} className={`anim-label ${l.cls ?? ''} ${l.anchor ?? ''}`}
          style={{ left: `${(l.at[0] / W) * 100}%`, top: `${(l.at[1] / H) * 100}%`, opacity: l.o ?? 1 }}>
          {l.rows ? l.rows.map((r, k) => <div key={k} className={`row ${r.cls}`}><M>{r.tex}</M></div>) : <M>{l.tex}</M>}
        </div>
      ))}
    </div>
  );
}
