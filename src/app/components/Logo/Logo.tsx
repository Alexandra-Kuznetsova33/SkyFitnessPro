import Image from 'next/image';

import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo.svg"
        alt="SkyFitnessPro"
        width={220}
        height={35}
        priority
        unoptimized
        className={styles.image}
      />
    </div>
  );
};