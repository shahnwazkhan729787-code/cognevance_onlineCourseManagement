import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";


// GET /api/courses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const sort = searchParams.get("sort") || "popular";

    const db = readDb();
    let courses = [...(db.courses || [])];

    // Filter by search query
    if (search) {
      courses = courses.filter((c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.shortDescription?.toLowerCase().includes(search) ||
        c.instructor?.name?.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (category && category !== "All") {
      courses = courses.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by level
    if (level && level !== "All") {
      courses = courses.filter((c) => c.level.toLowerCase() === level.toLowerCase());
    }

    // Sort courses
    if (sort === "rating") {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "newest") {
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: popular (by enrolledCount)
      courses.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
    }

    return NextResponse.json({
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses." }, { status: 500 });
  }
}

// POST /api/courses (Admin only)
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required to create courses." }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      level = "Beginner",
      duration = "10 Hours",
      price = 0,
      shortDescription,
      description,
      thumbnail,
      instructorName,
      lessons = []
    } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Course title is required." }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: "Course category is required." }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Course description is required." }, { status: 400 });
    }

    const db = readDb();
    const courseId = `crs_${Date.now()}`;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const formattedLessons = Array.isArray(lessons) && lessons.length > 0
      ? lessons.map((les, index) => ({
          id: les.id || `les_${courseId}_${index + 1}`,
          title: les.title || `Lesson ${index + 1}`,
          duration: les.duration || "20m",
          videoUrl: les.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
          summary: les.summary || "Comprehensive lesson guide and actionable tasks."
        }))
      : [
          {
            id: `les_${courseId}_1`,
            title: "Course Overview & Learning Objectives",
            duration: "15m",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            summary: "Getting started with core principles."
          }
        ];

    const newCourse = {
      id: courseId,
      title: title.trim(),
      slug,
      category: category.trim(),
      level,
      duration,
      price: parseFloat(price) || 0,
      rating: 5.0,
      enrolledCount: 0,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      shortDescription: shortDescription?.trim() || description.trim().slice(0, 120) + "...",
      description: description.trim(),
      instructor: {
        name: instructorName?.trim() || user.name,
        title: "Course Instructor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      lessons: formattedLessons,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.courses.unshift(newCourse);
    writeDb(db);

    return NextResponse.json({
      message: "Course created successfully!",
      course: newCourse
    }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}
