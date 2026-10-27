import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { caesar, mod, shiftChar, utf8 } from '../../info/text';
import { NumSlider } from './InfoControls';

const t = String.raw;
const bin = (n: number, w: number) => n.toString(2).padStart(w, '0');
const glyph = (c: number) => (c === 32 ? '␣' : String.fromCharCode(c));
const kind = (c: number) => (c >= 65 && c <= 90 ? 'up' : c >= 97 && c <= 122 ? 'lo' : c >= 48 && c <= 57 ? 'di' : 'ot');

/** The ASCII table: 95 printable characters (32 … 126), click one to see its code in decimal, binary and hex. */
export function AsciiTable() {
  const tr = useTr();
  const [sel, setSel] = useState(65);
  const partner = kind(sel) === 'up' ? sel + 32 : kind(sel) === 'lo' ? sel - 32 : null;
  return (
    <figure className="vdemo asc-fig">
      <div className="asc-grid" role="grid" aria-label={tr('ASCII-Tabelle', 'ASCII table')}>
        <span className="asc-row">
          <span className="asc-h" />
          {Array.from({ length: 16 }, (_, c) => <code key={c} className="asc-h">{c.toString(16).toUpperCase()}</code>)}
        </span>
        {Array.from({ length: 6 }, (_, r) => (
          <span key={r} className="asc-row">
            <code className="asc-h">{(r + 2).toString(16)}</code>
            {Array.from({ length: 16 }, (_, c) => {
              const code = (r + 2) * 16 + c;
              if (code > 126) return <span key={c} className="asc-c asc-void" />;
              return (
                <button key={c} type="button" className={`asc-c asc-${kind(code)}${code === sel ? ' on' : ''}`} onClick={() => setSel(code)} aria-label={`${code}`}>
                  <code className="asc-g">{glyph(code)}</code><span className="asc-n">{code}</span>
                </button>
              );
            })}
          </span>
        ))}
      </div>
      <div className="asc-legend">
        <span className="asc-lg asc-di">{tr('Ziffern 48–57', 'digits 48–57')}</span>
        <span className="asc-lg asc-up">{tr('Grossbuchstaben 65–90', 'capital letters 65–90')}</span>
        <span className="asc-lg asc-lo">{tr('Kleinbuchstaben 97–122', 'lowercase letters 97–122')}</span>
      </div>
      <div className="bx-say" aria-live="polite">
        <code className="asc-big">{sel === 32 ? tr('Leerzeichen', 'blank') : `'${String.fromCharCode(sel)}'`}</code>{' '}
        {tr('hat den Code', 'has the code')} <b>{sel}</b> = <code>{bin(sel, 8)}</code><sub>2</sub> = <code>0x{sel.toString(16)}</code>.
        {partner !== null && <> {tr('Derselbe Buchstabe als ', 'The same letter as ')}{kind(sel) === 'up' ? tr('Kleinbuchstabe', 'lowercase') : tr('Grossbuchstabe', 'capital')}: <code>'{String.fromCharCode(partner)}'</code> = <b>{partner}</b> = <code>{bin(partner, 8)}</code><sub>2</sub>. {tr('Der Unterschied ist genau 32: ein einziges Bit.', 'The difference is exactly 32: a single bit.')}</>}
      </div>
    </figure>
  );
}

