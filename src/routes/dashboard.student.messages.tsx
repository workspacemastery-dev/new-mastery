import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student/messages")({
  head: () => ({ meta: [{ title: "المراسلة — EduVerse" }] }),
  component: StudentMessagesPage,
});

interface Msg {
  id: string;
  body: string;
  sender_role: "teacher" | "student";
  created_at: string;
  is_read: boolean;
}

function StudentMessagesPage() {
  const { session } = useStudentAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  async function load() {
    if (!session) return;
    const { data } = await supabase.rpc("student_list_messages", { _token: session.token });
    setMessages((data as Msg[]) ?? []);
    setLoading(false);
    await supabase.rpc("student_mark_read", { _token: session.token });
  }

  useEffect(() => {
    if (!session) return;
    void load();
    const ch = supabase
      .channel(`msgs-${session.student_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `student_id=eq.${session.student_id}`,
        },
        () => void load(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
    // eslint-disable-next-line
  }, [session?.student_id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !body.trim()) return;
    setSending(true);
    await supabase.rpc("student_send_message", { _token: session.token, _body: body.trim() });
    setBody("");
    setSending(false);
    await load();
  }

  if (!session) return null;

  return (
    <PageContainer>
      <PageHeader title="المراسلة مع المعلم" description="تواصل مباشر مع معلم الأكاديمية" />
      <div className="bg-card-premium border border-border/60 rounded-2xl flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="h-full grid place-items-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-muted-foreground">
              <div>
                <MessageCircle className="size-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">لا توجد رسائل بعد. ابدأ المحادثة مع معلمك.</p>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender_role === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.sender_role === "student"
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
            ))
          )}
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
      </div>
    </PageContainer>
  );
}
