import { Link } from 'react-router';
import { featureFlags } from '../../application/featureFlags.ts';
import styles from './Home.module.scss';

export function Home() {
  return (
    <section className={styles.home}>
      <h1>React SCSS Template</h1>
      <p className={styles.lede}>
        React 19, TypeScript, Vite, pnpm, react-router, SCSS Modules, and PWA support — wired as
        clean architecture layers: <code>domain</code>, <code>application</code>,{' '}
        <code>infrastructure</code>, <code>presentation</code>.
      </p>
      {featureFlags.tasks && (
        <p>
          The example feature is live: <Link to="/tasks">open the tasks demo</Link> to see a
          use case flow through every layer.
        </p>
      )}
      <p className={styles.hint}>
        Use this repository as a GitHub template, rename the app in <code>package.json</code>,{' '}
        <code>index.html</code>, and <code>vite.config.ts</code>, then delete the example
        feature folder.
      </p>
    </section>
  );
}