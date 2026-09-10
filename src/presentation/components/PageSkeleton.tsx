import styles from '@/presentation/components/PageSkeleton.module.scss';
import { Skeleton } from '@/presentation/components/Skeleton.tsx';

// Route-level loading state: one status announcement for assistive tech,
// composed from decorative Skeleton pieces.

export function PageSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading">
      <Skeleton width="60%" height="1.5rem" radius="pill" />
      <Skeleton width="100%" />
      <Skeleton width="100%" />
      <Skeleton width="60%" />
      <Skeleton height="6rem" />
    </div>
  );
}
