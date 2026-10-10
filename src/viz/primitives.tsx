import { Line } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { KATEX_MATH_FONT, useKatexFontReady } from './useKatexFont';
import * as THREE from 'three';
import type { Vec3 } from '../physics/vec';

/** Scene colours shared by all 3D figures (kept in one place so diagrams stay consistent). */
/** Background of the 3D scenes (kept light in both themes, see styles.css --scene-bg). */
export const SCENE_BG = '#f6f7f9';

export const C = {
  axis: '#64748b',
  point: '#e11d48',
  construct: '#94a3b8',
  line1: '#2563eb',
  line2: '#16a34a',
  line3: '#d97706',
  angle: '#9333ea',
};

export function Arrow({ from = [0, 0, 0], to, color, width = 2 }: { from?: Vec3; to: Vec3; color: string; width?: number }) {
  const { headPos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    const len = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return { headPos: b.clone().sub(d.clone().normalize().multiplyScalar(0.06)), quat: q, len };
  }, [from, to]);
  if (len < 1e-6) return null;
  return (
    <group>
      <Line points={[from as [number, number, number], to as [number, number, number]]} color={color} lineWidth={width} />
      <mesh position={headPos} quaternion={quat}>
        <coneGeometry args={[0.035, 0.12, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Text label drawn into a sprite (constant on-screen size), in KaTeX's math italic so it matches the
 * formulas in the text (same φ, ρ, x glyphs). Used instead of drei <Html>, whose first instance per
 * scene failed to render with React 19 (docs/DECISIONS.md, D-004).
 * `sub` is drawn as a subscript, e.g. <Label sub="xy">M</Label>.
 */
export function Label({ at, children, sub, color = '#0f172a', size = 0.068 }: { at: Vec3; children: string; sub?: string; color?: string; size?: number }) {
  const fontReady = useKatexFontReady();
  const { texture, aspect } = useMemo(() => {
    const px = 72, font = KATEX_MATH_FONT(px), subFont = KATEX_MATH_FONT(Math.round(px * 0.7));
    const halo = Math.round(px / 7); // light outline so axis and curve lines do not cut through the glyphs
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font; const w1 = ctx.measureText(children).width;
    ctx.font = subFont; const w2 = sub ? ctx.measureText(sub).width + 4 : 0;
    canvas.width = Math.ceil(w1 + w2 + 20 + 2 * halo); canvas.height = Math.ceil(px * 1.45 + 2 * halo);
    ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round'; ctx.lineWidth = halo; ctx.strokeStyle = SCENE_BG; ctx.fillStyle = color;
    const draw = (txt: string, f: string, x: number, y: number) => { ctx.font = f; ctx.strokeText(txt, x, y); ctx.fillText(txt, x, y); };
    draw(children, font, 10 + halo, px + halo);
    if (sub) draw(sub, subFont, 10 + halo + w1 + 2, px * 1.25 + halo);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { texture, aspect: canvas.width / canvas.height };
  }, [children, sub, color, fontReady]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={at as [number, number, number]} scale={[size * aspect, size, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} sizeAttenuation={false} />
    </sprite>
  );
}

export function Axes({ size = 2.4 }: { size?: number }) {
  return (
    <group>
      {([[size, 0, 0], [0, size, 0], [0, 0, size]] as Vec3[]).map((t, i) => (
        <group key={i}>
          <Line points={[[-t[0] * 0.4, -t[1] * 0.4, -t[2] * 0.4], [0, 0, 0]]} color={C.axis} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />
          <Arrow to={t} color={C.axis} width={1.5} />
          <Label at={[t[0] * 1.07, t[1] * 1.07, t[2] * 1.07]} color={C.axis}>{'xyz'[i]}</Label>
        </group>
      ))}
      <Label at={[-0.16, -0.16, -0.14]} color={C.axis}>O</Label>
    </group>
  );
}

export function Dashed({ pts, color = C.construct }: { pts: Vec3[]; color?: string }) {
  return <Line points={pts as [number, number, number][]} color={color} lineWidth={1} dashed dashSize={0.05} gapSize={0.04} />;
}

/** Sampled parametric curve. */
export function Curve({ f, t0, t1, n = 96, color, width = 2.5 }: { f: (t: number) => Vec3; t0: number; t1: number; n?: number; color: string; width?: number }) {
  const pts = useMemo(() => Array.from({ length: n + 1 }, (_, i) => f(t0 + ((t1 - t0) * i) / n) as [number, number, number]), [f, t0, t1, n]);
  return <Line points={pts} color={color} lineWidth={width} />;
}

export function Dot({ at, color = C.point, r = 0.05 }: { at: Vec3; color?: string; r?: number }) {
  return (
    <mesh position={at as [number, number, number]}>
      <sphereGeometry args={[r, 20, 20]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
