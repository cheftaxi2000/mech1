import { useTr } from '../../i18n';
import './info.css';

const CELLS = ['01001101', '11010101', '00010010', '00000000', '11101001', '00101110'];

/** Fig. 1.5 / 1.6 of the notes as one picture: CPU, bus, RAM and I/O, and below it what memory really is – numbered cells of bits. */
export function ArchFigure() {
  const tr = useTr();
  return (
    <figure className="vdemo vn-fig">
      <div className="vn-arch">
        <div className="vn-cpu">
          <b>{tr('Prozessor (CPU)', 'Central processing unit (CPU)')}</b>
          <div className="vn-cpu-parts">
            <span>{tr('Steuerwerk', 'control unit')}</span>
            <span>{tr('Rechenwerk (ALU)', 'arithmetic/logic unit')}</span>
            <span className="reg">{tr('Register', 'registers')}</span>
          </div>
        </div>
        <div className="vn-bus"><span aria-hidden="true">↕</span> {tr('Bus', 'bus')} <span aria-hidden="true">↕</span></div>
        <div className="vn-low">
          <div className="vn-ram"><b>RAM</b><small>{tr('Programme und Daten', 'programs and data')}</small></div>
          <div className="vn-io"><b><code>I/O</code></b><small>{tr('Tastatur, Bildschirm, …', 'keyboard, screen, …')}</small></div>
        </div>
      </div>
      <div className="vn-mem" role="img" aria-label={tr('Speicher: nummerierte Zellen mit je 8 Bit', 'Memory: numbered cells of 8 bits each')}>
        {CELLS.map((c, k) => (
          <div key={k} className="vn-cell"><span className="vn-adr">{tr('Adresse', 'address')} {k}</span><code>{c}</code></div>
        ))}
      </div>
    </figure>
  );
}
