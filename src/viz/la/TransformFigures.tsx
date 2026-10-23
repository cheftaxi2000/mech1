import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import type { M2, V2 } from '../../linalg/plane2';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { PlaneView } from './PlaneView';
import { COLLAPSE_STEPS, collapseScene } from './collapseScene';
import { fitView } from './planeItems';
import { trPoints, trScene } from './trScene';

const t = String.raw;

/* ================================================================ slides 18–20: the collapse onto a line */
function CollapseFrame({ step, tt }: { step: number; tt: number }) {
  const tr = useTr(), lang = useLang();
  const sc = collapseScene(step, tt, lang);
  return (
    <div className="la-collapse" data-morph={sc.t.toFixed(3)}>
      <PlaneView view={sc.view} items={sc.items}
        label={tr('Die Matrix (1 −2; 2 −4) drückt die Ebene auf eine Gerade', 'The matrix (1 −2; 2 −4) squashes the plane onto a line')} />
    </div>
  );
}

export function CollapseAnim() {
  const tr = useTr(), lang = useLang();
  const sep = lang === 'de' ? ';\\ ' : ',\\ ';
  const v = (a: string, b: string) => t`(${a}${sep}${b})^T`;
  const steps: AnimStep[] = [
    { ms: 1400, holdMs: 1600, caption: <T
      de={<>Vorher: das gewohnte Gitter, rot <M p=",">{t`v = ${v('-2', '-2')}`}</M> violett <M p=".">{t`w = ${v('1', '-2')}`}</M></>}
      en={<>Before: the usual grid, red <M p=",">{t`v = ${v('-2', '-2')}`}</M> purple <M p=".">{t`w = ${v('1', '-2')}`}</M></>} /> },
    { ms: 1800, holdMs: 2200, caption: <T
      de={<>Die Spalten zeigen, wohin <M>{'e_1'}</M> und <M>{'e_2'}</M> gehen: nach <M>{'a_1'}</M> und <M p=".">{'a_2'}</M> Beide liegen auf derselben Geraden, denn <M p=".">{t`a_2 = -2\,a_1`}</M></>}
      en={<>The columns show where <M>{'e_1'}</M> and <M>{'e_2'}</M> go: to <M>{'a_1'}</M> and <M p=".">{'a_2'}</M> Both lie on the same line, since <M p=".">{t`a_2 = -2\,a_1`}</M></>} /> },
    { ms: 2800, holdMs: 2200, caption: <T
      de={<>Jetzt wirkt <M p=":">A</M> Das ganze Gitter klappt auf die Gerade zusammen. <M>v</M> landet auf <M p=",">{v('2', '4')}</M> <M>w</M> auf <M p=".">{v('5', '10')}</M></>}
      en={<>Now <M>A</M> acts: the whole grid folds onto the line. <M>v</M> lands on <M p=",">{v('2', '4')}</M> <M>w</M> on <M p=".">{v('5', '10')}</M></>} /> },
    { ms: 1800, holdMs: 2200, caption: <T
      de={<>Spaltenweise gelesen: <M p=".">{t`a_1(-2) + a_2(-2) = ${v('-2', '-4')} + ${v('4', '8')} = ${v('2', '4')}`}</M> Beide Teile liegen auf der Geraden, also auch die Summe.</>}
      en={<>Read by columns: <M p=".">{t`a_1(-2) + a_2(-2) = ${v('-2', '-4')} + ${v('4', '8')} = ${v('2', '4')}`}</M> Both parts lie on the line, so does the sum.</>} /> },
    { ms: 1800, holdMs: 2400, caption: <T
      de={<>Ebenso für <M p=":">w</M> <M p=".">{t`a_1(1) + a_2(-2) = ${v('1', '2')} + ${v('4', '8')} = ${v('5', '10')}`}</M> Jede Eingabe landet auf dieser Geraden.</>}
      en={<>Likewise for <M p=":">w</M> <M p=".">{t`a_1(1) + a_2(-2) = ${v('1', '2')} + ${v('4', '8')} = ${v('5', '10')}`}</M> Every input lands on this line.</>} /> },
  ];
  if (steps.length !== COLLAPSE_STEPS) throw new Error('collapse steps');
  return (
    <StepPlayer steps={steps} label={tr('Rang 1: die Ebene klappt auf eine Gerade zusammen', 'Rank 1: the plane folds onto a line')}>
      {(step, tt) => <CollapseFrame step={step} tt={tt} />}
    </StepPlayer>
  );
}

/* ================================================================ slide 21: small pictures */
export function LandPicture({ A, x, label }: { A: M2; x: V2; label: string }) {
  const lang = useLang();
  const view = fitView(trPoints(A, [x]), 360, 300, { minSpan: 6, margin: 1 });
  const sc = trScene({ A, t: 1, lang, inputs: [{ id: 'x', p: x, role: 'ax', label: 'x', imgLabel: 'Ax', stair: true, ghost: true, value: true }] }, view);
  return <PlaneView view={view} items={sc.items} label={label} className="la-mini-plane" />;
}
