import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from '../physics/vec';
import { C } from './primitives';
import { RichLabel, type LabelPart } from './RichLabel';

/**
 * Drawing helpers for the figures of lesson L13 (Kinemate, Zentralachse, Schraube): colour keys, an arrow that can
 * fade, and a renderer for the plain lists the pure frame functions return.
 * Colours: v red (velocities), v_ω blue (the part along ω — no blue x-axis is drawn in these figures), the part
 * perpendicular to ω orange, ω and ω × BP purple, ζ teal (an axis, like μ), construction lines dark / grey.
 */
export const SC_COL = {
  v: C.point,
  vw: C.x,
  perp: '#ea580c',
  rot: C.angle,
  omega: C.angle,
  zeta: C.rho,
  dark: C.r,
  muted: C.construct,
} as const;
export type ColKey = keyof typeof SC_COL;
type P3 = [number, number, number];

/** Arrow (line + cone head) like primitives' Arrow, with opacity. */
export function FadeArrow({ from, to, color, width = 2, o = 1 }: { from: Vec3; to: Vec3; color: string; width?: number; o?: number }) {
  const g = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const d = b.clone().sub(a), len = d.length();
    if (len < 1e-6) return null;
    const u = d.clone().normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), u);
    let r = 0.026 + 0.0125 * width, h = 3.1 * r;
    if (h > 0.45 * len) { const k = (0.45 * len) / h; r *= k; h *= k; }
    const base = b.clone().sub(u.clone().multiplyScalar(h * 0.92)).toArray() as P3;
    return { headPos: b.clone().sub(u.clone().multiplyScalar(h / 2)), quat, base, r, h };
  }, [from, to, width]);
  if (!g || o <= 0.01) return null;
  const fade = o < 0.999;
  return (
    <group>
      <Line points={[from as P3, g.base]} color={color} lineWidth={width} transparent={fade} opacity={o} />
      <mesh position={g.headPos} quaternion={g.quat}>
        <coneGeometry args={[g.r, g.h, 20]} />
        <meshBasicMaterial color={color} transparent={fade} opacity={o} />
      </mesh>
    </group>
  );
}

/**
 * Moves the camera when the frame asks for another view (the screw animation steps back for the motion step).
 * It only acts when the requested view changes, so a view the student turned by hand stays as long as the frame
 * keeps asking for the same one.
 */
export function CameraRig({ pos, target }: { pos: Vec3; target: Vec3 }) {
  const { camera, controls, invalidate } = useThree();
  const key = [...pos, ...target].map((v) => v.toFixed(4)).join(',');
  useEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    const c = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (c?.target) { c.target.set(target[0], target[1], target[2]); c.update?.(); } else camera.lookAt(target[0], target[1], target[2]);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, controls]);
  return null;
}

export interface DrawList {
  arrows: { key: string; from: Vec3; to: Vec3; col: ColKey; w: number; o?: number }[];
  lines: { key: string; pts: Vec3[]; col: ColKey; w: number; dashed?: boolean; o?: number }[];
  dots: { key: string; at: Vec3; col: ColKey; r: number }[];
  labels: { key: string; at: Vec3; parts: LabelPart[]; col: ColKey }[];
}

/** Draws a frame's lists (lines first, then arrows, dots, labels on top). */
export function DrawFrame({ f }: { f: DrawList }) {
  return (
    <>
      {f.lines.map((l) => (l.pts.length > 1 && (l.o ?? 1) > 0.01 ? (
        <Line key={l.key} points={l.pts as P3[]} color={SC_COL[l.col]} lineWidth={l.w} transparent={(l.o ?? 1) < 0.999} opacity={l.o ?? 1}
          {...(l.dashed ? { dashed: true, dashSize: 0.06, gapSize: 0.05 } : {})} />
      ) : null))}
      {f.arrows.map((a) => <FadeArrow key={a.key} from={a.from} to={a.to} color={SC_COL[a.col]} width={a.w} o={a.o ?? 1} />)}
      {f.dots.map((d) => (
        <mesh key={d.key} position={d.at as P3}>
          <sphereGeometry args={[d.r, 20, 20]} />
          <meshBasicMaterial color={SC_COL[d.col]} />
        </mesh>
      ))}
      {f.labels.map((l) => <RichLabel key={l.key} at={l.at} parts={l.parts} color={SC_COL[l.col]} />)}
    </>
  );
}
