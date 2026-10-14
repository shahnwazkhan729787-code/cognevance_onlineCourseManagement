"use client";
import React from "react";
import { BookOpen, Award, Clock, CheckCircle2, PlayCircle, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import CourseCard from "./CourseCard";

export default function StudentDashboard({
  user,
  enrollments = [],
  onOpenPlayer,
  onExploreCourses
}) {
  const completedCount = enrollments.filter((e) => e.progress === 100).length;
  const inProgressCount = enrollments.filter((e) => e.progress < 100).length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Student Learning Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Learner"}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              You're making great progress! Continue where you left off or explore new industry skills.
            </p>
          </div>

          <button
            onClick={onExploreCourses}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all self-start md:self-auto"
          >
            <span>Browse More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-400">Enrolled Courses</span>
            </div>
            <p className="text-2xl font-bold text-white">{enrollments.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-400">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-white">{inProgressCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-400">Completed</span>
            </div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-400">Avg. Completion</span>
            </div>
            <p className="text-2xl font-bold text-white">{avgProgress}%</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">My Enrolled Courses</h2>
            <p className="text-xs text-slate-400 mt-0.5">Resume your interactive video lessons & track progress</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {enrollments.length} Active {enrollments.length === 1 ? "Course" : "Courses"}
          </span>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No courses enrolled yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Explore our comprehensive course catalog and enroll in your first masterclass for free!
            </p>
            <button
              onClick={onExploreCourses}
              className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => {
              if (!enr.course) return null;
              return (
                <CourseCard
                  key={enr.id}
                  course={enr.course}
                  isEnrolled={true}
                  enrollment={enr}
                  onOpenPlayer={() => onOpenPlayer(enr.course, enr)}
                  onViewDetails={() => onOpenPlayer(enr.course, enr)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
