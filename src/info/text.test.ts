import { describe, expect, it } from 'vitest';
import { runProgram } from './cpp/interp';
import { P } from './cpp/programs';
import { caesar, mod, PRINTABLE_COUNT, shiftChar, utf8 } from './text';

describe('ASCII and Caesar', () => {
  it('there are 95 printable characters between 32 and 126 (inclusive)', () => {
    expect(PRINTABLE_COUNT).toBe(95);
    expect(String.fromCharCode(32)).toBe(' ');
    expect(String.fromCharCode(126)).toBe('~');
  });
  it("letters and digits have the codes of the notes' table", () => {
    expect(['A', 'Z', 'a', 'z', '0', '9'].map((c) => c.charCodeAt(0))).toEqual([65, 90, 97, 122, 48, 57]);
  });
  it('the shift by −3 matches the illustration on p. 116', () => {
    expect([32, 33, 68, 69, 126].map((c) => shiftChar(c, -3))).toEqual([124, 125, 65, 66, 123]);
  });
  it('encoding with s and decoding with −s is the identity for all printable characters and all shifts', () => {
    const all = Array.from({ length: 95 }, (_, k) => String.fromCharCode(32 + k)).join('');
    for (let s = -200; s <= 200; s++) expect(caesar(caesar(all, s), -s)).toBe(all);
  });
  it('mod is the mathematical remainder', () => {
    expect(mod(-3, 5)).toBe(2);
    expect(mod(-95, 95)).toBe(0);
    expect(mod(7, 3)).toBe(1);
  });
  it('the C++ program of Code 9.1 agrees with the model (also on blanks and line breaks)', () => {
    const run = (s: number, text: string) => runProgram(P.caesar.code, { stdin: `${s}${text}`, maxSnaps: 400000 }).stdout;
    // the character right after the number is read as well (noskipws): here the line break, which is not printable
    expect(run(3, '\nHello, World!')).toBe('\n' + caesar('Hello, World!', 3));
    // a blank right after the number is a printable character and is shifted too
    expect(run(3, ' Hello')).toBe(caesar(' Hello', 3));
    expect(run(3, ' Hello').startsWith('#')).toBe(true);
    expect(run(-3, ' ' + caesar('Hello, World!', 3))).toBe(' '.replace(' ', caesar(' ', -3)) + 'Hello, World!');
  });
  it('ZEBRA: the cipher of the notes (letters only) gives AFCSB and YDAQZ; Code 9.1 (all 95 characters) gives [FCSB', () => {
    expect(runProgram(P.zebra.code).stdout).toBe('[FCSB AFCSB YDAQZ');
  });
});

describe('UTF-8', () => {
  it('agrees with TextEncoder for code points of all four lengths', () => {
    for (const cp of [0x41, 0x7f, 0x80, 0xe4, 0x7ff, 0x800, 0x20ac, 0xffff, 0x10000, 0x1f600, 0x10ffff]) {
      expect(utf8(cp).bytes).toEqual(Array.from(new TextEncoder().encode(String.fromCodePoint(cp))));
    }
  });
  it('uses the patterns of the notes: 7 / 11 / 16 / 21 usable bits', () => {
    expect(utf8(0x41).usable).toBe(7);
    expect(utf8(0xe4).usable).toBe(11);
    expect(utf8(0x20ac).usable).toBe(16);
    expect(utf8(0x1f600).usable).toBe(21);
    expect(utf8(0xe4).template).toEqual(['110xxxxx', '10xxxxxx']);
  });
  it('a byte starting with 10 never starts a character (the property mentioned in the notes)', () => {
    const bytes = Array.from(new TextEncoder().encode('aä€😀'));
    const starts = bytes.filter((b) => (b & 0xc0) !== 0x80).length;
    expect(starts).toBe(4);
  });
  it('the five- and six-byte forms of the notes\' table are rejected by today\'s decoders (limit: four bytes)', () => {
    expect(() => new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array([0xf8, 0x88, 0x80, 0x80, 0x80]))).toThrow();
    expect(() => new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array([0xfc, 0x84, 0x80, 0x80, 0x80, 0x80]))).toThrow();
  });
});
