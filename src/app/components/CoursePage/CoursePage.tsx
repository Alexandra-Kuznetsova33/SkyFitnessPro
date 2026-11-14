'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { addCourse, fetchCourseById } from '../../redux/coursesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { openAuthModal } from '../../redux/uiSlice';
import { getCourseColor } from '../../utils/courseColors';
import styles from './CoursePage.module.css';

interface CoursePageProps {
  courseId: string;
}

const BENEFITS = [
  'проработка всех групп мышц',
  'тренировка суставов',
  'улучшение циркуляции крови',
  'упражнения заряжают бодростью',
  'помогают противостоять стрессам',
];

export const CoursePage = ({ courseId }: CoursePageProps) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) => state.courses.currentCourse);
  const isLoading = useAppSelector((state) => state.courses.isCurrentLoading);
  const error = useAppSelector((state) => state.courses.currentError);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (isLoading || !course) {
    return <p className={styles.loading}>Загрузка курса...</p>;
  }

  const isAdded = user?.selectedCourses.includes(course._id) ?? false;

  const handleAddClick = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    if (isAdded) {
      toast.info('Курс уже добавлен в ваш профиль');
      return;
    }

    const action = await dispatch(addCourse(course._id));

    if (addCourse.rejected.match(action)) {
      const errorMessage = typeof action.payload === 'string' ? action.payload : null;
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return;
    }

    toast.success('Курс добавлен');
  };

  const buttonLabel = !user
    ? 'Войдите, чтобы добавить курс'
    : isAdded
      ? 'Курс добавлен'
      : 'Добавить курс';

  return (
    <div className={styles.page}>
      <div className={styles.banner} style={{ backgroundColor: getCourseColor(course.nameRU) }}>
        <h1 className={styles.title}>{course.nameRU}</h1>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
        <ul className={styles.sectionList}>
          {course.fitting.map((item, index) => (
            <li key={item} className={styles.fittingItem}>
              <span className={styles.fittingNumber}>{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Направления</h2>
        <ul className={styles.directionsList}>
          {course.directions.map((item) => (
            <li key={item} className={styles.directionItem}>
              <span className={styles.directionPlus}>+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Начните путь к новому телу</h2>
        <ul className={styles.benefitsList}>
          {BENEFITS.map((item) => (
            <li key={item} className={styles.benefitItem}>
              <span className={styles.benefitDot} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.runnerWrapper}>
        <Image
          src="/vector.svg"
          alt=""
          width={1000}
          height={500}
          className={styles.vectorImage}
          aria-hidden="true"
        />
        <Image
          src="/runner.png"
          alt="Спортсмен"
          width={600}
          height={600}
          className={styles.runnerImage}
        />
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={isAdded && !!user}
      >
        {buttonLabel}
      </button>
    </div>
  );
};
