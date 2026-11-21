export const getWorkoutTitle = (name: string): string => {
  const [first] = name.split(' / ');
  return first.trim();
};