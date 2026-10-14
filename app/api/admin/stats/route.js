import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";


// GET /api/admin/stats
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const db = readDb();
    const students = db.users.filter((u) => u.role === "student");
    const courses = db.courses || [];
    const enrollments = db.enrollments || [];

    // Calculate revenue
    const totalRevenue = enrollments.reduce((sum, enr) => {
      const course = courses.find((c) => c.id === enr.courseId);
      return sum + (course ? course.price || 0 : 0);
    }, 0);

    // Calculate category distribution
    const categoryCounts = {};
    courses.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Recent enrollments with user and course names
    const recentEnrollments = enrollments
      .slice(-10)
      .reverse()
      .map((enr) => {
        const student = db.users.find((u) => u.id === enr.userId);
        const course = courses.find((c) => c.id === enr.courseId);
        return {
          id: enr.id,
          studentName: student ? student.name : "Unknown Student",
          studentEmail: student ? student.email : "N/A",
          courseTitle: course ? course.title : "Deleted Course",
          progress: enr.progress,
          status: enr.status,
          enrolledAt: enr.enrolledAt
        };
      });

    return NextResponse.json({
      metrics: {
        totalStudents: students.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageProgress: enrollments.length > 0
          ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
          : 0
      },
      categoryCounts,
      recentEnrollments
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to generate stats." }, { status: 500 });
  }
}
