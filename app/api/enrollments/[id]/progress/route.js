import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// PUT /api/enrollments/[id]/progress
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { lessonId, completed } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required." }, { status: 400 });
    }

    const db = readDb();
    const enrollment = db.enrollments.find((e) => e.id === id || (e.courseId === id && e.userId === user.id));

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment record not found." }, { status: 404 });
    }

    // Verify ownership
    if (enrollment.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Not your enrollment." }, { status: 403 });
    }

    const course = db.courses.find((c) => c.id === enrollment.courseId);
    const totalLessons = course?.lessons?.length || 1;

    let completedSet = new Set(enrollment.completedLessons || []);
    if (completed) {
      completedSet.add(lessonId);
    } else {
      completedSet.delete(lessonId);
    }

    const updatedCompletedLessons = Array.from(completedSet);
    const progressPercent = Math.min(100, Math.round((updatedCompletedLessons.length / totalLessons) * 100));

    enrollment.completedLessons = updatedCompletedLessons;
    enrollment.progress = progressPercent;
    enrollment.status = progressPercent === 100 ? "completed" : "in-progress";
    enrollment.lastAccessedAt = new Date().toISOString();

    writeDb(db);

    return NextResponse.json({
      message: "Progress updated successfully!",
      progress: progressPercent,
      completedLessons: updatedCompletedLessons,
      status: enrollment.status,
      enrollment
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress." }, { status: 500 });
  }
}
