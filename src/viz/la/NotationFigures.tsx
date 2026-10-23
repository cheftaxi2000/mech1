import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { mat } from '../../linalg/gauss';
import { ELine, PLabel, Plot, Pt, Seg } from '../plot/Plot';
import { StepPlayer } from '../anim/StepPlayer';
import { QMatrix } from './GaussMatrix';
import { STAGE_ASPECT, notationScene } from './notationScene';
import { OPS, POINT, STAGES, twinScene, type Eq3 } from './twinScene';
import './gauss.css';

const t = String.raw;

/* ================================================================ slide 25: standard form → A x = b → [A | b] */
export function NotationMorph() {
  const tr = useTr();
  const steps = [
    { ms: 700, holdMs: 2400, caption: <T de={<>Die <b>Standardform</b>: drei Gleichungen untereinander. Gleiche Unbekannte stehen übereinander.</>} en={<>The <b>standard form</b>: three equations, one below the other. Equal unknowns stand in one column.</>} /> },
    { ms: 1400, holdMs: 2600, caption: <T de={<>Die <b>Matrixform</b> <M p=":">{t`A\cdot x = b`}</M> Die Zahlen wandern in die Matrix <M p=",">A</M> die Unbekannten in den Vektor <M p=",">x</M> die rechten Seiten in <M p=".">b</M> Aus <M>{t`-x_3`}</M> wird die Zahl <M p=".">-1</M></>} en={<>The <b>matrix form</b> <M p=":">{t`A\cdot x = b`}</M> The numbers move into the matrix <M p=",">A</M> the unknowns into the vector <M p=",">x</M> the right-hand sides into <M p=".">b</M> <M>{t`-x_3`}</M> becomes the number <M p=".">-1</M></>} /> },
    { ms: 1400, holdMs: 2600, caption: <T de={<>Die <b>erweiterte Matrix</b>: <M>b</M> rückt als letzte Spalte hinter einen Strich. Oben steht, wozu jede Spalte gehört: <M p=".">{t`x_1, x_2, x_3 \mid 1`}</M></>} en={<>The <b>augmented matrix</b> (<i lang="de">erweiterte Matrix</i>): <M>b</M> becomes the last column, behind a bar. On top: what each column belongs to, <M p=".">{t`x_1, x_2, x_3 \mid 1`}</M></>} /> },
    { ms: 900, holdMs: 2400, caption: <T de={<>Vereinfacht: Die Überschriften lässt man weg. Man weiss ja, dass Spalte <M>j</M> zu <M>{t`x_j`}</M> gehört. Übrig bleiben nur die Zahlen.</>} en={<>Simplified: the headers are dropped. We know that column <M>j</M> belongs to <M p=".">{t`x_j`}</M> Only the numbers are left.</>} /> },
  ];
  return (
    <StepPlayer steps={steps} label={tr('Vom Gleichungssystem zur erweiterten Matrix', 'From the system to the augmented matrix')}>
      {(s, tt) => (
        <div className="anim-fig">
          <div className="nm-stage" style={{ aspectRatio: `1 / ${STAGE_ASPECT}` }}>
            {notationScene(s, tt).map((k) => {
              if (k.o < 0.005) return null;
              const style = { left: `${k.x}%`, top: `${k.y}%`, opacity: k.o };
              if (k.kind === 'bar') return <div key={k.id} className="nm-bar" style={{ ...style, height: `${k.h}%` }} />;
              if (k.kind !== 'tok') return <div key={k.id} className={`nm-br ${k.kind === 'brL' ? 'l' : 'r'}`} style={{ ...style, height: `${k.h}%` }} />;
              return <div key={k.id} className={`nm-tok ${k.role}`} style={style}><M>{k.tex}</M></div>;
            })}
          </div>
        </div>
      )}
    </StepPlayer>
  );
}

/* ================================================================ slide 33 as lines: every row operation replaces one line */
const LINE_ROLE = ['f', 'g'] as const;
const eqTex = (l: Eq3) => {
  const term = (a: number, v: string, first: boolean) => (a === 0 ? '' : `${a < 0 ? '-' : first ? '' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a)}${v}`);
  const s = term(l[0], 'x_1', true) + term(l[1], 'x_2', l[0] === 0);
  return `${s} = ${l[2]}`;
};

