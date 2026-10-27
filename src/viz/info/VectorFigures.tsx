import { useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import type { ElemView } from '../../info/cpp/interp';
import { sieveRounds } from '../../info/sieve';
import { NumSlider } from './InfoControls';

const t = String.raw;

/** The elements of a vector as boxes with their indices above (nested vectors become rows of rows). */
export function VecCells({ elems, nested = false }: { elems: ElemView[]; nested?: boolean }) {
  const tr = useTr();
  if (elems.length === 0) return <span className="tr-empty">{tr('leer', 'empty')}</span>;
  return (
    <span className={`vc${nested ? ' vc-nested' : ''}`}>
      {elems.map((e, i) => (
        <span key={i} className={`vc-cell${e.changed ? ' chg' : ''}${e.value === 'true' ? ' vc-t' : ''}${e.value === 'false' ? ' vc-f' : ''}`}>
          <span className="vc-i">{i}</span>
          {e.sub ? <span className="vc-sub"><VecCells elems={e.sub} nested /></span> : <span className="vc-v"><code>{e.value}</code></span>}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ random access (notes Example 7.3) */

/** vec[i] lives at address p + s·i: pick the size of the elements and the index. */
export function MemoryStrip() {
  const tr = useTr();
  const [s, setS] = useState(4);
  const [i, setI] = useState(2);
  const n = 6, p = 1000;
  const W = 520, cw = Math.min(70, (W - 20) / n);
  return (
    <figure className="vdemo ms-fig">
      <div className="v-presets" role="group" aria-label={tr('Grösse eines Elements in Bytes', 'Size of one element in bytes')}>
        <span className="tr-inl">{tr('Typ:', 'Type:')}</span>
        {([[1, 'char'], [4, 'int'], [8, 'double']] as const).map(([sz, name]) => <button type="button" key={sz} aria-pressed={sz === s} onClick={() => setS(sz)}><code>{name}</code> ({sz} B)</button>)}
      </div>
      <svg viewBox={`0 0 ${W} 150`} className="ms-svg" role="img" aria-label={tr('Ein Vektor im Speicher', 'A vector in memory')}>
        {Array.from({ length: n }, (_, k) => (
          <g key={k}>
            <rect x={10 + k * cw} y={44} width={cw} height={44} className={k === i ? 'ms-cell on' : 'ms-cell'} onClick={() => setI(k)} />
            <text x={10 + k * cw + cw / 2} y={72} textAnchor="middle" className="ms-t">{`v[${k}]`}</text>
            <text x={10 + k * cw + 3} y={106} className="ms-addr">{p + s * k}</text>
          </g>
        ))}
        <text x={10} y={26} className="ms-lab">{tr('Adresse (in Bytes)', 'address (in bytes)')}</text>
        <text x={10 + i * cw + cw / 2} y={132} textAnchor="middle" className="ms-hi">{`p + s·i = ${p} + ${s}·${i} = ${p + s * i}`}</text>
      </svg>
      <NumSlider label={<code>i</code>} min={0} max={n - 1} value={i} onChange={setI} aria={tr('Index', 'Index')} />
      <p className="ms-say">
        {tr('Die Adresse von ', 'The address of ')}<code>v[{i}]</code>{tr(' ist die Startadresse plus ', ' is the start address plus ')}<code>{i}</code>{tr(' mal die Grösse eines Elements: ', ' times the size of one element: ')}
        <M p=".">{t`p + s \cdot i = ${p} + ${s} \cdot ${i} = ${p + s * i}`}</M>
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------------ nested vectors (notes Figure 7.1) */

/** The table in our head and the strip of cells in a row-by-row picture of memory. */
export function MatrixLayout() {
  const tr = useTr();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);
  const [i, setI] = useState(1);
  const [j, setJ] = useState(2);
  const ii = Math.min(i, rows - 1), jj = Math.min(j, cols - 1);
  const flat = ii * cols + jj;
  return (
    <figure className="vdemo ml-fig">
      <div className="ml-grid-wrap">
        <div className="ml-lab">{tr('So denken wir: eine Tabelle', 'How we think of it: a table')}</div>
        <table className="ml-grid" aria-label={tr('Tabelle', 'table')}>
          <thead><tr><th></th>{Array.from({ length: cols }, (_, c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <th>{r}</th>
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c} className={r === ii && c === jj ? 'on' : ''} onClick={() => { setI(r); setJ(c); }}><code>m[{r}][{c}]</code></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-lab">{tr('So kann man es sich im Speicher vorstellen: Zeile für Zeile', 'How one can picture it in memory: row after row')}</div>
        <div className="ml-flat" aria-label={tr('Speicher', 'memory')}>
          {Array.from({ length: rows * cols }, (_, k) => (
            <span key={k} className={`ml-c${k === flat ? ' on' : ''}${k % cols === 0 && k > 0 ? ' rowstart' : ''}`}>
              <code>m[{Math.floor(k / cols)}][{k % cols}]</code>
            </span>
          ))}
        </div>
      </div>
      <div className="ml-sl">
        <NumSlider label={tr('Zeilen', 'rows')} min={1} max={4} value={rows} onChange={setRows} aria={tr('Zeilen', 'rows')} />
        <NumSlider label={tr('Spalten', 'columns')} min={1} max={5} value={cols} onChange={setCols} aria={tr('Spalten', 'columns')} />
      </div>
      <p className="ms-say">
        <code>m[{ii}][{jj}]</code>{tr(' liegt an Position ', ' lies at position ')}<M>{t`i \cdot ${cols} + j = ${ii} \cdot ${cols} + ${jj} = ${flat}`}</M>{tr(' im Streifen.', ' in the strip.')}
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------------ the Sieve of Eratosthenes (notes p. 97) */

/** The numbers 2 … n-1; each step finds the next prime and crosses out its multiples. */
export function SieveGrid() {
  const tr = useTr();
  const [n, setN] = useState(30);
  const [step, setStep] = useState(0);
  const rounds = sieveRounds(n);
  const done = Math.min(step, rounds.length);
  const crossedBy = new Map<number, number>();
  const primes = new Set<number>();
  rounds.slice(0, done).forEach((r) => { primes.add(r.prime); r.fresh.forEach((m) => crossedBy.set(m, r.prime)); });
  const cur = done > 0 ? rounds[done - 1] : undefined;
  const nums = Array.from({ length: Math.max(n - 2, 0) }, (_, k) => k + 2);
  const finished = done === rounds.length;
  return (
    <figure className="vdemo sv-fig">
      <div className="sv-grid" role="img" aria-label={tr('Die Zahlen ab 2 und ihre Streichung', 'The numbers from 2 on and how they are crossed out')}>
        {nums.map((m) => {
          const isCur = cur !== undefined && (m === cur.prime || cur.fresh.includes(m));
          const cls = crossedBy.has(m) ? 'x' : primes.has(m) ? 'p' : '';
          return <span key={m} className={`sv-n ${cls}${isCur ? ' cur' : ''}`}>{m}</span>;
        })}
      </div>
      <div className="bx-say" aria-live="polite">
        {done === 0 && <>{tr('Noch ist keine Zahl gestrichen. Die kleinste ungestrichene Zahl ist prim.', 'No number has been crossed out yet. The smallest number not crossed out is prime.')}</>}
        {cur && !finished && <>{tr('Die kleinste ungestrichene Zahl ist ', 'The smallest number not crossed out is ')}<b>{cur.prime}</b>{tr(': prim. Gestrichen werden ', ': prime. Crossed out now: ')}{cur.fresh.length ? cur.fresh.join(', ') : tr('nichts Neues', 'nothing new')}{tr('.', '.')}</>}
        {cur && finished && <>{tr('Fertig: Alle Zahlen, die nicht gestrichen sind, sind prim: ', 'Done: all numbers that are not crossed out are prime: ')}<b>{rounds.map((r) => r.prime).join(', ')}</b>.</>}
      </div>
      <div className="in-controls">
        <button type="button" className="motion-btn primary" disabled={finished} onClick={() => setStep((k) => k + 1)}>{tr('Nächste Primzahl', 'Next prime')} ›</button>
        <button type="button" className="motion-btn" onClick={() => setStep(0)}>↺</button>
        <span className="sv-n-sl"><NumSlider label={<code>n</code>} min={10} max={60} value={n} onChange={(v) => { setN(v); setStep(0); }} aria={tr('n', 'n')} /></span>
      </div>
    </figure>
  );
}
