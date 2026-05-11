import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { getStoredStudentToken } from "@/hooks/useStudentAuth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "لوحة التحكم — EduVerse" }] }),
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && getStoredStudentToken()) {
    return <Navigate to="/dashboard/student" />;
  }

  if (!user) return <Navigate to="/login" />;

  return <Navigate to={dashboardPathForRole(role)} />;
}
