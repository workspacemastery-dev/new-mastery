import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/quizzes")({
  head: () => ({ meta: [{ title: "اختباراتي — EduVerse" }] }),
  component: StudentQuizzesList,
});

interface QuizRow { id: string; title: string; duration_minutes: number }

function StudentQuizzesList() {
  const { session } = useStudentAuth();
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      const { data } = await supabase.rpc("student_get_quizzes", { _token: session.token });
      setQuizzes(((data ?? []) as unknown) as QuizRow[]);
    })();
  }, [session]);

  return (
    <PageContainer>
      <PageHeader title="الاختبارات" description="الاختبارات المتاحة لك" />
      {quizzes.length === 0 ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          <ClipboardList className="size-10 mx-auto mb-3 opacity-40" />
          لا اختبارات متاحة الآن.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <Link key={q.id} to="/dashboard/student/quiz/$quizId" params={{ quizId: q.id }}
              className="block bg-card-premium border border-border/60 rounded-2xl p-5 hover:border-primary/40 transition">
              <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center mb-3">
                <ClipboardList className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{q.title}</h3>
              <p className="text-xs text-muted-foreground">المدة: {q.duration_minutes} دقيقة</p>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
