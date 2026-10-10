import { useRef, useState } from 'react';
import { cartToCyl, lectureArctanPhi } from '../physics/coords';
import { M } from '../components/Tex';
import { T } from '../i18n';

const S = 120; // px per unit
const deg = (r: number) => (r * 180) / Math.PI;

/** Drag M in the xy-plane and compare the true φ with the naive arctan(y/x). (Supplement; see R-001.) */
export function QuadrantTrap() {
  const [pt, setPt] = useState<[number, number]>([-1, 0.8]);
  const svg = useRef<SVGSVGElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.buttons !== 1 || !svg.current) return;
    const b = svg.current.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 360 - 180, y = 180 - ((e.clientY - b.top) / b.height) * 360;
    setPt([Math.max(-1.4, Math.min(1.4, x / S)), Math.max(-1.4, Math.min(1.4, y / S))]);
  };
  const [x, y] = pt;
  const phi = cartToCyl([x, y, 0]).phi;
  const naive = x === 0 ? NaN : lectureArctanPhi(x, y);
  const wrong = Number.isNaN(naive) || Math.abs(((naive - phi) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)) > 1e-6;
  const arc = (a: number, r: number) => {
    const large = Math.abs(a) > Math.PI ? 1 : 0, sweep = a > 0 ? 0 : 1;
    return `M ${r} 0 A ${r} ${r} 0 ${large} ${sweep} ${r * Math.cos(a)} ${-r * Math.sin(a)}`;
  };
  return (
    <figure className="trap">
      <svg ref={svg} viewBox="-180 -180 360 360" onPointerMove={move} onPointerDown={move} role="img" aria-label="xy-Ebene / xy-plane: M">
        <line x1={-175} y1={0} x2={175} y2={0} className="ax" /><line x1={0} y1={175} x2={0} y2={-175} className="ax" />
        <text x={165} y={16} className="axl">x</text><text x={8} y={-165} className="axl">y</text>
        <path d={arc(phi, 40)} className="arc-true" />
        {!Number.isNaN(naive) && <path d={arc(naive, 60)} className={wrong ? 'arc-bad' : 'arc-ok'} />}
        <line x1={0} y1={0} x2={x * S} y2={-y * S} className="ray" />
        <circle cx={x * S} cy={-y * S} r={9} className="handle" />
        <text x={x * S + 12} y={-y * S - 10} className="axl">M</text>
      </svg>
      <figcaption>
        <p>
          <T de={<>Ziehe <b>M</b>. Violett: der wahre Winkel <M>{`\\varphi = ${deg(phi).toFixed(0)}^\\circ`}</M>.</>}
            en={<>Drag <b>M</b>. Purple: the true angle <M>{`\\varphi = ${deg(phi).toFixed(0)}^\\circ`}</M>.</>} />{' '}
          {Number.isNaN(naive)
            ? <T de={<>Hier ist <M>x=0</M>, also ist <M>y/x</M> gar nicht definiert.</>} en={<>Here <M>x=0</M>, so <M>y/x</M> is not even defined.</>} />
            : <>
                <T de="Orange/grün:" en="Orange/green:" /> <M>{`\\arctan(y/x) = ${deg(naive).toFixed(0)}^\\circ`}</M> –{' '}
                {wrong
                  ? <b className="bad"><T de="falscher Quadrant!" en="wrong quadrant!" /></b>
                  : <b className="ok"><T de="stimmt (x > 0)" en="agrees (x > 0)" /></b>}
              </>}
        </p>
      </figcaption>
    </figure>
  );
}
