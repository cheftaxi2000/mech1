import { useMemo, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, tupleSep, useLang, useTr, type Lang } from '../../i18n';
import {
  classifyBeam, classifyCarts, systemOf, type BeamBody, type BeamExample, type BeamGroup, type CartBody,
} from '../../physics/systemModel';
import type { Vec3 } from '../../physics/vec';
import { BEAM_GEOM, beamModel, cartModel, pairOf, partnerOf, type KBody, type KModel } from './k3Model';
import { pathOf, unionOutline } from './k3Outline';
import { KArrow, KL, KSlider, PName, clamp, svgPoint, type V } from './k34Common';

const t = String.raw;
type Status = 'in' | 'out';
type Cls = { inner: { id: string }[]; outer: { id: string }[]; sumInner: Vec3; sumOuter: Vec3 };

/** hover = the pair under the pointer, pinned = the pair that was tapped; the pointer wins while it is over an arrow */
function useFocus() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  return { focus: hover ?? pinned, setHover, toggle: (p: string) => setPinned((q) => (q === p ? null : p)), clear: () => { setHover(null); setPinned(null); } };
}

/* ───────────────────────────── the drawing ───────────────────────────── */

function BodyShape({ b, inSys, drag, onDown }: { b: KBody; inSys: boolean; drag?: boolean; onDown?: (e: React.PointerEvent) => void }) {
  const r = b.rect;
  const cls = `kf-body${inSys ? ' in' : ''}${drag ? ' drag' : ''}`;
  if (b.kind === 'support' && b.apex) {
    const a = b.apex, y = r.y1;
    return (
      <g>
        <polygon className={cls} points={`${a[0]},${a[1]} ${r.x0 + 2},${y - 6} ${r.x1 - 2},${y - 6}`} />
        <line className="kf-ground" x1={r.x0 - 12} y1={y - 6} x2={r.x1 + 12} y2={y - 6} />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <line key={k} className="kf-ground" x1={r.x0 - 8 + k * 11} y1={y - 6} x2={r.x0 - 16 + k * 11} y2={y + 2} />)}
      </g>
    );
  }
  if (b.kind === 'cart') {
    return (
      <g>
        <rect className={cls} x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0 - 8} rx={5} />
        <circle className="kf-wheel" cx={r.x0 + 30} cy={r.y1 - 6} r={7} /><circle className="kf-wheel" cx={r.x1 - 30} cy={r.y1 - 6} r={7} />
      </g>
    );
  }
  return <rect className={cls} x={r.x0} y={r.y0} width={r.x1 - r.x0} height={r.y1 - r.y0} rx={b.kind === 'block' ? 4 : 2} onPointerDown={onDown} />;
}

