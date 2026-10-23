import { useEffect, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { FACES, PRESET_S, SQUARE, deformation, image, loadAt, shearDir } from '../../linalg/stress';
import type { V2 } from '../../linalg/plane2';
import { PArrow, PLabel, Path, Plot, Pt, Seg } from '../plot/Plot';
import { ColMatrix } from './ColMatrix12';
import { Presets, Slider } from './Controls12';

const t = String.raw;
const WIN = { x: [-2.2, 2.2] as const, y: [-1.9, 1.9] as const, w: 400, h: 349 };

/**
 * «Eine Matrix beschreibt eine Maschine» (Übung 1, slide 4; visualisation «Seven Machines, One Toolbox», scene «Mechanics II»):
 * a square under load, the deformation matrix F with live numbers, and the basis arrows e₁, e₂ that land on the columns of F.
 */
export function StressMachine() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState<number>(PRESET_S.shear);
  const [basis, setBasis] = useState(true);
  const [playing, setPlaying] = useState(false);
  const sRef = useRef(s);
  sRef.current = s;
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const next = sRef.current + (now - last) / 9000; // one sweep in about 9 s
      last = now;
      if (next >= 1) { setS(1); setPlaying(false); return; }
      setS(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const F = deformation(s), L = loadAt(s);
  const q = SQUARE.map((p) => image(F, p));
  const f3 = (x: number) => fmtNum(x, 3, lang, true);
  const e1 = image(F, [1, 0]), e2 = image(F, [0, 1]);
  const mode = s < 0.34 ? tr('einachsiger Zug', 'uniaxial tension') : s < 0.62 ? tr('zweiachsiger Zug', 'biaxial tension') : s < 0.995 ? tr('auf dem Weg zu reinem Schub', 'towards pure shear') : tr('reiner Schub', 'pure shear');
  const pick = (v: number) => { setPlaying(false); setS(v); };

  // load arrows: three on every face, pointing out of the face (tension) – their length is the size of the stress
  const arrows: { a: V2; b: V2; key: string }[] = [];
  FACES.forEach((f, fi) => {
    const A = image(F, f.a), B = image(F, f.b);
    const sd = shearDir(f);
    for (let k = 0; k < 3; k++) {
      const u = (k + 0.5) / 3, P: V2 = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u];
      const sn = f.normalLoad === 'sx' ? L.sx : L.sy;
      if (sn > 0.03) arrows.push({ key: `n${fi}${k}`, a: [P[0] + 0.08 * f.n[0], P[1] + 0.08 * f.n[1]], b: [P[0] + (0.08 + 0.55 * sn) * f.n[0], P[1] + (0.08 + 0.55 * sn) * f.n[1]] });
      if (L.tau > 0.03) {
        const c: V2 = [P[0] + 0.3 * f.n[0], P[1] + 0.3 * f.n[1]], h = 0.2 * L.tau;
        arrows.push({ key: `s${fi}${k}`, a: [c[0] - h * sd[0], c[1] - h * sd[1]], b: [c[0] + h * sd[0], c[1] + h * sd[1]] });
      }
    }
  });

  return (
    <figure className="vdemo l12-stress">
      <div className="vdemo-fig">
        <Plot x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} grid={[0, 0]} tick={[0, 0]} axes={['', '']}
          label={tr('Ein Quadrat unter Last verformt sich; die Pfeile e1 und e2 landen auf den Spalten der Matrix F',
            'A square under load deforms; the arrows e1 and e2 land on the columns of the matrix F')}>
          <Path pts={SQUARE} role="ref" closed dashed />
          <Path pts={q} role="aux" fill />
          <Path pts={q} role="fg" closed />
          {arrows.map((a) => <PArrow key={a.key} a={a.a} b={a.b} role="aux" head={8} />)}
          {basis && <>
            <Seg a={[0, 0]} b={[1, 0]} role="aux" dashed />
            <Seg a={[0, 0]} b={[0, 1]} role="aux" dashed />
            <PArrow a={[0, 0]} b={e1} role="c1" head={11} />
            <PArrow a={[0, 0]} b={e2} role="c2" head={11} />
            <Pt x={0} y={0} role="fg" r={3.5} />
            <PLabel x={0.6 * e1[0]} y={0.6 * e1[1]} dy={16} anchor="t" tex="F\,e_1" role="c1" />
            <PLabel x={0.6 * e2[0]} y={0.6 * e2[1]} dx={-9} anchor="r" tex="F\,e_2" role="c2" />
          </>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <Presets label={tr('Lastfall', 'Load case')} value={s === PRESET_S.uniaxial ? 'uni' : s === PRESET_S.biaxial ? 'bi' : s === PRESET_S.shear ? 'shear' : null}
          onPick={(id) => pick(id === 'uni' ? PRESET_S.uniaxial : id === 'bi' ? PRESET_S.biaxial : PRESET_S.shear)}
          items={[{ id: 'uni', label: tr('einachsig', 'uniaxial') }, { id: 'bi', label: tr('zweiachsig', 'biaxial') }, { id: 'shear', label: tr('reiner Schub', 'pure shear') }]} />
        <Slider label={tr('Last', 'Load')} min={0} max={1} step={0.005} value={s} onChange={pick} aria={tr('Last', 'Load')} show={Math.round(s * 100) + ' %'} />
        <div className="l12-row">
          <button type="button" className="motion-btn" onClick={() => { if (!playing && s >= 1) setS(0); setPlaying(!playing); }}>
            {playing ? tr('Anhalten', 'Pause') : tr('Last langsam steigern', 'Sweep the load')}
          </button>
          <label className="toggle"><input type="checkbox" checked={basis} onChange={(e) => setBasis(e.target.checked)} />{tr('Pfeile', 'Show arrows')} <M p=",">e_1</M> <M>e_2</M>{tr(' zeigen', '')}</label>
        </div>
        <div className="l12-state"><strong>{mode}</strong></div>
        <div className="l12-state"><M>{t`\sigma_x = ${fmtNum(L.sx, 2, lang, true)} \qquad \sigma_y = ${fmtNum(L.sy, 2, lang, true)} \qquad \tau = ${fmtNum(L.tau, 2, lang, true)}`}</M></div>
        <div className="l12-fmat">
          <M>F =</M>
          <ColMatrix label="F" cols={['c1', 'c2']} rows={[[f3(F[0][0]), f3(F[0][1])], [f3(F[1][0]), f3(F[1][1])]]} />
        </div>
        <p className="vdemo-note">{tr(
          <>Grün: Spalte 1 von <M p=",">F</M> das Bild <M>{t`F\,e_1`}</M> von <M p=".">e_1</M> Blau: Spalte 2, das Bild <M p=".">{t`F\,e_2`}</M> Gestrichelt: das Quadrat ohne Last. Die Verformung ist <M>{t`\times 40`}</M> übertrieben, wie in der Visualisierung.</>,
          <>Green: column 1 of <M p=",">F</M> the image <M>{t`F\,e_1`}</M> of <M p=".">e_1</M> Blue: column 2, the image <M p=".">{t`F\,e_2`}</M> Dashed: the square without load. The deformation is exaggerated <M p=",">{t`\times 40`}</M> as in the visualisation.</>)}</p>
      </figcaption>
    </figure>
  );
}
