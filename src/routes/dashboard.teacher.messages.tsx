import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, MessageCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/messages")({
  head: () => ({ meta: [{ title: "المراسلة — EduVerse" }] }),
  component: TeacherMessagesPage,
});

interface Thread {
  student_id: string;
  full_name: string;
  student_code: string;
  last_body: string | null;
  last_at: string | null;
  unread_count: number;
}
interface Msg {
  id: string;
  body: string;
  sender_role: "teacher" | "student";
  created_at: string;
  is_read: boolean;
}

function TeacherMessagesPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data: aca } = await supabase
        .from("academies")
        .select("id")
        .eq("teacher_id", user.id)
        .maybeSingle();
      if (!aca) return;
      setAcademyId(aca.id);
    })();
  }, [user, role]);

  async function loadThreads(aId: string) {
    const { data } = await supabase.rpc("teacher_list_threads", { _academy_id: aId });
    setThreads((data as Thread[]) ?? []);
  }

  async function loadMessages(studentId: string) {
    if (!academyId) return;
    const { data } = await supabase
      .from("messages")
      .select("id, body, sender_role, created_at, is_read")
      .eq("academy_id", academyId)
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });
    setMessages((data as Msg[]) ?? []);
    // mark student messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("academy_id", academyId)
      .eq("student_id", studentId)
      .eq("sender_role", "student")
      .eq("is_read", false);
  }

  useEffect(() => {
    if (!academyId) return;
    void loadThreads(academyId);
    const ch = supabase
      .channel(`teacher-msgs-${academyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `academy_id=eq.${academyId}` },
        () => {
          void loadThreads(academyId);
          if (active) void loadMessages(active.student_id);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
    // eslint-disable-next-line
  }, [academyId, active?.student_id]);

  useEffect(() => {
    if (active) void loadMessages(active.student_id);
    // eslint-disable-next-line
  }, [active?.student_id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !academyId || !body.trim()) return;
    setSending(true);
    await supabase.from("messages").insert({
      academy_id: academyId,
      student_id: active.student_id,
      sender_role: "teacher",
      body: body.trim(),
    });
    setBody("");
    setSending(false);
    await loadMessages(active.student_id);
    await loadThreads(academyId);
  }

  return (
    <PageContainer>
      <PageHeader title="المراسلة" description="تواصل مع طلاب الأكاديمية" />
      {!academyId ? (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">يجب تعيينك لأكاديمية.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[70vh]">
          {/* Threads */}
          <div className={`bg-card-premium border border-border/60 rounded-2xl overflow-y-auto ${active ? "hidden lg:block" : ""}`}>
            {threads.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                لا يوجد طلاب بعد
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {threads.map((t) => (
                  <li key={t.student_id}>
                    <button
                      onClick={() => setActive(t)}
                      className={`w-full text-right p-3 hover:bg-accent/50 transition ${active?.student_id === t.student_id ? "bg-accent/40" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{t.full_name}</span>
                        {t.unread_count > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] rounded-full size-5 grid place-items-center">
                            {t.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {t.last_body ?? "ابدأ المحادثة"}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chat */}
          <div className={`bg-card-premium border border-border/60 rounded-2xl flex flex-col ${!active ? "hidden lg:flex" : "flex"}`}>
            {!active ? (
              <div className="flex-1 grid place-items-center text-center text-muted-foreground">
                <div>
                  <MessageCircle className="size-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">اختر طالباً لبدء المحادثة</p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-border p-3 flex items-center gap-2">
                  <button onClick={() => setActive(null)} className="lg:hidden size-8 grid place-items-center rounded-lg hover:bg-accent">
                    <ArrowRight className="size-4" />
                  </button>
                  <div>
                    <div className="font-semibold text-sm">{active.full_name}</div>
                    <div className="text-xs text-muted-foreground">{active.student_code}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender_role === "teacher" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                          m.sender_role === "teacher"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }`}
                      >
                        {m.body}
                        <div className="text-[10px] opacity-70 mt-1">
                          {new Date(m.created_at).toLocaleString("ar-EG")}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <form onSubmit={send} className="border-t border-border p-3 flex items-center gap-2">
                  <input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 bg-input border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !body.trim()}
                    className="size-10 grid place-items-center rounded-lg bg-gradient-primary text-primary-foreground disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
