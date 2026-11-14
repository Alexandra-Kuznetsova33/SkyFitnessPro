'use client';

import { useEffect } from 'react';

import { fetchCourseById } from '../../redux/coursesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCourseColor } from '../../utils/courseColors';
import styles from './CoursePage.module.css';

interface CoursePageProps {
  courseId: string;
}

export const CoursePage = ({ courseId }: CoursePageProps) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) => state.courses.currentCourse);
  const isLoading = useAppSelector((state) => state.courses.isCurrentLoading);
  const error = useAppSelector((state) => state.courses.currentError);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (isLoading || !course) {
    return <p className={styles.loading}>Загрузка курса...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.banner} style={{ backgroundColor: getCourseColor(course.nameRU) }}>
        <h1 className={styles.title}>{course.nameRU}</h1>
      </div>

      <p className={styles.description}>{course.description}</p>
    </div>
  );
};