import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/courses/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = readDb();
    const course = db.courses.find((c) => c.id === id || c.slug === id);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// PUT /api/courses/[id] (Admin only)
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = readDb();

    const courseIndex = db.courses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const existing = db.courses[courseIndex];
    const updated = {
      ...existing,
      ...body,
      id: existing.id, // prevent ID change
      updatedAt: new Date().toISOString()
    };

    db.courses[courseIndex] = updated;
    writeDb(db);

    return NextResponse.json({
      message: "Course updated successfully!",
      course: updated
    });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
  }
}

// DELETE /api/courses/[id] (Admin only)
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const db = readDb();

    const exists = db.courses.some((c) => c.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    db.courses = db.courses.filter((c) => c.id !== id);
    // Also cleanup associated enrollments
    db.enrollments = db.enrollments.filter((e) => e.courseId !== id);

    writeDb(db);

    return NextResponse.json({
      message: "Course deleted successfully!"
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course." }, { status: 500 });
  }
}
