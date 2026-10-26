import { Fragment, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { K2_SCENES, type KBody, type KPair, type KScene, type V } from './k2Data';
import { Arrow, Frame, KLabel } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 480, 300];

/** Text with $…$ pieces typeset as TeX. */
function Rich({ text }: { text: string }) {
  return <>{text.split('$').map((s, i) => (i % 2 ? <M key={i}>{s}</M> : <Fragment key={i}>{s}</Fragment>))}</>;
}

/** Diagonal hatching along one edge of a rectangle (the lecture hatches the outer side of supports and walls). */
function Hatch({ x0, y0, x1, y1, side }: { x0: number; y0: number; x1: number; y1: number; side: 'r' | 'b' }) {
  const out: ReactNode[] = [];
  if (side === 'r') for (let y = y0 + 8; y < y1; y += 14) out.push(<line key={y} x1={x1} y1={y} x2={x1 + 12} y2={y - 10} className="kf-hatch" />);
  else for (let x = x0 + 8; x < x1; x += 14) out.push(<line key={x} x1={x} y1={y1} x2={x - 10} y2={y1 + 10} className="kf-hatch" />);
  return <>{out}</>;
}

function Drawing({ sc }: { sc: KScene }) {
  switch (sc.id) {
    case 'book': return (<>
      <rect x={0} y={262} width={480} height={38} className="kf-ground" />
      <rect x={110} y={170} width={260} height={14} rx={2} className="kf-body" />
      <rect x={122} y={184} width={14} height={78} className="kf-body" /><rect x={344} y={184} width={14} height={78} className="kf-body" />
      <rect x={200} y={128} width={80} height={42} rx={3} className="kf-body soft" />
      <line x1={209} y1={128} x2={209} y2={170} className="kf-axis" />
    </>);
    case 'wall': return (<>
      <rect x={0} y={262} width={480} height={38} className="kf-ground" />
      <rect x={330} y={30} width={62} height={232} className="kf-body" />
      <Hatch x0={330} y0={30} x1={392} y1={262} side="r" />
      <polyline points="140,258 196,176 250,120 331,146" className="kf-limb" />
      <circle cx={262} cy={92} r={15} className="kf-body" />
      <line x1={126} y1={262} x2={160} y2={262} className="kf-axis" />
    </>);
    case 'ladder': {
      const a: V = [190, 261], b: V = [421, 104], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const u: V = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V = [-u[1] * 6, u[0] * 6];
      const poly = [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]].map((p) => p.join(',')).join(' ');
      return (<>
        <rect x={0} y={260} width={480} height={40} className="kf-ground" />
        <rect x={420} y={20} width={60} height={240} className="kf-body" />
        <Hatch x0={420} y0={20} x1={480} y1={260} side="r" />
        <polygon points={poly} className="kf-body soft" />
        {[0.2, 0.4, 0.6, 0.8].map((k) => <line key={k} x1={a[0] + k * (b[0] - a[0]) - n[0]} y1={a[1] + k * (b[1] - a[1]) - n[1]} x2={a[0] + k * (b[0] - a[0]) + n[0]} y2={a[1] + k * (b[1] - a[1]) + n[1]} className="kf-rung" />)}
      </>);
    }
    default: return (<>
      <rect x={70} y={118} width={60} height={44} className="kf-mag-l" /><rect x={130} y={118} width={60} height={44} className="kf-mag-r" />
      <rect x={290} y={118} width={60} height={44} className="kf-mag-r" /><rect x={350} y={118} width={60} height={44} className="kf-mag-l" />
    </>);
  }
}

/**
 * «Es existiert keine Kraft ohne Reaktion» (p. 30): four everyday scenes. Pick any arrow (or a chip) and the counter-force lights up
 * on the OTHER body. Explanation only – the data (points of application, directions) come from k2Data.ts and are tested against force.ts.
 */
