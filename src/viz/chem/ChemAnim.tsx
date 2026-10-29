import { useMemo } from 'react';
import { M } from '../../components/Tex';
import { useLang, type Lang } from '../../i18n';
import { H, W, type CScene, type P2 } from './scene';
import './chem.css';

const pts = (ps: P2[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Renders a pure chemistry scene (SVG shapes + KaTeX labels in % of the figure); `scene.data` becomes data-* attributes for tests. */
export function ChemAnim({ build, step, t }: { build: (step: number, t: number, lang: Lang) => CScene; step: number; t: number }) {
  const lang = useLang();
  const scene = useMemo(() => build(step, t, lang), [build, step, t, lang]);
  const data = Object.fromEntries(Object.entries(scene.data).map(([k, v]) => [`data-${k.toLowerCase()}`, v.toFixed(4)]));
  return (
    <div className="anim-fig chem-anim" {...data}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {scene.shapes.map((s) => {
          const o = s.o ?? 1;
          const cls = `c ${s.cls}`;
          switch (s.kind) {
            case 'line': return <line key={s.key} className={cls} x1={s.pts[0][0]} y1={s.pts[0][1]} x2={s.pts[1][0]} y2={s.pts[1][1]} opacity={o} />;
            case 'polyline': return <polyline key={s.key} className={cls} points={pts(s.pts)} opacity={o} />;
            case 'polygon': return <polygon key={s.key} className={cls} points={pts(s.pts)} opacity={o} />;
            case 'circle': return <circle key={s.key} className={cls} cx={s.pts[0][0]} cy={s.pts[0][1]} r={s.r ?? 4} opacity={o} />;
          }
        })}
      </svg>
      {scene.labels.map((l) => (
        <div key={l.key} className={`anim-label ink-${l.ink}${l.box ? ' abox' : ''}`} data-anchor={l.anchor} data-key={l.key}
          style={{ left: `${(l.at[0] / W) * 100}%`, top: `${(l.at[1] / H) * 100}%`, opacity: l.o }}>
          {l.rows ? l.rows.map((r, k) => <div key={k} className={`row ink-${r.ink}`}><M>{r.tex}</M></div>) : <M>{l.tex}</M>}
        </div>
      ))}
    </div>
  );
}
