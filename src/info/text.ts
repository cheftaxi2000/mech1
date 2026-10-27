/** Characters and texts (notes Section 9): ASCII, UTF-8 and the Caesar cipher as pure functions. */

/** The 95 printable ASCII characters have the codes 32 … 126. */
export const PRINTABLE_FIRST = 32;
export const PRINTABLE_LAST = 126;
export const PRINTABLE_COUNT = PRINTABLE_LAST - PRINTABLE_FIRST + 1;

export const mod = (dividend: number, divisor: number) => ((dividend % divisor) + divisor) % divisor;

/** `shift(c, s)` of Code 9.1: printable characters move s places cyclically, all others stay. */
export function shiftChar(code: number, s: number): number {
  return code >= PRINTABLE_FIRST && code <= PRINTABLE_LAST ? PRINTABLE_FIRST + mod(code - PRINTABLE_FIRST + s, PRINTABLE_COUNT) : code;
}

export const caesar = (text: string, s: number) => Array.from(text, (ch) => String.fromCharCode(shiftChar(ch.charCodeAt(0), s))).join('');

export interface Utf8 {
  /** the bytes of the encoding */
  bytes: number[];
  /** the bit pattern of every byte as the notes' table shows it (`x` = free payload bit) */
  template: string[];
  /** the payload bits (without leading zeros beyond what the pattern needs), split over the bytes */
  parts: string[];
  /** number of usable bits of this form (7, 11, 16, 21) */
  usable: number;
}

/**
 * UTF-8 encoding of a code point by the patterns of the notes (p. 115):
 *   7 bits 0xxxxxxx · 11 bits 110xxxxx 10xxxxxx · 16 bits 1110xxxx 10xxxxxx 10xxxxxx · 21 bits 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx.
 * (Today's standard stops at four bytes; the five- and six-byte forms of the notes' table are obsolete.)
 */
export function utf8(cp: number): Utf8 {
  const forms: [number, string[]][] = [
    [7, ['0xxxxxxx']],
    [11, ['110xxxxx', '10xxxxxx']],
    [16, ['1110xxxx', '10xxxxxx', '10xxxxxx']],
    [21, ['11110xxx', '10xxxxxx', '10xxxxxx', '10xxxxxx']],
  ];
  const [usable, template] = forms.find(([bits]) => cp < 2 ** bits) ?? forms[3];
  const payload = cp.toString(2).padStart(usable, '0');
  let pos = 0;
  const parts: string[] = [];
  const bytes = template.map((t) => {
    const free = (t.match(/x/g) ?? []).length;
    const part = payload.slice(pos, pos + free);
    pos += free;
    parts.push(part);
    return parseInt(t.replace(/x+/, part), 2);
  });
  return { bytes, template, parts, usable };
}
