/**
 * Content lint for lesson sources. Catches authoring mistakes that type-checking and rendering tests miss.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TOPICS } from './curriculum';

const dir = join(__dirname, '..', 'lessons');
const files = readdirSync(dir).filter((f) => f.endsWith('.tsx'));
const INLINE = '(?:M|b|em|i|code|Src|De|a|span|strong)';

describe('lesson source lint', () => {
  it.each(files)('%s: no whitespace swallowed at JSX line breaks', (f) => {
    const lines = readFileSync(join(dir, f), 'utf8').split('\n');
    const bad: string[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      const a = lines[i].trimEnd(), b = lines[i + 1].trim();
      const textThenTag = /[\w.,;:)\]!?”"'%-]$/.test(a) && !a.trim().startsWith('<') && new RegExp(`^<${INLINE}\\b[^>]*>(?! )`).test(b);
      const tagThenText = new RegExp(`</${INLINE}>$`).test(a) && /^[\w(]/.test(b);
      if (textThenTag || tagThenText) bad.push(`${f}:${i + 1}`);
    }
    expect(bad, 'add {\' \'} at the end of these lines').toEqual([]);
  });

  it.each(files)('%s: punctuation after a formula is attached via <M p="…"> (never wraps to a new line)', (f) => {
    const src = readFileSync(join(dir, f), 'utf8');
    // `{ text: <M>…</M>,` in a quiz option is a JavaScript separator, not text
    const isJsSeparator = (line: string) => /\{ text: <M>.*<\/M>,/.test(line);
    const bad = src.split('\n').flatMap((line, i) =>
      (/<\/M>[.,:;!?]/.test(line) && !isJsSeparator(line)) || / ✓/.test(line) ? [`${f}:${i + 1}`] : []);
    expect(bad).toEqual([]);
  });

  it('every written lesson is registered in the curriculum and vice versa', () => {
    const registered = TOPICS.filter((t) => t.component).length;
    expect(registered).toBe(files.length);
  });
});
