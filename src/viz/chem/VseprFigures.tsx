import { useRef, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import { domainAngles, GEOM_NAME, REAL_ANGLES, maxLonePairs, shape, type Domains } from '../../chem/vsepr';
import { SceneFig, ThChips } from './ChemFig';
import { VIEW0, moleculeScene, processScene, removeScene, type ViewAng } from './vseprScene';
import './bonding.css';

const t = String.raw;

/** Pick the number of electron domains and lone pairs; drag to turn the molecule (slides 28–32, exercise 7 p. 13). */
export function VseprExplorer({ initial = [4, 1] as [Domains, number] }: { initial?: [Domains, number] }) {
  const tr = useTr(), lang = useLang();
  const [n, setN] = useState<Domains>(initial[0]);
  const [lp, setLp] = useState(initial[1]);
  const [view, setView] = useState<ViewAng>(VIEW0);
  const [ghost, setGhost] = useState(true);
  const drag = useRef<{ x: number; y: number; v: ViewAng } | null>(null);
  const lpOk = Math.min(lp, maxLonePairs(n));
  const sh = shape(n, lpOk);
  const name = (g: keyof typeof GEOM_NAME) => GEOM_NAME[g][lang === 'de' ? 0 : 1];
  return (
    <figure className="vdemo vs-fig">
      <div className="vdemo-fig">
        <SceneFig scene={moleculeScene(n, lpOk, view, ghost, true, lang)} draggable
          label={tr(`Molekül mit ${n} Elektronendomänen, davon ${lpOk} freie Paare; ziehen dreht es`, `Molecule with ${n} electron domains, ${lpOk} of them lone pairs; drag to turn it`)}
          onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, v: view }; }}
          onPointerMove={(e) => { const d = drag.current; if (!d) return; setView({ yaw: d.v.yaw + (e.clientX - d.x) * 0.012, pitch: Math.max(-1.4, Math.min(1.4, d.v.pitch + (e.clientY - d.y) * 0.012)) }); }}
          onPointerUp={() => { drag.current = null; }} />
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Elektronendomänen', 'Electron domains')} value={String(n)} onPick={(k) => { const m = Number(k) as Domains; setN(m); setLp(Math.min(lp, maxLonePairs(m))); }}
          items={[2, 3, 4, 5, 6].map((k) => ({ id: String(k), label: <>{k} <T de="Domänen" en="domains" /></> }))} />
        <ThChips label={tr('Freie Elektronenpaare', 'Lone pairs')} value={String(lpOk)} onPick={(k) => setLp(Number(k))}
          items={Array.from({ length: maxLonePairs(n) + 1 }, (_, k) => ({ id: String(k), label: <>{k} <T de={k === 1 ? 'freies Paar' : 'freie Paare'} en={k === 1 ? 'lone pair' : 'lone pairs'} /></> }))} />
        <dl className="vs-names">
          <dt><T de="Elektronendomänen-Geometrie" en="Electron-domain geometry" /></dt><dd>{name(sh.domainGeom)}</dd>
          <dt><T de="ideale Winkel" en="ideal angles" /></dt><dd><M>{domainAngles(n, lang)}</M></dd>
          <dt><T de="Molekülgeometrie" en="Molecular geometry" /></dt><dd><b>{name(sh.molGeom)}</b></dd>
          <dt><T de="Beispiel" en="Example" /></dt><dd><C>{sh.example}</C></dd>
        </dl>
        <label className="toggle"><input type="checkbox" checked={ghost} onChange={(e) => setGhost(e.target.checked)} /> <T de="Polyeder der Elektronendomänen zeigen" en="Show the polyhedron of the electron domains" /></label>
        <button type="button" className="motion-btn" onClick={() => setView(VIEW0)}><T de="Ansicht zurücksetzen" en="Reset view" /></button>
        <p className="vdemo-note"><T
          de={<>Ziehe am Bild, um das Molekül zu drehen. Grüne Kugeln sind Atome, blaue Keulen freie Elektronenpaare. Die Geometrie der Elektronendomänen zählt beide; die Molekülgeometrie sieht nur die Atome.{n === 5 && lpOk > 0 ? <> Die freien Paare sitzen am Äquator: Dort haben sie am meisten Platz (nur zwei Nachbarn im 90°-Abstand statt drei).</> : null}{n === 6 && lpOk === 2 ? <> Zwei freie Paare liegen einander gegenüber, so weit auseinander wie möglich.</> : null}</>}
          en={<>Drag the picture to turn the molecule. Green balls are atoms, blue lobes lone pairs. The electron-domain geometry counts both; the molecular geometry sees only the atoms.{n === 5 && lpOk > 0 ? <> The lone pairs sit on the equator: there they have most room (only two neighbours at 90° instead of three).</> : null}{n === 6 && lpOk === 2 ? <> Two lone pairs lie opposite each other, as far apart as possible.</> : null}</>} /></p>
      </figcaption>
    </figure>
  );
}

