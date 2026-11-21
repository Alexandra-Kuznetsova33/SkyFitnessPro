'use client';

import { Modal } from '../Modal/Modal';
import styles from './WorkoutProgressSuccessModal.module.css';

interface WorkoutProgressSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutProgressSuccessModal = ({
  isOpen,
  onClose,
}: WorkoutProgressSuccessModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ваш прогресс засчитан!</h2>
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#BCEC30" />
            <path
              d="M24 40L36 52L58 30"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Modal>
  );
};