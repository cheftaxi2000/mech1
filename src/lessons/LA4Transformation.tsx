import { T } from '../i18n';
import { TransformExplorer } from '../viz/la/TransformExplorer';

export default function LA4Transformation() {
  return (
    <article className="lesson">
      <T de={<p className="lede">Test</p>} en={<p className="lede">Test</p>} />
      <TransformExplorer />
    </article>
  );
}
