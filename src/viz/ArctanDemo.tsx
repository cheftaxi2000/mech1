import { useEffect, useRef, useState } from 'react';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';

const R = 92; // circle radius in SVG units (viewBox −150 … 150)
const DEG = Math.PI / 180;
const SPEED = 30 * DEG; // rad per second in the automatic demo (one turn in 12 s)

function usePrefersReducedMotion() {
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/** SVG arc path around O from angle 0 to angle a (counter-clockwise for a > 0), radius r. */
function arc(a: number, r: number) {
  const large = Math.abs(a) > Math.PI ? 1 : 0, sweep = a > 0 ? 0 : 1;
  return `M ${r} 0 A ${r} ${r} 0 ${large} ${sweep} ${(r * Math.cos(a)).toFixed(2)} ${(-r * Math.sin(a)).toFixed(2)}`;
}

/**
 * R-001 in one picture (supplement): M runs around the circle by itself (or is dragged). The calculator's
 * arctan(y/x) only knows angles between −90° and 90° — the right half-plane. For x < 0 its ray points to
 * the OPPOSITE point (−x, −y), which has the same ratio y/x; the true angle is 180° more.
 */
export function ArctanDemo() {
  const tr = useTr();
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState<[number, number]>(() => [Math.cos(135 * DEG), Math.sin(135 * DEG)]);
  const [auto, setAuto] = useState(!reduced);
  const [visible, setVisible] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { if (reduced) setAuto(false); }, [reduced]);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible) return;
    let raf = 0, last = performance.now();
    let a = Math.atan2(p[1], p[0]);
    const tick = (now: number) => {
      a += (Math.min(now - last, 100) / 1000) * SPEED;
      last = now;
      setP([Math.cos(a), Math.sin(a)]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const place = (e: React.PointerEvent) => {
    if (!svg.current || (e.type === 'pointermove' && e.buttons !== 1)) return;
    const b = svg.current.getBoundingClientRect();
    const x = (((e.clientX - b.left) / b.width) * 300 - 150) / R, y = (150 - ((e.clientY - b.top) / b.height) * 300) / R;
    const n = Math.hypot(x, y);
    if (n < 0.05) return;
    setAuto(false);
    setP([x / n, y / n]); // stay on the circle: only the direction matters for the angle
  };

  const [x, y] = p;
  const phi = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
  const d = (a: number) => Math.round(a / DEG);
  const onAxis = d(phi) % 180 === 90; // exactly on the y-axis (as displayed): y/x undefined
  const calc = onAxis ? NaN : Math.atan(y / x); // what arctan(y/x) returns, in (−90°, 90°)
  const left = x < 0 && !onAxis;
  const q4 = x > 0 && y < 0 && !onAxis && d(phi) % 360 !== 0; // arctan gives a negative angle: +360° brings it into [0°, 360°)
  const px = x * R, py = -y * R;
  const pos = (sx: number, sy: number) => ({ left: `${((sx + 150) / 300) * 100}%`, top: `${((sy + 150) / 300) * 100}%` });

  return (
    <figure className="arctan-demo" ref={box}>
      <div className="arctan-fig">
        <svg ref={svg} viewBox="-150 -150 300 300" onPointerDown={place} onPointerMove={place} aria-label={tr('Punkt M auf dem Kreis, ziehbar', 'Point M on the circle, draggable')}>
          <rect x={-150} y={-150} width={150} height={300} className="half-left" />
          <line x1={-140} y1={0} x2={140} y2={0} className="ax" /><line x1={0} y1={140} x2={0} y2={-140} className="ax" />
          <circle r={R} className="circ" />
          <path d={arc(phi, 30)} className="arc-true" />
          {!onAxis && <path d={arc(calc, 48)} className={left ? 'arc-bad' : 'arc-ok'} />}
          {!onAxis && <line x1={0} y1={0} x2={Math.cos(calc) * (R + 22)} y2={-Math.sin(calc) * (R + 22)} className={left ? 'ray-calc bad' : 'ray-calc ok'} />}
          {left && <circle cx={-px} cy={-py} r={7} className="ghost" />}
          <line x1={0} y1={0} x2={px} y2={py} className="ray" />
          <circle cx={px} cy={py} r={10} className="handle" />
        </svg>
        <div className="arctan-label muted" style={pos(132, 14)}><M>x</M></div>
        <div className="arctan-label muted" style={pos(12, -136)}><M>y</M></div>
        <div className="arctan-label point" style={pos(px * 1.28, py * 1.28)}><M>M</M></div>
        {left && <div className="arctan-label calc" style={pos(-px * 1.38, -py * 1.38)}><M>{'(-x,-y)'}</M></div>}
        <div className="arctan-label half" style={pos(-75, -128)}><M>{'x < 0'}</M></div>
      </div>
      <figcaption className="arctan-readout">
        <div className="row true"><span className="key" /><M>{String.raw`\varphi = ${d(phi)}^\circ`}</M></div>
        {onAxis
          ? <div className="row"><T de={<><M p=":">{'x = 0'}</M> <M>{'y/x'}</M> ist nicht definiert</>} en={<><M p=":">{'x = 0'}</M> <M>{'y/x'}</M> is undefined</>} /></div>
          : <div className={`row ${left ? 'bad' : 'ok'}`}><span className="key" /><M>{String.raw`\arctan(y/x) = ${d(calc)}^\circ`}</M>
              {left ? <b className="chip bad"><M>{String.raw`+180^\circ`}</M></b> : q4 ? <b className="chip q4"><M>{String.raw`+360^\circ`}</M></b> : <b className="chip ok">✓</b>}</div>}
        <button type="button" className="arctan-auto" onClick={() => setAuto((a) => !a)} disabled={reduced} aria-pressed={auto}>
          {auto ? tr('Anhalten', 'Stop') : tr('Automatisch', 'Run')}
        </button>
      </figcaption>
    </figure>
  );
}