export function TwinLines() {
  const tr = useTr();
  const steps = [
    { ms: 800, holdMs: 2600, caption: <T de={<>Zwei Gleichungen, zwei Geraden: <M>{t`\mathrm{I}`}</M> (blau) und <M>{t`\mathrm{II}`}</M> (magenta). Der Schnittpunkt löst beide.</>} en={<>Two equations, two lines: <M>{t`\mathrm{I}`}</M> (blue) and <M>{t`\mathrm{II}`}</M> (magenta). The intersection solves both.</>} /> },
    { ms: 2200, holdMs: 2800, caption: <T de={<><M p=":">{OPS[1]}</M> Gerade <M>{t`\mathrm{II}`}</M> dreht sich um den Schnittpunkt, bis sie waagrecht ist: <M p=".">{t`-3x_2 = -6`}</M> Der Schnittpunkt bleibt, wo er ist.</>} en={<><M p=":">{OPS[1]}</M> line <M>{t`\mathrm{II}`}</M> turns around the intersection until it is horizontal: <M p=".">{t`-3x_2 = -6`}</M> The intersection stays where it is.</>} /> },
    { ms: 2200, holdMs: 2800, caption: <T de={<><M p=":">{OPS[2]}</M> Jetzt dreht sich Gerade <M>{t`\mathrm{I}`}</M> bis sie senkrecht ist: <M p=".">{t`x_1 = 1`}</M> Das ist die vereinfachte Form.</>} en={<><M p=":">{OPS[2]}</M> now line <M>{t`\mathrm{I}`}</M> turns until it is vertical: <M p=".">{t`x_1 = 1`}</M> This is the reduced form.</>} /> },
    { ms: 900, holdMs: 2400, caption: <T de={<>Eine senkrechte und eine waagrechte Gerade: Den Schnittpunkt liest man direkt ab, <M p=".">{t`(x_1, x_2) = (1, 2)`}</M></>} en={<>One vertical and one horizontal line: the intersection is read off directly, <M p=".">{t`(x_1, x_2) = (1, 2)`}</M></>} /> },
  ];
  return (
    <StepPlayer steps={steps} label={tr('Zeilenoperationen als Geraden, die sich um den Schnittpunkt drehen', 'Row operations as lines turning about the intersection')}>
      {(s, tt) => {
        const f = twinScene(s, tt);
        const stage = tt >= 1 ? STAGES[s] : STAGES[Math.max(0, s - 1)];
        const M2 = mat(stage.map((l) => [...l]));
        return (
          <div className="anim-fig ge-anim">
            <div className="tw-wrap">
              <Plot x={[-1, 4.5]} y={[-1, 4.5]} w={360} h={360} axes={['x_1', 'x_2']}
                label={tr('Zwei Geraden in der Ebene mit Schnittpunkt (1, 2)', 'Two lines in the plane with intersection (1, 2)')}>
                {f.ghost && <ELine a={f.ghost.eq[0]} b={f.ghost.eq[1]} c={f.ghost.eq[2]} role="ref" dashed />}
                {f.lines.map((l, i) => <g key={i} style={{ opacity: f.o }}><ELine a={l[0]} b={l[1]} c={l[2]} role={LINE_ROLE[i]} width={f.moving === i ? 3.2 : 2.4} /></g>)}
                {f.reading > 0 && <g style={{ opacity: f.reading }}>
                  <Seg a={[POINT[0], 0]} b={POINT} role="aux" dashed />
                  <Seg a={[0, POINT[1]]} b={POINT} role="aux" dashed />
                </g>}
                <Pt x={POINT[0]} y={POINT[1]} />
                <PLabel x={POINT[0]} y={POINT[1]} dx={10} dy={-12} anchor="l" role="pt" tex={f.reading >= 1 ? '(1, 2)' : 'S'} />
                {f.o > 0.5 && <>
                  {f.moving !== 0 && <PLabel x={f.lines[0][1] === 0 ? 1 : -0.5} y={f.lines[0][1] === 0 ? 4.05 : (f.lines[0][2] - f.lines[0][0] * -0.5) / f.lines[0][1]} dx={10} dy={0} anchor="l" role="f" tex={t`\mathrm{I}`} />}
                  {f.moving !== 1 && <PLabel x={f.lines[1][0] === 0 ? 3.9 : 1.75} y={f.lines[1][0] === 0 ? 2 : (f.lines[1][2] - f.lines[1][0] * 1.75) / f.lines[1][1]} dx={f.lines[1][0] === 0 ? 0 : 12} dy={f.lines[1][0] === 0 ? -14 : 0} anchor={f.lines[1][0] === 0 ? 'c' : 'l'} role="g" tex={t`\mathrm{II}`} />}
                </>}
              </Plot>
              <div className="tw-side">
                <div className="tw-op">{f.op ? <M>{f.op}</M> : <span aria-hidden="true">&nbsp;</span>}</div>
                <QMatrix m={M2} nVars={2} label={tr('Erweiterte Matrix', 'Augmented matrix')} />
                <div className="ge-eqs">
                  {stage.map((l, i) => <div key={i}><M>{t`\mathrm{${i === 0 ? 'I' : 'II'}}`}</M><M>{eqTex(l)}</M></div>)}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}
