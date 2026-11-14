import { CoursePage } from '../../components/CoursePage/CoursePage';

interface CourseRouteProps {
  params: Promise<{ id: string }>;
}

export default async function CourseRoute({ params }: CourseRouteProps) {
  const { id } = await params;
  return <CoursePage courseId={id} />;
}