function Board({ model, system, status, visible, fc, extraSvg, extraLabels, svgRef, onSvgMove, onSvgUp, onBlockDown, ground, maxWidth }: {
  model: KModel; system: ReadonlySet<string>; status: ReadonlyMap<string, Status>; visible: (fid: string) => boolean;
  fc: ReturnType<typeof useFocus>; extraSvg?: ReactNode; extraLabels?: ReactNode; svgRef?: React.RefObject<SVGSVGElement | null>;
  onSvgMove?: (e: React.PointerEvent) => void; onSvgUp?: () => void; onBlockDown?: (e: React.PointerEvent) => void; ground?: ReactNode; maxWidth: number;
}) {
  const tr = useTr(), lang = useLang();
  const vb = model.vb;
  const rects = model.bodies.filter((b) => system.has(b.id)).map((b) => b.rect);
  const frame = useMemo(() => pathOf(unionOutline(rects, 11)), [rects.map((r) => `${r.x0},${r.y0},${r.x1},${r.y1}`).join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const forces = model.forces.filter((f) => visible(f.fid) && Math.hypot(f.to[0] - f.from[0], f.to[1] - f.from[1]) >= 3);
  const kindOf = (fid: string) => (status.get(fid) ?? 'ghost') as 'in' | 'out' | 'ghost';
  const order = { ghost: 0, in: 1, out: 2 } as const;
  const sorted = [...forces].sort((a, b) => order[kindOf(a.fid)] - order[kindOf(b.fid)]);
  const inFocus = (fid: string) => fc.focus !== null && pairOf(fid) === fc.focus;
  return (
    <div className="kf-fig" style={{ maxWidth }}>
      <svg ref={svgRef} viewBox={vb.join(' ')} onPointerMove={onSvgMove} onPointerUp={onSvgUp} onPointerCancel={onSvgUp}
        role="img" aria-label={tr('Körper, Systemgrenze und alle Kräfte', 'Bodies, system boundary and all forces')}>
        {frame && <path className="kf-frame-fill" d={frame} />}
        {ground}
        {model.bodies.map((b) => <BodyShape key={b.id} b={b} inSys={system.has(b.id)} drag={b.id === 'last' && !!onBlockDown} onDown={b.id === 'last' ? onBlockDown : undefined} />)}
        {frame && <path className="kf-frame" d={frame} />}
        {extraSvg}
        {sorted.map((f) => {
          const k = kindOf(f.fid), foc = inFocus(f.fid), dim = fc.focus !== null && !foc;
          return (
            <g key={f.fid}>
              {foc && <line className="kf-halo" x1={f.from[0]} y1={f.from[1]} x2={f.to[0]} y2={f.to[1]} strokeWidth={13} />}
              <KArrow a={f.from} b={f.to} kind={k} w={k === 'ghost' ? 2.2 : 3.2} className={`${foc ? 'focus' : ''} ${dim ? 'dim' : ''}`} />
              <circle className="kf-dot" cx={f.at[0]} cy={f.at[1]} r={k === 'ghost' ? 2.5 : 3.4} opacity={dim ? 0.4 : 1} />
            </g>
          );
        })}
        {sorted.map((f) => (
          <line key={`hit-${f.fid}`} className="kf-hit" x1={f.from[0]} y1={f.from[1]} x2={f.to[0]} y2={f.to[1]}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') fc.setHover(pairOf(f.fid)); }} onPointerLeave={() => fc.setHover(null)}
            onClick={() => fc.toggle(pairOf(f.fid))} />
        ))}
      </svg>
      {model.bodies.map((b) => b.nameAt && <KL key={`n-${b.id}`} vb={vb} at={b.nameAt} className="word">{b.name[lang === 'de' ? 0 : 1]}</KL>)}
      {sorted.map((f) => {
        const k = kindOf(f.fid), foc = inFocus(f.fid), dim = fc.focus !== null && !foc;
        return <KL key={`l-${f.fid}`} vb={vb} at={f.lab} anchor={f.labAnchor} ink={k} className={`${foc ? 'focus' : ''} ${dim ? 'dim' : ''}`}><M>{f.tex}</M></KL>;
      })}
      {extraLabels}
    </div>
  );
}

/* ───────────────────────────── list, sums, focus info ───────────────────────────── */

function Readout({ model, system, cls, fc, status, unit = 'N', sumNote }: {
  model: KModel; system: ReadonlySet<string>; cls: Cls; fc: ReturnType<typeof useFocus>; status: ReadonlyMap<string, Status>; unit?: string; sumNote?: ReactNode;
}) {
  const tr = useTr(), lang = useLang();
  const texOf = (fid: string) => model.forces.find((f) => f.fid === fid)?.tex ?? fid;
  const innerPairs = [...new Set(cls.inner.map((i) => pairOf(i.id)))];
  const vec = (v: Vec3) => `(${fmtNum(v[0], 1, lang, true)}${tupleSep(lang)}${fmtNum(v[1], 1, lang, true)})\\,\\mathrm{${unit}}`;
  const item = (pair: string, label: string) => (
    <button key={pair} type="button" className="kf-item" aria-pressed={fc.focus === pair}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') fc.setHover(pair); }} onPointerLeave={() => fc.setHover(null)} onClick={() => fc.toggle(pair)}>
      <M>{label}</M>
    </button>
  );
  return (
    <div className="kf-readout">
      <div className="kf-lists">
        <div className="kf-list out">
          <h4><i />{tr('Äussere Kräfte auf das System', 'Outer forces on the system')} ({cls.outer.length})</h4>
          <div className="kf-items">
            {cls.outer.length ? cls.outer.map((o) => item(pairOf(o.id), texOf(o.id))) : <span className="kf-empty">{tr('keine', 'none')}</span>}
          </div>
        </div>
        <div className="kf-list in">
          <h4><i />{tr('Innere Kräfte (je als Paar)', 'Inner forces (as pairs)')} ({innerPairs.length})</h4>
          <div className="kf-items">
            {innerPairs.length ? innerPairs.map((p) => item(p, `${texOf(p)}\\ \\leftrightarrow\\ ${texOf(partnerOf(p))}`)) : <span className="kf-empty">{tr('keine', 'none')}</span>}
          </div>
        </div>
      </div>
      <div className="kf-sums">
        <div className="v-result"><M>{t`\sum \v F_{\text{${tr('innen', 'inner')}}} = ${vec(cls.sumInner)}`}</M></div>
        <div className="v-result"><M>{t`\sum \v F_{\text{${tr('aussen', 'outer')}}} = ${vec(cls.sumOuter)}`}</M></div>
      </div>
      {sumNote}
      <FocusInfo model={model} system={system} fc={fc} status={status} lang={lang} />
    </div>
  );
}

function FocusInfo({ model, system, fc, lang }: { model: KModel; system: ReadonlySet<string>; fc: ReturnType<typeof useFocus>; status: ReadonlyMap<string, Status>; lang: Lang }) {
  const tr = useTr();
  const pair = fc.focus;
  const int = pair ? model.interactions.find((i) => i.id === pair) : undefined;
  if (!pair || !int) {
    return <div className="kf-info"><p className="kf-empty">{tr('Tippe auf einen Pfeil oder einen Knopf in der Liste: Du siehst, wo seine Reaktion angreift.', 'Tap an arrow or a button in the list: you see where its reaction acts.')}</p></div>;
  }
  const tex = model.forces.find((f) => f.fid === pair)?.tex ?? pair;
  const drawn = model.forces.some((f) => f.fid === partnerOf(pair));
  const on = model.names[int.on], by = model.names[int.by];
  const onIn = system.has(int.on), byIn = system.has(int.by);
  const iDe = lang === 'de';
  const verdict = onIn && byIn
    ? tr('Beide Seiten des Paars liegen im System: innere Kräfte.', 'Both sides of the pair are inside the system: inner forces.')
    : onIn || byIn
      ? tr('Die Reaktion greift ausserhalb des Systems an: äussere Kraft.', 'The reaction acts outside the system: an outer force.')
      : tr('Keiner der beiden Angriffspunkte gehört zum System: Das Paar kommt in dieser Analyse nicht vor.', 'Neither point of application belongs to the system: the pair does not appear in this analysis.');
  return (
    <div className="kf-info" aria-live="polite">
      <p>
        <M>{tex}</M>{iDe ? <> wirkt auf {on.acc[0]}. Die Reaktion <M>{`-${tex}`}</M> wirkt auf {by.acc[0]}{drawn ? '' : ' (nicht gezeichnet)'}. </> : <> acts on {on.acc[1]}. Its reaction <M>{`-${tex}`}</M> acts on {by.acc[1]}{drawn ? '' : ' (not drawn)'}. </>}
        <b>{verdict}</b>
      </p>
    </div>
  );
}

/* ───────────────────────────── chips ───────────────────────────── */

function Chip({ on, onClick, children, small }: { on: boolean; onClick: () => void; children: ReactNode; small?: boolean }) {
  return <button type="button" className={`kf-chip${small ? ' small' : ''}`} aria-pressed={on} onClick={onClick}>{children}</button>;
}

/* ───────────────────────────── the explorer of p. 31 ───────────────────────────── */

const GROUP_NAME: Record<BeamGroup, [string, string]> = { last: ['Lastkörper', 'Load block'], traeger: ['Träger', 'Beam'], stuetzen: ['Stützen', 'Supports'] };
const sameSet = (a: ReadonlySet<BeamGroup>, b: readonly BeamGroup[]) => a.size === b.length && b.every((x) => a.has(x));

/**
 * Skript p. 31: the Lastkörper on the Träger on two Stützen with all forces. Choose which bodies belong to the system:
 * the dashed frame follows, outer forces turn vermilion, inner forces grey; forces on bodies outside stay faint.
 * Tap a force: its counter-force (the reaction) lights up.
 */
export function SystemExplorer() {
  const tr = useTr(), lang = useLang();
  const [groups, setGroups] = useState<ReadonlySet<BeamGroup>>(new Set<BeamGroup>(['last']));
  const [ex, setEx] = useState<BeamExample>({ G: 80, Z: 50, s: 0.4 });
  const fc = useFocus();
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const system = useMemo(() => systemOf(groups), [groups]);
  const model = useMemo(() => beamModel(ex), [ex]);
  const cls = useMemo(() => classifyBeam(ex, system as ReadonlySet<BeamBody>), [ex, system]);
  const status = useMemo(() => {
    const m = new Map<string, Status>();
    cls.outer.forEach((o) => m.set(o.id, 'out')); cls.inner.forEach((o) => m.set(o.id, 'in'));
    return m;
  }, [cls]);
  const visible = (fid: string) => !(fid === 'HA' && !system.has('stuetzeA')) && !(fid === 'HB' && !system.has('stuetzeB'));
  const toggle = (g: BeamGroup) => setGroups((s) => { const n = new Set(s); if (n.has(g)) n.delete(g); else n.add(g); return n; });
  const { A, B } = BEAM_GEOM;
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current || !svg.current || e.buttons !== 1) return;
    const p = svgPoint(svg.current, model.vb, e);
    setEx((q) => ({ ...q, s: clamp(Math.round(((p[0] - A[0]) / (B[0] - A[0])) * 100) / 100, BEAM_GEOM.s0, BEAM_GEOM.s1) }));
  };
  const last = model.bodies[0].rect, xm = (last.x0 + last.x1) / 2;
  const com: V = [xm, BEAM_GEOM.beamY0 - BEAM_GEOM.comDy], zp: V = [last.x1, last.y0 + 20];
  const presets: { de: string; en: string; set: BeamGroup[] }[] = [
    { de: 'nur Lastkörper', en: 'load block only', set: ['last'] },
    { de: 'Lastkörper + Träger', en: 'load block + beam', set: ['last', 'traeger'] },
    { de: 'nur Träger', en: 'beam only', set: ['traeger'] },
    { de: 'alles', en: 'everything', set: ['last', 'traeger', 'stuetzen'] },
  ];
  return (
    <figure className="kf">
      <div className="kf-body-chips" role="group" aria-label={tr('Körper im System', 'Bodies in the system')}>
        <span className="kf-cap">{tr('Zum System gehört:', 'The system contains:')}</span>
        {(Object.keys(GROUP_NAME) as BeamGroup[]).map((g) => <Chip key={g} on={groups.has(g)} onClick={() => toggle(g)}>{GROUP_NAME[g][lang === 'de' ? 0 : 1]}</Chip>)}
      </div>
      <div className="kf-body-chips" role="group" aria-label={tr('Vorgaben', 'Presets')}>
        <span className="kf-cap">{tr('Oder wie im Skript:', 'Or as in the notes:')}</span>
        {presets.map((p) => <Chip small key={p.en} on={sameSet(groups, p.set)} onClick={() => setGroups(new Set(p.set))}>{tr(p.de, p.en)}</Chip>)}
      </div>
      <Board model={model} system={system} status={status} visible={visible} fc={fc} maxWidth={820} svgRef={svg}
        onSvgMove={onMove} onSvgUp={() => { dragging.current = false; }} onBlockDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); fc.clear(); }}
        extraSvg={<>
          <circle className="kf-ring" cx={com[0]} cy={com[1]} r={4.5} /><circle className="kf-ring" cx={zp[0]} cy={zp[1]} r={4.5} />
        </>}
        extraLabels={<><PName vb={model.vb} at={[A[0] - 16, A[1] + 14]} tex="A" /><PName vb={model.vb} at={[B[0] - 16, B[1] + 14]} tex="B" /></>}
      />
      <div className="kf-controls">
        <KSlider label={<M>{t`G`}</M>} min={40} max={100} step={5} value={ex.G} onChange={(G) => setEx((q) => ({ ...q, G }))} val={`${fmtNum(ex.G, 0, lang)} N`} aria={tr('Gewicht G', 'weight G')} />
        <KSlider label={<M>{t`Z`}</M>} min={0} max={80} step={5} value={ex.Z} onChange={(Z) => setEx((q) => ({ ...q, Z }))} val={`${fmtNum(ex.Z, 0, lang)} N`} aria={tr('Zug Z', 'pull Z')} />
        <KSlider label={tr('Ort', 'place')} min={BEAM_GEOM.s0} max={BEAM_GEOM.s1} step={0.01} value={ex.s} onChange={(s) => setEx((q) => ({ ...q, s }))} val={`${fmtNum(ex.s * 100, 0, lang)} %`} aria={tr('Ort des Lastkörpers zwischen A und B', 'place of the load block between A and B')} />
      </div>
      <p className="kf-hint">{tr('Den Lastkörper kannst du auch mit dem Finger verschieben.', 'You can also drag the load block with your finger.')}</p>
      <Readout model={model} system={system} cls={cls} fc={fc} status={status} />
    </figure>
  );
}

