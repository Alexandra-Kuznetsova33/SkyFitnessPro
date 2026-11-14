'use client';

import { useEffect } from 'react';

import { CourseCard } from './components/CourseCard/CourseCard';
import { fetchAllCourses } from './redux/coursesSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import styles from './page.module.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.items);
  const isLoading = useAppSelector((state) => state.courses.isLoading);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка курсов...</div>;
  }

  return (
    <div className={styles.grid}>
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}