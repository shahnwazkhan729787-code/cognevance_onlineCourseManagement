"use client";
import React from "react";
import { X, Clock, BookOpen, Star, CheckCircle2, Award, User, ArrowRight } from "lucide-react";

export default function CourseDetailsModal({
  course,
  isEnrolled,
  enrollment,
  onClose,
  onEnroll,
  onOpenPlayer
}) {
  if (!course) return null;

  const lessons = course.lessons || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Banner with Thumbnail */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-600/90 text-white text-xs font-semibold backdrop-blur-md">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/90 text-slate-200 text-xs font-semibold border border-slate-700">
                {course.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Scrollable details body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
              <p className="text-sm font-bold text-white mt-0.5">{course.duration}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Modules</span>
              <p className="text-sm font-bold text-white mt-0.5">{lessons.length} Lessons</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rating</span>
              <p className="text-sm font-bold text-amber-400 mt-0.5">★ {course.rating}</p>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              About This Course
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Instructor Bio */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-4">
            <img
              src={course.instructor?.avatar}
              alt={course.instructor?.name}
              className="w-12 h-12 rounded-full object-cover border border-indigo-500/30"
            />
            <div>
              <h5 className="text-sm font-bold text-white">{course.instructor?.name}</h5>
              <p className="text-xs text-indigo-400 font-medium">{course.instructor?.title}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Senior industry practitioner with deep specialization in production architectures.
              </p>
            </div>
          </div>

          {/* Detailed Syllabus List */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Curriculum Syllabus ({lessons.length} Modules)
            </h4>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 w-6 h-6 rounded-md flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lesson.summary}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 ml-3">
                    <Clock className="w-3 h-3 text-indigo-400" /> {lesson.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</span>
            <p className="text-xl font-extrabold text-white">
              {course.price === 0 ? <span className="text-emerald-400">Free Enrollment</span> : `$${course.price}`}
            </p>
          </div>

          {isEnrolled ? (
            <button
              onClick={() => {
                onClose();
                onOpenPlayer(course, enrollment);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <span>Resume Learning ({enrollment?.progress || 0}%)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onEnroll(course.id);
              }}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <span>Enroll Now & Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
