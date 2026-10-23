import { useEffect, useState } from 'react';

/** True when the visitor asked for reduced motion: the figures then show one still frame. */
export function useReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)';
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(q).matches);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return;
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/* ---------- Mechanik: a point circling the z-axis, with its foot point and the drop line ---------- */
const O = { x: 142, y: 124 };
const L = 92; // axis length in px
// the lecture's orientation (Fig. 1.4): x down-right, y up-right, z up
const EX = { x: 0.46 * L, y: 0.52 * L }, EY = { x: 0.86 * L, y: -0.3 * L }, EZ = { x: 0, y: -L };
const RHO = 0.62, H = 0.52;
const proj = (phi: number, h: number) => ({
  x: O.x + RHO * (Math.cos(phi) * EX.x + Math.sin(phi) * EY.x) + h * EZ.x,
  y: O.y + RHO * (Math.cos(phi) * EX.y + Math.sin(phi) * EY.y) + h * EZ.y,
});
const N = 90;
const phis = Array.from({ length: N + 1 }, (_, i) => (i / N) * Math.PI * 2 + 0.5);
const f = (n: number) => n.toFixed(1);
const ring = (h: number) => phis.map((p, i) => `${i ? 'L' : 'M'}${f(proj(p, h).x)} ${f(proj(p, h).y)}`).join(' ') + 'Z';

export function MechFigure() {
  const still = useReducedMotion();
  const M = phis.map((p) => proj(p, H)), F = phis.map((p) => proj(p, 0));
  const vals = (a: { x: number; y: number }[], k: 'x' | 'y') => a.map((p) => f(p[k])).join(';');
  const anim = (attr: string, values: string) => still ? null
    : <animate attributeName={attr} values={values} dur="14s" repeatCount="indefinite" />;
  const m0 = M[0], f0 = F[0];
  const arrow = (x: number, y: number, dx: number, dy: number) => {
    const a = Math.atan2(dy, dx), s = 6;
    const p = (t: number) => `${f(x + dx - s * Math.cos(a + t))},${f(y + dy - s * Math.sin(a + t))}`;
    return <polygon className="fg-head" points={`${f(x + dx)},${f(y + dy)} ${p(0.4)} ${p(-0.4)}`} />;
  };
  return (
    <svg className="fig fig-mech" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <path className="fg-ring" d={ring(0)} />
      <path className="fg-ring fg-ring-up" d={ring(H)} />
      {[EZ, EX, EY].map((e, i) => (
        <g key={i}>
          <line className="fg-axis" style={{ ['--i' as string]: i }} pathLength={1} x1={O.x} y1={O.y} x2={f(O.x + e.x)} y2={f(O.y + e.y)} />
          {arrow(O.x, O.y, e.x, e.y)}
        </g>
      ))}
      <line className="fg-guide" x1={O.x} y1={O.y} x2={O.x} y2={O.y + EZ.y * H} />
      <line className="fg-rho" x1={O.x} y1={O.y} x2={f0.x} y2={f0.y}>{anim('x2', vals(F, 'x'))}{anim('y2', vals(F, 'y'))}</line>
      <line className="fg-drop" x1={f0.x} y1={f0.y} x2={m0.x} y2={m0.y}>
        {anim('x1', vals(F, 'x'))}{anim('y1', vals(F, 'y'))}{anim('x2', vals(M, 'x'))}{anim('y2', vals(M, 'y'))}
      </line>
      <circle className="fg-foot" r="3.2" cx={f0.x} cy={f0.y}>{anim('cx', vals(F, 'x'))}{anim('cy', vals(F, 'y'))}</circle>
      <circle className="fg-point" r="5.4" cx={m0.x} cy={m0.y}>{anim('cx', vals(M, 'x'))}{anim('cy', vals(M, 'y'))}</circle>
      <circle className="fg-origin" r="2.6" cx={O.x} cy={O.y} />
    </svg>
  );
}

/* ---------- Analysis: a sequence settling into an ε-strip around its limit ---------- */
const AX = 40, AY = 168, SX = 18.2, SY = 74; // origin and scale
const EPS = 0.3, LIM = 1;
const seq = Array.from({ length: 14 }, (_, i) => { const n = i + 1; return { n, v: LIM + (n % 2 ? -1 : 1) / n }; });

