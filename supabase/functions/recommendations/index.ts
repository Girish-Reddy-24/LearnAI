import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
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

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        course_id,
        progress,
        courses (
          category,
          difficulty_level
        )
      `)
      .eq("student_id", user.id);

    const enrolledCategories = new Set();
    const completedCategories = new Set();
    let avgProgress = 0;

    if (enrollments && enrollments.length > 0) {
      enrollments.forEach((enrollment: any) => {
        if (enrollment.courses?.category) {
          enrolledCategories.add(enrollment.courses.category);
          if (enrollment.progress >= 80) {
            completedCategories.add(enrollment.courses.category);
          }
        }
        avgProgress += enrollment.progress || 0;
      });
      avgProgress = avgProgress / enrollments.length;
    }

    const { data: allCourses } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .limit(20);

    const enrolledIds = new Set(enrollments?.map((e: any) => e.course_id) || []);
    const availableCourses = allCourses?.filter((c: any) => !enrolledIds.has(c.id)) || [];

    const recommendations = [];

    for (const category of enrolledCategories) {
      const sameCategoryCourses = availableCourses.filter(
        (c: any) => c.category === category
      );
      recommendations.push(...sameCategoryCourses.slice(0, 2));
    }

    const beginnerCourses = availableCourses.filter(
      (c: any) => c.difficulty_level === "beginner" && !recommendations.find((r: any) => r.id === c.id)
    ).slice(0, 2);
    recommendations.push(...beginnerCourses);

    const popularCourses = availableCourses
      .filter((c: any) => !recommendations.find((r: any) => r.id === c.id))
      .slice(0, 3);
    recommendations.push(...popularCourses);

    const uniqueRecommendations = Array.from(
      new Map(recommendations.map((r: any) => [r.id, r])).values()
    ).slice(0, 6);

    const recommendationsWithReason = uniqueRecommendations.map((course: any) => {
      let reason = "Recommended for you";
      
      if (enrolledCategories.has(course.category)) {
        reason = `Continue your ${course.category} learning journey`;
      } else if (course.difficulty_level === "beginner") {
        reason = "Great for expanding your skills";
      } else if (completedCategories.size > 0) {
        reason = "Next step in your learning path";
      }

      return {
        ...course,
        recommendation_reason: reason,
        match_score: Math.floor(Math.random() * 30) + 70
      };
    });

    return new Response(
      JSON.stringify({
        recommendations: recommendationsWithReason,
        user_stats: {
          enrolled_courses: enrollments?.length || 0,
          average_progress: Math.round(avgProgress),
          categories_explored: enrolledCategories.size
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in recommendations:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});