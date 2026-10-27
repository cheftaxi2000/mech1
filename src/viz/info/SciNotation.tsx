import { useTr } from '../../i18n';
import './info.css';

/** Anatomy of the literal 1.23e-7f (notes Fig. 4.1): integer part, fractional part, exponent, type suffix. */
export function SciNotation() {
  const tr = useTr();
  return (
    <figure className="vdemo sn-fig">
      <div className="sn-lit" role="img" aria-label="1.23e-7f"><code><span className="p1">1</span><span className="pd">.</span><span className="p2">23</span><span className="p3">e-7</span><span className="p4">f</span></code></div>
      <div className="sn-labels">
        <span className="p1">{tr('Ganzzahlteil', 'integer part')}</span>
        <span className="p2">{tr('Nachkommastellen', 'fractional part')}</span>
        <span className="p3">{tr('Exponent (Zehnerpotenz)', 'exponent (power of ten)')}</span>
        <span className="p4">{tr('Typ: float', 'type: float')}</span>
      </div>
      <figcaption className="vs-cap">{tr('Wert: 1,23 · 10⁻⁷, ohne f ist es ein double.', 'Value: 1.23 · 10⁻⁷, without f it is a double.')}</figcaption>
    </figure>
  );
}
