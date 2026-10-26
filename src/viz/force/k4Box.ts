/** The box a × b × c in the lecture's view (x down-right, y up-right, z up): the three visible faces and the centre. */
import type { Vec3 } from '../../physics/vec';
import { OBLIQUE, project, type P2, type View } from '../anim/geometry';

export const BOX_VIEW: View = { ...OBLIQUE, cx: 200, cy: 190, s: 44 };

export function boxFaces(a: number, b: number, c: number, view: View = BOX_VIEW) {
  const P = (x: number, y: number, z: number): P2 => project([x, y, z] as Vec3, view);
  return {
    top: [P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)],
    left: [P(0, 0, 0), P(a, 0, 0), P(a, 0, c), P(0, 0, c)],     // y = 0 (faces the viewer on the left)
    right: [P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)],    // x = a (faces the viewer on the right)
    centre: P(a / 2, b / 2, c / 2),
    P,
  };
}
