/**
 * Every number in the quiz part, computed with the same physics code the lessons use (checked in
 * quizValues.test.ts against the values written in the quiz texts). Units: m, s, rad unless stated.
 */
import { cartToCyl, cartToSph, ePhi } from '../physics/coords';
import { coneAxis, coneOmega, conePoint, kreiselVelocity, rollingSpin } from '../physics/kreisel';
import { velocityCylindrical } from '../physics/kinematics';
import { contactVelocity, wheelVelocity } from '../physics/rolling';
import { rigidVelocity } from '../physics/rigid';
import { rotationVelocity } from '../physics/rotation';
import { type Vec3, add, cross, dot, norm, scale } from '../physics/vec';
import { FIG330, fig330Solution } from '../physics/screw';
import { ladder as ladderPower, power, resultant } from '../physics/force';
import { boxWeight, lineExact } from '../physics/distributed';
import { classifyBeam, classifyCarts } from '../physics/systemModel';
import { PROOF, moveReference, plateNumbers } from '../physics/kraeftegruppe';
import { leverArm2D, momentZ2D } from '../physics/powerMoment';

import { ladderMZ } from '../physics/plane';
import { omega3, omegaArm, ratioRingFixed } from '../physics/planetary';

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
  /** Grundgleichung v_M = v_B + ω × BM with v_B = (1,0,0), ω = (0,0,2), BM = (0, 0.25, 0) */
  fieldVM: norm(rigidVelocity([1, 0, 0], [0, 0, 2], [0, 0, 0], [0, 0.25, 0])),
  fieldTurn: cross([0, 0, 2], [0, 0.25, 0]),
};

/** Kapitel 3, pp. 24–28: Kinemate, Zentralachse, ebene Bewegung, Planetengetriebe */
const fig = fig330Solution();
const cubeCorners: Vec3[] = [0, 1].flatMap((x) => [0, 1].flatMap((y) => [0, 1].map((z) => [x, y, z] as Vec3)));
const cornerSpeeds = cubeCorners.map((c) => norm(add(FIG330.vB, cross(FIG330.omega, c))));
const ladder = ladderMZ(2, 30 * DEG, 1);
const gear = { R1: 0.8, R2: 2.8 };
export const Q4 = {
  vOmega: norm(fig.vw), // Problem Fig. 3.30: |v_ω| = 2 m/s
  axisX: fig.xP, axisZ: fig.zP, // ζ: (1, 0, 0) + λ (0, 1, 0)
  fastestCorner: Math.max(...cornerSpeeds), slowestCorner: Math.min(...cornerSpeeds),
  ladderOmega: Math.abs(ladder.w), ladderVV: ladder.vV, // L = 2 m, φ = 30°, v_H = 1 m/s
  armRingFixed: omegaArm(gear, 1, 0), planetRingFixed: omega3(gear, 1, 0), ratio: ratioRingFixed(gear),
  armStill: -gear.R1 / gear.R2, armStillCheck: omegaArm(gear, 1, -gear.R1 / gear.R2),
};


/** Kapitel 4 und 5, pp. 29–36: Kräfte, Systemabgrenzung, verteilte Kräfte, Leistung, Moment, Kräftegruppe */
const f1to4: Vec3[] = [[5, -25, 0], [-20, -45, 0], [-30, 5, 0], [15, 55, 0]];
const rest = resultant(f1to4.map((F) => ({ F })));
const plate = plateNumbers(PROOF), plateB2 = plateNumbers(moveReference(PROOF, [2, 0.5]));
const lad = ladderPower({ L: 4, G: 20, W: 15, v: 1, omega: 0.5 });
export const Q5 = {
  f5Equilibrium: norm(scale(-1, rest)), // F5 = −(F1 + … + F4) = (30; 10) N, |F5| ≈ 31,6 N
  outerBeam: classifyBeam({ G: 80, Z: 50, s: 0.4 }, new Set(['last', 'traeger'])).outer.length, // 4
  outerBeamLoad: classifyBeam({ G: 80, Z: 50, s: 0.4 }, new Set(['last'])).outer.length, // 6
  cartsOuter: classifyCarts(70, 42, new Set(['w1', 'w2'])).sumOuter[0], // 70 N
  cartsInner: classifyCarts(70, 42, new Set(['w1', 'w2'])).sumInner[0], // 0
  rampR: lineExact('ramp'), // 120 N
  concreteG: boxWeight(2400, 2, 1.5, 0.5, false).G / 1000, // kN, ≈ 35,3
  powerPush: power([2.6, 1.5, 0], [2, 0, 0]), // 5,2 W
  momentO: Math.abs(momentZ2D([1.3, 0.5], [0.2, 1.5])), // 1,85 N·m
  leverD: leverArm2D([1.3, 0.5], [0.2, 1.5]).d, // 1,22 m
  wheelM: momentZ2D([1.5, 0], [0.7, 1.2]), // 1,8 N·m
  plateP: plate.total, plateRvB: plate.translation, plateMw: plate.rotation, // 5,5 = 2,5 + 3,0 W
  plateRvB2: plateB2.translation, plateMw2: plateB2.rotation, plateP2: plateB2.total, // 1,25 + 4,25 = 5,5 W
  ladderP: lad.methodI, ladderP2: lad.methodII, ladderRvA: lad.parts.RvA, ladderMw: lad.parts.MAomega, // −23,9 W
};
