import { describe, expect, it } from 'vitest';
import { tokenize } from './Code';

describe('C++ tokenizer', () => {
  const kinds = (s: string) => tokenize(s).filter((t) => t.kind !== 'txt').map((t) => `${t.kind}:${t.text}`);
  it('colours keywords, numbers and comments', () => {
    expect(kinds('int b = a * a; // b = a^2')).toEqual(['kw:int', 'com:// b = a^2']);
    expect(kinds('while (a != 10) {')).toEqual(['kw:while', 'num:10']);
  });
  it('does not treat // inside a string as a comment', () => {
    expect(kinds('std::cout << "http://x";')).toEqual(['str:"http://x"']);
  });
  it('marks preprocessor lines and keeps the text intact', () => {
    expect(kinds('#include <iostream>')).toEqual(['pre:#include <iostream>']);
    expect(tokenize('int x = 3; // c').map((t) => t.text).join('')).toBe('int x = 3; // c');
  });
});
