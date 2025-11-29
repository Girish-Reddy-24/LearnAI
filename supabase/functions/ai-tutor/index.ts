import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateIntelligentResponse } from "./responses.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TutorRequest {
  question: string;
  courseId?: string;
  context?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { question, courseId, context, conversationHistory }: TutorRequest = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let courseInfo = "";
    if (courseId) {
      const { data: course } = await supabase
        .from("courses")
        .select("title, description, category, level")
        .eq("id", courseId)
        .maybeSingle();

      if (course) {
        courseInfo = `Course: ${course.title} (${course.category}, ${course.level} level). ${course.description || ""}`;
      }
    }

    const systemPrompt = `You are an expert AI tutor for an intelligent learning platform. Your role is to help students understand complex topics by:

1. Providing clear, accurate, and educational explanations
2. Breaking down complex concepts into digestible parts
3. Using relevant examples and analogies
4. Encouraging critical thinking with guiding questions
5. Adapting your explanations to the student's level
6. Being patient, encouraging, and supportive

${courseInfo ? `Current Context: ${courseInfo}` : ""}
${context ? `Additional Context: ${context}` : ""}

Guidelines:
- Keep responses focused and concise (2-4 paragraphs)
- Use markdown formatting for better readability
- Include examples when helpful
- If the question is unclear, ask clarifying questions
- For coding questions, provide clear code examples with explanations
- Always encourage further questions and deeper learning`;

    let aiResponse: string;

    if (openaiApiKey) {
      try {
        const messages = [
          { role: "system", content: systemPrompt },
          ...(conversationHistory || []).slice(-6),
          { role: "user", content: question }
        ];

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 0.9,
          }),
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.text();
          console.error("OpenAI API error:", errorData);
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const data = await openaiResponse.json();
        aiResponse = data.choices[0].message.content;
      } catch (error) {
        console.error("Error calling OpenAI:", error);
        aiResponse = generateIntelligentResponse(question, courseInfo);
      }
    } else {
      aiResponse = generateIntelligentResponse(question, courseInfo);
    }

    const response = {
      response: aiResponse,
      timestamp: new Date().toISOString(),
    };

    if (courseId && user.id) {
      const conversationEntry = [
        { role: "user", content: question, timestamp: new Date().toISOString() },
        { role: "assistant", content: aiResponse, timestamp: response.timestamp }
      ];

      await supabase
        .from("ai_tutor_sessions")
        .insert({
          student_id: user.id,
          course_id: courseId,
          conversation: conversationEntry,
          session_start: new Date().toISOString(),
          topic_covered: question.substring(0, 100)
        });
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-tutor:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
