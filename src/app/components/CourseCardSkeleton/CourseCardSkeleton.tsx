import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './CourseCardSkeleton.module.css';

export const CourseCardSkeleton = () => {
  return (
    <article className={styles.card}>
      <Skeleton className={styles.cover} />
      <div className={styles.info}>
        <Skeleton width={180} height={28} />
        <div className={styles.meta}>
          <Skeleton width={110} height={30} borderRadius={50} />
          <Skeleton width={140} height={30} borderRadius={50} />
          <Skeleton width={100} height={30} borderRadius={50} />
        </div>
      </div>
    </article>
  );
};