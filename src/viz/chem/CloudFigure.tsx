import { useMemo, useState } from 'react';
import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { cloudPoints, cloudRadius } from '../../chem/light';
import './gasfig.css';
import './lightfig.css';

const t = String.raw;
const U = 46; // px per radius of the n = 1 orbit

/**
 * Slide 12 and exercise 6.4: the same hydrogen atom twice. Left Bohr's orbit with a definite path. Right what quantum
 * mechanics says: every «snapshot» of the electron is a dot at a place we could find it; together the dots form a cloud, and
 * the dashed circle holds 90 % of them. The slider adds snapshots one by one.
 */
export function CloudFigure() {
  const tr = useTr();
  const [n, setN] = useState(60);
  const pts = useMemo(() => cloudPoints(1500, 7), []);
  const r90 = cloudRadius(0.9);
  const inside = pts.slice(0, n).filter((p) => p[2] <= r90).length;
  return (
    <figure className="vdemo lightfig cf">
      <div className="cf-grid">
        <div className="cf-panel">
          <svg viewBox="-150 -150 300 300" role="img" aria-label={tr('Bohr: Bahn mit festem Weg', 'Bohr: orbit with a definite path')}>
            <circle className="cf-orbit" cx={0} cy={0} r={U} />
            <circle className="cf-nuc" cx={0} cy={0} r={5} />
            <circle className="cf-e" cx={U * Math.cos(-0.8)} cy={U * Math.sin(-0.8)} r={6} />
          </svg>
          <div className="cf-t">{tr('Bohr: eine feste Bahn', 'Bohr: a fixed orbit')}</div>
        </div>
        <div className="cf-panel">
          <svg viewBox="-150 -150 300 300" role="img" aria-label={tr('Quantenmechanik: Wolke aus möglichen Orten des Elektrons', 'Quantum mechanics: a cloud of possible places of the electron')}>
            <circle className="cf-90" cx={0} cy={0} r={r90 * U} />
            {pts.slice(0, n).map((p, i) => <circle key={i} className="cf-dot" cx={p[0] * U} cy={p[1] * U} r={2} />)}
            <circle className="cf-nuc" cx={0} cy={0} r={5} />
          </svg>
          <div className="cf-t">{tr('Quantenmechanik: Elektronenwolke', 'Quantum mechanics: electron cloud')}</div>
        </div>
      </div>
      <label className="slider cf-s"><span>{tr('Punkte', 'Dots')}</span>
        <input type="range" min={1} max={1500} step={1} value={n} aria-label={tr('Anzahl Momentaufnahmen', 'Number of snapshots')} onChange={(e) => setN(+e.target.value)} />
        <span className="val">{n}</span></label>
      <div className="gb-row cf-r">
        <span>{tr('Davon innerhalb der gestrichelten Linie', 'Of these inside the dashed line')}</span>
        <b><M>{t`${inside}\ /\ ${n}\ =\ ${Math.round((100 * inside) / n)}\,\%`}</M></b>
      </div>
      <div className="cf-note">{tr('Jeder Punkt ist ein möglicher Fundort des Elektrons. Die Linie umschliesst etwa 90 % davon (Übung 6, S. 5). Einheit: der Radius der Bohr-Bahn ', 'Each dot is a possible place to find the electron. The line encloses about 90 % of them (exercise 6, p. 5). Unit: the radius of the Bohr orbit ')}<M p=".">{t`n=1`}</M></div>
    </figure>
  );
}
