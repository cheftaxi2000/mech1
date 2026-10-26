import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { Arrow, KLabel, t } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 300, 170];

/**
 * Kontaktkraft vs. Fernkraft (p. 29): two small drawings, no controls.
 * Left: a hand pushes a box — the point of application A is where the two touch.
 * Right: the Earth pulls an apple — nothing touches, yet there is a force on the apple.
 */
export function K1Contact() {
  const tr = useTr();
  return (
    <figure className="vdemo kf-wide">
      <div className="kf-pair">
        <div className="kf-panel">
          <div className="vdemo-fig">
            <svg className="kf-svg pan" viewBox={VB.join(' ')} aria-label={tr('Eine Hand schiebt eine Kiste: Berührung', 'A hand pushes a box: contact')}>
              <line x1={4} y1={132} x2={296} y2={132} className="kf-axis" />
              <rect x={150} y={76} width={96} height={56} rx={4} className="kf-body" />
              <rect x={46} y={97} width={80} height={16} rx={8} className="kf-hand" />
              <rect x={118} y={86} width={32} height={38} rx={9} className="kf-hand" />
              <Arrow a={[96, 105]} b={[150, 105]} cls="kf-f" />
              <circle cx={150} cy={105} r={5} className="kf-pt solid" />
            </svg>
            <KLabel vb={VB} x={100} y={76} ink="force">{t`\{A\,|\,\v F\}`}</KLabel>
            <KLabel vb={VB} x={168} y={88} ink="point">A</KLabel>
          </div>
          <p className="cap"><b>{tr('Kontaktkraft', 'Contact force')}</b>{' – '}{tr('Hand und Kiste berühren sich. Der Angriffspunkt ', 'hand and box touch. The point of application ')}<M>A</M>{tr(' liegt dort, wo sie sich berühren.', ' is where they touch.')}</p>
        </div>
        <div className="kf-panel">
          <div className="vdemo-fig">
            <svg className="kf-svg pan" viewBox={VB.join(' ')} aria-label={tr('Die Erde zieht einen Apfel an: keine Berührung', 'The Earth pulls an apple: no contact')}>
              <circle cx={150} cy={440} r={296} className="kf-ground" />
              <circle cx={150} cy={50} r={17} className="kf-apple" />
              <path d="M150 33 q2 -9 9 -11" className="kf-stem" />
              <line x1={196} y1={70} x2={196} y2={144} className="kf-bracket" />
              <line x1={190} y1={70} x2={202} y2={70} className="kf-bracket" /><line x1={190} y1={144} x2={202} y2={144} className="kf-bracket" />
              <Arrow a={[150, 50]} b={[150, 112]} cls="kf-f" />
              <circle cx={150} cy={50} r={4.5} className="kf-pt solid" />
            </svg>
            <KLabel vb={VB} x={176} y={92} ink="force" anchor="l">{t`\{A\,|\,\v F\}`}</KLabel>
            <KLabel vb={VB} x={128} y={42} ink="point" anchor="r">A</KLabel>
            <div className="vdemo-label small fg" style={{ left: '77%', top: '67%' }}>{tr('Abstand', 'gap')}</div>
          </div>
          <p className="cap"><b>{tr('Fernkraft', 'Action at a distance')}</b>{' – '}{tr('Erde und Apfel berühren sich nicht, trotzdem zieht die Erde. Der Angriffspunkt ', 'Earth and apple do not touch, yet the Earth pulls. The point of application ')}<M>A</M>{tr(' sitzt am Apfel.', ' sits on the apple.')}</p>
        </div>
      </div>
    </figure>
  );
}
