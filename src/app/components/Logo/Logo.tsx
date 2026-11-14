import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <svg
        width="42"
        height="30"
        viewBox="0 0 42 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0 4L15 15L0 26V4Z" fill="#5BC5F0" />
        <path d="M14 4L29 15L14 26V4Z" fill="#BCEC30" />
      </svg>
      <span className={styles.text}>SkyFitnessPro</span>
    </div>
  );
};