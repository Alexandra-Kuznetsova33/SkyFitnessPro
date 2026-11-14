// ===== Базовые ответы API =====

export interface MessageResponse {
  message: string;
}

// ===== Auth =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// ===== Пользователь =====

export interface User {
  _id: string;
  email: string;
  selectedCourses: string[];
  courseProgress: string[];
  createdAt: string;
  updatedAt: string;
}

// ===== Курсы =====

export interface DailyDuration {
  from: number;
  to: number;
}

export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  workouts: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: DailyDuration;
}

// ===== Тренировки =====

export interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

// ===== Прогресс =====

export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface CourseProgress {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
}

export interface SingleWorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}
