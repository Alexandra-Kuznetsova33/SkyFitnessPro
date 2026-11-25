'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Modal } from '../Modal/Modal';
import { fetchCourseWorkouts } from '../../redux/workoutsSlice';
import { fetchCourseProgress } from '../../redux/progressSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeWorkoutModal } from '../../redux/uiSlice';
import styles from './WorkoutSelectModal.module.css';
import { getWorkoutTitle } from '../../utils/getWorkoutTitle';

export const WorkoutSelectModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const courseId = useAppSelector((state) => state.ui.workoutModalCourseId);
  const course = useAppSelector((state) => state.courses.myCourses.find((c) => c._id === courseId));
  const workouts = useAppSelector((state) =>
    courseId ? state.workouts.byCourseId[courseId] : undefined,
  );
  const isLoading = useAppSelector((state) => state.workouts.isLoading);
  const error = useAppSelector((state) => state.workouts.error);
  const progress = useAppSelector((state) =>
    courseId ? state.progress.courseProgressById[courseId] : undefined,
  );

  const [userChoice, setUserChoice] = useState<{ courseId: string; workoutId: string } | null>(
    null,
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseWorkouts(courseId));
      dispatch(fetchCourseProgress(courseId));
    }
  }, [dispatch, courseId]);

  const completedIds = useMemo(() => {
    return new Set(
      progress?.workoutsProgress?.filter((w) => w.workoutCompleted).map((w) => w.workoutId) ?? [],
    );
  }, [progress]);

  const defaultId = useMemo(() => {
    if (!workouts || workouts.length === 0) return null;
    const firstUncompleted = workouts.find((w) => !completedIds.has(w._id));
    return (firstUncompleted ?? workouts[0])._id;
  }, [workouts, completedIds]);

  const selectedId = userChoice?.courseId === courseId ? userChoice.workoutId : defaultId;

  const handleSelect = (workoutId: string) => {
    if (!courseId) return;
    setUserChoice({ courseId, workoutId });
  };

  const isWorkoutCompleted = (workoutId: string): boolean => {
    return completedIds.has(workoutId);
  };

  const handleStart = () => {
    if (!courseId || !selectedId) return;
    dispatch(closeWorkoutModal());
    router.push(`/courses/${courseId}/workouts/${selectedId}`);
  };

  return (
    <Modal isOpen={Boolean(courseId)} onClose={() => dispatch(closeWorkoutModal())} maxWidth="460px">
      <div className={styles.container}>
        <h2 className={styles.title}>Выберите тренировку</h2>

        {error && <p className={styles.error}>{error}</p>}

        {!error && isLoading && <p className={styles.loading}>Загрузка тренировок...</p>}

        {!error && !isLoading && workouts && workouts.length === 0 && (
          <p className={styles.empty}>В этом курсе пока нет тренировок</p>
        )}

        {!error && !isLoading && workouts && workouts.length > 0 && (
          <div className={styles.content}>
            <ul className={styles.list}>
              {workouts.map((workout, index) => {
                const completed = isWorkoutCompleted(workout._id);
                const selected = selectedId === workout._id;

                return (
                  <li key={workout._id}>
                    <button
                      type="button"
                      className={`${styles.workoutButton} ${selected ? styles.workoutButtonSelected : ''}`}
                      onClick={() => handleSelect(workout._id)}
                    >
                      <span
                        className={`${styles.statusIcon} ${completed ? styles.statusCompleted : ''}`}
                        aria-hidden="true"
                      >
                        {completed && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M2 7L6 11L12 3"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className={styles.workoutInfo}>
                        <span className={styles.workoutName}>{getWorkoutTitle(workout.name)}</span>
                        <span className={styles.workoutMeta}>
                          {course
                            ? `${course.nameRU} на каждый день / ${index + 1} день`
                            : `День ${index + 1}`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className={styles.startButton}
              onClick={handleStart}
              disabled={!selectedId}
            >
              Начать
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
