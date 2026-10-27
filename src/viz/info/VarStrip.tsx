import { useTr } from '../../i18n';
import './info.css';

export interface StripVar { name: string; type: string; value: string; addr: number; size?: number }

/** Variables as labelled boxes in a row of memory: name (the label), type, value, address. The addresses are an illustration; the compiler chooses the real ones. */
export function VarStrip({ vars, caption }: { vars: StripVar[]; caption?: string }) {
  const tr = useTr();
  return (
    <figure className="vdemo vs-fig">
      <div className="vs-row">
        {vars.map((v) => (
          <div key={v.name} className="vs-var">
            <span className="vs-name"><code>{v.name}</code></span>
            <div className="vs-box"><code className="vs-val">{v.value}</code><span className="vs-type"><code>{v.type}</code></span></div>
            <span className="vs-addr">{tr('Adresse', 'address')} {v.addr}</span>
          </div>
        ))}
      </div>
      <figcaption className="vs-cap">{caption ?? tr('Name, Typ, Wert, Adresse. Die Adressen sind ein Beispiel; der Compiler wählt die echten.', 'Name, type, value, address. The addresses are an example; the compiler picks the real ones.')}</figcaption>
    </figure>
  );
}
