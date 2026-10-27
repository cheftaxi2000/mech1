/**
 * The box computer of the lecture notes (Fig. 1.3, p. 11–12): ten boxes with addresses 0–9, two registers L and R,
 * and the eight instructions that run Euclid's algorithm. Boxes 0–7 hold instructions, 8 holds b, 9 holds a.
 * The execution rule is the one printed on p. 12: start at address 0, continue with the next address unless the
 * instruction is a jump.
 */
export type Reg = 'L' | 'R';

export type Instr =
  | { op: 'load'; addr: number; to: Reg }          // copy the content of box `addr` into a register
  | { op: 'stop' }                                  // compare L and R; if equal, stop (result is in R)
  | { op: 'jumpIfRgtL'; target: number }            // compare R and L; if R > L jump to `target`
  | { op: 'store'; addr: number; diff: 'L-R' | 'R-L' } // write the difference into box `addr`
  | { op: 'jump'; target: number };

export type Cell = Instr | number;

/** The program of Fig. 1.3 / the table on p. 12, addresses 0–7. */
export const PROGRAM: Instr[] = [
  { op: 'load', addr: 8, to: 'L' },
  { op: 'load', addr: 9, to: 'R' },
  { op: 'stop' },
  { op: 'jumpIfRgtL', target: 6 },
  { op: 'store', addr: 8, diff: 'L-R' },
  { op: 'jump', target: 0 },
  { op: 'store', addr: 9, diff: 'R-L' },
  { op: 'jump', target: 0 },
];

export const ADDR_B = 8;
export const ADDR_A = 9;

export interface BoxState {
  mem: Cell[];
  L: number | null;
  R: number | null;
  /** Address of the instruction that runs next (the "program counter" – the lecture's RW-head position). */
  pc: number;
  halted: boolean;
  /** Number of instructions executed so far. */
  steps: number;
  /** Address of the box written by the last step, and the register loaded by it (for highlighting). */
  wrote: number | null;
  loaded: Reg | null;
}

/** Fresh machine: program in 0–7, `b` in box 8, `a` in box 9, registers empty. */
export function initial(a: number, b: number): BoxState {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) throw new RangeError('the box computer is used with strictly positive integers');
  return { mem: [...PROGRAM, b, a], L: null, R: null, pc: 0, halted: false, steps: 0, wrote: null, loaded: null };
}

const num = (c: Cell): number => {
  if (typeof c !== 'number') throw new Error('read an instruction as data');
  return c;
};

/** Execute one instruction. A halted machine stays as it is. Pure: returns a new state. */
export function step(s: BoxState): BoxState {
  if (s.halted) return s;
  const ins = s.mem[s.pc];
  if (typeof ins === 'number') throw new Error(`box ${s.pc} holds data, not an instruction`);
  const next: BoxState = { ...s, mem: [...s.mem], steps: s.steps + 1, wrote: null, loaded: null };
  switch (ins.op) {
    case 'load': next[ins.to] = num(s.mem[ins.addr]); next.loaded = ins.to; next.pc = s.pc + 1; break;
    case 'stop': if (s.L === s.R) { next.halted = true; } else next.pc = s.pc + 1; break;
    case 'jumpIfRgtL': next.pc = (s.R as number) > (s.L as number) ? ins.target : s.pc + 1; break;
    case 'store': {
      const L = s.L as number, R = s.R as number;
      next.mem[ins.addr] = ins.diff === 'L-R' ? L - R : R - L;
      next.wrote = ins.addr; next.pc = s.pc + 1; break;
    }
    case 'jump': next.pc = ins.target; break;
  }
  return next;
}

/** All states from the start until the machine halts (guarded against runaway programs). */
export function runTrace(a: number, b: number, limit = 100_000): BoxState[] {
  const out = [initial(a, b)];
  while (!out.at(-1)!.halted) {
    if (out.length > limit) throw new Error('did not halt');
    out.push(step(out.at(-1)!));
  }
  return out;
}

/** Which line of the pseudo-code (Fig. 1.2) an instruction belongs to (0 = while, 1 = if, 2 = a←a−b, 3 = else, 4 = b←b−a, 5/6 = end, 7 = result). */
export function pseudoLine(pc: number, halted = false): number {
  if (halted) return 7;
  return [0, 0, 0, 1, 4, 4, 2, 2][pc] ?? 0;
}

/** The program as the pseudo-code of Fig. 1.2 (code is not translated). */
export const PSEUDO = [
  'while a ≠ b do',
  '  if a > b then',
  '    a ← a − b',
  '  else',
  '    b ← b − a',
  '  end',
  'end',
  'result: a',
];
