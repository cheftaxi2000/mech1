/** The box a × b × c in the lecture's view (x down-right, y up-right, z up): the three visible faces and the centre. */
import type { Vec3 } from '../../physics/vec';
import { OBLIQUE, project, type P2, type View } from '../anim/geometry';

export const BOX_VIEW: View = { ...OBLIQUE, cx: 0, cy: 0, s: 44 };

/** If `centre` is given, the picture is shifted so that the middle of its bounding box lies there. */
export function boxFaces(a: number, b: number, c: number, view: View = BOX_VIEW, centre?: P2) {
  const raw = (x: number, y: number, z: number): P2 => project([x, y, z] as Vec3, view);
  let dx = 0, dy = 0;
  if (centre) {
    const xs: number[] = [], ys: number[] = [];
    for (const X of [0, a]) for (const Y of [0, b]) for (const Z of [0, c]) { const p = raw(X, Y, Z); xs.push(p[0]); ys.push(p[1]); }
    dx = centre[0] - (Math.min(...xs) + Math.max(...xs)) / 2; dy = centre[1] - (Math.min(...ys) + Math.max(...ys)) / 2;
  }
  const P = (x: number, y: number, z: number): P2 => { const p = raw(x, y, z); return [p[0] + dx, p[1] + dy]; };
  return {
    top: [P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)],
    left: [P(0, 0, 0), P(a, 0, 0), P(a, 0, c), P(0, 0, c)],     // y = 0 (faces the viewer on the left)
    right: [P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)],    // x = a (faces the viewer on the right)
    centre: P(a / 2, b / 2, c / 2),
    P,
  };
}
