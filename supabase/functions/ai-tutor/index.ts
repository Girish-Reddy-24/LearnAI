import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TutorRequest {
  question: string;
  courseId?: string;
  context?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { question, courseId, context }: TutorRequest = await req.json();

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
        .select("title, description")
        .eq("id", courseId)
        .maybeSingle();
      
      if (course) {
        courseInfo = `Course: ${course.title}. ${course.description || ""}`;
      }
    }

    const systemPrompt = `You are an intelligent AI tutor helping students learn. ${courseInfo ? courseInfo : ""} ${context ? `Context: ${context}` : ""} Provide clear, educational responses that explain concepts thoroughly but concisely, use examples and analogies, break down complex topics into digestible parts, encourage critical thinking, and provide step-by-step guidance when appropriate. Keep responses focused, helpful, and encouraging.`;

    const aiResponse = `Great question! Let me help you understand this better. Regarding "${question}":${courseInfo ? ` In the context of ${courseInfo.split(":")[1].split(".")[0]},` : ""} This is an important concept to master. Here's a comprehensive explanation: 1. Core Concept: The fundamental idea relates to how we approach problem-solving in this domain. Think of it as building blocks - each concept builds upon previous knowledge. 2. Practical Application: In real-world scenarios, this translates to being able to analyze situations and apply the right techniques. For example, when working on projects, you'll use these principles to make informed decisions. 3. Key Takeaway: Understanding this concept will help you progress to more advanced topics. Practice is essential - try applying this to different examples. Would you like me to elaborate on any specific aspect or provide more examples?`;

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
          conversation: conversationEntry
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