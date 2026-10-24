import { useState } from 'react';
import { T, useLang, useTr } from '../../i18n';
import { SceneFig, ThChips } from './ChemFig';
import { SYS_FLOWS, systemScene, type SysKind } from './systemScene';

/** Slide 9 and exercise 4: open, closed, isolated — what may cross the boundary of the system. */
export function SystemTypesFigure() {
  const tr = useTr(), lang = useLang();
  const [kind, setKind] = useState<SysKind>('closed');
  const fl = SYS_FLOWS[kind];
  const yes = tr('ja', 'yes'), no = tr('nein', 'no');
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={systemScene(kind, lang)} label={tr('Drei Systeme: offener Topf, geschlossener Zylinder mit Kolben, isolierte Thermosflasche; Pfeile zeigen, was die Grenze kreuzt', 'Three systems: open pot, closed cylinder with piston, insulated thermos flask; arrows show what crosses the boundary')} />
      <figcaption>
        <ThChips label={tr('Systemtyp', 'System type')} value={kind} onPick={setKind} items={[
          { id: 'open', label: <T de="offen" en="open" /> }, { id: 'closed', label: <T de="geschlossen" en="closed" /> }, { id: 'isolated', label: <T de="isoliert" en="isolated" /> },
        ]} />
        <table className="th-table" aria-label={tr('Was die Systemgrenze passieren darf', 'What may cross the system boundary')}>
          <thead><tr><th /><th>{tr('Materie', 'Matter')}</th><th>{tr('Energie', 'Energy')}</th></tr></thead>
          <tbody><tr><td>{kind === 'open' ? tr('offen: Topf', 'open: pot') : kind === 'closed' ? tr('geschlossen: Kolben', 'closed: piston') : tr('isoliert: Thermosflasche', 'isolated: thermos flask')}</td>
            <td className={fl.matter ? 'ink-c-ok' : 'ink-c-bad'}><b>{fl.matter ? yes : no}</b></td><td className={fl.energy ? 'ink-c-ok' : 'ink-c-bad'}><b>{fl.energy ? yes : no}</b></td></tr></tbody>
        </table>
        <p className="th-note">{kind === 'open'
          ? tr('Dampf steigt auf (Materie geht), die Flamme heizt (Energie kommt).', 'Steam rises (matter leaves), the flame heats (energy arrives).')
          : kind === 'closed'
            ? tr('Das Gas bleibt im Zylinder, aber Wärme kann durch die Wand und der Kolben kann Arbeit leisten.', 'The gas stays in the cylinder, but heat can pass through the wall and the piston can do work.')
            : tr('Die doppelte Wand lässt weder Stoff noch Wärme durch (in der Praxis nur ungefähr).', 'The double wall lets neither matter nor heat through (in practice only approximately).')}</p>
      </figcaption>
    </figure>
  );
}
