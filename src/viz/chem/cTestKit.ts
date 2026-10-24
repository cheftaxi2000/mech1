/** Shared checks for the pure chemistry scenes (used by *.test.ts only). */
import { expect } from 'vitest';
import type { Lang } from '../../i18n';
import { labelBox, labelOverlap, type CScene } from './cscene';

const LANGS: Lang[] = ['de', 'en'];
const TS = Array.from({ length: 21 }, (_, i) => i / 20);

/** Every shape point and every label box of every frame lies inside the figure. */
export function expectInside(build: (s: number, t: number, l: Lang) => CScene, steps: number) {
  for (const lang of LANGS) for (let s = 0; s < steps; s++) for (const t of TS) {
    const sc = build(s, t, lang);
    for (const sh of sc.shapes) {
      const pts = sh.kind === 'rect' ? [sh.pts[0], [sh.pts[0][0] + sh.pts[1][0], sh.pts[0][1] + sh.pts[1][1]] as const] : sh.pts;
      for (const p of pts) {
        expect(p[0], `${sh.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(-0.5); expect(p[0], `${sh.key} step ${s} t ${t}`).toBeLessThanOrEqual(sc.w + 0.5);
        expect(p[1], `${sh.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(-0.5); expect(p[1], `${sh.key} step ${s} t ${t}`).toBeLessThanOrEqual(sc.h + 0.5);
      }
    }
    for (const l of sc.labels) {
      const b = labelBox(l);
      expect(b.x0, `${l.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(b.x1, `${l.key} step ${s} t ${t}`).toBeLessThanOrEqual(sc.w);
      expect(b.y0, `${l.key} step ${s} t ${t}`).toBeGreaterThanOrEqual(0); expect(b.y1, `${l.key} step ${s} t ${t}`).toBeLessThanOrEqual(sc.h);
    }
  }
}

/** In every step's final frame no two visible labels overlap. */
export function expectNoOverlap(build: (s: number, t: number, l: Lang) => CScene, steps: number, max = 0.2) {
  for (const lang of LANGS) for (let s = 0; s < steps; s++) {
    const ls = build(s, 1, lang).labels.filter((l) => l.o > 0.5);
    for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
      expect(labelOverlap(ls[i], ls[j]), `${lang} step ${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(max);
  }
}

export const lab = (s: CScene, k: string) => s.labels.find((l) => l.key === k);
export const shape = (s: CScene, k: string) => s.shapes.find((x) => x.key === k);
