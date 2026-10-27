import { Code } from '../../components/Code';
import { PSEUDO } from '../../info/boxcomputer';
import { useTr } from '../../i18n';
import './info.css';

export const GCD_CPP = `int gcd(int a, int b) {
  while (a != b) {
    if (a > b) {
      a = a - b;
    } else {
      b = b - a;
    }
  }
  return a;
}`;

/** The first bytes of the machine code of Fig. 1.7 (shown only to make the level visible – not the translation of this very function). */
export const BYTES = `8f 02 00 00 22 00 2e 00
1f 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
c0 02 00 00 22 00 30 00
…`;

/** Fig. 1.7: the same algorithm on four levels, from a thought to bytes. */
export function LevelsFigure() {
  const tr = useTr();
  return (
    <figure className="vdemo lv-stack">
      <div className="lv-row">
        <div className="lv-name">{tr('Kernidee', 'Core idea')}<small>{tr('für Menschen, abstrakt', 'for humans, abstract')}</small></div>
        <div className="lv-box lv-idea">{tr(
          'Ziehe immer das Kürzere vom Längeren ab. Sind beide gleich lang, ist diese Länge das Ergebnis.',
          'Always subtract the shorter from the longer. When both are equally long, that length is the result.')}</div>
      </div>
      <div className="lv-arrow"><span aria-hidden="true">↓</span><span>{tr('ein Mensch formuliert genauer', 'a human makes it precise')}</span></div>
      <div className="lv-row">
        <div className="lv-name">{tr('Pseudocode', 'Pseudo-code')}<small>{tr('für Menschen, halb genau', 'for humans, semi-detailed')}</small></div>
        <div className="lv-box"><Code code={PSEUDO.join('\n')} label={tr('Pseudocode', 'Pseudo-code')} /></div>
      </div>
      <div className="lv-arrow"><span aria-hidden="true">↓</span><span>{tr('ein Mensch schreibt es in einer Programmiersprache', 'a human writes it in a programming language')}</span></div>
      <div className="lv-row">
        <div className="lv-name">{tr('Programm', 'Program')}<small>C++</small></div>
        <div className="lv-box"><Code code={GCD_CPP} label="C++" /></div>
      </div>
      <div className="lv-arrow"><span aria-hidden="true">↓</span><span>{tr('der Compiler übersetzt', 'the compiler translates')}</span></div>
      <div className="lv-row">
        <div className="lv-name">{tr('Maschinencode', 'Machine code')}<small>{tr('nur für den Rechner', 'for the machine only')}</small></div>
        <div className="lv-box lv-bytes" aria-label={tr('Beispiel von Maschinencode', 'Example of machine code')}>{BYTES}</div>
      </div>
    </figure>
  );
}
