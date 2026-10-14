import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";


// GET /api/enrollments (Get user's enrollments)
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const db = readDb();
    const userEnrollments = db.enrollments.filter((e) => e.userId === user.id);

    // Attach full course details to each enrollment
    const detailedEnrollments = userEnrollments.map((enr) => {
      const course = db.courses.find((c) => c.id === enr.courseId);
      return {
        ...enr,
        course: course || null
      };
    });

    return NextResponse.json({
      enrollments: detailedEnrollments
    });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments." }, { status: 500 });
  }
}

// POST /api/enrollments (Enroll in a course)
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Please log in to enroll in this course." }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }

    const db = readDb();
    const course = db.courses.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Check if already enrolled
    const alreadyEnrolled = db.enrollments.find(
      (e) => e.userId === user.id && e.courseId === courseId
    );
    if (alreadyEnrolled) {
      return NextResponse.json({
        message: "You are already enrolled in this course.",
        enrollment: alreadyEnrolled
      });
    }

    const newEnrollment = {
      id: `enr_${Date.now()}`,
      userId: user.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString(),
      completedLessons: [],
      progress: 0,
      status: "in-progress",
      lastAccessedAt: new Date().toISOString()
    };

    db.enrollments.push(newEnrollment);

    // Increment course enrolled count
    course.enrolledCount = (course.enrolledCount || 0) + 1;

    writeDb(db);

    return NextResponse.json({
      message: "Successfully enrolled in course!",
      enrollment: {
        ...newEnrollment,
        course
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json({ error: "Failed to enroll in course." }, { status: 500 });
  }
}
