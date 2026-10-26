import { useState } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { PATCH, patchArea, patchDensity } from '../../physics/distributed';
import { KArrow, KL, KSlider, fmtSig, type ViewBox } from './k34Common';

const t = String.raw;
const VB: ViewBox = [0, 0, 600, 330];
const CX = 230, TOP = 250, PX_PER_CM = 18; // contact centre, ground level, scale of the contact width

/**
 * Fig. 4.8 (a): one force F pressing on a support over a contact strip. The strip is 10 cm long and w wide; you choose w.
 * The arrow F stays the same — the density s = F/A on the right grows when the strip gets narrower.
 */
export function PatchFigure() {
  const tr = useTr(), lang = useLang();
  const [w, setW] = useState(10);
  const [dist, setDist] = useState(true);
  const wm = w / 100;                                    // m
  const A = patchArea(wm), s = patchDensity(wm);         // m², N/m²
  const wpx = w * PX_PER_CM;
  const barMax = 700e3;                                  // N/m² at the top of the scale
  const barH = Math.max(3, (s / barMax) * 215);
  const BX = 470, BASE = 300;
  const presets = [{ de: 'Schuhsohle', en: 'shoe sole', w: 10 }, { de: 'breiter Absatz', en: 'broad heel', w: 4 }, { de: 'schmaler Absatz', en: 'narrow heel', w: 1 }];
  const fx = (x: number, d = 3) => fmtSig(x, d, lang);
  return (
    <figure className="kf">
      <div className="kf-patch-row" role="group" aria-label={tr('Breite der Auflage', 'width of the contact')}>
        {presets.map((p) => <button key={p.en} type="button" className="kf-chip small" aria-pressed={w === p.w} onClick={() => setW(p.w)}>{tr(p.de, p.en)}</button>)}
      </div>
      <div className="kf-fig" style={{ maxWidth: 700 }}>
        <svg viewBox={VB.join(' ')} role="img" aria-label={tr('Dieselbe Kraft auf eine schmalere Auflagefläche: die Dichte wächst', 'The same force on a narrower contact: the density grows')}>
          {/* support (ground) */}
          <rect className="kf-body" x={20} y={TOP} width={420} height={62} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((k) => <line key={k} className="kf-ground" x1={28 + k * 21} y1={TOP + 62} x2={14 + k * 21} y2={TOP + 76} opacity={0.6} />)}
          {/* the body that presses: block with a tapered foot */}
          <polygon className="kf-body in" points={`${CX - 150},${TOP - 100} ${CX + 150},${TOP - 100} ${CX + 150},${TOP - 40} ${CX + wpx / 2},${TOP} ${CX - wpx / 2},${TOP} ${CX - 150},${TOP - 40}`} />
          {/* the contact strip: the real distribution (hatched strip as in Fig. 4.8) */}
          {dist && (
            <g>
              <rect className="kf-press" x={CX - wpx / 2} y={TOP - 7} width={wpx} height={14} />
              {Array.from({ length: Math.max(3, Math.round(wpx / 9)) }, (_, i) => {
                const x = CX - wpx / 2 + ((i + 0.5) * wpx) / Math.max(3, Math.round(wpx / 9));
                return <line key={i} className="kf-press-line" x1={x} y1={TOP - 7} x2={x} y2={TOP + 7} />;
              })}
              {/* width dimension */}
              <line className="kf-dim" x1={CX - wpx / 2} y1={TOP + 30} x2={CX + wpx / 2} y2={TOP + 30} />
              <line className="kf-dim" x1={CX - wpx / 2} y1={TOP + 24} x2={CX - wpx / 2} y2={TOP + 36} />
              <line className="kf-dim" x1={CX + wpx / 2} y1={TOP + 24} x2={CX + wpx / 2} y2={TOP + 36} />
            </g>
          )}
          {!dist && <circle className="kf-dot" cx={CX} cy={TOP} r={5} />}
          {/* the single arrow: always the same */}
          <KArrow a={[CX, 34]} b={[CX, TOP - 100]} kind="out" w={4.5} head={15} />
          {/* density scale */}
          <line className="kf-axis" x1={BX - 24} y1={BASE} x2={BX + 90} y2={BASE} />
          <line className="kf-axis" x1={BX - 24} y1={BASE} x2={BX - 24} y2={BASE - 225} />
          {[0, 350e3, 700e3].map((v) => <line key={v} className="kf-tick" x1={BX - 29} y1={BASE - (v / barMax) * 215} x2={BX - 24} y2={BASE - (v / barMax) * 215} />)}
          <rect className="kf-press" x={BX} y={BASE - barH} width={52} height={barH} />
        </svg>
        <KL vb={VB} at={[CX + 24, 70]} ink="out" anchor="l"><M>{t`\v F = ${fx(PATCH.F, 3)}\,\mathrm N`}</M></KL>
        <KL vb={VB} at={[CX, TOP - 60]} className="word">{tr('Träger', 'beam')}</KL>
        <KL vb={VB} at={[CX, TOP + 48]} className="word">{tr('Stütze', 'support')}</KL>
        {dist && <KL vb={VB} at={[CX, TOP + 18 + 30]} ink="muted" className="small" anchor="b"><M>{t`w`}</M></KL>}
        <KL vb={VB} at={[BX + 26, BASE - barH - 14]} ink="out"><M>{t`s`}</M></KL>
        <KL vb={VB} at={[BX - 30, BASE - 215]} ink="muted" anchor="r" className="small"><M>{t`700\,\mathrm{kPa}`}</M></KL>
        <KL vb={VB} at={[BX - 30, BASE - 107]} ink="muted" anchor="r" className="small"><M>{t`350`}</M></KL>
        <KL vb={VB} at={[BX - 30, BASE]} ink="muted" anchor="r" className="small"><M>0</M></KL>
      </div>
      <div className="kf-controls">
        <KSlider label={<M>{t`w`}</M>} min={1} max={10} step={0.5} value={w} onChange={setW} val={`${fmtNumPlain(w, lang)} cm`} aria={tr('Breite der Auflage w', 'width of the contact w')} />
        <label className="toggle"><input type="checkbox" checked={dist} onChange={(e) => setDist(e.target.checked)} />{' '}{tr('Verteilung zeigen (aus: nur der Pfeil)', 'show the distribution (off: just the arrow)')}</label>
      </div>
      <div className="kf-readout">
        <div className="kf-sums">
          <div className="v-result"><M>{t`A = w\cdot ${fx(PATCH.depth * 100, 2)}\,\mathrm{cm} = ${fx(A * 1e4, 3)}\,\mathrm{cm^2}`}</M></div>
          <div className="v-result"><M>{t`s = \dfrac{F}{A} = \dfrac{${fx(PATCH.F, 3)}\,\mathrm N}{${fx(A, 3)}\,\mathrm{m^2}} = ${fx(s / 1000, 3)}\,\mathrm{kPa}`}</M></div>
        </div>
      </div>
    </figure>
  );
}

const fmtNumPlain = (x: number, lang: 'de' | 'en') => (lang === 'de' ? String(x).replace('.', ',') : String(x));