/** The Caesar cipher as a wheel: the inner ring is the outer ring shifted by s. */
export function CaesarWheel() {
  const tr = useTr();
  const [s, setS] = useState(3);
  const [text, setText] = useState('Hello, World!');
  const [pick, setPick] = useState(0);
  const N = 95, R1 = 150, R2 = 122, C = 170;
  const first = text.length ? text.charCodeAt(Math.min(pick, text.length - 1)) : 72;
  const ch = first >= 32 && first <= 126 ? first : 72;
  const out = useMemo(() => caesar(text, s), [text, s]);
  const pos = (k: number, r: number) => { const a = (2 * Math.PI * k) / N - Math.PI / 2; return [C + r * Math.cos(a), C + r * Math.sin(a)] as const; };
  return (
    <figure className="vdemo cw-fig">
      <svg viewBox={`0 0 ${2 * C} ${2 * C}`} className="cw-svg" role="img" aria-label={tr('Caesar-Rad', 'Caesar wheel')}>
        {Array.from({ length: N }, (_, k) => {
          const [x1, y1] = pos(k, R1), [x2, y2] = pos(k, R2);
          const code = 32 + k, cipher = shiftChar(code, s);
          const on = code === ch;
          return (
            <g key={k}>
              <text x={x1} y={y1} textAnchor="middle" dominantBaseline="central" className={`cw-o${on ? ' on' : ''}`}>{glyph(code)}</text>
              <text x={x2} y={y2} textAnchor="middle" dominantBaseline="central" className={`cw-i${on ? ' on' : ''}`}>{glyph(cipher)}</text>
            </g>
          );
        })}
        <text x={C} y={C - 8} textAnchor="middle" className="cw-mid">{tr('aussen: Klartext', 'outside: plain text')}</text>
        <text x={C} y={C + 10} textAnchor="middle" className="cw-mid">{tr('innen: Chiffre', 'inside: cipher')}</text>
      </svg>
      <div className="cw-side">
        <NumSlider label={<code>s</code>} min={-30} max={30} value={s} onChange={setS} aria={tr('Verschiebung', 'Shift')} />
        <label className="cw-in">
          <span>{tr('Text', 'Text')}</span>
          <input type="text" value={text} maxLength={40} onChange={(e) => { setText(e.target.value); setPick(0); }} aria-label={tr('Text', 'Text')} />
        </label>
        <div className="cw-out"><span>{tr('Chiffre', 'Cipher')}</span><code>{out}</code></div>
        <div className="cw-pick" role="group" aria-label={tr('Zeichen wählen', 'Choose a character')}>
          {Array.from(text).slice(0, 40).map((c, i) => <button type="button" key={i} aria-pressed={i === pick} onClick={() => setPick(i)}><code>{c === ' ' ? '␣' : c}</code></button>)}
        </div>
        <p className="cw-say">
          <code>'{String.fromCharCode(ch)}'</code> = {ch}{tr(' wird zu ', ' becomes ')}<M p=",">{t`(${ch} - 32 ${s < 0 ? '-' : '+'} ${Math.abs(s)}) \bmod 95 + 32 = ${shiftChar(ch, s)}`}</M>{tr(' also ', ' i.e. ')}<code>'{String.fromCharCode(shiftChar(ch, s))}'</code>.
          {ch - 32 + s < 0 && <> {tr('Ohne die Korrektur um 95 wäre der Rest hier negativ: ', 'Without the correction by 95 the remainder would be negative here: ')}<code>{(ch - 32 + s) % 95}</code>{tr(' statt ', ' instead of ')}<code>{mod(ch - 32 + s, 95)}</code>.</>}
        </p>
      </div>
    </figure>
  );
}

/** UTF-8: how a code point is distributed over the pattern of 1 to 4 bytes. */
export function Utf8Figure() {
  const tr = useTr();
  const presets = ['A', 'ä', '€', '😀'];
  const [text, setText] = useState('ä');
  const cp = Array.from(text)[0]?.codePointAt(0) ?? 65;
  const u = utf8(cp);
  return (
    <figure className="vdemo u8-fig">
      <div className="v-presets" role="group" aria-label={tr('Zeichen', 'Character')}>
        {presets.map((p) => <button type="button" key={p} aria-pressed={p === text} onClick={() => setText(p)}><code>{p}</code></button>)}
        <label className="u8-in"><span>{tr('eigenes Zeichen', 'own character')}</span><input type="text" value={text} maxLength={2} onChange={(e) => setText(e.target.value || 'A')} aria-label={tr('eigenes Zeichen', 'own character')} /></label>
      </div>
      <div className="u8-row">
        <div className="u8-cp"><span>{tr('Code Point', 'code point')}</span><code>U+{cp.toString(16).toUpperCase().padStart(4, '0')}</code><small>{cp} = <code>{bin(cp, Math.max(8, u.usable))}</code></small></div>
        <div className="u8-bytes" aria-label={tr('Bytes', 'bytes')}>
          {u.template.map((tp, i) => (
            <div key={i} className="u8-byte">
              <code className="u8-tpl">{Array.from(tp).map((b, k) => <span key={k} className={b === 'x' ? 'x' : 'f'}>{b}</span>)}</code>
              <code className="u8-val">{bin(u.bytes[i], 8).split('').map((b, k) => <span key={k} className={tp[k] === 'x' ? 'x' : 'f'}>{b}</span>)}</code>
              <small>0x{u.bytes[i].toString(16).toUpperCase()}</small>
            </div>
          ))}
        </div>
      </div>
      <p className="u8-say">
        {tr('Dieses Zeichen braucht ', 'This character needs ')}<b>{u.bytes.length}</b>{tr(u.bytes.length === 1 ? ' Byte' : ' Bytes', u.bytes.length === 1 ? ' byte' : ' bytes')}{tr(' (bis zu ', ' (up to ')}{u.usable}{tr(' nutzbare Bits). Die ', ' usable bits). The ')}<span className="u8-key f">{tr('festen Bits', 'fixed bits')}</span>{tr(' zeigen die Länge und die Fortsetzung an, die ', ' show the length and the continuation, the ')}<span className="u8-key x">{tr('freien Bits', 'free bits')}</span>{tr(' tragen die Nummer des Zeichens.', ' carry the number of the character.')}
      </p>
    </figure>
  );
}
