'use client';

import { toast } from 'react-toastify';

import type { Course } from '../../sharedTypes/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { openAuthModal } from '../../redux/uiSlice';
import styles from './CourseCard.module.css';

interface CourseCardProps {
  course: Course;
}

const COVER_COLORS: Record<string, string> = {
  Йога: '#FFC700',
  Стретчинг: '#5BC5F0',
  Фитнес: '#F7A030',
  'Степ-аэробика': '#F25C5C',
  Бодифлекс: '#9D5CC9',
};

const DEFAULT_COLOR = '#BCEC30';

export const CourseCard = ({ course }: CourseCardProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const isAdded = user?.selectedCourses.includes(course._id) ?? false;
  const bgColor = COVER_COLORS[course.nameRU] ?? DEFAULT_COLOR;

  const handleAddClick = () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    toast.info(
      isAdded
        ? 'Удаление курса будет реализовано в следующем шаге'
        : 'Добавление курса будет реализовано в следующем шаге',
    );
  };

  return (
    <article className={styles.card}>
      <div className={styles.cover} style={{ backgroundColor: bgColor }}>
        <button
          type="button"
          className={`${styles.addButton} ${isAdded ? styles.addButtonAdded : ''}`}
          onClick={handleAddClick}
          aria-label={isAdded ? 'Удалить курс' : 'Добавить курс'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {isAdded ? (
              <path d="M4 10H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M10 4V16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 10H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{course.nameRU}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="4"
                width="14"
                height="12"
                rx="2"
                stroke="#000000"
                strokeWidth="1.5"
              />
              <path d="M2 8H16" stroke="#000000" strokeWidth="1.5" />
              <path d="M6 2V5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 2V5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{course.durationInDays} дней</span>
          </span>

          <span className={styles.metaItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="7" stroke="#000000" strokeWidth="1.5" />
              <path d="M9 5V9L12 11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>
              {course.dailyDurationInMinutes.from}-{course.dailyDurationInMinutes.to} мин/день
            </span>
          </span>

          <span className={styles.metaItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2" y="11" width="2.5" height="5" fill="#5BC5F0" />
              <rect x="5.5" y="8" width="2.5" height="8" fill="#5BC5F0" />
              <rect x="9" y="5" width="2.5" height="11" fill="#5BC5F0" />
              <rect x="12.5" y="2" width="2.5" height="14" fill="#5BC5F0" />
            </svg>
            <span>Сложность</span>
          </span>
        </div>
      </div>
    </article>
  );
};