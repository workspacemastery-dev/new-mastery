import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/dashboard/student/courses"
)({
  component: CoursesLayout,
});

function CoursesLayout() {
  return <Outlet />;
}