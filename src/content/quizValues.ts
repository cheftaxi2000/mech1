/**
 * Every number in the quiz part, computed with the same physics code the lessons use (checked in
 * quizValues.test.ts against the values written in the quiz texts). Units: m, s, rad unless stated.
 */
import { cartToCyl, cartToSph, ePhi } from '../physics/coords';
import { coneAxis, coneOmega, conePoint, kreiselVelocity, rollingSpin } from '../physics/kreisel';
import { velocityCylindrical } from '../physics/kinematics';
import { contactVelocity, wheelVelocity } from '../physics/rolling';
import { rotationVelocity } from '../physics/rotation';
import { type Vec3, add, cross, dot, norm, scale } from '../physics/vec';

const DEG = Math.PI / 180;

/** Kapitel 1 */
export const Q1 = {
  r: norm([2, -3, 6]),
  thetaDeg: cartToSph([1, 1, -Math.SQRT2]).theta / DEG,
  phiDeg: cartToCyl([0, -2, 5]).phi / DEG,
  crossLen: norm(cross([2, 0, 0], scale(3, [Math.cos(30 * DEG), Math.sin(30 * DEG), 0]))),
  dot: dot([1, 2, 0], [3, -1, 4]),
  ePhiAt90: ePhi(90 * DEG),
};

/** Kapitel 2 */
const sDot = (t: number) => 8 * t; // s(t) = 4t² ⇒ ṡ = 8t
export const Q2 = {
  speedAt15: sDot(1.5),
  cylSpeed: norm(velocityCylindrical(2, 0.7, 1, 3, 0)),
  circleSpeed: norm(rotationVelocity([0, 0, 4], [0, 0, 0], [0.5, 0, 0])),
  /** v = ω × r with r measured from another point of the axis: the same velocity */
  originShift: norm(add(rotationVelocity([0, 0, 4], [0, 0, 0], [0.5, 0, 2]), scale(-1, rotationVelocity([0, 0, 4], [0, 0, 0], [0.5, 0, 0])))),
};

/** Kapitel 3 */
const coneC = (gam: number, L: number, phiDot: number) => {
  const H = L * Math.cos(gam), omega = coneOmega(gam, 0, phiDot, rollingSpin(gam, phiDot));
  const C = scale(H, coneAxis(gam, 0));
  const top: Vec3 = add(C, scale(L * Math.sin(gam), [-Math.sin(gam), 0, Math.cos(gam)]));
  return { vC: norm(kreiselVelocity(omega, C)), vTop: norm(kreiselVelocity(omega, conePoint(gam, 0, 0, top))), w: norm(omega) };
};
const cone = coneC(30 * DEG, 0.2, 2);
export const Q3 = {
  vBx: dot([2, 1, 0], [1, 0, 0]), // SdpG along AB = (1,0,0): v_B·AB = v_A·AB
  ladderVV: 1 / Math.tan(30 * DEG), // v_V = v_H cot α, v_H = 1 m/s
  rotSpeed: norm(rotationVelocity([0, 0, 2], [0, 0, 0], [0.3, 0, 0.4])), // 0.3 m from the axis, |OM| = 0.5 m
  bikeTop: wheelVelocity(18, 18, [0, 1])[0], // km/h, R = 1 in the wheel's units, rolling ω R = v_C
  wheelOmega: 3 / 0.3, // rolling: v_C − ωR = 0
  wheelOmegaCheck: contactVelocity(3, 3 / 0.3, 0.3),
  beltOmega: (2 - -1) / 0.5, // v_C − ωR = u with u = −1 m/s
  beltSlip: contactVelocity(2, (2 - -1) / 0.5, 0.5) - -1,
  coneVC: cone.vC, coneW: cone.w, coneTop: cone.vTop,
};
