'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { MyCourseCard } from '../MyCourseCard/MyCourseCard';
import { fetchMyCourses } from '../../redux/coursesSlice';
import { logout } from '../../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  const myCourses = useAppSelector((state) => state.courses.myCourses);
  const isMyCoursesLoading = useAppSelector((state) => state.courses.isMyCoursesLoading);
  const myCoursesError = useAppSelector((state) => state.courses.myCoursesError);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/');
    }
  }, [isInitialized, user, router]);

  useEffect(() => {
    if (user && user.selectedCourses.length > 0) {
      dispatch(fetchMyCourses(user.selectedCourses));
    }
  }, [dispatch, user]);

  if (!isInitialized || !user) {
    return <p className={styles.loading}>Загрузка профиля...</p>;
  }

  const login = user.email.split('@')[0];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Профиль</h1>

      <section className={styles.userCard}>
        <div className={styles.avatar}>
          <Image
            src="/profile-big.png"
            alt=""
            width={197}
            height={197}
            className={styles.avatarImage}
          />
        </div>

        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{login}</h2>
          <p className={styles.userLogin}>Логин: {login}</p>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>Мои курсы</h2>

        {myCoursesError && <p className={styles.error}>{myCoursesError}</p>}

        {!myCoursesError && isMyCoursesLoading && (
          <p className={styles.loading}>Загрузка курсов...</p>
        )}

        {!myCoursesError && !isMyCoursesLoading && myCourses.length === 0 && (
          <p className={styles.empty}>У вас пока нет добавленных курсов</p>
        )}

        {!myCoursesError && !isMyCoursesLoading && myCourses.length > 0 && (
          <div className={styles.coursesList}>
            {myCourses.map((course) => (
              <MyCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
