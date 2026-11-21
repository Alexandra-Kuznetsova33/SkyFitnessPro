'use client';

import { useEffect, useMemo, useState } from 'react';

import { WorkoutProgressModal } from '../WorkoutProgressModal/WorkoutProgressModal';
import { WorkoutProgressSuccessModal } from '../WorkoutProgressSuccessModal/WorkoutProgressSuccessModal';
import { fetchCourseById } from '../../redux/coursesSlice';
import { fetchWorkoutById, fetchCourseWorkouts } from '../../redux/workoutsSlice';
import { fetchWorkoutProgressById } from '../../redux/progressSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { calcExerciseProgress } from '../../utils/calcExerciseProgress';
import { getWorkoutTitle } from '../../utils/getWorkoutTitle';
import { cleanExerciseName } from '../../utils/cleanExerciseName';
import { getYoutubeEmbedUrl } from '../../utils/getYoutubeEmbedUrl';
import styles from './WorkoutPage.module.css';

interface WorkoutPageProps {
  courseId: string;
  workoutId: string;
}

export const WorkoutPage = ({ courseId, workoutId }: WorkoutPageProps) => {
  const dispatch = useAppDispatch();

  const workout = useAppSelector((state) => state.workouts.currentWorkout);
  const isWorkoutLoading = useAppSelector((state) => state.workouts.isCurrentLoading);
  const workoutError = useAppSelector((state) => state.workouts.currentError);

  const course = useAppSelector((state) => state.courses.currentCourse);
  const workoutsByCourse = useAppSelector((state) => state.workouts.byCourseId[courseId]);

  const progress = useAppSelector((state) => state.progress.workoutProgressById[workoutId]);

  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkoutById(workoutId));
    dispatch(fetchCourseById(courseId));
    dispatch(fetchCourseWorkouts(courseId));
    dispatch(fetchWorkoutProgressById({ courseId, workoutId }));
  }, [dispatch, courseId, workoutId]);

  const workoutNumber = useMemo(() => {
    if (!workoutsByCourse) return null;
    const index = workoutsByCourse.findIndex((w) => w._id === workoutId);
    return index >= 0 ? index + 1 : null;
  }, [workoutsByCourse, workoutId]);

  const progressData = progress?.progressData ?? [];
  const hasAnyProgress = progressData.some((value) => value > 0);

  if (workoutError) {
    return <p className={styles.error}>{workoutError}</p>;
  }

  if (isWorkoutLoading || !workout) {
    return <p className={styles.loading}>Загрузка тренировки...</p>;
  }

  const courseTitle = course?.nameRU ?? getWorkoutTitle(workout.name);

  const handleProgressClick = () => {
    setIsProgressOpen(true);
  };

  const handleProgressSaved = () => {
    setIsProgressOpen(false);
    setIsSuccessOpen(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.title}>{courseTitle}</h1>
      </div>

      <div className={styles.videoWrapper}>
        <iframe
          className={styles.video}
          src={getYoutubeEmbedUrl(workout.video)}
          title={getWorkoutTitle(workout.name)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <section className={styles.exercisesSection}>
        <h2 className={styles.sectionTitle}>
          Упражнения тренировки
          {workoutNumber ? ` ${workoutNumber}` : ''}
        </h2>

        <ul className={styles.exerciseList}>
          {workout.exercises.map((exercise, index) => {
            const done = progressData[index] ?? 0;
            const percent = calcExerciseProgress(done, exercise.quantity);

            return (
              <li key={exercise._id} className={styles.exerciseItem}>
                <div className={styles.exerciseRow}>
                  <span className={styles.exerciseName}>{cleanExerciseName(exercise.name)}</span>
                  <span className={styles.exercisePercent}>{percent}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                </div>
              </li>
            );
          })}
        </ul>

        {workout.exercises.length > 0 ? (
          <button type="button" className={styles.progressButton} onClick={handleProgressClick}>
            {hasAnyProgress ? 'Обновить свой прогресс' : 'Заполнить свой прогресс'}
          </button>
        ) : (
          <p className={styles.emptyExercises}>В этой тренировке пока нет упражнений</p>
        )}
      </section>

      <WorkoutProgressModal
        isOpen={isProgressOpen}
        courseId={courseId}
        workoutId={workoutId}
        onClose={() => setIsProgressOpen(false)}
        onSaved={handleProgressSaved}
      />

      <WorkoutProgressSuccessModal isOpen={isSuccessOpen} onClose={handleCloseSuccess} />
    </div>
  );
};