/* ───────────────────────────── the small example: two carts ───────────────────────────── */

/** Two carts on a smooth rail, a hand pushes the first: the smallest example of «innere und äussere Kraft». */
export function CartPair() {
  const tr = useTr(), lang = useLang();
  const [sel, setSel] = useState<ReadonlySet<CartBody>>(new Set<CartBody>(['w1']));
  const fc = useFocus();
  const model = useMemo(() => cartModel(), []);
  const cls = useMemo(() => classifyCarts(70, 42, sel), [sel]);
  const status = useMemo(() => {
    const m = new Map<string, Status>();
    cls.outer.forEach((o) => m.set(o.id, 'out')); cls.inner.forEach((o) => m.set(o.id, 'in'));
    return m;
  }, [cls]);
  const toggle = (b: CartBody) => setSel((s) => { const n = new Set(s); if (n.has(b)) n.delete(b); else n.add(b); return n; });
  const hand = (
    <g>
      <rect className="kf-body" x={122} y={88} width={68} height={44} rx={14} />
      <line className="kf-ground" x1={100} y1={150} x2={484} y2={150} opacity={0.35} />
    </g>
  );
  return (
    <figure className="kf">
      <div className="kf-body-chips" role="group" aria-label={tr('Wagen im System', 'Carts in the system')}>
        <span className="kf-cap">{tr('Zum System gehört:', 'The system contains:')}</span>
        {(['w1', 'w2'] as CartBody[]).map((b) => <Chip key={b} on={sel.has(b)} onClick={() => toggle(b)}>{model.bodies.find((x) => x.id === b)!.name[lang === 'de' ? 0 : 1]}</Chip>)}
        <Chip small on={sel.size === 2} onClick={() => setSel(new Set<CartBody>(['w1', 'w2']))}>{tr('beide', 'both')}</Chip>
      </div>
      <Board model={model} system={sel} status={status} visible={() => true} fc={fc} maxWidth={760} ground={hand}
        extraLabels={<KL vb={model.vb} at={[156, 76]} className="word">{tr('Hand', 'hand')}</KL>} />
      <Readout model={model} system={sel} cls={cls} fc={fc} status={status} />
    </figure>
  );
}