export function RemoveFig({ step, t: tt }: { step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  return <SceneFig scene={removeScene(step, tt, lang)} label={tr('Tetraeder: Atome werden durch freie Paare ersetzt', 'Tetrahedron: atoms are replaced by lone pairs')} />;
}
export function ProcessFig({ step, t: tt }: { step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  return <SceneFig scene={processScene(step, tt, lang)} label={tr('NH3: von der Lewis-Struktur zur Molekülgeometrie', 'NH3: from the Lewis structure to the molecular geometry')} />;
}

/** Slide 30: lone pairs and multiple bonds take up more space — real angles next to the ideal 109.5° / 120°. */
export function AngleSqueeze() {
  const tr = useTr(), lang = useLang();
  const dec = (x: number) => (lang === 'de' ? String(x).replace('.', ',') : String(x));
  const panel = (k: number, el: string, ang: number, lps: number, ideal: number) => {
    const cx = 70 + k * 135, cy = 70, L = 58;
    const a = ((ang / 2) * Math.PI) / 180, ai = ((ideal / 2) * Math.PI) / 180;
    const p1: [number, number] = [cx - L * Math.sin(a), cy + L * Math.cos(a)], p2: [number, number] = [cx + L * Math.sin(a), cy + L * Math.cos(a)];
    const i1: [number, number] = [cx - L * Math.sin(ai), cy + L * Math.cos(ai)], i2: [number, number] = [cx + L * Math.sin(ai), cy + L * Math.cos(ai)];
    const r = 24;
    const arc = `M ${cx - r * Math.sin(a)} ${cy + r * Math.cos(a)} A ${r} ${r} 0 0 0 ${cx + r * Math.sin(a)} ${cy + r * Math.cos(a)} L ${cx} ${cy} Z`;
    return (
      <g key={el}>
        <line x1={cx} y1={cy} x2={i1[0]} y2={i1[1]} className="sq-ideal" /><line x1={cx} y1={cy} x2={i2[0]} y2={i2[1]} className="sq-ideal" />
        <path d={arc} className="sq-wedge" />
        <line x1={cx} y1={cy} x2={p1[0]} y2={p1[1]} className="sq-bond" /><line x1={cx} y1={cy} x2={p2[0]} y2={p2[1]} className="sq-bond" />
        {Array.from({ length: lps }, (_, j) => {
          const dir = lps === 1 ? 0 : j === 0 ? -0.45 : 0.45;
          const ex = cx + Math.sin(dir) * 30, ey = cy - Math.cos(dir) * 30;
          return <ellipse key={j} cx={ex} cy={ey} rx={9} ry={17} transform={`rotate(${(dir * 180) / Math.PI} ${ex} ${ey})`} className="sq-lobe" />;
        })}
        <circle cx={cx} cy={cy} r={13} fill="var(--paper)" stroke="var(--fg)" strokeWidth={1} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="sq-sym">{el}</text>
        <text x={p1[0] - 6} y={p1[1] + 8} textAnchor="middle" className="sq-sym">H</text>
        <text x={p2[0] + 6} y={p2[1] + 8} textAnchor="middle" className="sq-sym">H</text>
        <text x={cx} y={cy + 44} textAnchor="middle" className="sq-val">{dec(ang)}°</text>
      </g>
    );
  };
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg className="sq-svg" viewBox="0 0 420 160" role="img" aria-label={tr('Bindungswinkel in CH4, NH3 und H2O', 'Bond angles in CH4, NH3 and H2O')}>
          {panel(0, 'C', REAL_ANGLES.CH4, 0, 109.5)}
          {panel(1, 'N', REAL_ANGLES.NH3, 1, 109.5)}
          {panel(2, 'O', REAL_ANGLES.H2O, 2, 109.5)}
        </svg>
      </div>
      <figcaption className="vdemo-readout">
        <p className="vdemo-note"><T
          de={<>Alle drei haben vier Elektronendomänen. Gestrichelt der ideale Tetraederwinkel <M p=".">{t`109{,}5^\circ`}</M> Jedes freie Paar braucht mehr Platz als eine Bindung und drückt die H-Atome zusammen: <M p=",">{t`109{,}5^\circ`}</M> <M p=",">{t`107^\circ`}</M> <M p=".">{t`104{,}5^\circ`}</M> (Gezeichnet ist der Winkel H–X–H in der Ebene der beiden H.)</>}
          en={<>All three have four electron domains. Dashed: the ideal tetrahedral angle <M p=".">{t`109.5^\circ`}</M> Every lone pair needs more room than a bond and pushes the H atoms together: <M p=",">{t`109.5^\circ`}</M> <M p=",">{t`107^\circ`}</M> <M p=".">{t`104.5^\circ`}</M> (Drawn is the angle H–X–H in the plane of the two H.)</>} /></p>
      </figcaption>
    </figure>
  );
}
