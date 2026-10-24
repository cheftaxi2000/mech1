/** Shared checks for the pure chemistry scenes (used by *.test.ts only). */
import { expect } from 'vitest';
import type { Lang } from '../../i18n';
import { H, W, boxOf, overlap, type CScene } from './scene';

const LANGS: Lang[] = ['de', 'en'];
const TS = Array.from({ length: 21 }, (_, i) => i / 20);
type Build = (s: number, t: number, l: Lang) => CScene;

/** Every shape point and every label box of every frame lies inside the figure. */
export function expectInside(build: Build, steps: number) {
  for (const lang of LANGS) for (let s = 0; s < steps; s++) for (const t of TS) {
    const sc = build(s, t, lang);
    for (const sh of sc.shapes) for (const p of sh.pts) {
      expect(p[0], `${sh.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(p[0], `${sh.key} step ${s} t ${t}`).toBeLessThanOrEqual(W);
      expect(p[1], `${sh.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(p[1], `${sh.key} step ${s} t ${t}`).toBeLessThanOrEqual(H);
    }
    for (const l of sc.labels) {
      const b = boxOf(l);
      expect(b.x0, `${l.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(b.x1, `${l.key} step ${s} t ${t}`).toBeLessThanOrEqual(W);
      expect(b.y0, `${l.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(b.y1, `${l.key} step ${s} t ${t}`).toBeLessThanOrEqual(H);
    }
  }
}

/** In every step's final frame no two visible labels overlap. */
export function expectNoOverlap(build: Build, steps: number, max = 0.2) {
  for (const lang of LANGS) for (let s = 0; s < steps; s++) {
    const ls = build(s, 1, lang).labels.filter((l) => l.o > 0.5);
    for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
      expect(overlap(ls[i], ls[j]), `step ${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(max);
  }
}
export const lab = (s: CScene, k: string) => s.labels.find((l) => l.key === k);
export const shape = (s: CScene, k: string) => s.shapes.find((x) => x.key === k);
