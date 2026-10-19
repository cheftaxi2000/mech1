import { describe, expect, it } from 'vitest';
import { Q1, Q2, Q3, Q4 } from './quizValues';

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
});
