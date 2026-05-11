import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { subject, topic, existing_count } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `أنشئ سؤال اختيار من متعدد باللغة العربية في مادة "${subject}" حول الموضوع: "${topic}".
اجعل السؤال مختلفاً عن الأسئلة السابقة (رقم #${(existing_count ?? 0) + 1}).
المتطلبات: 4 خيارات، خيار واحد صحيح فقط، السؤال واضح ومناسب للطلاب.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت مساعد لإنشاء أسئلة تعليمية. أعد JSON فقط." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_question",
            description: "Create one MCQ in Arabic",
            parameters: {
              type: "object",
              properties: {
                question_text: { type: "string" },
                options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                correct_answer: { type: "integer", minimum: 0, maximum: 3 },
              },
              required: ["question_text", "options", "correct_answer"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_question" } },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: `AI error: ${res.status} ${text}` }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No tool call returned");
    const parsed = JSON.parse(args);
    return new Response(JSON.stringify(parsed), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
