"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Users, BookOpen, DollarSign, TrendingUp, Search, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function AdminDashboard({
  courses = [],
  onOpenCreateCourse,
  onOpenEditCourse,
  onDeleteCourse
}) {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [courses]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin & Instructor Studio</h1>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Comprehensive real-time overview of courses, student enrollments, and platform analytics
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateCourse}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Course</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Registered Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats?.metrics?.totalStudents || 0}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium">Active Learners</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Courses Published</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {courses.length}
          </p>
          <span className="text-[10px] text-purple-400 font-medium">Across 6 Disciplines</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Enrollments</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats?.metrics?.totalEnrollments || 0}
          </p>
          <span className="text-[10px] text-cyan-400 font-medium">Avg. {stats?.metrics?.averageProgress || 0}% Completed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">
            ${stats?.metrics?.totalRevenue || "0.00"}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Gross Course Sales</span>
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Course Management</h2>
            <p className="text-xs text-slate-400">Manage course syllabus, pricing, levels, and publication status</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Enrolled</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-10 h-7 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-white line-clamp-1">{course.title}</p>
                      <span className="text-[10px] text-slate-500">{course.lessons?.length || 0} Modules • {course.duration}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-indigo-300">{course.category}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300">
                      {course.level}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </td>
                  <td className="py-3 px-3">{course.enrolledCount} students</td>
                  <td className="py-3 px-3 text-amber-400 font-semibold">★ {course.rating}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenEditCourse(course)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Course"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(course.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Student Enrollments Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Student Enrollments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase bg-slate-950/60 border-y border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recentEnrollments?.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{enr.studentName}</p>
                    <span className="text-[10px] text-slate-500">{enr.studentEmail}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-200 line-clamp-1">{enr.courseTitle}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">{enr.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      enr.status === "completed"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-indigo-950 text-indigo-400 border border-indigo-800/50"
                    }`}>
                      {enr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                    {new Date(enr.enrolledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete this course?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete this course and all associated enrollments? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCourse(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Yes, Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
