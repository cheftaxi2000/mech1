import { describe, expect, it } from 'vitest';
import { Q1, Q2, Q3, Q4, Q5 } from './quizValues';

// The numbers as they are written in the quiz texts (Q1Quiz, Q2Quiz, Q3Quiz).
describe('quiz part: every answer agrees with the physics code', () => {
  it('Kapitel 1', () => {
    expect(Q1.r).toBeCloseTo(7, 12);
    expect(Q1.thetaDeg).toBeCloseTo(135, 10);
    expect(Q1.phiDeg).toBeCloseTo(270, 10);
    expect(Q1.crossLen).toBeCloseTo(3, 12);
    expect(Q1.dot).toBe(1);
    expect(Q1.ePhiAt90[0]).toBeCloseTo(-1, 12); expect(Q1.ePhiAt90[1]).toBeCloseTo(0, 12);
  });
  it('Kapitel 2', () => {
    expect(Q2.speedAt15).toBe(12);
    expect(Q2.cylSpeed).toBeCloseTo(Math.sqrt(37), 12); expect(Q2.cylSpeed).toBeCloseTo(6.08, 2);
    expect(Q2.circleSpeed).toBeCloseTo(2, 12);
    expect(Q2.originShift).toBeCloseTo(0, 12);
  });
  it('Kapitel 3', () => {
    expect(Q3.vBx).toBe(2);
    expect(Q3.ladderVV).toBeCloseTo(1.73, 2);
    expect(Q3.rotSpeed).toBeCloseTo(0.6, 12);
    expect(Q3.bikeTop).toBeCloseTo(36, 12);
    expect(Q3.wheelOmega).toBeCloseTo(10, 12); expect(Q3.wheelOmegaCheck).toBeCloseTo(0, 12);
    expect(Q3.beltOmega).toBeCloseTo(6, 12); expect(Q3.beltSlip).toBeCloseTo(0, 12);
    expect(Q3.coneVC).toBeCloseTo(0.3, 12); expect(Q3.coneW).toBeCloseTo(3.46, 2); expect(Q3.coneTop).toBeCloseTo(0.6, 12);
    expect(Q3.fieldVM).toBeCloseTo(0.5, 12); expect(Q3.fieldTurn).toEqual([expect.closeTo(-0.5, 12), expect.closeTo(0, 12), expect.closeTo(0, 12)]);
  });
  it('Kapitel 3, S. 24–28', () => {
    expect(Q4.vOmega).toBeCloseTo(2, 12);
    expect(Q4.axisX).toBeCloseTo(1, 12); expect(Q4.axisZ).toBeCloseTo(0, 12);
    expect(Q4.fastestCorner).toBeCloseTo(2 * Math.sqrt(3), 12); expect(Q4.fastestCorner).toBeCloseTo(3.46, 2);
    expect(Q4.slowestCorner).toBeCloseTo(2, 12);
    expect(Q4.ladderOmega).toBeCloseTo(1, 12); expect(Q4.ladderVV).toBeCloseTo(1.73, 2);
    expect(Q4.armRingFixed).toBeCloseTo(2 / 9, 12); expect(Q4.armRingFixed).toBeCloseTo(0.22, 2);
    expect(Q4.planetRingFixed).toBeCloseTo(-0.4, 12); expect(Q4.ratio).toBeCloseTo(4.5, 12);
    expect(Q4.armStill).toBeCloseTo(-0.29, 2); expect(Q4.armStillCheck).toBeCloseTo(0, 12);
  });

  it('Quiz 5 (pp. 29–36)', () => {
    expect(Q5.f5Equilibrium).toBeCloseTo(Math.hypot(30, 10), 12); expect(Q5.f5Equilibrium).toBeCloseTo(31.6, 1);
    expect(Q5.outerBeam).toBe(4); expect(Q5.outerBeamLoad).toBe(6);
    expect(Q5.cartsOuter).toBeCloseTo(70, 12); expect(Q5.cartsInner).toBeCloseTo(0, 12);
    expect(Q5.rampR).toBeCloseTo(120, 12);
    expect(Q5.concreteG).toBeCloseTo(35.316, 3);
    expect(Q5.powerPush).toBeCloseTo(5.2, 12);
    expect(Q5.momentO).toBeCloseTo(1.85, 12); expect(Q5.leverD).toBeCloseTo(1.22, 2);
    expect(Q5.wheelM).toBeCloseTo(1.8, 12);
    expect(Q5.plateP).toBeCloseTo(5.5, 12); expect(Q5.plateRvB).toBeCloseTo(2.5, 12); expect(Q5.plateMw).toBeCloseTo(3, 12);
    expect(Q5.plateRvB2).toBeCloseTo(1.25, 12); expect(Q5.plateMw2).toBeCloseTo(4.25, 12); expect(Q5.plateP2).toBeCloseTo(5.5, 12);
    expect(Q5.ladderP).toBeCloseTo(Q5.ladderP2, 12); expect(Q5.ladderP).toBeCloseTo(-23.9, 1);
    expect(Q5.ladderRvA).toBeCloseTo(-10.6, 1); expect(Q5.ladderMw).toBeCloseTo(-13.3, 1);
  });
});
