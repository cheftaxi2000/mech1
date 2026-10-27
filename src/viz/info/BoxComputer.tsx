import { useMemo, useState } from 'react';
import { Code } from '../../components/Code';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { ADDR_A, ADDR_B, PSEUDO, pseudoLine, runTrace, type Instr } from '../../info/boxcomputer';
import { NumSlider, useInterval } from './InfoControls';
import './info.css';

const t = String.raw;
const PRESETS: [number, number][] = [[12, 8], [8, 12], [9, 9], [21, 6]];

/** The text in a box, as printed in Fig. 1.3 (symbols, not language). */
export const cellText = (ins: Instr): string => {
  switch (ins.op) {
    case 'load': return `[${ins.addr}] → ${ins.to}`;
    case 'stop': return 'L = R? stop';
    case 'jumpIfRgtL': return `R > L? jump to ${ins.target}`;
    case 'store': return ins.diff === 'L-R' ? `L − R → [${ins.addr}]` : `R − L → [${ins.addr}]`;
    case 'jump': return `jump to ${ins.target}`;
  }
};

/** The instruction in words (p. 12 table), German or English. */
const words = (ins: Instr, tr: <X,>(de: X, en: X) => X): string => {
  switch (ins.op) {
    case 'load': return tr(`Kopiere den Inhalt von Box ${ins.addr} ins Register ${ins.to}.`, `Copy the content of box ${ins.addr} into register ${ins.to}.`);
    case 'stop': return tr('Vergleiche L und R. Sind sie gleich, halte an (das Ergebnis steht in R).', 'Compare L and R. If they are equal, stop (the result is in R).');
    case 'jumpIfRgtL': return tr(`Vergleiche R und L. Ist R grösser, mache bei Box ${ins.target} weiter, sonst bei der nächsten.`, `Compare R and L. If R is greater, continue at box ${ins.target}, otherwise at the next one.`);
    case 'store': return ins.diff === 'L-R'
      ? tr(`Schreibe L minus R in Box ${ins.addr}.`, `Write L minus R into box ${ins.addr}.`)
      : tr(`Schreibe R minus L in Box ${ins.addr}.`, `Write R minus L into box ${ins.addr}.`);
    case 'jump': return tr(`Springe zu Box ${ins.target}.`, `Jump to box ${ins.target}.`);
  }
};

/** Fig. 1.3 as a running machine: ten boxes, two registers, the instruction that runs next, and the pseudo-code it implements. */
export function BoxComputer() {
  const tr = useTr();
  const [a, setA] = useState(12), [b, setB] = useState(8);
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const trace = useMemo(() => runTrace(a, b), [a, b]);
  const last = trace.length - 1;
  const s = trace[Math.min(i, last)];
  useInterval(play, 650, () => setI((k) => { if (k >= last) { setPlay(false); return k; } return k + 1; }));
  const set = (na: number, nb: number) => { setA(na); setB(nb); setI(0); setPlay(false); };
  const ins = s.halted ? null : (s.mem[s.pc] as Instr);
  const pseudo = PSEUDO.join('\n');

  return (
    <figure className="vdemo in-fig">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {PRESETS.map(([x, y]) => (
          <button type="button" key={`${x}-${y}`} aria-pressed={x === a && y === b} onClick={() => set(x, y)}><M>{t`(${x},\,${y})`}</M></button>
        ))}
      </div>
      <div className="in-inputs">
        <NumSlider label={<M>a</M>} min={1} max={40} value={a} onChange={(v) => set(v, b)} aria={tr('Zahl a in Box 9', 'Number a in box 9')} />
        <NumSlider label={<M>b</M>} min={1} max={40} value={b} onChange={(v) => set(a, v)} aria={tr('Zahl b in Box 8', 'Number b in box 8')} />
      </div>

      <div className="bx-scroll">
        <div className="bx-mem" role="group" aria-label={tr('Die zehn Boxen des Speichers', 'The ten boxes of memory')}>
          {s.mem.map((c, k) => (
            <div className="bx-slot" key={k}>
              <span className="bx-pcmark" aria-hidden="true">{k === s.pc && !s.halted ? '▼' : ''}</span>
              <div className={`bx-cell ${typeof c === 'number' ? 'data' : 'instr'}${k === s.pc ? ' pc' : ''}${s.wrote === k ? ' wrote' : ''}`}
                aria-label={tr(`Box ${k}`, `Box ${k}`)}>
                {typeof c === 'number' ? <><code className="nm">{k === ADDR_A ? 'a' : k === ADDR_B ? 'b' : ''}</code>{c}</> : <code>{cellText(c)}</code>}
              </div>
              <span className="bx-addr">{k}</span>
            </div>
          ))}
        </div>
        <div className="bx-groups" aria-hidden="true"><span>{tr('Befehle', 'instructions')}</span><span>{tr('Daten', 'data')}</span></div>
      </div>

      <div className="bx-lower">
        <div>
          <div className="bx-regs">
            <div className={`bx-reg${s.loaded === 'L' ? ' loaded' : ''}`}><b>{s.L ?? ''}</b><span>{tr('Register', 'Register')} L</span></div>
            <div className={`bx-reg${s.loaded === 'R' ? ' loaded' : ''}`}><b>{s.R ?? ''}</b><span>{tr('Register', 'Register')} R</span></div>
          </div>
          <p className="in-counter" style={{ margin: '8px 0 0' }}>{tr(`Ausgeführte Befehle: ${s.steps}`, `Instructions executed: ${s.steps}`)}</p>
        </div>
        <Code code={pseudo} active={[pseudoLine(s.pc, s.halted)]} label={tr('Pseudocode von Euklid', "Euclid's pseudo-code")} />
      </div>

      <div className="bx-say" aria-live="polite">
        {s.halted
          ? <><b>{tr('Stopp.', 'Stop.')}</b> {tr('L und R sind gleich: Das Ergebnis steht in R und in beiden Datenboxen.', 'L and R are equal: the result is in R and in both data boxes.')}</>
          : <><b>{tr(`Als Nächstes, Box ${s.pc}:`, `Next, box ${s.pc}:`)}</b> {words(ins!, tr)}</>}
      </div>

      <div className="in-controls">
        <button type="button" className="motion-btn primary" onClick={() => { setPlay(false); setI((k) => Math.min(last, k + 1)); }} disabled={i >= last}>{tr('Ein Befehl', 'One instruction')} ›</button>
        <button type="button" className="motion-btn" onClick={() => { if (i >= last) setI(0); setPlay((p) => !p); }}>{play ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}</button>
        <button type="button" className="motion-btn" onClick={() => { setPlay(false); setI(last); }} disabled={i >= last}>{tr('Bis zum Ende', 'Run to the end')}</button>
        <button type="button" className="motion-btn" onClick={() => { setI(0); setPlay(false); }}>↺</button>
      </div>

      <details className="bx-details">
        <summary>{tr('Verlaufstabelle: alle Werte nach jedem Befehl', 'Trace table: all values after every instruction')}</summary>
        <div className="bx-trace">
          <table>
            <thead><tr><th>#</th><th>{tr('nächste Box', 'next box')}</th><th>L</th><th>R</th><th><M>b</M> (8)</th><th><M>a</M> (9)</th></tr></thead>
            <tbody>
              {trace.slice(0, i + 1).map((r, k) => (
                <tr key={k} className={k === i ? 'now' : ''}>
                  <td>{r.steps}</td><td>{r.halted ? '–' : r.pc}</td><td>{r.L ?? ''}</td><td>{r.R ?? ''}</td><td>{r.mem[ADDR_B] as number}</td><td>{r.mem[ADDR_A] as number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

