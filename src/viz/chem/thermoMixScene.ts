/**
 * Exercise 4, Ex. 6: a silver spoon in hot coffee. Temperature axis; each body moves from its start temperature to T_eq.
 * q_coffee = −q_spoon ⇒ T_eq = (m_c C_c T_c + m_s C_s T_s)/(m_c C_c + m_s C_s). 400 × 300.
 */
import type { Lang } from '../../i18n';
import { equilibriumTemp, heatSpecific } from '../../chem/thermo';
import { cbuilder, type CScene } from './cscene';

export const MIX = { coffee: { m: 180, Cs: 4.18, T: 95 }, spoonCs: 0.24, Tmin: 0, Tmax: 100, x0: 30, x1: 380 } as const;
const X = (T: number) => MIX.x0 + ((T - MIX.Tmin) / (MIX.Tmax - MIX.Tmin)) * (MIX.x1 - MIX.x0);
const fmt = (x: number, lang: Lang) => x.toFixed(1).replace('.', lang === 'de' ? '{,}' : '.');

export function mixScene(mSpoon: number, Ts: number, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const c = MIX.coffee;
  const Teq = equilibriumTemp([c, { m: mSpoon, Cs: MIX.spoonCs, T: Ts }]);
  const qc = heatSpecific(c.m, c.Cs, Teq - c.T), qs = heatSpecific(mSpoon, MIX.spoonCs, Teq - Ts);
  // axis
  b.line('axis', 'th-axis', [MIX.x0 - 8, 236], [MIX.x1 + 8, 236]);
  for (const T of [0, 20, 40, 60, 80, 100]) { b.line(`tk${T}`, 'th-l', [X(T), 232], [X(T), 240]); b.label(`tl${T}`, [X(T), 252], String(T), 'muted', 1, 'c', { small: true }); }
  b.label('unit', [MIX.x1 + 6, 292], String.raw`T\;(^\circ\mathrm{C})`, 'muted', 1, 'br', { small: true });
  // final temperature line
  b.line('eq', 'th-l-dash', [X(Teq), 70], [X(Teq), 236]);
  b.label('lab-eq', [X(Teq), 56], String.raw`T_\mathrm{eq} = ${fmt(Teq, lang)}\,^\circ\mathrm{C}`, 'fg', 1, 'c');
  // bodies
  const row = (key: string, y: number, T0: number, name: string, ink: string, cls: string) => {
    const a = X(Math.min(T0, Teq)), w = Math.abs(X(T0) - X(Teq));
    b.rect(`bar-${key}`, cls, a, y - 14, Math.max(w, 1.5), 28, 1, 4);
    b.circle(`dot-${key}`, 'th-s-fg', [X(T0), y], 5);
    b.arrow(`mv-${key}`, 'th-a-fg th-a-thin', [X(T0), y], [X(Teq), y], Math.abs(T0 - Teq) > 3 ? 1 : 0, 8);
    b.label(`n-${key}`, [X(T0), y - 26], name, ink, 1, T0 > 50 ? 'r' : 'l', { small: true });
  };
  row('c', 110, c.T, de ? String.raw`\text{Kaffee } 95\,^\circ\mathrm{C}` : String.raw`\text{coffee } 95\,^\circ\mathrm{C}`, 't', 'th-f-t');
  row('s', 176, Ts, de ? String.raw`\text{Löffel } ${Ts.toFixed(0)}\,^\circ\mathrm{C}` : String.raw`\text{spoon } ${Ts.toFixed(0)}\,^\circ\mathrm{C}`, 'p', 'th-f-p');
  return b.finish({ Teq, dTc: Teq - c.T, qc, qs });
}
