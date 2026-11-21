export const cleanExerciseName = (name: string): string => {
  return name.replace(/\s*\(.*?\)\s*$/, '').trim();
};