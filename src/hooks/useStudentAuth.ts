import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "eduverse_student_session";

export interface StudentSession {
  student_id: string;
  academy_id: string;
  full_name: string;
  student_code: string;
  academy_slug: string;
  academy_name: string;
  token: string;
}

export function getStoredStudentToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setStoredStudentToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, token);
}

export function clearStudentSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function useStudentAuth() {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredStudentToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("validate_student_session", { _token: token });
      if (error || !data || data.length === 0) {
        clearStudentSession();
        setSession(null);
      } else {
        const row = data[0];
        setSession({
          student_id: row.student_id,
          academy_id: row.academy_id,
          full_name: row.full_name,
          student_code: row.student_code,
          academy_slug: row.academy_slug,
          academy_name: row.academy_name,
          token,
        });
      }
      setLoading(false);
    })();
  }, []);

  function logout() {
    clearStudentSession();
    setSession(null);
  }

  return { session, loading, logout };
}
