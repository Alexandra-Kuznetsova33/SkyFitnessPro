'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { Modal } from '../Modal/Modal';
import { saveWorkoutProgressThunk } from '../../redux/progressSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cleanExerciseName } from '../../utils/cleanExerciseName';
import styles from './WorkoutProgressModal.module.css';

interface WorkoutProgressModalProps {
  isOpen: boolean;
  courseId: string;
  workoutId: string;
  onClose: () => void;
  onSaved: () => void;
}

interface WorkoutProgressFormProps {
  courseId: string;
  workoutId: string;
  onSaved: () => void;
}

const WorkoutProgressForm = ({ courseId, workoutId, onSaved }: WorkoutProgressFormProps) => {
  const dispatch = useAppDispatch();

  const workout = useAppSelector((state) => state.workouts.currentWorkout);
  const progress = useAppSelector((state) => state.progress.workoutProgressById[workoutId]);

  const exercises = workout?.exercises ?? [];
  const savedProgress = progress?.progressData ?? [];

  const [inputs, setInputs] = useState<string[]>(() =>
    exercises.map((_, index) => savedProgress[index]?.toString() ?? ''),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (index: number, value: string) => {
    setInputs((prev) => prev.map((item, i) => (i === index ? value : item)));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const progressData: number[] = [];
    for (let i = 0; i < exercises.length; i += 1) {
      const raw = inputs[i]?.trim() ?? '';
      if (raw === '') {
        progressData.push(0);
        continue;
      }
      const num = Number(raw);
      if (!Number.isFinite(num) || num < 0 || !Number.isInteger(num)) {
        setError('Введите целое неотрицательное число в каждом поле');
        return;
      }
      progressData.push(num);
    }

    setIsSaving(true);
    const action = await dispatch(
      saveWorkoutProgressThunk({ courseId, workoutId, progressData }),
    );
    setIsSaving(false);

    if (saveWorkoutProgressThunk.rejected.match(action)) {
      const message = typeof action.payload === 'string' ? action.payload : null;
      if (message) toast.error(message);
      return;
    }

    onSaved();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Мой прогресс</h2>

      <div className={styles.scrollArea}>
        {exercises.map((exercise, index) => (
          <div key={exercise._id} className={styles.field}>
            <label htmlFor={`exercise-${exercise._id}`} className={styles.label}>
              Сколько раз вы сделали {cleanExerciseName(exercise.name).toLowerCase()}?
            </label>
            <input
              id={`exercise-${exercise._id}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={inputs[index] ?? ''}
              onChange={(e) => handleChange(index, e.target.value)}
              className={styles.input}
              disabled={isSaving}
            />
            <span className={styles.hint}>из {exercise.quantity}</span>
          </div>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="button"
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isSaving || exercises.length === 0}
      >
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
};

export const WorkoutProgressModal = ({
  isOpen,
  courseId,
  workoutId,
  onClose,
  onSaved,
}: WorkoutProgressModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <WorkoutProgressForm courseId={courseId} workoutId={workoutId} onSaved={onSaved} />
    </Modal>
  );
};