export function K2Where() {
  const tr = useTr(), lang = useLang();
  const [sceneId, setSceneId] = useState(K2_SCENES[0].id);
  const sc = K2_SCENES.find((s) => s.id === sceneId)!;
  const [sel, setSel] = useState<{ pair: string; side: 'on' | 'by' }>({ pair: K2_SCENES[0].pairs[0].id, side: 'on' });
  const pair = sc.pairs.find((p) => p.id === sel.pair) ?? sc.pairs[0];
  const body = (id: string): KBody => sc.bodies.find((b) => b.id === id)!;
  const name = (b: KBody) => tr(b.de, b.en);
  const choose = (s: KScene) => { setSceneId(s.id); setSel({ pair: s.pairs[0].id, side: 'on' }); };

  // arrow of one member of a pair: tail at its point of application, pointing in the direction of the force on that body
  const arrowOf = (p: KPair, side: 'on' | 'by'): [V, V] => {
    const A = side === 'on' ? p.A : p.B, s = side === 'on' ? 1 : -1;
    return [A, [A[0] + s * p.dir[0] * p.len, A[1] + s * p.dir[1] * p.len]];
  };
  const pickedText = sel.side === 'on' ? pair[lang].force : pair[lang].counter;
  const counterText = sel.side === 'on' ? pair[lang].counter : pair[lang].force;
  const actedOn = body(sel.side === 'on' ? pair.by : pair.on);
  const tag = (txt: string, p: V, dx: number, dy: number) => <div className="vdemo-label kf-tag halo" style={{ left: `${((p[0] + dx) / 480) * 100}%`, top: `${((p[1] + dy) / 300) * 100}%` }}>{txt}</div>;

  return (
    <Frame vb={VB} label={tr('Vier Alltagsszenen: gewählte Kraft und ihre Gegenkraft', 'Four everyday scenes: chosen force and its counter-force')}
      labels={<>
        {sc.bodies.map((b) => <div key={b.id} className="vdemo-label small inner" style={{ left: `${(((b.box[0] + b.box[2]) / 2) / 480) * 100}%`, top: `${(Math.min(b.box[3] - 10, (b.box[1] + b.box[3]) / 2 + (b.id === 'earth' || b.id === 'floor' ? 4 : 0)) / 300) * 100}%`, display: sc.id === 'book' && b.id === 'book' ? 'none' : undefined }}>{name(b)}</div>)}
        {(['on', 'by'] as const).map((side) => {
          const p = pair, [a, tip] = arrowOf(p, side);
          const dx = tip[0] - a[0], dy = tip[1] - a[1], horiz = Math.abs(dx) > Math.abs(dy);
          const off: V = horiz ? [0, -17] : [dx >= 0 ? 17 : -17, 0];
          return <KLabel key={p.id + side} vb={VB} x={a[0] + dx / 2 + off[0]} y={a[1] + dy / 2 + off[1]} ink="force" anchor={horiz ? 't' : dx >= 0 ? 'l' : 'r'}>{side === 'on' ? p.sym : `-${p.sym}`}</KLabel>;
        })}
        {tag(sel.side === 'on' ? tr('gewählt', 'chosen') : tr('Gegenkraft', 'counter-force'), arrowOf(pair, 'on')[1], 0, 14)}
        {tag(sel.side === 'by' ? tr('gewählt', 'chosen') : tr('Gegenkraft', 'counter-force'), arrowOf(pair, 'by')[1], 0, 14)}
      </>}
      caption={<>
        <div className="kf-ctl">
          <div className="row" role="group" aria-label={tr('Szene', 'Scene')}>
            {K2_SCENES.map((s) => <button type="button" key={s.id} className="kf-chip" aria-pressed={s.id === sceneId} onClick={() => choose(s)}>{tr(s.de, s.en)}</button>)}
          </div>
          <div className="row" role="group" aria-label={tr('Kraft wählen', 'Choose a force')}>
            {sc.pairs.map((p) => (['on', 'by'] as const).map((side) => (
              <button type="button" key={p.id + side} className="kf-chip sm" aria-pressed={sel.pair === p.id && sel.side === side} onClick={() => setSel({ pair: p.id, side })}>
                <M>{side === 'on' ? p.sym : `-${p.sym}`}</M>{' '}{side === 'on' ? p[lang].force : p[lang].counter}
              </button>)))}
          </div>
        </div>
        <div className="kf-read" role="status">
          <div className="big"><b>{tr('Gewählt:', 'Chosen:')}</b> {pickedText}<br /><b>{tr('Gegenkraft:', 'Counter-force:')}</b> {counterText}</div>
          <div>{tr('Die Gegenkraft greift am anderen Körper an: am ', 'The counter-force acts on the other body: on the ')}<b>{name(actedOn)}</b>.</div>
          {pair.note && <div className="kf-note"><Rich text={pair.note[lang]} /></div>}
        </div>
      </>}>
      <Drawing sc={sc} />
      {sc.pairs.map((p) => {
        const picked = p.id === sel.pair;
        const dim = !picked;
        return (
          <g key={p.id} opacity={dim ? 0.28 : 1}>
            {p.fern && <line x1={p.A[0]} y1={p.A[1]} x2={p.B[0]} y2={p.B[1]} className="kf-guide line" opacity={picked ? 1 : 0.6} />}
            {(['on', 'by'] as const).map((side) => {
              const [a, tip] = arrowOf(p, side);
              const chosen = picked && sel.side === side;
              return (
                <g key={side}>
                  <Arrow a={a} b={tip} cls={`kf-f${picked ? '' : ' thin'}`} />
                  <circle cx={a[0]} cy={a[1]} r={picked ? 5 : 3.5} className="kf-pt solid" />
                  {chosen && <circle cx={a[0]} cy={a[1]} r={10} className="kf-pick" />}
                  <line x1={a[0]} y1={a[1]} x2={tip[0]} y2={tip[1]} className="kf-hit" onClick={() => setSel({ pair: p.id, side })} />
                </g>
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}
