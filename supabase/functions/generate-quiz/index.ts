import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuizRequest {
  courseId: string;
  topic: string;
  difficulty: string;
  numQuestions: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { courseId, topic, difficulty, numQuestions }: QuizRequest = await req.json();

    if (!courseId || !topic) {
      return new Response(
        JSON.stringify({ error: "courseId and topic are required" }),
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

    const { data: course } = await supabase
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .maybeSingle();

    const questions = [];
    const questionCount = numQuestions || 5;

    for (let i = 0; i < questionCount; i++) {
      const questionTypes = [
        {
          question: `What is the primary purpose of ${topic} in ${course?.title || 'this course'}?`,
          options: [
            `To provide fundamental understanding of ${topic} concepts`,
            `To memorize specific ${topic} definitions`,
            `To avoid learning ${topic} entirely`,
            `To replace traditional ${topic} methods`
          ],
          correctAnswer: 0,
          explanation: `The primary purpose is to provide a fundamental understanding of ${topic} concepts, which forms the foundation for advanced learning.`
        },
        {
          question: `Which of the following best describes ${topic}?`,
          options: [
            `A theoretical concept with no practical application`,
            `An important skill used in professional environments`,
            `An outdated practice no longer relevant`,
            `A simple task requiring minimal effort`
          ],
          correctAnswer: 1,
          explanation: `${topic} is an important skill widely used in professional environments, making it valuable for career development.`
        },
        {
          question: `When applying ${topic}, what is the most critical factor to consider?`,
          options: [
            `Understanding the underlying principles and best practices`,
            `Memorizing exact steps without understanding`,
            `Avoiding documentation and resources`,
            `Working in isolation without feedback`
          ],
          correctAnswer: 0,
          explanation: `Understanding the underlying principles and best practices is crucial for effective application of ${topic}.`
        },
        {
          question: `What is a common mistake when learning ${topic}?`,
          options: [
            `Practicing regularly with varied examples`,
            `Rushing through concepts without proper understanding`,
            `Asking questions when confused`,
            `Reviewing previous material periodically`
          ],
          correctAnswer: 1,
          explanation: `Rushing through concepts without proper understanding is a common mistake that can lead to gaps in knowledge.`
        },
        {
          question: `How does ${topic} relate to real-world applications in ${course?.title || 'the field'}?`,
          options: [
            `It has no practical applications`,
            `It forms the foundation for solving industry problems`,
            `It only applies to academic settings`,
            `It contradicts professional practices`
          ],
          correctAnswer: 1,
          explanation: `${topic} forms the foundation for solving industry problems and is essential for professional work in ${course?.title || 'the field'}.`
        }
      ];

      questions.push(questionTypes[i % questionTypes.length]);
    }

    const quizData = {
      course_id: courseId,
      title: `${topic} - ${difficulty || 'Medium'} Level Quiz`,
      description: `Test your knowledge on ${topic} from ${course?.title || 'this course'}`,
      questions: questions,
      created_by: user.id
    };

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert(quizData)
      .select()
      .single();

    if (quizError) {
      throw quizError;
    }

    return new Response(
      JSON.stringify({ quiz, message: "Quiz generated successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-quiz:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});