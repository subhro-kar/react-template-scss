import styles from '@/presentation/components/PageSkeleton.module.scss';

export function PageSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading">
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.block} />
    </div>
  );
}
