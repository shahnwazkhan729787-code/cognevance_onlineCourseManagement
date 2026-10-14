"use client";
import React from "react";
import { Star, Clock, BookOpen, Users, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react";

export default function CourseCard({
  course,
  isEnrolled,
  enrollment,
  onEnroll,
  onOpenPlayer,
  onViewDetails
}) {
  const progress = enrollment?.progress || 0;

  const levelColor = {
    Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {course.category}
          </span>
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg backdrop-blur-md border ${levelColor[course.level] || levelColor.Beginner}`}>
            {course.level}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/90 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-400/20">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{course.rating}</span>
          <span className="text-slate-400 font-normal">({course.enrolledCount} enrolled)</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2.5">
          <img
            src={course.instructor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={course.instructor?.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-700"
          />
          <div className="text-xs">
            <p className="font-medium text-slate-300">{course.instructor?.name}</p>
            <p className="text-[10px] text-slate-500">{course.instructor?.title}</p>
          </div>
        </div>

        {/* Specs: Duration, Lessons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{course.lessons?.length || 0} Lessons</span>
          </div>
          <div className="font-bold text-white text-sm">
            {course.price === 0 ? (
              <span className="text-emerald-400">Free</span>
            ) : (
              `$${course.price}`
            )}
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-400">Course Progress</span>
              <span className={progress === 100 ? "text-emerald-400 font-bold" : "text-indigo-400"}>
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progress === 100
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-indigo-500 to-cyan-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 pt-2">
          {isEnrolled ? (
            <button
              onClick={() => onOpenPlayer(course, enrollment)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{progress === 100 ? "Review Course" : "Continue Learning"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails(course)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                View Syllabus
              </button>
              <button
                onClick={() => onEnroll(course.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1 transition-all"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
