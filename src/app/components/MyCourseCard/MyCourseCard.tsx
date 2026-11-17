'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import type { Course } from '../../sharedTypes/types';
import { fetchCourseProgress } from '../../redux/progressSlice';
import { removeCourse } from '../../redux/coursesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { calcCourseProgress } from '../../utils/calcCourseProgress';
import { getCourseColor } from '../../utils/courseColors';
import styles from './MyCourseCard.module.css';

interface MyCourseCardProps {
  course: Course;
}

export const MyCourseCard = ({ course }: MyCourseCardProps) => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => state.progress.courseProgressById[course._id]);
  const isPending = useAppSelector((state) => state.courses.isMyCoursesLoading);

  useEffect(() => {
    dispatch(fetchCourseProgress(course._id));
  }, [dispatch, course._id]);

  const percent = calcCourseProgress(progress?.workoutsProgress, course.workouts.length);

  const bgColor = getCourseColor(course.nameRU);

  const handleRemove = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const action = await dispatch(removeCourse(course._id));

    if (removeCourse.rejected.match(action)) {
      const errorMessage = typeof action.payload === 'string' ? action.payload : null;
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return;
    }

    toast.success('Курс удалён');
  };

  const getButtonLabel = (): string => {
    if (percent === 0) return 'Начать тренировки';
    if (percent === 100) return 'Начать заново';
    return 'Продолжить';
  };

  const handleActionClick = () => {
    toast.info('Переход на страницу тренировки будет в следующем шаге');
  };

  return (
    <article className={styles.card}>
      <Link href={`/courses/${course._id}`} className={styles.cardLink}>
        <div className={styles.cover} style={{ backgroundColor: bgColor }} />

        <div className={styles.info}>
          <h3 className={styles.title}>{course.nameRU}</h3>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="14" height="12" rx="2" stroke="#000000" strokeWidth="1.5" />
                <path d="M2 8H16" stroke="#000000" strokeWidth="1.5" />
                <path d="M6 2V5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 2V5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{course.durationInDays} дней</span>
            </span>

            <span className={styles.metaItem}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="7" stroke="#000000" strokeWidth="1.5" />
                <path d="M9 5V9L12 11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>
                {course.dailyDurationInMinutes.from}-{course.dailyDurationInMinutes.to} мин/день
              </span>
            </span>

            <span className={styles.metaItem}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="11" width="2.5" height="5" fill="#5BC5F0" />
                <rect x="5.5" y="8" width="2.5" height="8" fill="#5BC5F0" />
                <rect x="9" y="5" width="2.5" height="11" fill="#5BC5F0" />
                <rect x="12.5" y="2" width="2.5" height="14" fill="#5BC5F0" />
              </svg>
              <span>Сложность</span>
            </span>
          </div>

          <div className={styles.progressSection}>
            <span className={styles.progressLabel}>Прогресс {percent}%</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={styles.removeButton}
        onClick={handleRemove}
        disabled={isPending}
        aria-label="Удалить курс"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 10H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className={styles.actionButton}
        onClick={handleActionClick}
      >
        {getButtonLabel()}
      </button>
    </article>
  );
};