/**
 * Supplement model for the lesson «Innere und äussere Kräfte, Systemabgrenzung» (Skript pp. 30–31).
 * The Skript only draws the picture of the Lastkörper on the Träger on two Stützen (p. 31); the numbers below are OUR
 * example (statics comes later): the Lastkörper rests, so every body is in equilibrium. Directions as in the figure.
 * Coordinates: x to the right, y up (metres), z = 0.
 */
import { classify, supportForces, sumForces, type Interaction } from './force';
import type { Vec3 } from './vec';

export type BeamBody = 'last' | 'traeger' | 'stuetzeA' | 'stuetzeB';
export const BEAM_BODIES: readonly BeamBody[] = ['last', 'traeger', 'stuetzeA', 'stuetzeB'];
/** The chips of the figure: the two Stützen are one choice. */
export type BeamGroup = 'last' | 'traeger' | 'stuetzen';
export const GROUP_BODIES: Record<BeamGroup, readonly BeamBody[]> = { last: ['last'], traeger: ['traeger'], stuetzen: ['stuetzeA', 'stuetzeB'] };
export const systemOf = (groups: Iterable<BeamGroup>): Set<BeamBody> => new Set([...groups].flatMap((g) => GROUP_BODIES[g]));

/** Parameters: weight G of the Lastkörper, pull Z (to the right), position s ∈ (0,1) of its centre between A and B. */
export interface BeamExample { G: number; Z: number; s: number }
export const BEAM = { ell: 4, blockW: 1.8, foot: 0.7 } as const;

/** All interactions of the p. 31 figure. `by` bodies that are not drawn (Erde, Zug, Boden) are never part of a system. */
export function beamInteractions({ G, Z, s }: BeamExample): Interaction[] {
  const { ell, foot } = BEAM;
  const x = s * ell, A: Vec3 = [0, 0, 0], B: Vec3 = [ell, 0, 0];
  const c1: Vec3 = [x - foot, 0, 0], c2: Vec3 = [x + foot, 0, 0], com: Vec3 = [x, 0.5, 0], zp: Vec3 = [x + BEAM.blockW / 2, 0.7, 0];
  const { FA, FB } = supportForces(ell, x, G, Z); // forces the supports exert ON THE BEAM
  const far: Vec3 = [x, 5, 0];
  return [
    { id: 'G', on: 'last', by: 'erde', Aon: com, Aby: far, F: [0, -G, 0] },
    { id: 'Z', on: 'last', by: 'zug', Aon: zp, Aby: far, F: [Z, 0, 0] },
    // our choice (the page does not say): both feet carry the same, G/2 and Z/2
    { id: 'N1', on: 'last', by: 'traeger', Aon: c1, Aby: c1, F: [0, G / 2, 0] },
    { id: 'N2', on: 'last', by: 'traeger', Aon: c2, Aby: c2, F: [0, G / 2, 0] },
    { id: 'R1', on: 'last', by: 'traeger', Aon: c1, Aby: c1, F: [-Z / 2, 0, 0] },
    { id: 'R2', on: 'last', by: 'traeger', Aon: c2, Aby: c2, F: [-Z / 2, 0, 0] },
    { id: 'FA', on: 'traeger', by: 'stuetzeA', Aon: A, Aby: A, F: FA },
    { id: 'FB', on: 'traeger', by: 'stuetzeB', Aon: B, Aby: B, F: FB },
    // not in the Skript: the ground holds each (weightless) Stütze, so that it is in equilibrium as well
    { id: 'HA', on: 'stuetzeA', by: 'boden', Aon: A, Aby: A, F: FA },
    { id: 'HB', on: 'stuetzeB', by: 'boden', Aon: B, Aby: B, F: FB },
  ];
}

/** The ground forces H only matter (and are only drawn) if the Stütze belongs to the system. */
export function visibleInteractions(all: readonly Interaction[], system: ReadonlySet<string>): Interaction[] {
  return all.filter((i) => !(i.id === 'HA' && !system.has('stuetzeA')) && !(i.id === 'HB' && !system.has('stuetzeB')));
}

export function classifyBeam(ex: BeamExample, system: ReadonlySet<BeamBody>) {
  const ints = visibleInteractions(beamInteractions(ex), system);
  const { inner, outer } = classify(system, ints);
  return { inner, outer, sumInner: sumForces(inner), sumOuter: sumForces(outer) };
}

/** Two carts on a smooth rail (the small introductory example): a hand pushes cart 1 with H, cart 1 pushes cart 2 with P. */
export type CartBody = 'w1' | 'w2';
export function cartInteractions(H: number, P: number): Interaction[] {
  return [
    { id: 'H', on: 'w1', by: 'hand', Aon: [0, 0, 0], Aby: [-1, 0, 0], F: [H, 0, 0] },
    { id: 'P', on: 'w2', by: 'w1', Aon: [2, 0, 0], Aby: [2, 0, 0], F: [P, 0, 0] },
  ];
}
export function classifyCarts(H: number, P: number, system: ReadonlySet<CartBody>) {
  const { inner, outer } = classify(system, cartInteractions(H, P));
  return { inner, outer, sumInner: sumForces(inner), sumOuter: sumForces(outer) };
}
