/**
 * Pure scene of the Reaktionsprinzip (p. 30, figure right): A₁ (above) pushes A₂ (below).
 * SVG coordinates (y down). The two arrows are drawn in the gap between the bodies, as in the lecture: F̲ ends at A₂,
 * −F̲ ends at A₁ (the arrow belongs to the body where it ENDS, i.e. where the force acts).
 *
 *  step 0  Actio: A₁ acts on A₂ with {A₂ | F̲} — the arrow ends at A₂
 *  step 1  Reactio: A₂ acts on A₁ with {A₁ | −F̲} — the arrow ends at A₁, same length, opposite direction
 *  step 2  two separate pictures: on A₂ acts only F̲ (from this pair), on A₁ only −F̲ — they never meet in one picture
 *  step 3  back together, named: Actio and Reactio (equal size, opposite direction, two different bodies)
 */
import type { Lang } from '../../i18n';
import { ease, seg, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';

const FORCE = 'force' as Ink;
const LEN = 84; // arrow length in the joint picture

/** Upper body A₁: flat top, curved bottom (lowest point at x = 200). */
const bottomY = (x: number) => 100 - 38 * ((x - 200) / 95) ** 2;
/** Lower body A₂: curved top (highest point at x = 200), flat bottom. */
const topY = (x: number) => 200 + 38 * ((x - 200) / 95) ** 2;
const XA2 = 168, XA1 = 234; // where the arrows meet the bodies
export const A2: P2 = [XA2, topY(XA2)];
export const A1: P2 = [XA1, bottomY(XA1)];

const up = (): P2[] => { const o: P2[] = [[105, 20], [295, 20]]; for (let x = 295; x >= 105; x -= 10) o.push([x, bottomY(x)]); return o; };
const low = (): P2[] => { const o: P2[] = []; for (let x = 105; x <= 295; x += 10) o.push([x, topY(x)]); o.push([295, 280], [105, 280]); return o; };
/** Short hatch lines on the far side of a body (the lecture hatches the outer boundary). */
const hatchUp = (): P2[][] => Array.from({ length: 11 }, (_, i) => { const x = 112 + i * 17; return [[x, 20], [x + 9, 8]] as P2[]; });
const hatchLow = (): P2[][] => Array.from({ length: 11 }, (_, i) => { const x = 112 + i * 17; return [[x, 280], [x - 9, 292]] as P2[]; });

/** Affine map fixing nothing in particular: p ↦ ref' + s·(p − ref). */
const map = (p: P2, ref: P2, ref2: P2, s: number): P2 => [ref2[0] + s * (p[0] - ref[0]), ref2[1] + s * (p[1] - ref[1])];

export function reactionScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => sb.shape({ key, kind, cls, pts, o, r });
  const lerp = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const arrow = (key: string, a: P2, b: P2, o = 1) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) return;
    S(key, 'line', 'kf-f', [a, b], o); S(key + '-h', 'polygon', 'kf-f-head', arrowHead(a, b, 10), o);
  };

  // how far the two pictures are apart (0 = joint, 1 = split); step 2 splits, step 3 joins again
  const split = step === 2 ? ease(seg(t, 0, 0.7)) : step === 3 ? 1 - ease(seg(t, 0, 0.6)) : 0;
  const SPLIT_S = 0.7;
  const A2f: P2 = [100, 192], A1f: P2 = [300, 108]; // where A₂ and A₁ end up in the two pictures
  const s2 = 1 + (SPLIT_S - 1) * split, s1 = s2;
  const a2 = lerp(A2, A2f, split), a1 = lerp(A1, A1f, split);
  const m2 = (p: P2) => map(p, A2, a2, s2), m1 = (p: P2) => map(p, A1, a1, s1);

  // bodies
  S('body1', 'polygon', 'kf-body', up().map(m1));
  S('body2', 'polygon', 'kf-body', low().map(m2));
  hatchUp().forEach((h, i) => S(`h1-${i}`, 'line', 'kf-hatch', h.map(m1)));
  hatchLow().forEach((h, i) => S(`h2-${i}`, 'line', 'kf-hatch', h.map(m2)));
  sb.label('lab-body1', m1([200, 50]), 'A_1', 'muted', 1, 'c');
  sb.label('lab-body2', m2([200, 246]), 'A_2', 'muted', 1, 'c');

  // divider between the two pictures (step 2 and, fading, step 3)
  if (split > 0.02) S('divider', 'line', 'kf-guide', [[200, 14], [200, 286]], split);

  // Actio: F̲ ends at A₂ (arrow comes from above)
  const actioK = step === 0 ? ease(seg(t, 0.1, 0.7)) : 1;
  const tail2 = (p: P2): P2 => [p[0], p[1] - LEN * s2];
  const headA2 = a2, tailA2 = tail2(a2);
  if (step >= 0) arrow('actio', tailA2, lerp(tailA2, headA2, actioK), 1);
  // Reactio: −F̲ ends at A₁ (arrow comes from below)
  const reactK = step === 1 ? ease(seg(t, 0.1, 0.7)) : step > 1 ? 1 : 0;
  const tailA1: P2 = [a1[0], a1[1] + LEN * s1];
  if (reactK > 0.01) arrow('reactio', tailA1, lerp(tailA1, a1, reactK), 1);

  // the points of application
  if (actioK > 0.99) S('pt2', 'circle', 'kf-pt solid', [a2], 1, 5);
  if (reactK > 0.99) S('pt1', 'circle', 'kf-pt solid', [a1], 1, 5);

  // labels
  const lblO2 = step === 0 ? seg(t, 0.7, 1) : 1;
  sb.label('lab-actio', [a2[0] - 14, (tailA2[1] + a2[1]) / 2 - 6], String.raw`\{A_2\,|\,\v F\}`, FORCE, lblO2, 'r');
  const lblO1 = step === 1 ? seg(t, 0.7, 1) : step > 1 ? 1 : 0;
  sb.label('lab-reactio', [a1[0] + 14, (tailA1[1] + a1[1]) / 2 + 6], String.raw`\{A_1\,|\,-\v F\}`, FORCE, lblO1, 'l');

  // step 2: which pictures
  const pic = step === 2 ? seg(t, 0.7, 1) : step === 3 ? 1 - seg(t, 0, 0.4) : 0;
  sb.label('pic2', [100, 24], String.raw`\text{${lang === 'de' ? 'wirkt auf' : 'acts on'}}\ A_2`, 'muted', pic, 'c', { box: false });
  sb.label('pic1', [300, 24], String.raw`\text{${lang === 'de' ? 'wirkt auf' : 'acts on'}}\ A_1`, 'muted', pic, 'c', { box: false });

  // step 3: names and the three properties
  const names = step === 3 ? seg(t, 0.55, 1) : 0;
  sb.label('tag-actio', [a2[0] - 14, (tailA2[1] + a2[1]) / 2 + 14], String.raw`\text{Actio}`, FORCE, names, 'r');
  sb.label('tag-reactio', [a1[0] + 14, (tailA1[1] + a1[1]) / 2 - 14], String.raw`\text{Reactio}`, FORCE, names, 'l');

  return sb.finish({ step, split, actio: actioK, reactio: reactK });
}
