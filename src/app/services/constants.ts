export const BASE_URL = '/api/fitness';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  users: {
    me: '/users/me',
    myCourses: '/users/me/courses',
    myCourseById: (courseId: string) => `/users/me/courses/${courseId}`,
    myProgress: '/users/me/progress',
  },
  courses: {
    all: '/courses',
    byId: (courseId: string) => `/courses/${courseId}`,
    workouts: (courseId: string) => `/courses/${courseId}/workouts`,
    reset: (courseId: string) => `/courses/${courseId}/reset`,
    workoutProgress: (courseId: string, workoutId: string) =>
      `/courses/${courseId}/workouts/${workoutId}`,
    workoutReset: (courseId: string, workoutId: string) =>
      `/courses/${courseId}/workouts/${workoutId}/reset`,
  },
  workouts: {
    byId: (workoutId: string) => `/workouts/${workoutId}`,
  },
} as const;