import { WorkoutPage } from '../../../../components/WorkoutPage/WorkoutPage';

interface WorkoutRouteProps {
  params: Promise<{ id: string; workoutId: string }>;
}

export default async function WorkoutRoute({ params }: WorkoutRouteProps) {
  const { id, workoutId } = await params;
  return <WorkoutPage courseId={id} workoutId={workoutId} />;
}