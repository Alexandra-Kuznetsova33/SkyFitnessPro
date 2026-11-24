'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { addCourse, fetchCourseById } from '../../redux/coursesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { openAuthModal } from '../../redux/uiSlice';
import { getCourseColor } from '../../utils/courseColors';
import { getCourseImage, getCourseCoverImage } from '../../utils/courseImages';
import styles from './CoursePage.module.css';

interface CoursePageProps {
  courseId: string;
}

const BannerImage = ({ nameRU }: { nameRU: string }) => {
  const imageSrc = getCourseImage(nameRU);
  const coverSrc = getCourseCoverImage(nameRU);

  if (!imageSrc && !coverSrc) return null;

  return (
    <>
      {coverSrc && (
        <div className={styles.mobileBannerImage}>
          <Image
            src={coverSrc}
            alt={nameRU}
            width={343}
            height={343}
            className={styles.bannerImageMobile}
            priority
          />
        </div>
      )}

      {imageSrc && (
        <div className={styles.desktopBannerImage}>
          <Image
            src={imageSrc}
            alt={nameRU}
            width={600}
            height={400}
            className={styles.bannerImage}
            priority
          />
        </div>
      )}
    </>
  );
};

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
        <BannerImage nameRU={course.nameRU} />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
        <ul className={styles.fittingList}>
          {course.fitting.map((item, index) => (
            <li key={item} className={styles.fittingCard}>
              <span className={styles.fittingNumber}>{index + 1}</span>
              <span className={styles.fittingText}>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Направления</h2>
        <div className={styles.directionsBox}>
          <ul className={styles.directionsGrid}>
            {course.directions.map((item) => (
              <li key={item} className={styles.directionItem}>
                <svg
                  className={styles.directionIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={styles.benefitsWrapper}>
        <div className={styles.runnerBlock} aria-hidden="true">
          <Image
            src="/runner.png"
            alt=""
            width={604}
            height={604}
            className={styles.runnerImage}
            aria-hidden="true"
          />
        </div>
        <div className={styles.vectorMask} aria-hidden="true">
          <Image
            src="/vector.svg"
            alt=""
            width={670}
            height={391}
            className={styles.vectorImage}
            unoptimized
          />
        </div>
        <div className={styles.benefitsCard}>
          <div className={styles.textColumn}>
            <h2 className={styles.benefitsTitle}>
              Начните путь
              <br />к новому телу
            </h2>
            <ul className={styles.benefitsList}>
              {BENEFITS.map((item) => (
                <li key={item} className={styles.benefitItem}>
                  <span className={styles.benefitDot} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddClick}
              disabled={isAdded && !!user}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