export function AnaFigure() {
  const yOf = (v: number) => AY - v * SY;
  return (
    <svg className="fig fig-ana" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <rect className="fg-band" x={AX} y={f(yOf(LIM + EPS))} width={292 - AX} height={f(2 * EPS * SY)} />
      <line className="fg-axis" style={{ ['--i' as string]: 0 }} pathLength={1} x1={AX} y1={AY} x2={AX} y2={20} />
      <line className="fg-axis" style={{ ['--i' as string]: 1 }} pathLength={1} x1={AX} y1={AY} x2={304} y2={AY} />
      <line className="fg-limit" style={{ ['--i' as string]: 2 }} pathLength={1} x1={AX} y1={f(yOf(LIM))} x2={292} y2={f(yOf(LIM))} />
      {seq.map((p) => {
        const out = Math.abs(p.v - LIM) > EPS;
        return <circle key={p.n} className={`fg-dot${out ? ' out' : ''}`} style={{ ['--d' as string]: `${0.9 + p.n * 0.2}s` }} r="4.2" cx={f(AX + p.n * SX)} cy={f(yOf(p.v))} />;
      })}
    </svg>
  );
}

/* ---------- Lineare Algebra: a matrix warps the grid; the basis arrows e₁, e₂ become the columns ---------- */
const LO = { x: 118, y: 112 }, LU = 46;
const LF = [[1.15, 0.6], [0.25, 0.8]]; // the matrix the figure breathes towards
const LN = 90;
const lm = (k: number) => { const s = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / LN); return [[1 + (LF[0][0] - 1) * s, LF[0][1] * s], [LF[1][0] * s, 1 + (LF[1][1] - 1) * s]]; };
const lp = (m: number[][], x: number, y: number) => ({ x: LO.x + LU * (m[0][0] * x + m[0][1] * y), y: LO.y - LU * (m[1][0] * x + m[1][1] * y) });
const lfmt = (pts: { x: number; y: number }[]) => pts.map((p) => `${f(p.x)},${f(p.y)}`).join(' ');

export function LaFigure() {
  const still = useReducedMotion();
  const frames = Array.from({ length: LN + 1 }, (_, k) => lm(k));
  const last = lm(Math.round(LN * 0.5)); // reduced motion: the transformed state
  const poly = (build: (m: number[][]) => { x: number; y: number }[]) => {
    const first = build(still ? last : frames[0]);
    return { points: lfmt(first), values: frames.map((m) => lfmt(build(m))).join(';') };
  };
  const an = (v: string) => still ? null : <animate attributeName="points" values={v} dur="14s" repeatCount="indefinite" />;
  const lines: { key: string; build: (m: number[][]) => { x: number; y: number }[]; axis?: boolean }[] = [];
  for (let i = -2; i <= 4; i++) {
    lines.push({ key: `v${i}`, build: (m) => [lp(m, i, -2), lp(m, i, 3)], axis: i === 0 });
  }
  for (let j = -2; j <= 3; j++) {
    lines.push({ key: `h${j}`, build: (m) => [lp(m, -2, j), lp(m, 4, j)], axis: j === 0 });
  }
  const sq = poly((m) => [lp(m, 0, 0), lp(m, 1, 0), lp(m, 1, 1), lp(m, 0, 1)]);
  const e1 = poly((m) => [lp(m, 0, 0), lp(m, 1, 0)]), e2 = poly((m) => [lp(m, 0, 0), lp(m, 0, 1)]);
  return (
    <svg className="fig fig-la" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <defs><clipPath id="la-clip"><rect x="8" y="6" width="304" height="188" rx="10" /></clipPath></defs>
      <g clipPath="url(#la-clip)">
        {lines.map((l, i) => { const p = poly(l.build); return <polyline key={l.key} className={`fg-grid${l.axis ? ' axis' : ''}`} style={{ ['--i' as string]: i % 7 }} points={p.points}>{an(p.values)}</polyline>; })}
        <polygon className="fg-square" points={sq.points}>{an(sq.values)}</polygon>
        <polyline className="fg-e1" points={e1.points}>{an(e1.values)}</polyline>
        <polyline className="fg-e2" points={e2.points}>{an(e2.values)}</polyline>
        <circle className="fg-origin" r="3" cx={LO.x} cy={LO.y} />
      </g>
    </svg>
  );
}
