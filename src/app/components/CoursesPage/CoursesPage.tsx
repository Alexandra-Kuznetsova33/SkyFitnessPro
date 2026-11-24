'use client';

import { useEffect } from 'react';

import { CourseCard } from '../CourseCard/CourseCard';
import { CourseCardSkeleton } from '../CourseCardSkeleton/CourseCardSkeleton';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import { fetchAllCourses } from '../../redux/coursesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './CoursesPage.module.css';

const SKELETON_COUNT = 6;

export const CoursesPage = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.items);
  const isLoading = useAppSelector((state) => state.courses.isLoading);
  const error = useAppSelector((state) => state.courses.error);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <div className={styles.speechBubble}>
          Измени своё
          <br />
          тело за полгода!
        </div>
      </div>
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          : courses.map((course) => <CourseCard key={course._id} course={course} />)}
      </div>

      {!isLoading && courses.length > 0 && <ScrollToTop />}
    </div>
  );
};
