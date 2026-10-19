import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SCENE_BG } from './primitives';
import { KATEX_MATH_FONT, useKatexFontReady } from './useKatexFont';
import type { Vec3 } from '../physics/vec';

/**
 * One piece of a 3D label: text in KaTeX's math italic, optionally underlined (the lecture's vector notation),
 * with a subscript and/or superscript. `up` = upright (for ×, =, digits and brackets).
 */
export interface LabelPart { t: string; u?: boolean; sub?: string; sup?: string; up?: boolean }

/** Rough width of a label in characters (tests use it to keep labels apart). */
export const partsWidth = (parts: LabelPart[]) => parts.reduce((s, p) => s + p.t.length + 0.65 * ((p.sub ?? '').length + (p.sup ?? '').length), 0);

const UPRIGHT = (px: number) => `400 ${px}px KaTeX_Main, "Times New Roman", serif`;

/**
 * Sprite label like primitives' <Label>, but made of several parts, so that v̲_B^⊥, ω̲ × B̲P̲ or v̲_ω can be written
 * as in the lecture (each vector underlined on its own, with sub- and superscripts). Constant on-screen size.
 */
export function RichLabel({ at, parts, color = '#0f172a', size = 0.068 }: { at: Vec3; parts: LabelPart[]; color?: string; size?: number }) {
  const fontReady = useKatexFontReady();
  const key = JSON.stringify(parts);
  const { texture, aspect, hScale } = useMemo(() => {
    const px = 72, small = Math.round(px * 0.7), halo = Math.round(px / 7);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const font = (p: LabelPart, s: number) => (p.up ? UPRIGHT(s) : KATEX_MATH_FONT(s));
    // layout pass
    const layout = parts.map((p) => {
      ctx.font = font(p, px); const w = ctx.measureText(p.t).width;
      ctx.font = KATEX_MATH_FONT(small);
      const ws = p.sub ? ctx.measureText(p.sub).width : 0, wp = p.sup ? ctx.measureText(p.sup).width : 0;
      return { p, w, ws, wp, adv: w + Math.max(ws, wp) + (p.sub || p.sup ? 4 : 0) };
    });
    const total = layout.reduce((s, l) => s + l.adv, 0);
    const top = p0(parts) ? px * 0.32 : 0; // room for superscripts
    canvas.width = Math.ceil(total + 20 + 2 * halo); canvas.height = Math.ceil(px * 1.45 + top + 2 * halo);
    ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const base = px + halo + top;
    const draw = (txt: string, f: string, x: number, y: number) => {
      ctx.font = f; ctx.strokeStyle = SCENE_BG; ctx.lineWidth = halo; ctx.strokeText(txt, x, y); ctx.fillStyle = color; ctx.fillText(txt, x, y);
    };
    let x = 10 + halo;
    for (const l of layout) {
      draw(l.p.t, font(l.p, px), x, base);
      if (l.p.u) {
        const y = base + px * 0.16, lw = px * 0.065;
        ctx.strokeStyle = SCENE_BG; ctx.lineWidth = lw + halo; ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + l.w, y); ctx.stroke();
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + l.w, y); ctx.stroke();
      }
      if (l.p.sub) draw(l.p.sub, KATEX_MATH_FONT(small), x + l.w + 2, base + px * 0.25);
      if (l.p.sup) draw(l.p.sup, UPRIGHT(small), x + l.w + 2, base - px * 0.45);
      x += l.adv;
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { texture, aspect: canvas.width / canvas.height, hScale: canvas.height / (px * 1.45) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, color, fontReady]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={at as [number, number, number]} scale={[size * aspect * hScale, size * hScale, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} sizeAttenuation={false} toneMapped={false} />
    </sprite>
  );
}
const p0 = (parts: LabelPart[]) => parts.some((p) => p.sup);
